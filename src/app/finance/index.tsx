import { createFileRoute } from "@tanstack/react-router";
import FinanceContainer from "../../containers/finance";

const FinancePage = () => {
  return <FinanceContainer />;
};

export const Route = createFileRoute("/finance/")({
  component: FinancePage,
});
