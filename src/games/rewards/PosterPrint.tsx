import { type CSSProperties, type ReactNode, type RefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Mascot } from "@/components/Mascot";
import { Choice, SettingsGroup } from "@/components/SettingControls";
import { useFigure } from "@/lib/common";
import { type EnglishFirst, useAppLanguage, useT } from "@/lib/language";
import type { Theme } from "./catalog";
import { picture } from "./pictures";
import {
  blurriest,
  DECOR_MM,
  largestSharp,
  layoutSize,
  POSTER_DECORS,
  POSTER_SAFE_MM,
  type PosterDecor,
  type PosterFormat,
  type PosterOptions,
  type PosterPicture,
  posterFormat,
  posterPx,
  posterSize,
  seasonalDecor,
} from "./poster";
import { DecorPic, PosterFrame } from "./posterDecor";

/** Another chart that may share the poster (T-39): the routine goes on top, the chart of stars below. */
export interface PosterCompanion {
  id: string;
  /** Its name, as on its tab. */
  label: string;
  /** A routine of cards („plan“) or a chart of stars („board“: a board, or a plan with a Zähler). */
  kind: "board" | "plan";
  /** Its sheet on paper, laid out for `aspect` (width / height). */
  sheet: (aspect: number) => ReactNode;
}

/** Only the big poster has room for two charts. */
const COMPANION_FORMAT: PosterFormat["id"] = "40x60";

/** Under the size choice: what each size is good for. */
const FORMAT_USE: Record<PosterFormat["id"], EnglishFirst> = {
  "20x30": {
    en: "Small – a day plan on the door.",
    de: "Klein – ein Tagesplan an der Tür.",
    zh: "小号——贴在门上的一日计划。",
    hi: "छोटा – दरवाज़े पर दिन की योजना।",
    es: "Pequeño: un plan del día en la puerta.",
    ar: "صغير – خطة يوم على الباب.",
    ru: "Маленький – план дня на двери.",
  },
  "30x40": {
    en: "Standard – a week.",
    de: "Standard – eine Woche.",
    zh: "标准——一周。",
    hi: "सामान्य – एक हफ़्ता।",
    es: "Estándar: una semana.",
    ar: "قياسي – أسبوع.",
    ru: "Стандарт – неделя.",
  },
  "40x60": {
    en: "Large – a month, or a plan and a chart together.",
    de: "Groß – ein Monat, oder Plan und Tafel zusammen.",
    zh: "大号——一个月，或者把计划和奖励表放在一起。",
    hi: "बड़ा – एक महीना, या योजना और चार्ट एक साथ।",
    es: "Grande: un mes, o un plan y una tabla juntos.",
    ar: "كبير – شهر، أو خطة ولوحة معًا.",
    ru: "Большой – месяц или план и таблица вместе.",
  },
  "30x90": {
    en: "Panorama – the day as one long row, above the bed, in the hall or by the coat hooks at the child’s height.",
    de: "Panorama – der Tag in einer langen Reihe, über dem Bett, im Flur oder an der Garderobe auf Kinderhöhe.",
    zh: "全景——一整天排成长长的一行，挂在床头上方、走廊里或衣帽架旁孩子的高度。",
    hi: "पैनोरमा – पूरा दिन एक लंबी पंक्ति में, बिस्तर के ऊपर, गलियारे में या खूँटियों के पास बच्चे की ऊँचाई पर।",
    es: "Panorámico: el día en una larga fila, sobre la cama, en el pasillo o junto al perchero, a la altura de su peque.",
    ar: "بانوراما – اليوم في صف طويل، فوق السرير أو في الممر أو عند المشجب بارتفاع الطفل.",
    ru: "Панорама – день одной длинной полосой, над кроватью, в коридоре или у вешалки на уровне ребёнка.",
  },
  "40x120": {
    en: "Panorama – morning and evening as two long rows, one above the other.",
    de: "Panorama – Früh und Abend als zwei lange Reihen übereinander.",
    zh: "全景——早上和晚上排成上下两长行。",
    hi: "पैनोरमा – सुबह और शाम दो लंबी पंक्तियों में, एक के ऊपर एक।",
    es: "Panorámico: mañana y noche en dos largas filas, una sobre otra.",
    ar: "بانوراما – الصباح والمساء في صفين طويلين واحدًا فوق الآخر.",
    ru: "Панорама – утро и вечер двумя длинными рядами друг над другом.",
  },
  "30x30": {
    en: "Square – the way winds across the whole picture, with no empty strip.",
    de: "Quadratisch – der Weg schlängelt sich über das ganze Bild, ohne leeren Streifen.",
    zh: "正方形——小路蜿蜒铺满整张图，没有空白条。",
    hi: "चौकोर – रास्ता पूरी तस्वीर में घूमता है, कोई खाली पट्टी नहीं।",
    es: "Cuadrado: el camino serpentea por toda la imagen, sin franjas vacías.",
    ar: "مربع – يتعرّج الطريق على الصورة كلها بلا شريط فارغ.",
    ru: "Квадрат – дорожка вьётся по всей картинке, без пустой полосы.",
  },
};

