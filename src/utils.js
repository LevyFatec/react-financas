export function formatCurrency(num) {
  const n = Number(num) || 0;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR");
}

// sanitize numeric input: allow comma or dot, convert to standard numeric string
export function formatCurrencyInput(raw) {
  if (raw === null || raw === undefined) return "";
  // remove anything except digits, -, comma, dot
  const cleaned = String(raw).replace(/[^\d\-,.]/g, "");
  // support comma as decimal separator, so transform last comma to dot
  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");
  let normalized = cleaned;
  if (lastComma > lastDot) {
    normalized = cleaned.replace(/\./g, ""); // remove thousands dots
    normalized = normalized.replace(",", ".");
  } else {
    // remove commas as thousands separator
    normalized = cleaned.replace(/,/g, "");
  }
  return normalized;
}
