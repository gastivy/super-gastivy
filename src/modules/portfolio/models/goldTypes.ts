export interface GoldItem {
  id?: number;
  name: string;
  grams: number;
  createdAt: string;
}

export interface GoldPriceData {
  currency: string;
  midPrice: number;
  sell: number;
  buy: number;
  updatedAt: string;
  priceChanges: {
    ONE_DAY: number;
    ONE_WEEK: number;
    ONE_MONTH: number;
    SIX_MONTH: number;
    ONE_YEAR: number;
    THREE_YEAR: number;
    FIVE_YEAR: number;
  };
}