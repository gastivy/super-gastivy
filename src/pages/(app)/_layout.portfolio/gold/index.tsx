import { createFileRoute } from "@tanstack/react-router";

import PortfolioGoldContainer from "@containers/portfolio-app/gold";

export const Route = createFileRoute("/(app)/_layout/portfolio/gold/")({
  component: PortfolioGoldContainer,
});
