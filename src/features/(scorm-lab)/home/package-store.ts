/**
 * package-store.ts
 * IndexedDB에 SCORM ZIP 바이너리를 저장/조회/삭제.
 * DB명: scorm-lab, store: packages
 */

import type { ManifestInfo } from "./manifest-parser";

export interface StoredPackage extends ManifestInfo {
  zip: Uint8Array;
  savedAt: string; // ISO string
  sizeBytes: number;
}

const DB_NAME = "scorm-lab";
const STORE = "packages";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: "manifestId" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx<T>(
  db: IDBDatabase,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const req = fn(t.objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function savePackage(
  info: ManifestInfo,
  zip: Uint8Array
): Promise<void> {
  const db = await openDB();
  const record: StoredPackage = {
    ...info,
    zip,
    savedAt: new Date().toISOString(),
    sizeBytes: zip.byteLength,
  };
  await tx(db, "readwrite", (s) => s.put(record));
  db.close();
}

export async function loadPackage(
  manifestId: string
): Promise<StoredPackage | null> {
  const db = await openDB();
  const result = await tx<StoredPackage | undefined>(
    db,
    "readonly",
    (s) => s.get(manifestId)
  );
  db.close();
  return result ?? null;
}

export async function listPackages(): Promise<Omit<StoredPackage, "zip">[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, "readonly");
    const store = t.objectStore(STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      // zip Uint8Array는 제외하고 반환 (목록용)
      const items = (req.result as StoredPackage[]).map(({ zip: _zip, ...rest }) => rest);
      resolve(items);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deletePackage(manifestId: string): Promise<void> {
  const db = await openDB();
  await tx(db, "readwrite", (s) => s.delete(manifestId));
  db.close();
}
