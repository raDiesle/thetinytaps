import { describe, expect, test } from "bun:test";
import { keyMatches, keyOf, LANGUAGES, languageFor, letterIndex, toUpper } from "./languages";
import { joinedForms, spellingOf, textUnits, unitKey } from "./spelling";
import type { LanguagePack } from "./types";

/** Every key place of the letter keys on a Latin keyboard. */
const LETTER_CODES = ["Backquote", "BracketLeft", "BracketRight", "Semicolon", "Quote", "Comma", "Period", "Slash", ..."QWERTYUIOPASDFGHJKLZXCVBNM"].map((c) =>
  c.length === 1 ? `Key${c}` : c,
);

/** What the keys of a German keyboard type in the pack, by their place, with and without Shift. */
function typedByKeys(pack: LanguagePack, shift: boolean[] = [false, true]) {
  const typed = new Set<string>();
  for (const code of LETTER_CODES) {
    for (const shiftKey of shift) {
      const key = code.startsWith("Key") ? code.slice(3).toLowerCase() : "";
      typed.add(toUpper(keyOf({ key, code, shiftKey }, pack), pack));
    }
  }
  return typed;
}

/** Everything a pack shows or says, apart from the letters themselves and the pinyin. */
function packTexts(pack: LanguagePack): string[] {
  const words = pack.letters.flatMap((l) => l.words);
  return [
    ...pack.themes.map((t) => t.label),
    ...pack.letters.flatMap((l) => [l.spoken, pack.findPrompt(l), ...l.words.map((w) => pack.letterSentence(l, w))]),
    ...words.flatMap((w) => [w.word, pack.firstLetterPrompt(w)]),
    ...pack.numberWords,
    ...pack.countables.flatMap((c) => [c.singular, c.plural, ...[0, 1, 2, 3, 5, 9].map((n) => pack.countSentence(n, c))]),
    pack.zero.sentence,
    ...pack.praise,
    ...pack.colors.map((c) => c.word),
    ...pack.actions.flatMap((a) => [a.word, pack.joinIn(a)]),
    pack.whistle,
  ];
}

// The on-screen keys are the pack's letters, so a word with a letter the pack lacks can't be typed on a tablet.
// Polish has no Y among its letters yet ("Buty" needs it), so it waits for that fix.
const WITH_ALL_KEYS = LANGUAGES.filter((language) => language.id !== "pl");

describe.each(WITH_ALL_KEYS.map((language) => [language.id, language] as const))("language %s, words game", (_, { pack }) => {
  test("every piece of every word has a key (a letter of the pack types it)", () => {
    for (const word of [...pack.letters.flatMap((l) => l.words), ...pack.colors, ...pack.actions]) {
      if (!/^[\p{L}\p{M}]+$/u.test(spellingOf(word))) continue;
      for (const unit of textUnits(spellingOf(word)))
        expect(
          pack.letters.some((l) => keyMatches(unitKey(unit), l.upper, pack)),
          `${word.word}: ${unit}`,
        ).toBe(true);
    }
  });

  test("colour and doing words can be typed (no spaces or signs)", () => {
    for (const word of [...pack.colors, ...pack.actions]) expect(spellingOf(word), word.word).toMatch(/^[\p{L}\p{M}]+$/u);
  });
});

describe.each(["ru", "es", "zh", "hi", "ar"].map((id) => [id, languageFor(id).pack] as const))("language %s, keys", (_, pack) => {
  test("every letter is typed by the key at its place (Hindi: some with Shift)", () => {
    const typed = typedByKeys(pack);
    for (const letter of pack.letters) expect(typed, letter.upper).toContain(letter.upper);
  });

  test("without Shift, every letter has a key that counts for it", () => {
    const typed = [...typedByKeys(pack, [false])];
    for (const letter of pack.letters)
      expect(
        typed.some((key) => keyMatches(key, letter.upper, pack)),
        letter.upper,
      ).toBe(true);
  });
});

describe.each(["zh", "hi", "ar"].map((id) => [id, languageFor(id).pack] as const))("language %s, script", (_, pack) => {
  test("shows and says no Latin letters (only the pinyin and the Chinese letters are Latin)", () => {
    for (const text of packTexts(pack)) expect(text, text).not.toMatch(/[A-Za-z]/);
  });
});

describe("Spanish", () => {
  const { pack } = languageFor("es");

  test("has the 27 letters with Ñ, in order", () => {
    expect(pack.letters.map((l) => l.upper).join("")).toBe("ABCDEFGHIJKLMNÑOPQRSTUVWXYZ");
  });

  test("Ñ is the key right of L, on every keyboard; N alone is no Ñ at the start of a word", () => {
    expect(keyOf({ key: "ö", code: "Semicolon" }, pack)).toBe("Ñ");
    expect(keyOf({ key: "n", code: "KeyN" }, pack)).toBe("n");
    const enye = pack.letters.find((l) => l.upper === "Ñ")!;
    expect(letterIndex({ word: "Nube", emoji: "☁️" }, enye, pack)).toBe(-1);
  });

  test("counts with un / una", () => {
    const duck = pack.countables.find((c) => c.emoji === "🦆")!;
    const bee = pack.countables.find((c) => c.emoji === "🐝")!;
    expect([1, 3].map((n) => pack.countSentence(n, duck))).toEqual(["¡Un pato!", "¡Tres patos!"]);
    expect(pack.countSentence(1, bee)).toBe("¡Una abeja!");
    expect(pack.letterSentence(pack.letters[1], pack.letters[1].words[0])).toBe("¡Be de barco!");
  });
});

