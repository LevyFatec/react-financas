import { useCallback, useEffect, useRef, useState } from "react";

export default function useIndexedDB(dbName, version = 1, storeName = "items") {
  const dbRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const openReq = indexedDB.open(dbName, version);

    openReq.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
        store.createIndex("date", "date", { unique: false });
      }
    };

    openReq.onsuccess = () => {
      dbRef.current = openReq.result;
      if (mounted) setReady(true);
      dbRef.current.onversionchange = () => dbRef.current.close();
    };

    openReq.onerror = () => {
      console.error("IndexedDB error:", openReq.error);
    };

    return () => {
      mounted = false;
      if (dbRef.current) dbRef.current.close();
    };
  }, [dbName, storeName, version]);

  const _withStore = useCallback((mode, fn) => {
    return new Promise((resolve, reject) => {
      if (!dbRef.current) {
        reject(new Error("DB not ready"));
        return;
      }
      const tx = dbRef.current.transaction([storeName], mode);
      const store = tx.objectStore(storeName);
      const req = fn(store);
      tx.oncomplete = () => resolve(req ? req.result : undefined);
      tx.onabort = tx.onerror = () => reject(tx.error || new Error("Transaction error"));
    });
  }, [storeName]);

  const addItem = useCallback(item => {
    return _withStore("readwrite", store => store.add(item));
  }, [_withStore]);

  const getAll = useCallback(() => {
    return _withStore("readonly", store => store.getAll());
  }, [_withStore]);

  const deleteItem = useCallback(id => {
    return _withStore("readwrite", store => store.delete(Number(id)));
  }, [_withStore]);

  const updateItem = useCallback((id, data) => {
    return _withStore("readwrite", store => {
      const req = store.get(Number(id));
      req.onsuccess = () => {
        const existing = req.result;
        if (!existing) return;
        const merged = { ...existing, ...data };
        store.put(merged);
      };
      return req;
    });
  }, [_withStore]);

  return { ready, addItem, getAll, deleteItem, updateItem };
}
