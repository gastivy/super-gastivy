import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  IconCheck,
  IconChevronDown,
  IconDownloadFilled,
  IconEdit,
  IconPlusFilled,
  IconTrash,
  IconUpload,
  IconXFilled,
} from "@tabler/icons-react";

import { Assets } from "@assets/illustrations";
import Button from "@components/base/Button";
import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import EmptyState from "@components/base/EmptyState";
import InputText from "@components/base/InputText";
import Spinner from "@components/base/Spinner";
import { formatter } from "@libs/formatter";
import {
  useAddStockGroup,
  useDeleteStockGroup,
  useGetStockGroups,
  useUpdateStockGroup,
} from "@modules/portfolio/hooks/useStockGroup";
import {
  useAddStockPortfolio,
  useDeleteStockPortfolio,
  useGetStockPortfolio,
  useUpdateStockPortfolio,
} from "@modules/portfolio/hooks/useStockPortfolio";
import {
  useExchangeRate,
  useStockPrices,
  useStockSearch,
} from "@modules/portfolio/hooks/useStockPrices";
import type { StockItem } from "@modules/portfolio/models/stockTypes";
import {
  exportStockPortfolioToXlsx,
  importStockPortfolioFromXlsx,
} from "@modules/portfolio/services/stockXlsx";

