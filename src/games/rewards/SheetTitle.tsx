import { useT } from "@/lib/language";
import { NO_TITLE_MARK } from "./board";
import { MARK_BY_ID } from "./catalog";
import { MarkPic } from "./pictures";

/** The sign before a heading: `titleMark` if set, else the chart's own (a board's mark; a plan has none). */
export const titleMarkOf = (titleMark: string | undefined, own: string | undefined) => {
  const id = titleMark ?? own;
  return id && id !== NO_TITLE_MARK ? MARK_BY_ID.get(id) : undefined;
};

/**
 * A chart's heading, the same on a board and a plan (user feedback, November 2026): while it is made it is typed right
 * where it stands, its automatic title as the placeholder – so no field for the child's name is needed – and its sign
 * before it is a tap of its own (`data-edit="title-mark"`), to change it or take it away. Without a sign a pale ＋ keeps
 * its place while the chart is made, never on paper.
 */
export function SheetTitle({
  title,
  own,
  auto,
  mark,
  editing,
  onTitle,
}: {
  /** The heading shown. */
  title: string;
  /** Whether the grown-up typed one (else the placeholder shows the automatic one). */
  own: boolean;
  /** The automatic heading, the placeholder while it is typed. */
  auto: string;
  /** The sign before it, if any. */
  mark?: ReturnType<typeof titleMarkOf>;
  editing: boolean;
  onTitle?: (title: string) => void;
}) {
  const t = useT();
  const heading = t({ de: "Überschrift", en: "Heading", zh: "标题", hi: "शीर्षक", es: "Título", ar: "العنوان", ru: "Заголовок" });
  return (
    <span className="rw-title-line">
      {(mark || editing) && (
        <span
          className={`rw-title-mark${mark ? "" : " rw-title-mark-none"}`}
          aria-hidden={!editing}
          data-edit={editing ? "title-mark" : undefined}
          role={editing ? "button" : undefined}
          tabIndex={editing ? 0 : undefined}
          title={
            editing
              ? t({
                  de: "Zeichen vor der Überschrift ändern",
                  en: "Change the sign before the heading",
                  zh: "更换标题前的标志",
                  hi: "शीर्षक से पहले का चिह्न बदलें",
                  es: "Cambiar el símbolo antes del título",
                  ar: "تغيير العلامة قبل العنوان",
                  ru: "Сменить знак перед заголовком",
                })
              : undefined
          }
          aria-label={
            editing
              ? t({
                  de: "Zeichen vor der Überschrift ändern",
                  en: "Change the sign before the heading",
                  zh: "更换标题前的标志",
                  hi: "शीर्षक से पहले का चिह्न बदलें",
                  es: "Cambiar el símbolo antes del título",
                  ar: "تغيير العلامة قبل العنوان",
                  ru: "Сменить знак перед заголовком",
                })
              : undefined
          }
        >
          {mark ? <MarkPic mark={mark} /> : "＋"}
        </span>
      )}
      {editing && onTitle ? (
        <input
          className="rw-title rw-title-input"
          type="text"
          value={own ? title : ""}
          maxLength={40}
          placeholder={auto}
          aria-label={heading}
          title={heading}
          onChange={(e) => onTitle(e.target.value)}
        />
      ) : (
        <span className="rw-title">{title}</span>
      )}
    </span>
  );
}
