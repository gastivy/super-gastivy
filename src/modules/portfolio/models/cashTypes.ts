export interface CashGroup {
  id?: number;
  name: string;
  createdAt: string;
}

export interface CashPortfolioItem {
  id?: number;
  groupId: number;
  walletId: string;
  walletName: string;
  createdAt: string;
}