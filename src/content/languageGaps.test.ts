import { describe, expect, test } from "bun:test";
import { APP_LANGUAGES } from "@/lib/language";
import { LANGUAGE_STATUS } from "./ideas";

// Since 22 November 2026 every new or changed text comes in all seven app languages in the same commit (user decision,
// root CLAUDE.md, Language). A part of the language status missing an app language is a gap; the gaps left from before
// that day are listed here, and no new one may join them. So a new story, mode or line can't be marked „en only“ in
// languageStatus.ts instead of being translated – and since inlineTexts.test.ts holds the inline texts to their row,
// an untranslated inline text fails too. A gap translated later leaves this list in the same commit.

/** The gaps from before 22 November 2026, as `<href> › <part label>` (the href alone for a row without parts). */
const OLD_GAPS = [
  "/timer/ › ⚖️ Wippe",
  "/timer/ › 🧸 Tidy Up",
  "/abstillen/ › 🌙 The Milk Sleeps at Night",
  "/grosses-bett/",
  "/toepfchen/ › 📺 Kapitelnamen der Videos",
  "/toepfchen/ › 👪 Video für Eltern (Zeilen neben dem Tablet)",
  "/bilder/ › 🔊 Geräusch-Rätsel",
  "/gross-klein/",
  "/ › 📚 Abspann der YouTube-Videos",
];

/** Every part of the language status that lacks an app language, with the languages it lacks. */
function gaps() {
  return LANGUAGE_STATUS.flatMap((row) =>
    (row.parts ?? [{ label: "", languages: row.languages }]).flatMap((part) => {
      const missing = APP_LANGUAGES.filter((language) => !part.languages?.[language]);
      return missing.length ? [{ key: part.label ? `${row.href} › ${part.label}` : row.href, missing }] : [];
    }),
  );
}

describe("new texts come in every app language", () => {
  test("no part of the language status lacks an app language, but the gaps left from before 22 November 2026", () => {
    const fresh = gaps()
      .filter(({ key }) => !OLD_GAPS.includes(key))
      .map(({ key, missing }) => `${key} – ${missing.join(", ")} missing: translate it in this commit`);
    expect(fresh).toEqual([]);
  });

  test("a gap translated leaves the list", () => {
    const open = new Set(gaps().map(({ key }) => key));
    expect(OLD_GAPS.filter((key) => !open.has(key))).toEqual([]);
  });
});
