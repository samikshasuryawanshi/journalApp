// utils/indexedDB.js
import { openDB } from 'idb';

const DB_NAME = 'journalDB';
const STORE_NAME = 'entries';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const addEntry = async (entry, userEmail) => {
  const db = await initDB();
  await db.add(STORE_NAME, { ...entry, userEmail });
};

export const getEntries = async (userEmail) => {
  const db = await initDB();
  const all = await db.getAll(STORE_NAME);
  return all.filter(entry => entry.userEmail === userEmail);
};
