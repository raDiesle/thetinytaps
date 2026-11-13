import { useMemo } from "react";
import { useLocation } from "react-router";
import { everyTrophy } from "@/components/trophyPictures";
import type { EnglishFirst } from "@/lib/language";
import { type TrophyWon, useTrophies } from "@/lib/trophies";

/*
 * The trophy room (TrophyMuseum, user request, November 2026): a page of its own next to the bookshelf, reached through
 * a door behind the sign on the shelf's right side (TrophySign) or by a tap on the trophy at a level's end (GameEnd).
 */

/** The trophy room's name: on the shelf's sign, over an empty room, and read out at the trophy that leads there. */
export const TROPHY_ROOM: EnglishFirst = { en: "Trophy room" };

/** The trophy room's address. */
export const MUSEUM_PATH = "/pokale/";

/** The address's question naming the trophy to show big as the room opens (a tap on it at a level's end). */
export const TROPHY_PARAM = "pokal";

/** The address's question that shows every trophy there is instead of those won (the test link on /management/). */
export const ALL_TROPHIES = "alle";

/** The trophy room's address, opening on the trophy `key` (`trophyKey`) where one is given. */
export const museumHref = (key?: string) => (key ? `${MUSEUM_PATH}?${TROPHY_PARAM}=${encodeURIComponent(key)}` : MUSEUM_PATH);

/** The trophies the room shows: those won, or with `?alle` every one there is, for a look at all of them. Never stored. */
export function useMuseumTrophies(): TrophyWon[] {
  const won = useTrophies();
  const all = new URLSearchParams(useLocation().search).has(ALL_TROPHIES);
  return useMemo(() => (all ? everyTrophy() : won), [all, won]);
}
