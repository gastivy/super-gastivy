import type { ActivitiesDexieStore } from "@modules/activity/activity-log/models/dexie";
import Dexie, { type Table } from "dexie";

const db = new Dexie("GastivyDB");

interface DexieStores extends Dexie {
  activities: Table<ActivitiesDexieStore, string>;
}

db.version(1).stores({
  activities: "id, name, data",
});

const DexieDB = db as DexieStores;

export default DexieDB;
