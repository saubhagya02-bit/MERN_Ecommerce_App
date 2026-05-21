export const formatPrice = (amount) => {
  const n = Number(amount);
  if (isNaN(n)) return "$—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

export const truncate = (text, length = 50) => {
  if (!text) return "";
  return text.length > length ? `${text.substring(0, length)}…` : text;
};

export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return "—";
  const defaults = { year: "numeric", month: "short", day: "numeric" };
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      ...defaults,
      ...options,
    });
  } catch {
    return dateStr;
  }
};
