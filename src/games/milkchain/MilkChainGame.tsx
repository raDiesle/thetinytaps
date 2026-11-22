import { type PointerEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { CHAPTER, ChapterBook, type StoryChapter, type StoryTranslation, withPictures } from "@/components/ChapterBook";
import { DevTag } from "@/components/DevTag";
import { GameShell } from "@/components/GameShell";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { byLanguage, type TextsLanguageId } from "@/content/texts";
import { NIGHT_MILK } from "@/games/nightmilk/nightMilk";
import { NIGHT_MILK_KIND, NIGHT_MILK_TITLE } from "@/games/nightmilk/names";
import { NIGHT_VOICE, nightPictureOf } from "@/games/nightmilk/story";
import { goBack } from "@/lib/goBack";
import { type Texts, useAppLanguage, useT } from "@/lib/language";
import { noPointerClick } from "@/lib/press";
import { playPageTurn, playRandomNote } from "@/lib/sfx";
import { stepIndexInAddress, useStepAddress } from "@/lib/stepAddress";
import { screenTap } from "@/lib/tapGuard";
import { type RecordedVoice, recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { MILK_CHAIN } from "./milkChain";
import { MILK_CHAIN_BOOK, MILK_CHAIN_KIND, MILK_CHAIN_TITLE } from "./names";

/** Each page's picture by its file name without extension (`kette-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** One story of the book „Abstillen“, a variant to pick on its first page. */
interface Story {
  /** Its address: the book's own, or one below it (`/abstillen/nachts/`), so a link or a video lands right on it. */
  href: string;
  /** Its trophy's level, for a story at an address below the book's own (`ChapterBook`'s `level`). */
  level?: string;
  /** What it is for, the line's name in the choice. */
  kind: Texts;
  /** The story's own title, small under it. */
  title: Texts;
  chapters: StoryChapter[];
  pictureOf: (id: string) => string | undefined;
  /** The page whose picture stands for the story in the choice. */
  cover: string;
  voice: RecordedVoice;
  translations?: Partial<Record<TextsLanguageId, StoryTranslation>>;
  first: "de" | "en";
  /** The letter of its dev tags. */
  code: string;
}

/**
 * The book's stories, the long one first: „Tapsis Milchkette“, weaning altogether in chapters along the guides' steps,
 * and „The Milk Sleeps at Night“ (src/games/nightmilk) for families who wean only at night.
 */
const STORIES: Story[] = [
  {
    href: "/abstillen/",
    kind: MILK_CHAIN_KIND,
    title: MILK_CHAIN_TITLE,
    chapters: MILK_CHAIN,
    pictureOf: (id) => PICTURES.get(`kette-${id}`),
    cover: "kette",
    // Tapsi's voice reading the pages, from `stimme/` (German) and `stimme/<language>/`; a page not recorded yet stays silent.
    voice: recordedVoice(voiceFiles),
    // The story in the other languages, filled as their texts load; German is in `milkChain.ts`.
    translations: byLanguage((texts) => texts.milkChain),
    first: "de",
    code: "K",
  },
  {
    href: "/abstillen/nachts/",
    level: "nachts",
    kind: NIGHT_MILK_KIND,
    title: NIGHT_MILK_TITLE,
    chapters: NIGHT_MILK,
    pictureOf: nightPictureOf,
    cover: "weiter",
    voice: NIGHT_VOICE,
    first: "en",
    code: "N",
  },
];

/** The story an address names: the one at that address, else the book's own long story. */
const storyAt = (pathname: string) => STORIES.find((s) => s.href === (pathname.endsWith("/") ? pathname : `${pathname}/`)) ?? STORIES[0];

/** A story's chapters as players read them, and where each begins in the story (its first page's place, from 0). */
function chaptersOf(story: Story) {
  const chapters = withPictures(story.chapters, story.pictureOf);
  const pages = chapters.flatMap((c) => c.pages);
  return { chapters, pages, starts: chapters.map((c) => pages.indexOf(c.pages[0])) };
}

/** The book's stories with their chapters as players read them, worked out once. */
const READ = new Map(STORIES.map((story) => [story, chaptersOf(story)]));

/** The browser tab's title on an address of the book: the story's there. */
export const titleAt = (pathname: string) => storyAt(pathname).title;

export function MilkChainGame() {
  const t = useT();
  const { pathname } = useLocation();
  return (
    <GameShell
      title={t(storyAt(pathname).title)}
      // One book with nothing to choose before it: it opens at once on its choice of stories, and ✕ goes back to the shelf.
      startMode="story"
    >
      <WeaningBook />
    </GameShell>
  );
}

/** The story open in the book, and the page it opened on; none while the choice of stories is shown. */
interface Open {
  story: Story;
  page: number;
  /** The address the choice was seen at, when opening the story went to another one: the way back steps back there. */
  from?: string;
}

/**
 * The book „Abstillen“ (user request, 22 November 2026: „ein Buch, darin kann man mehrere Varianten auswählen“): it
 * opens on a choice of its stories – the long one for weaning altogether and the short one for weaning only at night –
 * each a big line with its picture, what it is for and its title, and under it its chapters only as small numbers, a tap
 * on one opening that chapter, so a grown-up goes on where they stopped. A tap on the line starts the story at its first
 * page. Each story is read with the shared `ChapterBook`, whose way back to its contents leads here.
 *
 * The address names the story: the book's own for the long one, `/abstillen/nachts/` for the night one (a link or a
 * video lands there), and `?seite=` its page or „inhalt“ for this choice. A link to a page opens that page.
 */
function WeaningBook() {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const here = storyAt(pathname);
  const [open, setOpen] = useState<Open | undefined>(() => {
    // A link's page (`?seite=7`, also after a reload); else opened from the choice at the other address (`read`),
    // whether this page stayed or came anew.
    const linked = stepIndexInAddress(READ.get(here)?.pages.length ?? 0);
    const opened = state as { page?: unknown; from?: unknown } | null;
    const from = typeof opened?.from === "string" ? opened.from : undefined;
    if (linked !== undefined) return { story: here, page: linked, from };
    return typeof opened?.page === "number" ? { story: here, page: opened.page, from } : undefined;
  });
  const { effects, ripple } = useTapFeedback();

  // The browser's back button from a story at another address (the night story opened from the book's own): the
  // address names another story than the one open, so the choice comes back.
  useEffect(() => {
    if (open && open.story !== here) setOpen(undefined);
  }, [here]);

  /** Opens a story at a page; a story at another address goes there, in the history, so the phone's back comes back. */
  const read = (story: Story, page: number) => {
    if (!screenTap()) return;
    playPageTurn(0.6);
    const from = story === here ? undefined : here.href;
    setOpen({ story, page, from });
    if (from) navigate(story.href, { state: { page, from } });
  };

  /** Back to the choice: where the story was opened from another address, a step back to it. */
  const toChoice = () => {
    const from = open?.from;
    setOpen(undefined);
    if (from) goBack(navigate, from);
  };

  if (open) {
    const { story } = open;
    return (
      <ChapterBook
        key={story.href}
        chapters={story.chapters}
        voice={story.voice}
        title={story.title}
        pictureOf={story.pictureOf}
        translations={story.translations}
        code={story.code}
        first={story.first}
        level={story.level}
        opensAt={open.page}
        onContents={toChoice}
      />
    );
  }

  return (
    <Choice
      onRead={read}
      onMiss={(e) => {
        ripple(e.clientX, e.clientY);
        playRandomNote();
      }}
    >
      <FeedbackLayer effects={effects} />
    </Choice>
  );
}

/**
 * The book's first page: its name, then one line per story – its picture, what it is for, its title – and under it its
 * chapters as small numbers, nothing more (user request: „die Unterkapitel weglassen oder sehr minimal anzeigen“).
 */
function Choice({
  onRead,
  onMiss,
  children,
}: {
  /** Opens a story at a page (its place in the story, from 0). */
  onRead: (story: Story, page: number) => void;
  /** A tap beside the lines: ripples and a soft note. */
  onMiss: (e: PointerEvent) => void;
  /** The tap feedback's layer. */
  children: ReactNode;
}) {
  const t = useT();
  const { id: language } = useAppLanguage();
  // The address says this page is the choice („inhalt“, as every chapter book's contents).
  useStepAddress("inhalt");
  const chapterName = (n: number, name: string) => `${t(CHAPTER).replace("{n}", String(n))}: ${name}`;
  const lines = useMemo(
    () =>
      STORIES.map((story) => {
        const { chapters, starts } = READ.get(story) ?? chaptersOf(story);
        const translation = language === story.first ? undefined : story.translations?.[language as TextsLanguageId];
        return { story, chapters, starts, names: chapters.map((c) => translation?.chapters[c.id] ?? c.title) };
      }),
    [language],
  );
  return (
    <div className="cb-play cb-contents cb-stories" onPointerDown={onMiss}>
      <h2 className="cb-contents-title">{t(MILK_CHAIN_BOOK)}</h2>
      <ol className="cb-story-list">
        {lines.map(({ story, chapters, starts, names }) => (
          <li key={story.href} className="cb-story">
            <button
              type="button"
              className="cb-story-open"
              data-tap
              aria-label={`${t(story.kind)}: ${t(story.title)}`}
              onPointerDown={(e) => {
                e.stopPropagation();
                onRead(story, 0);
              }}
              // Enter, Space or a screen reader, which send no pointer.
              onClick={noPointerClick(() => onRead(story, 0))}
            >
              <span className="cb-story-picture" aria-hidden>
                {story.pictureOf(story.cover) && <img src={story.pictureOf(story.cover)} alt="" draggable={false} decoding="async" />}
              </span>
              <span className="cb-story-name">
                <span className="cb-story-kind">{t(story.kind)}</span>
                <span className="cb-story-title">{t(story.title)}</span>
              </span>
            </button>
            {/* Its chapters as small numbers only, the chapter's name read out and shown as a tooltip. */}
            <ol className="cb-story-chapters">
              {chapters.map((chapter, c) => (
                <li key={chapter.id}>
                  <button
                    type="button"
                    className="cb-story-chapter"
                    data-tap
                    title={chapterName(c + 1, names[c])}
                    aria-label={chapterName(c + 1, names[c])}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      onRead(story, starts[c]);
                    }}
                    onClick={noPointerClick(() => onRead(story, starts[c]))}
                  >
                    {c + 1}
                  </button>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
      <DevTag code="A0" id="inhalt" />
      {children}
    </div>
  );
}
