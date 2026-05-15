import { useMemo } from "react";

import { IconArrowNarrowRight, IconStack2Filled } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import { routes } from "@constants/routes";
import { formatter } from "@libs/formatter";
import {
  type CurrencyCode,
  useCryptoPrices,
} from "@modules/portfolio/hooks/useCryptoPrices";
import { useGetPortfolio } from "@modules/portfolio/hooks/usePortfolio";
import type { PortfolioItem } from "@modules/portfolio/models/types";

interface CryptoSummaryProps {
  currency: CurrencyCode;
}

const CryptoSummary: React.FC<CryptoSummaryProps> = ({ currency }) => {
  const navigate = useNavigate();
  const MAX_TOTAL_CRYPTO = 10;

  const { data: cryptoItems = [] } = useGetPortfolio();
  const { data: cryptoPriceData } = useCryptoPrices(cryptoItems);
  const cryptoPriceMap = cryptoPriceData?.[currency];

  const cryptoTotal = cryptoItems.reduce((sum, item) => {
    const price = cryptoPriceMap?.get(item.coinId)?.currentPrice || 0;
    return sum + item.amount * price;
  }, 0);

  const mergeCoinByCoinId = () => {
    const result: Record<string, PortfolioItem> = {};

    cryptoItems.forEach((crypto) => {
      if (result[crypto.coinId]) {
        result[crypto.coinId].amount += crypto.amount;
      } else {
        result[crypto.coinId] = { ...crypto };
      }
    });

    return Object.values(result);
  };

  const topCryptos = useMemo(() => {
    return mergeCoinByCoinId()
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
      .slice(0, MAX_TOTAL_CRYPTO);
  }, [cryptoItems, cryptoPriceMap]);

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <IconStack2Filled size={18} className="text-yellow-500" />
          <span className="text-md font-semibold text-slate-700">Crypto</span>
        </div>
        <button
          onClick={() => navigate({ to: routes.portfolio.crypto.path })}
          className="text-xs text-gray-400 hover:text-slate-700 cursor-pointer transition-colors flex items-center gap-1"
        >
          View All
          <IconArrowNarrowRight stroke={2} size={12} />
        </button>
      </div>

      <Conditional if={cryptoItems.length === 0}>
        <div className="p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">No crypto holdings yet</p>
          <button
            onClick={() => navigate({ to: routes.portfolio.crypto.path })}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium cursor-pointer"
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
              <div className="text-xl font-bold text-slate-700">
                {formatter.currency(cryptoTotal, { currency })}
              </div>
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
                <div className="flex items-center py-1.5" key={item.id}>
                  <div className="flex items-center gap-2 flex-1">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.symbol}
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-yellow-400/30 flex items-center justify-center text-[9px] font-bold text-slate-700">
                        {item.symbol.charAt(0)}
                      </div>
                    )}
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

            <Conditional if={cryptoItems.length > 5}>
              <div className="text-center text-xs text-gray-400 pt-1">
                +{cryptoItems.length - MAX_TOTAL_CRYPTO} more asset
                {cryptoItems.length - MAX_TOTAL_CRYPTO > 1 ? "s" : ""}
              </div>
            </Conditional>
          </div>
        </div>
      </Conditional>
    </div>
  );
};

export default CryptoSummary;
