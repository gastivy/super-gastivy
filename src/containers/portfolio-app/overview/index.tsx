import { useState } from "react";

import { Assets } from "@assets/illustrations";
import Conditional from "@components/base/Conditional";
import EmptyState from "@components/base/EmptyState";
import Spinner from "@components/base/Spinner";
import ToggleCurrency from "@components/base/ToogleCurrency";
import { useGetCashPortfolio } from "@modules/portfolio/hooks/useCashPortfolio";
import {
  type CurrencyCode,
  useCryptoPrices,
} from "@modules/portfolio/hooks/useCryptoPrices";
import {
  useGetGoldPortfolio,
  useGoldPrice,
} from "@modules/portfolio/hooks/useGoldPortfolio";
import { useGetPortfolio } from "@modules/portfolio/hooks/usePortfolio";
import { useGetStockPortfolio } from "@modules/portfolio/hooks/useStockPortfolio";
import {
  useExchangeRate,
  useStockPrices,
} from "@modules/portfolio/hooks/useStockPrices";

import Allocation from "./Allocation";
import CashSummary from "./CashSummary";
import CryptoSummary from "./CryptoSummary";
import GoldSummary from "./GoldSummary";
import StocksSummary from "./StocksSummary";
import TotalPortfolioValue from "./TotalPorfolioValue";

const PortfolioOverviewContainer = () => {
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

  const cryptoPriceMap = cryptoPriceData?.[currency];

  const cryptoTotal = cryptoItems.reduce((sum, item) => {
    const price = cryptoPriceMap?.get(item.coinId)?.currentPrice || 0;
    return sum + item.amount * price;
  }, 0);

  // Gold data
  const { data: goldItems = [], isLoading: isLoadingGold } =
    useGetGoldPortfolio();
  const { data: goldPriceData, isLoading: isLoadingGoldPrice } = useGoldPrice();
  const pricePerGramIdr = goldPriceData?.midPrice || 0;

  const goldTotalIdr = goldItems.reduce((sum, item) => {
    return sum + item.grams * pricePerGramIdr;
  }, 0);
  const goldTotal = currency === "idr" ? goldTotalIdr : goldTotalIdr / usdToIdr;

  const { data: cashItems = [] } = useGetCashPortfolio();

  const cashTotalIdr = cashItems.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );

  const cashTotal = currency === "idr" ? cashTotalIdr : cashTotalIdr / usdToIdr;

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

  const isLoading =
    isLoadingCrypto ||
    isLoadingCryptoPrices ||
    isLoadingStocks ||
    isLoadingStockPrices ||
    isLoadingGold ||
    isLoadingGoldPrice;
  const hasPortfolio =
    cryptoItems.length > 0 ||
    stockItems.length > 0 ||
    cashItems.length > 0 ||
    goldItems.length > 0;
  const grandTotal = cryptoTotal + stockTotal + goldTotal + cashTotal;

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
          <TotalPortfolioValue
            currency={currency}
            cashTotal={cashTotal}
            cryptoTotal={cryptoTotal}
            goldTotal={goldTotal}
            grandTotal={grandTotal}
            isLoading={isLoading}
            stockTotal={stockTotal}
          />

          <Conditional if={grandTotal > 0}>
            <Allocation
              cashItems={cashItems}
              cashTotal={cashTotal}
              cryptoItems={cryptoItems}
              goldItems={goldItems}
              goldTotal={goldTotal}
              grandTotal={grandTotal}
              cryptoTotal={cryptoTotal}
              stockItems={stockItems}
              stockTotal={stockTotal}
            />
          </Conditional>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CryptoSummary currency={currency} />

            <StocksSummary
              currency={currency}
              stockItems={stockItems}
              stockPriceMap={stockQuoteMap}
              usdToIdr={usdToIdr}
            />

            <GoldSummary currency={currency} usdToIdr={usdToIdr} />

            <CashSummary currency={currency} usdToIdr={usdToIdr} />
          </div>
        </div>
      </Conditional>
    </div>
  );
};

export default PortfolioOverviewContainer;
