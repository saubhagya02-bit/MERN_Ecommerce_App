export const formatPrice = (amount) =>
  Number(amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

export const truncate = (text, length = 50) =>
  text?.length > length ? `${text.substring(0, length)}...` : text;
