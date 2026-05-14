import { useQueryClient } from "@tanstack/react-query";

import Button from "@components/base/Button";
import Modal from "@components/base/Modal";
import { dateTime } from "@libs/dateTime";
import { formatter } from "@libs/formatter";
import { useDeleteTransaction } from "@modules/finance/transactions/hooks/useTransaction";
import type { Transactions } from "@modules/finance/transactions/models";

interface ModalConfirmDeleteProps {
  isOpen: boolean;
  transaction: Transactions;
  onClose: () => void;
}

export const ModalConfirmDelete: React.FC<ModalConfirmDeleteProps> = ({
  isOpen,
  transaction,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useDeleteTransaction({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["infinite-transactions"] });
      onClose();
    },
  });

  const handleDelete = () => {
    if (transaction.id) mutate(transaction.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      className="w-max flex flex-col gap-6 p-4"
      onClose={onClose}
    >
      <div className="flex flex-col gap-1 justify-center items-center">
        <div className="text-sm text-zinc-900">Are you sure want to delete</div>
        <div className="text-sm font-medium">{transaction.name}?</div>
      </div>

      <div className="w-80 mx-auto grid grid-cols-2 gap-y-2">
        <div className="text-slate-800 text-sm font-medium">Date</div>
        <div className="text-slate-800 text-sm text-end">
          {dateTime.getDate(
            transaction.date ? new Date(String(transaction.date)) : new Date(),
            "en-GB",
            {
              dateStyle: "long",
            }
          )}
        </div>
        <div className="text-slate-800 text-sm font-medium">Money</div>
        <div className="text-slate-800 text-sm text-end">
          {formatter.currency(transaction.money)}
        </div>
        <div className="text-slate-800 text-sm font-medium">Category</div>
        <div className="text-slate-800 text-sm text-end">
          {transaction.category_name}
        </div>
        <div className="text-slate-800 text-sm font-medium">Origin Wallet</div>
        <div className="text-slate-800 text-sm text-end">
          {transaction.category_name}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          shape="semi-round"
          size="small"
          className="w-full text-slate-50 border border-red-400 hover:bg-red-500 bg-red-400 disabled:text-slate-700"
          disabled={isPending}
          isLoading={isPending}
          onClick={handleDelete}
        >
          Yes, Delete it
        </Button>
        <Button
          shape="semi-round"
          size="small"
          className="w-full"
          disabled={isPending}
          onClick={onClose}
        >
          No, Don't delete it
        </Button>
      </div>
    </Modal>
  );
};
