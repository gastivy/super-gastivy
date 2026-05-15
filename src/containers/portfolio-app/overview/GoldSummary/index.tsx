import { useMemo } from "react";

import { IconArrowNarrowRight, IconDiamond } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import { formatter } from "@libs/formatter";
import type { CurrencyCode } from "@modules/portfolio/hooks/useCryptoPrices";
import {
  useGetGoldPortfolio,
  useGoldPrice,
} from "@modules/portfolio/hooks/useGoldPortfolio";

interface GoldSummaryProps {
  currency: CurrencyCode;
  usdToIdr: number;
}

const GoldSummary = ({ currency, usdToIdr }: GoldSummaryProps) => {
  const navigate = useNavigate();

  const { data: goldItems = [] } = useGetGoldPortfolio();
  const { data: goldPriceData } = useGoldPrice();

  const pricePerGramIdr = goldPriceData?.midPrice || 0;

  const convertBalance = (idrBalance: number) => {
    if (currency === "idr") return idrBalance;
    return idrBalance / usdToIdr;
  };

  const goldTotalIdr = goldItems.reduce((sum, item) => {
    return sum + item.grams * pricePerGramIdr;
  }, 0);

  const totalGrams = goldItems.reduce((sum, item) => sum + item.grams, 0);

  const topItems = useMemo(
    () =>
      [...goldItems]
        .map((item) => ({
          ...item,
          valueIdr: item.grams * pricePerGramIdr,
        }))
        .sort((a, b) => b.valueIdr - a.valueIdr)
        .slice(0, 5),
    [goldItems, pricePerGramIdr]
  );

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <IconDiamond size={18} className="text-amber-500" />
          <span className="text-md font-semibold text-slate-700">Gold</span>
        </div>
        <button
          onClick={() => navigate({ to: "/portfolio/gold" })}
          className="text-xs text-gray-400 hover:text-slate-700 cursor-pointer transition-colors flex items-center gap-1"
        >
          View All
          <IconArrowNarrowRight stroke={2} size={12} />
        </button>
      </div>

      <Conditional if={goldItems.length === 0}>
        <div className="p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">No gold holdings yet</p>
          <button
            onClick={() => navigate({ to: "/portfolio/gold" })}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium cursor-pointer"
          >
            + Add Gold
          </button>
        </div>
      </Conditional>

      <Conditional if={goldItems.length > 0}>
        <div className="p-6 pt-4">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-xs text-gray-500">Total Gold Value</div>
              <div className="text-xl font-bold text-slate-700">
                {formatter.currency(convertBalance(goldTotalIdr), { currency })}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                {totalGrams.toFixed(2)} grams
              </div>
            </div>
            <span className="text-xs text-gray-400">
              {goldItems.length} item{goldItems.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center text-[10px] text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-50">
              <span className="flex-1">Name</span>
              <span className="w-16 text-right">Grams</span>
              <span className="w-24 text-right">Value</span>
            </div>
            <Each
              of={topItems}
              render={(item) => (
                <div className="flex items-center py-1.5" key={item.id}>
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-5 h-5 rounded-full bg-amber-400/30 flex items-center justify-center text-[9px] font-bold text-slate-700">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-slate-700">
                      {item.name}
                    </span>
                  </div>
                  <span className="w-16 text-right text-xs text-gray-500">
                    {item.grams.toFixed(2)}g
                  </span>
                  <span className="w-24 text-right text-xs font-medium text-slate-700">
                    {formatter.currency(convertBalance(item.valueIdr), {
                      currency,
                    })}
                  </span>
                </div>
              )}
            />
            <Conditional if={goldItems.length > 5}>
              <div className="text-center text-xs text-gray-400 pt-1">
                +{goldItems.length - 5} more item
                {goldItems.length - 5 > 1 ? "s" : ""}
              </div>
            </Conditional>
          </div>
        </div>
      </Conditional>
    </div>
  );
};

export default GoldSummary;
