export interface StockGroup {
  id?: number;
  name: string;
  createdAt: string;
}

export interface StockItem {
  id?: number;
  groupId: number;
  symbol: string; // e.g. "AAPL"
  name: string; // e.g. "Apple Inc."
  shares: number;
  createdAt: string;
}

export interface StockQuote {
  symbol: string;
  shortName: string;
  regularMarketPrice: number;
  regularMarketChangePercent: number;
  currency: string;
}
