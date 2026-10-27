import { expect, test } from "bun:test";
import { targetLanguageFor } from "@/content/targetLanguages";
import { type Localized, spokenIn } from "@/lib/language";
import { LEVEL_TEXTS, NUDGES, SAYS, STATION_TEXTS, VOICE_WORDS } from "./texts";

// Translations are made only when the user asks, so a text may lack its Russian (it is
// then said in German with the German voice); the Russian that is there must be Russian.

const CYRILLIC = /[а-яё]/i;

/** Every Localized in a nested object, with where it is. */
function localizedIn(value: unknown, path: string): [string, Localized<string | string[]>][] {
  if (value && typeof value === "object" && "de" in value) return [[path, value as Localized<string | string[]>]];
  if (value && typeof value === "object") return Object.entries(value).flatMap(([key, inner]) => localizedIn(inner, `${path}.${key}`));
  return [];
}

const ALL = localizedIn({ SAYS, NUDGES, STATION_TEXTS, VOICE_WORDS, LEVEL_TEXTS }, "texts");

test("the Russian texts that are there are written in Cyrillic", () => {
  expect(ALL.length).toBeGreaterThan(30);
  for (const [path, text] of ALL) {
    if (text.ru === undefined) continue;
    const lines = [text.ru].flat();
    expect(lines.length, path).toBeGreaterThan(0);
    for (const line of lines) expect(line, path).toMatch(CYRILLIC);
  }
});

test("a text without Russian is spoken in German with the German voice", () => {
  const russian = targetLanguageFor("ru");
  expect(spokenIn({ de: "Hallo" }, russian)).toEqual({ text: "Hallo", lang: "de-DE" });
  expect(spokenIn({ de: "Hallo", ru: "Привет" }, russian)).toEqual({ text: "Привет", lang: russian.speechLang });
});
