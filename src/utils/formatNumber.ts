export const formatCurrency = (value?: number) => {
  if (!value && value !== 0) return "0,00";

  return value
    .toLocaleString("pt-PT", {
      style: "currency",
      currency: "MZN",
      minimumFractionDigits: 2,
    })
    // substitui apenas espaços entre números (não antes da moeda)
    .replace(/(?<=\d)\s(?=\d)/g, "."); 
};
