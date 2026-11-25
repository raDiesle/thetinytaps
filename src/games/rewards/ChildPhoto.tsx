import { type CSSProperties, useEffect, useState } from "react";
import { type Texts, useT } from "@/lib/language";
import { type ChartPhoto, frameRatio, type PhotoPlace, photoPlaceOf } from "./chartPhoto";
import { photoUrl } from "./photoStore";
import { SheetAction } from "./SheetAction";

/** „Foto des Kindes“: the photo's name, its window's heading and what a screen reader says of it. */
export const PHOTO_NAME: Texts = {
  en: "Photo of the child",
  de: "Foto des Kindes",
  zh: "孩子的照片",
  hi: "बच्चे की फ़ोटो",
  es: "Foto de su peque",
  ar: "صورة الطفل",
  ru: "Фото ребёнка",
};

/** „Das Foto bleibt auf diesem Gerät …“: said wherever a photo is chosen – the child's and a card's own (T-13). */
export const PHOTO_STAYS: Texts = {
  en: "The photo stays on this device and is never sent.",
  de: "Das Foto bleibt auf diesem Gerät und wird nie verschickt.",
  zh: "照片只保存在本设备上，绝不会发送出去。",
  hi: "फ़ोटो इसी डिवाइस पर रहती है और कभी भेजी नहीं जाती।",
  es: "La foto se queda en este dispositivo y nunca se envía.",
  ar: "تبقى الصورة على هذا الجهاز ولا تُرسَل أبدًا.",
  ru: "Фото остаётся на этом устройстве и никуда не отправляется.",
};

/** The names of the places, in the photo's window. */
export const PHOTO_PLACE_NAMES: Record<PhotoPlace, Texts> = {
  "top-left": { en: "Top left", de: "Oben links", zh: "左上角", hi: "ऊपर बाईं ओर", es: "Arriba a la izquierda", ar: "أعلى اليسار", ru: "Вверху слева" },
  "top-right": { en: "Top right", de: "Oben rechts", zh: "右上角", hi: "ऊपर दाईं ओर", es: "Arriba a la derecha", ar: "أعلى اليمين", ru: "Вверху справа" },
  title: {
    en: "Beside the heading",
    de: "Neben der Überschrift",
    zh: "标题旁边",
    hi: "शीर्षक के पास",
    es: "Junto al título",
    ar: "بجانب العنوان",
    ru: "Рядом с заголовком",
  },
};

/** The photo's object URL once read from the store; undefined while it is read, null where it is not on this device. */
export function usePhotoUrl(key: string | undefined): string | null | undefined {
  const [url, setUrl] = useState<{ key: string; url: string | null } | null>(null);
  useEffect(() => {
    if (!key) return;
    let on = true;
    photoUrl(key).then((found) => on && setUrl({ key, url: found ?? null }));
    return () => {
      on = false;
    };
  }, [key]);
  if (!key) return null;
  return url?.key === key ? url.url : undefined;
}

/**
 * The object URLs of several photos, by key, once read (T-13: the own photos of a plan's cards for its photo prints,
 * which a canvas draws from a URL); a key not (yet) read is missing.
 */
export function usePhotoUrls(keys: readonly string[]): ReadonlyMap<string, string> {
  const [urls, setUrls] = useState<ReadonlyMap<string, string>>(() => new Map());
  const wanted = [...new Set(keys)].sort().join(" ");
  useEffect(() => {
    let on = true;
    const list = wanted ? wanted.split(" ") : [];
    Promise.all(list.map(async (key) => [key, await photoUrl(key)] as const)).then(
      (found) => on && setUrls(new Map(found.flatMap(([key, url]) => (url ? [[key, url] as const] : [])))),
    );
    return () => {
      on = false;
    };
  }, [wanted]);
  return urls;
}

/** Whether a sheet's head lays out a photo in a corner: the photo is there (or still being read). */
export const photoInCorner = (photo: ChartPhoto | undefined): boolean => !!photo && photoPlaceOf(photo) !== "title";

/**
 * The head's class and sizes for its photo, the board's and the plan's alike: a photo in a corner makes the head as
 * tall as itself, so the cards below make room for it (never lie under it).
 */
export function photoHead(photo: ChartPhoto | undefined): { className: string; style?: CSSProperties } {
  if (!photo) return { className: "rw-head" };
  return {
    className: `rw-head rw-head-portrait rw-head-portrait-${photoPlaceOf(photo)}`,
    style: { "--rw-portrait-ratio": frameRatio(photo) } as CSSProperties,
  };
}

