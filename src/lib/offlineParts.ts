// What an offline copy is made of, by book on the shelf and by language (user request, November 2026: „nur für die
// ausgewählte Sprache runterladen, ggf. pro Spiel (Buch) auswählen, Default: alles“). The build writes it as
// static/offline.<hash>.json (tools/build.ts); the service worker (src/sw.js) downloads from it only what the
// grown-ups chose (`OfflineChoice`), and src/components/OfflineOptions.tsx shows how big each choice is. Kept apart from
// build.ts, which builds when imported, so offlineParts.test.ts can check it and the page can use it.

/** One file of the offline copy. */
export interface OfflinePart {
  /** Its address relative to the site's root, like the service worker's FILES ("./static/x.mp3"). */
  path: string;
  bytes: number;
  /** The shelf's books (`SHELF` ids) whose pages use it; none: the start and every page use it. */
  books?: string[];
  /** The language it speaks or sings: a recording of a line, a song in one language. */
  language?: string;
  /** The background song, kept only while music is on. */
  music?: true;
  /** An English recording that stands in for these languages' missing ones (`recordingUrl`, src/lib/voice.ts). */
  standsIn?: string[];
}

/** The whole offline copy: every book and its files. */
export interface OfflineManifest {
  parts: OfflinePart[];
}

/** What grown-ups chose to keep for playing without internet (`OfflineChoice`, stored on the device). */
export interface OfflineChoice {
  /** The languages to keep the voices and songs of. */
  languages: string[];
  /** The books left out (`SHELF` ids); a book added later is in, as „all“ is the default. */
  skip: string[];
  /** Keep the background song (only while music is on). */
  music: boolean;
}

/**
 * The language a built file speaks, by its name: a recording `<hash>.<build hash>.mp3` is German, `en-<hash>…` English
 * (src/lib/voiceName.ts), a song `musik-<name>-ru.<build hash>.mp3` Russian; anything else none.
 */
export function languageOf(path: string): string | undefined {
  const name = path.slice(path.lastIndexOf("/") + 1);
  if (/^[0-9a-f]{8}\.[a-z0-9]+\.mp3$/.test(name)) return "de";
  return /^([a-z]{2})-[0-9a-f]{8}\.[a-z0-9]+\.mp3$/.exec(name)?.[1] ?? /^musik-.*-([a-z]{2})\.[a-z0-9]+\.mp3$/.exec(name)?.[1];
}

/** A song that plays only while music is on (the background song, which has no language). */
export const isBackgroundSong = (path: string) => /(^|\/)musik-[^/]*\.mp3$/.test(path) && languageOf(path) === undefined;

/**
 * Which other languages lack so many of a game's recordings that its English ones stand in (the voice plays English
 * where the language has no recording): every language with less than 90 % as many recordings as English among
 * `paths`, the recordings one game's code names. German never, it has no fallback.
 */
export function needsEnglish(paths: string[]) {
  const count = new Map<string, number>();
  for (const path of paths) {
    const language = languageOf(path);
    if (language && path.endsWith(".mp3") && !/(^|\/)musik-/.test(path)) count.set(language, (count.get(language) ?? 0) + 1);
  }
  const english = count.get("en") ?? 0;
  return (languages: readonly string[]) => languages.filter((l) => l !== "de" && l !== "en" && (count.get(l) ?? 0) < english * 0.9);
}

/** Whether `part` belongs to the offline copy grown-ups chose. */
export function wanted(part: OfflinePart, choice: OfflineChoice) {
  if (part.music && !choice.music) return false;
  if (part.books?.length && part.books.every((book) => choice.skip.includes(book))) return false;
  if (!part.language) return true;
  return choice.languages.includes(part.language) || (part.standsIn ?? []).some((language) => choice.languages.includes(language));
}

/** How many bytes the chosen copy has, its files counted once. */
export const sizeOf = (manifest: OfflineManifest, choice: OfflineChoice) =>
  manifest.parts.reduce((sum, part) => sum + (wanted(part, choice) ? part.bytes : 0), 0);
