import { type CSSProperties, type PointerEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DevTag } from "@/components/DevTag";
import { GameEnd } from "@/components/GameEnd";
import { useInnerBack } from "@/components/GameShell";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import type { TextsLanguageId } from "@/content/texts";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { playPageTurn, playRandomNote } from "@/lib/sfx";
import "./chapterBook.css";

/** One page of a story book: its picture (found by `pictureOf(id)`) and the sentence a grown-up reads under it. */
export interface StoryPage {
  /** Unique in the story; the picture is found by it. */
  id: string;
  /** What is read aloud, German. */
  text: string;
}

/** One chapter of a story book: its own line in the table of contents. */
export interface StoryChapter {
  id: string;
  /** Its heading, German, plain words. */
  title: string;
  pages: StoryPage[];
}

/**
 * A story book in another language, kept in `<lang>.ts` beside its German data and loaded with that language's texts
 * (`src/content/texts/texts-<lang>.ts`), never imported by the game. A page or title it lacks shows in German.
 */
export interface StoryTranslation {
  /** Each chapter's title by chapter id. */
  chapters: Record<string, string>;
  /** Each page's sentence by page id. */
  pages: Record<string, string>;
}

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

/** The table of contents at the book's start, where no page of the story is open. */
const CONTENTS = -1;

const NEXT = { de: "Weiter", en: "Next", zh: "下一页", hi: "आगे", es: "Siguiente", ar: "التالي", ru: "Дальше" };
const BACK = { de: "Zurückblättern", en: "Page back", zh: "上一页", hi: "पिछला पन्ना", es: "Página anterior", ar: "الصفحة السابقة", ru: "Назад" };

/**
 * A story in chapters read with a grown-up, one page per tap („Tapsis Milchkette“, „Tapsi und die Schnullerfee“). The book opens on its table
 * of contents (user request, 9 November 2026: a story read over many days goes on where it stopped), one line per
 * chapter; a tap on one, or its number on the keyboard, opens it, and any other key starts at the beginning. On a page
 * the picture fills the room above, and under it what the grown-up reads, with the chapter's title over its first page.
 * Any tap or key turns on (← and Backspace back, ◀ bottom left, from the first page back to the contents); the corner
 * goes back to the contents (`useInnerBack`), and the last page ends with „Nochmal“, which opens the contents again. A
 * page whose picture isn't made yet shows a paper placeholder in its place.
 */
