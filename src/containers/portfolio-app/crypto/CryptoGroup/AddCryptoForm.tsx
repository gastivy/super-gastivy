import { IconCheck } from "@tabler/icons-react";

import Button from "@components/base/Button";
import Conditional from "@components/base/Conditional";
import InputText from "@components/base/InputText";
import { useCryptoPortfolioActions } from "@modules/portfolio/hooks/useCryptoPortfolioActions";

import CoinSearchDropdown from "./CoinSearchDropdown";

interface AddCryptoFormProps {
  groupId: number;
}

const AddCryptoForm = ({ groupId }: AddCryptoFormProps) => {
  const {
    getGroupForm,
    updateGroupForm,
    searchRefs,
    handleSelectCoin,
    handleAmountChange,
    handleAdd,
    addMutation,
  } = useCryptoPortfolioActions();

  const form = getGroupForm(groupId);

  return (
    <div className="p-6 pb-4 border-b border-gray-50">
      <div className="flex flex-col gap-4 max-[960px]:flex-col md:flex-row md:items-end">
        {/* Coin Search */}
        <div
          className="flex-1 relative"
          ref={(el) => {
            searchRefs.current[groupId] = el;
          }}
        >
          <InputText
            label="Crypto Token"
            placeholder="Search coin (e.g. BTC, ETH)"
            value={form.searchQuery}
            onChangeInput={(val) => {
              updateGroupForm(groupId, {
                searchQuery: val,
                selectedCoin: null,
                showSearchResults: true,
              });
            }}
            onFocus={() =>
              updateGroupForm(groupId, {
                showSearchResults: true,
              })
            }
          />

          {/* Search Results Dropdown */}
          <Conditional
            if={form.showSearchResults && form.searchQuery.trim().length >= 2}
          >
            <CoinSearchDropdown
              query={form.searchQuery}
              onSelect={(coin) => handleSelectCoin(groupId, coin)}
            />
          </Conditional>
        </div>

        {/* Amount Input */}
        <div className="md:w-48">
          <InputText
            label="Amount"
            placeholder="0.00"
            inputMode="decimal"
            value={form.amount}
            onChangeInput={(val) => handleAmountChange(groupId, val)}
          />
        </div>

        {/* Add Button */}
        <Button
          onClick={() => handleAdd(groupId)}
          isLoading={addMutation.isPending}
          disabled={
            !form.selectedCoin || !form.amount || Number(form.amount) <= 0
          }
        >
          Add
        </Button>
      </div>

      {/* Selected coin indicator */}
      <Conditional if={Boolean(form.selectedCoin)}>
        <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
          <IconCheck stroke={2} size={16} />
          <span>
            Selected: {form.selectedCoin?.symbol} ({form.selectedCoin?.name})
          </span>
        </div>
      </Conditional>
    </div>
  );
};

export default AddCryptoForm;