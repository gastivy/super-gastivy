import Icon from "@components/base/Icon";
import { formatter } from "@libs/formatter";
import { TypesTransactions } from "@modules/finance/category/models";
import type { Transactions } from "@modules/finance/transactions/models";
import type React from "react";
import { useMemo } from "react";

interface CardTransactionsProps {
  transaction: Transactions;
}

export const CardTransactions: React.FC<CardTransactionsProps> = ({
  transaction,
}) => {
  const isIncomeType = [
    TypesTransactions.INCOME,
    TypesTransactions.PROFIT,
  ].includes(transaction.type);
  const isSpendingType = [
    TypesTransactions.EXPENSES,
    TypesTransactions.FEE_TRANSFER,
    TypesTransactions.LOSS,
  ].includes(transaction.type);
  const isTransferType = TypesTransactions.TRANSFER === transaction.type;

  const valueTransaction = useMemo(() => {
    if (isIncomeType) {
      return {
        className: "text-xs font-medium text-green-400",
        money: `+${formatter.currency(transaction.money)}`,
        walletName: (
          <div className="text-xs font-medium text-limed-spruce-800">
            {transaction.to_wallet_name}
          </div>
        ),
      };
    }

    if (isSpendingType) {
      return {
        className: "text-xs font-medium text-red-400",
        money: `-${formatter.currency(transaction.money)}`,
        walletName: (
          <div className="text-xs font-medium text-limed-spruce-800">
            {transaction.from_wallet_name}
          </div>
        ),
      };
    }

    if (isTransferType) {
      return {
        className: "text-xs font-medium text-gray-400",
        money: formatter.currency(transaction.money),
        walletName: (
          <div className="flex items-center gap-1">
            <div className="text-xs font-medium text-limed-spruce-800">
              {transaction.from_wallet_name}
            </div>
            <Icon
              name="Arrow-Right-outline"
              size={16}
              className="text-gray-400"
            />
            <div className="text-xs font-medium text-limed-spruce-800">
              {transaction.to_wallet_name}
            </div>
          </div>
        ),
      };
    }
  }, [transaction]);

  return (
    <div className="flex justify-between py-4 border-b border-gray-300">
      <div className="flex flex-col gap-1">
        <div className="text-xs">{transaction.name}</div>
        <div className="text-xs text-gray-400">
          {transaction.category_name || transaction.id}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        {valueTransaction?.walletName}
        <div className={valueTransaction?.className}>
          {valueTransaction?.money}
        </div>
      </div>
    </div>
  );
};
