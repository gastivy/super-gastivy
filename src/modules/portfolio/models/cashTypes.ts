export interface CashGroup {
  id?: number;
  name: string;
  createdAt: string;
}

export interface CashPortfolioItem {
  id?: number;
  groupId: number;
  name: string;
  value: number;
  walletId?: string;
  createdAt: string;
}
