import { createFileRoute } from "@tanstack/react-router";
import StockPortfolioContainer from "@containers/portfolio-app/stocks";

const StockPortfolioPage = () => {
  return <StockPortfolioContainer />;
};

export const Route = createFileRoute("/(app)/_layout/portfolio/stocks/")({
  component: StockPortfolioPage,
});