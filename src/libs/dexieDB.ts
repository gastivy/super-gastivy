import Dexie, { type Table } from "dexie";

import type { ActivitiesDexieStore } from "@modules/activity/activity-log/models/dexie";
import type {
  JournalEntry,
  JournalTemplate,
} from "@modules/journaling/models/types";
import type {
  CashGroup,
  CashPortfolioItem,
} from "@modules/portfolio/models/cashTypes";
import type {
  StockGroup,
  StockItem,
} from "@modules/portfolio/models/stockTypes";
import type {
  PortfolioGroup,
  PortfolioItem,
} from "@modules/portfolio/models/types";

const db = new Dexie("GastivyDB");

interface DexieStores extends Dexie {
  activities: Table<ActivitiesDexieStore, string>;
  portfolio: Table<PortfolioItem, number>;
  portfolioGroups: Table<PortfolioGroup, number>;
  stockPortfolio: Table<StockItem, number>;
  stockGroups: Table<StockGroup, number>;
  journals: Table<JournalEntry, number>;
  journalTemplates: Table<JournalTemplate, number>;
  cashPortfolio: Table<CashPortfolioItem, number>;
  cashGroups: Table<CashGroup, number>;
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

db.version(5).stores({
  activities: "id, name, data",
  portfolio: "++id, groupId, coinId, symbol, name, amount, createdAt",
  portfolioGroups: "++id, name, createdAt",
  stockPortfolio: "++id, groupId, symbol, name, shares, createdAt",
  stockGroups: "++id, name, createdAt",
  journals: "++id, date, title, createdAt",
  journalTemplates: "++id, name, createdAt",
});

db.version(6).stores({
  activities: "id, name, data",
  portfolio: "++id, groupId, coinId, symbol, name, amount, createdAt",
  portfolioGroups: "++id, name, createdAt",
  stockPortfolio: "++id, groupId, symbol, name, shares, createdAt",
  stockGroups: "++id, name, createdAt",
  journals: "++id, date, title, createdAt",
  journalTemplates: "++id, name, createdAt",
  cashPortfolio: "++id, groupId, walletId, walletName, createdAt",
  cashGroups: "++id, name, createdAt",
});

const DexieDB = db as DexieStores;

export default DexieDB;
