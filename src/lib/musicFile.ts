import songFiles from "./musik/*.mp3?glob";
import { loadCommon } from "@/lib/common";
import { afterLoad, savesData } from "@/lib/pwa";

// Downloading the background song (musik/musik-hintergrund.mp3, see the README
// there), apart from playing it (backgroundMusic.ts) so the start of the site
// needs none of the sound code. While music is off on the home page the file is
// never downloaded; the service worker leaves songs out of its offline copy too
// and keeps them only once a page has fetched them (src/sw.js).
const SONG_URL = songFiles["musik-hintergrund.mp3"] ?? null;

let bytes: Promise<ArrayBuffer | null> | null = null;

/**
 * Starts downloading the song, once per visit; null when there is none. Only the
 * file: decoding needs the audio context, which the browser allows after the first tap.
 * A download that failed is forgotten, so the next call tries again: kept, one flaky request at the start left the
 * whole visit without music (as `fileOf` in voice.ts does for a line).
 */
export function downloadMusic() {
  if (!SONG_URL) return Promise.resolve(null);
  bytes ??= fetch(SONG_URL)
    .then((response) => (response.ok ? response.arrayBuffer() : null))
    .catch(() => null)
    .then((data) => {
      if (!data) bytes = null;
      return data;
    });
  return bytes;
}

/**
 * Called once at start-up: if music is on, the song is there by the time a game starts.
 * Only after the page has loaded, so the song (over a MB) doesn't hold up the menu,
 * and not when the visitor saves data. A game started before that asks for it itself (downloadMusic).
 */
export function downloadMusicIfOn() {
  if (loadCommon().music && !savesData()) afterLoad(() => void downloadMusic());
}
