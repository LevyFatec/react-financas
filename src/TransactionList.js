import React from "react";
import { formatCurrency, formatDate, groupByMonth } from "./utils";

export default function TransactionList({ transactions, onDelete }) {
  if (!transactions.length) {
    return (
      <div className="card">
        <h2>Transações</h2>
        <p>Nenhuma transação registrada.</p>
      </div>
    );
  }

  const grouped = groupByMonth(transactions);

  return (
    <div className="card">
      <h2>Transações</h2>
      {Object.keys(grouped).map(month => (
        <div key={month} className="month-group">
          <h3>{month}</h3>
          <table className="tx-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {grouped[month].map(tx => (
                <tr key={tx.id}>
                  <td>{formatDate(tx.date)}</td>
                  <td>{tx.description}</td>
                  <td>{tx.category}</td>
                  <td className={tx.amount < 0 ? "neg" : "pos"}>
                    {formatCurrency(tx.amount)}
                  </td>
                  <td>
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
      ))}
    </div>
  );
}
