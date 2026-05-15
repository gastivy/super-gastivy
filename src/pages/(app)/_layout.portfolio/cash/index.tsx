import { createFileRoute } from "@tanstack/react-router";

import PortfolioCashContainer from "@containers/portfolio-app/cash";

export const Route = createFileRoute("/(app)/_layout/portfolio/cash/")({
  component: PortfolioCashContainer,
});
