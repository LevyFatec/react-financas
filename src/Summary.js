import React from "react";
import { formatCurrency } from "./utils";

export default function Summary({ transactions = [] }) {
  const income = transactions.filter(t => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Number(t.amount), 0);
  const balance = income + expense;

  // top categories (by absolute amount)
  const byCat = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});
  const topCats = Object.entries(byCat)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 3);

  return (
    <div className="summary card">
      <h3>Resumo</h3>
      <div className="summary-row">
        <div>
          <div className="label">Receitas</div>
          <div className="value pos">{formatCurrency(income)}</div>
        </div>
        <div>
          <div className="label">Despesas</div>
          <div className="value neg">{formatCurrency(expense)}</div>
        </div>
        <div>
          <div className="label">Saldo</div>
          <div className="value">{formatCurrency(balance)}</div>
        </div>
      </div>

      <div className="top-cats">
        <div className="label">Top categorias</div>
        <ul>
          {topCats.length === 0 && <li>Sem transações.</li>}
          {topCats.map(([cat, val]) => (
            <li key={cat}>
              {cat} — <strong>{formatCurrency(val)}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
