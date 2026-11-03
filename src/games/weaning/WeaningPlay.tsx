import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { GameEnd } from "@/components/GameEnd";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { spokenIn, useAppLanguage, useT } from "@/lib/language";
import {
  loadRecordings,
  playBoing,
  playChime,
  playGlug,
  playHeartbeat,
  playLullaby,
  playMelody,
  playMunch,
  playMusicbox,
  playPageTurn,
  playPop,
  playRandomNote,
  playSniff,
  playTwinkle,
  playWhoosh,
  playYawn,
  recorded,
} from "@/lib/sfx";
import { hush, recordedVoice } from "@/lib/voice";
import { STEPS, type StepId } from "./content";
import { Scene } from "./scene";
import voiceFiles from "./stimme/**/*.mp3?glob";

const voice = recordedVoice(voiceFiles);
const munch = recorded("munch", playMunch);
const cheer = recorded("cheer", playMelody);
const musicbox = recorded("musicbox", playMusicbox);
const partyHorn = recorded("partyhorn", playPop);

/** Taps this soon after a step began only ripple, so a double tap doesn't skip a page. */
const TAP_GUARD_MS = 500;
const LAST = STEPS.length - 1;

/** Each step's sounds, ms after it begins: in time with its little animation (`weaning.css`). */
const SOUNDS: Record<StepId, [number, () => void][]> = {
  baby: [[200, musicbox]],
  grow: [
    [0, playBoing],
    [500, playBoing],
    [1000, playBoing],
  ],
  eat: [
    [150, munch],
    [1000, munch],
  ],
  cup: [
    [250, playGlug],
    [1150, playGlug],
  ],
  tell: [[300, playChime]],
  goodbye: [
    [0, playTwinkle],
    [500, playWhoosh],
  ],
  evening: [[100, playYawn]],
  sad: [
    [200, playSniff],
    [1300, playSniff],
  ],
  cuddle: [
    [0, playHeartbeat],
    [1500, playHeartbeat],
  ],
  book: [[100, () => playPageTurn()]],
  bed: [[200, playLullaby]],
  sleep: [[300, playTwinkle]],
  morning: [
    [0, cheer],
    [300, partyHorn],
  ],
};

/**
 * „Abstillen“ (H-44): the story of Tapsi saying goodbye to Mama's milk, one page per tap. It plays at once; any tap on
 * the picture or key turns to the next page (← and Backspace back), and the last page ends with „Menü“ and „Nochmal“
 * small in the corners. Each page says its sentence (once recorded) and prints it small for the grown-up reading along.
 */
export function WeaningPlay() {
  const language = useAppLanguage();
  const t = useT();
  const [index, setIndex] = useState(0);
  /** The page before stays under the new one while it fades in, so the room never flickers. */
  const [before, setBefore] = useState<number | null>(null);
  /** Nobody has tapped yet: „Weiter“ calls for attention and a still hand points at it. */
  const [fresh, setFresh] = useState(true);
  /** Counts every page begun, so the page's layer and its animations start again, also on the same page. */
  const [beat, setBeat] = useState(0);
  const { effects, ripple, celebrate } = useTapFeedback();

  // Refs as well as state: a quick second tap can come before React has rendered the first.
  const indexRef = useRef(0);
  const startedAt = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const stopTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
  }, []);
  const later = useCallback((ms: number, run: () => void) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      run();
    }, ms);
    timers.current.add(timer);
  }, []);

  const step = STEPS[index];
  // The lullaby is the music of the bedtime page.
  useNoBackgroundMusic(step.id === "bed");

  /** Shows page `next`: its picture fades in over the one before, its sounds play and its sentence is said. */
  const begin = useCallback(
    (next: number) => {
      stopTimers();
      setBefore(indexRef.current === next ? null : indexRef.current);
      indexRef.current = next;
      startedAt.current = performance.now();
      setIndex(next);
      setBeat((b) => b + 1);
      const here = STEPS[next];
      for (const [ms, play] of SOUNDS[here.id]) later(ms, play);
      const { text } = spokenIn(here.line, language);
      voice.say(text, language.id);
      if (here.id === "morning") later(200, () => celebrate());
    },
    [language, later, celebrate, stopTimers],
  );

  // The book on the shelf opens the story at once: its tap is the act that starts the first page's sound.
  useEffect(() => {
    loadRecordings(["munch", "cheer", "musicbox", "partyhorn"]);
    voice.loadAll(language.id);
    begin(0);
    return () => {
      stopTimers();
      hush();
    };
  }, [begin, language.id, stopTimers]);

  /** The next page, or ripples where it would come too soon after the last tap and on the last page. */
  const act = (x?: number, y?: number) => {
    setFresh(false);
    const now = indexRef.current;
    if (now >= LAST || performance.now() - startedAt.current < TAP_GUARD_MS) {
      ripple(x, y);
      playRandomNote();
      return;
    }
    playPop();
    begin(now + 1);
  };

  /** One page back, for the grown-up reading along. */
  const back = () => {
    setFresh(false);
    if (indexRef.current > 0) begin(indexRef.current - 1);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      if (e.key === "ArrowLeft" || e.key === "Backspace") back();
      else act();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const restart = () => {
    setFresh(false);
    begin(0);
  };

  const last = index === LAST;

  return (
    <div className={`weaning-play wn-at-${step.id}`} onPointerDown={(e: PointerEvent) => act(e.clientX, e.clientY)}>
      {before !== null && (
        // Its animations jump to their end at once (wn-still): the page just left must not play them again below.
        <div key={`before-${beat}`} className="wn-layer wn-still">
          <Scene step={STEPS[before].id} sky={STEPS[before].sky} />
        </div>
      )}
      <div key={beat} className="wn-layer wn-layer-new" onAnimationEnd={(e) => e.target === e.currentTarget && setBefore(null)}>
        <Scene step={step.id} sky={step.sky} />
        {step.id === "baby" && <div className="wn-memory-edge" />}
      </div>

      {/* The page's sentence, small, for the grown-up who reads it to the child (the child only needs the picture). */}
      <p key={`line-${index}`} className="wn-line">
        {t(step.line)}
      </p>

      {!last && (
        <>
          {index > 0 && (
            <button
              type="button"
              className="wn-back"
              aria-label={t({
                de: "Zurückblättern",
                en: "Page back",
                zh: "上一页",
                hi: "पिछला पन्ना",
                es: "Página anterior",
                ar: "الصفحة السابقة",
                ru: "Назад",
              })}
              title={t({ de: "Zurückblättern", en: "Page back", zh: "上一页", hi: "पिछला पन्ना", es: "Página anterior", ar: "الصفحة السابقة", ru: "Назад" })}
              onPointerDown={(e) => {
                e.stopPropagation();
                back();
              }}
            >
              ◀
            </button>
          )}
          <button
            type="button"
            className={`wn-next${fresh ? " nudge" : ""}`}
            data-tap
            aria-label={t({ de: "Weiter", en: "Next", zh: "下一页", hi: "आगे", es: "Siguiente", ar: "التالي", ru: "Дальше" })}
            onPointerDown={(e) => {
              e.stopPropagation();
              act();
            }}
          >
            ▶
          </button>
          {fresh && (
            <span className="wn-hand" aria-hidden>
              👉
            </span>
          )}
        </>
      )}

      {/* One story only, so „Weiter“ would be „Nochmal“ again; small in the corners, so the happy morning stays free. */}
      {last && <GameEnd delayMs={step.ms} onAgain={restart} corners />}
      <FeedbackLayer effects={effects} />
    </div>
  );
}
