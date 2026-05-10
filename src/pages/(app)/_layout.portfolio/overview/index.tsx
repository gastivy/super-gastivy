import { createFileRoute } from "@tanstack/react-router";

import PortfolioOverviewContainer from "@containers/portfolio-app/overview";

const PortfolioOverviewPage = () => {
  return <PortfolioOverviewContainer />;
};

export const Route = createFileRoute("/(app)/_layout/portfolio/overview/")({
  component: PortfolioOverviewPage,
});
