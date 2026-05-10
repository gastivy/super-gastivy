import { useMemo, useState } from "react";

import {
  IconArrowNarrowRight,
  IconCoins,
  IconStack2Filled,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

import { Assets } from "@assets/illustrations";
import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import EmptyState from "@components/base/EmptyState";
import Spinner from "@components/base/Spinner";
import { routes } from "@constants/routes";
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
  const formatCurrency = (value: number) => {
    if (currency === "idr") {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Crypto calculations
  const cryptoPriceMap = cryptoPriceData?.[currency];

  const cryptoTotal = cryptoItems.reduce((sum, item) => {
    const price = cryptoPriceMap?.get(item.coinId)?.currentPrice || 0;
    return sum + item.amount * price;
  }, 0);

  const cryptoTotalChange = useMemo(() => {
    if (cryptoItems.length === 0) return 0;
    const totalPrev = cryptoItems.reduce((sum, item) => {
      const entry = cryptoPriceMap?.get(item.coinId);
      const price = entry?.currentPrice || 0;
      const change = entry?.priceChange24h || 0;
      const prevPrice = change !== 0 ? price / (1 + change / 100) : price;
      return sum + item.amount * prevPrice;
    }, 0);
    if (totalPrev === 0) return 0;
    return ((cryptoTotal - totalPrev) / totalPrev) * 100;
  }, [cryptoItems, cryptoPriceMap, cryptoTotal]);

  const topCryptos = useMemo(
    () =>
      [...cryptoItems]
        .map((item) => {
          const entry = cryptoPriceMap?.get(item.coinId);
          return {
            ...item,
            value: item.amount * (entry?.currentPrice || 0),
            change: entry?.priceChange24h || 0,
            image: entry?.image || "",
          };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
    [cryptoItems, cryptoPriceMap]
  );

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
  const hasPortfolio = cryptoItems.length > 0 || stockItems.length > 0;
  const grandTotal = cryptoTotal + stockTotal;

  return (
    <div className="flex flex-col gap-4 max-[960px]:gap-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-10 rounded-lg max-[960px]:shadow-xl shadow-shark-800/10">
        <div className="text-lg text-limed-spruce-700 font-medium">
          Portfolio Overview
        </div>
        <button
          onClick={() => setCurrency(currency === "usd" ? "idr" : "usd")}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <span
            className={
              currency === "usd"
                ? "text-limed-spruce-700 font-bold"
                : "text-gray-400"
            }
          >
            USD
          </span>
          <span className="text-gray-300">/</span>
          <span
            className={
              currency === "idr"
                ? "text-limed-spruce-700 font-bold"
                : "text-gray-400"
            }
          >
            IDR
          </span>
        </button>
      </div>

      {/* Loading */}
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
          {/* Grand Total */}
          <div className="bg-white p-6 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">
              Total Portfolio Value
            </div>
            <Conditional if={isLoading}>
              <div className="h-9 w-56 animate-pulse bg-gray-200 rounded" />
            </Conditional>
            <Conditional if={!isLoading}>
              <div className="text-2xl font-bold text-limed-spruce-700">
                {formatCurrency(grandTotal)}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span>Crypto: {formatCurrency(cryptoTotal)}</span>
                <span>•</span>
                <span>Stocks: {formatCurrency(stockTotal)}</span>
              </div>
            </Conditional>
          </div>

          {/* Allocation Bar */}
          <Conditional if={grandTotal > 0}>
            <div className="bg-white p-6 rounded-lg">
              <div className="text-sm text-gray-500 mb-3">Allocation</div>
              <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
                <Conditional if={cryptoTotal > 0}>
                  <div
                    className="bg-yellow-400 transition-all duration-500"
                    style={{
                      width: `${(cryptoTotal / grandTotal) * 100}%`,
                    }}
                  />
                </Conditional>
                <Conditional if={stockTotal > 0}>
                  <div
                    className="bg-blue-400 transition-all duration-500"
                    style={{
                      width: `${(stockTotal / grandTotal) * 100}%`,
                    }}
                  />
                </Conditional>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <Conditional if={cryptoItems.length > 0}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="text-xs text-gray-600">
                      Crypto {((cryptoTotal / grandTotal) * 100).toFixed(1)}%
                    </span>
                  </div>
                </Conditional>
                <Conditional if={stockItems.length > 0}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    <span className="text-xs text-gray-600">
                      Stocks {((stockTotal / grandTotal) * 100).toFixed(1)}%
                    </span>
                  </div>
                </Conditional>
              </div>
            </div>
          </Conditional>

          {/* Two-column summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Crypto Summary */}
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-6 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <IconCoins stroke={2} size={18} className="text-yellow-500" />
                  <span className="text-md font-semibold text-limed-spruce-700">
                    Crypto
                  </span>
                </div>
                <button
                  onClick={() => navigate({ to: routes.portfolio.crypto.path })}
                  className="text-xs text-gray-400 hover:text-limed-spruce-700 cursor-pointer transition-colors flex items-center gap-1"
                >
                  View All
                  <IconArrowNarrowRight stroke={2} size={12} />
                </button>
              </div>

              <Conditional if={cryptoItems.length === 0}>
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-400 mb-3">
                    No crypto holdings yet
                  </p>
                  <button
                    onClick={() =>
                      navigate({ to: routes.portfolio.crypto.path })
                    }
                    className="text-sm text-green-yellow-600 hover:text-green-yellow-700 font-medium cursor-pointer"
                  >
                    + Add Crypto
                  </button>
                </div>
              </Conditional>

              <Conditional if={cryptoItems.length > 0}>
                <div className="p-6 pt-4">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <div className="text-xs text-gray-500">Total Value</div>
                      <div className="text-xl font-bold text-limed-spruce-700">
                        {formatCurrency(cryptoTotal)}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-400">24h</span>
                      <span
                        className={`text-sm font-medium ${
                          cryptoTotalChange >= 0
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {cryptoTotalChange >= 0 ? "+" : ""}
                        {cryptoTotalChange.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center text-[10px] text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-50">
                      <span className="flex-1">Asset</span>
                      <span className="w-24 text-right">Value</span>
                      <span className="w-16 text-right">24h</span>
                    </div>
                    <Each
                      of={topCryptos}
                      render={(item) => (
                        <div className="flex items-center py-1.5">
                          <div className="flex items-center gap-2 flex-1">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.symbol}
                                className="w-5 h-5 rounded-full"
                              />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-yellow-400/30 flex items-center justify-center text-[9px] font-bold text-limed-spruce-700">
                                {item.symbol.charAt(0)}
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="text-xs font-medium text-limed-spruce-700">
                                {item.symbol}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {item.name}
                              </span>
                            </div>
                          </div>
                          <span className="w-24 text-right text-xs font-medium text-limed-spruce-700">
                            {formatCurrency(item.value)}
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
                    <Conditional if={cryptoItems.length > 5}>
                      <div className="text-center text-xs text-gray-400 pt-1">
                        +{cryptoItems.length - 5} more asset
                        {cryptoItems.length - 5 > 1 ? "s" : ""}
                      </div>
                    </Conditional>
                  </div>
                </div>
              </Conditional>
            </div>

            {/* Stocks Summary */}
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-6 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <IconStack2Filled size={18} className="text-blue-500" />
                  <span className="text-md font-semibold text-limed-spruce-700">
                    Stocks
                  </span>
                </div>
                <button
                  onClick={() => navigate({ to: routes.portfolio.stocks.path })}
                  className="text-xs text-gray-400 hover:text-limed-spruce-700 cursor-pointer transition-colors flex items-center gap-1"
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
                    className="text-sm text-green-yellow-600 hover:text-green-yellow-700 font-medium cursor-pointer"
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
                      <div className="text-xl font-bold text-limed-spruce-700">
                        {formatCurrency(stockTotal)}
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
                            <div className="w-5 h-5 rounded-full bg-blue-400/30 flex items-center justify-center text-[9px] font-bold text-limed-spruce-700">
                              {item.symbol.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-medium text-limed-spruce-700">
                                {item.symbol}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {item.name}
                              </span>
                            </div>
                          </div>
                          <span className="w-24 text-right text-xs font-medium text-limed-spruce-700">
                            {formatCurrency(item.value)}
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
          </div>
        </div>
      </Conditional>
    </div>
  );
};

export default PortfolioOverviewContainer;
