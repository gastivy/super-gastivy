import axios from "axios";
import type { StockQuote } from "../models/stockTypes";

export interface ExchangeRate {
  usdToIdr: number;
}

export const YahooFinanceService = {
  /**
   * Search for stocks by query string
   * Calls the Vite dev server proxy which uses yahoo-finance2
   */
  async searchStocks(
    query: string
  ): Promise<{ symbol: string; shortName: string; exchange: string }[]> {
    if (!query || query.trim().length === 0) return [];

    try {
      const { data } = await axios.get("/api/yahoo/search", {
        params: { q: query.trim() },
      });
      return data;
    } catch {
      console.error("Failed to search stocks");
      return [];
    }
  },

  /**
   * Get quotes for specific stock symbols
   * Calls the Vite dev server proxy which uses yahoo-finance2
   */
  async getQuotes(symbols: string[]): Promise<Map<string, StockQuote>> {
    if (symbols.length === 0) return new Map();

    try {
      const { data } = await axios.get("/api/yahoo/quote", {
        params: { symbols: symbols.join(",") },
      });

      const map = new Map<string, StockQuote>();
      for (const quote of data) {
        map.set(quote.symbol, {
          symbol: quote.symbol,
          shortName: quote.shortName,
          regularMarketPrice: quote.regularMarketPrice || 0,
          regularMarketChangePercent: quote.regularMarketChangePercent || 0,
          currency: quote.currency || "USD",
        });
      }
      return map;
    } catch {
      console.error("Failed to fetch stock quotes");
      return new Map();
    }
  },

  /**
   * Get USD to IDR exchange rate
   */
  async getExchangeRate(): Promise<ExchangeRate> {
    try {
      const { data } = await axios.get("/api/yahoo/exchange-rate");
      return { usdToIdr: data.usdToIdr || 1 };
    } catch {
      console.error("Failed to fetch exchange rate");
      return { usdToIdr: 1 };
    }
  },
};
