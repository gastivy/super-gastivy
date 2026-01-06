import Each from "@components/base/Each";
import Select from "@components/base/Select";
import { dateTime } from "@libs/dateTime";
import { formatter } from "@libs/formatter";
import { TypesTransactions } from "@modules/finance/category/models";
import { useSummaryCategoryTransactions } from "@modules/finance/statistics/hooks/useStatisticsFinance";
import { useEffect, useState } from "react";
import { RowData } from "./RowData";
import { SkeletonLoading } from "./SkeletonLoading";
import Conditional from "@components/base/Conditional";

interface FilterStatistics {
  year: number;
  month: number;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

const FinanceStatisticsContainer = () => {
  const [filter, setFilter] = useState<FilterStatistics>({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    startDate: undefined,
    endDate: undefined,
  });
  const yearOptions = dateTime
    .generateYears(2000)
    .map((year) => ({ label: String(year), value: year }))
    .reverse();

  const monthOptions = dateTime.generateMonths(filter.year);

  const { data, isLoading } = useSummaryCategoryTransactions(
    {
      start_date: dateTime.formatDate(filter.startDate as Date),
      end_date: dateTime.formatDate(filter.endDate as Date),
    },
    {
      enabled: Boolean(filter.startDate) && Boolean(filter.endDate),
      queryKey: ["summary-transaction-by-category", filter],
    }
  );

  const incomeTypes = [TypesTransactions.INCOME, TypesTransactions.PROFIT];
  const expenseTypes = [
    TypesTransactions.EXPENSES,
    TypesTransactions.FEE_TRANSFER,
    TypesTransactions.LOSS,
  ];

  const income =
    data?.data
      .filter((wallet) => incomeTypes.includes(wallet.type))
      .reduce((sum, wallet) => sum + wallet.money, 0) || 0;

  const expenses =
    data?.data
      .filter((transaction) => expenseTypes.includes(transaction.type))
      .reduce((sum, wallet) => sum + wallet.money, 0) || 0;

  useEffect(() => {
    const currentMonth =
      monthOptions.find((month) => month.value === filter.month)?.options || {};

    if (!filter.startDate || !filter.endDate) {
      setFilter((prev) => ({
        ...prev,
        startDate: currentMonth?.start_date,
        endDate: currentMonth?.end_date,
      }));
    }
  }, [filter]);

  return (
    <div className="flex flex-col gap-4 max-[960px]:gap-8">
      <div className="flex justify-between items-center bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-1 rounded-lg max-[960px]:shadow-xl shadow-shark-800/10">
        <div className="text-lg text-limed-spruce-700 font-medium">
          Statistics
        </div>
      </div>

      <div className="h-[calc(100dvh-124px)] flex flex-col gap-6 bg-white rounded-lg max-[960px]:mb-24 p-6">
        <div className="flex items-center gap-5">
          <Select
            value={filter.year}
            options={yearOptions}
            onSelect={(val) =>
              setFilter((prev) => ({ ...prev, year: Number(val) }))
            }
          />
          <Select
            value={filter.month}
            options={monthOptions}
            onSelect={(value, option) => {
              setFilter((prev) => ({
                ...prev,
                month: Number(value),
                startDate: (option.options as Record<string, Date>)?.start_date,
                endDate: (option.options as Record<string, Date>)?.end_date,
              }));
            }}
          />
        </div>

        <div className="border-b border-gray-200" />

        <Conditional if={isLoading}>
          <SkeletonLoading />
        </Conditional>
        <Conditional if={!isLoading && (data?.data || []).length > 0}>
          <div className="flex flex-col gap-2 overflow-y-auto">
            <Each
              of={data?.data || []}
              render={(item) => (
                <RowData
                  label={item.name}
                  key={item.id}
                  value={formatter.currency(item.money)}
                />
              )}
            />
            <div className="border-b border-gray-300" />
            <div className="flex flex-col gap-2 py-2">
              <RowData label="Income" value={formatter.currency(income)} />
              <RowData
                label="Expenses"
                className="text-red-400"
                value={formatter.currency(expenses * -1)}
              />
            </div>
            <div className="border-b border-gray-300" />
            <RowData
              label="Balance"
              className="font-medium text-limed-spruce-800"
              value={formatter.currency(income - expenses)}
            />
          </div>
        </Conditional>
      </div>
    </div>
  );
};

export default FinanceStatisticsContainer;
