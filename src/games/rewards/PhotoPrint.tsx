import { useEffect, useState } from "react";
import { Choice, SettingsGroup } from "@/components/SettingControls";
import { useT } from "@/lib/language";
import type { Theme } from "./catalog";
import { PHOTO_FORMATS, type PhotoFormat, type PhotoLayout, photoFormat, photoLayout, photoPx, photoSheets } from "./photo";

/** One card on a photo: a picture and, for a plan's step, its name. */
export interface PhotoCard {
  emoji: string;
  /** Drawn instead of the emoji where there is one (`pictures.tsx`). */
  picture?: string;
  label?: string;
}

/** The look of the dark lines and words, as on the sheet. */
const INK = "#2a1e5c";
/** The cut lines: light enough to vanish in the white rim of a card that was cut a little off. */
const CUT = "#b9b4cc";

/** Velcro dots of the size the guide names, as an example to buy (the user's pick). */
const VELCRO_EXAMPLE = "https://www.amazon.de/dp/B0D1475P6J";

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
  const format = photoFormat(formatId);
  const layout = photoLayout(format, min);
  const perPhoto = layout.cols * layout.rows;
  const photos = useJpegs(cards, format, layout, theme);
  const count = photoSheets(cards, perPhoto).length;
  const cm = (layout.cell / 10).toLocaleString("de-DE", { maximumFractionDigits: 1 });

  return (
    <SettingsGroup title={title}>
      <Choice label={t({ de: "Fotoformat" })} value={format.id} onChange={onFormat} options={PHOTO_FORMATS.map((f) => ({ value: f.id, label: f.label }))} />
      <p className="setting-note">
        {note}{" "}
        {t({
          de:
            count === 1
              ? `${perPhoto} Karten à ${cm} cm passen auf einen Abzug ${format.label} (im Ausland ${format.inches}): Sie brauchen 1 Foto.`
              : `${perPhoto} Karten à ${cm} cm passen auf einen Abzug ${format.label} (im Ausland ${format.inches}): Sie brauchen ${count} Fotos.`,
        })}
      </p>
      <div className="rw-photos">
        {photos.map((photo, i) => (
          <figure key={photo.url} className="rw-photo">
            <img src={photo.url} alt={t({ de: `Foto ${i + 1} von ${photos.length}` })} style={{ aspectRatio: `${format.width} / ${format.height}` }} />
            <figcaption>
              <a className="rw-photo-button" href={photo.url} download={`${name}-${format.id}-${i + 1}.jpg`}>
                💾 {t({ de: "Speichern" })}
              </a>
              {canShare(photo.blob) && (
                <button type="button" className="rw-photo-button" onClick={() => share(photo.blob, `${name}-${format.id}-${i + 1}.jpg`)}>
                  📤 {t({ de: "Teilen" })}
                </button>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
      <PhotoGuide format={format} cm={cm} />
    </SettingsGroup>
  );
}

/** The steps from saved picture to card on the wall, each with a big picture of its own. */
function PhotoGuide({ format, cm }: { format: PhotoFormat; cm: string }) {
  const t = useT();
  const steps: { emoji: string; title: string; text: string }[] = [
    {
      emoji: "💾",
      title: t({ de: "Fotos speichern" }),
      text: t({
        de: "„Speichern“ legt jedes Foto als JPG ab. Auf dem Handy geht es mit „Teilen“ → „Bild sichern“ direkt in die Fotos – oder gleich in die App Ihres Fotodienstes.",
      }),
    },
    {
      emoji: "🛒",
      title: t({ de: "Wie Urlaubsfotos bestellen" }),
      text: t({
        de: `Format ${format.label} – das gibt es überall: am Fotoautomaten in der Drogerie (dm, Rossmann, Müller), im Fotogeschäft oder online (CEWE, Pixum …). Wählen Sie „matt“: Es spiegelt nicht und zeigt keine Fingerabdrücke. Fragt der Dienst nach dem Ausschnitt, nehmen Sie „ganzes Bild“ – der weiße Rand fängt ab, was trotzdem abgeschnitten wird.`,
      }),
    },
    {
      emoji: "✂️",
      title: t({ de: "Zuschneiden" }),
      text: t({
        de: `Entlang der grauen Linien, mit Schere oder Papierschneider – ein Schnitt trennt zwei Karten. Jede Karte ist dann ${cm} cm groß. Runden Sie die Ecken ab (Schere oder Eckenrunder): Spitze Ecken piksen.`,
      }),
    },
    {
      emoji: "🧷",
      title: t({ de: "Klett dran" }),
      text: t({
        de: "Selbstklebende Klettpunkte (20 mm) halten am besten: die weiche Seite hinten auf jede Karte, die harte Seite auf Tafel, Tür, Schrank oder ein Stück Filz. Fotopapier ist fest und abwischbar – Laminieren ist nicht nötig.",
      }),
    },
    {
      emoji: "👀",
      title: t({ de: "Sicher für Kleine" }),
      text: t({
        de: "Klettpunkte fest andrücken und einen Tag ruhen lassen, dann halten sie. Ab und zu nachsehen, ob einer lose ist: Kleine Teile gehören nicht in den Mund. Keine kleinen Magnete – unter drei Jahren können sie verschluckt werden.",
      }),
    },
  ];
  return (
    <details className="rw-photo-guide" open>
      <summary>📸 {t({ de: "Anleitung: vom Foto zur Klett-Tafel" })}</summary>
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
                {step.emoji === "🧷" && (
                  <>
                    {" "}
                    <a href={VELCRO_EXAMPLE} target="_blank" rel="noopener noreferrer">
                      {t({ de: "Zum Beispiel diese." })}
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
