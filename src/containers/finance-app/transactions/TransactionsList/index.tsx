import Each from "@components/base/Each";
import { dateTime } from "@libs/dateTime";
import { useInfiniteTransactions } from "@modules/finance/transactions/hooks/useTransaction";
import type { Transactions } from "@modules/finance/transactions/models";
import { useMemo } from "react";
import { CardTransactions } from "./CardTransactions";
import InputText from "@components/base/InputText";
import InfiniteScroll from "@components/base/InfiniteScroll";

const TransactionsList = () => {
  const {
    // isRefetching,
    // isLoading,
    isFetchingNextPage,
    data,
    hasNextPage,
    fetchNextPage,
    // refetch,
  } = useInfiniteTransactions({
    // ...(!lodash.isObjectEmpty(currentRange) && { ...currentRange }),
    // ...(idCategories.length > 0 && { category_ids: idCategories }),
    // ...(idsWallet.length > 0 && { wallet_ids: idsWallet }),
  });

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

  return (
    <div className="flex flex-col gap-4 max-[960px]:gap-8">
      <div className="flex justify-between items-center bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-10 rounded-lg max-[960px]:shadow-xl shadow-shark-800/10">
        <div className="text-lg text-limed-spruce-700 font-medium">
          Transactions
        </div>
      </div>

      <div className="max-h-[calc(100dvh-130px)] max-[960px]:h-[calc(100dvh-200px)] flex flex-col gap-5 max-[960px]:mb-24 bg-white rounded-lg p-6">
        <div className="flex items-center gap-4">
          <InputText shape="semi-rounded" />
          <InputText shape="semi-rounded" />
        </div>

        <div className="border-b border-gray-300" />

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
                      />
                    )}
                  />
                </div>
              </div>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default TransactionsList;
