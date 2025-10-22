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
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!ready) return;
    async function load() {
      const all = await getAll();
      // sort desc by date
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
    setEditing(null);
  }

  const filtered = transactions.filter(t => {
    if (filter === "all") return true;
    if (filter === "income") return t.amount > 0;
    if (filter === "expense") return t.amount < 0;
    return true;
  });

  const totalBalance = transactions.reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="container">
      <h1>Controlador de Finanças</h1>
      <div className="top-row">
        <Summary transactions={transactions} />
        <div className="controls">
          <label>
            Filtrar:
            <select value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">Todos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </label>
          <div className="balance">Saldo: <strong>{formatCurrency(totalBalance)}</strong></div>
        </div>
      </div>

      <div className="main-grid">
        <div className="left">
          <TransactionForm
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            editing={editing}
            cancelEdit={() => setEditing(null)}
          />
        </div>

        <div className="right">
          <TransactionList
            transactions={filtered}
            onDelete={handleDelete}
            onEdit={tx => setEditing(tx)}
          />
        </div>
      </div>

      <footer className="foot">
        Dados armazenados localmente no seu navegador (IndexedDB). Não há sincronização.
      </footer>
    </div>
  );
}
