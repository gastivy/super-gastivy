interface ToggleCurrencyProps {
  currency: "usd" | "idr";
  onToggle: (currency: "usd" | "idr") => void;
}

const ToggleCurrency: React.FC<ToggleCurrencyProps> = ({
  currency,
  onToggle,
}) => {
  const handleToggleCurrency = () => {
    onToggle(currency === "usd" ? "idr" : "usd");
  };
  return (
    <button
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => handleToggleCurrency()}
    >
      <span
        className={
          currency === "usd" ? "text-slate-700 font-bold" : "text-gray-400"
        }
      >
        USD
      </span>
      <span className="text-gray-300">/</span>
      <span
        className={
          currency === "idr" ? "text-slate-700 font-bold" : "text-gray-400"
        }
      >
        IDR
      </span>
    </button>
  );
};

export default ToggleCurrency;
