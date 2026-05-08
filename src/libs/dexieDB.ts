import type { ActivitiesDexieStore } from "@modules/activity/activity-log/models/dexie";
import type { PortfolioItem, PortfolioGroup } from "@modules/portfolio/models/types";
import type { StockItem, StockGroup } from "@modules/portfolio/models/stockTypes";
import Dexie, { type Table } from "dexie";

const db = new Dexie("GastivyDB");

interface DexieStores extends Dexie {
  activities: Table<ActivitiesDexieStore, string>;
  portfolio: Table<PortfolioItem, number>;
  portfolioGroups: Table<PortfolioGroup, number>;
  stockPortfolio: Table<StockItem, number>;
  stockGroups: Table<StockGroup, number>;
}

db.version(1).stores({
  activities: "id, name, data",
});

db.version(2).stores({
  activities: "id, name, data",
  portfolio: "++id, coinId, symbol, name, amount, createdAt",
});

db.version(3).stores({
  activities: "id, name, data",
  portfolio: "++id, groupId, coinId, symbol, name, amount, createdAt",
  portfolioGroups: "++id, name, createdAt",
});

db.version(4).stores({
  activities: "id, name, data",
  portfolio: "++id, groupId, coinId, symbol, name, amount, createdAt",
  portfolioGroups: "++id, name, createdAt",
  stockPortfolio: "++id, groupId, symbol, name, shares, createdAt",
  stockGroups: "++id, name, createdAt",
});

const DexieDB = db as DexieStores;

export default DexieDB;