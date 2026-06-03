import type { Plugin } from "vite";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

/**
 * Vite dev server plugin that proxies Yahoo Finance API calls
 * through the local dev server, since yahoo-finance2 is Node.js-only.
 */
export function yahooFinancePlugin(): Plugin {
  return {
    name: "yahoo-finance-proxy",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(
          req.url || "",
          `http://localhost:${server.config.server?.port || 3000}`
        );

        // GET /api/yahoo/search?q=AAPL
        if (url.pathname === "/api/yahoo/search" && req.method === "GET") {
          try {
            const query = url.searchParams.get("q") || "";
            if (!query.trim()) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Missing query param 'q'" }));
              return;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = (await yahooFinance.search(
              query.trim(),
              { quotesCount: 10, newsCount: 0 },
              { validateResult: false }
            )) as any;

            const stocks = (result.quotes || [])
              .filter(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (q: any) =>
                  "quoteType" in q &&
                  (q.quoteType === "EQUITY" || q.quoteType === "ETF") &&
                  "symbol" in q &&
                  q.symbol
              )
              .slice(0, 10)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((q: any) => ({
                symbol: q.symbol!,
                shortName:
                  ("shortname" in q && q.shortname) ||
                  ("longname" in q && q.longname) ||
                  q.symbol!,
                exchange: ("exchange" in q && q.exchange) || "",
              }));

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(stocks));
          } catch (err) {
            console.error("Yahoo search error:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Failed to search stocks" }));
          }
          return;
        }

        // GET /api/yahoo/exchange-rate
        if (
          url.pathname === "/api/yahoo/exchange-rate" &&
          req.method === "GET"
        ) {
          try {
            const result = await yahooFinance.quote("IDR=X", {}, { validateResult: false });
            const quote = Array.isArray(result) ? result[0] : result;
            const rate = quote?.regularMarketPrice || 1;

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ usdToIdr: rate }));
          } catch (err) {
            console.error("Yahoo exchange rate error:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Failed to fetch exchange rate" }));
          }
          return;
        }

        // GET /api/yahoo/quote?symbols=AAPL,TSLA
        if (url.pathname === "/api/yahoo/quote" && req.method === "GET") {
          try {
            const symbolsParam = url.searchParams.get("symbols") || "";
            if (!symbolsParam.trim()) {
              res.statusCode = 400;
              res.end(
                JSON.stringify({ error: "Missing query param 'symbols'" })
              );
              return;
            }

            const symbols = symbolsParam.split(",").map((s) => s.trim());
            const results = await yahooFinance.quote(symbols, {}, { validateResult: false });
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

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(mapped));
          } catch (err) {
            console.error("Yahoo quote error:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Failed to fetch quotes" }));
          }
          return;
        }

        next();
      });
    },
  };
}
