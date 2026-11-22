import { type ComponentType, createElement } from "react";
import type { TargetLanguage } from "@/content/targetLanguages";
import { type LazyPart, lazyPart } from "@/lib/lazyPart";
import type { Film } from "./film/types";
import type { TrailLevel } from "./trail/types";

// Every level is a chunk of its own, loaded only when it is played (or its card is pressed): all 20 in the start
// screen's chunk were 591 KB of code (166 KB gzip) that `/kleine-abenteuer/` fetched before showing its cards, while
// the child plays one. What the start screen, the address and „Weiter“ need before a level is loaded – its id, emoji,
// title and kind – stands here; `catalog.test.ts` checks it against the levels themselves and that nothing here, in
// ElevatorGame.tsx or in cards.tsx imports a level statically. The three lift stories share one chunk (they share the
// house and its rooms), each trail level and each film is its own, with its player (TrailPlay, FilmPlay) shared.

/** What a played card is given by the start screen. */
export interface PlayProps {
  /** The app language: what the child hears is spoken in it. */
  language: TargetLanguage;
  /** „Nochmal“ or „Weiter“ at the end: the game starts that story or level. */
  onPick: (id: string) => void;
}

/** A story, trail level or film as the start screen knows it before its code is loaded. */
export type CardEntry = {
  id: string;
  emoji: string;
  /** In its first language; shown through `titleIn` in the app language. */
  title: string;
  /** The title's first language: German when absent. */
  first?: "en";
} & (
  | { kind: "lift" }
  | {
      kind: "trail";
      /** Loads the level's own chunk. */
      level: () => Promise<TrailLevel>;
    }
  | {
      kind: "film";
      /** Loads the film's own chunk. */
      film: () => Promise<Film>;
    }
);

/** Every story of the game in play order: the lift stories first, then the trail levels, then the films. */
export const CARDS: CardEntry[] = [
  { id: "hunger", emoji: "🥞", title: "Pfannkuchen", kind: "lift" },
  { id: "gutenacht", emoji: "🌙", title: "Gute Nacht", kind: "lift" },
  { id: "pfuetzen", emoji: "🌧️", title: "Pfützen", kind: "lift" },
  { id: "drachen", emoji: "🪁", title: "Der Drachen", kind: "trail", level: () => import("./trail/drachen").then((m) => m.DRACHEN_LEVEL) },
  { id: "ball", emoji: "⚽", title: "Der Ball rollt weg", kind: "trail", level: () => import("./trail/ball").then((m) => m.BALL_LEVEL) },
  { id: "ballon", emoji: "🎈", title: "Der Luftballon", kind: "trail", level: () => import("./trail/ballon").then((m) => m.BALLON_LEVEL) },
  { id: "lok", emoji: "🚂", title: "Die kleine Lok", kind: "trail", level: () => import("./trail/lok").then((m) => m.LOK_LEVEL) },
  { id: "floss", emoji: "⛵", title: "Das Floß", kind: "trail", level: () => import("./trail/floss").then((m) => m.FLOSS_LEVEL) },
  { id: "sandburg", emoji: "🏖️", title: "Die Sandburg", kind: "trail", level: () => import("./trail/sandburg").then((m) => m.SANDBURG_LEVEL) },
  { id: "picknick", emoji: "🧺", title: "Picknick im Wald", kind: "trail", level: () => import("./trail/picknick").then((m) => m.PICKNICK_LEVEL) },
  { id: "katze", emoji: "🐈", title: "Wo ist die Katze?", kind: "trail", level: () => import("./trail/katze").then((m) => m.KATZE_LEVEL) },
  { id: "schneemann", emoji: "⛄", title: "Der Schneemann", kind: "trail", level: () => import("./trail/schneemann").then((m) => m.SCHNEEMANN_LEVEL) },
  { id: "feuerwehr", emoji: "🚒", title: "Die Feuerwehr", kind: "film", film: () => import("./film/feuerwehr").then((m) => m.FEUERWEHR) },
  { id: "brief", emoji: "✉️", title: "Ein Brief für Oma", kind: "film", film: () => import("./film/brief").then((m) => m.BRIEF) },
  { id: "baecker", emoji: "🥨", title: "Beim Bäcker", kind: "film", film: () => import("./film/baecker").then((m) => m.BAECKER) },
  { id: "garten", emoji: "🌻", title: "Unser Garten wächst", kind: "film", film: () => import("./film/garten").then((m) => m.GARTEN) },
  {
    id: "krankenwagen",
    emoji: "🚑",
    title: "The ambulance",
    first: "en",
    kind: "film",
    film: () => import("./film/krankenwagen").then((m) => m.KRANKENWAGEN),
  },
  { id: "korn", emoji: "🌾", title: "From grain to bread", first: "en", kind: "film", film: () => import("./film/korn").then((m) => m.KORN) },
  { id: "haus", emoji: "🏡", title: "We build a house", first: "en", kind: "film", film: () => import("./film/haus").then((m) => m.HAUS) },
  { id: "muell", emoji: "🚛", title: "The rubbish truck", first: "en", kind: "film", film: () => import("./film/muell").then((m) => m.MUELL) },
];

/** The card of this id; an unknown one (an old save) plays the first. */
export const cardOf = (id: string): CardEntry => CARDS.find((card) => card.id === id) ?? CARDS[0];

/** A player with its story, level or film already given, so the start screen draws every kind alike. */
function playing<P extends object>(Play: ComponentType<P & PlayProps>, own: P): ComponentType<PlayProps> {
  return function Playing(props: PlayProps) {
    return createElement(Play, { ...own, ...props });
  };
}

/** Loads a card's code: the lift stories' player, or the trail's or the films' player with the level's own chunk. */
function fetchCard(card: CardEntry): Promise<ComponentType<PlayProps>> {
  switch (card.kind) {
    case "lift":
      return import("./ElevatorPlay").then((m) => playing(m.ElevatorPlay, { story: card.id }));
    case "trail":
      return Promise.all([import("./trail/TrailPlay"), card.level()]).then(([m, level]) => playing(m.TrailPlay, { level }));
    case "film":
      return Promise.all([import("./film/FilmPlay"), card.film()]).then(([m, film]) => playing(m.FilmPlay, { film }));
  }
}

const parts = new Map<string, LazyPart<ComponentType<PlayProps>>>();
const partOf = (card: CardEntry) => {
  let part = parts.get(card.id);
  if (!part) {
    part = lazyPart(() => fetchCard(card));
    parts.set(card.id, part);
  }
  return part;
};

/** The card's code, loaded once (the same promise every time, as `use()` needs); a failed download is tried again next time. */
export const loadCard = (card: CardEntry): Promise<ComponentType<PlayProps>> => partOf(card).load();

/** The card's code once it is loaded, so it is drawn at once – before the page turns to it, not in the turn's middle. */
export const loadedCard = (card: CardEntry): ComponentType<PlayProps> | undefined => partOf(card).loaded();

/** Fetches a card's code ahead, quietly: a failure (offline) leaves it to the tap, which shows the loading paper and tries again. */
export function prefetchCard(card: CardEntry) {
  loadCard(card).catch(() => {});
}
