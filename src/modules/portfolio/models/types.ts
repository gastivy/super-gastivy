export interface PortfolioGroup {
  id?: number;
  name: string;
  createdAt: string;
}

export interface PortfolioItem {
  id?: number;
  groupId: number;
  coinId: string; // e.g. "bitcoin"
  symbol: string; // e.g. "BTC"
  name: string; // e.g. "Bitcoin"
  amount: number;
  createdAt: string;
}

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  image: string;
  price_change_percentage_24h: number;
}

export interface PortfolioDisplayItem extends PortfolioItem {
  currentPrice: number;
  totalValue: number;
  priceChange24h: number;
  image: string;
}
