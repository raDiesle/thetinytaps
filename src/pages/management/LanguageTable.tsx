import { LANGUAGE_STATUS, languageStateOf, type LanguageState } from "@/content/ideas";
import { TARGET_LANGUAGES, type TargetLanguage } from "@/content/targetLanguages";
import { pick } from "@/lib/language";
import { GAME_BY_HREF } from "./shared";

const LANGUAGE_MARKS: Record<LanguageState, { mark: string; label: string }> = {
  done: { mark: "✅", label: "fertig" },
  text: { mark: "📝", label: "übersetzt, Aufnahme fehlt" },
  partial: { mark: "🟡", label: "teilweise" },
};

/** One cell of the language table: what is there in this language, or a dot for nothing yet. */
function LanguageCell({ language, state }: { language: TargetLanguage; state: LanguageState | undefined }) {
  return state ? (
    <td title={`${language.label}: ${LANGUAGE_MARKS[state].label}`}>{LANGUAGE_MARKS[state].mark}</td>
  ) : (
    <td className="ideas-zero" title={`${language.label}: fehlt`}>
      ·
    </td>
  );
}

/**
 * Which game already speaks which of the wanted languages (content/targetLanguages.ts),
 * games × languages, games with parts of their own (stories, the sung song) part by part.
 * Translations and recordings are only made on request, so this is also the list of what is missing.
 */
export function Languages() {
  return (
    <details id="sprachen" className="ideas-panel">
      <summary>
        <h2>🌍 Sprachen: Deutsch, die fünf größten Weltsprachen, Russisch, Italienisch</h2>
      </summary>
      <p className="ideas-hint">
        Übersetzt und aufgenommen wird nur auf Wunsch, weil es Tokens und Credits kostet: Neues kommt erst auf Deutsch und steht hier als fehlend. Sag dann z.
        B. „übersetze die Wolkenreise ins Englische“ oder „nimm Russisch für die Schatzinsel auf“. ✅ fertig, 📝 übersetzt, aber die Aufnahme (🎙️) fehlt noch, 🟡
        teilweise, · fehlt. Idee dazu: A-18.
      </p>
      <div className="ideas-overview-scroll">
        <table className="ideas-overview ideas-languages">
          <thead>
            <tr>
              <th>Spiel</th>
              {TARGET_LANGUAGES.map((l) => (
                <th key={l.id} title={l.reason}>
                  {l.label.split(" ")[0]}
                  <small>{l.label.split(" ").slice(1).join(" ")}</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LANGUAGE_STATUS.flatMap((row) => {
              const game = GAME_BY_HREF.get(row.href);
              return [
                <tr key={row.href}>
                  <th>
                    {game ? `${game.emoji} ${pick(game.title, "de")}` : "🏠 Startseite & Eltern"}
                    {row.recorded && " 🎙️"}
                    {row.note && <small>{row.note}</small>}
                  </th>
                  {TARGET_LANGUAGES.map((l) => (
                    <LanguageCell key={l.id} language={l} state={languageStateOf(row, l.id)} />
                  ))}
                </tr>,
                ...(row.parts ?? []).map((part) => (
                  <tr key={`${row.href} ${part.label}`} className="ideas-languages-part">
                    <th>
                      {part.label}
                      {part.recorded && " 🎙️"}
                      {part.note && <small>{part.note}</small>}
                    </th>
                    {TARGET_LANGUAGES.map((l) => (
                      <LanguageCell key={l.id} language={l} state={part.languages[l.id]} />
                    ))}
                  </tr>
                )),
              ];
            })}
          </tbody>
          <tfoot>
            <tr>
              <th>Fertig</th>
              {TARGET_LANGUAGES.map((l) => (
                <td key={l.id} className="ideas-overview-done">
                  {LANGUAGE_STATUS.filter((row) => languageStateOf(row, l.id) === "done").length}/{LANGUAGE_STATUS.length}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </details>
  );
}
