import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { IconXFilled } from "@tabler/icons-react";

import { Assets } from "@assets/illustrations";
import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import EmptyState from "@components/base/EmptyState";
import Spinner from "@components/base/Spinner";
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
} from "@modules/portfolio/hooks/useStockPrices";
import type { StockItem } from "@modules/portfolio/models/stockTypes";
import {
  exportStockPortfolioToXlsx,
  importStockPortfolioFromXlsx,
} from "@modules/portfolio/services/stockXlsx";

import CreateStockGroup from "./components/CreateStockGroup";
import StockGroupSection from "./components/StockGroupSection";
import StockPortfolioHeader from "./components/StockPortfolioHeader";
import StockTotalValue from "./components/StockTotalValue";
import type { Currency, GroupForm, GroupFormsState } from "./components/types";

const StockPortfolioContainer = () => {
  // Group state
  const [newGroupName, setNewGroupName] = useState("");

  // Per-group form state
  const [groupForms, setGroupForms] = useState<GroupFormsState>({});

  // Currency toggle
  const [currency, setCurrency] = useState<Currency>("usd");

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

  const getGroupForm = (groupId: number): GroupForm => {
    return (
      groupForms[groupId] || {
        searchQuery: "",
        selectedStock: null,
        shares: "",
        showSearchResults: false,
      }
    );
  };

  const updateGroupForm = (groupId: number, updates: Partial<GroupForm>) => {
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

  const handleDeleteItem = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleDeleteGroup = (id: number) => {
    deleteGroupMutation.mutate(id);
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
      <StockPortfolioHeader
        currency={currency}
        onCurrencyToggle={() => setCurrency(currency === "usd" ? "idr" : "usd")}
        importRef={importRef}
        onImport={handleImport}
        onExport={handleExport}
        isExportDisabled={stockItems.length === 0}
      />

      <div className="flex flex-col gap-6">
        {/* Total Portfolio Value */}
        <StockTotalValue
          totalValue={totalValue}
          currency={currency}
          isLoadingPrices={isLoadingPrices}
          hasItems={stockItems.length > 0}
        />

        {/* Create Group */}
        <CreateStockGroup
          groupName={newGroupName}
          onGroupNameChange={setNewGroupName}
          onCreate={handleCreateGroup}
          isCreating={addGroupMutation.isPending}
        />

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
          render={(group) => (
            <StockGroupSection
              key={group.id}
              group={group}
              groupItems={itemsByGroup.get(group.id!) || []}
              groupTotal={getGroupTotal(group.id!)}
              quoteMap={quoteMap}
              currency={currency}
              convertPrice={convertPrice}
              isCollapsed={collapsedGroups.has(group.id!)}
              onToggleCollapse={toggleCollapse}
              onDeleteGroup={handleDeleteGroup}
              onUpdateGroup={updateGroupMutation.mutate}
              groupForm={getGroupForm(group.id!)}
              searchRef={(el) => {
                searchRefs.current[group.id!] = el;
              }}
              onUpdateForm={updateGroupForm}
              onSelectStock={handleSelectStock}
              onSharesChange={handleSharesChange}
              onAdd={handleAdd}
              isAdding={addMutation.isPending}
              onDeleteItem={handleDeleteItem}
              onUpdateItem={updateItemMutation.mutate}
            />
          )}
        />
      </div>
    </div>
  );
};

export default StockPortfolioContainer;