/**
 * The photo of the child on a sheet (user request, November 2026), the same on screen, on paper and while the chart is
 * made: a print with a white rim, a little askew, held by a strip of tape – still, no animation. While the chart is
 * made it carries the sheet's ⚙️ / 🗑️ (`SheetAction`), and a tap on it opens its window like ⚙️ (`data-edit="photo"`).
 * Without a photo, while the chart is made, a pale ＋ place beside the heading's sign keeps its place
 * (`data-edit="add-photo"`, which opens the file picker) – never on paper.
 */
export function ChildPhoto({ photo, editing }: { photo: ChartPhoto | undefined; editing: boolean }) {
  const t = useT();
  const url = usePhotoUrl(photo?.key);
  if (!photo || url === null) {
    if (!editing) return null;
    const add = t({
      en: "Add a photo of the child",
      de: "Foto des Kindes hinzufügen",
      zh: "添加孩子的照片",
      hi: "बच्चे की फ़ोटो जोड़ें",
      es: "Añadir una foto de su peque",
      ar: "أضيفوا صورة الطفل",
      ru: "Добавить фото ребёнка",
    });
    return (
      <span className="rw-portrait-add" data-edit="add-photo" role="button" tabIndex={0} title={add} aria-label={add}>
        <PortraitSign />
      </span>
    );
  }
  const place = photoPlaceOf(photo);
  return (
    <span
      className={`rw-portrait rw-portrait-${place}`}
      style={{ "--rw-portrait-ratio": frameRatio(photo) } as CSSProperties}
      data-edit={editing ? "photo" : undefined}
      role={editing ? "button" : undefined}
      tabIndex={editing ? 0 : undefined}
    >
      {editing && (
        <>
          <SheetAction
            act="configure"
            ask={t({ en: "Change photo", de: "Foto ändern", zh: "更改照片", hi: "फ़ोटो बदलें", es: "Cambiar la foto", ar: "تغيير الصورة", ru: "Изменить фото" })}
            data={{ "data-edit": "photo" }}
          />
          <SheetAction
            act="delete"
            ask={t({
              en: "Delete the photo?",
              de: "Foto löschen?",
              zh: "删除照片？",
              hi: "फ़ोटो मिटाएँ?",
              es: "¿Borrar la foto?",
              ar: "حذف الصورة؟",
              ru: "Удалить фото?",
            })}
            data={{ "data-edit": "delete-photo" }}
          />
        </>
      )}
      <span className="rw-portrait-print">{url && <img className="rw-portrait-img" src={url} alt={t(PHOTO_NAME)} draggable={false} />}</span>
      <span className="rw-portrait-tape" aria-hidden />
    </span>
  );
}

/** A small drawn portrait – head and shoulders in a frame with a ＋ – for the pale place where a photo can go. */
function PortraitSign() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <rect x="2.5" y="3.5" width="15" height="17" rx="1.6" />
      <circle cx="10" cy="10" r="3" />
      <path d="M4.8 19.6c.9-3.2 2.8-4.8 5.2-4.8s4.3 1.6 5.2 4.8" />
      <path className="rw-portrait-plus" d="M20 3v6M17 6h6" />
    </svg>
  );
}

/** A small sheet with the photo's place on it, for the place's choice in the photo's window. */
export function PhotoPlacePic({ place }: { place: PhotoPlace }) {
  // The sheet, its heading as a line and its cards as squares below; the photo a filled frame at its place.
  const photo = place === "top-left" ? { x: 5, y: 5, w: 11, h: 13 } : place === "top-right" ? { x: 32, y: 5, w: 11, h: 13 } : { x: 9, y: 6, w: 6, h: 7 };
  const title = place === "top-left" ? { x: 19, w: 18 } : place === "top-right" ? { x: 8, w: 18 } : { x: 17, w: 18 };
  const top = place === "title" ? 16 : 22;
  return (
    <svg className="rw-portrait-place-pic" viewBox="0 0 48 36" aria-hidden>
      <rect x="1" y="1" width="46" height="34" rx="3" fill="#fff" stroke="currentColor" strokeWidth="1.5" />
      <rect x={title.x} y={place === "title" ? 8.5 : 10} width={title.w} height="2.5" rx="1" fill="currentColor" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={6 + i * 9.5} y={top} width="7.5" height={33 - top - 3} rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
      ))}
      <rect x={photo.x} y={photo.y} width={photo.w} height={photo.h} rx="1" fill="#f6c453" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
