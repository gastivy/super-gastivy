import { useRouterState } from "@tanstack/react-router";

import TransactionsForm from "./TransactionsForm";
import TransactionsList from "./TransactionsList";

const TransactionsContainer = () => {
  const routerState = useRouterState();
  const { transactionId, isCreated } = routerState.location.state;

  if (transactionId || isCreated) return <TransactionsForm />;
  return <TransactionsList />;
};

export default TransactionsContainer;
