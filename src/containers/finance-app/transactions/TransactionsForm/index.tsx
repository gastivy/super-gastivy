import { type MouseEvent, useEffect, useMemo } from "react";
import {
  Controller,
  type SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  IconArrowNarrowLeft,
  IconChevronDown,
  IconTrash,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouterState } from "@tanstack/react-router";

import Button from "@components/base/Button";
import Conditional from "@components/base/Conditional";
import DatePicker from "@components/base/DatePicker";
import Disclosure from "@components/base/Disclosure";
import Each from "@components/base/Each";
import InputText from "@components/base/InputText";
import Select from "@components/base/Select";
import TextArea from "@components/base/TextArea";
import { routes } from "@constants/routes";
import type { useDisclosureProps } from "@hooks/useDisclosure";
import { useGetCategoryTransaction } from "@modules/finance/category/hooks/useCategoryTransaction";
import { TypesTransactions } from "@modules/finance/category/models";
import { schemaTransaction } from "@modules/finance/category/schema/category";
import {
  useCreateTransactions,
  useGetDetailTransactions,
  useUpdateTransactions,
} from "@modules/finance/transactions/hooks/useTransaction";
import type { CreateTransactionRequest } from "@modules/finance/transactions/models";
import { useGetWallet } from "@modules/finance/wallet/hooks/useWallet";

import { SkeletonLoading } from "./SkeletonLoading";

const TransactionsForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const routerState = useRouterState();
  const { transactionId, isCreated } = routerState.location.state;
  const { data } = useGetCategoryTransaction();
  const { data: walletData } = useGetWallet();
  const { data: detailTransaction, isLoading } = useGetDetailTransactions(
    transactionId as string,
    {
      queryKey: ["detail-transaction", transactionId],
      enabled: Boolean(transactionId),
    }
  );
  const { mutate: createTransactions, isPending: isPendingCreate } =
    useCreateTransactions({
      onSuccess: () => {
        reset();
        navigate({ to: routes.finance.transactions.path });
        queryClient.invalidateQueries({ queryKey: ["infinite-transactions"] });
        queryClient.invalidateQueries({ queryKey: ["balance"] });
      },
    });
  const { mutate: updateTransaction, isPending: isPendingUpdate } =
    useUpdateTransactions({
      onSuccess: () => {
        reset();
        navigate({ to: routes.finance.transactions.path });
        queryClient.invalidateQueries({ queryKey: ["infinite-transactions"] });
        queryClient.invalidateQueries({ queryKey: ["balance"] });
      },
    });

  const originWallet = [
    TypesTransactions.EXPENSES,
    TypesTransactions.TRANSFER,
    TypesTransactions.PROFIT,
    TypesTransactions.PROFIT,
  ];

  const destinationWallet = [
    TypesTransactions.INCOME,
    TypesTransactions.TRANSFER,
  ];

  const defaultTransaction = {
    category_id: "",
    name: "",
    description: undefined,
    from_wallet: "",
    to_wallet: "",
    money: 0,
    fee: 0,
    type: 0,
    date: new Date(),
  };

  const {
    control,
    register,
    watch,
    handleSubmit: onSubmit,
    setValue,
    reset,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaTransaction),
    defaultValues: {
      transactions: [
        {
          category_id: "",
          name: "",
          description: undefined,
          from_wallet: "",
          to_wallet: "",
          money: 0,
          fee: 0,
          type: 0,
          date: undefined,
        },
      ],
    },
  });
  const { append, remove } = useFieldArray({
    control,
    name: "transactions",
  });
  const fields = watch("transactions");

  const categoryTransactionOptions = useMemo(() => {
    return (
      data?.data
        .filter((item) => item.type !== TypesTransactions.FEE_TRANSFER)
        .map((transaction) => ({
          label: transaction.name,
          value: transaction.id,
        })) || []
    );
  }, [data?.data]);

  const walletOptions = useMemo(
    () =>
      walletData?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      })) || [],
    [walletData?.data]
  );

  const handleDelete = (e: MouseEvent<HTMLDivElement>, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    remove(index);
  };

  const getTypeTransaction = (categoryId: string) => {
    return data?.data.find((category) => category.id === categoryId)?.type || 0;
  };

  const handleResetFieldByIndex = (index: number) => {
    resetField(`transactions.${index}.name`);
    resetField(`transactions.${index}.description`);
    resetField(`transactions.${index}.from_wallet`);
    resetField(`transactions.${index}.to_wallet`);
    resetField(`transactions.${index}.fee`);
    resetField(`transactions.${index}.money`);
    setValue(`transactions.${index}.date`, new Date());
  };

  const handleSubmit: SubmitHandler<CreateTransactionRequest> = (form) => {
    const payload = form.transactions.map((item) => ({
      category_id: item.category_id,
      name: item.name,
      description: item.description,
      money: item.money,
      date: item.date,
      ...(item.fee && { fee: item.fee }),
      ...(item.from_wallet && { from_wallet: item.from_wallet }),
      ...(item.to_wallet && { to_wallet: item.to_wallet }),
    }));

    if (isCreated) {
      createTransactions({ transactions: payload });
      return;
    }

    if (!isCreated && transactionId) {
      updateTransaction({
        id: transactionId as string,
        ...payload[0],
      });
    }
  };

  const handleBack = () => {
    reset();
    navigate({ to: routes.finance.transactions.path });
  };

  useEffect(() => {
    if (detailTransaction && detailTransaction.data) {
      setValue(
        `transactions.${0}.category_id`,
        detailTransaction.data.category_id
      );
      setValue(`transactions.${0}.name`, detailTransaction.data.name);
      setValue(
        `transactions.${0}.description`,
        detailTransaction.data.description || ""
      );
      setValue(
        `transactions.${0}.from_wallet`,
        detailTransaction.data.from_wallet || ""
      );
      setValue(
        `transactions.${0}.to_wallet`,
        detailTransaction.data.to_wallet || ""
      );
      setValue(`transactions.${0}.money`, detailTransaction.data.money);
      setValue(`transactions.${0}.date`, detailTransaction.data.date);
      setValue(`transactions.${0}.fee`, detailTransaction.data.fee);
    }
  }, [detailTransaction]);

  return (
    <div className="flex flex-col gap-4 max-[960px]:gap-8 max-[960px]:pb-24">
      <div className="flex justify-between items-center gap-2 bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-1 rounded-lg max-[960px]:shadow-xl shadow-zinc-800/10">
        <div className="flex items-center gap-2">
          <IconArrowNarrowLeft
            size={28}
            className="cursor-pointer"
            onClick={handleBack}
          />
          <div className="text-lg font-medium">Category Transactions</div>
        </div>

        <Button
          isLoading={isPendingCreate || isPendingUpdate}
          disabled={isPendingCreate || isPendingUpdate}
          shape="semi-round"
          onClick={onSubmit(handleSubmit)}
        >
          {transactionId ? "Update" : "Create"}
        </Button>
      </div>

      <div className="h-[calc(100dvh-130px)] max-[960px]:h-[calc(100dvh-190px)] max-[960px]:overflow-x-auto flex flex-col gap-6 bg-white rounded-lg p-6 max-[960px]:p-4">
        <div className="flex justify-between border-b border-gray-300 pb-4">
          <div className="text-base font-medium">Transactions Items</div>
          <Conditional if={isCreated as boolean}>
            <Button
              size="small"
              shape="semi-round"
              isLoading={isPendingCreate || isPendingUpdate}
              disabled={isPendingCreate || isPendingUpdate}
              onClick={() => append(defaultTransaction)}
            >
              Add
            </Button>
          </Conditional>
        </div>

        <Conditional if={isLoading}>
          <SkeletonLoading />
        </Conditional>

        <Conditional if={!isLoading}>
          <div className="h-full flex flex-col gap-4 overflow-y-auto">
            <Each
              of={fields}
              render={(transaction, index) => {
                const type = getTypeTransaction(transaction.category_id);
                return (
                  <Disclosure
                    defaultOpen
                    className="flex flex-col gap-3"
                    key={index}
                  >
                    {({ isOpen, onToggle }: useDisclosureProps) => (
                      <>
                        <Conditional if={isCreated as boolean}>
                          <div
                            className="flex justify-between items-center border-b border-gray-200 py-2 cursor-pointer"
                            onClick={onToggle}
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-sm text-slate-400 font-medium">
                                Transaction #{index + 1}
                              </div>
                              <Conditional if={fields.length > 1}>
                                <div onClick={(e) => handleDelete(e, index)}>
                                  <IconTrash
                                    stroke={2}
                                    size={24}
                                    className="text-red-400 cursor-pointer bg-red-50 hover:bg-red-100 rounded p-1"
                                  />
                                </div>
                              </Conditional>
                            </div>
                            <IconChevronDown size={20} />
                          </div>
                        </Conditional>

                        {isOpen && (
                          <div className="grid grid-cols-2 max-[580px]:grid-cols-1 gap-4">
                            <Controller
                              name={`transactions.${index}.category_id`}
                              control={control}
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  label="Category Transactions"
                                  placeholder="Input Category Transactions"
                                  options={categoryTransactionOptions}
                                  error={
                                    errors.transactions?.[index]?.category_id
                                      ?.message
                                  }
                                  onSelect={(val) => {
                                    handleResetFieldByIndex(index);
                                    setValue(
                                      `transactions.${index}.type`,
                                      getTypeTransaction(val as string)
                                    );
                                    field.onChange(val);
                                  }}
                                />
                              )}
                            />

                            {originWallet.includes(
                              type as TypesTransactions
                            ) && (
                              <Controller
                                name={`transactions.${index}.from_wallet`}
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    value={field.value}
                                    label="Origin Wallet"
                                    placeholder="Select Origin Wallet"
                                    options={walletOptions.filter(
                                      (item) =>
                                        item.value !== transaction.to_wallet
                                    )}
                                    error={
                                      errors.transactions?.[index]?.from_wallet
                                        ?.message
                                    }
                                    onSelect={(val) => field.onChange(val)}
                                  />
                                )}
                              />
                            )}

                            {destinationWallet.includes(
                              type as TypesTransactions
                            ) && (
                              <Controller
                                name={`transactions.${index}.to_wallet`}
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    value={field.value}
                                    label="Destination Wallet"
                                    placeholder="Select Destination Wallet"
                                    options={walletOptions.filter(
                                      (item) =>
                                        item.value !== transaction.from_wallet
                                    )}
                                    error={
                                      errors.transactions?.[index]?.to_wallet
                                        ?.message
                                    }
                                    onSelect={(val) => field.onChange(val)}
                                  />
                                )}
                              />
                            )}

                            <InputText
                              label="Note"
                              value={transaction.name}
                              shape="semi-rounded"
                              placeholder="Input Note"
                              error={
                                errors.transactions?.[index]?.name?.message
                              }
                              {...register(`transactions.${index}.name`)}
                            />

                            <InputText
                              label="Input Money"
                              value={transaction.money}
                              prefix={<div className="text-sm">Rp</div>}
                              type="number"
                              shape="semi-rounded"
                              placeholder="Input Money"
                              error={
                                errors.transactions?.[index]?.money?.message
                              }
                              onChangeInput={(val) =>
                                setValue(
                                  `transactions.${index}.money`,
                                  Number(val || "")
                                )
                              }
                            />

                            {type === TypesTransactions.TRANSFER && (
                              <InputText
                                label="Fee Transfer"
                                value={transaction.fee}
                                prefix={<div className="text-sm">Rp</div>}
                                type="number"
                                shape="semi-rounded"
                                placeholder="Input Fee Transfer"
                                onChangeInput={(val) =>
                                  setValue(
                                    `transactions.${index}.fee`,
                                    Number(val || "")
                                  )
                                }
                              />
                            )}

                            <Controller
                              name={`transactions.${index}.date`}
                              control={control}
                              render={({ field }) => (
                                <DatePicker
                                  value={field.value}
                                  label="Date"
                                  error={
                                    errors.transactions?.[index]?.date?.message
                                  }
                                  onSelect={(val) => field.onChange(val)}
                                />
                              )}
                            />

                            <TextArea
                              label="Description"
                              shape="semi-rounded"
                              placeholder="Input Description"
                              className="resize-none"
                              maxLength={2000}
                              {...register(`transactions.${index}.description`)}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </Disclosure>
                );
              }}
            />
          </div>
        </Conditional>
      </div>
    </div>
  );
};

export default TransactionsForm;
