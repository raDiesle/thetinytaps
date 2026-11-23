import { useEffect, useState } from "react";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { type Localized, pick } from "@/lib/language";

/*
 * The name of the level a trophy was won in, for the plate on its plinth in the trophy room (TrophyMuseum): read from
 * the game's own data, which is loaded only for the games whose trophies stand there – a game's names come with its
 * menu's small catalog where it has one, never with the whole game. A game whose names would bring the whole game's code
 * (Kleine Abenteuer's stories, Bewegungsabenteuer's 3D stories) names only the game on its plates.
 */

/** A level's name in a language; undefined where the game doesn't know it. */
type Namer = (level: string, language: TargetLanguageId) => string | undefined;

/** Where each game's level names come from, by the game's address. */
const NAMERS: Record<string, () => Promise<Namer>> = {
  "/bilder/": () =>
    import("@/games/scenes/catalog").then(
      ({ sceneTitle }) =>
        (level, language) =>
          sceneTitle(level, language),
    ),
  "/kettenreaktion/": () =>
    import("@/games/marbles/content").then(({ LEVEL_TEXTS }) => (level, language) => {
      const texts = LEVEL_TEXTS[level as keyof typeof LEVEL_TEXTS];
      return texts && pick(texts.name, language);
    }),
  "/timer/": () =>
    import("@/games/timer/content").then(({ PICTURES }) => (level, language) => {
      const picture = PICTURES.find((p) => p.id === level);
      return picture && pick(picture.name, language);
    }),
  "/gefuehle/": () => import("@/games/feelings/groups").then(({ GROUPS }) => feelingsNamer(GROUPS)),
  "/wie-gehts-dir/": () => import("@/games/feelings/groups").then(({ GROUPS }) => feelingsNamer(GROUPS)),
  "/zaehlturm/": () =>
    import("@/games/tower/names").then(({ GOAL_NAMES }) => (level, language) => {
      const name = GOAL_NAMES[level as keyof typeof GOAL_NAMES];
      return name && pick(name, language);
    }),
  "/was-ist-passiert/": async () => (level, language) => numbered(level, "runde-", ROUND, language),
  // The book Abstillen's other stories give trophies of their own: the night story level „nachts“, „Three More Sleeps“
  // level „abschied“ (its short version shares the long story's trophy).
  "/abstillen/": () =>
    Promise.all([import("@/games/nightmilk/names"), import("@/games/milkgoodbye/names")]).then(
      ([{ NIGHT_MILK_TITLE }, { GOODBYE_MILK_TITLE }]) =>
        (level, language) =>
          level === "nachts" ? pick(NIGHT_MILK_TITLE, language) : level === "abschied" ? pick(GOODBYE_MILK_TITLE, language) : undefined,
    ),
  // The book Schnullerfee's second story, „Tapsi and the Pacifier Tree“, gives a trophy of its own, level „baum“ (its
  // short version shares it, as the fairy's short version shares the fairy's).
  "/schnullerfee/": () =>
    import("@/games/pacifiertree/names").then(
      ({ TREE_TITLE }) =>
        (level, language) =>
          level === "baum" ? pick(TREE_TITLE, language) : undefined,
    ),
};

/** „Tag“ and „Runde“ with their number, in each app language. */
const DAY = { de: "Tag", en: "Day", zh: "第{n}天", hi: "दिन", es: "Día", ar: "اليوم", ru: "День" };
const ROUND = { de: "Runde", en: "Round", zh: "第{n}轮", hi: "दौर", es: "Ronda", ar: "الجولة", ru: "Раунд" };

/** „Tag 3“ for the level „tag-3“: the word in the language and the level's number. */
function numbered(level: string, prefix: string, word: Record<string, string>, language: TargetLanguageId) {
  if (!level.startsWith(prefix)) return undefined;
  const n = level.slice(prefix.length);
  const text = word[language] ?? word.de;
  return text.includes("{n}") ? text.replace("{n}", n) : `${text} ${n}`;
}

/** Gefühle's and „Wie geht's dir?“'s levels: a feeling's group by its title, a day of the week book by its number. */
function feelingsNamer(groups: { id: string; title: Localized }[]): Namer {
  return (level, language) => {
    const group = groups.find((g) => g.id === level);
    return group ? pick(group.title, language) : numbered(level, "tag-", DAY, language);
  };
}

/** The namers loaded so far, by the game's address. */
const loaded = new Map<string, Namer>();

/**
 * The level names of the `games` (addresses), loaded once: a function naming a trophy's level, which knows more as the
 * games' data comes in.
 */
export function useLevelNames(games: string[], language: TargetLanguageId): (game: string, level: string) => string | undefined {
  const [, setCount] = useState(loaded.size);
  const wanted = games.filter((game) => NAMERS[game] && !loaded.has(game)).join(" ");
  useEffect(() => {
    let live = true;
    for (const game of wanted ? wanted.split(" ") : [])
      NAMERS[game]()
        .then((namer) => {
          loaded.set(game, namer);
          if (live) setCount(loaded.size);
        })
        .catch(() => {
          // Offline before the game was ever opened: its plates name only the game.
        });
    return () => {
      live = false;
    };
  }, [wanted]);
  return (game, level) => (level ? loaded.get(game)?.(level, language) : undefined);
}
