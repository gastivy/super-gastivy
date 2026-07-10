import { useMemo } from "react";

import { IconX } from "@tabler/icons-react";

import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import Modal from "@components/base/Modal";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/base/Tabs";
import { formatter } from "@libs/formatter";
import type {
  CurrencyCode,
  PriceMapEntry,
} from "@modules/portfolio/hooks/useCryptoPrices";
import type { CashPortfolioItem } from "@modules/portfolio/models/cashTypes";
import type { GoldItem } from "@modules/portfolio/models/goldTypes";
import type {
  StockItem,
  StockQuote,
} from "@modules/portfolio/models/stockTypes";
import type { PortfolioItem } from "@modules/portfolio/models/types";

type AssetCategory = "crypto" | "stocks" | "gold" | "cash";

interface AllocationRow {
  id: string;
  name: string;
  value: number;
  category: AssetCategory;
}

interface AllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  grandTotal: number;
  cryptoTotal: number;
  stockTotal: number;
  goldTotal: number;
  cashTotal: number;
  cryptoItems: PortfolioItem[];
  stockItems: StockItem[];
  goldItems: GoldItem[];
  cashItems: CashPortfolioItem[];
  cryptoPriceMap?: Map<string, PriceMapEntry>;
  stockQuoteMap?: Map<string, StockQuote>;
  usdToIdr: number;
  pricePerGramIdr: number;
}

const CATEGORY_COLORS: Record<AssetCategory, string> = {
  crypto: "bg-orange-400",
  stocks: "bg-blue-400",
  gold: "bg-yellow-400",
  cash: "bg-green-400",
};

