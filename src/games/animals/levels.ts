import { shuffle } from "@/games/shadows/deck";
import { wrongFoods, wrongGifts, wrongHomes, type Animal, type Food } from "./content";
import { GIFTS, type Gift } from "./gifts";
import { GROWTHS, growLookAlike, type Growth } from "./growth";
import { HOMES, type Home } from "./homes";
import { soundLookAlike, SOUND_ANIMALS } from "./sounds";

/**
 * The five kinds of rounds: feeding (N-08), what the animal gives us (Z-01), who lives where (N-09), what the small
 * one becomes (Z-12) and who makes the sound behind the curtain (Z-15). „Wer schaut da raus?“ moved to „Erkennen“
 * (Schatten finden) in November 2026.
 */
export type RoundKind = "feed" | "gift" | "home" | "grow" | "sound";

/** The kinds take turns in this order, starting with feeding. */
export const KIND_ORDER: RoundKind[] = ["feed", "gift", "home", "grow", "sound"];

/** One step of difficulty. */
export interface AnimalLevel {
  /** Foods, gifts, homes or grown ones to choose from when feeding, giving, looking for a home or growing. */
  choices: number;
}

/**
 * The steps the game climbs (or goes back down) by how the child plays (`nextLevel` from Schatten finden: two rounds
 * without a wrong pick go up, a wrong pick in two rounds or two in one go down); every visit begins on the first.
 * Harder means more to choose from, never quicker.
 */
export const ANIMAL_LEVELS: AnimalLevel[] = [{ choices: 2 }, { choices: 3 }, { choices: 4 }];

/** The kind after `last` in `KIND_ORDER` when all take turns (the first to begin with), or the one kind chosen. */
export function nextKind(last: RoundKind | null, kinds: "all" | RoundKind): RoundKind {
  if (kinds !== "all") return kinds;
  return last === null ? KIND_ORDER[0] : KIND_ORDER[(KIND_ORDER.indexOf(last) + 1) % KIND_ORDER.length];
}

/** A feeding round: `animal` is hungry, one of `foods` (at `correct`) is its own. */
export interface FeedRound {
  kind: "feed";
  animal: Animal;
  foods: Food[];
  correct: number;
}

/** A gift round: what does `animal` give us? One of `gifts` (at `correct`) is its own. */
export interface GiftRound {
  kind: "gift";
  animal: Animal;
  gifts: Gift[];
  correct: number;
}

/** A home round: `animal` looks for its home among `homes`. */
export interface HomeRound {
  kind: "home";
  animal: Animal;
  homes: Home[];
  correct: number;
}

/** A growing round: what does `growth` become? One of `grown` (at `correct`) is what it becomes. */
export interface GrowRound {
  kind: "grow";
  growth: Growth;
  /** What the others become, to choose from; each stands for its own small one. */
  grown: Growth[];
  correct: number;
}

/** A sound round (Z-15): `animal` calls behind the curtain, one of `animals` (at `correct`) is it. */
export interface SoundRound {
  kind: "sound";
  animal: Animal;
  animals: Animal[];
  correct: number;
}

/** The foods of a feeding round, `animal`'s own among `count` it doesn't eat (`wrongFoods`), in random order. */
export function dealFeed(animal: Animal, count: number): FeedRound {
  const right = animal.food!;
  const foods = shuffle([right, ...shuffle(wrongFoods(animal)).slice(0, count - 1)]);
  return { kind: "feed", animal, foods, correct: foods.indexOf(right) };
}

/**
 * The gifts of a gift round, `animal`'s own among `count` it doesn't give (`wrongGifts`), in random order. There are
 * only a few gifts, so an animal that gives two (the sheep's wool and milk) gets as many as are left.
 */
export function dealGift(animal: Animal, count: number): GiftRound {
  const right = GIFTS[animal.gives!];
  const gifts = shuffle([right, ...shuffle(wrongGifts(animal)).slice(0, count - 1)]);
  return { kind: "gift", animal, gifts, correct: gifts.indexOf(right) };
}

/** The homes of a home round, `animal`'s own among `count` it doesn't live in (`wrongHomes`), in random order. */
export function dealHome(animal: Animal, count: number): HomeRound {
  const right = HOMES[animal.home!];
  const homes = shuffle([right, ...shuffle(wrongHomes(animal)).slice(0, count - 1)]);
  return { kind: "home", animal, homes, correct: homes.indexOf(right) };
}

/**
 * What `growth` becomes among what `count - 1` others become, in random order; never one a child could think comes
 * out of `growth` too (`GROW_LOOKALIKES`: no plant next to another plant), so every other one is clearly wrong.
 */
export function dealGrow(growth: Growth, count: number): GrowRound {
  const others = GROWTHS.filter((g) => g !== growth && !growLookAlike(g, growth));
  const grown = shuffle([growth, ...shuffle(others).slice(0, count - 1)]);
  return { kind: "grow", growth, grown, correct: grown.indexOf(growth) };
}

/**
 * The animals of a sound round, `animal` among `count - 1` others that make a sound of their own, in random order;
 * never one that sounds like it (`SOUND_LOOKALIKES`: no tiger next to the lion), so only one choice fits what is heard.
 */
export function dealSound(animal: Animal, count: number): SoundRound {
  const others = SOUND_ANIMALS.filter((a) => a !== animal && !soundLookAlike(a, animal));
  const animals = shuffle([animal, ...shuffle(others).slice(0, count - 1)]);
  return { kind: "sound", animal, animals, correct: animals.indexOf(animal) };
}
