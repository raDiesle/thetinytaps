import { type PointerEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DevTag } from "@/components/DevTag";
import { GameEnd } from "@/components/GameEnd";
import { useInnerBack } from "@/components/GameShell";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { VoiceSwitch } from "@/components/VoiceSwitch";
import type { TextsLanguageId } from "@/content/texts";
import { PROD } from "@/lib/buildInfo";
import { useAppLanguage, useT } from "@/lib/language";
import { noPointerClick } from "@/lib/press";
import { playPageTurn, playRandomNote } from "@/lib/sfx";
import { useStepAddress } from "@/lib/stepAddress";
import { useStoredSettings } from "@/lib/storage";
import { screenChanged, screenTap } from "@/lib/tapGuard";
import { hush, type RecordedVoice, type VoiceLine } from "@/lib/voice";
import "./chapterBook.css";

/** One page of a story book: its picture (found by `pictureOf(id)`) and the sentence a grown-up reads under it. */
export interface StoryPage {
  /** Unique in the story; the picture is found by it. */
  id: string;
  /** What is read aloud, in the book's first language (`first`: German, or English for what is new). */
  text: string;
}

/** One chapter of a story book: its title stands over its first page. */
export interface StoryChapter {
  id: string;
  /** Its heading, in the book's first language, plain words. */
  title: string;
  pages: StoryPage[];
}

/**
 * A story book in another language, kept in `<lang>.ts` beside its first language's data and loaded with that language's
 * texts (`src/content/texts/texts-<lang>.ts`), never imported by the game. A page or title it lacks shows in the book's
 * first language.
 */
export interface StoryTranslation {
  /** Each chapter's title by chapter id. */
  chapters: Record<string, string>;
  /** Each page's sentence by page id. */
  pages: Record<string, string>;
}

/** „Kapitel 4“ in each language, before the chapter's title. */
export const CHAPTER = {
  de: "Kapitel {n}",
  en: "Chapter {n}",
  zh: "第{n}章",
  hi: "अध्याय {n}",
  es: "Capítulo {n}",
  ar: "الفصل {n}",
  ru: "Глава {n}",
};

/**
 * Whether the chapter books read their pages aloud, one switch for all of them (`VoiceSwitch`): a grown-up who tells
 * the stories in their own words wants every book silent, not only the one where they found the loudspeaker.
 */
const VOICE_KEY = "tinytaps.chapterBook.v1";

const NEXT = { de: "Weiter", en: "Next", zh: "下一页", hi: "आगे", es: "Siguiente", ar: "التالي", ru: "Дальше" };
const BACK = { de: "Zurückblättern", en: "Page back", zh: "上一页", hi: "पिछला पन्ना", es: "Página anterior", ar: "الصفحة السابقة", ru: "Назад" };

/**
 * A story in chapters read with a grown-up, one page per tap („Tapsis Milchkette“, „Tapsi und die Schnullerfee“). It is
 * opened from its book's choice of stories (`StoryChoice.tsx`) and always starts on its first page – the chapters are no
 * longer listed to start from (user request, 23 November 2026: „zeige nicht mehr die einzelnen Kapitel an, jeder fängt
 * diese immer von Anfang an“); only a link to one of its pages opens it there. On a page the picture fills the room
 * above, and under it what the grown-up reads, with the chapter's title over its first page. Any tap or key turns on
 * (← and Backspace back, ◀ bottom left, from the first page back to the choice); the corner goes back to the choice
 * (`useInnerBack`), and the last page ends with „Nochmal“, which opens the choice again. A page whose picture isn't
 * made yet is left out in the built site, so no player sees an empty picture (`withPictures`); the dev server shows a
 * paper placeholder in its place, so it can be looked at.
 *
 * With `voice`, Tapsi's voice reads each page's sentence as it comes (user decision, November 2026), from the book's
 * recordings in the app language – a page without one stays silent, never German in another language. The loudspeaker
 * in the bottom right corner, above ▶, switches it off for grown-ups who read themselves (`VoiceSwitch`). Only the
 * page on screen and the next one are loaded, nothing while it is off.
 */