const AllocationModal: React.FC<AllocationModalProps> = ({
  isOpen,
  onClose,
  currency,
  grandTotal,
  cryptoTotal,
  stockTotal,
  goldTotal,
  cashTotal,
  cryptoItems,
  stockItems,
  goldItems,
  cashItems,
  cryptoPriceMap,
  stockQuoteMap,
  usdToIdr,
  pricePerGramIdr,
}) => {
  const convertFromIdr = (idrValue: number) => {
    if (currency === "idr") return idrValue;
    return idrValue / usdToIdr;
  };

  const convertStockPrice = (nativePrice: number, symbol: string) => {
    const isIdx = symbol.endsWith(".JK");
    if (currency === "idr") {
      return isIdx ? nativePrice : nativePrice * usdToIdr;
    }
    return isIdx ? nativePrice / usdToIdr : nativePrice;
  };

  const cryptoRows: AllocationRow[] = useMemo(() => {
    const merged: Record<string, PortfolioItem & { value: number }> = {};

    cryptoItems.forEach((item) => {
      const price = cryptoPriceMap?.get(item.coinId)?.currentPrice || 0;
      const value = item.amount * price;

      if (merged[item.coinId]) {
        merged[item.coinId].amount += item.amount;
        merged[item.coinId].value += value;
      } else {
        merged[item.coinId] = { ...item, value };
      }
    });

    return Object.values(merged)
      .map((item) => ({
        id: item.coinId,
        name: item.name || item.symbol,
        value: item.value,
        category: "crypto" as const,
      }))
      .sort((a, b) => b.value - a.value);
  }, [cryptoItems, cryptoPriceMap]);

  const stockRows: AllocationRow[] = useMemo(() => {
    return stockItems
      .map((item) => {
        const quote = stockQuoteMap?.get(item.symbol);
        const nativePrice = quote?.regularMarketPrice || 0;
        const price = convertStockPrice(nativePrice, item.symbol);
        return {
          id: item.symbol,
          name: item.name || item.symbol,
          value: item.shares * price,
          category: "stocks" as const,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [stockItems, stockQuoteMap, currency, usdToIdr]);

  const goldRows: AllocationRow[] = useMemo(() => {
    return goldItems
      .map((item) => ({
        id: String(item.id ?? item.name),
        name: item.name,
        value: convertFromIdr(item.grams * pricePerGramIdr),
        category: "gold" as const,
      }))
      .sort((a, b) => b.value - a.value);
  }, [goldItems, pricePerGramIdr, currency, usdToIdr]);

  const cashRows: AllocationRow[] = useMemo(() => {
    return cashItems
      .map((item) => ({
        id: String(item.id ?? item.name),
        name: item.name || "Unknown",
        value: convertFromIdr(item.value || 0),
        category: "cash" as const,
      }))
      .sort((a, b) => b.value - a.value);
  }, [cashItems, currency, usdToIdr]);

  const allRows: AllocationRow[] = useMemo(
    () =>
      [...cryptoRows, ...stockRows, ...goldRows, ...cashRows].sort(
        (a, b) => b.value - a.value
      ),
    [cryptoRows, stockRows, goldRows, cashRows]
  );

  const renderRows = (rows: AllocationRow[], denominator: number) => {
    if (rows.length === 0) {
      return (
        <div className="py-8 text-center text-sm text-gray-400">
          No assets in this category
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        <Each
          of={rows}
          render={(row, index) => {
            const pct = denominator > 0 ? (row.value / denominator) * 100 : 0;

            return (
              <div
                className="flex flex-col gap-1"
                key={`${row.category}-${row.id}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-700/5 flex items-center justify-center text-[10px] font-semibold text-slate-500">
                      {index + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-700 truncate">
                      {row.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">
                      {formatter.currency(row.value, { currency })}
                    </span>
                    <span className="text-xs font-medium text-slate-700 w-12 text-right">
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${CATEGORY_COLORS[row.category]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          }}
        />
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-xl max-w-[90vw] max-h-[80vh] flex flex-col"
    >
      <div className="flex items-center justify-between p-5 pb-3 border-b border-gray-100">
        <span className="text-md font-semibold text-slate-700">
          Allocation Detail
        </span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-slate-700 cursor-pointer transition-colors"
          aria-label="Close"
        >
          <IconX size={18} />
        </button>
      </div>

      <Tabs
        defaultValue="all"
        className="flex flex-col gap-4 p-5 overflow-y-auto"
      >
        <TabsList className="w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="gold">Gold</TabsTrigger>
          <TabsTrigger value="cash">Cash</TabsTrigger>
        </TabsList>

        <TabsContent value="all">{renderRows(allRows, grandTotal)}</TabsContent>

        <TabsContent value="crypto">
          <Conditional if={cryptoItems.length === 0}>
            <div className="py-8 text-center text-sm text-gray-400">
              No crypto holdings
            </div>
          </Conditional>
          <Conditional if={cryptoItems.length > 0}>
            {renderRows(cryptoRows, cryptoTotal)}
          </Conditional>
        </TabsContent>

        <TabsContent value="stocks">
          <Conditional if={stockItems.length === 0}>
            <div className="py-8 text-center text-sm text-gray-400">
              No stock holdings
            </div>
          </Conditional>
          <Conditional if={stockItems.length > 0}>
            {renderRows(stockRows, stockTotal)}
          </Conditional>
        </TabsContent>

        <TabsContent value="gold">
          <Conditional if={goldItems.length === 0}>
            <div className="py-8 text-center text-sm text-gray-400">
              No gold holdings
            </div>
          </Conditional>
          <Conditional if={goldItems.length > 0}>
            {renderRows(goldRows, goldTotal)}
          </Conditional>
        </TabsContent>

        <TabsContent value="cash">
          <Conditional if={cashItems.length === 0}>
            <div className="py-8 text-center text-sm text-gray-400">
              No cash entries
            </div>
          </Conditional>
          <Conditional if={cashItems.length > 0}>
            {renderRows(cashRows, cashTotal)}
          </Conditional>
        </TabsContent>
      </Tabs>
    </Modal>
  );
};

export default AllocationModal;
