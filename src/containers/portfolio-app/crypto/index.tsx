import { useMemo, useState } from "react";

import { IconPlusFilled } from "@tabler/icons-react";

import { Assets } from "@assets/illustrations";
import Button from "@components/base/Button";
import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import EmptyState from "@components/base/EmptyState";
import InputText from "@components/base/InputText";
import Spinner from "@components/base/Spinner";
import ToggleCurrency from "@components/base/ToogleCurrency";
import { formatter } from "@libs/formatter";
import {
  CryptoPortfolioActionsContext,
  useCryptoPortfolioActionsProvider,
} from "@modules/portfolio/hooks/useCryptoPortfolioActions";
import { useAddGroup } from "@modules/portfolio/hooks/usePortfolioGroup";

import CryptoGroup from "./CryptoGroup";
import HeaderCrypto from "./HeaderCrypto";

const PortfolioCryptoContainer = () => {
  const [currency, setCurrency] = useState<"usd" | "idr">("usd");
  const [newGroupName, setNewGroupName] = useState("");

  // All state, data hooks, and actions via context provider
  const actions = useCryptoPortfolioActionsProvider(currency);

  // Separate group creation mutation (not part of the actions hook)
  const addGroupMutation = useAddGroup();

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    addGroupMutation.mutate({
      name: newGroupName.trim(),
      createdAt: new Date().toISOString(),
    });
    setNewGroupName("");
  };

  // Calculate group totals
  const groupTotals = useMemo(() => {
    const totals = new Map<number, number>();
    actions.itemsByGroup.forEach((items, groupId) => {
      const total = items.reduce((sum, item) => {
        const priceData = actions.priceMap?.get(item.coinId);
        const currentPrice = priceData?.currentPrice || 0;
        return sum + item.amount * currentPrice;
      }, 0);
      totals.set(groupId, total);
    });
    return totals;
  }, [actions.itemsByGroup, actions.priceMap]);

  // Total portfolio value
  const totalValue = useMemo(() => {
    let total = 0;
    actions.portfolioItems.forEach((item) => {
      const priceData = actions.priceMap?.get(item.coinId);
      const currentPrice = priceData?.currentPrice || 0;
      total += item.amount * currentPrice;
    });
    return total;
  }, [actions.portfolioItems, actions.priceMap]);

  const isLoading =
    actions.isLoadingGroups ||
    actions.isLoadingPortfolio ||
    actions.isLoadingPrices;

  return (
    <CryptoPortfolioActionsContext.Provider value={actions}>
      <div className="flex flex-col gap-4 max-[960px]:gap-8">
        {/* Header */}
        <HeaderCrypto currency={currency} setCurrency={setCurrency} />

        {/* Summary */}
        <div className="bg-white p-6 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">
            Total Portfolio Value
          </div>
          <div className="text-2xl font-bold text-slate-700">
            {formatter.currency(totalValue, { currency })}
          </div>
        </div>

        {/* Create Group */}
        <div className="bg-white p-6 rounded-lg">
          <div className="text-sm font-medium text-slate-700 mb-3">
            Create New Group
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <InputText
                placeholder="Group name (e.g. DeFi, Layer 1)"
                value={newGroupName}
                onChangeInput={setNewGroupName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateGroup();
                }}
              />
            </div>
            <Button
              onClick={handleCreateGroup}
              isLoading={addGroupMutation.isPending}
              disabled={!newGroupName.trim()}
            >
              <IconPlusFilled size={16} />
              <span className="ml-1">Create Group</span>
            </Button>
          </div>
        </div>

        {/* Loading */}
        <Conditional if={isLoading}>
          <div className="flex items-center justify-center py-8">
            <Spinner className="w-6 h-6" />
          </div>
        </Conditional>

        {/* Empty State */}
        <Conditional if={!isLoading && actions.groups.length === 0}>
          <EmptyState
            src={Assets.ActivityEmpty}
            title="No groups yet"
            className="max-w-90 mx-auto"
            description="Create a group to start organizing your crypto portfolio."
          />
        </Conditional>

        {/* Currency Toggle */}
        <div className="flex justify-end">
          <ToggleCurrency
            currency={currency}
            onToggle={(val) => setCurrency(val)}
          />
        </div>

        {/* Group Sections */}
        <Each
          of={actions.groups}
          render={(group) => (
            <CryptoGroup
              key={group.id}
              group={group}
              groupTotal={groupTotals.get(group.id!) || 0}
              currency={currency}
              groupItems={actions.itemsByGroup.get(group.id!) || []}
            />
          )}
        />
      </div>
    </CryptoPortfolioActionsContext.Provider>
  );
};

export default PortfolioCryptoContainer;
