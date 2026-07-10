import { useMemo } from "react";

import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";

import AddStockForm from "./AddStockForm";
import StockGroupHeader from "./StockGroupHeader";
import StockItemRow from "./StockItemRow";
import type { StockGroupSectionProps } from "./types";

const StockGroupSection = ({
  group,
  groupItems,
  groupTotal,
  quoteMap,
  currency,
  convertPrice,
  isCollapsed,
  onToggleCollapse,
  onDeleteGroup,
  onUpdateGroup,
  groupForm,
  searchRef,
  onUpdateForm,
  onSelectStock,
  onSharesChange,
  onAdd,
  isAdding,
  onDeleteItem,
  onUpdateItem,
}: StockGroupSectionProps) => {
  // Sort items by value descending
  const sortedItems = useMemo(() => {
    return [...groupItems].sort((a, b) => {
      const aPrice = quoteMap?.get(a.symbol)?.regularMarketPrice || 0;
      const bPrice = quoteMap?.get(b.symbol)?.regularMarketPrice || 0;
      return b.shares * bPrice - a.shares * aPrice;
    });
  }, [groupItems, quoteMap]);

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <StockGroupHeader
        group={group}
        groupTotal={groupTotal}
        currency={currency}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        onDeleteGroup={onDeleteGroup}
        onUpdateGroup={onUpdateGroup}
      />

      <Conditional if={!isCollapsed}>
        <AddStockForm
          groupId={group.id!}
          form={groupForm}
          searchRef={searchRef}
          onUpdateForm={onUpdateForm}
          onSelectStock={onSelectStock}
          onSharesChange={onSharesChange}
          onAdd={onAdd}
          isAdding={isAdding}
        />

        <div className="p-6 pt-4 border-t border-gray-50">
          <Conditional if={sortedItems.length === 0}>
            <p className="text-sm text-gray-400 text-center py-4">
              No stocks in this group. Add your first stock above.
            </p>
          </Conditional>

          <Conditional if={sortedItems.length > 0}>
            <div className="flex flex-col gap-3">
              <Each
                of={sortedItems}
                render={(item) => (
                  <StockItemRow
                    key={item.id}
                    item={item}
                    quote={quoteMap?.get(item.symbol)}
                    currency={currency}
                    convertPrice={convertPrice}
                    onDelete={onDeleteItem}
                    onUpdateItem={onUpdateItem}
                  />
                )}
              />
            </div>
          </Conditional>
        </div>
      </Conditional>
    </div>
  );
};

export default StockGroupSection;
