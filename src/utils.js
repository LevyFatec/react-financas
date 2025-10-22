export function formatCurrency(num) {
  return Number(num || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function groupByMonth(transactions) {
  const grouped = {};
  for (const tx of transactions) {
    const d = new Date(tx.date);
    const monthName = d.toLocaleString("pt-BR", {
      month: "long",
      year: "numeric",
    });
    if (!grouped[monthName]) grouped[monthName] = [];
    grouped[monthName].push(tx);
  }
  return grouped;
}
