// The sung brushing songs: musik/musik-zaehneputzen-lied-<lang>.mp3, one per language,
// with a .json of the same name saying where each verse begins. A new language needs
// only these two files (`bun run song:verses` makes both, see the /zahnputzlied skill).

/**
 * The language the song is sung in, out of the languages that have a song: always the
 * app language, so the song sings what the texts say; German when there is no song in it.
 */
export const sungLanguageFor = (appLanguage: string, available: readonly string[]) => (available.includes(appLanguage) ? appLanguage : "de");

/** The language code in a sung song's file name, or null for any other file. */
export const sungLanguageOf = (file: string) => /musik-zaehneputzen-lied-([a-z]{2})\.mp3$/.exec(file)?.[1] ?? null;

/** The .json next to a sung song. */
export interface SungTimes {
  /** Where each part begins in the song, in seconds, a moment before its first word: one per step, then the finale. */
  verses: number[];
}
