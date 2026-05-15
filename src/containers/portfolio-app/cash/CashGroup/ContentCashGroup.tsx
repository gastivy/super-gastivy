import type React from "react";

import {
  IconCheck,
  IconEdit,
  IconPlusFilled,
  IconTrash,
  IconXFilled,
} from "@tabler/icons-react";

import Button from "@components/base/Button";
import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import InputText from "@components/base/InputText";
import { cn } from "@libs/classnames";
import { formatter } from "@libs/formatter";
import { useCashPortfolioActions } from "@modules/portfolio/hooks/useCashPortfolioActions";
import type { CurrencyCode } from "@modules/portfolio/hooks/useCryptoPrices";
import type {
  CashGroup as CashGroupType,
  CashPortfolioItem,
} from "@modules/portfolio/models/cashTypes";

interface ContentCashGroupProps {
  group: CashGroupType;
  collapsedGroups: Set<number>;
  wallets: { id: string; name: string; balance: number }[];
  groupItems: CashPortfolioItem[];
  convertBalance: (idrBalance: number) => number;
  currency: CurrencyCode;
}

const ContentCashGroup: React.FC<ContentCashGroupProps> = ({
  group,
  collapsedGroups,
  wallets,
  groupItems,
  convertBalance,
  currency,
}) => {
  const {
    getGroupAddMode,
    setGroupAddMode,
    getGroupForm,
    updateGroupForm,
    handleValueChange,
    handleAdd,
    addMutation,
    editingItemId,
    editName,
    setEditName,
    editValue,
    setEditValue,
    saveEditItem,
    cancelEditItem,
    startEditItem,
    handleDelete,
  } = useCashPortfolioActions();

  const form = getGroupForm(group.id!);

  return (
    <Conditional if={!collapsedGroups.has(group.id!)}>
      {/* Add Cash Form */}
      <div className="p-6 pb-4 border-b border-gray-50">
        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setGroupAddMode(group.id!, "manual")}
            className={cn(
              "px-3 py-1 text-xs rounded-full transition-colors cursor-pointer",
              getGroupAddMode(group.id!) === "manual"
                ? "bg-brand-600 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
          >
            Manual
          </button>
          <button
            onClick={() => setGroupAddMode(group.id!, "wallet")}
            className={cn(
              "px-3 py-1 text-xs rounded-full transition-colors cursor-pointer",
              getGroupAddMode(group.id!) === "wallet"
                ? "bg-brand-600 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
          >
            From Wallet
          </button>
        </div>

        <Conditional if={getGroupAddMode(group.id!) === "wallet"}>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Select Wallet
              </label>
              <select
                value={form.newWalletId}
                onChange={(e) => {
                  const walletId = e.target.value;
                  const wallet = wallets.find((w) => w.id === walletId);
                  updateGroupForm(group.id!, {
                    newWalletId: walletId,
                    newName: wallet ? wallet.name : "",
                    newValue: wallet ? String(wallet.balance) : "",
                  });
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-400 bg-white"
              >
                <option value="">-- Select wallet --</option>
                <Each
                  of={wallets}
                  render={(w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} (
                      {formatter.currency(w.balance, {
                        currency: "idr",
                      })}
                      )
                    </option>
                  )}
                />
              </select>
            </div>
            <div className="md:w-48">
              <InputText
                label="Value (IDR)"
                placeholder="0"
                inputMode="decimal"
                value={form.newValue}
                onChangeInput={(val) => {
                  const sanitized = handleValueChange(val);
                  if (sanitized !== undefined)
                    updateGroupForm(group.id!, {
                      newValue: sanitized,
                    });
                }}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter") handleAdd(group.id!);
                }}
              />
            </div>
            <Button
              onClick={() => handleAdd(group.id!)}
              isLoading={addMutation.isPending}
              disabled={
                !form.newName.trim() ||
                !form.newValue ||
                Number(form.newValue) <= 0
              }
            >
              <IconPlusFilled size={16} />
              <span className="ml-1">Add</span>
            </Button>
          </div>
        </Conditional>

        <Conditional if={getGroupAddMode(group.id!) === "manual"}>
          <div className="flex flex-col gap-4 max-[960px]:flex-col md:flex-row md:items-end">
            <div className="flex-1">
              <InputText
                label="Name"
                placeholder="e.g. BCA, Mandiri"
                value={form.newName}
                onChangeInput={(val) =>
                  updateGroupForm(group.id!, {
                    newName: val,
                  })
                }
              />
            </div>
            <div className="md:w-48">
              <InputText
                label="Value (IDR)"
                placeholder="0"
                inputMode="decimal"
                value={form.newValue}
                onChangeInput={(val) => {
                  const sanitized = handleValueChange(val);
                  if (sanitized !== undefined)
                    updateGroupForm(group.id!, {
                      newValue: sanitized,
                    });
                }}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter") handleAdd(group.id!);
                }}
              />
            </div>
            <Button
              onClick={() => handleAdd(group.id!)}
              isLoading={addMutation.isPending}
              disabled={
                !form.newName.trim() ||
                !form.newValue ||
                Number(form.newValue) <= 0
              }
            >
              <IconPlusFilled size={16} />
              <span className="ml-1">Add</span>
            </Button>
          </div>
        </Conditional>
      </div>

      {/* Group Items */}
      <div className="p-6 pt-4 border-t border-gray-50">
        <Conditional if={groupItems.length === 0}>
          <p className="text-sm text-gray-400 text-center py-4">
            No cash entries in this group. Add your first entry above.
          </p>
        </Conditional>

        <Conditional if={groupItems.length > 0}>
          <div className="flex flex-col gap-3">
            <Each
              of={groupItems}
              render={(item: CashPortfolioItem) => {
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-400/30 flex items-center justify-center text-xs font-bold text-slate-700">
                        {(item.name || "?").charAt(0).toUpperCase()}
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
                            value={editValue}
                            onChange={(e) => {
                              const sanitized = handleValueChange(
                                e.target.value
                              );
                              if (sanitized !== undefined)
                                setEditValue(sanitized);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEditItem();
                              if (e.key === "Escape") cancelEditItem();
                            }}
                            className="w-24 text-sm border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:border-brand-400"
                          />
                          <button
                            onClick={saveEditItem}
                            className="text-green-600 hover:text-green-700 cursor-pointer"
                            title="Save"
                          >
                            <IconCheck stroke={2} size={16} />
                          </button>
                          <button
                            onClick={cancelEditItem}
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
                          <span className="text-xs text-gray-400">Cash</span>
                        </div>
                      </Conditional>
                    </div>

                    <div className="flex items-center gap-3">
                      <Conditional if={editingItemId !== item.id}>
                        <span className="text-sm font-medium text-slate-700">
                          {formatter.currency(convertBalance(item.value), {
                            currency,
                          })}
                        </span>
                      </Conditional>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditItem(item)}
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
        </Conditional>
      </div>
    </Conditional>
  );
};

export default ContentCashGroup;
