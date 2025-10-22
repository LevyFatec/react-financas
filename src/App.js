import React, { useEffect, useState } from "react";
import useIndexedDB from "./useIndexedDB";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import Summary from "./Summary";
import { formatCurrency } from "./utils";

const DB_NAME = "finance-db";
const STORE = "transactions";

export default function App() {
  const { ready, getAll, addItem, deleteItem, updateItem } = useIndexedDB(DB_NAME, 1, STORE);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!ready) return;
    async function load() {
      const all = await getAll();
      all.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(all);
    }
    load();
  }, [ready, getAll]);

  async function handleAdd(tx) {
    const id = await addItem(tx);
    setTransactions(prev => [{ ...tx, id }, ...prev]);
  }

  async function handleDelete(id) {
    await deleteItem(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  async function handleUpdate(id, updated) {
    await updateItem(id, updated);
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
  }

  const totalBalance = transactions.reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="container">
      <h1>💰 Controle de Finanças</h1>

      {/* 1️⃣ Resumo geral */}
      <Summary transactions={transactions} />

      {/* 2️⃣ Formulário */}
      <TransactionForm onAdd={handleAdd} />

      {/* 3️⃣ Lista agrupada */}
      <TransactionList
        transactions={transactions}
        onDelete={handleDelete}
        onEdit={handleUpdate}
      />

      <footer className="foot">
        Dados armazenados localmente no navegador (IndexedDB).
      </footer>
    </div>
  );
}
