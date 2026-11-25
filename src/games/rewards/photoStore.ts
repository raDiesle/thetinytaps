import { PHOTO_QUALITY, scaledSize } from "./chartPhoto";

/**
 * The photos of the child on the charts, kept only in this browser on this device (IndexedDB – Local Storage holds a
 * few MB and only text): never sent anywhere, never in a URL, a log, analytics or a picture prompt. A chart holds only
 * the photo's key (`ChartPhoto`). Every read and write goes through here; where the browser has no IndexedDB (a private
 * window in some browsers, the tests) nothing is stored and a chart simply shows no photo.
 */

const DB_NAME = "tinytaps-photos";
const STORE = "photos";

let opened: Promise<IDBDatabase | undefined> | undefined;

/** The database, opened once; undefined where the browser has none or refuses it. */
function database(): Promise<IDBDatabase | undefined> {
  if (opened) return opened;
  opened = new Promise((resolve) => {
    try {
      if (typeof indexedDB === "undefined") return resolve(undefined);
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(STORE);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(undefined);
      request.onblocked = () => resolve(undefined);
    } catch {
      resolve(undefined);
    }
  });
  return opened;
}

/** One request on the store, its result or undefined on any failure. */
async function run<T>(mode: IDBTransactionMode, act: (store: IDBObjectStore) => IDBRequest<T>): Promise<T | undefined> {
  const db = await database();
  if (!db) return undefined;
  return new Promise((resolve) => {
    try {
      const request = act(db.transaction(STORE, mode).objectStore(STORE));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(undefined);
    } catch {
      resolve(undefined);
    }
  });
}

/** Object URLs of the photos read so far, one per key, so a sheet on screen and its print share one. */
const urls = new Map<string, Promise<string | undefined>>();

/** Keeps a photo under its key; false where it could not be stored. */
export async function putPhoto(key: string, blob: Blob): Promise<boolean> {
  const done = await run("readwrite", (store) => store.put(blob, key));
  urls.delete(key);
  return done !== undefined;
}

/** A photo's object URL to show, read once; undefined where it is not (or no longer) on this device. */
export function photoUrl(key: string): Promise<string | undefined> {
  let url = urls.get(key);
  if (!url) {
    url = run<Blob>("readonly", (store) => store.get(key) as IDBRequest<Blob>).then((blob) => (blob instanceof Blob ? URL.createObjectURL(blob) : undefined));
    urls.set(key, url);
  }
  return url;
}

/** Deletes every photo whose key is not in `keep` (a chart removed, a photo taken off it, an upload never used). */
export async function keepOnlyPhotos(keep: ReadonlySet<string>): Promise<void> {
  const keys = (await run("readonly", (store) => store.getAllKeys())) ?? [];
  for (const key of keys) {
    if (typeof key !== "string" || keep.has(key)) continue;
    await run("readwrite", (store) => store.delete(key));
    const url = urls.get(key);
    urls.delete(key);
    url?.then((u) => u && URL.revokeObjectURL(u));
  }
}

/**
 * A photo chosen by the grown-up, made ready to keep: turned upright by its own orientation, its longest side at most
 * `PHOTO_MAX_SIDE` and drawn anew as a JPEG on a canvas – which also leaves out everything the camera wrote into the
 * file besides the picture (place, time, device). Undefined where it is no picture the browser can read.
 */
export async function shrinkPhoto(file: Blob): Promise<{ blob: Blob; ratio: number } | undefined> {
  try {
    // "from-image" turns it as the camera meant it (a phone's portrait photo is often stored lying on its side).
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const { width, height } = scaledSize(bitmap.width, bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return undefined;
    // A photo with see-through parts lies on white, as on paper.
    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", PHOTO_QUALITY));
    return blob ? { blob, ratio: width / height } : undefined;
  } catch {
    return undefined;
  }
}
