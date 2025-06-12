import { openDB } from 'idb';

const DB_NAME = 'journalDB';
const STORE_NAME = 'entries';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    },
  });
};

export const addEntry = async (entry) => {
  const db = await initDB();
  await db.add(STORE_NAME, entry);
};

export const getEntries = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};