/** The decorations' names. */
const DECOR_NAMES: Record<PosterDecor, EnglishFirst> = {
  plain: {
    en: "None (as on A4)",
    de: "Ohne (wie auf A4)",
    zh: "无装饰",
    hi: "बिना सजावट",
    es: "Sin adornos (como en A4)",
    ar: "بلا زينة",
    ru: "Без украшений",
  },
  vines: { en: "🌿 Vines", de: "🌿 Ranken", zh: "🌿 藤蔓", hi: "🌿 बेलें", es: "🌿 Enredaderas", ar: "🌿 أغصان", ru: "🌿 Вьюнок" },
  pennants: { en: "🎏 Pennants", de: "🎏 Wimpel", zh: "🎏 彩旗", hi: "🎏 झंडियाँ", es: "🎏 Banderines", ar: "🎏 رايات", ru: "🎏 Флажки" },
  clouds: { en: "☁️ Clouds", de: "☁️ Wolken", zh: "☁️ 云朵", hi: "☁️ बादल", es: "☁️ Nubes", ar: "☁️ غيوم", ru: "☁️ Облака" },
  easter: { en: "🥚 Easter", de: "🥚 Ostern", zh: "🥚 复活节", hi: "🥚 ईस्टर", es: "🥚 Pascua", ar: "🥚 عيد الفصح", ru: "🥚 Пасха" },
  birthday: { en: "🎂 Birthday", de: "🎂 Geburtstag", zh: "🎂 生日", hi: "🎂 जन्मदिन", es: "🎂 Cumpleaños", ar: "🎂 عيد ميلاد", ru: "🎂 День рождения" },
  autumn: { en: "🍂 Autumn", de: "🍂 Herbst", zh: "🍂 秋天", hi: "🍂 पतझड़", es: "🍂 Otoño", ar: "🍂 الخريف", ru: "🍂 Осень" },
  advent: { en: "🎄 Advent", de: "🎄 Advent", zh: "🎄 圣诞季", hi: "🎄 क्रिसमस", es: "🎄 Adviento", ar: "🎄 الميلاد", ru: "🎄 Рождество" },
};

/** „💾 Speichern“. */
const SAVE: EnglishFirst = { en: "Save", de: "Speichern", zh: "保存", hi: "सेव करें", es: "Guardar", ar: "حفظ", ru: "Сохранить" };
/** „📤 Teilen“. */
const SHARE: EnglishFirst = { en: "Share", de: "Teilen", zh: "分享", hi: "शेयर करें", es: "Compartir", ar: "مشاركة", ru: "Поделиться" };

/** A poster size as shops write it in the language: centimetres, inches first in English. */
function useSizeName() {
  const { id } = useAppLanguage();
  const t = useT();
  const cm = t({ en: "cm", de: "cm", zh: "厘米", hi: "सेमी", es: "cm", ar: "سم", ru: "см" });
  return (f: PosterFormat) => (id === "en" ? `${f.inches} (${f.cm} cm)` : `${f.cm} ${cm}`);
}

/** The poster drawn and ready to save: its JPG, an address for it, and the pictures measured on it. */
interface Drawn {
  blob: Blob;
  url: string;
  /** What was drawn, to tell a stale picture from the one asked for. */
  key: string;
  pictures: PosterPicture[];
}

/**
 * The whole chart as one photo poster (T-32): the grown-up picks a size every photo service prints, sees the poster as
 * it will come (the 5 mm the service trims marked dashed, T-37, and on a wall beside a door and a child, T-38), picks a
 * decoration (T-33, T-40), saves it as JPG or shares it to the photo app, and orders it. The very sheet of the screen
 * and the A4 print is drawn – laid out on a box of the poster's shape, then painted onto a canvas at the format's
 * pixels – so the poster never has a layout of its own.
 */
