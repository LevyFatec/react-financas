import React, { useEffect, useState } from "react";
import { formatCurrencyInput } from "./utils";

const defaultCategories = [
  "Salário",
  "Freelance",
  "Alimentação",
  "Transporte",
  "Lazer",
  "Saúde",
  "Outros"
];

export default function TransactionForm({ onAdd, editing, onUpdate, cancelEdit }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(defaultCategories[0]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");

  useEffect(() => {
    if (editing) {
      setDesc(editing.description || "");
      setAmount(String(editing.amount || ""));
      setCategory(editing.category || defaultCategories[0]);
      setDate(editing.date ? editing.date.slice(0, 10) : new Date().toISOString().slice(0, 10));
      setNote(editing.note || "");
    } else {
      reset();
    }
  }, [editing]);

  function reset() {
    setDesc("");
    setAmount("");
    setCategory(defaultCategories[0]);
    setDate(new Date().toISOString().slice(0, 10));
    setNote("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const numeric = Number(amount);
    if (!desc.trim() || Number.isNaN(numeric) || numeric === 0) {
      alert("Preencha descrição e um valor diferente de zero.");
      return;
    }
    const tx = {
      description: desc.trim(),
      amount: numeric,
      category,
      date: new Date(date).toISOString(),
      note: note.trim()
    };
    if (editing && editing.id != null) {
      onUpdate(editing.id, tx);
    } else {
      onAdd(tx);
      reset();
    }
  }

  function handleAmountChange(e) {
    const v = e.target.value;
    // allow numbers, dot and comma
    setAmount(formatCurrencyInput(v));
  }

  return (
    <div className="card">
      <h2>{editing ? "Editar transação" : "Nova transação"}</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Descrição
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Ex: Conta de luz" />
        </label>

        <label>
          Valor (use negativo para despesa ou use -)
          <input value={amount} onChange={handleAmountChange} placeholder="Ex: -120.50 ou 1500" />
        </label>

        <label>
          Categoria
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {defaultCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label>
          Data
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>

        <label>
          Nota (opcional)
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Mais detalhes..." />
        </label>

        <div className="form-actions">
          <button type="submit">{editing ? "Salvar" : "Adicionar"}</button>
          {editing ? (
            <button type="button" className="muted" onClick={cancelEdit}>Cancelar</button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
