import { useMemo, useState } from "react";

import { Assets } from "@assets/illustrations";
import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import EmptyState from "@components/base/EmptyState";
import Spinner from "@components/base/Spinner";
import ToggleCurrency from "@components/base/ToogleCurrency";
import { formatter } from "@libs/formatter";
import { useGetWallet } from "@modules/finance/wallet/hooks/useWallet";
import { useGetCashGroups } from "@modules/portfolio/hooks/useCashGroup";
import { useGetCashPortfolio } from "@modules/portfolio/hooks/useCashPortfolio";
import {
  CashPortfolioActionsContext,
  useCashPortfolioActionsProvider,
} from "@modules/portfolio/hooks/useCashPortfolioActions";
import type { CurrencyCode } from "@modules/portfolio/hooks/useCryptoPrices";
import { useExchangeRate } from "@modules/portfolio/hooks/useStockPrices";

import CashGroup from "./CashGroup";
import CreateCashGroup from "./CreateCashGroup";

const PortfolioCashContainer = () => {
  const [currency, setCurrency] = useState<CurrencyCode>("idr");
  const actions = useCashPortfolioActionsProvider();

  const { data: walletData } = useGetWallet();
  const { data: exchangeRate } = useExchangeRate();
  const { data: groups = [], isLoading: isLoadingGroups } = useGetCashGroups();
  const { data: cashPortfolioItems = [], isLoading: isLoadingPortfolio } =
    useGetCashPortfolio();

  const usdToIdr = exchangeRate?.usdToIdr || 1;

  const convertBalance = (idrBalance: number) => {
    if (currency === "idr") return idrBalance;
    return idrBalance / usdToIdr;
  };

  const wallets = walletData?.data || [];

  const itemsByGroup = useMemo(() => {
    const map = new Map<
      number,
      {
        id?: number;
        groupId: number;
        name: string;
        value: number;
        walletId?: string;
        createdAt: string;
      }[]
    >();
    cashPortfolioItems.forEach((item) => {
      const items = map.get(item.groupId) || [];
      items.push(item);
      map.set(item.groupId, items);
    });
    return map;
  }, [cashPortfolioItems]);

  const totalBalance = useMemo(() => {
    return cashPortfolioItems.reduce((sum, item) => sum + (item.value || 0), 0);
  }, [cashPortfolioItems]);

  const getGroupTotal = (groupId: number) => {
    const items = itemsByGroup.get(groupId) || [];
    return items.reduce((sum, item) => sum + (item.value || 0), 0);
  };

  const isLoading = isLoadingGroups || isLoadingPortfolio;

  return (
    <CashPortfolioActionsContext.Provider value={actions}>
      <div className="flex flex-col gap-4 max-[960px]:gap-8">
        <div className="flex justify-between items-center bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-10 rounded-lg max-[960px]:shadow-xl shadow-zinc-800/10">
          <div className="text-lg text-slate-700 font-medium">Cash</div>
          <ToggleCurrency
            currency={currency}
            onToggle={(val) => setCurrency(val)}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Total Cash Balance</div>
            <div className="text-2xl font-bold text-slate-700">
              {formatter.currency(convertBalance(totalBalance), { currency })}
            </div>
          </div>

          <CreateCashGroup />

          <Conditional if={isLoading}>
            <div className="flex items-center justify-center py-8">
              <Spinner className="w-6 h-6" />
            </div>
          </Conditional>

          <Conditional if={!isLoading && groups.length === 0}>
            <EmptyState
              src={Assets.ActivityEmpty}
              title="No cash groups yet"
              className="max-w-90 mx-auto"
              description="Create a group (e.g. Bank, Cash on Hand) to start organizing your cash."
            />
          </Conditional>

          <Each
            of={groups}
            render={(group) => {
              return (
                <CashGroup
                  key={group.id}
                  group={group}
                  currency={currency}
                  collapsedGroups={actions.collapsedGroups}
                  groupTotal={getGroupTotal(group.id!) || 0}
                  convertBalance={convertBalance}
                  toggleCollapse={actions.toggleCollapse}
                  groupItems={itemsByGroup.get(group.id!) || []}
                  wallets={wallets}
                />
              );
            }}
          />
        </div>
      </div>
    </CashPortfolioActionsContext.Provider>
  );
};

export default PortfolioCashContainer;
