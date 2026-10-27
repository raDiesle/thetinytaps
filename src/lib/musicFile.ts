import songFiles from "./musik/*.mp3?glob";
import { COMMON_SETTINGS_KEY, DEFAULT_COMMON_SETTINGS } from "@/lib/common";
import { afterLoad } from "@/lib/pwa";
import { loadStored } from "@/lib/storage";

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
 */
export function downloadMusic() {
  bytes ??= SONG_URL
    ? fetch(SONG_URL)
        .then((response) => (response.ok ? response.arrayBuffer() : null))
        .catch(() => null)
    : Promise.resolve(null);
  return bytes;
}

/**
 * Called once at start-up: if music is on, the song is there by the time a game starts.
 * Only after the page has loaded, so the song (a few MB) doesn't hold up the menu.
 * A game started before that asks for it itself (downloadMusic).
 */
export function downloadMusicIfOn() {
  if (loadStored(COMMON_SETTINGS_KEY, DEFAULT_COMMON_SETTINGS).music) afterLoad(() => void downloadMusic());
}
