import axios from "axios";
import type { CryptoPrice } from "../models/types";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

const coingeckoApi = axios.create({
  baseURL: COINGECKO_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

export const CoinGeckoService = {
  /**
   * Search for coins by query string
   */
  async searchCoins(query: string): Promise<
    {
      id: string;
      symbol: string;
      name: string;
      thumb: string;
    }[]
  > {
    if (!query || query.trim().length === 0) return [];

    const { data } = await coingeckoApi.get("/search", {
      params: { query: query.trim() },
    });

    return (data.coins || []).slice(0, 10).map(
      (coin: {
        id: string;
        symbol: string;
        name: string;
        thumb: string;
      }) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        thumb: coin.thumb,
      }),
    );
  },

  /**
   * Get prices for specific coin IDs
   */
  async getPrices(
    coinIds: string[],
    vsCurrency: string = "usd"
  ): Promise<CryptoPrice[]> {
    if (coinIds.length === 0) return [];

    const { data } = await coingeckoApi.get("/coins/markets", {
      params: {
        vs_currency: vsCurrency,
        ids: coinIds.join(","),
        order: "market_cap_desc",
        sparkline: false,
      },
    });

    return (data || []).map(
      (coin: {
        id: string;
        symbol: string;
        name: string;
        current_price: number;
        image: string;
        price_change_percentage_24h: number;
      }) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        current_price: coin.current_price,
        image: coin.image,
        price_change_percentage_24h: coin.price_change_percentage_24h,
      }),
    );
  },
};