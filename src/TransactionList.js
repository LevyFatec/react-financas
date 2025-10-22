import React from "react";
import { formatCurrency, formatDate } from "./utils";

export default function TransactionList({ transactions, onDelete, onEdit }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="card">
        <h2>Transações</h2>
        <p>Nenhuma transação ainda.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Transações ({transactions.length})</h2>
      <table className="tx-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Valor</th>
            <th>Nota</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td>{formatDate(tx.date)}</td>
              <td>{tx.description}</td>
              <td>{tx.category}</td>
              <td className={tx.amount < 0 ? "neg" : "pos"}>
                {formatCurrency(tx.amount)}
              </td>
              <td>{tx.note}</td>
              <td className="actions">
                <button onClick={() => onEdit(tx)}>Editar</button>
                <button
                  className="danger"
                  onClick={() => {
                    if (window.confirm("Excluir transação?")) {
                      onDelete(tx.id);
                    }
                  }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
