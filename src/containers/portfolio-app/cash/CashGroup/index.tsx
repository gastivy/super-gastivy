import type React from "react";

import type { CurrencyCode } from "@modules/portfolio/hooks/useCryptoPrices";
import type {
  CashGroup as CashGroupType,
  CashPortfolioItem,
} from "@modules/portfolio/models/cashTypes";

import ContentCashGroup from "./ContentCashGroup";
import HeaderGroup from "./HeaderGroup";

interface CashGroupProps {
  group: CashGroupType;
  groupTotal: number;
  currency: CurrencyCode;
  convertBalance: (idrBalance: number) => number;
  collapsedGroups: Set<number>;
  toggleCollapse: (groupId: number) => void;
  groupItems: CashPortfolioItem[];
  wallets: { id: string; name: string; balance: number }[];
}

const CashGroup: React.FC<CashGroupProps> = ({
  group,
  groupTotal,
  currency,
  convertBalance,
  collapsedGroups,
  toggleCollapse,
  groupItems,
  wallets,
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Group Header */}
      <HeaderGroup
        group={group}
        groupTotal={groupTotal}
        currency={currency}
        collapsedGroups={collapsedGroups}
        convertBalance={convertBalance}
        toggleCollapse={toggleCollapse}
      />

      {/* Collapsible Content */}
      <ContentCashGroup
        group={group}
        collapsedGroups={collapsedGroups}
        wallets={wallets}
        groupItems={groupItems}
        convertBalance={convertBalance}
        currency={currency}
      />
    </div>
  );
};

export default CashGroup;
