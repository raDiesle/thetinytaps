import { useState } from "react";
import { PICTURE_PROMPTS, type PicturePrompt, type PicturePromptSet } from "@/content/picturePrompts";
import { useStoredSettings } from "@/lib/storage";

/** The grown-up's review, saved per browser: changed prompts and those marked fine, keyed "<set>/<id>". */
const REVIEW_DEFAULTS = { edits: {} as Record<string, string>, ok: [] as string[] };

/**
 * On the management page: every picture prompt a feature collected, to read, change
 * in place and mark as fine before anything is generated. The changes stay in this
 * browser until „Prüfung kopieren“ puts them into one text to hand to Claude.
 */
export function PicturePromptReview() {
  const [review, update] = useStoredSettings("tinytaps.prompts.v1", REVIEW_DEFAULTS);
  return (
    <section id="bilder" className="ideas-research">
      <h2>🎨 Bildvorschläge</h2>
      <p className="ideas-hint">
        Bilder, die noch nicht erzeugt sind: erst hier prüfen und verbessern. Ändern direkt im Feld (bleibt in diesem Browser), 👍 heißt „passt so“; „Prüfung
        kopieren“ gibt alles als Text für Claude.
      </p>
      {PICTURE_PROMPTS.map((set, i) => (
        <PromptSet key={set.id} set={set} open={i === 0} review={review} update={update} />
      ))}
    </section>
  );
}

function PromptSet({
  set,
  open,
  review,
  update,
}: {
  set: PicturePromptSet;
  open: boolean;
  review: typeof REVIEW_DEFAULTS;
  update: (patch: Partial<typeof REVIEW_DEFAULTS>) => void;
}) {
  const [copied, setCopied] = useState(false);
  const all = set.groups.flatMap((g) => g.prompts);
  const key = (p: PicturePrompt) => `${set.id}/${p.id}`;
  const changed = all.filter((p) => review.edits[key(p)] !== undefined && review.edits[key(p)] !== p.prompt);
  const fine = all.filter((p) => review.ok.includes(key(p)));
  const date = new Date(`${set.date}T12:00:00`).toLocaleDateString("de-DE");

  const copy = () => {
    const lines = [`Bildvorschläge „${set.title}“ – geprüft auf /management/:`];
    if (fine.length) lines.push("", `Passt: ${fine.map((p) => p.id).join(", ")}`);
    if (changed.length) lines.push("", "Geändert:", ...changed.map((p) => `- ${p.id}: ${review.edits[key(p)]}`));
    const unseen = all.filter((p) => !fine.includes(p) && !changed.includes(p)).length;
    lines.push("", `Noch nicht angesehen: ${unseen} von ${all.length}.`);
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <details className="ideas-panel" open={open}>
      <summary>
        <h2>
          {set.emoji} {set.title} ({all.length})
        </h2>{" "}
        <small className="ideas-research-date">{date}</small>
      </summary>
      <p>{set.intro}</p>
      <p className="ideas-prompt-summary">
        👍 {fine.length} passt · ✏️ {changed.length} geändert · {all.length} insgesamt{" "}
        <button type="button" className="ideas-copy" onClick={copy}>
          {copied ? "Kopiert ✓" : "📋 Prüfung kopieren"}
        </button>
      </p>
      {set.groups.map((group) => (
        <div key={group.title} className="ideas-prompt-group">
          <h3>
            {group.title} ({group.prompts.length})
          </h3>
          {group.note && <p className="ideas-hint">{group.note}</p>}
          <ul className="ideas-prompts">
            {group.prompts.map((p) => {
              const k = key(p);
              const text = review.edits[k] ?? p.prompt;
              const ok = review.ok.includes(k);
              const edited = text !== p.prompt;
              return (
                <li key={p.id} className={`ideas-prompt${ok ? " ok" : ""}${edited ? " edited" : ""}`}>
                  <div className="ideas-prompt-head">
                    <b>{p.id}</b> <span>{p.use}</span>
                  </div>
                  <textarea value={text} rows={4} aria-label={`Prompt ${p.id}`} onChange={(e) => update({ edits: { ...review.edits, [k]: e.target.value } })} />
                  <div className="ideas-prompt-foot">
                    <code>
                      {p.file} {p.options}
                      {p.ref?.map((r) => ` --ref ${r}`).join("")}
                    </code>
                    <button
                      type="button"
                      aria-pressed={ok}
                      className={ok ? "selected" : undefined}
                      onClick={() => update({ ok: ok ? review.ok.filter((x) => x !== k) : [...review.ok, k] })}
                    >
                      👍 passt
                    </button>
                    {edited && (
                      <button type="button" onClick={() => update({ edits: Object.fromEntries(Object.entries(review.edits).filter(([x]) => x !== k)) })}>
                        ↺ Original
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </details>
  );
}
