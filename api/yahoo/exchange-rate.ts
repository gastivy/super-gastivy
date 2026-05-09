import type { VercelRequest, VercelResponse } from "@vercel/node";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const result = await yahooFinance.quote("IDR=X");
    const quote = Array.isArray(result) ? result[0] : result;
    const rate = quote?.regularMarketPrice || 1;
    res.status(200).json({ usdToIdr: rate });
  } catch (err) {
    console.error("Yahoo exchange rate error:", err);
    res.status(500).json({ error: "Failed to fetch exchange rate" });
  }
}