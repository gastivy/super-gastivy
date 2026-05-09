import type { VercelRequest, VercelResponse } from "@vercel/node";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const symbolsParam = (req.query.symbols as string) || "";
    if (!symbolsParam.trim()) {
      res.status(400).json({ error: "Missing query param 'symbols'" });
      return;
    }

    const symbols = symbolsParam.split(",").map((s) => s.trim());
    const results = await yahooFinance.quote(symbols);
    const quotes = Array.isArray(results) ? results : [results];

    const mapped = quotes
      .filter((q) => q.symbol)
      .map((q) => ({
        symbol: q.symbol,
        shortName: q.shortName || q.longName || q.symbol,
        regularMarketPrice: q.regularMarketPrice || 0,
        regularMarketChangePercent: q.regularMarketChangePercent || 0,
        currency: q.currency || "USD",
      }));

    res.status(200).json(mapped);
  } catch (err) {
    console.error("Yahoo quote error:", err);
    res.status(500).json({ error: "Failed to fetch quotes" });
  }
}