import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { PortfolioItem } from "../models/types";

import { useCryptoPrices } from "./useCryptoPrices";
import {
  useAddPortfolio,
  useDeletePortfolio,
  useGetPortfolio,
  useUpdatePortfolio,
} from "./usePortfolio";
import {
  useDeleteGroup,
  useGetGroups,
  useUpdateGroup,
} from "./usePortfolioGroup";

interface GroupForm {
  searchQuery: string;
  selectedCoin: { id: string; symbol: string; name: string } | null;
  amount: string;
  showSearchResults: boolean;
}

interface CryptoPortfolioActionsValue {
  // Data
  groups: ReturnType<typeof useGetGroups>["data"];
  portfolioItems: PortfolioItem[];
  isLoadingGroups: boolean;
  isLoadingPortfolio: boolean;
  isLoadingPrices: boolean;
  itemsByGroup: Map<number, PortfolioItem[]>;
  priceMap: Map<
    string,
    {
      currentPrice: number;
      priceChange24h: number;
      image: string;
    }
  > | null;

  // Collapse state
  collapsedGroups: Set<number>;
  toggleCollapse: (groupId: number) => void;

  // Group form state
  getGroupForm: (groupId: number) => GroupForm;
  updateGroupForm: (groupId: number, updates: Partial<GroupForm>) => void;
  searchRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;

  // Group CRUD
  handleDeleteGroup: (id: number) => void;
  editingGroupId: number | null;
  editingGroupName: string;
  setEditingGroupName: (val: string) => void;
  startEditGroup: (group: { id?: number; name: string }) => void;
  saveEditGroup: () => void;
  cancelEditGroup: () => void;

  // Item CRUD
  handleSelectCoin: (
    groupId: number,
    coin: { id: string; symbol: string; name: string }
  ) => void;
  handleAmountChange: (groupId: number, val: string) => void;
  handleAdd: (groupId: number) => void;
  handleDelete: (id: number) => void;
  addMutation: ReturnType<typeof useAddPortfolio>;

  // Item edit
  editingItemId: number | null;
  editingItemAmount: string;
  setEditingItemAmount: (val: string) => void;
  startEditItem: (item: PortfolioItem) => void;
  saveEditItem: () => void;
  cancelEditItem: () => void;
}

const CryptoPortfolioActionsContext =
  createContext<CryptoPortfolioActionsValue | null>(null);

export const useCryptoPortfolioActions = () => {
  const context = useContext(CryptoPortfolioActionsContext);
  if (!context) {
    throw new Error(
      "useCryptoPortfolioActions must be used within CryptoPortfolioActionsProvider"
    );
  }
  return context;
};

export const useCryptoPortfolioActionsProvider = (currency: "usd" | "idr") => {
  // Collapse state
  const [collapsedGroups, setCollapsedGroups] = useState<Set<number>>(
    new Set()
  );

  // Group forms
  const [groupForms, setGroupForms] = useState<Record<number, GroupForm>>({});

  // Group edit state
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");

  // Item edit state
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingItemAmount, setEditingItemAmount] = useState("");

  // Refs
  const searchRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Data hooks
  const { data: groups = [], isLoading: isLoadingGroups } = useGetGroups();
  const deleteGroupMutation = useDeleteGroup();
  const updateGroupMutation = useUpdateGroup();

  const { data: portfolioItems = [], isLoading: isLoadingPortfolio } =
    useGetPortfolio();
  const addMutation = useAddPortfolio();
  const updateItemMutation = useUpdatePortfolio();
  const deleteMutation = useDeletePortfolio();

  // Crypto prices
  const { data: priceData, isLoading: isLoadingPrices } =
    useCryptoPrices(portfolioItems);
  const priceMap = priceData?.[currency];

  // Close search dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      for (const [groupId, ref] of Object.entries(searchRefs.current)) {
        if (ref && !ref.contains(e.target as Node)) {
          setGroupForms((prev) => ({
            ...prev,
            [groupId]: {
              ...prev[Number(groupId)],
              showSearchResults: false,
            },
          }));
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Group items by groupId
  const itemsByGroup = useMemo(() => {
    const map = new Map<number, PortfolioItem[]>();
    portfolioItems.forEach((item) => {
      const items = map.get(item.groupId) || [];
      items.push(item);
      map.set(item.groupId, items);
    });
    return map;
  }, [portfolioItems]);

  // Collapse
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

  // Group forms
  const getGroupForm = (groupId: number): GroupForm => {
    return (
      groupForms[groupId] || {
        searchQuery: "",
        selectedCoin: null,
        amount: "",
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

  // Group CRUD
  const handleDeleteGroup = (id: number) => {
    deleteGroupMutation.mutate(id);
  };

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

  // Item form
  const handleSelectCoin = (
    groupId: number,
    coin: { id: string; symbol: string; name: string }
  ) => {
    updateGroupForm(groupId, {
      selectedCoin: coin,
      searchQuery: coin.name,
      showSearchResults: false,
    });
  };

  const handleAmountChange = (groupId: number, val: string) => {
    const sanitized = val.replace(/[^0-9.]/g, "");
    const parts = sanitized.split(".");
    if (parts.length > 2) return;
    updateGroupForm(groupId, { amount: sanitized });
  };

  const handleAdd = (groupId: number) => {
    const form = getGroupForm(groupId);
    if (!form.selectedCoin || !form.amount || Number(form.amount) <= 0) return;

    addMutation.mutate({
      groupId,
      coinId: form.selectedCoin.id,
      symbol: form.selectedCoin.symbol,
      name: form.selectedCoin.name,
      amount: Number(form.amount),
      createdAt: new Date().toISOString(),
    });

    updateGroupForm(groupId, {
      selectedCoin: null,
      searchQuery: "",
      amount: "",
    });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // Item edit
  const startEditItem = (item: PortfolioItem) => {
    setEditingItemId(item.id!);
    setEditingItemAmount(String(item.amount));
  };

  const saveEditItem = () => {
    if (
      editingItemId === null ||
      !editingItemAmount ||
      Number(editingItemAmount) <= 0
    )
      return;
    updateItemMutation.mutate({
      id: editingItemId,
      amount: Number(editingItemAmount),
    });
    setEditingItemId(null);
    setEditingItemAmount("");
  };

  const cancelEditItem = () => {
    setEditingItemId(null);
    setEditingItemAmount("");
  };

  return {
    // Data
    groups,
    portfolioItems,
    isLoadingGroups,
    isLoadingPortfolio,
    isLoadingPrices,
    itemsByGroup,
    priceMap: priceMap ?? null,

    // Collapse
    collapsedGroups,
    toggleCollapse,

    // Group forms
    getGroupForm,
    updateGroupForm,
    searchRefs,

    // Group CRUD
    handleDeleteGroup,
    editingGroupId,
    editingGroupName,
    setEditingGroupName,
    startEditGroup,
    saveEditGroup,
    cancelEditGroup,

    // Item CRUD
    handleSelectCoin,
    handleAmountChange,
    handleAdd,
    handleDelete,
    addMutation,

    // Item edit
    editingItemId,
    editingItemAmount,
    setEditingItemAmount,
    startEditItem,
    saveEditItem,
    cancelEditItem,
  };
};

export { CryptoPortfolioActionsContext };