export function ChapterBook({
  chapters,
  title,
  pictureOf,
  translations,
  code = "K",
}: {
  /** The story, in reading order. */
  chapters: StoryChapter[];
  /** The story's name over its table of contents. */
  title: Localized;
  /** A page's picture by its id, or nothing while it isn't made yet (a paper placeholder stands there). */
  pictureOf: (id: string) => string | undefined;
  /** The story in the other languages (`byLanguage`), filled as their texts load. */
  translations?: Partial<Record<TextsLanguageId, StoryTranslation>>;
  /** The letter of its dev tags (`K0` for the contents, `K<chapter>-<page>`). */
  code?: string;
}) {
  const t = useT();
  const { id: language } = useAppLanguage();
  const translation = language === "de" ? undefined : translations?.[language];
  const { pages, where, starts } = useMemo(() => {
    const pages = chapters.flatMap((c) => c.pages);
    return {
      pages,
      /** Each page's chapter (its number from 1) and its place in it, for the heading and the dev tag. */
      where: chapters.flatMap((chapter, c) => chapter.pages.map((_, p) => ({ chapter, number: c + 1, first: p === 0, code: `${code}${c + 1}-${p + 1}` }))),
      /** Where each chapter begins in the story: its first page's place, from 0. */
      starts: chapters.map((chapter) => pages.indexOf(chapter.pages[0])),
    };
  }, [chapters, code]);
  const LAST = pages.length - 1;
  const [index, setIndex] = useState(CONTENTS);
  const indexRef = useRef(CONTENTS);
  const startedAt = useRef(0);
  const { effects, ripple } = useTapFeedback();

  const show = useCallback(
    (next: number) => {
      indexRef.current = next;
      startedAt.current = performance.now();
      setIndex(next);
      // The page after this one loads while this one is read.
      const after = next >= 0 && pages[next + 1] && pictureOf(pages[next + 1].id);
      if (after) new Image().src = after;
    },
    [pages, pictureOf],
  );

  useEffect(() => show(CONTENTS), [show]);

  /** Opens a chapter from the table of contents. */
  const open = (chapter: number) => {
    playPageTurn(0.6);
    show(starts[chapter]);
  };

  // While a page is open, the corner goes back to the table of contents; there it leaves the book as always.
  useInnerBack(index === CONTENTS ? undefined : () => show(CONTENTS));

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
    if (indexRef.current === CONTENTS) return;
    playPageTurn(0.6);
    show(indexRef.current - 1);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      if (indexRef.current === CONTENTS) {
        // 1–9 open their chapter, 0 the tenth; ← and Backspace have nothing before them; any other key starts at the beginning.
        const digit = /^[0-9]$/.test(e.key) ? (Number(e.key) || 10) - 1 : undefined;
        if (digit !== undefined && digit < chapters.length) open(digit);
        else if (digit !== undefined || e.key === "ArrowLeft" || e.key === "Backspace") {
          ripple();
          playRandomNote();
        } else open(0);
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "Backspace") back();
      else forward();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (index === CONTENTS) {
    return (
      <div
        className="cb-play cb-contents"
        onPointerDown={(e: PointerEvent) => {
          ripple(e.clientX, e.clientY);
          playRandomNote();
        }}
      >
        <h2 className="cb-contents-title">{t(title)}</h2>
        <ol className="cb-toc" style={{ "--cb-rows": Math.ceil(chapters.length / 2) } as CSSProperties}>
          {chapters.map((chapter, c) => {
            const title = translation?.chapters[chapter.id] ?? chapter.title;
            const picture = pictureOf(chapter.pages[0].id);
            return (
              <li key={chapter.id}>
                <button
                  type="button"
                  className="cb-toc-line"
                  data-tap
                  aria-label={`${t(CHAPTER).replace("{n}", String(c + 1))}: ${title}`}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    open(c);
                  }}
                >
                  <span className="cb-toc-picture" aria-hidden>
                    {picture && <img src={picture} alt="" draggable={false} decoding="async" />}
                  </span>
                  <span className="cb-toc-name">
                    <span className="cb-toc-chapter">{t(CHAPTER).replace("{n}", String(c + 1))}</span>
                    <span className="cb-toc-title">{title}</span>
                  </span>
                  <span className="cb-toc-dots" aria-hidden />
                  <span className="cb-toc-page" aria-hidden>
                    {starts[c] + 1}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <DevTag code={`${code}0`} id="inhalt" />
        <FeedbackLayer effects={effects} />
      </div>
    );
  }

  const page = pages[index];
  const here = where[index];
  const picture = pictureOf(page.id);
  const last = index === LAST;

  return (
    <div className="cb-play" onPointerDown={(e: PointerEvent) => forward(e.clientX, e.clientY)}>
      <div className="cb-picture-room">
        {picture ? (
          <img key={page.id} className="cb-picture" src={picture} alt="" draggable={false} />
        ) : (
          <div key={page.id} className="cb-picture cb-placeholder">
            <span>Bild folgt</span>
            <small>{page.id}</small>
          </div>
        )}
      </div>
      <div className="cb-words">
        <div className="cb-words-inner">
          {here.first && (
            <h2 className="cb-chapter">
              {t(CHAPTER).replace("{n}", String(here.number))}: {translation?.chapters[here.chapter.id] ?? here.chapter.title}
            </h2>
          )}
          <p className="cb-text">{translation?.pages[page.id] ?? page.text}</p>
        </div>
      </div>

      {!last && (
        <button
          type="button"
          className="cb-turn cb-back"
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
          className="cb-turn cb-next"
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
      {last && <GameEnd delayMs={600} onAgain={() => show(CONTENTS)} corners />}
      <DevTag code={here.code} id={page.id} />
      <FeedbackLayer effects={effects} />
    </div>
  );
}
