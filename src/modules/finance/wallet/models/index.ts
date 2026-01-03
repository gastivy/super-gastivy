import type { HttpResponse } from "@custom-types/HttpResponse";

export type WalletResponse = HttpResponse<Wallet[]>;
export type WalletDetailResponse = HttpResponse<Wallet>;
export type BalanceResponse = HttpResponse<Balance>;

export interface CreateWalletRequest {
  name: string;
  balance: number;
  type: number;
}

export enum WalletsType {
  CASH = 1,
  ATM = 2,
  E_MONEY = 3,
  ASSETS = 4,
}

export interface Wallet {
  id: string;
  user_id: string;
  name: string;
  balance: number;
  deleted_at: Date | null;
  created_at: Date;
  type: WalletsType;
  updated_at: Date;
}

export interface Balance {
  balance: number;
}

export interface UpdateWalletRequest {
  id?: string;
  name: string;
  balance?: number;
  type: number;
}
