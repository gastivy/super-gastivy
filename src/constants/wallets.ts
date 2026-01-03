import { WalletsType } from "@modules/finance/wallet/models";

export const walletTypeOptions = [
  { label: "Cash", value: WalletsType.CASH },
  { label: "ATM", value: WalletsType.ATM },
  { label: "E-Money", value: WalletsType.E_MONEY },
  { label: "Assets", value: WalletsType.ASSETS },
];
