import { TypesTransactions } from "@modules/finance/category/models";

export const typeTransactionOptions = [
  { label: "Income", value: TypesTransactions.INCOME },
  { label: "Expenses", value: TypesTransactions.EXPENSES },
  { label: "Transfer", value: TypesTransactions.TRANSFER },
  { label: "Fee Transfer", value: TypesTransactions.FEE_TRANSFER },
];
