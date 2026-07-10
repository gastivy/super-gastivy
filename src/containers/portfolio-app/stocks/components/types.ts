import type { Dispatch, SetStateAction } from "react";

import type { StockQuote } from "@modules/portfolio/models/stockTypes";
import type {
  StockGroup,
  StockItem,
} from "@modules/portfolio/models/stockTypes";

export type Currency = "usd" | "idr";

export type QuoteMap = Map<string, StockQuote> | undefined;

export type GroupForm = {
  searchQuery: string;
  selectedStock: { symbol: string; shortName: string } | null;
  shares: string;
  showSearchResults: boolean;
};

export type GroupFormsState = Record<number, GroupForm>;

export type SearchRefs = Record<number, HTMLDivElement | null>;

export interface StockPortfolioHeaderProps {
  currency: Currency;
  onCurrencyToggle: () => void;
  importRef: React.RefObject<HTMLInputElement | null>;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  isExportDisabled: boolean;
}

export interface StockTotalValueProps {
  totalValue: number;
  currency: Currency;
  isLoadingPrices: boolean;
  hasItems: boolean;
}

export interface CreateStockGroupProps {
  groupName: string;
  onGroupNameChange: Dispatch<SetStateAction<string>>;
  onCreate: () => void;
  isCreating: boolean;
}

export interface StockSearchDropdownProps {
  query: string;
  onSelect: (stock: { symbol: string; shortName: string }) => void;
}

export interface StockItemRowProps {
  item: StockItem;
  quote: StockQuote | undefined;
  currency: Currency;
  convertPrice: (symbol: string, nativePrice: number) => number;
  onDelete: (id: number) => void;
  onUpdateItem: (payload: { id: number; shares: number }) => void;
}

export interface StockGroupHeaderProps {
  group: StockGroup;
  groupTotal: number;
  currency: Currency;
  isCollapsed: boolean;
  onToggleCollapse: (groupId: number) => void;
  onDeleteGroup: (groupId: number) => void;
  onUpdateGroup: (payload: { id: number; name: string }) => void;
}

export interface AddStockFormProps {
  groupId: number;
  form: GroupForm;
  searchRef: (el: HTMLDivElement | null) => void;
  onUpdateForm: (groupId: number, updates: Partial<GroupForm>) => void;
  onSelectStock: (
    groupId: number,
    stock: { symbol: string; shortName: string }
  ) => void;
  onSharesChange: (groupId: number, val: string) => void;
  onAdd: (groupId: number) => void;
  isAdding: boolean;
}

export interface StockGroupSectionProps {
  group: StockGroup;
  groupItems: StockItem[];
  groupTotal: number;
  quoteMap: QuoteMap;
  currency: Currency;
  convertPrice: (symbol: string, nativePrice: number) => number;
  isCollapsed: boolean;
  onToggleCollapse: (groupId: number) => void;
  onDeleteGroup: (groupId: number) => void;
  onUpdateGroup: (payload: { id: number; name: string }) => void;
  groupForm: GroupForm;
  searchRef: (el: HTMLDivElement | null) => void;
  onUpdateForm: (groupId: number, updates: Partial<GroupForm>) => void;
  onSelectStock: (
    groupId: number,
    stock: { symbol: string; shortName: string }
  ) => void;
  onSharesChange: (groupId: number, val: string) => void;
  onAdd: (groupId: number) => void;
  isAdding: boolean;
  onDeleteItem: (id: number) => void;
  onUpdateItem: (payload: { id: number; shares: number }) => void;
}
