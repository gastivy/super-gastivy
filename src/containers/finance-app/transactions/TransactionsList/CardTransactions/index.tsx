import Icon from "@components/base/Icon";
import useDisclosure from "@hooks/useDisclosure";
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

  const { isOpen, onOpen } = useDisclosure({ open: false });
  const isNoteTooLong = (transaction.description?.length || 0) > 40;

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
    <div className="flex flex-col gap-4 py-4 border-b border-gray-300">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-xs">{transaction.name}</div>
          <div className="text-xs text-gray-400">
            {transaction.category_name}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {valueTransaction?.walletName}
          <div className={valueTransaction?.className}>
            {valueTransaction?.money}
          </div>
        </div>
      </div>
      {transaction.description && (
        <div className="w-[50%] max-[578px]:w-full flex flex-col gap-1">
          <div className="text-xs font-medium text-limed-spruce-800">Note:</div>
          <div
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => !isOpen && onOpen()}
          >
            <div className="flex text-xs text-gray-400">
              {transaction.description?.slice(0, isOpen ? 99999 : 10)}
              {!isOpen && isNoteTooLong ? "...." : ""}
            </div>

            {!isOpen && isNoteTooLong && (
              <div className="text-xs text-green-yellow-500">See more</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