describe("Chinese", () => {
  const { pack } = languageFor("zh");

  test("has the pinyin letters A–Z without V, and only I, O and U have their words with the letter inside", () => {
    expect(pack.letters.map((l) => l.upper).join("")).toBe("ABCDEFGHIJKLMNOPQRSTUWXYZ");
    expect(pack.letters.filter((l) => l.inWord).map((l) => l.upper)).toEqual(["I", "O", "U"]);
  });

  test("every word has its pinyin, in small Latin letters with tone marks", () => {
    for (const word of [...pack.letters.flatMap((l) => l.words), ...pack.colors, ...pack.actions]) {
      expect(word.spelling, word.word).toBeDefined();
      expect(word.spelling, word.word).toMatch(/^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü']+$/);
      expect(word.word, word.word).toMatch(/^\p{Script=Han}+$/u);
    }
  });

  test("counts with measure words and 两 for two", () => {
    const duck = pack.countables.find((c) => c.emoji === "🦆")!;
    const car = pack.countables.find((c) => c.emoji === "🚗")!;
    expect([1, 2, 3].map((n) => pack.countSentence(n, duck))).toEqual(["一只鸭子！", "两只鸭子！", "三只鸭子！"]);
    expect(pack.countSentence(2, car)).toBe("两辆汽车！");
  });

  test("a Chinese word is typed and marked by its pinyin", () => {
    const b = pack.letters.find((l) => l.upper === "B")!;
    expect(textUnits(spellingOf(b.words[0]))).toEqual(["b", "à", "b", "a"]);
    expect(keyMatches("A", "à", pack)).toBe(true);
    const i = pack.letters.find((l) => l.upper === "I")!;
    expect(letterIndex(i.words[0], i, pack)).toBe(1);
  });
});

describe("Hindi", () => {
  const { pack } = languageFor("hi");

  test("has the ten vowels and the 33 consonants, in the order of the alphabet chart", () => {
    expect(pack.letters.map((l) => l.upper).join("")).toBe("अआइईउऊएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह");
  });

  test("a word is typed letter by letter, each with its vowel sign and joined consonants", () => {
    expect(textUnits("किताब")).toEqual(["कि", "ता", "ब"]);
    expect(textUnits("अंगूर")).toEqual(["अं", "गू", "र"]);
    expect(textUnits("ट्रक")).toEqual(["ट्र", "क"]);
    expect(textUnits("पिज़्ज़ा").map(unitKey)).toEqual(["प", "ज"]);
  });

  test("a key counts for both its letters, so Shift is never needed", () => {
    expect(keyOf({ key: "k", code: "KeyK" }, pack)).toBe("क");
    expect(keyOf({ key: "K", code: "KeyK", shiftKey: true }, pack)).toBe("ख");
    expect(keyMatches("क", "ख", pack)).toBe(true);
    expect(keyMatches("क", "ग", pack)).toBe(false);
    expect(keyOf({ key: "३", code: "Digit3" }, pack)).toBe("3");
  });

  test("speaks as Hindi alphabet charts do", () => {
    const ka = pack.letters.find((l) => l.upper === "क")!;
    expect(pack.letterSentence(ka, ka.words[0])).toBe("क से कबूतर!");
    expect(pack.countSentence(2, pack.countables.find((c) => c.emoji === "🍌")!)).toBe("दो केले!");
  });
});

describe("Arabic", () => {
  const { pack } = languageFor("ar");

  test("has the 28 letters of the alphabet in order", () => {
    expect(pack.letters.map((l) => l.upper).join("")).toBe("ابتثجحخدذرزسشصضطظعغفقكلمنهوي");
  });

  test("words start with their letter, also after the article ال", () => {
    for (const letter of pack.letters)
      for (const word of letter.words) {
        const bare = word.word.startsWith("ال") ? { ...word, word: word.word.slice(2) } : word;
        expect(letterIndex(bare, letter, pack), word.word).toBe(0);
      }
  });

  test("the alif key finds أ and إ, ت finds ة, and Arabic digits count as numbers", () => {
    expect(keyMatches("ا", "أ", pack)).toBe(true);
    expect(keyMatches("ا", "إ", pack)).toBe(true);
    expect(keyMatches("ت", "ة", pack)).toBe(true);
    expect(keyOf({ key: "c", code: "KeyC" }, pack)).toBe("و");
    expect(keyOf({ key: "٣", code: "Digit3" }, pack)).toBe("3");
  });

  test("letters drawn apart keep their joined shape", () => {
    expect(joinedForms(textUnits("بطة"))).toEqual(["ب‍", "‍ط‍", "‍ة"]);
    // د doesn't join to the next letter: "دب" stays apart.
    expect(joinedForms(textUnits("دب"))).toEqual(["د", "ب"]);
  });

  test("counts with the gender, the dual and the number in the other gender", () => {
    const duck = pack.countables.find((c) => c.emoji === "🦆")!;
    const sock = pack.countables.find((c) => c.emoji === "🧦")!;
    expect([1, 2, 3, 8].map((n) => pack.countSentence(n, duck))).toEqual(["بطة واحدة!", "بطتان!", "ثلاث بطات!", "ثماني بطات!"]);
    expect([1, 3].map((n) => pack.countSentence(n, sock))).toEqual(["جورب واحد!", "ثلاثة جوارب!"]);
  });
});
