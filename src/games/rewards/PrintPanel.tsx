import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { useT } from "@/lib/language";
import { type Board, NO_LINKED } from "./board";
import { BoardSheet, type SheetLook } from "./BoardSheet";
import { MARK_BY_ID, MARKS, THEME_BY_ID, THEMES } from "./catalog";
import { MIN_STAR_MM, photoFormat, photoLayout } from "./photo";
import { PhotoPrint } from "./PhotoPrint";
import type { PrintOptions } from "./settings";

/** A4 in millimetres. */
export const A4 = { long: 297, short: 210 };
/** CSS pixels per millimetre, to scale the preview. */
const PX_PER_MM = 96 / 25.4;
/** Marks on the cut-out page: a full page (7 × 5 of 34 mm either way round), enough for a few weeks. */
const STICKERS_PER_PAGE = 35;

/** The page's orientation: the grown-up's choice, or what suits the kind of board. */
export const orientationOf = (board: Board, options: PrintOptions): "landscape" | "portrait" =>
  options.orientation !== "auto" ? options.orientation : board.kind === "day" && board.tasks.length <= 2 ? "portrait" : "landscape";

/**
 * Printing a board: how (orientation, colour or ink-saving grey, fields to colour in,
 * a page of marks to cut out), a preview that is the printed page made small, and
 * the button. The pages themselves go into a layer at the end of <body> that only
 * shows when printing (`rw-print-root` in rewards.css), so the browser prints
 * exactly them and nothing of the app – straight from the browser, offline too, no PDF.
 */
export function PrintPanel({ board, options, onChange }: { board: Board; options: PrintOptions; onChange: (patch: Partial<PrintOptions>) => void }) {
  const t = useT();
  const orientation = orientationOf(board, options);
  const look: SheetLook = { print: true, color: options.color, colorIn: options.colorIn };
  const pages = <PrintPages board={board} options={options} look={look} orientation={orientation} />;
  const mark = MARK_BY_ID.get(board.mark) ?? MARKS[0];
  const stars = photoLayout(photoFormat(options.photo), MIN_STAR_MM);

  return (
    <section className="settings rw-print-panel">
      <SettingsGroup title={t({ de: "Drucken" })}>
        <Choice
          label={t({ de: "Seite (A4)" })}
          value={options.orientation}
          onChange={(value) => onChange({ orientation: value })}
          options={[
            { value: "auto", label: t({ de: "Passend" }) },
            { value: "landscape", label: t({ de: "Quer" }) },
            { value: "portrait", label: t({ de: "Hochkant" }) },
          ]}
        />
        {board.kind === "month" && (
          <Choice
            label={t({ de: "Monat" })}
            value={options.nextMonth ? "next" : "this"}
            onChange={(value) => onChange({ nextMonth: value === "next" })}
            options={[
              { value: "this", label: t({ de: "Dieser" }) },
              { value: "next", label: t({ de: "Nächster" }) },
            ]}
          />
        )}
        <Toggle label={t({ de: "In Farbe (aus: Schwarz-weiß, spart Tinte)" })} checked={options.color} onChange={(color) => onChange({ color })} />
        <Toggle
          label={t({ de: "Felder zum Ausmalen (statt leerer Kreise zum Bekleben)" })}
          checked={options.colorIn}
          onChange={(colorIn) => onChange({ colorIn })}
        />
        <Toggle
          label={t({ de: "Zweite Seite: Sterne zum Ausschneiden und Aufkleben" })}
          checked={options.stickers}
          onChange={(stickers) => onChange({ stickers })}
        />
        <p className="setting-note">
          {t({
            de: "Gedruckt wird die Tafel leer – die Sterne kommen mit Aufklebern, Stempeln oder Buntstiften darauf. Laminiert (oder in einer Klarsichthülle) hält sie mit abwischbarem Stift viele Wochen.",
          })}
        </p>
        <button type="button" className="rw-print-button" onClick={() => window.print()}>
          🖨️ {t({ de: "Jetzt drucken" })}
        </button>
      </SettingsGroup>
      <Preview orientation={orientation}>{pages}</Preview>
      <PhotoPrint
        title={t({ de: `${mark.emoji} Zum Ankletten: als Fotoabzug` })}
        note={t({
          de: "Ein Foto voller Zeichen der Tafel: ausgeschnitten und mit Klettpunkten bekommt Ihr Kind jeden Stern zum Selbst-Ankletten, und die laminierte Tafel hält viele Wochen.",
        })}
        cards={Array.from({ length: stars.cols * stars.rows }, () => ({ emoji: mark.emoji }))}
        min={MIN_STAR_MM}
        theme={THEME_BY_ID.get(board.theme) ?? THEMES[0]}
        name="belohnungstafel-sterne"
        format={options.photo}
        onFormat={(photo) => onChange({ photo })}
      />
      {createPortal(<div className="rw-print-root">{pages}</div>, document.body)}
    </section>
  );
}

/** The printed pages: the board, and the marks to cut out if wanted. */
function PrintPages({ board, options, look, orientation }: { board: Board; options: PrintOptions; look: SheetLook; orientation: "landscape" | "portrait" }) {
  const landscape = orientation === "landscape";
  const width = landscape ? A4.long : A4.short;
  const height = landscape ? A4.short : A4.long;
  const mark = MARK_BY_ID.get(board.mark) ?? MARKS[0];
  const theme = THEME_BY_ID.get(board.theme) ?? THEMES[0];
  // The body of the sheet is roughly the page without heading and goal: what the path of a collecting board fits into.
  const aspect = (width - 20) / (height - 60);
  const now = new Date();
  // Only a month board prints a date of its own: its calendar, this month's or the next one's.
  const day = board.kind === "month" && options.nextMonth ? new Date(now.getFullYear(), now.getMonth() + 1, 1) : now;
  return (
    <>
      {/* @page can only be set by a stylesheet; this one comes and goes with the panel. */}
      <style>{`@page { size: A4 ${orientation}; margin: 0; }`}</style>
      <div className="rw-page" style={{ width: `${width}mm`, height: `${height}mm` }}>
        <BoardSheet board={board} stars={undefined} linked={NO_LINKED} today={day} look={look} aspect={aspect} />
      </div>
      {options.stickers && (
        <div
          className={`rw-page rw-sticker-page${look.color ? "" : " rw-grey"}`}
          style={{ width: `${width}mm`, height: `${height}mm`, ...(look.color ? { "--rw-main": theme.main } : {}) } as CSSProperties}
        >
          {Array.from({ length: STICKERS_PER_PAGE }, (_, i) => (
            <span key={i} className="rw-sticker">
              {mark.emoji}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

/** The pages made small enough for the panel, exactly as they will print. */
export function Preview({ orientation, children }: { orientation: "landscape" | "portrait"; children: ReactNode }) {
  const t = useT();
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setWidth(el.clientWidth));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const pageWidth = (orientation === "landscape" ? A4.long : A4.short) * PX_PER_MM;
  const scale = Math.min(1, width / pageWidth);
  return (
    <div ref={box} className="rw-preview" aria-label={t({ de: "So sieht der Ausdruck aus" })}>
      {/* zoom, not transform: the panel gets only as tall as the small pages. */}
      <div className="rw-preview-pages" style={{ zoom: scale, width: `${pageWidth}px` }}>
        {children}
      </div>
    </div>
  );
}
