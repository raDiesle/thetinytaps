import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { type Localized, useT } from "@/lib/language";
import { NO_LINKED } from "./board";
import { THEME_BY_ID, THEMES } from "./catalog";
import { distinctSteps, type Plan } from "./plan";
import { PlanSheet, type PlanLook, useStepLabel } from "./PlanSheet";
import { MIN_CARD_MM, type PhotoFormat } from "./photo";
import { PhotoPrint } from "./PhotoPrint";
import { itemPicture, ItemPic } from "./pictures";
import { A4, PRINT_WORDS, Preview } from "./PrintPanel";

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

/** Over the print options of a plan whose days differ: only the day on screen is printed. */
const SHOWN_DAY: Localized = {
  de: "Gedruckt wird der Tag, der gerade zu sehen ist.",
  en: "The day shown right now is printed.",
  zh: "打印的是当前显示的这一天。",
  hi: "अभी दिख रहा दिन प्रिंट होगा।",
  es: "Se imprime el día que se ve ahora.",
  ar: "يُطبع اليوم المعروض الآن.",
  ru: "Печатается день, который сейчас на экране.",
};

/** How paper cards are made to last, and why Velcro and not magnets. */
const CARDS_NOTE: Localized = {
  de: "Karten aus Normalpapier halten laminiert mit Klettpunkten (keine kleinen Magnete – unter drei Jahren können sie verschluckt werden): so legt Ihr Kind den Tag selbst, und geschaffte Karten wandern in eine „Fertig“-Tasche.",
  en: "Plain paper cards, laminated, hold with Velcro dots (no small magnets – children under three can swallow them): this way your child lays out the day, and finished cards go into a “Done” pocket.",
  zh: "普通纸做的卡片过塑后用魔术贴固定（不要用小磁铁——三岁以下的孩子可能会吞下去）：这样孩子能自己摆出一天的安排，完成的卡片放进“完成”袋里。",
  hi: "सादे कागज़ के कार्ड लैमिनेट करके वेल्क्रो डॉट से टिकते हैं (छोटे चुंबक नहीं – तीन साल से छोटे बच्चे उन्हें निगल सकते हैं): ऐसे बच्चे अपना दिन खुद सजा सकते हैं, और पूरे हुए कार्ड „हो गया“ वाली जेब में जाते हैं।",
  es: "Las tarjetas de papel normal, plastificadas, se sujetan con puntos de velcro (nada de imanes pequeños: los menores de tres años pueden tragárselos): así su peque coloca el día, y las tarjetas hechas pasan a una bolsita de «Hecho».",
  ar: "تثبت البطاقات من الورق العادي بعد تغليفها بنقاط الفيلكرو (لا مغناطيسات صغيرة – قد يبتلعها الأطفال دون الثالثة): هكذا يرتّب الطفل يومه بنفسه، وتنتقل البطاقات المنجزة إلى جيب «انتهى».",
  ru: "Карточки из обычной бумаги после ламинирования держатся на липучках (никаких маленьких магнитов – дети до трёх лет могут их проглотить): так ребёнок сам выкладывает свой день, а выполненные карточки отправляются в кармашек «Готово».",
};

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
        title={t({
          de: "Bildkarten als Fotoabzug",
          en: "Picture cards as photo prints",
          zh: "图片卡冲印成照片",
          hi: "फ़ोटो प्रिंट के रूप में तस्वीर कार्ड",
          es: "Tarjetas con imágenes como copias fotográficas",
          ar: "بطاقات الصور كصور مطبوعة",
          ru: "Карточки с картинками как фотоотпечатки",
        })}
        note={t({
          de: "Jedes Bild des Plans einmal, von allen Tagen, als Karte für eine Klett-Tafel.",
          en: "Every picture of the plan once, from all days, as a card for a Velcro board.",
          zh: "日程表里的每张图片各一张（包括所有日子），做成魔术贴板用的卡片。",
          hi: "योजना की हर तस्वीर एक बार, सभी दिनों की, वेल्क्रो बोर्ड के कार्ड के रूप में।",
          es: "Cada imagen del plan una vez, de todos los días, como tarjeta para un tablero de velcro.",
          ar: "كل صورة في الخطة مرة واحدة، من كل الأيام، كبطاقة للوحة فيلكرو.",
          ru: "Каждая картинка плана по одному разу, со всех дней, – карточкой для доски на липучках.",
        })}
        cards={distinctSteps(plan).map((step) => ({ emoji: step.emoji, picture: itemPicture(step, "task"), label: label(step) }))}
        min={MIN_CARD_MM}
        theme={THEME_BY_ID.get(plan.theme) ?? THEMES[0]}
        name={t({
          de: "tagesplan-karten",
          en: "day-plan-cards",
          zh: "日程表-卡片",
          hi: "दिन-की-योजना-कार्ड",
          es: "plan-del-dia-tarjetas",
          ar: "خطة-اليوم-بطاقات",
          ru: "план-дня-карточки",
        })}
        format={options.photo}
        onFormat={(photo) => onChange({ photo })}
      />
      <SettingsGroup
        title={t({
          de: "Auf A4 drucken",
          en: "Print on A4",
          zh: "打印在 A4 纸上",
          hi: "A4 पर प्रिंट करें",
          es: "Imprimir en A4",
          ar: "الطباعة على A4",
          ru: "Печать на A4",
        })}
      >
        <Choice
          label={t(PRINT_WORDS.page)}
          value={options.orientation}
          onChange={(value) => onChange({ orientation: value })}
          options={[
            { value: "auto", label: t(PRINT_WORDS.auto) },
            { value: "landscape", label: t(PRINT_WORDS.landscape) },
            { value: "portrait", label: t(PRINT_WORDS.portrait) },
          ]}
        />
        <Toggle label={t(PRINT_WORDS.color)} checked={options.color} onChange={(color) => onChange({ color })} />
        <Toggle
          label={t({
            de: "Dazu: alle Bilder als Karten zum Ausschneiden",
            en: "Also: all pictures as cards to cut out",
            zh: "另外：所有图片做成可剪下的卡片",
            hi: "साथ में: सभी तस्वीरें काटने वाले कार्ड के रूप में",
            es: "Además: todas las imágenes como tarjetas para recortar",
            ar: "إضافة: كل الصور كبطاقات للقص",
            ru: "Плюс: все картинки карточками для вырезания",
          })}
          checked={options.cards}
          onChange={(cards) => onChange({ cards })}
        />
        <p className="setting-note">
          {plan.view === "day" && !plan.same && `${t(SHOWN_DAY)} `}
          {t(CARDS_NOTE)}
        </p>
        <button type="button" className="rw-print-button" onClick={() => window.print()}>
          🖨️ {t(PRINT_WORDS.now)}
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
