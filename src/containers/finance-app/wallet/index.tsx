import { useRouterState } from "@tanstack/react-router";
import FinanceWalletList from "./FinanceWalletList";
import FinanceWalletForm from "./FinanceWalletForm";

const FinanceWalletContainer = () => {
  const routerState = useRouterState();
  const { walletId, isCreated } = routerState.location.state;

  if (walletId || isCreated) return <FinanceWalletForm />;
  return <FinanceWalletList />;
};

export default FinanceWalletContainer;
