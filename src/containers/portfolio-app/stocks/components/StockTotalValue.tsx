import Conditional from "@components/base/Conditional";
import { formatter } from "@libs/formatter";

import type { StockTotalValueProps } from "./types";

const StockTotalValue = ({
  totalValue,
  currency,
  isLoadingPrices,
  hasItems,
}: StockTotalValueProps) => {
  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="text-sm text-gray-500 mb-1">Total Stock Value</div>
      <Conditional if={isLoadingPrices && hasItems}>
        <div className="h-8 w-48 animate-pulse bg-gray-200 rounded" />
      </Conditional>
      <Conditional if={!isLoadingPrices || !hasItems}>
        <div className="text-2xl font-bold text-slate-700">
          {formatter.currency(totalValue, { currency })}
        </div>
      </Conditional>
    </div>
  );
};

export default StockTotalValue;
