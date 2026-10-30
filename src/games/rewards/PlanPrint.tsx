import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { useT } from "@/lib/language";
import { NO_LINKED } from "./board";
import { THEME_BY_ID, THEMES } from "./catalog";
import { distinctSteps, type Plan } from "./plan";
import { PlanSheet, type PlanLook, useStepLabel } from "./PlanSheet";
import { MIN_CARD_MM, type PhotoFormat } from "./photo";
import { PhotoPrint } from "./PhotoPrint";
import { itemPicture, ItemPic } from "./pictures";
import { A4, Preview } from "./PrintPanel";

/** How a plan is printed. */
export interface PlanPrintOptions {
  /** "auto": landscape for most plans, portrait for an Erst–Dann. */
  orientation: "auto" | "landscape" | "portrait";
  color: boolean;
  /** A page (or more) of the plan's pictures as cards to cut out, for a Velcro board. */
  cards: boolean;
  /** The photo size the cards are laid out on; missing in options saved before photo prints. */
  photo?: PhotoFormat["id"];
}

/** Cards on a page of cards to cut out: 3 × 4 or 4 × 3, each about 6 cm. */
const CARDS_PER_PAGE = 12;

/** The page's orientation: the grown-up's choice, or what suits the plan. */
export const planOrientation = (plan: Plan, options: PlanPrintOptions, day: Date): "landscape" | "portrait" =>
  options.orientation !== "auto"
    ? options.orientation
    : plan.view === "day" && (plan.same ? plan.days[0] : plan.days[(day.getDay() + 6) % 7]).length <= 2
      ? "portrait"
      : "landscape";

/**
 * Printing a plan. First the cards as photo prints (PhotoPrint): firm, wipeable photo paper from any drugstore is
 * what Velcro cards are best made of, so that comes first. Then the same way as a board (PrintPanel): the plan as on
 * screen but without ticks on A4, and if wanted every picture as a card to cut out of plain paper.
 */
export function PlanPrint({
  plan,
  day,
  options,
  onChange,
}: {
  plan: Plan;
  day: Date;
  options: PlanPrintOptions;
  onChange: (patch: Partial<PlanPrintOptions>) => void;
}) {
  const t = useT();
  const label = useStepLabel();
  const orientation = planOrientation(plan, options, day);
  const pages = <PlanPages plan={plan} day={day} options={options} orientation={orientation} />;
  return (
    <section className="settings rw-print-panel">
      <PhotoPrint
        title={t({ de: "Bildkarten als Fotoabzug" })}
        note={t({ de: "Jedes Bild des Plans einmal, von allen Tagen, als Karte für eine Klett-Tafel." })}
        cards={distinctSteps(plan).map((step) => ({ emoji: step.emoji, picture: itemPicture(step, "task"), label: label(step) }))}
        min={MIN_CARD_MM}
        theme={THEME_BY_ID.get(plan.theme) ?? THEMES[0]}
        name="tagesplan-karten"
        format={options.photo}
        onFormat={(photo) => onChange({ photo })}
      />
      <SettingsGroup title={t({ de: "Auf A4 drucken" })}>
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
        <Toggle label={t({ de: "In Farbe (aus: Schwarz-weiß, spart Tinte)" })} checked={options.color} onChange={(color) => onChange({ color })} />
        <Toggle label={t({ de: "Dazu: alle Bilder als Karten zum Ausschneiden" })} checked={options.cards} onChange={(cards) => onChange({ cards })} />
        <p className="setting-note">
          {t({
            de:
              plan.view === "day" && !plan.same
                ? "Gedruckt wird der Tag, der gerade zu sehen ist. Karten aus Normalpapier halten laminiert mit Klettpunkten (keine kleinen Magnete – unter drei Jahren können sie verschluckt werden): so legt Ihr Kind den Tag selbst, und geschaffte Karten wandern in eine „Fertig“-Tasche."
                : "Karten aus Normalpapier halten laminiert mit Klettpunkten (keine kleinen Magnete – unter drei Jahren können sie verschluckt werden): so legt Ihr Kind den Tag selbst, und geschaffte Karten wandern in eine „Fertig“-Tasche.",
          })}
        </p>
        <button type="button" className="rw-print-button" onClick={() => window.print()}>
          🖨️ {t({ de: "Jetzt drucken" })}
        </button>
      </SettingsGroup>
      <Preview orientation={orientation}>{pages}</Preview>
      {createPortal(<div className="rw-print-root">{pages}</div>, document.body)}
    </section>
  );
}

/** The printed pages: the plan, then the cards to cut out (four across on a landscape page, three on a portrait one). */
function PlanPages({ plan, day, options, orientation }: { plan: Plan; day: Date; options: PlanPrintOptions; orientation: "landscape" | "portrait" }) {
  const label = useStepLabel();
  const landscape = orientation === "landscape";
  const width = landscape ? A4.long : A4.short;
  const height = landscape ? A4.short : A4.long;
  const look: PlanLook = { print: true, color: options.color };
  const theme = THEME_BY_ID.get(plan.theme) ?? THEMES[0];
  const cards = options.cards ? distinctSteps(plan) : [];
  const cardPages = Array.from({ length: Math.ceil(cards.length / CARDS_PER_PAGE) }, (_, i) => cards.slice(i * CARDS_PER_PAGE, (i + 1) * CARDS_PER_PAGE));
  return (
    <>
      <style>{`@page { size: A4 ${orientation}; margin: 0; }`}</style>
      <div className="rw-page" style={{ width: `${width}mm`, height: `${height}mm` }}>
        <PlanSheet plan={plan} ticks={undefined} linked={NO_LINKED} today={day} day={day} look={look} aspect={(width - 20) / (height - 40)} />
      </div>
      {cardPages.map((page, i) => (
        <div
          key={i}
          className={`rw-page pl-card-page${landscape ? " wide" : ""}${look.color ? "" : " rw-grey"}`}
          style={{ width: `${width}mm`, height: `${height}mm`, ...(look.color ? { "--rw-main": theme.main, "--rw-paper": theme.paper } : {}) } as CSSProperties}
        >
          {page.map((step) => (
            <span key={step.id} className="pl-cut-card">
              <span className="pl-emoji" aria-hidden>
                <ItemPic item={step} lines={!look.color} />
              </span>
              <span className="pl-label">{label(step)}</span>
            </span>
          ))}
        </div>
      ))}
    </>
  );
}
