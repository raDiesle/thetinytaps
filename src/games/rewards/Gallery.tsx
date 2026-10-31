import { useT } from "@/lib/language";
import { type Board, boardFromTemplate, exampleStars, NO_LINKED } from "./board";
import { BoardSheet, SCREEN_LOOK } from "./BoardSheet";
import { type BoardKind, KINDS, type Template, TEMPLATES } from "./catalog";

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
 * the board on wide screens. In the wizard only those of the view chosen, as big pictures with their names (the view
 * is chosen, the picture says the rest), after „Leer anfangen“.
 */
export function TemplateGallery({
  selected,
  onPick,
  kind: only,
  blank,
}: {
  /** The template of the board shown, marked in the gallery. */
  selected?: string;
  onPick: (template: Template) => void;
  /** Only the templates of this view, without their lines: the wizard's step after the view. */
  kind?: BoardKind;
  /** „Leer anfangen“ as the first card, in the wizard. */
  blank?: () => void;
}) {
  const t = useT();
  return (
    <ul className={`rw-gallery${only ? " rw-gallery-big" : ""}`}>
      {blank && (
        <li>
          <button type="button" className="rw-tpl rw-tpl-blank" onClick={blank}>
            <span className="rw-thumb rw-thumb-blank" aria-hidden>
              ✏️
            </span>
            <span className="rw-tpl-name">
              {t({
                de: "Leer anfangen",
                en: "Start blank",
                zh: "从空白开始",
                hi: "खाली से शुरू करें",
                es: "Empezar en blanco",
                ar: "البدء من الصفر",
                ru: "Начать с чистого листа",
              })}
            </span>
          </button>
        </li>
      )}
      {PRESETS.filter((tpl) => !only || tpl.kind === only).map((tpl) => {
        const kind = KINDS.find((k) => k.id === tpl.kind);
        const preview = PREVIEWS.get(tpl.id);
        return (
          <li key={tpl.id}>
            <button type="button" className={`rw-tpl${selected === tpl.id ? " selected" : ""}`} aria-pressed={selected === tpl.id} onClick={() => onPick(tpl)}>
              {preview && <Thumb board={preview} />}
              <span className="rw-tpl-name">
                <span aria-hidden>{tpl.emoji}</span> {t(tpl.label)}
              </span>
              {!only && (
                <span className="rw-tpl-hint">
                  {kind && (
                    <span className="rw-tpl-kind">
                      {kind.emoji} {t(kind.label)}
                    </span>
                  )}{" "}
                  {t(tpl.hint)}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
