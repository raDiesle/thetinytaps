import { expect, test } from "@rstest/core";
import type { Localized } from "@/lib/language";
import { LEVEL_TEXTS, NUDGES, SAYS, STATION_TEXTS, VOICE_WORDS } from "./texts";

// Every text the lion, the mouse and the pictures say or show needs its Russian too,
// else a Russian child would hear German.

const CYRILLIC = /[а-яё]/i;

/** Every Localized in a nested object, with where it is. */
function localizedIn(value: unknown, path: string): [string, Localized<string | string[]>][] {
  if (value && typeof value === "object" && "de" in value) return [[path, value as Localized<string | string[]>]];
  if (value && typeof value === "object") return Object.entries(value).flatMap(([key, inner]) => localizedIn(inner, `${path}.${key}`));
  return [];
}

const ALL = localizedIn({ SAYS, NUDGES, STATION_TEXTS, VOICE_WORDS, LEVEL_TEXTS }, "texts");

test("every text has a Russian one in Cyrillic", () => {
  expect(ALL.length).toBeGreaterThan(30);
  for (const [path, text] of ALL) {
    const ru = text.ru;
    expect(ru, path).toBeTruthy();
    for (const line of [ru ?? []].flat()) expect(line, path).toMatch(CYRILLIC);
  }
});

test("the animals have as many Russian sayings as German ones", () => {
  for (const [who, says] of Object.entries(SAYS)) expect(says.ru?.length, who).toBe(says.de.length);
});
