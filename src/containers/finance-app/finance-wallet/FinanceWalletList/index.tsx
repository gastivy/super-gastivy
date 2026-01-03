import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import Icon from "@components/base/Icon";
import { cn } from "@libs/classnames";
import { formatter } from "@libs/formatter";
import { useGetWallet } from "@modules/finance/wallet/hooks/useWallet";
import { SkeletonLoading } from "./SkeletonLoading";
import EmptyState from "@components/base/EmptyState";
import { Assets } from "@assets/illustrations";
import { useNavigate } from "@tanstack/react-router";
import { routes } from "@constants/routes";
import Button from "@components/base/Button";

const FinanceWalletList = () => {
  const navigate = useNavigate();
  const { data, isRefetching, isLoading } = useGetWallet();

  const handleAddWallet = () => {
    navigate({
      to: routes.finance.wallet.path,
      state: (prev) => ({ ...prev, isCreated: true }),
    });
  };

  return (
    <div className="flex flex-col gap-4 max-[960px]:gap-8">
      <div className="flex justify-between items-center bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-1 rounded-lg max-[960px]:shadow-xl shadow-shark-800/10">
        <div className="text-lg text-limed-spruce-700 font-medium">Wallet</div>
        <Button shape="semi-round" onClick={handleAddWallet}>
          Create New Wallet
        </Button>
      </div>

      <div
        className={cn(
          "max-h-[calc(100dvh-130px)] max-[960px]:h-[calc(100dvh-200px)] overflow-y-auto max-[960px]:mb-24",
          ((data?.data || []).length === 0 || isLoading) &&
            "bg-white rounded-lg"
        )}
      >
        <Conditional if={isLoading || isRefetching}>
          <SkeletonLoading />
        </Conditional>

        <Conditional if={!isLoading && (data?.data || []).length === 0}>
          <div className="flex flex-col justify-center items-center">
            <EmptyState
              src={Assets.ActivityEmpty}
              title="Wallet List is empty"
              className="h-[calc(100dvh-130px)] max-[960px]:h-[calc(100dvh-200px)] max-w-90"
              description="You don't have any wallet yet. Create one to start organizing your finance."
            />
          </div>
        </Conditional>

        <Conditional if={(data?.data || []).length > 0}>
          <div className="grid auto-rows-max grid-cols-3 max-[1100px]:grid-cols-2 max-[678px]:grid-cols-1 gap-4">
            <Each
              of={data?.data || []}
              render={(wallet) => (
                <div
                  key={wallet.id}
                  className="flex items-center gap-4 bg-white p-4 rounded-md cursor-pointer"
                  onClick={() =>
                    navigate({
                      to: routes.finance.wallet.path,
                      state: (prev) => ({ ...prev, walletId: wallet.id }),
                    })
                  }
                >
                  <div className="flex justify-center items-center bg-green-yellow-400 p-3 rounded-lg">
                    <Icon
                      name="Wallet-outline"
                      size={32}
                      className="text-limed-spruce-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="font-medium text-limed-spruce-800">
                      {wallet.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatter.currency(wallet.balance)}
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </Conditional>
      </div>
    </div>
  );
};

export default FinanceWalletList;
