import { describe, expect, test } from "bun:test";
import { ar } from "@/content/ar";
import { de } from "@/content/de";
import { en } from "@/content/en";
import { es } from "@/content/es";
import { hi } from "@/content/hi";
import { keyMatches, toUpper } from "@/content/languages";
import { ru } from "@/content/ru";
import { textUnits, unitKey, spellingOf } from "@/content/spelling";
import { zh } from "@/content/zh";
import { FEW_KEYS_MAX, FEW_KEYS_MIN, GROW_AFTER, bigKeyChoices, findableLetters, nextKeyLevel } from "./fewKeys";

// Wörter tippen's few big keys (W-02): exactly one key types the wanted letter (root CLAUDE.md: never a second choice a
// child could rightly pick), in every pack, also where one key has two letters (Hindi क ख) or a letter its plain form (Ä A).
describe("few big keys", () => {
  const packs = { de, en, es, ru, zh, hi, ar };

  test.each(Object.entries(packs))("exactly one of them types the wanted letter, in %s", (_, pack) => {
    const pool = findableLetters(pack, "all").map((l) => l.upper);
    // Every first piece of every word, as Wörter tippen asks for it, and every letter „Wo ist das B?“ asks for.
    const wanted = new Set(pool);
    for (const letter of pack.letters) for (const word of letter.words) wanted.add(toUpper(unitKey(textUnits(spellingOf(word))[0]), pack));
    for (const key of wanted) {
      for (const count of [FEW_KEYS_MIN, 4, FEW_KEYS_MAX]) {
        const keys = bigKeyChoices(key, pool, count, pack);
        expect(keys).toHaveLength(count);
        expect(new Set(keys).size).toBe(count);
        expect(keys.filter((k) => keyMatches(k, key, pack) || keyMatches(key, k, pack))).toEqual([key]);
      }
    }
  });

  test("Ä never stands beside A, nor क beside ख", () => {
    for (let run = 0; run < 30; run++) {
      expect(
        bigKeyChoices(
          "Ä",
          findableLetters(de, "all").map((l) => l.upper),
          FEW_KEYS_MAX,
          de,
        ),
      ).not.toContain("A");
      expect(
        bigKeyChoices(
          "क",
          hi.letters.map((l) => l.upper),
          40,
          hi,
        ),
      ).not.toContain("ख");
    }
  });

  test("grows by one key after a few letters found at the first tap, and shrinks after wrong taps – within 3 to 6", () => {
    let level = { count: FEW_KEYS_MIN, streak: 0 };
    for (let i = 0; i < GROW_AFTER - 1; i++) level = nextKeyLevel(level, true);
    expect(level.count).toBe(FEW_KEYS_MIN);
    level = nextKeyLevel(level, true);
    expect(level).toEqual({ count: FEW_KEYS_MIN + 1, streak: 0 });
    for (let i = 0; i < 50; i++) level = nextKeyLevel(level, true);
    expect(level.count).toBe(FEW_KEYS_MAX);
    level = nextKeyLevel(level, false);
    expect(level).toEqual({ count: FEW_KEYS_MAX - 1, streak: 0 });
    for (let i = 0; i < 10; i++) level = nextKeyLevel(level, false);
    expect(level.count).toBe(FEW_KEYS_MIN);
  });
});
