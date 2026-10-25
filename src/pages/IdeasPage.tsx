import { useState } from "react";
import { Link } from "react-router";
import { FullscreenCorner } from "@/components/FullscreenButton";
import { CATEGORIES } from "@/content/games";
import {
  EFFORT_LABELS,
  IDEA_AREAS,
  IDEA_GROUPS,
  LANGUAGE_STATUS,
  TODDLER_RULES,
  TOP_PICKS,
  ideaStatus,
  type Effort,
  type Idea,
  type IdeaArea,
  type IdeaStatus,
  type LanguageState,
  languageStateOf,
} from "@/content/ideas";
import { TARGET_LANGUAGES, type TargetLanguage } from "@/content/targetLanguages";
import { useStoredSettings } from "@/lib/storage";
import { useTitle } from "@/lib/title";

/** The grown-up's own decision on an idea, saved per browser. */
type Mark = "next" | "maybe" | "no";

type StatusFilter = "all" | "todo" | "done" | "rejected";
type MarkFilter = "any" | Mark | "undecided";
type GroupBy = "area" | "effort";

const EFFORTS: Effort[] = ["S", "M", "L"];

const MARKS: { value: Mark; emoji: string; label: string }[] = [
  { value: "next", emoji: "⭐", label: "Als nächstes" },
  { value: "maybe", emoji: "🤔", label: "Vielleicht" },
  { value: "no", emoji: "👎", label: "Eher nicht" },
];

const ALL_IDEAS = IDEA_AREAS.flatMap((a) => a.ideas);
const AREA_OF = new Map(IDEA_AREAS.flatMap((a) => a.ideas.map((i) => [i.id, a] as const)));
const IDEA_BY_ID = new Map(ALL_IDEAS.map((i) => [i.id, i]));

const STATUS_ORDER: Record<IdeaStatus, number> = { open: 0, partial: 1, done: 2, rejected: 3 };

/** Still to build: neither done nor turned down. */
const isOpen = (idea: Idea) => !idea.done && !idea.rejected;
const countDone = (ideas: Idea[]) => ideas.filter((i) => i.done).length;
/** Rejected ideas don't count towards the progress; they only show under their own filter. */
const countActive = (ideas: Idea[]) => ideas.filter((i) => !i.rejected).length;

const DEFAULTS = {
  marks: {} as Record<string, Mark>,
  /** Stars from the first version of this page; read as "next" and cleared on the next change. */
  starred: [] as string[],
  status: "todo" as StatusFilter,
  efforts: [] as Effort[],
  mark: "any" as MarkFilter,
  area: "" as string,
  groupBy: "area" as GroupBy,
};

/**
 * Hidden page for grown-ups: the idea collection from content/ideas, built for
 * choosing what to make next. An overview table shows where the open work is
 * (area × effort), filters narrow the list, and each idea can be marked
 * ⭐ / 🤔 / 👎. The ⭐ ones collect at the top, ready to copy as "mach N-01, …".
 * Reached by holding the "p" in the home page title.
 */
