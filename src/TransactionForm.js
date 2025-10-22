import React, { useState } from "react";

const categories = [
  "Salário",
  "Freelance",
  "Alimentação",
  "Transporte",
  "Lazer",
  "Saúde",
  "Outros"
];

export default function TransactionForm({ onAdd }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  function handleSubmit(e) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!desc || isNaN(value) || value <= 0) {
      alert("Preencha descrição e valor positivo.");
      return;
    }
    const signed = type === "expense" ? -Math.abs(value) : Math.abs(value);
    const tx = {
      description: desc,
      amount: signed,
      category,
      date: new Date(date).toISOString(),
    };
    onAdd(tx);
    setDesc("");
    setAmount("");
    setType("income");
    setCategory(categories[0]);
  }

  return (
    <div className="card">
      <h2>Nova transação</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <label>
            Tipo
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
          </label>

          <label>
            Valor
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </label>
        </div>

        <label>
          Descrição
          <input
            type="text"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Ex: Supermercado"
          />
        </label>

        <label>
          Categoria
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>
          Data
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </label>

        <button type="submit">Adicionar</button>
      </form>
    </div>
  );
}
