import type React from "react";
import { useMemo } from "react";

import { IconArrowNarrowRight, IconStack2Filled } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import { routes } from "@constants/routes";
import { formatter } from "@libs/formatter";
import type {
  StockItem,
  StockQuote,
} from "@modules/portfolio/models/stockTypes";

interface StockSummaryItem {
  symbol: string;
  name: string;
  value: number;
  change: number;
}

interface StocksSummaryProps {
  stockItems: StockItem[];
  stockPriceMap?: Map<string, StockQuote>;
  currency: "usd" | "idr";
  usdToIdr: number;
}

const StocksSummary: React.FC<StocksSummaryProps> = ({
  currency,
  stockItems,
  stockPriceMap,
  usdToIdr,
}) => {
  const navigate = useNavigate();
  const MAX_TOTAL_STOCKS = 10;

  const convertPrice = (nativePrice: number, symbol: string): number => {
    const isIdx = symbol.endsWith(".JK");
    if (currency === "idr") {
      return isIdx ? nativePrice : nativePrice * usdToIdr;
    }
    return isIdx ? nativePrice / usdToIdr : nativePrice;
  };

  const stockTotal = useMemo(() => {
    return stockItems.reduce((sum, item) => {
      const priceData = stockPriceMap?.get(item.symbol);
      const nativePrice = priceData?.regularMarketPrice || 0;
      const price = convertPrice(nativePrice, item.symbol);
      return sum + item.shares * price;
    }, 0);
  }, [stockItems, stockPriceMap, currency, usdToIdr]);

  const topStocks: StockSummaryItem[] = useMemo(() => {
    return stockItems
      .map((item) => {
        const priceData = stockPriceMap?.get(item.symbol);
        const nativePrice = priceData?.regularMarketPrice || 0;
        const price = convertPrice(nativePrice, item.symbol);
        return {
          symbol: item.symbol,
          name: item.name,
          value: item.shares * price,
          change: priceData?.regularMarketChangePercent || 0,
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, MAX_TOTAL_STOCKS);
  }, [stockItems, stockPriceMap, currency, usdToIdr]);

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <IconStack2Filled size={18} className="text-blue-500" />
          <span className="text-md font-semibold text-slate-700">Stocks</span>
        </div>
        <button
          onClick={() => navigate({ to: routes.portfolio.stocks.path })}
          className="text-xs text-gray-400 hover:text-slate-700 cursor-pointer transition-colors flex items-center gap-1"
        >
          View All
          <IconArrowNarrowRight stroke={2} size={12} />
        </button>
      </div>

      <Conditional if={stockItems.length === 0}>
        <div className="p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">No stock holdings yet</p>
          <button
            onClick={() => navigate({ to: routes.portfolio.stocks.path })}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium cursor-pointer"
          >
            + Add Stocks
          </button>
        </div>
      </Conditional>

      <Conditional if={stockItems.length > 0}>
        <div className="p-6 pt-4">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-xs text-gray-500">Total Value</div>
              <div className="text-xl font-bold text-slate-700">
                {formatter.currency(stockTotal, { currency })}
              </div>
            </div>
            <span className="text-xs text-gray-400">
              {stockItems.length} stock
              {stockItems.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center text-[10px] text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-50">
              <span className="flex-1">Symbol</span>
              <span className="w-24 text-right">Value</span>
              <span className="w-16 text-right">Change</span>
            </div>
            <Each
              of={topStocks}
              render={(item, index) => (
                <div className="flex items-center py-1.5" key={index}>
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-5 h-5 rounded-full bg-blue-400/30 flex items-center justify-center text-[9px] font-bold text-slate-700">
                      {item.symbol.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-700">
                        {item.symbol}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {item.name}
                      </span>
                    </div>
                  </div>
                  <span className="w-24 text-right text-xs font-medium text-slate-700">
                    {formatter.currency(item.value, { currency })}
                  </span>
                  <span
                    className={`w-16 text-right text-xs font-medium ${
                      item.change >= 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {item.change >= 0 ? "+" : ""}
                    {item.change.toFixed(2)}%
                  </span>
                </div>
              )}
            />
            <Conditional if={stockItems.length > MAX_TOTAL_STOCKS}>
              <div className="text-center text-xs text-gray-400 pt-1">
                +{stockItems.length - MAX_TOTAL_STOCKS} more stock
                {stockItems.length - MAX_TOTAL_STOCKS > 1 ? "s" : ""}
              </div>
            </Conditional>
          </div>
        </div>
      </Conditional>
    </div>
  );
};

export default StocksSummary;
