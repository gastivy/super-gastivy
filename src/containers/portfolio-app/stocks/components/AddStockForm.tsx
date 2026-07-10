import { IconCheck } from "@tabler/icons-react";

import Button from "@components/base/Button";
import Conditional from "@components/base/Conditional";
import InputText from "@components/base/InputText";

import StockSearchDropdown from "./StockSearchDropdown";
import type { AddStockFormProps } from "./types";

const AddStockForm = ({
  groupId,
  form,
  searchRef,
  onUpdateForm,
  onSelectStock,
  onSharesChange,
  onAdd,
  isAdding,
}: AddStockFormProps) => {
  return (
    <div className="p-6 pb-4 border-b border-gray-50">
      <div className="flex flex-col gap-4 max-[960px]:flex-col md:flex-row md:items-end">
        {/* Stock Search */}
        <div className="flex-1 relative" ref={searchRef}>
          <InputText
            label="Stock Ticker / Name"
            placeholder="Search stock (e.g. AAPL, Tesla)"
            value={form.searchQuery}
            onChangeInput={(val) => {
              onUpdateForm(groupId, {
                searchQuery: val,
                selectedStock: null,
                showSearchResults: true,
              });
            }}
            onFocus={() =>
              onUpdateForm(groupId, {
                showSearchResults: true,
              })
            }
          />

          {/* Search Results Dropdown */}
          <Conditional
            if={form.showSearchResults && form.searchQuery.trim().length >= 1}
          >
            <StockSearchDropdown
              query={form.searchQuery}
              onSelect={(stock) => onSelectStock(groupId, stock)}
            />
          </Conditional>
        </div>

        {/* Shares Input */}
        <div className="md:w-48">
          <InputText
            label="Shares"
            placeholder="0.00"
            inputMode="decimal"
            value={form.shares}
            onChangeInput={(val) => onSharesChange(groupId, val)}
          />
        </div>

        {/* Add Button */}
        <Button
          onClick={() => onAdd(groupId)}
          isLoading={isAdding}
          disabled={
            !form.selectedStock || !form.shares || Number(form.shares) <= 0
          }
        >
          Add
        </Button>
      </div>

      {/* Selected stock indicator */}
      <Conditional if={Boolean(form.selectedStock)}>
        <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
          <IconCheck stroke={2} size={16} />
          <span>
            Selected: {form.selectedStock?.symbol} (
            {form.selectedStock?.shortName})
          </span>
        </div>
      </Conditional>
    </div>
  );
};

export default AddStockForm;
