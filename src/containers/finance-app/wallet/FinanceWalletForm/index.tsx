import Button from "@components/base/Button";

import InputText from "@components/base/InputText";
import Select from "@components/base/Select";
import { routes } from "@constants/routes";
import { walletTypeOptions } from "@constants/wallets";
import { yupResolver } from "@hookform/resolvers/yup";
import { setValues } from "@libs/react-hooks-form-libs";
import {
  useCreateWallet,
  useGetDetailWallet,
  useUpdateWallet,
} from "@modules/finance/wallet/hooks/useWallet";
import type { CreateWalletRequest } from "@modules/finance/wallet/models";
import { schemaWallet } from "@modules/finance/wallet/schema";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";

const FinanceWalletForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const routerState = useRouterState();
  const { isCreated, walletId } = routerState.location.state;

  const {
    control,
    formState: { errors },
    handleSubmit: onSubmit,
    register,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schemaWallet),
    defaultValues: {
      name: "",
      balance: undefined,
      type: undefined,
    },
  });

  const form = useWatch({ control });

  const { data } = useGetDetailWallet(String(walletId), {
    enabled: Boolean(walletId),
    queryKey: ["wallet-detail", walletId],
  });

  const { mutate: createWallet } = useCreateWallet({
    onSuccess: () => {
      reset();
      navigate({ to: routes.finance.wallet.path });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });

  const { mutate: updateWallet } = useUpdateWallet({
    onSuccess: () => {
      reset();
      navigate({ to: routes.finance.wallet.path });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });

  const handleBack = () => {
    reset();
    navigate({ to: routes.finance.wallet.path });
  };

  const handleSubmit: SubmitHandler<CreateWalletRequest> = (form) => {
    if (walletId) {
      updateWallet({ ...form, id: String(walletId || "") });
      return;
    }

    createWallet(form);
  };

  const title = (() => (isCreated ? "Create Wallet" : "Edit Wallet"))();

  useEffect(() => {
    if (data?.data) {
      setValues(setValue, {
        name: data?.data.name,
        balance: data?.data.balance,
        type: data?.data.type,
      });
    }
  }, [data?.data]);

  return (
    <div className="flex flex-col gap-4 max-[960px]:gap-8 max-[960px]:pb-24">
      <div className="flex justify-between items-center gap-2 bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-1 rounded-lg max-[960px]:shadow-xl shadow-shark-800/10">
        <div className="flex items-center gap-2">
          <IconArrowNarrowLeft
            size={28}
            className="cursor-pointer"
            onClick={handleBack}
          />
          <div className="text-lg font-medium">{title}</div>
        </div>

        <Button shape="semi-round" onClick={onSubmit(handleSubmit)}>
          {walletId ? "Update" : "Create"}
        </Button>
      </div>

      <div className="h-[calc(100dvh-130px)] max-[960px]:h-[calc(100dvh-190px)] overflow-y-auto max-[960px]:overflow-x-auto flex flex-col gap-6 bg-white rounded-lg p-6 max-[960px]:p-4">
        <InputText
          label="Wallet Name"
          value={form.name}
          shape="semi-rounded"
          placeholder="Input Wallet Name"
          error={errors.name?.message}
          {...register("name")}
        />

        <InputText
          type="number"
          value={form.balance}
          label="Wallet Balance"
          prefix={<div className="text-sm text-limed-spruce-800">Rp</div>}
          shape="semi-rounded"
          placeholder="Wallet Balance Name"
          disabled={Boolean(walletId)}
          error={errors.balance?.message}
          onChangeInput={(val) => setValue("balance", Number(val || ""))}
        />

        <Select
          label="Wallet Type"
          value={form.type}
          placeholder="Select Wallet Type"
          error={errors.type?.message}
          options={walletTypeOptions}
          onSelect={(val) => setValue("type", Number(val || ""))}
        />
      </div>
    </div>
  );
};

export default FinanceWalletForm;
