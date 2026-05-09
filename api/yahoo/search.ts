import type { VercelRequest, VercelResponse } from "@vercel/node";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const query = (req.query.q as string) || "";
    if (!query.trim()) {
      res.status(400).json({ error: "Missing query param 'q'" });
      return;
    }

    const result = await yahooFinance.search(query.trim(), {
      quotesCount: 10,
      newsCount: 0,
    });

    const stocks = (result.quotes || [])
      .filter(
        (q) =>
          ("quoteType" in q &&
            (q.quoteType === "EQUITY" || q.quoteType === "ETF")) &&
          "symbol" in q &&
          q.symbol
      )
      .slice(0, 10)
      .map((q) => ({
        symbol: q.symbol!,
        shortName:
          ("shortname" in q && q.shortname) ||
          ("longname" in q && q.longname) ||
          q.symbol!,
        exchange: ("exchange" in q && q.exchange) || "",
      }));

    res.status(200).json(stocks);
  } catch (err) {
    console.error("Yahoo search error:", err);
    res.status(500).json({ error: "Failed to search stocks" });
  }
}