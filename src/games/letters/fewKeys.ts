import { useCallback, useRef } from "react";
import { keyMatches } from "@/content/languages";
import type { LanguagePack, LetterEntry, ThemeId } from "@/content/types";
import { shuffle } from "@/lib/random";

/**
 * Wörter tippen's keys on a touch screen (W-02): a few big letter keys – the right one and some others – instead of the
 * whole alphabet. "auto" starts with three and grows to six as the child finds the letters at the first tap; a number
 * fixes how many; "all" shows the whole on-screen keyboard as before.
 */
export type BigKeysMode = "auto" | "3" | "4" | "6" | "all";

/** The fewest and the most big keys "auto" shows. */
export const FEW_KEYS_MIN = 3;
export const FEW_KEYS_MAX = 6;
/** Letters found with the first tap in a row before "auto" shows one key more. */
export const GROW_AFTER = 3;

/** How many big keys "auto" shows now, and the letters found with the first tap in a row. */
export type KeyLevel = { count: number; streak: number };

/**
 * After a letter was found: found with the first tap, a few in a row bring one key more; found only after wrong taps,
 * one key less. Never faster – only more letters to tell apart (root CLAUDE.md, „gets harder“).
 */
export function nextKeyLevel({ count, streak }: KeyLevel, firstTry: boolean): KeyLevel {
  if (!firstTry) return { count: Math.max(FEW_KEYS_MIN, count - 1), streak: 0 };
  if (streak + 1 < GROW_AFTER) return { count, streak: streak + 1 };
  return { count: Math.min(FEW_KEYS_MAX, count + 1), streak: 0 };
}

/**
 * The big keys for `wanted`: it and `count - 1` others from `pool`, in random order. Exactly one fits: no other key
 * types the wanted letter, also not as its plain form (A for Ä) or as a second letter on its key (Hindi क and ख).
 */
export function bigKeyChoices(wanted: string, pool: string[], count: number, pack: LanguagePack): string[] {
  const others = shuffle([...new Set(pool)].filter((key) => !keyMatches(key, wanted, pack) && !keyMatches(wanted, key, pack)));
  return shuffle([wanted, ...others.slice(0, Math.max(0, count - 1))]);
}

/**
 * Letters with a key of their own on most keyboards: no umlauts (their keys are missing on many keyboards, and they are
 * rarely among the first letters children know), no Russian Ё (left of the 1) or Spanish Ñ; in other scripts (Hindi,
 * Arabic) the letters printed on the keyboard rows, so none that needs Shift (Hindi ख, ङ). „Wo ist das B?“ asks for
 * them, and the big keys take their other letters from them.
 */
export function findableLetters(pack: LanguagePack, theme: "all" | ThemeId): LetterEntry[] {
  const keys = pack.keyboardRows.join("");
  const findable = (upper: string) => /^[A-ZА-Я]$/.test(upper) || (!/[\p{Script=Latin}\p{Script=Cyrillic}]/u.test(upper) && keys.includes(upper));
  const plain = pack.letters.filter((l) => findable(l.upper));
  if (theme === "all") return plain;
  const matching = plain.filter((l) => l.words.some((w) => w.theme === theme));
  return matching.length > 0 ? matching : plain;
}

/** How many big keys to show for the next letter, and `found` to tell it how the last one went. */
export function useKeyLevel(mode: BigKeysMode) {
  const level = useRef<KeyLevel>({ count: FEW_KEYS_MIN, streak: 0 });
  const count = useCallback(() => (mode === "auto" ? level.current.count : mode === "all" ? 0 : Number(mode)), [mode]);
  const found = useCallback((firstTry: boolean) => {
    level.current = nextKeyLevel(level.current, firstTry);
  }, []);
  return { count, found };
}
