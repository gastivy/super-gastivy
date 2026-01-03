export const formatter = {
  currency(val?: string | number, fallback = "Rp 0") {
    if (!val) return fallback;

    const parsedValue = parseInt(String(val || 0));
    if (parsedValue > 0) {
      const format = new Intl.NumberFormat(["id"]).format(parsedValue || 0);
      return `Rp ${format}`;
    }

    const format = new Intl.NumberFormat(["id"]).format(
      (parsedValue || 0) * -1
    );
    return `- Rp ${format}`;
  },
};
