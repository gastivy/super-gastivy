import type React from "react";

import type {
  PortfolioGroup,
  PortfolioItem,
} from "@modules/portfolio/models/types";

import ContentCryptoGroup from "./ContentCryptoGroup";
import HeaderCryptoGroup from "./HeaderCryptoGroup";

interface CryptoGroupProps {
  group: PortfolioGroup;
  groupTotal: number;
  currency: "usd" | "idr";
  groupItems: PortfolioItem[];
}

const CryptoGroup: React.FC<CryptoGroupProps> = ({
  group,
  groupTotal,
  currency,
  groupItems,
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <HeaderCryptoGroup
        group={group}
        groupTotal={groupTotal}
        currency={currency}
      />

      <ContentCryptoGroup
        groupId={group.id!}
        groupItems={groupItems}
        currency={currency}
      />
    </div>
  );
};

export default CryptoGroup;
