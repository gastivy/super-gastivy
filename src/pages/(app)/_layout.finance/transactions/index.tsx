import { createFileRoute } from "@tanstack/react-router";

import TransactionsContainer from "@containers/finance-app/transactions";

const FinanceTransactionsPage = () => {
  return <TransactionsContainer />;
};

export const Route = createFileRoute("/(app)/_layout/finance/transactions/")({
  component: FinanceTransactionsPage,
});
