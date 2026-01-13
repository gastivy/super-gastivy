import Each from "@components/base/Each";
import { dateTime } from "@libs/dateTime";
import { useInfiniteTransactions } from "@modules/finance/transactions/hooks/useTransaction";
import type {
  GetTransactionRequest,
  Transactions,
} from "@modules/finance/transactions/models";
import { useMemo, useState } from "react";
import { CardTransactions } from "./CardTransactions";
import InfiniteScroll from "@components/base/InfiniteScroll";
import DatePickerRange from "@components/base/DatePickerRange";
import Conditional from "@components/base/Conditional";
import { SkeletonLoading } from "./SkeletonLoading";
import { useDisplayWidth } from "@hooks/useDisplayWidth";
import { useGetCategoryTransaction } from "@modules/finance/category/hooks/useCategoryTransaction";
import { useGetWallet } from "@modules/finance/wallet/hooks/useWallet";
import MultiSelect from "@components/base/MultiSelect";
import { FilterDrawer } from "./FilterDrawer";
import useDisclosure from "@hooks/useDisclosure";
import Icon from "@components/base/Icon";
import Button from "@components/base/Button";
import { useNavigate } from "@tanstack/react-router";
import { routes } from "@constants/routes";

const TransactionsList = () => {
  const navigate = useNavigate();
  const { widthScreen } = useDisplayWidth();
  const { isOpen, onClose, onOpen } = useDisclosure({ open: false });
  const [params, setParams] = useState<GetTransactionRequest>({
    start_date: undefined,
    end_date: undefined,
    category_ids: [],
    wallet_ids: [],
  });

  const { isLoading, isFetchingNextPage, data, hasNextPage, fetchNextPage } =
    useInfiniteTransactions({ ...params });

  const { data: categoryData } = useGetCategoryTransaction();

  const { data: walletData } = useGetWallet();

  const categoryOptions = useMemo(
    () =>
      categoryData?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      })) || [],
    [categoryData]
  );

  const walletOptions = useMemo(
    () =>
      walletData?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      })) || [],
    [categoryData]
  );

  const transactions = useMemo(
    () => data?.pages?.flatMap((res) => res.data || []) || [],
    [data]
  );

  const transactionsLog = (() => {
    const grouped: { [key: string]: Transactions[] } = {};

    transactions.forEach((transaction) => {
      const date = dateTime
        .convertToLocalTime(String(transaction.date))
        .split("T")[0];

      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });

    return Object.keys(grouped).map((date) => ({
      key: date,
      log: grouped[date],
    }));
  })();

  const handleCreate = () => {
    navigate({
      to: routes.finance.transactions.path,
      state: (prev) => ({ ...prev, isCreated: true }),
    });
  };

  return (
    <div className="flex flex-col gap-4 max-[960px]:gap-8">
      <Conditional if={widthScreen < 720}>
        {/* Filter Drawer */}``
        <FilterDrawer
          isOpen={isOpen}
          params={params}
          isFullHeight
          categoryOptions={categoryOptions}
          walletOptions={walletOptions}
          setParams={setParams}
          onClose={onClose}
        />
      </Conditional>

      <div className="flex justify-between items-center bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-10 rounded-lg max-[960px]:shadow-xl shadow-shark-800/10">
        <div className="text-lg text-limed-spruce-700 font-medium">
          Transactions
        </div>

        <Button shape="semi-round" onClick={handleCreate}>
          Create
        </Button>
      </div>
      <div className="max-h-[calc(100dvh-130px)] max-[960px]:h-[calc(100dvh-200px)] flex flex-col gap-5 max-[960px]:mb-24 bg-white rounded-lg p-6 max-[560px]:p-4">
        <div className="flex items-center gap-4">
          <DatePickerRange
            showShortcut={widthScreen > 520}
            numberOfMonths={1}
            selected={{
              from: params.start_date ? new Date(params.start_date) : undefined,
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

          <Conditional if={widthScreen > 720}>
            <MultiSelect
              value={params.category_ids}
              placeholder="Select Category"
              wrapperClassName="max-w-[25%]"
              options={categoryOptions}
              onSelect={(val) =>
                setParams((prev) => ({ ...prev, category_ids: val }))
              }
            />
            <MultiSelect
              value={params.wallet_ids}
              wrapperClassName="max-w-[25%]"
              placeholder="Select Wallet"
              options={walletOptions}
              onSelect={(val) =>
                setParams((prev) => ({ ...prev, wallet_ids: val }))
              }
            />
          </Conditional>
          <Conditional if={widthScreen < 720}>
            <div
              className="w-8.5 h-8.5 flex justify-center items-center border border-gray-300 rounded p-0.5"
              onClick={onOpen}
            >
              <Icon name="Filter-solid" className="text-gray-400" size={18} />
            </div>
          </Conditional>
        </div>

        <div className="border-b border-gray-300" />

        <Conditional if={isLoading}>
          <SkeletonLoading />
        </Conditional>

        <Conditional if={!isLoading && transactionsLog.length > 0}>
          <InfiniteScroll
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            onNextPage={fetchNextPage}
            className="relative flex flex-col gap-4 overflow-y-auto"
          >
            <Each
              of={transactionsLog}
              render={(item) => (
                <div key={item.key}>
                  <div className="sticky top-0 px-4 py-1 rounded-full w-max mx-auto text-center transition-all duration-200 text-shark-900 text-sm font-medium bg-green-yellow-200 z-1">
                    {dateTime.getDate(new Date(item.key), "en-GB", {
                      dateStyle: "long",
                    })}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Each
                      of={item.log}
                      render={(transaction, index) => (
                        <CardTransactions
                          key={`${transaction.id}-${index}`}
                          transaction={transaction}
                          hasOptions
                        />
                      )}
                    />
                  </div>
                </div>
              )}
            />
          </InfiniteScroll>
        </Conditional>
      </div>
    </div>
  );
};

export default TransactionsList;