const StockPortfolioContainer = () => {
  // Group state
  const [newGroupName, setNewGroupName] = useState("");

  // Per-group form state
  const [groupForms, setGroupForms] = useState<
    Record<
      number,
      {
        searchQuery: string;
        selectedStock: { symbol: string; shortName: string } | null;
        shares: string;
        showSearchResults: boolean;
      }
    >
  >({});

  // Edit state
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingItemShares, setEditingItemShares] = useState("");

  // Currency toggle
  const [currency, setCurrency] = useState<"usd" | "idr">("usd");

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

  const searchRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const importRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Group data
  const { data: groups = [], isLoading: isLoadingGroups } = useGetStockGroups();
  const addGroupMutation = useAddStockGroup();
  const deleteGroupMutation = useDeleteStockGroup();
  const updateGroupMutation = useUpdateStockGroup();

  // Portfolio data
  const { data: stockItems = [], isLoading: isLoadingPortfolio } =
    useGetStockPortfolio();
  const addMutation = useAddStockPortfolio();
  const updateItemMutation = useUpdateStockPortfolio();
  const deleteMutation = useDeleteStockPortfolio();

  // Stock prices from Yahoo Finance
  const { data: quoteMap, isLoading: isLoadingPrices } =
    useStockPrices(stockItems);

  // Exchange rate USD to IDR
  const { data: exchangeRate } = useExchangeRate();
  const usdToIdr = exchangeRate?.usdToIdr || 1;

  // Check if a stock is Indonesian (IDX stocks end with .JK)
  const isIndonesianStock = (symbol: string) => symbol.endsWith(".JK");

  const getGroupForm = (groupId: number) => {
    return (
      groupForms[groupId] || {
        searchQuery: "",
        selectedStock: null,
        shares: "",
        showSearchResults: false,
      }
    );
  };

  const updateGroupForm = (
    groupId: number,
    updates: Partial<{
      searchQuery: string;
      selectedStock: { symbol: string; shortName: string } | null;
      shares: string;
      showSearchResults: boolean;
    }>
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

  const handleSelectStock = (
    groupId: number,
    stock: { symbol: string; shortName: string }
  ) => {
    updateGroupForm(groupId, {
      selectedStock: stock,
      searchQuery: `${stock.symbol} - ${stock.shortName}`,
      showSearchResults: false,
    });
  };

  const handleSharesChange = (groupId: number, val: string) => {
    const sanitized = val.replace(/[^0-9.]/g, "");
    const parts = sanitized.split(".");
    if (parts.length > 2) return;
    updateGroupForm(groupId, { shares: sanitized });
  };

  const handleAdd = (groupId: number) => {
    const form = getGroupForm(groupId);
    if (!form.selectedStock || !form.shares || Number(form.shares) <= 0) return;

    addMutation.mutate({
      groupId,
      symbol: form.selectedStock.symbol,
      name: form.selectedStock.shortName,
      shares: Number(form.shares),
      createdAt: new Date().toISOString(),
    });

    updateGroupForm(groupId, {
      selectedStock: null,
      searchQuery: "",
      shares: "",
    });
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

  // Inline edit: item shares
  const startEditItem = (item: StockItem) => {
    setEditingItemId(item.id!);
    setEditingItemShares(String(item.shares));
  };

  const saveEditItem = () => {
    if (
      editingItemId === null ||
      !editingItemShares ||
      Number(editingItemShares) <= 0
    )
      return;
    updateItemMutation.mutate({
      id: editingItemId,
      shares: Number(editingItemShares),
    });
    setEditingItemId(null);
    setEditingItemShares("");
  };

  const cancelEditItem = () => {
    setEditingItemId(null);
    setEditingItemShares("");
  };

  // Group items by groupId
  const itemsByGroup = useMemo(() => {
    const map = new Map<number, StockItem[]>();
    stockItems.forEach((item) => {
      const items = map.get(item.groupId) || [];
      items.push(item);
      map.set(item.groupId, items);
    });
    return map;
  }, [stockItems]);

  // Convert a price to the selected display currency
  // Yahoo returns native currency: USD for US stocks, IDR for .JK stocks
  const convertPrice = (symbol: string, nativePrice: number) => {
    const isIdx = isIndonesianStock(symbol);
    if (currency === "idr") {
      return isIdx ? nativePrice : nativePrice * usdToIdr;
    } else {
      return isIdx ? nativePrice / usdToIdr : nativePrice;
    }
  };

  // Calculate total portfolio value in selected currency
  const totalValue = stockItems.reduce((sum, item) => {
    const quote = quoteMap?.get(item.symbol);
    const nativePrice = quote?.regularMarketPrice || 0;
    const convertedPrice = convertPrice(item.symbol, nativePrice);
    return sum + item.shares * convertedPrice;
  }, 0);

  const getGroupTotal = (groupId: number) => {
    const items = itemsByGroup.get(groupId) || [];
    return items.reduce((sum, item) => {
      const quote = quoteMap?.get(item.symbol);
      const nativePrice = quote?.regularMarketPrice || 0;
      const convertedPrice = convertPrice(item.symbol, nativePrice);
      return sum + item.shares * convertedPrice;
    }, 0);
  };

  const handleExport = useCallback(() => {
    if (stockItems.length === 0) return;
    exportStockPortfolioToXlsx(
      stockItems,
      groups,
      quoteMap,
      `stock-portfolio-${new Date().toISOString().slice(0, 10)}`
    );
  }, [stockItems, groups, quoteMap]);

  const handleImport = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setImportError(null);

      const result = await importStockPortfolioFromXlsx(file);

      if (result.errors.length > 0) {
        setImportError(result.errors.join("; "));
      }

      if (result.items.length > 0) {
        // Create groups that don't exist yet
        const existingGroupNames = new Map(
          groups.map((g) => [g.name.toLowerCase(), g.id!])
        );
        const groupNameToId = new Map<string, number>(existingGroupNames);

        for (const groupName of result.groupNames) {
          const lowerName = groupName.toLowerCase();
          if (!groupNameToId.has(lowerName)) {
            const newGroup = await addGroupMutation.mutateAsync({
              name: groupName,
              createdAt: new Date().toISOString(),
            });
            groupNameToId.set(lowerName, newGroup.id!);
          }
        }

        // Add items with resolved groupIds
        result.items.forEach((item) => {
          const extendedItem = item as Omit<StockItem, "id"> & {
            _groupName: string;
          };
          const groupId =
            groupNameToId.get(
              (extendedItem._groupName || "Default").toLowerCase()
            ) || 1;

          addMutation.mutate({
            ...item,
            groupId,
          });
        });
      }

      if (importRef.current) {
        importRef.current.value = "";
      }
    },
    [groups, addGroupMutation, addMutation]
  );

  // Close search dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      for (const [groupId, ref] of Object.entries(searchRefs.current)) {
        if (ref && !ref.contains(e.target as Node)) {
          setGroupForms((prev) => ({
            ...prev,
            [groupId]: { ...prev[Number(groupId)], showSearchResults: false },
          }));
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-4 max-[960px]:gap-8">
      {/* Header */}
      <div className="flex max-[576px]:flex-col max-[576px]:items-start max-[576px]:gap-4 justify-between items-center bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-10 rounded-lg max-[960px]:shadow-xl shadow-zinc-800/10">
        <div className="text-lg text-slate-700 font-medium">
          Stock Portfolio
        </div>
        <div className="flex max-[360px]:flex-col max-[360px]:items-start items-center gap-2">
          {/* Currency Toggle */}
          <button
            onClick={() => setCurrency(currency === "usd" ? "idr" : "usd")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <span
              className={
                currency === "usd"
                  ? "text-slate-700 font-bold"
                  : "text-gray-400"
              }
            >
              USD
            </span>
            <span className="text-gray-300">/</span>
            <span
              className={
                currency === "idr"
                  ? "text-slate-700 font-bold"
                  : "text-gray-400"
              }
            >
              IDR
            </span>
          </button>

          <div className="w-px h-5 bg-gray-200 max-[360px]:hidden" />

          <input
            ref={importRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleImport}
          />

          <div className="flex gap-4">
            <Button
              variant="outline"
              size="small"
              onClick={() => importRef.current?.click()}
            >
              <IconUpload stroke={2} size={16} />
              <span className="ml-1">Import</span>
            </Button>
            <Button
              variant="outline"
              size="small"
              onClick={handleExport}
              disabled={stockItems.length === 0}
            >
              <IconDownloadFilled size={16} />
              <span className="ml-1">Export</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Total Portfolio Value */}
        <div className="bg-white p-6 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Total Stock Value</div>
          <Conditional if={isLoadingPrices && stockItems.length > 0}>
            <div className="h-8 w-48 animate-pulse bg-gray-200 rounded" />
          </Conditional>
          <Conditional if={!isLoadingPrices || stockItems.length === 0}>
            <div className="text-2xl font-bold text-slate-700">
              {formatter.currency(totalValue, { currency })}
            </div>
          </Conditional>
        </div>

        {/* Create Group */}
        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-md font-medium text-slate-700 mb-4">
            Create Stock Group
          </h3>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <InputText
                label="Group Name"
                placeholder="e.g. Tech Stocks, Dividend Stocks"
                value={newGroupName}
                onChangeInput={(val) => setNewGroupName(val)}
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

        {/* Import Error */}
        <Conditional if={Boolean(importError)}>
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg flex items-center justify-between">
            <span>{importError}</span>
            <button
              onClick={() => setImportError(null)}
              className="text-red-400 hover:text-red-600 cursor-pointer"
            >
              <IconXFilled size={16} />
            </button>
          </div>
        </Conditional>

        {/* Loading */}
        <Conditional if={isLoadingGroups || isLoadingPortfolio}>
          <div className="flex items-center justify-center py-8">
            <Spinner className="w-6 h-6" />
          </div>
        </Conditional>

        {/* Empty State */}
        <Conditional if={!isLoadingGroups && groups.length === 0}>
          <EmptyState
            src={Assets.ActivityEmpty}
            title="No stock groups yet"
            className="max-w-90 mx-auto"
            description="Create a group (e.g. Tech Stocks, Dividend Stocks) to start organizing your stock portfolio."
          />
        </Conditional>

        {/* Group Sections */}
        <Each
          of={groups}
          render={(group) => {
            const form = getGroupForm(group.id!);
            const groupItems = (itemsByGroup.get(group.id!) || []).sort(
              (a, b) => {
                const aPrice = quoteMap?.get(a.symbol)?.regularMarketPrice || 0;
                const bPrice = quoteMap?.get(b.symbol)?.regularMarketPrice || 0;
                return b.shares * bPrice - a.shares * aPrice;
              }
            );
            const groupTotal = getGroupTotal(group.id!);

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
                      {formatter.currency(groupTotal, { currency })}
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
                  {/* Add Item Form */}
                  <div className="p-6 pb-4 border-b border-gray-50">
                    <div className="flex flex-col gap-4 max-[960px]:flex-col md:flex-row md:items-end">
                      {/* Stock Search */}
                      <div
                        className="flex-1 relative"
                        ref={(el) => {
                          searchRefs.current[group.id!] = el;
                        }}
                      >
                        <InputText
                          label="Stock Ticker / Name"
                          placeholder="Search stock (e.g. AAPL, Tesla)"
                          value={form.searchQuery}
                          onChangeInput={(val) => {
                            updateGroupForm(group.id!, {
                              searchQuery: val,
                              selectedStock: null,
                              showSearchResults: true,
                            });
                          }}
                          onFocus={() =>
                            updateGroupForm(group.id!, {
                              showSearchResults: true,
                            })
                          }
                        />

                        {/* Search Results Dropdown */}
                        <Conditional
                          if={
                            form.showSearchResults &&
                            form.searchQuery.trim().length >= 1
                          }
                        >
                          <StockSearchDropdown
                            query={form.searchQuery}
                            onSelect={(stock) =>
                              handleSelectStock(group.id!, stock)
                            }
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
                          onChangeInput={(val) =>
                            handleSharesChange(group.id!, val)
                          }
                        />
                      </div>

                      {/* Add Button */}
                      <Button
                        onClick={() => handleAdd(group.id!)}
                        isLoading={addMutation.isPending}
                        disabled={
                          !form.selectedStock ||
                          !form.shares ||
                          Number(form.shares) <= 0
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

                  {/* Group Items */}
                  <div className="p-6 pt-4 border-t border-gray-50">
                    <Conditional if={groupItems.length === 0}>
                      <p className="text-sm text-gray-400 text-center py-4">
                        No stocks in this group. Add your first stock above.
                      </p>
                    </Conditional>

                    <Conditional if={groupItems.length > 0}>
                      <div className="flex flex-col gap-3">
                        <Each
                          of={groupItems}
                          render={(item: StockItem) => {
                            const quote = quoteMap?.get(item.symbol);
                            const nativePrice = quote?.regularMarketPrice || 0;
                            const convertedPrice = convertPrice(
                              item.symbol,
                              nativePrice
                            );
                            const priceChange =
                              quote?.regularMarketChangePercent || 0;
                            const totalItemValue = item.shares * convertedPrice;

                            return (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-brand-400/30 flex items-center justify-center text-xs font-bold text-slate-700">
                                    {item.symbol.charAt(0)}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-700">
                                      {item.symbol}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {item.name}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex gap-4">
                                  <div className="flex flex-col items-end">
                                    <span className="text-sm font-medium text-slate-700">
                                      {formatter.currency(totalItemValue, {
                                        currency,
                                      })}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <Conditional
                                        if={editingItemId === item.id}
                                      >
                                        <input
                                          type="text"
                                          inputMode="decimal"
                                          value={editingItemShares}
                                          onChange={(e) => {
                                            const val = e.target.value.replace(
                                              /[^0-9.]/g,
                                              ""
                                            );
                                            const parts = val.split(".");
                                            if (parts.length <= 2)
                                              setEditingItemShares(val);
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                              saveEditItem();
                                            if (e.key === "Escape")
                                              cancelEditItem();
                                          }}
                                          autoFocus
                                          className="w-20 text-xs text-right border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-brand-400"
                                        />
                                        <button
                                          onClick={saveEditItem}
                                          className="text-green-600 hover:text-green-700 cursor-pointer"
                                          title="Save"
                                        >
                                          <IconCheck stroke={2} size={14} />
                                        </button>
                                        <button
                                          onClick={cancelEditItem}
                                          className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                          title="Cancel"
                                        >
                                          <IconXFilled size={12} />
                                        </button>
                                      </Conditional>
                                      <Conditional
                                        if={editingItemId !== item.id}
                                      >
                                        <span className="text-xs text-gray-500">
                                          {item.shares} ×{" "}
                                          {formatter.currency(convertedPrice, {
                                            currency,
                                          })}
                                        </span>
                                        <button
                                          onClick={() => startEditItem(item)}
                                          className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                                          title="Edit shares"
                                        >
                                          <IconEdit stroke={2} size={12} />
                                        </button>
                                      </Conditional>
                                      <span
                                        className={`text-xs font-medium ${
                                          priceChange >= 0
                                            ? "text-green-600"
                                            : "text-red-500"
                                        }`}
                                      >
                                        {priceChange >= 0 ? "+" : ""}
                                        {priceChange.toFixed(2)}%
                                      </span>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => handleDelete(item.id!)}
                                    className="ml-3 text-red-400 hover:text-red-600 cursor-pointer transition-colors"
                                    title="Remove from portfolio"
                                  >
                                    <IconTrash stroke={2} size={18} />
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

// Separate component for search dropdown with its own debounce + query
const StockSearchDropdown = ({
  query,
  onSelect,
}: {
  query: string;
  onSelect: (stock: { symbol: string; shortName: string }) => void;
}) => {
  const { data: searchResults = [], isLoading: isSearching } =
    useStockSearch(query);

  if (isSearching) {
    return (
      <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center justify-center">
        <Spinner className="w-4 h-4" />
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-sm text-gray-400">
        No stocks found
      </div>
    );
  }

  return (
    <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      <Each
        of={searchResults}
        render={(stock) => (
          <div
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelect(stock)}
          >
            <div className="w-6 h-6 rounded-full bg-brand-400/30 flex items-center justify-center text-[10px] font-bold text-slate-700">
              {stock.symbol.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-700">
                {stock.symbol}
              </span>
              <span className="text-xs text-gray-500">{stock.shortName}</span>
            </div>
            <span className="ml-auto text-xs text-gray-400">
              {stock.exchange}
            </span>
          </div>
        )}
      />
    </div>
  );
};

export default StockPortfolioContainer;
