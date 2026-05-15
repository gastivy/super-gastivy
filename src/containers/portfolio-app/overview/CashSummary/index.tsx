import { useMemo } from "react";

import {
  IconArrowNarrowRight,
  IconWallet,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import { formatter } from "@libs/formatter";
import { useGetWallet } from "@modules/finance/wallet/hooks/useWallet";
import type { CurrencyCode } from "@modules/portfolio/hooks/useCryptoPrices";
import { useGetCashPortfolio } from "@modules/portfolio/hooks/useCashPortfolio";

interface CashSummaryProps {
  currency: CurrencyCode;
  usdToIdr: number;
}

const CashSummary = ({ currency, usdToIdr }: CashSummaryProps) => {
  const navigate = useNavigate();

  const { data: cashItems = [] } = useGetCashPortfolio();
  const { data: walletResponse } = useGetWallet();

  const walletMap = useMemo(() => {
    const map = new Map<string, { balance: number; name: string }>();
    if (walletResponse?.data) {
      walletResponse.data.forEach((w) => map.set(w.id, w));
    }
    return map;
  }, [walletResponse]);

  const convertBalance = (idrBalance: number) => {
    if (currency === "idr") return idrBalance;
    return idrBalance / usdToIdr;
  };

  const cashTotal = cashItems.reduce((sum, item) => {
    const wallet = walletMap.get(item.walletId);
    return sum + (wallet?.balance ?? 0);
  }, 0);

  const topItems = useMemo(
    () =>
      [...cashItems]
        .map((item) => {
          const wallet = walletMap.get(item.walletId);
          return {
            ...item,
            balance: wallet?.balance ?? 0,
          };
        })
        .sort((a, b) => b.balance - a.balance)
        .slice(0, 5),
    [cashItems, walletMap]
  );

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <IconWallet size={18} className="text-green-500" />
          <span className="text-md font-semibold text-slate-700">Cash</span>
        </div>
        <button
          onClick={() => navigate({ to: "/portfolio/cash" })}
          className="text-xs text-gray-400 hover:text-slate-700 cursor-pointer transition-colors flex items-center gap-1"
        >
          View All
          <IconArrowNarrowRight stroke={2} size={12} />
        </button>
      </div>

      <Conditional if={cashItems.length === 0}>
        <div className="p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">No cash wallets yet</p>
          <button
            onClick={() => navigate({ to: "/portfolio/cash" })}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium cursor-pointer"
          >
            + Add Cash
          </button>
        </div>
      </Conditional>

      <Conditional if={cashItems.length > 0}>
        <div className="p-6 pt-4">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-xs text-gray-500">Total Cash</div>
              <div className="text-xl font-bold text-slate-700">
                {formatter.currency(convertBalance(cashTotal), { currency })}
              </div>
            </div>
            <span className="text-xs text-gray-400">
              {cashItems.length} wallet{cashItems.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center text-[10px] text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-50">
              <span className="flex-1">Wallet</span>
              <span className="w-24 text-right">Balance</span>
            </div>
            <Each
              of={topItems}
              render={(item) => (
                <div className="flex items-center py-1.5">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-5 h-5 rounded-full bg-green-400/30 flex items-center justify-center text-[9px] font-bold text-slate-700">
                      {item.walletName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-slate-700">
                      {item.walletName}
                    </span>
                  </div>
                  <span className="w-24 text-right text-xs font-medium text-slate-700">
                    {formatter.currency(convertBalance(item.balance), {
                      currency,
                    })}
                  </span>
                </div>
              )}
            />
            <Conditional if={cashItems.length > 5}>
              <div className="text-center text-xs text-gray-400 pt-1">
                +{cashItems.length - 5} more wallet
                {cashItems.length - 5 > 1 ? "s" : ""}
              </div>
            </Conditional>
          </div>
        </div>
      </Conditional>
    </div>
  );
};

export default CashSummary;
