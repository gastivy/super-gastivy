import { useMemo, useState } from "react";

import {
  IconCheck,
  IconEdit,
  IconPlusFilled,
  IconTrash,
  IconXFilled,
} from "@tabler/icons-react";

import { Assets } from "@assets/illustrations";
import Button from "@components/base/Button";
import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import EmptyState from "@components/base/EmptyState";
import InputText from "@components/base/InputText";
import Spinner from "@components/base/Spinner";
import ToggleCurrency from "@components/base/ToogleCurrency";
import { formatter } from "@libs/formatter";
import { useExchangeRate } from "@modules/portfolio/hooks/useStockPrices";
import type { CurrencyCode } from "@modules/portfolio/hooks/useCryptoPrices";
import {
  useAddGoldPortfolio,
  useDeleteGoldPortfolio,
  useGetGoldPortfolio,
  useGoldPrice,
  useUpdateGoldPortfolio,
} from "@modules/portfolio/hooks/useGoldPortfolio";

const PortfolioGoldContainer = () => {
  const [currency, setCurrency] = useState<CurrencyCode>("idr");

  // Exchange rate for IDR ↔ USD conversion
  const { data: exchangeRate } = useExchangeRate();
  const usdToIdr = exchangeRate?.usdToIdr || 1;

  const convertFromIdr = (idrValue: number) => {
    if (currency === "idr") return idrValue;
    return idrValue / usdToIdr;
  };

  // Gold price
  const { data: goldPrice, isLoading: isLoadingPrice } = useGoldPrice();

  // Gold portfolio items
  const { data: goldItems = [], isLoading: isLoadingItems } =
    useGetGoldPortfolio();
  const addMutation = useAddGoldPortfolio();
  const updateMutation = useUpdateGoldPortfolio();
  const deleteMutation = useDeleteGoldPortfolio();

  // Form state
  const [newName, setNewName] = useState("");
  const [newGrams, setNewGrams] = useState("");

  // Edit state
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editGrams, setEditGrams] = useState("");

  // Price per gram in IDR (API returns price per 1 gram)
  const pricePerGramIdr = goldPrice?.midPrice || 0;

  // Total grams
  const totalGrams = useMemo(() => {
    return goldItems.reduce((sum, item) => sum + item.grams, 0);
  }, [goldItems]);

  // Total value in IDR
  const totalValueIdr = totalGrams * pricePerGramIdr;

  const handleAdd = () => {
    if (!newName.trim() || !newGrams || Number(newGrams) <= 0) return;

    addMutation.mutate({
      name: newName.trim(),
      grams: Number(newGrams),
      createdAt: new Date().toISOString(),
    });

    setNewName("");
    setNewGrams("");
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const startEdit = (item: { id?: number; name: string; grams: number }) => {
    setEditingItemId(item.id ?? null);
    setEditName(item.name);
    setEditGrams(String(item.grams));
  };

  const saveEdit = () => {
    if (
      editingItemId === null ||
      !editName.trim() ||
      !editGrams ||
      Number(editGrams) <= 0
    )
      return;

    updateMutation.mutate({
      id: editingItemId,
      name: editName.trim(),
      grams: Number(editGrams),
    });

    setEditingItemId(null);
    setEditName("");
    setEditGrams("");
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setEditName("");
    setEditGrams("");
  };

  const handleGramsChange = (val: string) => {
    const sanitized = val.replace(/[^0-9.]/g, "");
    const parts = sanitized.split(".");
    if (parts.length > 2) return;
    return sanitized;
  };

  const isLoading = isLoadingItems || isLoadingPrice;

  return (
    <div className="flex flex-col gap-4 max-[960px]:gap-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-10 rounded-lg max-[960px]:shadow-xl shadow-zinc-800/10">
        <div className="text-lg text-slate-700 font-medium">Gold</div>
        <ToggleCurrency
          currency={currency}
          onToggle={(val) => setCurrency(val)}
        />
      </div>

      <div className="flex flex-col gap-6">
        {/* Gold Price Info */}
        <div className="bg-white p-6 rounded-lg">
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">
                Current Gold Price (per gram)
              </div>
              <div className="text-2xl font-bold text-slate-700">
                {formatter.currency(convertFromIdr(pricePerGramIdr), {
                  currency,
                })}
              </div>
            </div>
            {goldPrice && (
              <div className="flex flex-wrap gap-3">
                <PriceChangeBadge
                  label="1D"
                  value={goldPrice.priceChanges.ONE_DAY}
                />
                <PriceChangeBadge
                  label="1W"
                  value={goldPrice.priceChanges.ONE_WEEK}
                />
                <PriceChangeBadge
                  label="1M"
                  value={goldPrice.priceChanges.ONE_MONTH}
                />
                <PriceChangeBadge
                  label="6M"
                  value={goldPrice.priceChanges.SIX_MONTH}
                />
                <PriceChangeBadge
                  label="1Y"
                  value={goldPrice.priceChanges.ONE_YEAR}
                />
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500">Buy Price</div>
                <div className="text-sm font-medium text-slate-700">
                  {formatter.currency(convertFromIdr(goldPrice?.buy || 0), {
                    currency,
                  })}
                </div>
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500">Sell Price</div>
                <div className="text-sm font-medium text-slate-700">
                  {formatter.currency(convertFromIdr(goldPrice?.sell || 0), {
                    currency,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Gold Summary */}
        <div className="bg-white p-6 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Total Gold Value</div>
          <div className="text-2xl font-bold text-slate-700">
            {formatter.currency(convertFromIdr(totalValueIdr), { currency })}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {totalGrams.toFixed(2)} grams total
          </div>
        </div>

        {/* Add Gold Form */}
        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-md font-medium text-slate-700 mb-4">
            Add Gold Entry
          </h3>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <InputText
                label="Name"
                placeholder="e.g. Gold Bar, Jewelry"
                value={newName}
                onChangeInput={(val) => setNewName(val)}
              />
            </div>
            <div className="md:w-48">
              <InputText
                label="Grams"
                placeholder="0.00"
                inputMode="decimal"
                value={newGrams}
                onChangeInput={(val) => {
                  const sanitized = handleGramsChange(val);
                  if (sanitized !== undefined) setNewGrams(sanitized);
                }}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter") handleAdd();
                }}
              />
            </div>
            <Button
              onClick={handleAdd}
              isLoading={addMutation.isPending}
              disabled={!newName.trim() || !newGrams || Number(newGrams) <= 0}
            >
              <IconPlusFilled size={16} />
              <span className="ml-1">Add</span>
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
        <Conditional if={!isLoading && goldItems.length === 0}>
          <EmptyState
            src={Assets.ActivityEmpty}
            title="No gold entries yet"
            className="max-w-90 mx-auto"
            description="Add your gold holdings (bars, jewelry, coins) to track their value."
          />
        </Conditional>

        {/* Gold Items List */}
        <Conditional if={!isLoading && goldItems.length > 0}>
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="p-6 pb-4 border-b border-gray-100">
              <h3 className="text-md font-semibold text-slate-700">
                Your Gold Holdings
              </h3>
            </div>
            <div className="p-6 pt-4">
              <div className="flex flex-col gap-3">
                <Each
                  of={goldItems}
                  render={(item) => {
                    const itemValueIdr = item.grams * pricePerGramIdr;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-yellow-400/30 flex items-center justify-center text-xs font-bold text-yellow-700">
                            Au
                          </div>
                          <Conditional if={editingItemId === item.id}>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                autoFocus
                                className="text-sm border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:border-brand-400"
                              />
                              <input
                                type="text"
                                inputMode="decimal"
                                value={editGrams}
                                onChange={(e) => {
                                  const sanitized = handleGramsChange(
                                    e.target.value
                                  );
                                  if (sanitized !== undefined)
                                    setEditGrams(sanitized);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveEdit();
                                  if (e.key === "Escape") cancelEdit();
                                }}
                                className="w-20 text-sm border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:border-brand-400"
                              />
                              <button
                                onClick={saveEdit}
                                className="text-green-600 hover:text-green-700 cursor-pointer"
                                title="Save"
                              >
                                <IconCheck stroke={2} size={16} />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                title="Cancel"
                              >
                                <IconXFilled size={14} />
                              </button>
                            </div>
                          </Conditional>
                          <Conditional if={editingItemId !== item.id}>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-slate-700">
                                {item.name}
                              </span>
                              <span className="text-xs text-gray-400">
                                {item.grams} grams
                              </span>
                            </div>
                          </Conditional>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-medium text-slate-700">
                              {formatter.currency(
                                convertFromIdr(itemValueIdr),
                                { currency }
                              )}
                            </span>
                            <span className="text-xs text-gray-400">
                              {item.grams}g ×{" "}
                              {formatter.currency(
                                convertFromIdr(pricePerGramIdr),
                                { currency }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEdit(item)}
                              className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                              title="Edit"
                            >
                              <IconEdit stroke={2} size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id!)}
                              className="text-red-400 hover:text-red-600 cursor-pointer transition-colors"
                              title="Remove"
                            >
                              <IconTrash stroke={2} size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </Conditional>
      </div>
    </div>
  );
};

const PriceChangeBadge = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => {
  const isPositive = value >= 0;
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50">
      <span className="text-xs text-gray-500">{label}</span>
      <span
        className={`text-xs font-medium ${isPositive ? "text-green-600" : "text-red-500"}`}
      >
        {isPositive ? "+" : ""}
        {value.toFixed(2)}%
      </span>
    </div>
  );
};

export default PortfolioGoldContainer;