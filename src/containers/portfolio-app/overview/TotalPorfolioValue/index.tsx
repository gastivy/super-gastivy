import type React from "react";

import Conditional from "@components/base/Conditional";
import Spinner from "@components/base/Spinner";
import { formatter } from "@libs/formatter";

interface TotalPortfolioValueProps {
  isLoading: boolean;
  grandTotal: number;
  currency: "usd" | "idr";
  cryptoTotal: number;
  cashTotal: number;
  stockTotal: number;
}

const TotalPortfolioValue: React.FC<TotalPortfolioValueProps> = ({
  isLoading,
  grandTotal,
  cryptoTotal,
  currency,
  stockTotal,
  cashTotal,
}) => {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="text-xs text-gray-500 mb-1">Total Portfolio Value</div>
      <Conditional if={isLoading}>
        <Spinner className="w-5 h-5" />
      </Conditional>
      <Conditional if={!isLoading}>
        <div className="text-2xl font-bold text-slate-700">
          {formatter.currency(grandTotal, { currency })}
        </div>
        <div className="flex gap-4 mt-2 text-xs text-gray-400">
          <span>Crypto: {formatter.currency(cryptoTotal, { currency })}</span>
          <span>Stocks: {formatter.currency(stockTotal, { currency })}</span>
          <span>Cash: {formatter.currency(cashTotal, { currency })}</span>
        </div>
      </Conditional>
    </div>
  );
};

export default TotalPortfolioValue;
