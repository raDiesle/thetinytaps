import { expect, test } from "bun:test";
import { APP_LANGUAGES } from "@/lib/language";
import { LANGUAGE_STATUS } from "./ideas";

// Since 22 November 2026 every new or changed text comes in all seven app languages in the same commit (user decision,
// root CLAUDE.md, Language), and the gaps left from before were translated that day. So no part of the language status
// may lack an app language: a new story, mode or line can't be marked „en only“ in languageStatus.ts instead of being
// translated – and since inlineTexts.test.ts holds the inline texts to their row, an untranslated inline text fails too.
// Recordings may still be missing (`"text"`, made only when the user asks); `"partial"` is for what a language can't
// have at all (Hindi and Arabic have no small letters for „Wo ist das kleine b?“), with its note saying why.

test("every part of the language status has every app language, at least as text", () => {
  const gaps = LANGUAGE_STATUS.flatMap((row) =>
    (row.parts ?? [{ label: "", languages: row.languages }]).flatMap((part) => {
      const missing = APP_LANGUAGES.filter((language) => !part.languages?.[language]);
      return missing.length ? [`${row.href}${part.label ? ` › ${part.label}` : ""} – ${missing.join(", ")} missing: translate it in this commit`] : [];
    }),
  );
  expect(gaps).toEqual([]);
});
