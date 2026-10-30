import { useEffect, useState } from "react";
import { Choice, SettingsGroup } from "@/components/SettingControls";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import type { Theme } from "./catalog";
import { PHOTO_FORMATS, type PhotoFormat, type PhotoLayout, photoFormat, photoLayout, photoPx, photoSheets } from "./photo";

/** One card on a photo: a picture and, for a plan's step, its name. */
export interface PhotoCard {
  emoji: string;
  /** Drawn instead of the emoji where there is one (`pictures.tsx`). */
  picture?: string;
  label?: string;
}

/** „💾 Speichern“ under each photo. */
const SAVE: Localized = { de: "Speichern", en: "Save", zh: "保存", hi: "सेव करें", es: "Guardar", ar: "حفظ", ru: "Сохранить" };

/** „Foto 2 von 3“: a photo's alt text. */
const PHOTO_OF: Localized<(n: number, of: number) => string> = {
  de: (n, of) => `Foto ${n} von ${of}`,
  en: (n, of) => `Photo ${n} of ${of}`,
  zh: (n, of) => `第 ${n} 张，共 ${of} 张`,
  hi: (n, of) => `फ़ोटो ${n} / ${of}`,
  es: (n, of) => `Foto ${n} de ${of}`,
  ar: (n, of) => `الصورة ${n} من ${of}`,
  ru: (n, of) => `Фото ${n} из ${of}`,
};

/** The look of the dark lines and words, as on the sheet. */
const INK = "#2a1e5c";
/** The cut lines: light enough to vanish in the white rim of a card that was cut a little off. */
const CUT = "#b9b4cc";

/** Centimetres, as shops write them in each language. */
const CM: Localized = { de: "cm", en: "cm", zh: "厘米", hi: "सेमी", es: "cm", ar: "سم", ru: "см" };

/** A Russian noun after the number `n`: one, few or many. */
const ruPlural = (n: number, one: string, few: string, many: string) => {
  const form = new Intl.PluralRules("ru").select(n);
  return form === "one" ? one : form === "few" ? few : many;
};

/** What fits on one photo and how many photos it takes; sizes come in already written for the language. */
const FIT: Localized<(f: { per: number; cm: string; size: string; inches: string; count: number }) => string> = {
  de: ({ per, cm, size, inches, count }) =>
    `${per} Karten à ${cm} cm passen auf einen Abzug ${size} (im Ausland ${inches}): Sie brauchen ${count === 1 ? "1 Foto" : `${count} Fotos`}.`,
  en: ({ per, cm, size, inches, count }) =>
    `${per} cards of ${cm} cm fit on one ${inches} print (${size}): you need ${count === 1 ? "1 photo" : `${count} photos`}.`,
  zh: ({ per, cm, size, inches, count }) => `一张 ${size}（${inches}）的照片可放 ${per} 张 ${cm} 厘米的卡片：您需要冲印 ${count} 张。`,
  hi: ({ per, cm, size, inches, count }) => `${size} (${inches}) के एक प्रिंट पर ${cm} सेमी के ${per} कार्ड आते हैं: आपको ${count} फ़ोटो चाहिए।`,
  es: ({ per, cm, size, inches, count }) =>
    `En una copia de ${size} (${inches}) caben ${per} tarjetas de ${cm} cm: necesita ${count === 1 ? "1 foto" : `${count} fotos`}.`,
  ar: ({ per, cm, size, inches, count }) => `تتسع صورة مطبوعة بمقاس ${size} (${inches}) لـ ${per} من البطاقات بحجم ${cm} سم. عدد الصور المطلوبة: ${count}.`,
  ru: ({ per, cm, size, inches, count }) =>
    `На один снимок ${size} (${inches}) помещается ${per} ${ruPlural(per, "карточка", "карточки", "карточек")} по ${cm} см: нужно ${count} фото.`,
};

/** Velcro dots of the size the guide names, as an example to buy (the user's pick). */
const VELCRO_EXAMPLE = "https://www.amazon.de/dp/B0D1475P6J";
/** The example is a German shop's page: only German screens link to it. */
const VELCRO_EXAMPLE_LANGUAGE = "de";

