import { bookIdOf } from "@/content/games";
import adventure from "../games/adventure/vorschau/*.webp?glob";
import elevator from "../games/elevator/vorschau/*.webp?glob";
import feelings from "../games/feelings/vorschau/*.webp?glob";
import marbles from "../games/marbles/vorschau/*.webp?glob";
import scenes from "../games/scenes/vorschau/*.webp?glob";
import shelfPictures from "./bilder/*.webp?glob";
import books from "./vorschau/*.webp?glob";

/*
 * The picture in a trophy's medallion (Trophy.tsx): the level's own cut from its game's menu card where there is one,
 * else the game's line in its book's table of contents, else the little picture on its spine on the shelf. Still
 * pictures the menus have anyway – so each trophy shows what was played, until each gets a picture of its own.
 */

/** The cuts of each game's levels (`<level id>.webp` in its `vorschau/` folder), by the game's address. */
const LEVELS: Record<string, Record<string, string>> = {
  "/bilder/": scenes,
  "/kettenreaktion/": marbles,
  "/kleine-abenteuer/": elevator,
  "/abenteuer/": adventure,
  "/gefuehle/": feelings,
  "/wie-gehts-dir/": feelings,
};

/** The picture for the trophy of `level` in the game at `game`, if any. */
export function trophyPicture(game: string, level: string): string | undefined {
  const id = bookIdOf(game);
  return (level ? LEVELS[game]?.[`${level}.webp`] : undefined) ?? books[`${id}.webp`] ?? shelfPictures[`spine-${id}.webp`];
}
