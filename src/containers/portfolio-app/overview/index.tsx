import { useMemo, useState } from "react";

import { IconArrowNarrowRight, IconStack2Filled } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

import { Assets } from "@assets/illustrations";
import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import EmptyState from "@components/base/EmptyState";
import Spinner from "@components/base/Spinner";
import ToggleCurrency from "@components/base/ToogleCurrency";
import { routes } from "@constants/routes";
import { formatter } from "@libs/formatter";
import { useGetWallet } from "@modules/finance/wallet/hooks/useWallet";
import { useGetCashPortfolio } from "@modules/portfolio/hooks/useCashPortfolio";
import {
  type CurrencyCode,
  useCryptoPrices,
} from "@modules/portfolio/hooks/useCryptoPrices";
import { useGetPortfolio } from "@modules/portfolio/hooks/usePortfolio";
import { useGetStockPortfolio } from "@modules/portfolio/hooks/useStockPortfolio";
import {
  useExchangeRate,
  useStockPrices,
} from "@modules/portfolio/hooks/useStockPrices";

import Allocation from "./Allocation";
import CashSummary from "./CashSummary";
import CryptoSummary from "./CryptoSummary";

const PortfolioOverviewContainer = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<CurrencyCode>("usd");

  // Crypto data
  const { data: cryptoItems = [], isLoading: isLoadingCrypto } =
    useGetPortfolio();
  const { data: cryptoPriceData, isLoading: isLoadingCryptoPrices } =
    useCryptoPrices(cryptoItems);

  // Stocks data
  const { data: stockItems = [], isLoading: isLoadingStocks } =
    useGetStockPortfolio();
  const { data: stockQuoteMap, isLoading: isLoadingStockPrices } =
    useStockPrices(stockItems);
  const { data: exchangeRate } = useExchangeRate();
  const usdToIdr = exchangeRate?.usdToIdr || 1;

  // Currency formatting

  // Crypto calculations
  const cryptoPriceMap = cryptoPriceData?.[currency];

  const cryptoTotal = cryptoItems.reduce((sum, item) => {
    const price = cryptoPriceMap?.get(item.coinId)?.currentPrice || 0;
    return sum + item.amount * price;
  }, 0);

  // Cash data
  const { data: cashItems = [] } = useGetCashPortfolio();
  const { data: walletResponse } = useGetWallet();

  const walletMap = useMemo(() => {
    const map = new Map<string, { balance: number; name: string }>();
    if (walletResponse?.data) {
      walletResponse.data.forEach((w) => map.set(w.id, w));
    }
    return map;
  }, [walletResponse]);

  const cashTotalIdr = cashItems.reduce((sum, item) => {
    const wallet = walletMap.get(item.walletId);
    return sum + (wallet?.balance ?? 0);
  }, 0);

  const cashTotal = currency === "idr" ? cashTotalIdr : cashTotalIdr / usdToIdr;

  // Stock calculations — prices from Yahoo are in native currency
  const stockTotal = stockItems.reduce((sum, item) => {
    const quote = stockQuoteMap?.get(item.symbol);
    const nativePrice = quote?.regularMarketPrice || 0;
    const isIdx = item.symbol.endsWith(".JK");
    let price: number;
    if (currency === "idr") {
      price = isIdx ? nativePrice : nativePrice * usdToIdr;
    } else {
      price = isIdx ? nativePrice / usdToIdr : nativePrice;
    }
    return sum + item.shares * price;
  }, 0);

  const topStocks = useMemo(
    () =>
      [...stockItems]
        .map((item) => {
          const quote = stockQuoteMap?.get(item.symbol);
          const nativePrice = quote?.regularMarketPrice || 0;
          const isIdx = item.symbol.endsWith(".JK");
          let price: number;
          if (currency === "idr") {
            price = isIdx ? nativePrice : nativePrice * usdToIdr;
          } else {
            price = isIdx ? nativePrice / usdToIdr : nativePrice;
          }
          return {
            ...item,
            value: item.shares * price,
            change: quote?.regularMarketChangePercent || 0,
          };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
    [stockItems, stockQuoteMap, currency, usdToIdr]
  );

  const isLoading =
    isLoadingCrypto ||
    isLoadingCryptoPrices ||
    isLoadingStocks ||
    isLoadingStockPrices;
  const hasPortfolio =
    cryptoItems.length > 0 || stockItems.length > 0 || cashItems.length > 0;
  const grandTotal = cryptoTotal + stockTotal + cashTotal;

  return (
    <div className="flex flex-col gap-4 max-[960px]:gap-8">
      <div className="flex justify-between items-center bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-10 rounded-lg max-[960px]:shadow-xl shadow-zinc-800/10">
        <div className="text-lg text-slate-700 font-medium">
          Portfolio Overview
        </div>
        <ToggleCurrency
          currency={currency}
          onToggle={(val) => setCurrency(val)}
        />
      </div>

      <Conditional if={isLoading && !hasPortfolio}>
        <div className="flex items-center justify-center py-12">
          <Spinner className="w-8 h-8" />
        </div>
      </Conditional>

      {/* Empty State */}
      <Conditional if={!isLoading && !hasPortfolio}>
        <EmptyState
          src={Assets.ActivityEmpty}
          title="No portfolio yet"
          className="max-w-90 mx-auto"
          description="Add crypto or stocks to see your portfolio overview here."
        />
      </Conditional>

      <Conditional if={hasPortfolio}>
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-lg p-6">
            <div className="text-xs text-gray-500 mb-1">
              Total Portfolio Value
            </div>
            <Conditional if={isLoading}>
              <Spinner className="w-5 h-5" />
            </Conditional>
            <Conditional if={!isLoading}>
              <div className="text-2xl font-bold text-slate-700">
                {formatter.currency(grandTotal, { currency })}
              </div>
              <div className="flex gap-4 mt-2 text-xs text-gray-400">
                <span>
                  Crypto: {formatter.currency(cryptoTotal, { currency })}
                </span>
                <span>
                  Stocks: {formatter.currency(stockTotal, { currency })}
                </span>
                <span>Cash: {formatter.currency(cashTotal, { currency })}</span>
              </div>
            </Conditional>
          </div>

          <Conditional if={grandTotal > 0}>
            <Allocation
              cashItems={cashItems}
              cashTotal={cashTotal}
              cryptoItems={cryptoItems}
              grandTotal={grandTotal}
              cryptoTotal={cryptoTotal}
              stockItems={stockItems}
              stockTotal={stockTotal}
            />
          </Conditional>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CryptoSummary currency={currency} />

            <div className="bg-white rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-6 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <IconStack2Filled size={18} className="text-blue-500" />
                  <span className="text-md font-semibold text-slate-700">
                    Stocks
                  </span>
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
                  <p className="text-sm text-gray-400 mb-3">
                    No stock holdings yet
                  </p>
                  <button
                    onClick={() =>
                      navigate({ to: routes.portfolio.stocks.path })
                    }
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
                      render={(item) => (
                        <div className="flex items-center py-1.5">
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
                              item.change >= 0
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {item.change >= 0 ? "+" : ""}
                            {item.change.toFixed(2)}%
                          </span>
                        </div>
                      )}
                    />
                    <Conditional if={stockItems.length > 5}>
                      <div className="text-center text-xs text-gray-400 pt-1">
                        +{stockItems.length - 5} more stock
                        {stockItems.length - 5 > 1 ? "s" : ""}
                      </div>
                    </Conditional>
                  </div>
                </div>
              </Conditional>
            </div>

            <CashSummary currency={currency} usdToIdr={usdToIdr} />
          </div>
        </div>
      </Conditional>
    </div>
  );
};

export default PortfolioOverviewContainer;
