import { useQuery } from "@tanstack/react-query";
import useDebounce from "@hooks/useDebounce";
import { CoinGeckoService } from "../services/coingecko";
import type { PortfolioItem } from "../models/types";

export type CurrencyCode = "usd" | "idr";

interface PriceMapEntry {
  currentPrice: number;
  priceChange24h: number;
  image: string;
}

export const useCryptoPrices = (portfolioItems: PortfolioItem[]) => {
  const coinIds = [...new Set(portfolioItems.map((item) => item.coinId))];

  return useQuery({
    queryKey: ["cryptoPrices", coinIds],
    queryFn: async () => {
      const [usdPrices, idrPrices] = await Promise.all([
        CoinGeckoService.getPrices(coinIds, "usd"),
        CoinGeckoService.getPrices(coinIds, "idr"),
      ]);

      const usdMap = new Map<string, PriceMapEntry>(
        usdPrices.map((p) => [
          p.id,
          {
            currentPrice: p.current_price,
            priceChange24h: p.price_change_percentage_24h,
            image: p.image,
          },
        ])
      );

      const idrMap = new Map<string, PriceMapEntry>(
        idrPrices.map((p) => [
          p.id,
          {
            currentPrice: p.current_price,
            priceChange24h: p.price_change_percentage_24h,
            image: p.image,
          },
        ])
      );

      return { usd: usdMap, idr: idrMap };
    },
    enabled: coinIds.length > 0,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
};

export const useCoinSearch = (query: string) => {
  const debouncedQuery = useDebounce(query.trim(), 700);

  return useQuery({
    queryKey: ["coinSearch", debouncedQuery.toLowerCase()],
    queryFn: async () => {
      return await CoinGeckoService.searchCoins(debouncedQuery);
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 30_000,
  });
};