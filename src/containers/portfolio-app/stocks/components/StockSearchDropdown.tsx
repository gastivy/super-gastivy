import Each from "@components/base/Each";
import Spinner from "@components/base/Spinner";
import { useStockSearch } from "@modules/portfolio/hooks/useStockPrices";

import type { StockSearchDropdownProps } from "./types";

const StockSearchDropdown = ({ query, onSelect }: StockSearchDropdownProps) => {
  const { data: searchResults = [], isLoading: isSearching } =
    useStockSearch(query);

  if (isSearching) {
    return (
      <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center justify-center">
        <Spinner className="w-4 h-4" />
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-sm text-gray-400">
        No stocks found
      </div>
    );
  }

  return (
    <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      <Each
        of={searchResults}
        render={(stock) => (
          <div
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelect(stock)}
          >
            <div className="w-6 h-6 rounded-full bg-brand-400/30 flex items-center justify-center text-[10px] font-bold text-slate-700">
              {stock.symbol.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-700">
                {stock.symbol}
              </span>
              <span className="text-xs text-gray-500">{stock.shortName}</span>
            </div>
            <span className="ml-auto text-xs text-gray-400">
              {stock.exchange}
            </span>
          </div>
        )}
      />
    </div>
  );
};

export default StockSearchDropdown;
