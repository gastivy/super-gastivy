import { createFileRoute } from "@tanstack/react-router";
import FinanceWalletContainer from "@containers/finance-app/finance-wallet";

const FinanceWalletPage = () => {
  return <FinanceWalletContainer />;
};

export const Route = createFileRoute("/(app)/_layout/finance/wallet/")({
  component: FinanceWalletPage,
});
