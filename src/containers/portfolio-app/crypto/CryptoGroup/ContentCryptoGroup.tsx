import type React from "react";

import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import { useCryptoPortfolioActions } from "@modules/portfolio/hooks/useCryptoPortfolioActions";
import type { PortfolioItem } from "@modules/portfolio/models/types";

import AddCryptoForm from "./AddCryptoForm";
import CryptoItemCard from "./CryptoItemCard";

interface ContentCryptoGroupProps {
  groupId: number;
  groupItems: PortfolioItem[];
  currency: "usd" | "idr";
}

const ContentCryptoGroup: React.FC<ContentCryptoGroupProps> = ({
  groupId,
  groupItems,
  currency,
}) => {
  const { collapsedGroups } = useCryptoPortfolioActions();

  if (collapsedGroups.has(groupId)) return null;

  return (
    <>
      {/* Add Item Form */}
      <AddCryptoForm groupId={groupId} />

      {/* Group Items */}
      <div className="p-6 pt-4 border-t border-gray-50">
        <Conditional if={groupItems.length === 0}>
          <p className="text-sm text-gray-400 text-center py-4">
            No tokens in this group. Add your first token above.
          </p>
        </Conditional>

        <Conditional if={groupItems.length > 0}>
          <div className="flex flex-col gap-3">
            <Each
              of={groupItems}
              render={(item: PortfolioItem) => (
                <CryptoItemCard key={item.id} item={item} currency={currency} />
              )}
            />
          </div>
        </Conditional>
      </div>
    </>
  );
};

export default ContentCryptoGroup;
