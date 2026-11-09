import { type PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { DevTag } from "@/components/DevTag";
import { GameEnd } from "@/components/GameEnd";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { byLanguage } from "@/content/texts";
import { useAppLanguage, useT } from "@/lib/language";
import { playPageTurn, playRandomNote } from "@/lib/sfx";
import pictureFiles from "./bilder/*.webp?glob";
import { MILK_CHAIN, MILK_CHAIN_PAGES } from "./milkChain";

/** Each page's picture by its file name without extension (`kette-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));
const pictureOf = (id: string) => PICTURES.get(`kette-${id}`);

/** The story in the other languages, filled as their texts load; German is in `milkChain.ts`. */
const TRANSLATIONS = byLanguage((texts) => texts.milkChain);

/** „Kapitel 4“ in each language, before the chapter's title. */
const CHAPTER = {
  de: "Kapitel {n}",
  en: "Chapter {n}",
  zh: "第{n}章",
  hi: "अध्याय {n}",
  es: "Capítulo {n}",
  ar: "الفصل {n}",
  ru: "Глава {n}",
};

/** Taps this soon after a page began only ripple, so a double tap doesn't skip a page. */
const TAP_GUARD_MS = 450;
const LAST = MILK_CHAIN_PAGES.length - 1;

/** Each page's chapter (its number from 1) and its place in it, for the heading and the dev tag. */
const WHERE = MILK_CHAIN.flatMap((chapter, c) => chapter.pages.map((_, p) => ({ chapter, number: c + 1, first: p === 0, code: `K${c + 1}-${p + 1}` })));

const NEXT = { de: "Weiter", en: "Next", zh: "下一页", hi: "आगे", es: "Siguiente", ar: "التالي", ru: "Дальше" };
const BACK = { de: "Zurückblättern", en: "Page back", zh: "上一页", hi: "पिछला पन्ना", es: "Página anterior", ar: "الصفحة السابقة", ru: "Назад" };

/**
 * „Tapsis Milchkette“: the chaptered weaning story read with a grown-up, one page per tap. The picture fills the room
 * above, and under it what the grown-up reads, with the chapter's title over its first page. Any tap or key turns on (←
 * and Backspace back, ◀ bottom left); the last page ends with „Nochmal“. A page whose picture isn't made yet shows a
 * paper placeholder in its place.
 */
export function MilkChainPlay() {
  const t = useT();
  const { id: language } = useAppLanguage();
  const translation = language === "de" ? undefined : TRANSLATIONS[language];
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const startedAt = useRef(0);
  const { effects, ripple } = useTapFeedback();

  const show = useCallback((next: number) => {
    indexRef.current = next;
    startedAt.current = performance.now();
    setIndex(next);
    // The page after this one loads while this one is read.
    const after = MILK_CHAIN_PAGES[next + 1] && pictureOf(MILK_CHAIN_PAGES[next + 1].id);
    if (after) new Image().src = after;
  }, []);

  useEffect(() => show(0), [show]);

  /** The next page, or ripples and a soft note where it comes too soon, and on the last page. */
  const forward = (x?: number, y?: number) => {
    const now = indexRef.current;
    if (now >= LAST || performance.now() - startedAt.current < TAP_GUARD_MS) {
      ripple(x, y);
      playRandomNote();
      return;
    }
    playPageTurn(0.6);
    show(now + 1);
  };

  const back = () => {
    if (indexRef.current === 0) return;
    playPageTurn(0.6);
    show(indexRef.current - 1);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      if (e.key === "ArrowLeft" || e.key === "Backspace") back();
      else forward();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const page = MILK_CHAIN_PAGES[index];
  const where = WHERE[index];
  const picture = pictureOf(page.id);
  const last = index === LAST;

  return (
    <div className="mk-play" onPointerDown={(e: PointerEvent) => forward(e.clientX, e.clientY)}>
      <div className="mk-picture-room">
        {picture ? (
          <img key={page.id} className="mk-picture" src={picture} alt="" draggable={false} />
        ) : (
          <div key={page.id} className="mk-picture mk-placeholder">
            <span>Bild folgt</span>
            <small>kette-{page.id}</small>
          </div>
        )}
      </div>
      <div className="mk-words">
        {where.first && (
          <h2 className="mk-chapter">
            {t(CHAPTER).replace("{n}", String(where.number))}: {translation?.chapters[where.chapter.id] ?? where.chapter.title}
          </h2>
        )}
        <p className="mk-text">{translation?.pages[page.id] ?? page.text}</p>
      </div>

      {index > 0 && !last && (
        <button
          type="button"
          className="mk-turn mk-back"
          data-tap
          aria-label={t(BACK)}
          onPointerDown={(e) => {
            e.stopPropagation();
            back();
          }}
        >
          ◀
        </button>
      )}
      {!last && (
        <button
          type="button"
          className="mk-turn mk-next"
          data-tap
          aria-label={t(NEXT)}
          onPointerDown={(e) => {
            e.stopPropagation();
            forward();
          }}
        >
          ▶
        </button>
      )}
      {/* One story, so only „Nochmal“; small in the corners, so the last picture stays free. */}
      {last && <GameEnd delayMs={600} onAgain={() => show(0)} corners />}
      <DevTag code={where.code} id={page.id} />
      <FeedbackLayer effects={effects} />
    </div>
  );
}
