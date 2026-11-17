import { Glob } from "bun";
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { basename, dirname } from "node:path";
import { isWaiting, waitingFor } from "./soundWait";
import { forgetOld, hush, recordedVoice, recordingUrl, untilHush } from "./voice";
import { recordingName } from "./voiceName";

// What a line with a missing recording does (user decision, November 2026): the English recording plays instead,
// and where there is none, nothing – never the German one, which a child hearing Russian or Spanish can't follow.

const files = (entries: [string, string][]) => new Map(entries.map(([text, language]) => [recordingName(text, language), `${language}:${text}`]));

describe("recordingUrl", () => {
  const urls = files([
    ["Gute Nacht!", "de"],
    ["Good night!", "en"],
    ["Спокойной ночи!", "ru"],
  ]);

  test("a line with a recording in the app language plays that one", () => {
    expect(recordingUrl(urls, "Спокойной ночи!", "ru", "Good night!")).toBe("ru:Спокойной ночи!");
    expect(recordingUrl(urls, "Gute Nacht!", "de", "Good night!")).toBe("de:Gute Nacht!");
    expect(recordingUrl(urls, "Good night!", "en")).toBe("en:Good night!");
  });

  test("a line without one plays its English recording", () => {
    expect(recordingUrl(urls, "¡Buenas noches!", "es", "Good night!")).toBe("en:Good night!");
    // A German fallback line (not translated) in Spanish: its English version plays, not the German recording.
    expect(recordingUrl(urls, "Gute Nacht!", "es", "Good night!")).toBe("en:Good night!");
  });

  test("a line without an English recording either is silent, never German", () => {
    expect(recordingUrl(urls, "Gute Nacht!", "es")).toBeUndefined();
    expect(recordingUrl(urls, "Gute Nacht!", "es", "Sleep well!")).toBeUndefined();
    expect(recordingUrl(urls, "Gute Nacht!", "en")).toBeUndefined();
  });

  test("German and English have no further fallback", () => {
    expect(recordingUrl(urls, "Schlaf gut!", "de", "Good night!")).toBeUndefined();
    expect(recordingUrl(urls, "Sleep well!", "en", "Good night!")).toBeUndefined();
  });
});

describe("what a voice keeps in memory", () => {
  test("the decoded lines used longest ago go first, until the rest fit", () => {
    const sounds = new Map([
      ["a", { duration: 60 }],
      ["b", { duration: 60 }],
      ["c", { duration: 60 }],
    ]);
    forgetOld(sounds, 130);
    expect([...sounds.keys()]).toEqual(["b", "c"]);
    forgetOld(sounds, 200);
    expect([...sounds.keys()]).toEqual(["b", "c"]);
  });
});

// The voices are over 200 MB (November 2026): a game loads this round's lines and the next one's, never its whole
// folder – `loadAll` only where a language has a few dozen lines, so a game can fetch them all as it starts.
test("only a voice of a few dozen lines a language loads all of them", () => {
  const LIMIT = 80;
  const callers = [...new Glob("src/**/*.{ts,tsx}").scanSync(".")].filter(
    (file) => !file.includes(".test.") && file !== "src/lib/voice.ts" && readFileSync(file, "utf8").includes(".loadAll("),
  );
  expect(callers.length).toBeGreaterThan(0);
  for (const file of callers) {
    const game = /^src\/games\/[^/]+/.exec(file)?.[0] ?? dirname(file);
    const perLanguage = new Map<string, number>();
    for (const mp3 of new Glob(`${game}/**/stimme/**/*.mp3`).scanSync(".")) {
      const name = basename(mp3, ".mp3");
      const language = /^([a-z]{2})-/.exec(name)?.[1] ?? "de";
      perLanguage.set(language, (perLanguage.get(language) ?? 0) + 1);
    }
    expect(Math.max(0, ...perLanguage.values()), `${file} loads all of ${game}'s voice`).toBeLessThanOrEqual(LIMIT);
  }
});

test("a line still waiting for its recording stops waiting when the game is left (hush)", async () => {
  // The paw slip (SoundLoading) showed for up to SOUND_WAIT_MS over the menu after a game was left mid-download.
  const never = new Promise<undefined>(() => undefined);
  const waited = waitingFor(Promise.race([never, untilHush()]));
  expect(isWaiting()).toBe(true);
  hush();
  await waited;
  expect(isWaiting()).toBe(false);
  // say() waits so: a recording not there yet races the next hush.
  expect(readFileSync(new URL("./voice.ts", import.meta.url), "utf8")).toContain("waitingFor(Promise.race([atMost(buffer), stopped]))");
});

// A game with hundreds of lines a language gets its file names split by language (`?glob-by-language`, R-P1): a visit
// loads only its language's names and the English ones that stand in for missing lines, when first asked.
describe("a voice split by language", () => {
  const asked: string[] = [];
  const part = (language: string, texts: string[]) => async () => {
    asked.push(language);
    return { default: Object.fromEntries(texts.map((text) => [`${language}/${recordingName(text, language)}.mp3`, `${language}:${text}`])) };
  };
  const parts = {
    de: part("de", ["Gute Nacht!"]),
    en: part("en", ["Good night!"]),
    ru: part("ru", ["Спокойной ночи!"]),
    es: part("es", []),
  };

  test("knows no line before its language is loaded, then its own and the English ones", async () => {
    asked.length = 0;
    const voice = recordedVoice(parts);
    expect(asked).toEqual([]);
    await voice.prepare("ru");
    expect(asked.sort()).toEqual(["en", "ru"]);
    expect(voice.has("Спокойной ночи!", "ru")).toBe(true);
    expect(voice.has("Good night!", "en")).toBe(true);
    expect(voice.has("Gute Nacht!", "de")).toBe(false);
  });

  test("German loads only German, and each part only once", async () => {
    asked.length = 0;
    const voice = recordedVoice(parts);
    await Promise.all([voice.ready(["Gute Nacht!"], "de"), voice.prepare("de")]);
    await voice.prepare("de");
    expect(asked).toEqual(["de"]);
    expect(voice.has("Gute Nacht!", "de")).toBe(true);
  });

  test("a language switched to loads its own part then", async () => {
    asked.length = 0;
    const voice = recordedVoice(parts);
    await voice.prepare("en");
    await voice.prepare("es");
    expect(asked).toEqual(["en", "es"]);
  });

  test("the plugin gives one part per language folder, German outside them", async () => {
    const { default: byLanguage } = await import("../games/letters/stimme/**/*.mp3?glob-by-language");
    expect(Object.keys(byLanguage)).toEqual(expect.arrayContaining(["de", "en", "ru"]));
    const [de, ru] = await Promise.all([byLanguage.de(), byLanguage.ru()]);
    const names = (map: Readonly<Record<string, string>>) => Object.keys(map);
    expect(names(de.default).length).toBeGreaterThan(100);
    expect(names(de.default).every((file) => !file.includes("/"))).toBe(true);
    expect(names(ru.default).every((file) => file.startsWith("ru/ru-"))).toBe(true);
  });
});