export function PosterPrint({
  formats,
  orientation,
  theme,
  name,
  sheet,
  companions = [],
  plan = false,
  options,
  onChange,
}: {
  /** The sizes this chart may have (`posterFormatsFor`). */
  formats: PosterFormat[];
  /** As the A4 page: a standard poster stands or lies like it. */
  orientation: "landscape" | "portrait";
  theme: Theme;
  /** The start of the file name („tagesplan-poster“). */
  name: string;
  /** The chart's sheet on paper, laid out for `aspect` (width / height). */
  sheet: (aspect: number) => ReactNode;
  /** Charts of the other kind that may share the big poster (T-39). */
  companions?: PosterCompanion[];
  /** This chart is a routine without stars (it goes on top of a chart of stars; the guide speaks of its cards). */
  plan?: boolean;
  options: PosterOptions;
  onChange: (patch: PosterOptions) => void;
}) {
  const t = useT();
  const sizeName = useSizeName();
  const format = posterFormat(formats, options.poster);
  const decor = options.decor ?? seasonalDecor(new Date().getMonth());
  const companion = format.id === COMPANION_FORMAT ? companions.find((c) => c.id === options.companion) : undefined;
  // Two charts stand one over the other: the poster stands.
  const turn = companion ? "portrait" : orientation;
  const real = posterSize(format, turn);
  const layout = layoutSize(format, turn);
  const fancy = decor !== "plain";
  const pad = fancy ? DECOR_MM + 3 : 10;
  const inner = { width: layout.width - 2 * pad, height: layout.height - 2 * pad };
  // Room for the heading and the goal, as on A4: what a collecting way's path and the plan's cards fit into.
  const aspectOf = (height: number) => inner.width / Math.max(20, height - 40);
  const backdrop = fancy ? picture(`poster-${theme.id}`) : undefined;

  const own = sheet(aspectOf(companion ? (inner.height - 6) / 2 : inner.height));
  const other = companion?.sheet(aspectOf((inner.height - 6) / 2));
  // A plan goes on top, a board below (T-39: Abendroutine oben, „7 Abende im eigenen Bett“ unten).
  // The routine goes on top, the chart of stars below; two of a kind keep this one on top.
  const sheets = companion ? (!plan && companion.kind === "plan" ? [other, own] : [own, other]) : [own];

  const key = JSON.stringify([format.id, turn, decor, companion?.id ?? "", theme.id]);
  const page = useRef<HTMLDivElement>(null);
  const drawn = useDrawn(page, key, format, real);
  const ready = drawn?.key === key;
  const soft = drawn ? blurriest(drawn.pictures, format, turn) : undefined;
  const better = drawn && soft ? largestSharp(drawn.pictures, formats, format, turn) : undefined;
  const file = `${name}-${format.id}.jpg`;

  return (
    <SettingsGroup
      title={`🖼️ ${t({
        en: "As a photo poster",
        de: "Als Fotoposter",
        zh: "做成照片海报",
        hi: "फ़ोटो पोस्टर के रूप में",
        es: "Como póster fotográfico",
        ar: "كملصق صور",
        ru: "Фотопостером",
      })}`}
    >
      <p className="setting-note">
        {t({
          en: "The whole chart as one picture to order on photo paper: firm, wipeable and without laminating, it hangs like a bought poster and costs a few euros at any photo service.",
          de: "Die ganze Tafel als ein Bild zum Bestellen auf Fotopapier: fest, abwischbar und ohne Laminieren hängt sie wie ein gekauftes Poster und kostet bei jedem Fotodienst nur ein paar Euro.",
          zh: "整张表做成一张图片，冲印在相纸上：结实、可擦、不用过塑，挂起来像买来的海报，在任何冲印店只要几块钱。",
          hi: "पूरा चार्ट एक तस्वीर के रूप में, फ़ोटो पेपर पर मँगाने के लिए: मज़बूत, पोंछने लायक और बिना लैमिनेशन के, यह खरीदे हुए पोस्टर जैसा लगता है और किसी भी फ़ोटो सेवा पर कम दाम में मिलता है।",
          es: "Toda la tabla como una sola imagen para pedir en papel fotográfico: firme, lavable y sin plastificar, queda como un póster comprado y cuesta poco en cualquier servicio de fotos.",
          ar: "اللوحة كلها صورة واحدة تُطلب على ورق الصور: متينة وقابلة للمسح وبلا تغليف، تُعلّق كملصق مشترى وتكلّف القليل لدى أي خدمة طباعة صور.",
          ru: "Вся таблица одной картинкой для заказа на фотобумаге: плотная, моющаяся и без ламинирования, она висит как купленный постер и стоит недорого в любом фотосервисе.",
        })}
      </p>
      <Choice
        label={t({
          en: "Poster size",
          de: "Postergröße",
          zh: "海报尺寸",
          hi: "पोस्टर का साइज़",
          es: "Tamaño del póster",
          ar: "مقاس الملصق",
          ru: "Размер постера",
        })}
        value={format.id}
        onChange={(poster) => onChange({ poster })}
        options={formats.map((f) => ({ value: f.id, label: sizeName(f) }))}
      />
      <p className="setting-note">{t(FORMAT_USE[format.id])}</p>
      <fieldset className="choice rw-poster-decors">
        <legend>{t({ en: "Decoration", de: "Schmuck", zh: "装饰", hi: "सजावट", es: "Adornos", ar: "الزينة", ru: "Украшение" })}</legend>
        {POSTER_DECORS.map((d) => (
          <button key={d} type="button" className={d === decor ? "selected" : undefined} aria-pressed={d === decor} onClick={() => onChange({ decor: d })}>
            <DecorPic decor={d} theme={theme} />
            <span className="choice-label">{t(DECOR_NAMES[d])}</span>
          </button>
        ))}
      </fieldset>
      {companions.length > 0 && format.id === COMPANION_FORMAT && (
        <Choice
          label={t({
            en: "On the same poster",
            de: "Auf dasselbe Poster",
            zh: "放在同一张海报上",
            hi: "उसी पोस्टर पर",
            es: "En el mismo póster",
            ar: "على الملصق نفسه",
            ru: "На тот же постер",
          })}
          value={companion?.id ?? ""}
          onChange={(id) => onChange({ companion: id || undefined })}
          options={[
            {
              value: "",
              label: t({ en: "Only this one", de: "Nur diese", zh: "只有这一张", hi: "सिर्फ़ यही", es: "Solo esta", ar: "هذه فقط", ru: "Только эта" }),
            },
            ...companions.map((c) => ({ value: c.id, label: `＋ ${c.label}` })),
          ]}
        />
      )}
      {companions.length > 0 && format.id !== COMPANION_FORMAT && (
        <p className="setting-note">
          {t({
            en: "On 40 × 60 cm a plan and a chart fit on one poster together.",
            de: "Auf 40 × 60 cm passen Plan und Tafel zusammen auf ein Poster.",
            zh: "40 × 60 厘米的海报上可以同时放下计划和奖励表。",
            hi: "40 × 60 सेमी पर योजना और चार्ट एक साथ एक पोस्टर पर आ जाते हैं।",
            es: "En 40 × 60 cm caben juntos un plan y una tabla en un póster.",
            ar: "على مقاس 40 × 60 سم تتسع الخطة واللوحة معًا لملصق واحد.",
            ru: "На 40 × 60 см план и таблица помещаются на один постер.",
          })}
        </p>
      )}
      {soft && (
        <p className="rw-poster-warning" role="status">
          ⚠️{" "}
          {better
            ? t({
                en: `${soft.photo ? "The photo" : "A picture"} will be blurry at ${sizeName(format)} – ${sizeName(better)} stays sharp.`,
                de: `${soft.photo ? "Das Foto" : "Ein Bild"} wird bei ${sizeName(format)} unscharf – ${sizeName(better)} passt.`,
                zh: `${soft.photo ? "照片" : "有一张图片"}在 ${sizeName(format)} 上会模糊——${sizeName(better)} 仍然清晰。`,
                hi: `${sizeName(format)} पर ${soft.photo ? "फ़ोटो" : "एक तस्वीर"} धुंधली होगी – ${sizeName(better)} पर साफ़ रहेगी।`,
                es: `${soft.photo ? "La foto" : "Una imagen"} saldrá borrosa en ${sizeName(format)}; en ${sizeName(better)} queda nítida.`,
                ar: `${soft.photo ? "ستكون الصورة الشخصية" : "ستكون إحدى الصور"} غير واضحة على ${sizeName(format)} – أما ${sizeName(better)} فيبقى واضحًا.`,
                ru: `${soft.photo ? "Фото" : "Одна из картинок"} будет нечётким на ${sizeName(format)} – на ${sizeName(better)} всё резко.`,
              })
            : t({
                en: `${soft.photo ? "The photo" : "A picture"} is too small to be sharp on a poster – choose a bigger one, or leave it out.`,
                de: `${soft.photo ? "Das Foto" : "Ein Bild"} ist für ein Poster zu klein, um scharf zu sein – nehmen Sie ein größeres oder lassen Sie es weg.`,
                zh: `${soft.photo ? "照片" : "有一张图片"}太小，印成海报会模糊——请换一张更大的，或者去掉它。`,
                hi: `${soft.photo ? "फ़ोटो" : "एक तस्वीर"} पोस्टर पर साफ़ दिखने के लिए बहुत छोटी है – बड़ी चुनें या हटा दें।`,
                es: `${soft.photo ? "La foto" : "Una imagen"} es demasiado pequeña para salir nítida en un póster: elija una más grande o quítela.`,
                ar: `${soft.photo ? "الصورة الشخصية" : "إحدى الصور"} أصغر من أن تبدو واضحة على ملصق – اختاروا صورة أكبر أو احذفوها.`,
                ru: `${soft.photo ? "Фото" : "Одна из картинок"} слишком маленькое для чёткого постера – выберите побольше или уберите его.`,
              })}
        </p>
      )}
      <div className="rw-poster-result">
        <figure className={`rw-poster-figure${format.shape === "panorama" ? " rw-poster-wide" : ""}`} style={{ aspectRatio: `${real.width} / ${real.height}` }}>
          {drawn && (
            <img src={drawn.url} alt={t({ en: "The poster", de: "Das Poster", zh: "海报", hi: "पोस्टर", es: "El póster", ar: "الملصق", ru: "Постер" })} />
          )}
          {/* What the photo service trims: shown here only, never in the picture (T-37). */}
          <span
            className="rw-poster-safe"
            style={{ inset: `${(POSTER_SAFE_MM / real.height) * 100}% ${(POSTER_SAFE_MM / real.width) * 100}%` }}
            title={t({
              en: "Up to this line the photo service may trim",
              de: "Bis zu dieser Linie kann der Fotodienst beschneiden",
              zh: "冲印时可能裁到这条线",
              hi: "फ़ोटो सेवा इस रेखा तक काट सकती है",
              es: "Hasta esta línea puede recortar el servicio de fotos",
              ar: "قد تقصّ خدمة الصور حتى هذا الخط",
              ru: "До этой линии фотосервис может обрезать",
            })}
          />
          {!ready && (
            <span className="rw-poster-busy">
              {t({
                en: "Drawing the poster …",
                de: "Das Poster wird gezeichnet …",
                zh: "正在绘制海报……",
                hi: "पोस्टर बन रहा है …",
                es: "Dibujando el póster…",
                ar: "يُرسم الملصق …",
                ru: "Рисуем постер …",
              })}
            </span>
          )}
        </figure>
        <PosterWall format={format} size={real} url={drawn?.url} theme={theme} />
      </div>
      {ready && drawn && (
        <p className="rw-poster-buttons">
          <a className="rw-photo-button" href={drawn.url} download={file}>
            💾 {t(SAVE)}
          </a>
          {canShare(drawn.blob) && (
            <button type="button" className="rw-photo-button" onClick={() => share(drawn.blob, file)}>
              📤 {t(SHARE)}
            </button>
          )}
        </p>
      )}
      <PosterGuide size={sizeName(format)} plan={plan} />
      {createPortal(
        <div className="rw-poster-stage" aria-hidden>
          <div
            ref={page}
            className={`rw-page rw-poster${fancy ? " rw-poster-fancy" : ""}${backdrop ? " rw-poster-painted" : ""}`}
            style={
              {
                width: `${layout.width}mm`,
                height: `${layout.height}mm`,
                padding: `${pad}mm`,
                "--rw-paper": theme.paper,
                "--rw-main": theme.main,
                "--rw-ink": theme.ink,
                ...(backdrop ? { backgroundImage: `url("${backdrop}")` } : {}),
              } as CSSProperties
            }
          >
            <PosterFrame decor={decor} width={layout.width} height={layout.height} theme={theme} />
            <div className="rw-poster-sheets">
              {sheets.map((s, i) => (
                <div key={i} className="rw-poster-sheet">
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </SettingsGroup>
  );
}

/** How long the sheet must stay unchanged before it is drawn: the child's photo comes from IndexedDB a moment after it. */
const SETTLE_MS = 500;

/**
 * The poster drawn from the hidden sheet whenever what it shows changes: once the sheet has stood still for
 * `SETTLE_MS` (any change in it – a card, the photo arriving – waits again) and its pictures and fonts are there, it is
 * painted onto a canvas of the format's pixels (html-to-image, loaded only here) and saved as JPG.
 */
function useDrawn(page: RefObject<HTMLDivElement | null>, key: string, format: PosterFormat, real: { width: number; height: number }): Drawn | undefined {
  const [drawn, setDrawn] = useState<Drawn>();
  const last = useRef<string>("");
  useEffect(() => {
    const node = page.current;
    if (!node) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let run = 0;
    const draw = async () => {
      const mine = ++run;
      await document.fonts.ready;
      const images = [...node.querySelectorAll("img")];
      await Promise.all(images.map((img) => img.decode().catch(() => undefined)));
      if (cancelled || mine !== run) return;
      const box = node.getBoundingClientRect();
      const pictures = images.flatMap((img): PosterPicture[] => {
        const r = img.getBoundingClientRect();
        if (!img.naturalWidth || !r.width) return [];
        // An object-fit: contain picture fills its box only one way round.
        const shown = Math.min(r.width, (r.height * img.naturalWidth) / img.naturalHeight);
        return [{ px: img.naturalWidth, share: shown / box.width, photo: !!img.closest(".rw-portrait") }];
      });
      const { toCanvas } = await import("html-to-image");
      const options = {
        width: box.width,
        height: box.height,
        canvasWidth: posterPx(real.width, format.dpi),
        canvasHeight: posterPx(real.height, format.dpi),
        pixelRatio: 1,
        skipAutoScale: true,
        backgroundColor: "#ffffff",
      };
      try {
        // Safari leaves out pictures on the first drawing of a page: draw it once more there.
        const restore = inlineSvgStyles(node);
        let canvas: HTMLCanvasElement;
        try {
          if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) await toCanvas(node, options);
          canvas = await toCanvas(node, options);
        } finally {
          restore();
        }
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
        if (!blob || cancelled || mine !== run) return;
        const url = URL.createObjectURL(blob);
        if (last.current) URL.revokeObjectURL(last.current);
        last.current = url;
        setDrawn({ blob, url, key, pictures });
      } catch {
        // A canvas too big for this device: the size choice stays, and the A4 print still works.
      }
    };
    const settle = () => {
      clearTimeout(timer);
      timer = setTimeout(draw, SETTLE_MS);
    };
    // The sheet changes with the chart and its photo: draw again once it has stood still.
    // Its own copying of styles onto the svgs (inlineSvgStyles) is no change of the sheet.
    const observer = new MutationObserver((records) => {
      if (records.some((r) => !(r.attributeName === "style" && r.target instanceof SVGElement && r.target.ownerSVGElement))) settle();
    });
    observer.observe(node, { subtree: true, childList: true, attributes: true, characterData: true });
    settle();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [key, page, format.dpi, real.width, real.height]);
  // The last picture goes with the panel.
  useEffect(
    () => () => {
      if (last.current) URL.revokeObjectURL(last.current);
    },
    [],
  );
  return drawn;
}

/** What an svg's shapes take from the stylesheet and must keep on the poster. */
const SVG_STYLES = [
  "fill",
  "fill-opacity",
  "fill-rule",
  "stroke",
  "stroke-width",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-opacity",
  "opacity",
  "color",
  "vector-effect",
  "visibility",
  "display",
  "transform",
  "transform-origin",
  "transform-box",
  "font-family",
  "font-size",
  "font-weight",
  "text-anchor",
  "dominant-baseline",
  "stop-color",
  "stop-opacity",
  "paint-order",
  "filter",
];

/**
 * html-to-image copies the computed style of every element but an svg's children, which it copies as they are: a
 * shape styled by a class (the dotted way of a collecting board, `fill: none`) came out black and without its line.
 * So the stylesheet's values are written onto them for the drawing, and taken off again afterwards.
 */
function inlineSvgStyles(root: HTMLElement): () => void {
  const shapes = [...root.querySelectorAll("svg *")].filter((el): el is SVGElement => el instanceof SVGElement);
  const before = shapes.map((el) => el.getAttribute("style"));
  const computed = shapes.map((el) => getComputedStyle(el));
  const values = computed.map((style) => SVG_STYLES.map((name) => [name, style.getPropertyValue(name)] as const));
  shapes.forEach((el, i) => {
    for (const [name, value] of values[i]) if (value && !(name === "transform" && value === "none")) el.style.setProperty(name, value);
  });
  return () =>
    shapes.forEach((el, i) => {
      const style = before[i];
      if (style === null) el.removeAttribute("style");
      else el.setAttribute("style", style);
    });
}

/** The room the poster is shown in (T-38), in centimetres: a wall 3.2 m wide with the floor at 2.5 m. */
const ROOM = { width: 320, floor: 250 };
/** A small child of about two, standing beside the bed. */
const CHILD_CM = 90;

/**
 * A small drawn child's room with the poster at its real size on the wall (T-38): a door 2 m high, a child's bed and a
 * child of about 90 cm – the fox girl or the bear boy of „Junge / Mädchen“ – so 30 × 40 cm means something. The poster
 * hangs over the bed, its lower edge at the child's eye.
 */
function PosterWall({ format, size, url, theme }: { format: PosterFormat; size: { width: number; height: number }; url: string | undefined; theme: Theme }) {
  const t = useT();
  const girl = useFigure() === "girl";
  const bottom = ROOM.floor - 75;
  const x = 245 - size.width / 20;
  const y = bottom - size.height / 10;
  const w = size.width / 10;
  const h = size.height / 10;
  return (
    <figure className="rw-poster-wall">
      <svg
        viewBox={`0 0 ${ROOM.width} ${ROOM.floor + 10}`}
        role="img"
        aria-label={t({
          en: "The poster on a child’s wall, true to size",
          de: "Das Poster an der Wand eines Kinderzimmers, in echter Größe",
          zh: "海报挂在儿童房墙上，按真实大小显示",
          hi: "बच्चे के कमरे की दीवार पर पोस्टर, असली साइज़ में",
          es: "El póster en la pared de un cuarto infantil, a tamaño real",
          ar: "الملصق على جدار غرفة طفل بحجمه الحقيقي",
          ru: "Постер на стене детской в настоящем размере",
        })}
      >
        <rect width={ROOM.width} height={ROOM.floor} fill="#f6efe3" />
        <rect y={ROOM.floor} width={ROOM.width} height="10" fill="#d9b98c" />
        {/* The door, 80 × 200 cm, with its handle. */}
        <rect x="14" y={ROOM.floor - 200} width="80" height="200" fill="#fff" stroke="#c9b9a0" strokeWidth="1.5" />
        <circle cx="84" cy={ROOM.floor - 100} r="2.5" fill="#b0a08a" />
        {/* A child's bed, 140 cm long, with its headboard. */}
        <rect x="175" y={ROOM.floor - 62} width="8" height="62" rx="2" fill="#c08a5a" />
        <rect x="183" y={ROOM.floor - 38} width="132" height="26" rx="4" fill="#fff" stroke="#c9b9a0" />
        <rect x="183" y={ROOM.floor - 46} width="34" height="10" rx="4" fill="#eaf2ff" stroke="#c9b9a0" />
        <rect x="183" y={ROOM.floor - 14} width="132" height="14" fill="#c08a5a" />
        {/* The poster, true to size, with a little shadow. */}
        <rect x={x + 0.8} y={y + 1.2} width={w} height={h} fill="#00000022" />
        {url ? (
          <image href={url} x={x} y={y} width={w} height={h} preserveAspectRatio="none" />
        ) : (
          <rect x={x} y={y} width={w} height={h} fill={theme.paper} stroke={theme.ink} strokeWidth="0.6" />
        )}
        {/* The child, about 90 cm, beside the bed. */}
        <svg x="112" y={ROOM.floor - CHILD_CM * (300 / 280)} width={CHILD_CM * (200 / 280)} height={CHILD_CM * (300 / 280)}>
          <Mascot kind={girl ? "fox" : "bear"} child lashes={girl} />
        </svg>
      </svg>
      <figcaption>
        {t({
          en: `${format.inches} next to a door (2 m) and a child of about 90 cm`,
          de: `${format.cm} cm neben einer Tür (2 m) und einem Kind von etwa 90 cm`,
          zh: `${format.cm} 厘米，旁边是一扇门（2 米）和一个约 90 厘米高的孩子`,
          hi: `${format.cm} सेमी, एक दरवाज़े (2 मीटर) और लगभग 90 सेमी के बच्चे के पास`,
          es: `${format.cm} cm junto a una puerta (2 m) y un peque de unos 90 cm`,
          ar: `${format.cm} سم بجانب باب (2 م) وطفل طوله نحو 90 سم`,
          ru: `${format.cm} см рядом с дверью (2 м) и ребёнком ростом около 90 см`,
        })}
      </figcaption>
    </figure>
  );
}

/**
 * From the saved picture to the poster in use (T-32, T-34): order it, hang it, and how the stars or the card to do go
 * on a poster that has no loose cards – a whiteboard marker on a frame's acrylic glass, wiped every Monday, or stickers
 * on the matte paper; a clothes peg on the frame points at a plan's card. Never small magnets (a choking hazard under three).
 */
function PosterGuide({ size, plan }: { size: string; plan: boolean }) {
  const t = useT();
  const steps: { emoji: string; title: string; text: string }[] = [
    {
      emoji: "💾",
      title: t({
        en: "Save the poster",
        de: "Poster speichern",
        zh: "保存海报",
        hi: "पोस्टर सेव करें",
        es: "Guarde el póster",
        ar: "احفظوا الملصق",
        ru: "Сохраните постер",
      }),
      text: t({
        en: "“Save” stores it as a JPG in exactly the poster’s shape. On a phone, “Share” hands it straight to your photos or to a photo service’s app.",
        de: "„Speichern“ legt es als JPG genau im Seitenverhältnis des Posters ab. Auf dem Handy gibt „Teilen“ es direkt an die Fotos oder die App eines Fotodienstes.",
        zh: "“保存”会把它存成和海报比例完全一致的 JPG。在手机上，“分享”可以直接把它交给相册或冲印服务的应用。",
        hi: "„सेव करें“ इसे पोस्टर के ठीक अनुपात में JPG के रूप में रखता है। फ़ोन पर „शेयर करें“ इसे सीधे फ़ोटो या फ़ोटो सेवा के ऐप में भेज देता है।",
        es: "«Guardar» lo guarda como JPG con la proporción exacta del póster. En el móvil, «Compartir» lo pasa directamente a sus fotos o a la app de un servicio de fotos.",
        ar: "«حفظ» يخزّنه بصيغة JPG بنسبة الملصق تمامًا. على الهاتف يرسله «مشاركة» مباشرة إلى الصور أو إلى تطبيق خدمة الصور.",
        ru: "«Сохранить» записывает его в JPG точно в пропорциях постера. На телефоне «Поделиться» отправит его прямо в фото или в приложение фотосервиса.",
      }),
    },
    {
      emoji: "🛒",
      title: t({
        en: "Order it as a poster",
        de: "Als Poster bestellen",
        zh: "订购海报",
        hi: "पोस्टर मँगाएँ",
        es: "Pídalo como póster",
        ar: "اطلبوه كملصق",
        ru: "Закажите постер",
      }),
      text: t({
        en: `Upload the picture at a photo service, choose a poster of ${size} and “matte” (it doesn’t reflect and shows fewer fingerprints). Don’t let it be cropped (“fit the whole picture”): nothing that matters lies within 5 mm of the edge.`,
        de: `Laden Sie das Bild beim Fotodienst hoch (dm, Rossmann, CEWE, Pixum …), wählen Sie ein Poster ${size} und „matt“ – es spiegelt nicht und zeigt weniger Fingerabdrücke. Nicht zuschneiden lassen („ganzes Bild“): Nichts Wichtiges liegt näher als 5 mm am Rand.`,
        zh: `在冲印服务上传图片，选择 ${size} 的海报和“哑光”（不反光，指纹少）。不要裁剪（选“完整图片”）：重要的内容都离边缘 5 毫米以上。`,
        hi: `तस्वीर किसी फ़ोटो सेवा पर अपलोड करें, ${size} का पोस्टर और „मैट“ चुनें (चमकता नहीं, उँगलियों के निशान कम दिखते हैं)। कटवाएँ नहीं („पूरी तस्वीर“): कोई ज़रूरी चीज़ किनारे से 5 मिमी के अंदर नहीं है।`,
        es: `Suba la imagen a un servicio de fotos, elija un póster de ${size} y «mate» (no refleja y se notan menos las huellas). Que no la recorten («imagen completa»): nada importante está a menos de 5 mm del borde.`,
        ar: `ارفعوا الصورة إلى خدمة صور، واختاروا ملصقًا بمقاس ${size} و«مطفأ» (لا يعكس الضوء وتظهر عليه بصمات أقل). لا تسمحوا بقصّها («الصورة كاملة»): لا شيء مهم أقرب من 5 مم إلى الحافة.`,
        ru: `Загрузите картинку в фотосервис, выберите постер ${size} и «матовый» (не бликует, меньше отпечатков). Не давайте обрезать («изображение целиком»): ничего важного нет ближе 5 мм к краю.`,
      }),
    },
    {
      emoji: "🖼️",
      title: t({ en: "In a frame", de: "Im Rahmen", zh: "装进相框", hi: "फ़्रेम में", es: "En un marco", ar: "في إطار", ru: "В рамке" }),
      text: plan
        ? t({
            en: "A frame of the same size with acrylic glass (shatterproof) keeps the poster clean. A clothes peg on the frame points at the card that comes next – or your child ticks each card on the glass with a whiteboard marker, and you wipe it clean in the evening.",
            de: "Ein Rahmen in derselben Größe mit Acrylglas (bruchsicher) hält das Poster sauber. Eine Wäscheklammer am Rahmen zeigt auf die Karte, die dran ist – oder Ihr Kind hakt jede Karte mit einem Whiteboard-Stift auf dem Glas ab, und abends wischen Sie es sauber.",
            zh: "同样大小、带亚克力板（防碎）的相框能让海报保持干净。夹在相框上的晾衣夹指着下一张卡片——或者孩子用白板笔在玻璃上给每张卡片打勾，晚上您再擦干净。",
            hi: "उसी साइज़ का एक्रिलिक ग्लास (न टूटने वाला) वाला फ़्रेम पोस्टर को साफ़ रखता है। फ़्रेम पर लगी कपड़े की चिमटी अगले कार्ड की ओर इशारा करती है – या आपका बच्चा व्हाइटबोर्ड मार्कर से शीशे पर हर कार्ड पर निशान लगाता है, और शाम को आप उसे पोंछ देते हैं।",
            es: "Un marco del mismo tamaño con cristal acrílico (irrompible) mantiene limpio el póster. Una pinza en el marco señala la tarjeta que toca, o su peque marca cada tarjeta en el cristal con un rotulador de pizarra y por la noche usted lo borra.",
            ar: "إطار بالمقاس نفسه بزجاج أكريليك (لا ينكسر) يحفظ الملصق نظيفًا. ملقط غسيل على الإطار يشير إلى البطاقة التالية – أو يضع الطفل علامة على كل بطاقة فوق الزجاج بقلم سبورة بيضاء، وتمسحونها مساءً.",
            ru: "Рамка того же размера с акриловым стеклом (небьющимся) бережёт постер. Прищепка на рамке показывает на следующую карточку – или ребёнок отмечает каждую карточку маркером для доски на стекле, а вечером вы его стираете.",
          })
        : t({
            en: "A frame of the same size with acrylic glass (shatterproof): your child ticks off each star on the glass with a whiteboard marker, and every Monday you wipe it clean for the new week. The fields are printed empty and big enough for a star drawn with a pen.",
            de: "Ein Rahmen in derselben Größe mit Acrylglas (bruchsicher): Ihr Kind hakt jeden Stern mit einem Whiteboard-Stift auf dem Glas ab, und jeden Montag wischen Sie es für die neue Woche sauber. Die Felder sind leer gedruckt und groß genug für einen Stern mit dem Stift.",
            zh: "同样大小、带亚克力板（防碎）的相框：孩子用白板笔在玻璃上画上每颗星星，每周一您把它擦干净，开始新的一周。格子印出来是空的，大小正好够用笔画一颗星。",
            hi: "उसी साइज़ का एक्रिलिक ग्लास (न टूटने वाला) वाला फ़्रेम: आपका बच्चा व्हाइटबोर्ड मार्कर से शीशे पर हर तारा बनाता है, और हर सोमवार आप नए हफ़्ते के लिए उसे पोंछ देते हैं। खाने खाली छपते हैं और पेन से तारा बनाने लायक बड़े होते हैं।",
            es: "Un marco del mismo tamaño con cristal acrílico (irrompible): su peque marca cada estrella en el cristal con un rotulador de pizarra, y cada lunes usted lo borra para la nueva semana. Las casillas se imprimen vacías y con sitio para una estrella dibujada.",
            ar: "إطار بالمقاس نفسه بزجاج أكريليك (لا ينكسر): يرسم الطفل كل نجمة على الزجاج بقلم سبورة بيضاء، وتمسحونه كل يوم اثنين لأسبوع جديد. الخانات مطبوعة فارغة وكبيرة بما يكفي لنجمة بالقلم.",
            ru: "Рамка того же размера с акриловым стеклом (небьющимся): ребёнок отмечает каждую звёздочку маркером для доски на стекле, а каждый понедельник вы стираете её для новой недели. Поля напечатаны пустыми и достаточно большими для звёздочки ручкой.",
          }),
    },
    {
      emoji: "⭐",
      title: t({ en: "Without a frame", de: "Ohne Rahmen", zh: "不用相框", hi: "बिना फ़्रेम के", es: "Sin marco", ar: "بلا إطار", ru: "Без рамки" }),
      text: t({
        en: "Stickers stick straight onto matte photo paper, and the poster with them becomes a keepsake of what your child managed. No small magnets: children under three can swallow them.",
        de: "Aufkleber halten direkt auf mattem Fotopapier, und das Poster wird mit ihnen zum Andenken an das, was Ihr Kind geschafft hat. Keine kleinen Magnete: Unter drei Jahren können sie verschluckt werden.",
        zh: "贴纸可以直接贴在哑光相纸上，贴满后的海报就成了孩子所做到的事情的纪念。不要用小磁铁：三岁以下的孩子可能会吞下去。",
        hi: "स्टिकर सीधे मैट फ़ोटो पेपर पर चिपक जाते हैं, और उनके साथ पोस्टर आपके बच्चे की कामयाबी की याद बन जाता है। छोटे चुंबक नहीं: तीन साल से छोटे बच्चे उन्हें निगल सकते हैं।",
        es: "Las pegatinas se pegan directamente en el papel fotográfico mate, y con ellas el póster se convierte en un recuerdo de lo que su peque logró. Nada de imanes pequeños: los menores de tres años pueden tragárselos.",
        ar: "تلتصق الملصقات مباشرة على ورق الصور المطفأ، ويصبح الملصق بها تذكارًا لما أنجزه الطفل. لا مغناطيسات صغيرة: قد يبتلعها الأطفال دون الثالثة.",
        ru: "Наклейки держатся прямо на матовой фотобумаге, и с ними постер становится памятью о том, что ребёнок смог. Никаких маленьких магнитов: дети до трёх лет могут их проглотить.",
      }),
    },
  ];
  return (
    <details className="rw-photo-guide" open>
      <summary>
        🖼️{" "}
        {t({
          en: "Guide: from picture to poster on the wall",
          de: "Anleitung: vom Bild zum Poster an der Wand",
          zh: "说明：从图片到墙上的海报",
          hi: "गाइड: तस्वीर से दीवार पर पोस्टर तक",
          es: "Guía: de la imagen al póster en la pared",
          ar: "دليل: من الصورة إلى الملصق على الجدار",
          ru: "Инструкция: от картинки до постера на стене",
        })}
      </summary>
      <ol>
        {steps.map((step, i) => (
          <li key={step.emoji}>
            <span className="rw-photo-step" aria-hidden>
              <span className="rw-photo-step-emoji">{step.emoji}</span>
              <span className="rw-photo-step-number">{i + 1}</span>
            </span>
            <span>
              <strong>{step.title}</strong>
              <span>{step.text}</span>
            </span>
          </li>
        ))}
      </ol>
    </details>
  );
}

/** Phones can hand a picture straight to the photo app or a photo service's app. */
function canShare(blob: Blob) {
  try {
    return typeof navigator.canShare === "function" && navigator.canShare({ files: [new File([blob], "poster.jpg", { type: "image/jpeg" })] });
  } catch {
    return false;
  }
}

async function share(blob: Blob, name: string) {
  try {
    await navigator.share({ files: [new File([blob], name, { type: "image/jpeg" })] });
  } catch {
    // The grown-up closed the share sheet: nothing to do.
  }
}
