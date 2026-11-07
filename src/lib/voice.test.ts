import { describe, expect, test } from "bun:test";
import { recordingUrl } from "./voice";
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