/**
 * Cards as photo prints: the grown-up picks a photo size every shop has, sees the photos, saves them as JPG
 * (or shares them straight to the photo app or a shop's app on a phone) and orders them like holiday photos.
 * A guide below says how, up to the Velcro dots. Used by the Tagesplan (its pictures) and the board (its stars).
 */
export function PhotoPrint({
  cards,
  min,
  theme,
  name,
  format: formatId,
  onFormat,
  title,
  note,
}: {
  cards: PhotoCard[];
  /** The smallest card in mm (`MIN_CARD_MM`, `MIN_STAR_MM`). */
  min: number;
  theme: Theme;
  /** The start of the file names („tagesplan-karten“). */
  name: string;
  format: string | undefined;
  onFormat: (format: PhotoFormat["id"]) => void;
  title: string;
  /** A line under the size choice: what is on the photos and what for. */
  note: string;
}) {
  const t = useT();
  const { speechLang } = useAppLanguage();
  const format = photoFormat(formatId);
  const layout = photoLayout(format, min);
  const perPhoto = layout.cols * layout.rows;
  const photos = useJpegs(cards, format, layout, theme);
  const count = photoSheets(cards, perPhoto).length;
  const cm = (layout.cell / 10).toLocaleString(speechLang, { maximumFractionDigits: 1 });
  // „10 × 15 cm“ with the language's own centimetres.
  const sized = (f: PhotoFormat) => f.label.replace("cm", t(CM));

  return (
    <SettingsGroup title={title}>
      <Choice
        label={t({ de: "Fotoformat", en: "Photo size", zh: "照片尺寸", hi: "फ़ोटो साइज़", es: "Tamaño de foto", ar: "مقاس الصورة", ru: "Формат фото" })}
        value={format.id}
        onChange={onFormat}
        options={PHOTO_FORMATS.map((f) => ({ value: f.id, label: sized(f) }))}
      />
      <p className="setting-note">
        {note} {t(FIT)({ per: perPhoto, cm, size: sized(format), inches: format.inches, count })}
      </p>
      <div className="rw-photos">
        {photos.map((photo, i) => (
          <figure key={photo.url} className="rw-photo">
            <img src={photo.url} alt={t(PHOTO_OF)(i + 1, photos.length)} style={{ aspectRatio: `${format.width} / ${format.height}` }} />
            <figcaption>
              <a className="rw-photo-button" href={photo.url} download={`${name}-${format.id}-${i + 1}.jpg`}>
                💾 {t(SAVE)}
              </a>
              {canShare(photo.blob) && (
                <button type="button" className="rw-photo-button" onClick={() => share(photo.blob, `${name}-${format.id}-${i + 1}.jpg`)}>
                  📤 {t({ de: "Teilen", en: "Share", zh: "分享", hi: "शेयर करें", es: "Compartir", ar: "مشاركة", ru: "Поделиться" })}
                </button>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
      <PhotoGuide size={sized(format)} inches={format.inches} cm={cm} />
    </SettingsGroup>
  );
}

/** The steps from saved picture to card on the wall, each with a big picture of its own. */
function PhotoGuide({ size, inches, cm }: { size: string; inches: string; cm: string }) {
  const t = useT();
  const { id: language } = useAppLanguage();
  const steps: { emoji: string; title: string; text: string }[] = [
    {
      emoji: "💾",
      title: t({
        de: "Fotos speichern",
        en: "Save the photos",
        zh: "保存照片",
        hi: "फ़ोटो सेव करें",
        es: "Guardar las fotos",
        ar: "حفظ الصور",
        ru: "Сохраните фото",
      }),
      text: t({
        de: "„Speichern“ legt jedes Foto als JPG ab. Auf dem Handy geht es mit „Teilen“ → „Bild sichern“ direkt in die Fotos – oder gleich in die App Ihres Fotodienstes.",
        en: "“Save” stores each photo as a JPG. On a phone, “Share” → “Save Image” puts it straight into your photos – or right into your photo service’s app.",
        zh: "“保存”会把每张照片存成图片。在手机上点“分享”→“存储图像”，即可直接存进相册——或直接发到冲印服务的应用里。",
        hi: "„सेव करें“ से हर फ़ोटो एक तस्वीर फ़ाइल के रूप में सेव होती है। फ़ोन पर „शेयर करें“ → „इमेज सेव करें“ से वह सीधे फ़ोटो में जाती है – या सीधे आपकी फ़ोटो सेवा के ऐप में।",
        es: "«Guardar» guarda cada foto como JPG. En el móvil, con «Compartir» → «Guardar imagen» va directamente a las fotos, o a la app de su servicio de fotos.",
        ar: "«حفظ» يحفظ كل صورة كملف صورة. على الهاتف: «مشاركة» ← «حفظ الصورة» فتنتقل مباشرة إلى الصور – أو إلى تطبيق خدمة الطباعة لديكم.",
        ru: "«Сохранить» сохраняет каждое фото как картинку. На телефоне «Поделиться» → «Сохранить изображение» отправит его прямо в фотографии – или сразу в приложение фотосервиса.",
      }),
    },
    {
      emoji: "🛒",
      title: t({
        de: "Wie Urlaubsfotos bestellen",
        en: "Order them like vacation photos",
        zh: "像普通照片一样冲印",
        hi: "छुट्टियों की फ़ोटो की तरह प्रिंट कराएँ",
        es: "Pídalas como fotos de vacaciones",
        ar: "اطلبوها مثل صور العطلة",
        ru: "Закажите, как фото из отпуска",
      }),
      // German screens name German shops; the others say where such shops are.
      text: t({
        de: `Format ${size} – das gibt es überall: am Fotoautomaten in der Drogerie (dm, Rossmann, Müller), im Fotogeschäft oder online (CEWE, Pixum …). Wählen Sie „matt“: Es spiegelt nicht und zeigt keine Fingerabdrücke. Fragt der Dienst nach dem Ausschnitt, nehmen Sie „ganzes Bild“ – der weiße Rand fängt ab, was trotzdem abgeschnitten wird.`,
        en: `Size ${inches} (${size}) is available everywhere: at a photo kiosk in a drugstore, at a photo shop or online. Choose “matte”: it doesn’t reflect and shows no fingerprints. If the service asks about cropping, choose “full image” – the white border catches whatever is cut off anyway.`,
        zh: `${size}（${inches}）这个尺寸到处都能冲印：商场或药妆店的自助冲印机、照相馆或网上冲印。请选“哑光”：不反光，也不留指纹。如果要选裁剪方式，请选“完整图片”——白边会接住仍被裁掉的部分。`,
        hi: `${size} (${inches}) का साइज़ हर जगह मिलता है: फ़ोटो कियोस्क पर, फ़ोटो स्टूडियो में या ऑनलाइन। „मैट“ चुनें: इसमें चमक नहीं आती और उँगलियों के निशान नहीं दिखते। अगर सेवा क्रॉप के बारे में पूछे, तो „पूरी तस्वीर“ चुनें – सफ़ेद किनारा वह हिस्सा सँभाल लेता है जो फिर भी कट जाए।`,
        es: `El tamaño ${size} (${inches}) se encuentra en todas partes: en la máquina de fotos de una droguería, en una tienda de fotografía o en internet. Elija «mate»: no hace reflejos ni deja huellas. Si el servicio pregunta por el recorte, elija «imagen completa»: el borde blanco absorbe lo que se recorte de todos modos.`,
        ar: `مقاس ${size} (${inches}) متوفر في كل مكان: في أجهزة طباعة الصور في المتاجر، أو في محل تصوير، أو عبر الإنترنت. اختاروا «مطفي»: لا يعكس الضوء ولا تظهر عليه البصمات. إذا سألت الخدمة عن القص، فاختاروا «الصورة كاملة» – فالحافة البيضاء تستوعب ما قد يُقص رغم ذلك.`,
        ru: `Формат ${size} (${inches}) есть везде: в фотоавтомате в магазине, в фотоателье или онлайн. Выберите матовую бумагу: она не бликует, и на ней не видно отпечатков пальцев. Если сервис спрашивает про кадрирование, выберите «всё изображение» – белая рамка возьмёт на себя то, что всё же обрежут.`,
      }),
    },
    {
      emoji: "✂️",
      title: t({ de: "Zuschneiden", en: "Cut them out", zh: "裁剪", hi: "काटें", es: "Recortar", ar: "القص", ru: "Разрежьте" }),
      text: t({
        de: `Entlang der grauen Linien, mit Schere oder Papierschneider – ein Schnitt trennt zwei Karten. Jede Karte ist dann ${cm} cm groß. Runden Sie die Ecken ab (Schere oder Eckenrunder): Spitze Ecken piksen.`,
        en: `Along the gray lines, with scissors or a paper cutter – one cut separates two cards. Each card is then ${cm} cm. Round off the corners (scissors or a corner rounder): pointed corners poke.`,
        zh: `沿着灰色线用剪刀或裁纸刀裁开——一刀分开两张卡片。每张卡片 ${cm} 厘米大小。把角修圆（用剪刀或圆角器）：尖角会扎人。`,
        hi: `धूसर लाइनों पर कैंची या पेपर कटर से काटें – एक कट से दो कार्ड अलग होते हैं। हर कार्ड ${cm} सेमी का होगा। कोने गोल कर दें (कैंची या कॉर्नर राउंडर से): नुकीले कोने चुभते हैं।`,
        es: `Por las líneas grises, con tijeras o guillotina: un corte separa dos tarjetas. Cada tarjeta mide entonces ${cm} cm. Redondee las esquinas (con tijeras o un redondeador de esquinas): las esquinas puntiagudas pinchan.`,
        ar: `على طول الخطوط الرمادية، بالمقص أو بقطّاعة الورق – قصّة واحدة تفصل بطاقتين. يصبح حجم كل بطاقة ${cm} سم. دوّروا الزوايا (بالمقص أو بأداة تدوير الزوايا): الزوايا الحادة تخز.`,
        ru: `По серым линиям, ножницами или резаком – один разрез отделяет две карточки. Каждая карточка будет ${cm} см. Закруглите уголки (ножницами или угловым дыроколом): острые углы колются.`,
      }),
    },
    {
      emoji: "🧷",
      title: t({ de: "Klett dran", en: "Add Velcro", zh: "贴上魔术贴", hi: "वेल्क्रो लगाएँ", es: "Ponga velcro", ar: "ثبّتوا الفيلكرو", ru: "Приклейте липучки" }),
      text: t({
        de: "Selbstklebende Klettpunkte (20 mm) halten am besten: die weiche Seite hinten auf jede Karte, die harte Seite auf Tafel, Tür, Schrank oder ein Stück Filz. Fotopapier ist fest und abwischbar – Laminieren ist nicht nötig.",
        en: "Self-adhesive Velcro dots (20 mm) hold best: the soft side on the back of each card, the hard side on a board, door, cupboard or a piece of felt. Photo paper is firm and wipeable – no need to laminate.",
        zh: "自粘魔术贴圆点（20 毫米）最牢固：软面贴在每张卡片背面，硬面贴在板子、门、柜子或一块毛毡上。相纸结实又能擦拭——不需要过塑。",
        hi: "खुद चिपकने वाले वेल्क्रो डॉट (20 मिमी) सबसे अच्छे रहते हैं: नरम हिस्सा हर कार्ड के पीछे, खुरदरा हिस्सा बोर्ड, दरवाज़े, अलमारी या फ़ेल्ट के टुकड़े पर। फ़ोटो पेपर मज़बूत होता है और पोंछा जा सकता है – लैमिनेट करने की ज़रूरत नहीं।",
        es: "Los puntos de velcro adhesivos (20 mm) son los que mejor sujetan: el lado suave detrás de cada tarjeta, el lado áspero en un tablero, una puerta, un armario o un trozo de fieltro. El papel fotográfico es firme y se puede limpiar: no hace falta plastificar.",
        ar: "نقاط الفيلكرو اللاصقة (20 ملم) تثبت أفضل: الجانب الناعم خلف كل بطاقة، والجانب الخشن على لوح أو باب أو خزانة أو قطعة لباد. ورق الصور متين ويمكن مسحه – لا حاجة إلى التغليف.",
        ru: "Лучше всего держатся самоклеящиеся липучки-кружки (20 мм): мягкая сторона – на обратную сторону карточки, жёсткая – на доску, дверь, шкаф или кусок фетра. Фотобумага плотная и моется – ламинировать не нужно.",
      }),
    },
    {
      emoji: "👀",
      title: t({
        de: "Sicher für Kleine",
        en: "Safe for little ones",
        zh: "对小宝宝安全",
        hi: "छोटों के लिए सुरक्षित",
        es: "Seguro para los pequeños",
        ar: "آمن للصغار",
        ru: "Безопасно для малышей",
      }),
      text: t({
        de: "Klettpunkte fest andrücken und einen Tag ruhen lassen, dann halten sie. Ab und zu nachsehen, ob einer lose ist: Kleine Teile gehören nicht in den Mund. Keine kleinen Magnete – unter drei Jahren können sie verschluckt werden.",
        en: "Press the Velcro dots on firmly and let them rest for a day, then they hold. Check now and then whether one is loose: small parts don’t belong in the mouth. No small magnets – children under three can swallow them.",
        zh: "把魔术贴压紧，放置一天，就能贴牢。时不时检查有没有松动：小零件不能放进嘴里。不要用小磁铁——三岁以下的孩子可能会吞下去。",
        hi: "वेल्क्रो डॉट को ज़ोर से दबाएँ और एक दिन छोड़ दें, फिर वे टिके रहते हैं। बीच-बीच में देखें कि कोई ढीला तो नहीं: छोटी चीज़ें मुँह में नहीं जानी चाहिए। छोटे चुंबक नहीं – तीन साल से छोटे बच्चे उन्हें निगल सकते हैं।",
        es: "Presione bien los puntos de velcro y déjelos reposar un día; así aguantan. Compruebe de vez en cuando si alguno se ha soltado: las piezas pequeñas no deben ir a la boca. Nada de imanes pequeños: los menores de tres años pueden tragárselos.",
        ar: "اضغطوا نقاط الفيلكرو جيدًا واتركوها يومًا لتثبت. تفقّدوها من حين لآخر لئلا تكون إحداها مرتخية: القطع الصغيرة لا مكان لها في الفم. لا مغناطيسات صغيرة – قد يبتلعها الأطفال دون الثالثة.",
        ru: "Плотно прижмите липучки и дайте им сутки полежать – тогда они держат. Время от времени проверяйте, не отклеилась ли какая-нибудь: мелким деталям не место во рту. Никаких маленьких магнитов – дети до трёх лет могут их проглотить.",
      }),
    },
  ];
  return (
    <details className="rw-photo-guide" open>
      <summary>
        📸{" "}
        {t({
          de: "Anleitung: vom Foto zur Klett-Tafel",
          en: "Guide: from photo to Velcro board",
          zh: "说明：从照片到魔术贴板",
          hi: "तरीका: फ़ोटो से वेल्क्रो बोर्ड तक",
          es: "Guía: de la foto al tablero de velcro",
          ar: "الدليل: من الصورة إلى لوحة الفيلكرو",
          ru: "Инструкция: от фото до доски на липучках",
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
              <span>
                {step.text}
                {step.emoji === "🧷" && language === VELCRO_EXAMPLE_LANGUAGE && (
                  <>
                    {" "}
                    <a href={VELCRO_EXAMPLE} target="_blank" rel="noopener noreferrer">
                      {/* Shown on German screens only, so German only. */}
                      Zum Beispiel diese.
                    </a>
                  </>
                )}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </details>
  );
}

/** A photo drawn and ready to save: its JPG and an address for it. */
interface Jpeg {
  blob: Blob;
  url: string;
}

/** The photos as JPGs, drawn again when the cards, the size or the colours change. */
function useJpegs(cards: PhotoCard[], format: PhotoFormat, layout: PhotoLayout, theme: Theme): Jpeg[] {
  const [jpegs, setJpegs] = useState<Jpeg[]>([]);
  const key = JSON.stringify([cards, format.id, layout, theme.id]);
  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];
    (async () => {
      await fontsReady();
      const images = await loadImages(cards);
      const made: Jpeg[] = [];
      for (const sheet of photoSheets(cards, layout.cols * layout.rows)) {
        const blob = await drawPhoto(sheet, images, format, layout, theme);
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        urls.push(url);
        made.push({ blob, url });
      }
      if (!cancelled) setJpegs(made);
    })();
    return () => {
      cancelled = true;
      for (const url of urls) URL.revokeObjectURL(url);
    };
  }, [key]);
  return jpegs;
}

/** The app's rounded font, loaded before drawing: a canvas only uses a font that is already there. */
async function fontsReady() {
  try {
    await document.fonts.load(`700 40px "Fredoka Variable"`);
  } catch {
    // Without it the canvas draws the next rounded font of the system.
  }
}

/** The cards' pictures, loaded: a canvas draws only a picture that is there. One that fails is drawn as its emoji. */
async function loadImages(cards: PhotoCard[]): Promise<Map<string, HTMLImageElement>> {
  const urls = [...new Set(cards.flatMap((card) => card.picture ?? []))];
  const loaded = await Promise.all(
    urls.map(async (url) => {
      const image = new Image();
      image.src = url;
      try {
        await image.decode();
        return [[url, image] as const];
      } catch {
        return [];
      }
    }),
  );
  return new Map(loaded.flat());
}

/** One photo at 300 dpi: white, the cut lines from edge to edge, and every card in the theme's colours. */
function drawPhoto(cards: PhotoCard[], images: Map<string, HTMLImageElement>, format: PhotoFormat, layout: PhotoLayout, theme: Theme): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = photoPx(format.width);
  canvas.height = photoPx(format.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("no canvas"));
  const mm = canvas.width / format.width;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cut lines across the whole photo, so a paper cutter can follow them; the outer ones cut the margin off.
  ctx.strokeStyle = CUT;
  ctx.lineWidth = 0.3 * mm;
  ctx.setLineDash([2 * mm, 1.5 * mm]);
  for (let c = 0; c <= layout.cols; c++) {
    const x = (layout.left + c * layout.cell) * mm;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let r = 0; r <= layout.rows; r++) {
    const y = (layout.top + r * layout.cell) * mm;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // A white rim inside each cell: a cut a millimetre off only makes it thinner, never touches the card.
  const inset = 2.5 * mm;
  const side = layout.cell * mm - 2 * inset;
  const radius = side * 0.12;
  const font = getComputedStyle(document.body).getPropertyValue("--font-rounded") || "sans-serif";
  const emojiFont = getComputedStyle(document.body).getPropertyValue("--font-emoji") || "sans-serif";
  cards.forEach((card, i) => {
    const x = (layout.left + (i % layout.cols) * layout.cell) * mm + inset;
    const y = (layout.top + Math.floor(i / layout.cols) * layout.cell) * mm + inset;
    ctx.beginPath();
    ctx.roundRect(x, y, side, side, radius);
    ctx.fillStyle = theme.paper;
    ctx.fill();
    ctx.lineWidth = side * 0.035;
    ctx.strokeStyle = theme.main;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const image = card.picture ? images.get(card.picture) : undefined;
    if (image) {
      // The picture in a square above the word (or in the middle without one), as big as it fits.
      const box = side * (card.label ? 0.66 : 0.8);
      const scale = Math.min(box / image.naturalWidth, box / image.naturalHeight);
      const w = image.naturalWidth * scale;
      const h = image.naturalHeight * scale;
      const top = card.label ? y + side * 0.08 : y + (side - box) / 2;
      ctx.drawImage(image, x + (side - w) / 2, top + (box - h) / 2, w, h);
    } else {
      ctx.font = `${Math.round(side * (card.label ? 0.5 : 0.62))}px ${emojiFont}`;
      ctx.fillText(card.emoji, x + side / 2, y + side * (card.label ? 0.42 : 0.53));
    }
    if (card.label) {
      // As big as the card's width allows, never bigger than a tenth of it.
      let size = side * 0.11;
      ctx.font = `600 ${size}px ${font}`;
      const width = ctx.measureText(card.label).width;
      if (width > side * 0.86) size *= (side * 0.86) / width;
      ctx.font = `600 ${size}px ${font}`;
      ctx.fillStyle = INK;
      ctx.fillText(card.label, x + side / 2, y + side * 0.84);
    }
  });

  return new Promise((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("no jpeg"))), "image/jpeg", 0.92));
}

/** Phones can hand a picture straight to the photo app or a photo shop's app. */
function canShare(blob: Blob) {
  try {
    return typeof navigator.canShare === "function" && navigator.canShare({ files: [new File([blob], "karten.jpg", { type: "image/jpeg" })] });
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
