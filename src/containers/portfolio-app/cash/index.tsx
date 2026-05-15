import { useMemo, useState } from "react";

import {
  IconCheck,
  IconChevronDown,
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
import Select from "@components/base/Select";
import Spinner from "@components/base/Spinner";
import ToggleCurrency from "@components/base/ToogleCurrency";
import { formatter } from "@libs/formatter";
import { useGetWallet } from "@modules/finance/wallet/hooks/useWallet";
import type { CurrencyCode } from "@modules/portfolio/hooks/useCryptoPrices";
import {
  useAddCashGroup,
  useDeleteCashGroup,
  useGetCashGroups,
  useUpdateCashGroup,
} from "@modules/portfolio/hooks/useCashGroup";
import {
  useAddCashPortfolio,
  useDeleteCashPortfolio,
  useGetCashPortfolio,
} from "@modules/portfolio/hooks/useCashPortfolio";
import { useExchangeRate } from "@modules/portfolio/hooks/useStockPrices";
import type { CashPortfolioItem } from "@modules/portfolio/models/cashTypes";

const PortfolioCashContainer = () => {
  const [currency, setCurrency] = useState<CurrencyCode>("idr");

  // Exchange rate for IDR ↔ USD conversion
  const { data: exchangeRate } = useExchangeRate();
  const usdToIdr = exchangeRate?.usdToIdr || 1;

  const convertBalance = (idrBalance: number) => {
    if (currency === "idr") return idrBalance;
    return idrBalance / usdToIdr;
  };

  // Group state
  const [newGroupName, setNewGroupName] = useState("");

  // Per-group form state
  const [groupForms, setGroupForms] = useState<
    Record<number, { selectedWalletId: string }>
  >({});

  // Edit state
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");

  // Collapse state per group
  const [collapsedGroups, setCollapsedGroups] = useState<Set<number>>(
    new Set()
  );

  const toggleCollapse = (groupId: number) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // Group data
  const { data: groups = [], isLoading: isLoadingGroups } = useGetCashGroups();
  const addGroupMutation = useAddCashGroup();
  const deleteGroupMutation = useDeleteCashGroup();
  const updateGroupMutation = useUpdateCashGroup();

  // Cash portfolio data
  const { data: cashPortfolioItems = [], isLoading: isLoadingPortfolio } =
    useGetCashPortfolio();
  const addMutation = useAddCashPortfolio();
  const deleteMutation = useDeleteCashPortfolio();

  // Wallet data from API
  const { data: walletResponse, isLoading: isLoadingWallets } = useGetWallet();

  const allWallets = useMemo(() => {
    if (!walletResponse?.data) return [];
    return walletResponse.data;
  }, [walletResponse]);

  // Build wallet map for quick lookup
  const walletMap = useMemo(() => {
    const map = new Map<string, (typeof allWallets)[number]>();
    allWallets.forEach((w) => map.set(w.id, w));
    return map;
  }, [allWallets]);

  // Group items by groupId
  const itemsByGroup = useMemo(() => {
    const map = new Map<number, CashPortfolioItem[]>();
    cashPortfolioItems.forEach((item) => {
      const items = map.get(item.groupId) || [];
      items.push(item);
      map.set(item.groupId, items);
    });
    return map;
  }, [cashPortfolioItems]);

  // Calculate total portfolio balance
  const totalBalance = useMemo(() => {
    return cashPortfolioItems.reduce((sum, item) => {
      const wallet = walletMap.get(item.walletId);
      return sum + (wallet?.balance ?? 0);
    }, 0);
  }, [cashPortfolioItems, walletMap]);

  const getGroupTotal = (groupId: number) => {
    const items = itemsByGroup.get(groupId) || [];
    return items.reduce((sum, item) => {
      const wallet = walletMap.get(item.walletId);
      return sum + (wallet?.balance ?? 0);
    }, 0);
  };

  // Show all wallets without filtering
  const getAvailableWallets = () => {
    return allWallets;
  };

  const getGroupForm = (groupId: number) => {
    return groupForms[groupId] || { selectedWalletId: "" };
  };

  const updateGroupForm = (
    groupId: number,
    updates: Partial<{ selectedWalletId: string }>
  ) => {
    setGroupForms((prev) => ({
      ...prev,
      [groupId]: { ...getGroupForm(groupId), ...updates },
    }));
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    addGroupMutation.mutate({
      name: newGroupName.trim(),
      createdAt: new Date().toISOString(),
    });
    setNewGroupName("");
  };

  const handleAdd = (groupId: number) => {
    const form = getGroupForm(groupId);
    if (!form.selectedWalletId) return;
    const wallet = walletMap.get(form.selectedWalletId);
    if (!wallet) return;

    addMutation.mutate({
      groupId,
      walletId: wallet.id,
      walletName: wallet.name,
      createdAt: new Date().toISOString(),
    });

    updateGroupForm(groupId, { selectedWalletId: "" });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleDeleteGroup = (id: number) => {
    deleteGroupMutation.mutate(id);
  };

  // Inline edit: group name
  const startEditGroup = (group: { id?: number; name: string }) => {
    setEditingGroupId(group.id ?? null);
    setEditingGroupName(group.name);
  };

  const saveEditGroup = () => {
    if (editingGroupId === null || !editingGroupName.trim()) return;
    updateGroupMutation.mutate({
      id: editingGroupId,
      name: editingGroupName.trim(),
    });
    setEditingGroupId(null);
    setEditingGroupName("");
  };

  const cancelEditGroup = () => {
    setEditingGroupId(null);
    setEditingGroupName("");
  };

  const isLoading = isLoadingGroups || isLoadingPortfolio || isLoadingWallets;

  return (
    <div className="flex flex-col gap-4 max-[960px]:gap-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-10 rounded-lg max-[960px]:shadow-xl shadow-zinc-800/10">
        <div className="text-lg text-slate-700 font-medium">Cash Wallets</div>
        <ToggleCurrency
          currency={currency}
          onToggle={(val) => setCurrency(val)}
        />
      </div>

      <div className="flex flex-col gap-6">
        {/* Total Cash Balance */}
        <div className="bg-white p-6 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Total Cash Balance</div>
          <div className="text-2xl font-bold text-slate-700">
            {formatter.currency(convertBalance(totalBalance), { currency })}
          </div>
        </div>

        {/* Create Group */}
        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-md font-medium text-slate-700 mb-4">
            Create Cash Group
          </h3>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <input
                type="text"
                placeholder="e.g. Bank, Cash on Hand"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateGroup();
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-400"
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
        <Conditional if={!isLoading && groups.length === 0}>
          <EmptyState
            src={Assets.ActivityEmpty}
            title="No cash groups yet"
            className="max-w-90 mx-auto"
            description="Create a group (e.g. Bank, Cash on Hand) to start organizing your cash wallets."
          />
        </Conditional>

        {/* Group Sections */}
        <Each
          of={groups}
          render={(group) => {
            const form = getGroupForm(group.id!);
            const groupItems = itemsByGroup.get(group.id!) || [];
            const groupTotal = getGroupTotal(group.id!);
            const availableWallets = getAvailableWallets();

            return (
              <div
                key={group.id}
                className="bg-white rounded-lg overflow-hidden"
              >
                {/* Group Header */}
                <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
                  <div className="flex flex-col">
                    <Conditional if={editingGroupId === group.id}>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingGroupName}
                          onChange={(e) => setEditingGroupName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEditGroup();
                            if (e.key === "Escape") cancelEditGroup();
                          }}
                          autoFocus
                          className="text-md font-semibold text-slate-700 border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:border-brand-400"
                        />
                        <button
                          onClick={saveEditGroup}
                          className="text-green-600 hover:text-green-700 cursor-pointer"
                          title="Save"
                        >
                          <IconCheck stroke={2} size={16} />
                        </button>
                        <button
                          onClick={cancelEditGroup}
                          className="text-gray-400 hover:text-gray-600 cursor-pointer"
                          title="Cancel"
                        >
                          <IconXFilled size={14} />
                        </button>
                      </div>
                    </Conditional>
                    <Conditional if={editingGroupId !== group.id}>
                      <div className="flex items-center gap-2">
                        <h3 className="text-md font-semibold text-slate-700">
                          {group.name}
                        </h3>
                        <button
                          onClick={() => startEditGroup(group)}
                          className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                          title="Edit group name"
                        >
                          <IconEdit stroke={2} size={14} />
                        </button>
                      </div>
                    </Conditional>
                    <span className="text-xs text-gray-500">
                      {formatter.currency(convertBalance(groupTotal), {
                        currency,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCollapse(group.id!)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer transition-transform duration-200"
                      title={
                        collapsedGroups.has(group.id!) ? "Expand" : "Collapse"
                      }
                      style={{
                        transform: collapsedGroups.has(group.id!)
                          ? "rotate(-90deg)"
                          : "rotate(0deg)",
                      }}
                    >
                      <IconChevronDown size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group.id!)}
                      className="text-red-400 hover:text-red-600 cursor-pointer transition-colors"
                      title="Delete group and all its items"
                    >
                      <IconTrash stroke={2} size={18} />
                    </button>
                  </div>
                </div>

                {/* Collapsible Content */}
                <Conditional if={!collapsedGroups.has(group.id!)}>
                  {/* Add Wallet Form */}
                  <div className="p-6 pb-4 border-b border-gray-50">
                    <div className="flex flex-col gap-4 max-[960px]:flex-col md:flex-row md:items-end">
                      <div className="flex-1">
                        <Select
                          label="Select Wallet"
                          placeholder="Choose a wallet..."
                          value={form.selectedWalletId}
                          onSelect={(val) =>
                            updateGroupForm(group.id!, {
                              selectedWalletId: String(val),
                            })
                          }
                          options={availableWallets.map((w) => ({
                            value: w.id,
                            label: `${w.name} (${formatter.currency(convertBalance(w.balance), { currency })})`,
                          }))}
                        />
                      </div>
                      <Button
                        onClick={() => handleAdd(group.id!)}
                        isLoading={addMutation.isPending}
                        disabled={!form.selectedWalletId}
                      >
                        Add Wallet
                      </Button>
                    </div>
                  </div>

                  {/* Group Items */}
                  <div className="p-6 pt-4 border-t border-gray-50">
                    <Conditional if={groupItems.length === 0}>
                      <p className="text-sm text-gray-400 text-center py-4">
                        No wallets in this group. Add your first wallet above.
                      </p>
                    </Conditional>

                    <Conditional if={groupItems.length > 0}>
                      <div className="flex flex-col gap-3">
                        <Each
                          of={groupItems}
                          render={(item: CashPortfolioItem) => {
                            const wallet = walletMap.get(item.walletId);
                            const balance = wallet?.balance ?? 0;

                            return (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-brand-400/30 flex items-center justify-center text-xs font-bold text-slate-700">
                                    {item.walletName.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-700">
                                      {item.walletName}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      Cash
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-medium text-slate-700">
                                    {formatter.currency(
                                      convertBalance(balance),
                                      { currency }
                                    )}
                                  </span>
                                  <button
                                    onClick={() => handleDelete(item.id!)}
                                    className="text-red-400 hover:text-red-600 cursor-pointer transition-colors"
                                    title="Remove from portfolio"
                                  >
                                    <IconTrash stroke={2} size={16} />
                                  </button>
                                </div>
                              </div>
                            );
                          }}
                        />
                      </div>
                    </Conditional>
                  </div>
                </Conditional>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default PortfolioCashContainer;
