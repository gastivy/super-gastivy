import { useRouterState } from "@tanstack/react-router";

import FinanceWalletForm from "./FinanceWalletForm";
import FinanceWalletList from "./FinanceWalletList";

const FinanceWalletContainer = () => {
  const routerState = useRouterState();
  const { walletId, isCreated } = routerState.location.state;

  if (walletId || isCreated) return <FinanceWalletForm />;
  return <FinanceWalletList />;
};

export default FinanceWalletContainer;
