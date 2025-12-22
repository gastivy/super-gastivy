import { type IDBPDatabase, openDB } from "idb";

const initDB = async (tableName: string): Promise<IDBPDatabase> => {
  return await openDB("GastivyDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(tableName)) {
        db.createObjectStore(tableName, { keyPath: "id" });
      }
    },
  });
};

export const IndexedDB = {
  async get(tableName: string, key: string, id: string) {
    const db = await initDB(tableName);
    return await db.get(key, id);
  },

  async getAll(tableName: string) {
    const db = await initDB(tableName);
    return await db.getAll(tableName);
  },

  async add(tableName: string, data: object) {
    const db = await initDB(tableName);
    await db.add(tableName, data);
  },

  async put(tableName: string, data: object) {
    const db = await initDB(tableName);
    await db.put(tableName, data);
  },

  async delete(tableName: string, id: string) {
    const db = await initDB(tableName);
    await db.delete(tableName, id);
  },
};
