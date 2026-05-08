import { createFileRoute } from "@tanstack/react-router";
import PortfolioCryptoContainer from "@containers/portfolio-app/crypto";

export const Route = createFileRoute("/(app)/_layout/portfolio/crypto/")({
  component: PortfolioCryptoContainer,
});
