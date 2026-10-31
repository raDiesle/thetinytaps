import { useT } from "@/lib/language";
import { type Board, boardFromTemplate, exampleStars, NO_LINKED } from "./board";
import { BoardSheet, SCREEN_LOOK } from "./BoardSheet";
import { KINDS, type Template, TEMPLATES } from "./catalog";

/** Width / height of a small picture of a board. */
const THUMB_ASPECT = 1.45;

/** Ready-made boards in the order of the switch of views: day ones first, collecting last. */
export const PRESETS = [...TEMPLATES].sort((a, b) => KINDS.findIndex((k) => k.id === a.kind) - KINDS.findIndex((k) => k.id === b.kind));

/** A board as a small picture, with its example stars, so a grown-up sees at once what it looks like in use. */
export function Thumb({ board, today = new Date() }: { board: Board; today?: Date }) {
  return (
    <span className="rw-thumb" aria-hidden>
      <BoardSheet
        board={board}
        stars={undefined}
        examples={exampleStars(board, today)}
        linked={NO_LINKED}
        today={today}
        look={SCREEN_LOOK}
        aspect={THUMB_ASPECT}
      />
    </span>
  );
}

/** The boards made once from each template, for the thumbnails: the same on every render. */
const PREVIEWS = new Map(PRESETS.map((tpl) => [tpl.id, boardFromTemplate(tpl)]));

/**
 * The Vorlagen: every ready-made board as a small picture with example stars, its name and one line about it, beside
 * the board on wide screens – grouped by view, the view's name over its group, so it reads as the name of what the
 * pictures show (never hidden in the line below them).
 */
export function TemplateGallery({
  selected,
  onPick,
}: {
  /** The template of the board shown, marked in the gallery. */
  selected?: string;
  onPick: (template: Template) => void;
}) {
  const t = useT();
  return (
    <div className="rw-gallery-groups">
      {KINDS.map((kind) => {
        const templates = PRESETS.filter((tpl) => tpl.kind === kind.id);
        return (
          templates.length > 0 && (
            <section key={kind.id} className="rw-gallery-group">
              <h3 className="rw-gallery-view">
                <span aria-hidden>{kind.emoji}</span> {t(kind.label)}
              </h3>
              <ul className="rw-gallery">
                {templates.map((tpl) => {
                  const preview = PREVIEWS.get(tpl.id);
                  return (
                    <li key={tpl.id}>
                      <button
                        type="button"
                        className={`rw-tpl${selected === tpl.id ? " selected" : ""}`}
                        aria-pressed={selected === tpl.id}
                        onClick={() => onPick(tpl)}
                      >
                        {preview && <Thumb board={preview} />}
                        <span className="rw-tpl-name">
                          <span aria-hidden>{tpl.emoji}</span> {t(tpl.label)}
                        </span>
                        <span className="rw-tpl-hint">{t(tpl.hint)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )
        );
      })}
    </div>
  );
}
