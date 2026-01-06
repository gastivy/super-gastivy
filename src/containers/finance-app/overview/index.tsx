import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import Icon from "@components/base/Icon";
import { formatter } from "@libs/formatter";
import { TypesTransactions } from "@modules/finance/category/models";
import { useGetTransactions } from "@modules/finance/transactions/hooks/useTransaction";
import { useNavigate } from "@tanstack/react-router";
import { SkeletonLoading } from "./SkeletonLoading";
import EmptyState from "@components/base/EmptyState";
import { Assets } from "@assets/illustrations";
import { routes } from "@constants/routes";
import useDisclosure from "@hooks/useDisclosure";

const FinanceOverviewContainer = () => {
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure({ open: false });
  const LIMIT_TRANSACTIONS = 5;

  const { data, isLoading } = useGetTransactions({
    limit: LIMIT_TRANSACTIONS,
  });

  const getValueTransaction = (type: TypesTransactions, value?: number) => {
    if ([TypesTransactions.INCOME, TypesTransactions.PROFIT].includes(type)) {
      return {
        className: "text-sm text-green-400",
        money: `+${formatter.currency(value)}`,
      };
    }

    if (
      [
        TypesTransactions.EXPENSES,
        TypesTransactions.FEE_TRANSFER,
        TypesTransactions.LOSS,
      ].includes(type)
    ) {
      return {
        className: "text-sm text-red-400",
        money: `-${formatter.currency(value)}`,
      };
    }

    if (type === TypesTransactions.TRANSFER) {
      return {
        className: "text-sm text-gray-400",
        money: formatter.currency(value),
      };
    }
  };

  return (
    <div className="flex flex-col gap-4 max-[960px]:gap-8">
      <div className="flex justify-between items-center bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-10 rounded-lg max-[960px]:shadow-xl shadow-shark-800/10">
        <div className="text-lg text-limed-spruce-700 font-medium">
          Overview
        </div>
      </div>

      <div className="h-[calc(100dvh-124px)] flex gap-6 rounded-lg max-[960px]:mb-24">
        <div className="w-full flex flex-col gap-6 bg-white p-4 rounded-lg">
          <div className="w-full min-h-36 relative bg-green-yellow-400/85 p-4 rounded-lg overflow-hidden">
            <div className="w-84 h-84 bg-green-yellow-400 rounded-full absolute -left-28 -top-10 z-1" />
            <div className="w-20 h-20 bg-white/30 rounded-full absolute right-16 top-7 z-1" />
            <div className="w-20 h-20 bg-white/50 rounded-full absolute right-4 top-7 z-1" />

            <div className="flex flex-col gap-6 absolute z-2">
              <div className="text-limed-spruce-700 font-medium text-xl">
                Ganna Prasetya
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm text-limed-spruce-700">
                  Current Balance
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-medium text-limed-spruce-700">
                    {isOpen ? formatter.currency(120003434) : "Rp ********"}
                  </div>
                  <Icon
                    name={isOpen ? "Eye-outline" : "Hide-outline"}
                    className="cursor-pointer"
                    size={20}
                    onClick={onToggle}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="text-limed-spruce-700">Last Transactions</div>
              <div
                className="text-gray-400 cursor-pointer"
                onClick={() =>
                  navigate({ to: routes.finance.transactions.path })
                }
              >
                See All
              </div>
            </div>

            <div className="h-[calc(100dvh-360px)] flex flex-col overflow-y-auto">
              <Conditional if={isLoading}>
                <SkeletonLoading />
              </Conditional>

              <Conditional if={!isLoading && (data?.data || []).length === 0}>
                <EmptyState
                  src={Assets.ActivityEmpty}
                  title="Transactions is empty"
                  className="max-w-90 mx-auto"
                  description="You don't have any transactions yet. Create one to start organizing your transactions."
                />
              </Conditional>

              <Conditional if={!isLoading && (data?.data || []).length > 0}>
                <Each
                  of={data?.data || []}
                  render={(item) => (
                    <div
                      key={item.id}
                      className="flex justify-between py-4 border-t border-gray-300"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="text-limed-spruce-900">{item.name}</div>
                        <div className="text-sm text-gray-400">
                          {item.category_name}
                        </div>
                      </div>
                      <div className="w-36 flex flex-col items-end gap-1">
                        <div className="text-sm text-limed-spruce-600 font-medium">
                          {item.from_wallet_name}
                        </div>
                        <div
                          className={
                            getValueTransaction(item.type, item.money)
                              ?.className
                          }
                        >
                          {getValueTransaction(item.type, item.money)?.money}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </Conditional>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceOverviewContainer;
