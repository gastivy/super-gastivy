import { createFileRoute } from "@tanstack/react-router";

import FinanceStatisticsContainer from "@containers/finance-app/statistics";

const FinanceStatisticsPage = () => {
  return <FinanceStatisticsContainer />;
};

export const Route = createFileRoute("/(app)/_layout/finance/statistic/")({
  component: FinanceStatisticsPage,
});
