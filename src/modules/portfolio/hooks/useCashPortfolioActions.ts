import { createContext, useContext, useState } from "react";

import {
  useAddCashPortfolio,
  useDeleteCashPortfolio,
  useUpdateCashPortfolio,
} from "./useCashPortfolio";

interface FormData {
  newName: string;
  newValue: string;
  newWalletId: string;
}

interface CashPortfolioActionsValue {
  // State
  collapsedGroups: Set<number>;
  editingItemId: number | null;
  editName: string;
  editValue: string;
  // Setters
  setEditName: (name: string) => void;
  setEditValue: (value: string) => void;
  setGroupAddMode: (groupId: number, mode: "manual" | "wallet") => void;
  // Computed
  getGroupAddMode: (groupId: number) => "manual" | "wallet";
  getGroupForm: (groupId: number) => FormData;
  updateGroupForm: (groupId: number, updates: Partial<FormData>) => void;
  // Actions
  toggleCollapse: (groupId: number) => void;
  handleValueChange: (val: string) => string | undefined;
  handleAdd: (groupId: number) => void;
  handleDelete: (id: number) => void;
  startEditItem: (item: { id?: number; name: string; value: number }) => void;
  saveEditItem: () => void;
  cancelEditItem: () => void;
  // Mutations
  addMutation: ReturnType<typeof useAddCashPortfolio>;
}

const CashPortfolioActionsContext =
  createContext<CashPortfolioActionsValue | null>(null);

export const useCashPortfolioActions = () => {
  const context = useContext(CashPortfolioActionsContext);
  if (!context) {
    throw new Error(
      "useCashPortfolioActions must be used within CashPortfolioActionsProvider"
    );
  }
  return context;
};

export const useCashPortfolioActionsProvider = () => {
  // Add mode: "manual" or "wallet"
  const [groupAddModes, setGroupAddModes] = useState<
    Record<number, "manual" | "wallet">
  >({});

  // Per-group form state
  const [groupForms, setGroupForms] = useState<Record<number, FormData>>({});

  // Edit state for items
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState("");

  // Collapse state per group
  const [collapsedGroups, setCollapsedGroups] = useState<Set<number>>(
    new Set()
  );

  // Mutations
  const addMutation = useAddCashPortfolio();
  const updateMutation = useUpdateCashPortfolio();
  const deleteMutation = useDeleteCashPortfolio();

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

  const getGroupAddMode = (groupId: number): "manual" | "wallet" => {
    return groupAddModes[groupId] || "manual";
  };

  const getGroupForm = (groupId: number): FormData => {
    return (
      groupForms[groupId] || {
        newName: "",
        newValue: "",
        newWalletId: "",
      }
    );
  };

  const updateGroupForm = (groupId: number, updates: Partial<FormData>) => {
    setGroupForms((prev) => ({
      ...prev,
      [groupId]: { ...getGroupForm(groupId), ...updates },
    }));
  };

  const setGroupAddMode = (groupId: number, mode: "manual" | "wallet") => {
    setGroupAddModes((prev) => ({ ...prev, [groupId]: mode }));
  };

  const handleValueChange = (val: string) => {
    const sanitized = val.replace(/[^0-9.]/g, "");
    const parts = sanitized.split(".");
    if (parts.length > 2) return;
    return sanitized;
  };

  const handleAdd = (groupId: number) => {
    const form = getGroupForm(groupId);
    if (!form.newName.trim() || !form.newValue || Number(form.newValue) <= 0)
      return;

    addMutation.mutate({
      groupId,
      name: form.newName.trim(),
      value: Number(form.newValue),
      createdAt: new Date().toISOString(),
    });

    updateGroupForm(groupId, { newName: "", newValue: "", newWalletId: "" });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const startEditItem = (item: {
    id?: number;
    name: string;
    value: number;
  }) => {
    setEditingItemId(item.id ?? null);
    setEditName(item.name);
    setEditValue(String(item.value));
  };

  const saveEditItem = () => {
    if (
      editingItemId === null ||
      !editName.trim() ||
      !editValue ||
      Number(editValue) <= 0
    )
      return;

    updateMutation.mutate({
      id: editingItemId,
      name: editName.trim(),
      value: Number(editValue),
    });

    setEditingItemId(null);
    setEditName("");
    setEditValue("");
  };

  const cancelEditItem = () => {
    setEditingItemId(null);
    setEditName("");
    setEditValue("");
  };

  return {
    collapsedGroups,
    editingItemId,
    editName,
    editValue,
    setEditName,
    setEditValue,
    setGroupAddMode,
    getGroupAddMode,
    getGroupForm,
    updateGroupForm,
    toggleCollapse,
    handleValueChange,
    handleAdd,
    handleDelete,
    startEditItem,
    saveEditItem,
    cancelEditItem,
    addMutation,
  };
};

export { CashPortfolioActionsContext };