export function IdeasPage() {
  useTitle("Ideen");
  const [saved, update] = useStoredSettings("tinytaps.ideas.v1", DEFAULTS);
  const [query, setQuery] = useState("");
  const marks: Record<string, Mark> = { ...Object.fromEntries(saved.starred.map((id) => [id, "next"])), ...saved.marks };
  const done = countDone(ALL_IDEAS);
  const active = countActive(ALL_IDEAS);
  const rejected = ALL_IDEAS.length - active;

  const setMark = (id: string, mark: Mark) => {
    const next = { ...marks };
    if (next[id] === mark) delete next[id];
    else next[id] = mark;
    update({ marks: next, starred: [] });
  };

  /** Shows an idea even when the filters hide it, then scrolls to it. */
  const showIdea = (id: string) => {
    if (!document.getElementById(id)) {
      setQuery("");
      update({ status: "all", efforts: [], mark: "any", area: "" });
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
    });
  };

  /** From the overview table: only this area (and effort), open ideas. */
  const pick = (area: string, effort?: Effort) => {
    setQuery("");
    update({ area, efforts: effort ? [effort] : [], status: "todo", mark: "any" });
    setTimeout(() => document.getElementById("ideas-list")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const visible = (idea: Idea) => {
    const mark = marks[idea.id];
    if ((saved.status === "rejected") !== !!idea.rejected) return false;
    if (saved.status === "todo" && !isOpen(idea)) return false;
    if (saved.status === "done" && !idea.done) return false;
    if (saved.efforts.length > 0 && !saved.efforts.includes(idea.effort)) return false;
    if (saved.area && AREA_OF.get(idea.id)?.prefix !== saved.area) return false;
    if (saved.mark === "undecided" ? mark : saved.mark !== "any" && mark !== saved.mark) return false;
    const haystack = `${idea.id} ${idea.title} ${idea.text} ${idea.why ?? ""} ${idea.partial ?? ""}`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  };
  /** Open before partly done before done; "eher nicht" sinks to the bottom; otherwise number order. */
  const order = (a: Idea, b: Idea) => STATUS_ORDER[ideaStatus(a)] - STATUS_ORDER[ideaStatus(b)] || Number(marks[a.id] === "no") - Number(marks[b.id] === "no");

  const shown = ALL_IDEAS.filter(visible);
  const sections: { key: string; title: string; intro?: string; ideas: Idea[] }[] =
    saved.groupBy === "area"
      ? IDEA_AREAS.map((a) => ({ key: a.prefix, title: `${a.emoji} ${a.prefix} – ${a.title}`, intro: a.intro, ideas: a.ideas.filter(visible).sort(order) }))
      : EFFORTS.map((e) => ({ key: e, title: `Aufwand ${e} – ${EFFORT_LABELS[e]}`, ideas: shown.filter((i) => i.effort === e).sort(order) }));

  const marked = (mark: Mark) =>
    Object.keys(marks)
      .filter((id) => marks[id] === mark)
      .map((id) => IDEA_BY_ID.get(id))
      .filter((i): i is Idea => !!i && isOpen(i));
  const nextIdeas = marked("next");
  const noIdeas = marked("no");
  const picks = TOP_PICKS.filter(({ id }) => isOpen(IDEA_BY_ID.get(id) as Idea));
  const filtered = saved.status !== DEFAULTS.status || saved.efforts.length > 0 || saved.mark !== "any" || saved.area !== "" || words.length > 0;
  const markProps = { marks, onMark: setMark };

  return (
    <main className="home ideas">
      <FullscreenCorner />
      <Link to="/" className="back-link">
        ← Alle Spiele
      </Link>
      <h1>
        <span aria-hidden>💡</span> Ideen
      </h1>
      <p className="home-subtitle">
        {active - done} offene Ideen, {done} schon umgesetzt, {rejected} abgelehnt. Die Nummern (z.&nbsp;B. <b>N-03</b>) bleiben fest, damit man sie nennen
        kann.
      </p>
      <Progress done={done} total={active} />

      <NextPanel ideas={nextIdeas} noIdeas={noIdeas} onShow={showIdea} onMark={setMark} />

      <section className="ideas-panel">
        <h2>Überblick: Wo ist was offen?</h2>
        <p className="ideas-hint">Zahlen = offene Ideen. Antippen zeigt genau diese Ideen unten.</p>
        <Overview marks={marks} onPick={pick} />
      </section>

      <Languages />

      {picks.length > 0 && (
        <section className="ideas-panel">
          <h2>Meine Empfehlung</h2>
          <ol className="ideas-picks">
            {picks.map(({ id, reason }) => {
              const idea = IDEA_BY_ID.get(id) as Idea;
              return (
                <li key={id}>
                  <button type="button" className="idea-id" onClick={() => showIdea(id)}>
                    {id}
                  </button>
                  <EffortTag effort={idea.effort} short />
                  <span>
                    <b>{idea.title}</b> – {reason}
                  </span>
                  <MarkButtons id={id} {...markProps} />
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <details className="ideas-panel">
        <summary>
          <h2>So einfach muss es sein – Faustregeln für 2-Jährige</h2>
        </summary>
        <ul className="ideas-rules">
          {TODDLER_RULES.map(({ emoji, text }) => (
            <li key={text}>
              <span aria-hidden>{emoji}</span> {text}
            </li>
          ))}
        </ul>
      </details>

      <div id="ideas-list" className="ideas-toolbar">
        <input
          type="search"
          className="ideas-search"
          placeholder="Suchen (z. B. Bagger, Musik, N-1)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Chips
          label="Zeigen"
          options={[
            { value: "todo", label: `Offen (${active - done})` },
            { value: "done", label: `✅ Umgesetzt (${done})` },
            { value: "all", label: "Alle" },
            { value: "rejected", label: `🚫 Abgelehnt (${rejected})` },
          ]}
          selected={[saved.status]}
          onToggle={(status) => update({ status })}
        />
        <Chips
          label="Aufwand"
          options={EFFORTS.map((e) => ({ value: e, label: `${e} ${EFFORT_LABELS[e]}`, className: `effort-${e}` }))}
          selected={saved.efforts}
          onToggle={(e) => update({ efforts: saved.efforts.includes(e) ? saved.efforts.filter((x) => x !== e) : [...saved.efforts, e] })}
        />
        <Chips
          label="Markiert"
          options={[
            { value: "any", label: "Egal" },
            ...MARKS.map((m) => ({ value: m.value, label: `${m.emoji} ${m.label}` })),
            { value: "undecided", label: "Noch nicht entschieden" },
          ]}
          selected={[saved.mark]}
          onToggle={(mark) => update({ mark })}
        />
        <Chips
          label="Bereich"
          options={[{ value: "", label: "Alle" }, ...IDEA_AREAS.map((a) => ({ value: a.prefix, label: `${a.emoji} ${a.prefix}`, title: a.title }))]}
          selected={[saved.area]}
          onToggle={(area) => update({ area })}
        />
        <Chips
          label="Ordnen nach"
          options={[
            { value: "area", label: "Bereich" },
            { value: "effort", label: "Aufwand" },
          ]}
          selected={[saved.groupBy]}
          onToggle={(groupBy) => update({ groupBy })}
        />
        <div className="ideas-count">
          {shown.length} {shown.length === 1 ? "Idee" : "Ideen"}
          {filtered && (
            <button
              type="button"
              className="ideas-reset"
              onClick={() => {
                setQuery("");
                update({ status: DEFAULTS.status, efforts: [], mark: "any", area: "" });
              }}
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
      </div>

      {sections.map(
        ({ key, title, intro, ideas }) =>
          ideas.length > 0 && (
            <section key={key} id={`area-${key}`} className="ideas-area">
              <h2>
                {title} <span className="ideas-area-count">{ideas.length}</span>
              </h2>
              {intro && <p className="ideas-intro">{intro}</p>}
              <ul className="ideas-list">
                {ideas.map((idea) => (
                  <IdeaRow key={idea.id} idea={idea} area={saved.groupBy === "effort" ? AREA_OF.get(idea.id) : undefined} {...markProps} />
                ))}
              </ul>
            </section>
          ),
      )}
      {shown.length === 0 && <p className="ideas-empty">Keine Idee passt zu diesen Filtern.</p>}
    </main>
  );
}

/**
 * The ideas marked ⭐, with a button that copies "mach N-01, B-02" for Claude.
 * The 👎 ones get a line of their own, so they can be rejected for good (`rejected: true`).
 */
function NextPanel({
  ideas,
  noIdeas,
  onShow,
  onMark,
}: {
  ideas: Idea[];
  noIdeas: Idea[];
  onShow: (id: string) => void;
  onMark: (id: string, mark: Mark) => void;
}) {
  const command = `mach ${ideas.map((i) => i.id).join(", ")}`;
  const rejectCommand = `lehne ab: ${noIdeas.map((i) => i.id).join(", ")}`;
  const efforts = EFFORTS.map((e) => [e, ideas.filter((i) => i.effort === e).length] as const).filter(([, n]) => n > 0);

  return (
    <section className="ideas-panel ideas-next">
      <h2>⭐ Als nächstes ({ideas.length})</h2>
      {ideas.length === 0 ? (
        <p className="ideas-hint">Markiere Ideen mit ⭐, dann sammeln sie sich hier. 🤔 heißt „vielleicht“, 👎 „eher nicht“ (rutscht nach unten).</p>
      ) : (
        <>
          <ul className="ideas-next-list">
            {ideas.map((idea) => (
              <li key={idea.id}>
                <button type="button" className="idea-id" onClick={() => onShow(idea.id)}>
                  {idea.id}
                </button>
                <EffortTag effort={idea.effort} short />
                <span>
                  {idea.emoji} <b>{idea.title}</b> <span className="ideas-next-area">{AREA_OF.get(idea.id)?.title}</span>
                </span>
                <button type="button" className="ideas-unmark" aria-label="Nicht mehr merken" onClick={() => onMark(idea.id, "next")}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <div className="ideas-next-foot">
            <span>Zusammen: {efforts.map(([e, n]) => `${n}× ${EFFORT_LABELS[e]}`).join(", ")}</span>
            <CopyCommand command={command} />
          </div>
        </>
      )}
      {noIdeas.length > 0 && (
        <div className="ideas-next-foot">
          <span>
            👎 {noIdeas.length} {noIdeas.length === 1 ? "Idee" : "Ideen"} „eher nicht“ – endgültig ablehnen:
          </span>
          <CopyCommand command={rejectCommand} />
        </div>
      )}
    </section>
  );
}

/** A command for Claude and a button that copies it. */
function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <>
      <code>{command}</code>
      <button type="button" className="ideas-copy" onClick={copy}>
        {copied ? "Kopiert ✓" : "📋 Kopieren"}
      </button>
    </>
  );
}

/** Table of areas × effort with the number of open ideas in each cell; every number is a filter. */
function Overview({ marks, onPick }: { marks: Record<string, Mark>; onPick: (area: string, effort?: Effort) => void }) {
  const cell = (key: string, area: IdeaArea, ideas: Idea[], effort?: Effort) =>
    ideas.length === 0 ? (
      <td key={key} className="ideas-zero">
        ·
      </td>
    ) : (
      <td key={key}>
        <button type="button" className={effort ? `effort-${effort}` : undefined} onClick={() => onPick(area.prefix, effort)}>
          {ideas.length}
        </button>
      </td>
    );

  return (
    <div className="ideas-overview-scroll">
      <table className="ideas-overview">
        <thead>
          <tr>
            <th>Bereich</th>
            {EFFORTS.map((e) => (
              <th key={e}>
                {e} <small>{EFFORT_LABELS[e]}</small>
              </th>
            ))}
            <th>Offen</th>
            <th>⭐</th>
            <th>Fertig</th>
            <th>🚫</th>
          </tr>
        </thead>
        {IDEA_GROUPS.map((group) => (
          <tbody key={group.title}>
            <tr className="ideas-overview-group">
              <th colSpan={8}>
                {group.emoji} {group.title}
              </th>
            </tr>
            {group.areas.map((area) => {
              const open = area.ideas.filter(isOpen);
              return (
                <tr key={area.prefix} className={open.length === 0 ? "ideas-overview-finished" : undefined}>
                  <th>
                    <button type="button" onClick={() => onPick(area.prefix)}>
                      {area.emoji} <b>{area.prefix}</b> {area.title}
                    </button>
                  </th>
                  {EFFORTS.map((e) =>
                    cell(
                      e,
                      area,
                      open.filter((i) => i.effort === e),
                      e,
                    ),
                  )}
                  {cell("open", area, open)}
                  <td>{open.filter((i) => marks[i.id] === "next").length || <span className="ideas-zero">·</span>}</td>
                  <td className="ideas-overview-done">
                    {countDone(area.ideas)}/{countActive(area.ideas)}
                  </td>
                  <td className="ideas-overview-done">{area.ideas.length - countActive(area.ideas) || <span className="ideas-zero">·</span>}</td>
                </tr>
              );
            })}
          </tbody>
        ))}
      </table>
    </div>
  );
}

const GAME_BY_HREF = new Map(CATEGORIES.flatMap((c) => c.games.map((g) => [g.href, g])));
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
function Languages() {
  return (
    <section className="ideas-panel">
      <h2>🌍 Sprachen: Deutsch, die fünf größten Weltsprachen, Russisch, Italienisch</h2>
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
                    {game ? `${game.emoji} ${game.title}` : "🏠 Startseite & Eltern"}
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
    </section>
  );
}

/** A row of toggle chips; single choice unless the caller toggles a list itself. */
function Chips<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { value: T; label: string; title?: string; className?: string }[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <fieldset className="ideas-chips">
      <legend>{label}</legend>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          title={o.title}
          className={[o.className, selected.includes(o.value) && "selected"].filter(Boolean).join(" ") || undefined}
          aria-pressed={selected.includes(o.value)}
          onClick={() => onToggle(o.value)}
        >
          {o.label}
        </button>
      ))}
    </fieldset>
  );
}

function MarkButtons({ id, marks, onMark }: { id: string; marks: Record<string, Mark>; onMark: (id: string, mark: Mark) => void }) {
  return (
    <span className="idea-marks">
      {MARKS.map((m) => (
        <button
          key={m.value}
          type="button"
          className={marks[id] === m.value ? "selected" : undefined}
          aria-pressed={marks[id] === m.value}
          aria-label={m.label}
          title={m.label}
          onClick={() => onMark(id, m.value)}
        >
          {m.emoji}
        </button>
      ))}
    </span>
  );
}

function EffortTag({ effort, short }: { effort: Effort; short?: boolean }) {
  return (
    <span className={`effort effort-${effort}`} title={`Aufwand ${EFFORT_LABELS[effort]}`}>
      {short ? effort : `${effort} ${EFFORT_LABELS[effort]}`}
    </span>
  );
}

function Progress({ done, total }: { done: number; total: number }) {
  return (
    <div className="ideas-progress">
      <span className="ideas-progress-bar" aria-hidden>
        <span style={{ width: `${(done / total) * 100}%` }} />
      </span>
      {done} von {total} umgesetzt
    </div>
  );
}

/** One idea as a compact row: number, title, effort and marks on top, the text below. */
function IdeaRow({
  idea,
  area,
  marks,
  onMark,
}: {
  idea: Idea;
  /** Shown as a tag when the list is not ordered by area. */
  area?: IdeaArea;
  marks: Record<string, Mark>;
  onMark: (id: string, mark: Mark) => void;
}) {
  const mark = marks[idea.id];
  return (
    <li id={idea.id} tabIndex={-1} className={`idea-card ${ideaStatus(idea)}${mark ? ` mark-${mark}` : ""}`}>
      <div className="idea-head">
        <span className="idea-id">{idea.id}</span>
        <span className="idea-emoji" aria-hidden>
          {idea.emoji}
        </span>
        <h3>{idea.title}</h3>
        <EffortTag effort={idea.effort} />
        {area && (
          <span className="idea-area-tag">
            {area.emoji} {area.title}
          </span>
        )}
        {idea.planned && isOpen(idea) && <span className="idea-planned">schon geplant</span>}
        {idea.partial && <span className="idea-partial-tag">teilweise</span>}
        {idea.done && <span className="idea-done">✓ umgesetzt</span>}
        {idea.rejected && <span className="idea-rejected">✗ abgelehnt</span>}
        {isOpen(idea) && <MarkButtons id={idea.id} marks={marks} onMark={onMark} />}
      </div>
      <p>{idea.text}</p>
      {idea.why && <p className="idea-why">💬 {idea.why}</p>}
      {idea.partial && <p className="idea-partial">🟡 Teilweise da: {idea.partial}</p>}
    </li>
  );
}
