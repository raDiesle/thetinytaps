import type { TargetLanguageId } from "@/content/targetLanguages";
import { type LazyPart, lazyPart } from "@/lib/lazyPart";
import type { AdventureStoryId } from "./settings";
import type { Story, StoryTranslation } from "./stories/story";
import { TRANSLATIONS as CLOUD_TRIP_TRANSLATIONS } from "./stories/cloudTrip/translations";
import { TRANSLATIONS as FIRE_RESCUE_TRANSLATIONS } from "./stories/fireRescue/translations";
import { TRANSLATIONS as TREASURE_ISLAND_TRANSLATIONS } from "./stories/treasureIsland/translations";

// Every story is a chunk of its own, loaded only when it is played, and three.js comes only with the player
// (`loadPlay`): the start screen with all three stories and three.js in its chunk was 1.17 MB of code, which the book's
// table of contents fetched ahead for one card (code review R-P11, November 2026). What the start screen, the address
// and „Weiter“ need before a story is loaded – its id, emoji, title and languages – stands here; `catalog.test.ts`
// checks it against the stories themselves and that nothing here or in AdventureGame.tsx imports them statically.

/** A story as the start screen knows it before its code is loaded. */
export interface StoryEntry {
  id: AdventureStoryId;
  emoji: string;
  /** Its title in its first language (the sequence's `title`). */
  title: string;
  /** The language its own lines are written in (`Story.language`, German where left out there). */
  language: TargetLanguageId;
  /** Its translations, the same table the story carries (filled as the app's language chunk arrives). */
  translations?: Partial<Record<TargetLanguageId, StoryTranslation>>;
  /** Still being built: „in Bearbeitung“, and it starts only where unfinished games may be tested. */
  unfinished?: true;
  /** Loads the story's own chunk. */
  load: () => Promise<Story>;
}

/** The stories on the start screen, each a card, in this order. */
export const STORIES: StoryEntry[] = [
  {
    id: "schatzinsel",
    emoji: "🏝️",
    title: "Die Schatzinsel",
    language: "de",
    translations: TREASURE_ISLAND_TRANSLATIONS,
    load: () => import("./stories/treasureIsland").then((m) => m.TREASURE_ISLAND),
  },
  // Still being built (user decision, November 2026): tested on localhost only.
  {
    id: "wolkenreise",
    emoji: "☁️",
    title: "Die Wolkenreise",
    language: "de",
    translations: CLOUD_TRIP_TRANSLATIONS,
    load: () => import("./stories/cloudTrip").then((m) => m.CLOUD_TRIP),
  },
  // Tapsi rides Robo, a hover robot, so it never has to walk (user idea, November 2026); being built, English first.
  {
    id: "feuerwehr",
    emoji: "🚒",
    title: "Fire Rescue",
    language: "en",
    translations: FIRE_RESCUE_TRANSLATIONS,
    unfinished: true,
    load: () => import("./stories/fireRescue").then((m) => m.FIRE_RESCUE),
  },
];

/** The story's title in `language` (for grown-ups' screens), the one of its first language where it has none. */
export const entryTitle = (entry: StoryEntry, language: TargetLanguageId) => entry.translations?.[language]?.title ?? entry.title;

/** True if the story can be said in `language`: its own lines' language, or one it has a translation into. */
export const entryToldIn = (entry: StoryEntry, language: TargetLanguageId) => language === entry.language || Boolean(entry.translations?.[language]);

const parts = new Map<AdventureStoryId, LazyPart<Story>>();
const partOf = (entry: StoryEntry) => {
  let part = parts.get(entry.id);
  if (!part) {
    part = lazyPart(entry.load);
    parts.set(entry.id, part);
  }
  return part;
};

/** The story's code, loaded once (the same promise every time, as `use()` needs); a failed download is tried again next time. */
export const loadStory = (entry: StoryEntry): Promise<Story> => partOf(entry).load();

/** The story once it is loaded, so its first picture is drawn at once – before the page turns to it. */
export const loadedStory = (entry: StoryEntry): Story | undefined => partOf(entry).loaded();

const player = lazyPart(() => import("./AdventurePlay"));

/** The player's code with three.js, loaded once: fetched ahead on the start screen, awaited when a story starts. */
export const loadPlay = player.load;

/** The player's code once it is loaded (see `loadedStory`). */
export const loadedPlay = player.loaded;
