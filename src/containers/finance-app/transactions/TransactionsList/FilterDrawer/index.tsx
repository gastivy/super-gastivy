import type { Dispatch, SetStateAction } from "react";
import type React from "react";

import Button from "@components/base/Button";
import DatePickerRange from "@components/base/DatePickerRange";
import Drawer from "@components/base/Drawer";
import type { DrawerProps } from "@components/base/Drawer/Drawer.types";
import MultiSelect from "@components/base/MultiSelect";
import type { Option } from "@components/base/MultiSelect/MultiSelect.types";
import { useDisplayWidth } from "@hooks/useDisplayWidth";
import { dateTime } from "@libs/dateTime";
import type { GetTransactionRequest } from "@modules/finance/transactions/models";

type FilterDrawerProps = Omit<DrawerProps, "children"> & {
  params: GetTransactionRequest;
  categoryOptions: Option[];
  walletOptions: Option[];
  setParams: Dispatch<SetStateAction<GetTransactionRequest>>;
};

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  params,
  categoryOptions,
  walletOptions,
  setParams,
  ...props
}) => {
  const { widthScreen } = useDisplayWidth();
  return (
    <Drawer className="rounded-none p-4" {...props}>
      <div className="h-full flex flex-col gap-6">
        <div className="text-limed-spruce-700 font-medium text-lg">
          Filter Transactions
        </div>

        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col gap-5">
            <DatePickerRange
              label="Date Range"
              showShortcut={widthScreen > 520}
              numberOfMonths={1}
              selected={{
                from: params.start_date
                  ? new Date(params.start_date)
                  : undefined,
                to: params.end_date ? new Date(params.end_date) : undefined,
              }}
              mode="range"
              onSelect={(range) => {
                setParams((prev) => ({
                  ...prev,
                  start_date: range?.from
                    ? dateTime.formatDate(range?.from)
                    : undefined,
                  end_date: range?.to
                    ? dateTime.formatDate(range?.to)
                    : undefined,
                }));
              }}
            />

            <MultiSelect
              value={params.category_ids}
              label="Select Category"
              placeholder="Select Category"
              options={categoryOptions}
              onSelect={(val) =>
                setParams((prev) => ({ ...prev, category_ids: val }))
              }
            />

            <MultiSelect
              label="Select Category"
              value={params.wallet_ids}
              placeholder="Select Wallet"
              options={walletOptions}
              onSelect={(val) =>
                setParams((prev) => ({ ...prev, wallet_ids: val }))
              }
            />
          </div>
          <Button className="w-full" shape="semi-round" onClick={props.onClose}>
            Apply
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