export function ChapterBook({
  chapters: written,
  pictureOf,
  translations,
  code = "K",
  voice,
  first = "de",
  level,
  opensAt,
  onContents,
}: {
  /** The story, in reading order. */
  chapters: StoryChapter[];
  /** A page's picture by its id, or nothing while it isn't made yet (left out for players, a placeholder in the dev server). */
  pictureOf: (id: string) => string | undefined;
  /** The story in the other languages (`byLanguage`), filled as their texts load. */
  translations?: Partial<Record<TextsLanguageId, StoryTranslation>>;
  /** The letter of its dev tags (`K<chapter>-<page>`). */
  code?: string;
  /** The book's recorded voice (its `stimme/` folder), reading each page aloud; without it the book is silent. */
  voice?: RecordedVoice;
  /**
   * The language its chapters are written in: German for the books written before November 2026, English for what is
   * new (root CLAUDE.md). A page shown in it is read with its recording in that language, so an English page in a German
   * app plays the English one (`recordingUrl`), never a German voice reading English.
   */
  first?: "de" | "en";
  /**
   * The trophy's level, for a story standing at an address below another story of the same game
   * („/abstillen/nachts/“ in the game „/abstillen/“): without it both would give the game's one trophy.
   */
  level?: string;
  /** The page to open on (its place in the story, from 0): the first, or the one a link names. */
  opensAt: number;
  /** Back to the book's choice of stories (`StoryChoice.tsx`): the corner, ◀ on the first page and „Nochmal“. */
  onContents: () => void;
}) {
  const t = useT();
  const { id: language } = useAppLanguage();
  const translation = language === first ? undefined : translations?.[language as TextsLanguageId];
  const chapters = useMemo(() => withPictures(written, pictureOf), [written, pictureOf]);
  const { pages, where } = useMemo(
    () => ({
      pages: chapters.flatMap((c) => c.pages),
      /** Each page's chapter (its number from 1) and its place in it, for the heading and the dev tag. */
      where: chapters.flatMap((chapter, c) => chapter.pages.map((_, p) => ({ chapter, number: c + 1, first: p === 0, code: `${code}${c + 1}-${p + 1}` }))),
    }),
    [chapters, code],
  );
  const LAST = pages.length - 1;
  const [opened] = useState(() => Math.min(Math.max(0, opensAt), LAST));
  const [index, setIndex] = useState(opened);
  const indexRef = useRef(opened);
  // The page on screen is in the address: its number in the whole story, from 1 (stepAddress.ts).
  useStepAddress(index + 1);
  const { effects, ripple } = useTapFeedback();

  const [stored, store] = useStoredSettings(VOICE_KEY, { voice: true });
  const reading = voice !== undefined && stored.voice;
  const sentenceOf = useCallback((page: StoryPage) => translation?.pages[page.id] ?? page.text, [translation]);
  /** The language a page's sentence is shown in: the app's where it is translated, else the book's first. */
  const languageOf = useCallback((page: StoryPage) => (translation?.pages[page.id] !== undefined ? language : first), [translation, language, first]);
  const said = sentenceOf(pages[index]);
  // German books keep their old way: a German page in another language has no recording there and stays silent.
  const saidIn = first === "de" ? language : languageOf(pages[index]);
  /** A page's line for the voice: an English-first book's translated page carries its English, whose recording stands in. */
  const lineOf = useCallback(
    (page: StoryPage): VoiceLine =>
      first === "en" && translation?.pages[page.id] !== undefined ? { text: sentenceOf(page), english: page.text } : sentenceOf(page),
    [first, translation, sentenceOf],
  );
  // What comes next: the next page.
  const ahead = index < LAST ? [lineOf(pages[index + 1])] : [];
  const aheadKey = JSON.stringify(ahead);
  const line = lineOf(pages[index]);
  const english = typeof line === "object" ? line.english : undefined;
  useEffect(() => {
    if (!voice || !reading) return;
    voice.say(said, saidIn, { english });
    voice.load(JSON.parse(aheadKey), saidIn);
    // A page turned, the book closed or the voice switched off: what was being read stops.
    return hush;
  }, [voice, reading, said, saidIn, english, aheadKey]);

  const show = useCallback(
    (next: number) => {
      indexRef.current = next;
      // Taps right after a page came only ripple, so a double tap doesn't skip a page (`screenTap`).
      screenChanged();
      setIndex(next);
      // The page after this one loads while this one is read.
      const after = pages[next + 1] && pictureOf(pages[next + 1].id);
      if (after) new Image().src = after;
    },
    [pages, pictureOf],
  );

  useEffect(() => show(opened), [show]);

  // While a page is open, the corner goes back to the book's choice of stories; there it leaves the book as always.
  useInnerBack(onContents);

  /** The next page, or ripples and a soft note where it comes too soon, and on the last page. */
  const forward = (x?: number, y?: number) => {
    const now = indexRef.current;
    if (now >= LAST || !screenTap()) {
      ripple(x, y);
      playRandomNote();
      return;
    }
    playPageTurn(0.6);
    show(now + 1);
  };

  const back = () => {
    if (!screenTap()) return ripple();
    playPageTurn(0.6);
    if (indexRef.current === 0) onContents();
    else show(indexRef.current - 1);
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
          <p className="cb-text" lang={languageOf(page) === language ? undefined : languageOf(page)}>
            {sentenceOf(page)}
          </p>
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
          onClick={noPointerClick(back)}
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
          onClick={noPointerClick(() => forward())}
        >
          ▶
        </button>
      )}
      {voice && (
        <div className="cb-voice" onPointerDown={(e) => e.stopPropagation()}>
          <VoiceSwitch on={stored.voice} onToggle={() => store({ voice: !stored.voice })} />
        </div>
      )}
      {/* One story, so only „Nochmal“; small in the corners, so the last picture stays free. */}
      {last && <GameEnd delayMs={600} onAgain={onContents} corners level={level} />}
      <DevTag code={here.code} id={page.id} />
      <FeedbackLayer effects={effects} />
    </div>
  );
}

/**
 * The chapters as players read them: in the built site a page whose picture isn't made yet is left out, and a chapter
 * left without pages with it, so a story waiting for pictures never shows an empty one (user request, November 2026);
 * with `all` (the dev server) every page stays and the missing ones show their placeholder.
 */
export function withPictures(chapters: StoryChapter[], pictureOf: (id: string) => string | undefined, all = !PROD): StoryChapter[] {
  if (all) return chapters;
  return chapters.map((chapter) => ({ ...chapter, pages: chapter.pages.filter((page) => pictureOf(page.id)) })).filter((chapter) => chapter.pages.length > 0);
}
