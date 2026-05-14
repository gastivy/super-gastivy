type CurrencyCode = "idr" | "usd";

interface CurrencyFormatOptions {
  currency?: CurrencyCode;
  fallback?: string;
}

const formatIdr = (value: number): string => {
  if (value >= 0) {
    const format = new Intl.NumberFormat(["id"]).format(value);
    return `Rp ${format}`;
  }
  const format = new Intl.NumberFormat(["id"]).format(value * -1);
  return `- Rp ${format}`;
};

const formatUsd = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const defaultFallbacks: Record<CurrencyCode, string> = {
  idr: "Rp 0",
  usd: "$0.00",
};

export const formatter = {
  currency(val?: string | number, options?: CurrencyFormatOptions) {
    const currency = options?.currency ?? "idr";
    const fallback = options?.fallback ?? defaultFallbacks[currency];

    if (!val) return fallback;

    const parsedValue = parseInt(String(val || 0));

    if (currency === "usd") {
      return formatUsd(parsedValue);
    }

    return formatIdr(parsedValue);
  },
};
