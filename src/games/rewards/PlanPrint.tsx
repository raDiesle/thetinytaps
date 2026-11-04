import { createPortal } from "react-dom";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { type Localized, useT } from "@/lib/language";
import { NO_LINKED } from "./board";
import { NOW_WAYS, THEME_BY_ID, THEMES } from "./catalog";
import { distinctSteps, type Plan } from "./plan";
import { PlanSheet, type PlanLook, useStepLabel } from "./PlanSheet";
import { MIN_CARD_MM, type PhotoFormat } from "./photo";
import { PhotoPrint } from "./PhotoPrint";
import { itemPicture, ItemPic } from "./pictures";
import { A4, CutCardPages, PRINT_WORDS, Preview } from "./PrintPanel";
import { RitualPages } from "./RitualCard";
import { type Ritual, ritualOf } from "./rituals";
import { VelcroLink } from "./shopLinks";

/** How a plan is printed. */
export interface PlanPrintOptions {
  /** "auto": landscape, but portrait for a Jetzt – Dann of one or two cards. */
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

/**
 * What a plan prints besides its sheet: a Jetzt – Dann with a marker none (every card stands on the sheet, the marker
 * is made at home), one with the „Jetzt“ field always its cards (its sheet is empty frames for them), a Countdown none
 * (its moons are coloured in on the sheet), the others as the grown-up chose.
 */
export const printsCards = (plan: Plan): "never" | "always" | "choice" =>
  plan.view === "countdown" ? "never" : plan.view !== "day" ? "choice" : plan.nowField ? "always" : "never";

/** Under a Countdown's print: what the moons on paper are for. */
const COUNTDOWN_NOTE: Localized = {
  de: "Gedruckt werden die Monde ab heute. Jeden Morgen malt Ihr Kind einen Mond aus oder streicht ihn durch – so sieht es, wie der große Tag näher kommt.",
  en: "The moons are printed from today. Every morning your child colours in a moon or crosses it out – and sees the big day coming closer.",
  zh: "从今天起的月亮会被打印出来。每天早上，孩子涂满一个月亮或把它划掉——就能看到大日子越来越近。",
  hi: "आज से चाँद प्रिंट होते हैं। हर सुबह बच्चे के साथ एक चाँद में रंग भरें या उसे काट दें – ऐसे दिखता है कि बड़ा दिन पास आ रहा है।",
  es: "Las lunas se imprimen a partir de hoy. Cada mañana su peque colorea una luna o la tacha, y así ve cómo se acerca el gran día.",
  ar: "تُطبع الأقمار ابتداءً من اليوم. كل صباح يلوّن طفلكم قمرًا أو يشطبه – فيرى كيف يقترب اليوم الكبير.",
  ru: "Луны печатаются начиная с сегодняшнего дня. Каждое утро ребёнок закрашивает одну луну или зачёркивает её – и видит, как приближается большой день.",
};

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
 * screen but without ticks on A4, and if wanted every picture as a card to cut out of plain paper. A Jetzt – Dann with
 * a marker is only its sheet: every card is printed on it, so there are no cards to make (`printsCards`).
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
  const cards = printsCards(plan);
  return (
    <section className="settings rw-print-panel">
      {cards !== "never" && (
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
      )}
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
        {cards === "choice" && (
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
            onChange={(on) => onChange({ cards: on })}
          />
        )}
        <p className="setting-note">
          {plan.view !== "week" && !plan.same && `${t(SHOWN_DAY)} `}
          {/* A marker's plan: nothing to cut out; the „Jetzt“ field's: its cards always come, the note says why. */}
          {t(plan.view === "countdown" ? COUNTDOWN_NOTE : cards === "never" ? NOW_WAYS[0].note : cards === "always" ? NOW_WAYS[1].note : CARDS_NOTE)}
          {cards !== "never" && <VelcroLink />}
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

/** The rituals on a plan's cards, each once, in the order of the day: their words are printed after the plan (H-58). */
export const ritualsOf = (plan: Plan): Ritual[] => [
  ...new Set(
    distinctSteps(plan)
      .map(ritualOf)
      .filter((r): r is Ritual => !!r),
  ),
];

/** The printed pages: the plan, then its pictures as cards to cut out (CutCardPages), then its rituals' words. */
function PlanPages({ plan, day, options, orientation }: { plan: Plan; day: Date; options: PlanPrintOptions; orientation: "landscape" | "portrait" }) {
  const label = useStepLabel();
  const landscape = orientation === "landscape";
  const width = landscape ? A4.long : A4.short;
  const height = landscape ? A4.short : A4.long;
  const look: PlanLook = { print: true, color: options.color };
  const theme = THEME_BY_ID.get(plan.theme) ?? THEMES[0];
  const wanted = printsCards(plan);
  const cards =
    wanted === "always" || (wanted === "choice" && options.cards)
      ? distinctSteps(plan).map((step) => ({ key: step.id, picture: <ItemPic item={step} lines={!look.color} />, label: label(step) }))
      : [];
  return (
    <>
      <style>{`@page { size: A4 ${orientation}; margin: 0; }`}</style>
      <div className="rw-page" style={{ width: `${width}mm`, height: `${height}mm` }}>
        <PlanSheet plan={plan} ticks={undefined} linked={NO_LINKED} today={day} day={day} look={look} aspect={(width - 20) / (height - 40)} />
      </div>
      <CutCardPages cards={cards} orientation={orientation} color={look.color} theme={theme} />
      <RitualPages rituals={ritualsOf(plan)} orientation={orientation} color={look.color} theme={theme} />
    </>
  );
}
