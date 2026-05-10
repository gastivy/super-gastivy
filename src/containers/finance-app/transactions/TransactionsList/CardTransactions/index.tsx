import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";

import useClickOutside from "@hooks/useClickOutside";
import useDisclosure from "@hooks/useDisclosure";
import { useDisplayWidth } from "@hooks/useDisplayWidth";
import { formatter } from "@libs/formatter";
import { TypesTransactions } from "@modules/finance/category/models";
import type { Transactions } from "@modules/finance/transactions/models";
import type React from "react";
import { useCallback, useMemo } from "react";
import { OptionsDrawer } from "../OptionsDrawer";
import { useNavigate } from "@tanstack/react-router";
import { routes } from "@constants/routes";
import { ModalConfirmDelete } from "../DeleteConfirmModal";

interface CardTransactionsProps {
  transaction: Transactions;
  hasOptions?: boolean;
}

export const CardTransactions: React.FC<CardTransactionsProps> = ({
  transaction,
  hasOptions = false,
}) => {
  const navigate = useNavigate();
  const { widthScreen } = useDisplayWidth();
  const isMobile = widthScreen < 720;

  const notesDisclosure = useDisclosure({ open: false });
  const optionActionsDisclosure = useDisclosure({ open: false });
  const confirmDeleteDisclosure = useDisclosure({ open: false });

  const handleCloseOptionsActions = useCallback(
    optionActionsDisclosure.onClose,
    []
  );
  const optionsRef = useClickOutside(handleCloseOptionsActions);

  const optionsActions = [
    {
      label: "Edit",
      onClick: () =>
        navigate({
          to: routes.finance.transactions.path,
          state: (prev) => ({ ...prev, transactionId: transaction.id }),
        }),
    },
    { label: "Delete", onClick: confirmDeleteDisclosure.onOpen },
  ];
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

  const handleOptions = () => {
    if (isMobile) optionActionsDisclosure.onOpen();
  };

  return (
    <div
      className="flex flex-col gap-4 py-4 border-b border-gray-300"
      onClick={handleOptions}
    >
      {/* Options Drawer */}
      <OptionsDrawer
        isOpen={optionActionsDisclosure.isOpen && isMobile}
        options={optionsActions}
        onClose={optionActionsDisclosure.onClose}
      />

      {/* Modal Confirm Delete */}
      <ModalConfirmDelete
        isOpen={confirmDeleteDisclosure.isOpen}
        transaction={transaction}
        onClose={confirmDeleteDisclosure.onClose}
      />

      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-xs">{transaction.name}</div>
          <div className="text-xs text-gray-400">
            {transaction.category_name}
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex flex-col items-end gap-1">
            {valueTransaction?.walletName}
            <div className={valueTransaction?.className}>
              {valueTransaction?.money}
            </div>
          </div>

          <Conditional if={!isMobile && hasOptions}>
            <div
              ref={optionsRef}
              className="min-w-6 relative max-[720px]:hidden flex justify-end cursor-pointer"
            >
              <Icon
                name="More-Square-outline"
                className="text-gray-400"
                onClick={optionActionsDisclosure.onOpen}
              />

              <Conditional if={optionActionsDisclosure.isOpen}>
                <div className="w-40 absolute z-1 top-7 right-0 flex flex-col bg-white border border-shark-400/30 rounded-lg overflow-hidden">
                  <Each
                    of={optionsActions}
                    render={(option, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 hover:bg-green-yellow-100 text-sm"
                        onClick={option.onClick}
                      >
                        {option.label}
                      </div>
                    )}
                  />
                </div>
              </Conditional>
            </div>
          </Conditional>
        </div>
      </div>
      {/* Notes */}
      {transaction.description && (
        <div className="w-[50%] max-[578px]:w-full flex flex-col gap-1">
          <div className="text-xs font-medium text-limed-spruce-800">Note:</div>
          <div
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => !notesDisclosure.isOpen && notesDisclosure.onOpen()}
          >
            <div className="flex text-xs text-gray-400">
              {transaction.description?.slice(
                0,
                notesDisclosure.isOpen ? 99999 : 10
              )}
              {!notesDisclosure.isOpen && isNoteTooLong ? "...." : ""}
            </div>

            {!notesDisclosure.isOpen && isNoteTooLong && (
              <div className="text-xs text-green-yellow-500">See more</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
