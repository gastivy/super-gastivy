import Button from "@components/base/Button";
import Icon from "@components/base/Icon";
import InputText from "@components/base/InputText";
import Select from "@components/base/Select";
import { routes } from "@constants/routes";
import { typeTransactionOptions } from "@constants/transactions";
import { yupResolver } from "@hookform/resolvers/yup";
import { setValues } from "@libs/react-hooks-form-libs";
import {
  useCreateCategoryTransaction,
  useDeleteCategoryTransaction,
  useGetDetailCategoryTransaction,
  useUpdateCategoryTransaction,
} from "@modules/finance/category/hooks/useCategoryTransaction";
import type { CategoryTransactionRequest } from "@modules/finance/category/models";
import { schemaCategoryTransaction } from "@modules/finance/category/schema/category";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

const FinanceCategoriesForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const routerState = useRouterState();
  const { categoryId } = routerState.location.state;

  const { data } = useGetDetailCategoryTransaction(categoryId as string, {
    enabled: Boolean(categoryId),
    queryKey: ["category-transaction-by-id", categoryId],
  });
  const { name, type } = data?.data || {};

  const handleBack = () => {
    reset();
    navigate({ to: routes.finance.categories.path });
  };

  const { isPending: isPendingDelete, mutate: deleteCategoryTransaction } =
    useDeleteCategoryTransaction({
      onSuccess: () => {
        handleBack();
        queryClient.invalidateQueries({ queryKey: ["category-transaction"] });
      },
    });

  const { isPending: isPendingCreate, mutate: createCategoryTransaction } =
    useCreateCategoryTransaction({
      onSuccess: () => {
        handleBack();
        queryClient.invalidateQueries({ queryKey: ["category-transaction"] });
      },
    });

  const { isPending: isPendingUpdate, mutate: updateCategoryTransaction } =
    useUpdateCategoryTransaction({
      onSuccess: () => {
        handleBack();
        queryClient.invalidateQueries({
          queryKey: ["category-transaction"],
        });
      },
    });

  const {
    register,
    control,
    handleSubmit: onSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaCategoryTransaction),
  });

  const handleDelete = () => {
    deleteCategoryTransaction({ categoryId: String(categoryId || "") });
  };

  const handleSubmit: SubmitHandler<CategoryTransactionRequest> = (form) => {
    if (categoryId) {
      updateCategoryTransaction({ ...form, id: String(categoryId || "") });
      return;
    }

    createCategoryTransaction(form);
  };

  useEffect(() => {
    if (data?.data) {
      setValues(setValue, { name, type });
    }
  }, [data?.data]);

  return (
    <div className="flex flex-col gap-4 max-[960px]:gap-8 max-[960px]:pb-24">
      <div className="flex justify-between items-center gap-2 bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-1 rounded-lg max-[960px]:shadow-xl shadow-shark-800/10">
        <div className="flex items-center gap-2">
          <Icon
            name="Arrow-Left-outline"
            size={28}
            className="cursor-pointer"
            onClick={handleBack}
          />
          <div className="text-lg font-medium">Category Transactions</div>
        </div>

        <Button
          isLoading={isPendingCreate || isPendingUpdate || isPendingDelete}
          shape="semi-round"
          onClick={onSubmit(handleSubmit)}
        >
          {categoryId ? "Update" : "Create"}
        </Button>
      </div>

      <div className="h-[calc(100dvh-130px)] max-[960px]:h-[calc(100dvh-190px)] overflow-y-auto max-[960px]:overflow-x-auto flex flex-col justify-between gap-6 bg-white rounded-lg p-6 max-[960px]:p-4">
        <div className="flex flex-col gap-6">
          <InputText
            value={name}
            label="Category Transactions Name"
            shape="semi-rounded"
            placeholder="Input Category Transactions Name"
            error={errors.name?.message}
            {...register("name")}
          />

          <Controller
            name="type"
            control={control}
            rules={{
              required: "Activity Category is Required",
            }}
            render={({ field }) => (
              <Select
                value={field.value}
                label="Type Transactions Name"
                shape="semi-rounded"
                placeholder="Select Type Transactions Name"
                error={errors.type?.message}
                options={typeTransactionOptions}
                onSelect={(val) => field.onChange(Number(val || ""))}
              />
            )}
          />
        </div>

        {Boolean(categoryId) && (
          <Button
            className="w-full bg-red-400 text-white border-none hover:bg-red-500"
            shape="semi-round"
            isLoading={isPendingCreate || isPendingUpdate || isPendingDelete}
            disabled={isPendingCreate || isPendingUpdate || isPendingDelete}
            onClick={handleDelete}
          >
            <Icon name="Trash-outline" className="text-white" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default FinanceCategoriesForm;
