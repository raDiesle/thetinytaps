import { useMemo, useState } from "react";
import { CATEGORIES } from "@/content/games";
import { stillToRecord, type VoiceGame, voiceLines } from "@/content/voiceLines";

/** What a character costs with the turbo model, as measured in October 2026 (src/games/adventure/CLAUDE.md). */
const CREDITS_PER_CHARACTER = 0.1;
/** The credits of the plan, each month. */
const CREDITS_PER_MONTH = 10_000;

const GAME_BY_HREF = new Map(CATEGORIES.flatMap((c) => c.games.map((g) => [g.href, g])));
const nameOf = (href: string) => {
  const game = GAME_BY_HREF.get(href);
  return game ? `${game.emoji} ${game.title.de}` : "🏠 Alle Spiele";
};
const number = (n: number) => Math.round(n).toLocaleString("de-DE");
const linesOf = (game: VoiceGame) => game.groups.flatMap((g) => g.lines);
const charactersOf = (lines: string[]) => lines.reduce((sum, line) => sum + line.length, 0);

/**
 * On the management page: every German line the games would say, which ElevenLabs still has to record now that
 * the browser's voice is off – how many per game, what they cost, and the lines themselves to copy. Loaded only
 * there (lazily), since it reads the data of every game (src/content/voiceLines.ts).
 */
export function VoiceList() {
  const all = useMemo(voiceLines, []);
  const games = useMemo(() => stillToRecord(all), [all]);
  const done = all.filter((game) => !games.some((g) => g.href === game.href));
  const total = games.flatMap(linesOf);
  const characters = charactersOf(total);
  return (
    <>
      <p className="ideas-hint">
        Die Browserstimme spricht nicht mehr (Oktober 2026); was die Spiele sagen, kommt nur noch als Aufnahme und spielt dann immer, wie ein Geräusch. Hier
        steht jeder deutsche Satz, der dafür noch keine Aufnahme hat – direkt aus den Spieldaten gelesen, also immer aktuell. Jede weitere Sprache braucht noch
        einmal so viele. Credits geschätzt mit {String(CREDITS_PER_CHARACTER).replace(".", ",")} je Zeichen (Turbo-Modell, gemessen im Oktober 2026),{" "}
        {number(CREDITS_PER_MONTH)} gibt es im Monat. Sag dann z. B. „nimm die Sätze von Socken-Paare auf“.
      </p>
      <div className="ideas-overview-scroll">
        <table className="ideas-overview voice-overview">
          <thead>
            <tr>
              <th>Spiel</th>
              <th>Sätze</th>
              <th>Zeichen</th>
              <th>≈ Credits</th>
            </tr>
          </thead>
          <tbody>
            {["🏝️ Bewegungsabenteuer", ...done.map((game) => nameOf(game.href))].map((name) => (
              <tr key={name} className="ideas-overview-finished">
                <th>{name}</th>
                <td colSpan={3}>✅ schon aufgenommen</td>
              </tr>
            ))}
            {games.map((game) => {
              const lines = linesOf(game);
              return (
                <tr key={game.href}>
                  <th>
                    <a href={`#stimmen-${game.href || "alle"}`}>{nameOf(game.href)}</a>
                  </th>
                  <td>{number(lines.length)}</td>
                  <td>{number(charactersOf(lines))}</td>
                  <td>{number(charactersOf(lines) * CREDITS_PER_CHARACTER)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th>Alles auf Deutsch</th>
              <td>{number(total.length)}</td>
              <td>{number(characters)}</td>
              <td className="ideas-overview-done">
                {number(characters * CREDITS_PER_CHARACTER)} (≈ {number(Math.ceil((characters * CREDITS_PER_CHARACTER) / CREDITS_PER_MONTH))} Monate)
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {games.map((game) => (
        <VoiceGameLines key={game.href} game={game} />
      ))}
    </>
  );
}

/** One game's lines, group by group, folded away until opened, with a button that copies them one per line. */
function VoiceGameLines({ game }: { game: VoiceGame }) {
  const [copied, setCopied] = useState(false);
  const lines = linesOf(game);
  const copy = () => {
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <details id={`stimmen-${game.href || "alle"}`} className="ideas-panel voice-game">
      <summary>
        <h3>
          {nameOf(game.href)} ({number(lines.length)} {lines.length === 1 ? "Satz" : "Sätze"})
        </h3>
      </summary>
      <button type="button" className="ideas-copy" onClick={copy}>
        {copied ? "Kopiert ✓" : "📋 Alle Sätze kopieren"}
      </button>
      {game.groups.map((group) => (
        <div key={group.label} className="voice-group">
          <h4>
            {group.label} ({number(group.lines.length)})
          </h4>
          {(group.built || group.note) && (
            <p className="ideas-hint">
              {group.built && <>🧩 Im Spiel zusammengesetzt: {group.built}. </>}
              {group.note}
            </p>
          )}
          <ol className="voice-lines">
            {group.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </div>
      ))}
    </details>
  );
}
