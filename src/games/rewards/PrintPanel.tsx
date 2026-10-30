import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { type Localized, useT } from "@/lib/language";
import { type Board, NO_LINKED } from "./board";
import { BoardSheet, type SheetLook } from "./BoardSheet";
import { MARK_BY_ID, MARKS, THEME_BY_ID, THEMES } from "./catalog";
import { MIN_STAR_MM, photoFormat, photoLayout } from "./photo";
import { PRINT } from "./pageParts";
import { MarkPic, markPicture } from "./pictures";
import { PhotoPrint } from "./PhotoPrint";
import type { PrintOptions } from "./settings";

/** Print options both panels share. */
export const PRINT_WORDS = {
  page: { de: "Seite (A4)", en: "Page (A4)", zh: "页面（A4）", hi: "पेज (A4)", es: "Página (A4)", ar: "الصفحة (A4)", ru: "Страница (A4)" },
  auto: { de: "Passend", en: "Automatic", zh: "自动", hi: "अपने-आप", es: "Automática", ar: "تلقائي", ru: "Автоматически" },
  landscape: { de: "Quer", en: "Landscape", zh: "横向", hi: "आड़ा", es: "Horizontal", ar: "أفقي", ru: "Альбомная" },
  portrait: { de: "Hochkant", en: "Portrait", zh: "纵向", hi: "खड़ा", es: "Vertical", ar: "عمودي", ru: "Книжная" },
  color: {
    de: "In Farbe (aus: Schwarz-weiß, spart Tinte)",
    en: "In color (off: black and white, saves ink)",
    zh: "彩色（关闭：黑白，省墨）",
    hi: "रंगीन (बंद: श्वेत-श्याम, स्याही बचती है)",
    es: "En color (desactivado: blanco y negro, ahorra tinta)",
    ar: "بالألوان (عند الإيقاف: أبيض وأسود لتوفير الحبر)",
    ru: "В цвете (выкл.: чёрно-белая, экономит чернила)",
  },
  now: { de: "Jetzt drucken", en: "Print now", zh: "立即打印", hi: "अभी प्रिंट करें", es: "Imprimir ahora", ar: "الطباعة الآن", ru: "Печатать" },
} satisfies Record<string, Localized>;

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
      <SettingsGroup title={t(PRINT)}>
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
        {board.kind === "month" && (
          <Choice
            label={t({ de: "Monat", en: "Month", zh: "月份", hi: "महीना", es: "Mes", ar: "الشهر", ru: "Месяц" })}
            value={options.nextMonth ? "next" : "this"}
            onChange={(value) => onChange({ nextMonth: value === "next" })}
            options={[
              { value: "this", label: t({ de: "Dieser", en: "This one", zh: "本月", hi: "यही", es: "Este", ar: "هذا الشهر", ru: "Этот" }) },
              { value: "next", label: t({ de: "Nächster", en: "Next", zh: "下个月", hi: "अगला", es: "El próximo", ar: "الشهر القادم", ru: "Следующий" }) },
            ]}
          />
        )}
        <Toggle label={t(PRINT_WORDS.color)} checked={options.color} onChange={(color) => onChange({ color })} />
        <Toggle
          label={t({
            de: "Felder zum Ausmalen (statt leerer Kreise zum Bekleben)",
            en: "Fields to color in (instead of empty circles for stickers)",
            zh: "可涂色的格子（代替贴贴纸的空圆圈）",
            hi: "रंग भरने वाले खाने (स्टिकर के लिए खाली गोलों की जगह)",
            es: "Casillas para colorear (en vez de círculos vacíos para pegatinas)",
            ar: "خانات للتلوين (بدل دوائر فارغة للملصقات)",
            ru: "Клеточки для раскрашивания (вместо пустых кружков для наклеек)",
          })}
          checked={options.colorIn}
          onChange={(colorIn) => onChange({ colorIn })}
        />
        <Toggle
          label={t({
            de: "Zweite Seite: Sterne zum Ausschneiden und Aufkleben",
            en: "Second page: stars to cut out and stick on",
            zh: "第二页：可剪下粘贴的星星",
            hi: "दूसरा पेज: काटकर चिपकाने के लिए सितारे",
            es: "Segunda página: estrellas para recortar y pegar",
            ar: "صفحة ثانية: نجوم للقص واللصق",
            ru: "Вторая страница: звёзды, чтобы вырезать и наклеить",
          })}
          checked={options.stickers}
          onChange={(stickers) => onChange({ stickers })}
        />
        <p className="setting-note">
          {t({
            de: "Gedruckt wird die Tafel leer – die Sterne kommen mit Aufklebern, Stempeln oder Buntstiften darauf. Laminiert (oder in einer Klarsichthülle) hält sie mit abwischbarem Stift viele Wochen.",
            en: "The chart prints empty – the stars go on with stickers, stamps or crayons. Laminated (or in a clear sleeve) and used with a wipe-off marker, it lasts many weeks.",
            zh: "奖励表打印出来是空的——星星用贴纸、印章或彩色笔加上去。过塑（或放进透明文件套）后用可擦笔，能用好几周。",
            hi: "चार्ट खाली छपता है – सितारे स्टिकर, ठप्पे या रंगीन पेंसिल से लगते हैं। लैमिनेट करके (या प्लास्टिक कवर में रखकर) मिटने वाले पेन के साथ यह कई हफ़्ते चलता है।",
            es: "La tabla se imprime vacía: las estrellas se ponen con pegatinas, sellos o lápices de colores. Plastificada (o en una funda transparente) y con un rotulador borrable, dura muchas semanas.",
            ar: "تُطبع اللوحة فارغة – وتُضاف النجوم بالملصقات أو الأختام أو الأقلام الملونة. إذا غُلّفت (أو وُضعت في غلاف شفاف) واستُخدم قلم قابل للمسح، تدوم أسابيع كثيرة.",
            ru: "Таблица печатается пустой – звёзды появляются с наклейками, штампами или карандашами. В ламинате (или в прозрачном файле) и со стираемым маркером она прослужит много недель.",
          })}
        </p>
        <button type="button" className="rw-print-button" onClick={() => window.print()}>
          🖨️ {t(PRINT_WORDS.now)}
        </button>
      </SettingsGroup>
      <Preview orientation={orientation}>{pages}</Preview>
      <PhotoPrint
        title={`${mark.emoji} ${t({ de: "Zum Ankletten: als Fotoabzug", en: "To stick on with Velcro: as a photo print", zh: "用魔术贴贴：冲印成照片", hi: "वेल्क्रो से चिपकाने के लिए: फ़ोटो प्रिंट", es: "Para pegar con velcro: como copia fotográfica", ar: "للتثبيت بالفيلكرو: كصورة مطبوعة", ru: "На липучках: как фотоотпечаток" })}`}
        note={t({
          de: "Ein Foto voller Zeichen der Tafel: ausgeschnitten und mit Klettpunkten bekommt Ihr Kind jeden Stern zum Selbst-Ankletten, und die laminierte Tafel hält viele Wochen.",
          en: "A photo full of the chart’s marks: cut out and with Velcro dots, every star is one your child can stick on, and the laminated chart lasts many weeks.",
          zh: "一张印满奖励表标记的照片：剪开并贴上魔术贴后，孩子可以自己贴上每一颗星星，过塑的奖励表能用好几周。",
          hi: "चार्ट के निशानों से भरी एक फ़ोटो: काटकर वेल्क्रो डॉट लगाने पर हर सितारा बच्चा खुद चिपका सकता है, और लैमिनेट किया चार्ट कई हफ़्ते चलता है।",
          es: "Una foto llena de las marcas de la tabla: recortadas y con puntos de velcro, su peque puede pegar cada estrella, y la tabla plastificada dura muchas semanas.",
          ar: "صورة مليئة بعلامات اللوحة: بعد قصّها وإضافة نقاط الفيلكرو يستطيع طفلكم تثبيت كل نجمة بنفسه، وتدوم اللوحة المغلّفة أسابيع كثيرة.",
          ru: "Фото, полное значков таблицы: вырезанные и с липучками, каждую звезду ребёнок сможет прикрепить сам, а ламинированная таблица прослужит много недель.",
        })}
        cards={Array.from({ length: stars.cols * stars.rows }, () => ({ emoji: mark.emoji, picture: markPicture(mark) }))}
        min={MIN_STAR_MM}
        theme={THEME_BY_ID.get(board.theme) ?? THEMES[0]}
        name={t({
          de: "belohnungstafel-sterne",
          en: "reward-chart-stars",
          zh: "奖励表-星星",
          hi: "इनाम-चार्ट-सितारे",
          es: "tabla-de-premios-estrellas",
          ar: "لوحة-المكافآت-نجوم",
          ru: "таблица-наград-звёзды",
        })}
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
              <MarkPic mark={mark} />
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
    <div
      ref={box}
      className="rw-preview"
      aria-label={t({
        de: "So sieht der Ausdruck aus",
        en: "This is how the printout looks",
        zh: "打印效果预览",
        hi: "प्रिंट ऐसा दिखेगा",
        es: "Así se verá la impresión",
        ar: "هكذا ستبدو الطباعة",
        ru: "Так будет выглядеть распечатка",
      })}
    >
      {/* zoom, not transform: the panel gets only as tall as the small pages. */}
      <div className="rw-preview-pages" style={{ zoom: scale, width: `${pageWidth}px` }}>
        {children}
      </div>
    </div>
  );
}
