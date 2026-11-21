import { type CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { ControlIcon } from "@/components/ControlIcon";
import { GameEnd } from "@/components/GameEnd";
import { GO_ON, PAUSE, SPACE_OR_TAP_TO_GO_ON, TAP_TO_GO_ON } from "@/lib/sharedTexts";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { useCommonSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { type Localized, useAppLanguage, useT, type Spoken, spokenIn } from "@/lib/language";
import { loadRecordings, playChime, playCountNote, playDrumRoll, playPoof, playRecorded, playSqueak, playTusch } from "@/lib/sfx";
import { pageMoving, usePageStill } from "@/lib/pageMotion";
import { finishRoutineStep } from "@/lib/routine";
import { useTimers } from "@/lib/timers";
import { hush, recordedVoice } from "@/lib/voice";
import { useWakeLock } from "@/lib/wakeLock";
import { daytimeOf } from "@/lib/days";
import { addBrushing, daytimeText, loadWeek, saveWeek, type WeekLog } from "./daytime";
import { lerpView, type ToothId, type View } from "./jaw";
import { Mouth, type MonsterSpot, type MouthAction } from "./mouth";
import { SUNG_LANGUAGES, sungSteps, useBrushingMusic, useSongLoad } from "./music";
import type { Cue } from "./cues";
import { DONE_SAY, type Prelude, PRELUDE_TEXTS, TIDY_SAY } from "./lines";
import { Origin, ORIGIN_CUES, ORIGIN_MS, ORIGIN_RECORDINGS } from "./origin";
import { Scenes, type SceneKind } from "./scenes";
import { Prep, PREP_CUES, PREP_MS, PREP_RECORDINGS, TIDY_RECORDINGS } from "./prep";
import type { TeethSettings } from "./settings";
import { GRIN_VIEW, STEPS, stepText } from "./steps";
import { sungLanguageFor } from "./sung";
import { teethSymbol } from "./symbols";
import { Week } from "./week";
import voiceFiles from "./stimme/**/*.mp3?glob";
import "./teeth.css";
import { useStepAddress } from "@/lib/stepAddress";

/** The recorded voice of the prelude and the end (`bun run voice make`, src/content/recordedLines.ts). */
const voice = recordedVoice(voiceFiles);

const MONSTER_COLORS = ["#8bd346", "#b388ff", "#ff9f43", "#ff7bd0", "#4cc9f0"];
const MONSTER_VARIANTS = 3;
const TICK_MS = 200;
/** Before brushing the clock ticks faster, so the sounds of the story and the sink fall on their pictures. */
const PRELUDE_TICK_MS = 80;
/** A jump of the clock longer than this plays none of the sounds it skipped. */
const CUE_GAP_MS = 600;
const TICKLE_MS = 700;
const TURN_MS = 1600;
/** Opening or closing the mouth glides slower, so the child can do it along with the picture. */
const MOUTH_MS = 2100;
/** How long the arrows on the lips show after the mouth has to open or close. */
const ACTION_MS = 3500;
/** Dragging on the progress bar stops this far before the end. */
const SEEK_END_MS = 1000;
/** The last seconds before the brushing are counted down big, with a drum roll. */
const COUNTDOWN = 3;
/** How long „Los!“ shows when the brushing begins. */
const GO_MS = 1300;
/** After the brushing: two bars of cheering at the clean grin, then the brush is rinsed and put away, then the buttons. */
const CHEER_MS = 4290;
const ENDING_MS = CHEER_MS + PREP_MS.tidy;

/** The parts of the end: cheering at the clean teeth, tidying the brush away, and resting with the week chart and the buttons. */
type Ending = "cheer" | "tidy" | "rest";

/** How the monsters grow depends on the time of day (over the day or the night), see DAYTIME. `sounds` play at their moment of the part; titles and lines are in lines.ts. */
export const PRELUDE: Record<Prelude, { ms: number; title: Localized; cue?: Localized; sounds?: Cue[] }> = {
  sweets: { ...PRELUDE_TEXTS.sweets, ms: ORIGIN_MS.sweets, sounds: ORIGIN_CUES },
  grow: { ...PRELUDE_TEXTS.grow, ms: ORIGIN_MS.grow },
  brush: { ...PRELUDE_TEXTS.brush, ms: PREP_MS.brush, sounds: PREP_CUES.brush },
  paste: { ...PRELUDE_TEXTS.paste, ms: PREP_MS.paste, sounds: PREP_CUES.paste },
  monsters: { ...PRELUDE_TEXTS.monsters, ms: 4500 },
};

interface Monster {
  id: number;
  tooth: ToothId;
  /** Where along the tooth, see MonsterSpot. */
  spot: number;
  color: string;
  variant: number;
  step: number;
  /** 0 goes first in its step. */
  order: number;
}

const randomIndex = (count: number) => Math.floor(Math.random() * count);

/** A monster on every tooth of every step, two on a molar's chewing surface, in the order the brush visits them. */
function placeMonsters(): Monster[] {
  return STEPS.flatMap((step, s) =>
    step.teeth
      .flatMap((tooth) => (step.surface === "top" ? [1, 3] : [2]).map((spot) => ({ tooth, spot })))
      .map(({ tooth, spot }, order) => ({
        id: s * 100 + order,
        tooth,
        spot,
        color: MONSTER_COLORS[randomIndex(MONSTER_COLORS.length)],
        variant: randomIndex(MONSTER_VARIANTS),
        step: s,
        order,
      })),
  );
}

const formatTime = (ms: number) => {
  const seconds = Math.ceil(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);

/** Glides from one view to the next, so the child sees the head turn and the mouth open; `gliding` while it does, `k` how far (eased). */
function useGlidingView(target: View, ms: number): { view: View; gliding: boolean; k: number } {
  const [glide, setGlide] = useState({ view: target, k: 1, to: target });
  const current = useRef(target);
  useEffect(() => {
    const from = current.current;
    const start = performance.now();
    let frame = 0;
    const step = (t: number) => {
      const k = ms <= 0 ? 1 : Math.min(1, (t - start) / ms);
      current.current = k >= 1 ? target : lerpView(from, target, ease(k));
      setGlide({ view: current.current, k: ease(k), to: target });
      if (k < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    // Background tabs barely get animation frames; make sure the view still arrives.
    const arrive = setTimeout(() => step(start + ms), ms + 100);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(arrive);
    };
  }, [target, ms]);
  const gliding = glide.view !== target;
  // Right after the target changed, the last frame still belongs to the glide before: this one has not begun yet.
  return { view: glide.view, gliding, k: !gliding ? 1 : glide.to === target ? glide.k : 0 };
}

/** Elapsed time that can be paused and jumped around in. */
interface Clock {
  banked: number;
  /** When it was last started; null while paused. */
  since: number | null;
  /** While the song is still loading, the clock stands still here (just before the countdown) until it is there. */
  until?: number;
}

const readClock = (clock: Clock, now: number) => Math.min(clock.banked + (clock.since === null ? 0 : now - clock.since), clock.until ?? Infinity);

/** The prelude parts the settings ask for. */
const preludeOf = ({ origin, prep }: TeethSettings): Prelude[] => [
  ...(origin ? (["sweets", "grow"] as const) : []),
  ...(prep ? (["brush", "paste"] as const) : []),
  "monsters",
];

/** How long the prelude lasts, in ms. */
const introOf = (prelude: Prelude[]) => prelude.reduce((sum, p) => sum + PRELUDE[p].ms, 0);

/** Where the clock waits while the song is still loading: just before the countdown, so the brushing never starts without its song. */
const waitAt = (prelude: Prelude[]) => introOf(prelude) - COUNTDOWN * 1000 - 1;

/** When a prelude part begins, in ms after the start. */
const preludeStart = (prelude: Prelude[], p: Prelude) => prelude.slice(0, prelude.indexOf(p)).reduce((sum, q) => sum + PRELUDE[q].ms, 0);

/** The prelude part running `elapsed` ms after the start. */
function preludeAt(prelude: Prelude[], elapsed: number): Prelude {
  let end = 0;
  for (const p of prelude) {
    end += PRELUDE[p].ms;
    if (elapsed < end) return p;
  }
  return prelude[prelude.length - 1];
}

/**
 * A brushing timer that needs no tapping: first a short story of how sweets
 * become sugar monsters, fetching the brush and putting toothpaste on, then the mirror shows where to brush next
 * (chewing surfaces, outside, inside), and the sugar monsters there vanish
 * one by one. Arrow keys skip ahead or back, Space or the pause button pauses,
 * and tapping the progress bar jumps there.
 */
export function TeethPlay({ settings }: { settings: TeethSettings }) {
  // Everything shown and said follows the app language; a line without a translation is said in German with the German voice (spoken.ts).
  const language = useAppLanguage();
  const t = useT();
  // The song began loading in the menu; the story plays meanwhile, and the brushing waits for it (`until`).
  const song = useSongLoad(sungLanguageFor(language.id, SUNG_LANGUAGES));
  // The book opens (or its page turns) onto the brushing: the clock – the story, its sounds and words – starts only once
  // the page lies still (pageMotion.ts), so it stands at its start meanwhile, not paused.
  const still = usePageStill();
  const [held, setHeld] = useState(!still);
  const [clock, setClock] = useState<Clock>(() => ({
    banked: 0,
    since: still ? performance.now() : null,
    until: song.ready ? undefined : waitAt(preludeOf(settings)),
  }));
  const [now, setNow] = useState(() => performance.now());
  const [round, setRound] = useState(0);
  const [tickled, setTickled] = useState<number | null>(null);
  const [week, setWeek] = useState<WeekLog>(loadWeek);
  const { touchOnly } = useDevice();
  const tickleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The end's fanfare and cheer come over most of a second: left meanwhile, they must not sound in the menu.
  const { later } = useTimers();
  const lastGone = useRef(0);
  /** The free part of the screen between heading and controls; the picture fills the whole screen and fits what matters in here. */
  const room = useRef<HTMLDivElement>(null);
  /** Where the pictures are; a jump finds the picture shown in here. */
  const stage = useRef<HTMLDivElement>(null);
  /** Counts the jumps of the clock (progress bar, arrow keys), so the picture before the brushing can follow them. */
  const [jumps, setJumps] = useState(0);

  // A fresh set of monsters for every round, and a fresh look at the clock.
  const monsters = useMemo(placeMonsters, [round]);
  const daytime = useMemo(() => daytimeOf(), [round]);
  const preludeCue = (p: Prelude) => {
    const cue = PRELUDE[p].cue;
    return cue ? spokenIn(cue, language) : daytimeText(daytime, "grow", language);
  };
  const perStep = useMemo(() => STEPS.map((_, s) => monsters.filter((m) => m.step === s).length), [monsters]);
  // Taken at the start of each brushing: „Vorher zeigen“ changed meanwhile (⚙️ while playing) applies to the next one, so the clock never jumps.
  const prelude = useMemo(() => preludeOf(settings), [round]);
  const introMs = introOf(prelude);
  // The song is sung in the app language; the brushing lasts as long as the song and each step as long as its verse.
  const sungIn = sungLanguageFor(language.id, SUNG_LANGUAGES);
  const stepStarts = useMemo(() => sungSteps(sungIn), [sungIn]);
  const stepLength = (k: number) => stepStarts[k + 1] - stepStarts[k];
  const totalMs = stepStarts[STEPS.length];
  const paused = clock.since === null && !held;
  const elapsed = readClock(clock, now);
  /** The clock stands at `until` until the song is there. */
  const waiting = !paused && clock.until !== undefined && elapsed >= clock.until;
  const brushed = elapsed - introMs;
  const done = brushed >= totalMs;
  const ending: Ending | null = !done ? null : brushed - totalMs < CHEER_MS ? "cheer" : brushed - totalMs < ENDING_MS ? "tidy" : "rest";
  /** -1 during the prelude, STEPS.length when done. */
  const phase = brushed < 0 ? -1 : done ? STEPS.length : stepStarts.filter((at, k) => k < STEPS.length && brushed >= at).length - 1;
  const before = brushed < 0 ? preludeAt(prelude, elapsed) : null;
  /** Prelude parts first, then the steps, then the end: what the arrow keys step through. */
  const part = before ? prelude.indexOf(before) : prelude.length + phase;
  // The last one goes a moment before the step's time is up, so it's gone when the brush moves on.
  const isGone = (m: Monster) => brushed >= stepStarts[m.step] + ((m.order + 1) / perStep[m.step] - 0.04) * stepLength(m.step);
  const goneCount = monsters.filter(isGone).length;
  const step = phase >= 0 && !done ? STEPS[phase] : null;
  const cue = before ? preludeCue(before) : step && stepText(step, "cue", language);
  /** In the last seconds before the brushing: 3, 2, 1. */
  const count = brushed < 0 && -brushed <= COUNTDOWN * 1000 ? Math.ceil(-brushed / 1000) : null;
  // The part on screen in the address (`?seite=sweets`, `lower-top`, `ende`), so the time-on-page event tells where brushing was left.
  useStepAddress(before ?? step?.id ?? (done ? "ende" : undefined));

  /** Says a line from its recording: in the app language, or the German line where it has no translation. */
  const say = useCallback(({ text, english }: Spoken, queue = false) => voice.say(text, language.id, { queue, english }), [language.id]);

  useWakeLock(ending !== "rest");

  // The clock runs on through the end until the brush is put away; the story, the sink and tidying up tick faster for their sounds.
  const ticking = ending !== "rest" && !waiting;
  const fastTick = before !== null || done;
  useEffect(() => {
    if (!held || !still) return;
    const t = performance.now();
    setHeld(false);
    setNow(t);
    setClock((c) => (c.since === null ? { ...c, since: t } : c));
  }, [held, still]);

  useEffect(() => {
    if (!ticking || paused || held) return;
    const timer = setInterval(() => setNow(performance.now()), fastTick ? PRELUDE_TICK_MS : TICK_MS);
    return () => clearInterval(timer);
  }, [ticking, paused, held, round, fastTick]);

  // When the song is there, the clock goes on from where it waited.
  useEffect(() => {
    if (!song.ready) return;
    const t = performance.now();
    setNow(t);
    setClock((c) => (c.until === undefined ? c : { banked: readClock(c, t), since: c.since === null ? null : t }));
  }, [song.ready]);

  useEffect(() => voice.loadAll(language.id), [language.id]);

  useEffect(() => {
    loadRecordings([...(settings.origin ? ORIGIN_RECORDINGS : []), ...(settings.prep ? PREP_RECORDINGS : []), ...TIDY_RECORDINGS, "cheer", "laugh"]);
  }, [settings.origin, settings.prep]);

  // The sounds of the story, the sink and tidying up, each when the clock passes its moment; none of those a jump skips over.
  const lastElapsed = useRef(elapsed);
  useEffect(() => {
    const from = lastElapsed.current;
    lastElapsed.current = elapsed;
    const sounds = before
      ? { start: preludeStart(prelude, before), cues: PRELUDE[before].sounds ?? [] }
      : ending === "tidy"
        ? { start: introMs + totalMs + CHEER_MS, cues: PREP_CUES.tidy }
        : null;
    if (!sounds || elapsed <= from || elapsed - from > CUE_GAP_MS) return;
    for (const cue of sounds.cues) if (sounds.start + cue.at > from && sounds.start + cue.at <= elapsed) cue.play();
  }, [elapsed]);

  // On the way to the sink the shared background song runs on from the menu (while music is on); the brushing has its own song, always.
  const [common] = useCommonSettings();
  const preludeSong = common.music && before !== null && !paused;
  useNoBackgroundMusic(!preludeSong);
  // The song sings the steps, so the voice leaves them to it.
  const sung = useBrushingMusic({
    sung: sungIn,
    playing: step !== null && !paused,
    finished: done,
    sync: clock,
    at: brushed,
  });

  // What to say and play when a new part begins.
  useEffect(() => {
    if (before) {
      if (part > 0) playChime();
      if (part === 0) say(daytimeText(daytime, "hello", language));
      say(preludeCue(before), part === 0);
    } else if (phase < STEPS.length) {
      // The drum roll before the brushing ends with a „Tusch“.
      (phase === 0 ? playTusch : playChime)();
      if (!sung) say(stepText(STEPS[phase], "cue", language));
    } else {
      // Done: a fanfare of notes and children cheering; the medal and the grin say the rest, nothing rises.
      [0, 1, 2, 3, 4, 5].forEach((i) => later(() => playCountNote(i), i * 120));
      later(() => playRecorded("cheer", playTusch), 700);
      // The sung finale sings "Fertig, blitzeblank" itself; the voice would talk over it.
      if (!sung) say(spokenIn(DONE_SAY, language));
      // A star on the week chart, whether or not it is shown, so it is complete when turned on.
      const next = addBrushing(loadWeek(), new Date(), daytime);
      saveWeek(next);
      setWeek(next);
      // Opened by the Tagesplan's teeth card: that card is done, morning or evening.
      finishRoutineStep();
    }
    // Only when the part changes, not when a setting does.
  }, [part, round]);

  // Rinsing the brush, and the daytime's goodbye when all is tidy; the sung finale needs no voice.
  useEffect(() => {
    if (sung) return;
    if (ending === "tidy") say(spokenIn(TIDY_SAY, language), true);
    if (ending === "rest") say(daytimeText(daytime, "after", language), true);
    // Only when the end moves on.
  }, [ending]);

  // A drum roll under the countdown, louder each second.
  useEffect(() => {
    if (count !== null && !paused) playDrumRoll(COUNTDOWN - count);
    // Only when the number changes.
  }, [count, round]);

  useEffect(() => {
    if (goneCount > lastGone.current) playPoof();
    lastGone.current = goneCount;
  }, [goneCount]);

  useEffect(
    () => () => {
      if (tickleTimer.current) clearTimeout(tickleTimer.current);
    },
    [],
  );

  // Tapping isn't needed, but a tapped monster giggles and wiggles.
  // The same function from tick to tick, so the monsters in the mirror aren't drawn again with every tick (`PlacedMonster`).
  const tickle = useCallback((id: number) => {
    playSqueak();
    setTickled(id);
    if (tickleTimer.current) clearTimeout(tickleTimer.current);
    tickleTimer.current = setTimeout(() => setTickled(null), TICKLE_MS);
  }, []);

  const again = useCallback(() => {
    const t = performance.now();
    // „Von vorn“ or Space at the end: should a page still turn, the new brushing waits for it to lie still, like the first one.
    const moving = pageMoving();
    setHeld(moving);
    setClock({ banked: 0, since: moving ? null : t, until: song.ready ? undefined : waitAt(preludeOf(settings)) });
    setNow(t);
    setRound((r) => r + 1);
  }, [song.ready, settings.origin, settings.prep]);

  const togglePause = useCallback(() => {
    const t = performance.now();
    setNow(t);
    setClock((c) => (c.since === null ? { ...c, since: t } : { ...c, banked: readClock(c, t), since: null }));
  }, []);

  // Pausing stops the voice mid-sentence; going on repeats what to do. Not at the start, where it cut off the hello.
  const wasPaused = useRef(paused);
  useEffect(() => {
    if (paused === wasPaused.current) return;
    wasPaused.current = paused;
    if (paused) hush();
    else if (cue && !(sung && step)) say(cue);
    // Only when pausing or going on.
  }, [paused]);

  /** Move the clock to `at` ms after the start; a paused clock stays paused. A jump into the brushing while the song loads waits there for it. */
  const seek = useCallback(
    (at: number) => {
      const t = performance.now();
      setNow(t);
      setClock((c) => ({ banked: at, since: c.since === null ? null : t, until: c.until === undefined ? undefined : Math.max(waitAt(prelude), at) }));
      setJumps((n) => n + 1);
    },
    [prelude],
  );

  // The pictures before the brushing (the story, the sink) are CSS animations that start with their part, so after a
  // jump into the middle of a part they would play it from its start while the clock, the song and the bar are further
  // on. Each of their animations belongs to the part shown (`at-<part>`), so all of them are set to where the clock is in it.
  useLayoutEffect(() => {
    if (!jumps || !before) return;
    const picture = stage.current?.querySelector(":scope > .teeth-scene:last-child :is(.origin, .prep)");
    const into = elapsed - preludeStart(prelude, before);
    for (const animation of picture?.getAnimations({ subtree: true }) ?? []) animation.currentTime = into;
  }, [jumps]);

  /** Jump to the start of a part: the prelude ones first, then the steps, then the end. */
  const jumpTo = useCallback(
    (target: number) =>
      seek(target < prelude.length ? preludeStart(prelude, prelude[target]) : introMs + stepStarts[Math.min(target - prelude.length, STEPS.length)]),
    [seek, prelude, introMs, stepStarts],
  );

  /** The progress bar's parts on the clock, as [start, length] in ms: the time before the brushing (story, sink, mirror), then each step. */
  const segments: [number, number][] = [[0, introMs], ...STEPS.map((_, k): [number, number] => [introMs + stepStarts[k], stepLength(k)])];

  /**
   * Where the toothbrush rides on the bar: the part it is in and how far through it, as one number (2.5 is halfway
   * through the third part). The parts are equally wide, so `teeth.css` turns it into a place without measuring.
   */
  const runnerPart = before ? 0 : done ? segments.length - 1 : phase + 1;
  const runnerShare = before ? elapsed / introMs : done ? 1 : (brushed - stepStarts[phase]) / stepLength(phase);
  const runnerAt = {
    "--parts": segments.length,
    "--part": runnerPart,
    "--at": Math.round((runnerPart + Math.max(0, Math.min(1, runnerShare))) * 1000) / 1000,
  } as CSSProperties;

  /** Tapping or dragging on the progress bar jumps to that point, before or while brushing. */
  const seekFromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const parts = [...e.currentTarget.querySelectorAll(":scope > .teeth-segment")];
    const i = parts.findIndex((s, k) => k === parts.length - 1 || e.clientX < s.getBoundingClientRect().right);
    const rect = parts[i].getBoundingClientRect();
    const k = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const [start, length] = segments[i];
    // Stop just short of the end, so dragging to the right edge doesn't finish at once.
    seek(Math.min(start + k * length, introMs + totalMs - SEEK_END_MS));
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === " " || e.key === "Enter") {
        if (done) again();
        else togglePause();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        if (!done) jumpTo(part + 1);
        else if (ending !== "rest") seek(introMs + totalMs + ENDING_MS);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        jumpTo(Math.max(0, part - 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [done, ending, part, again, togglePause, jumpTo, seek, introMs, totalMs]);

  // When the mouth has to open or close, the picture does it slowly and arrows on the lips show the way.
  const mouthBefore = phase <= 0 ? "closed" : STEPS[phase - 1].mouth;
  const mouthMoves = step !== null && step.mouth !== mouthBefore;
  const action: MouthAction | null = step && mouthMoves && brushed - stepStarts[phase] < ACTION_MS ? (step.mouth === "open" ? "open" : "close") : null;
  /** The picture on: the camera looks from the child's face down to the sink, up into the mirror, and down again to tidy up. */
  const scene: SceneKind =
    before === "sweets" || before === "grow" ? "story" : before === "brush" || before === "paste" || ending === "tidy" ? "sink" : "mirror";
  const target = step?.view ?? GRIN_VIEW;
  const { view, gliding, k: glided } = useGlidingView(target, mouthMoves ? MOUTH_MS : TURN_MS);

  // The brush glides along the step's teeth and reaches each monster just as it goes.
  const inStep = monsters.filter((m) => m.step === phase);
  const brushAt = inStep.find((m) => !isGone(m));
  const stepDone = step ? (brushed - stepStarts[phase]) / stepLength(phase) : 0;
  const brushStop = Math.max(0, Math.min(inStep.length - 1, stepDone * inStep.length - 0.6));
  // Every monster on a tooth not brushed yet, there from the start; the picture shows those whose side of the tooth faces out.
  const spots: MonsterSpot[] = monsters
    .filter((m) => m.step >= phase)
    .map((m) => ({
      id: m.id,
      tooth: m.tooth,
      surface: STEPS[m.step].surface,
      spot: m.spot,
      color: m.color,
      variant: m.variant,
      blinkMs: m.id * 530,
      waiting: m.step !== phase,
      scared: m === brushAt && !isGone(m),
      gone: m.step === phase && isGone(m),
      tickled: tickled === m.id,
    }));

  return (
    <div className={`teeth-play ${daytime}${done ? " done" : ""}${paused ? " paused" : ""}`}>
      {/* Before the picture, so it is there when the picture measures it. */}
      <div className="teeth-room" ref={room} />
      {/* A tap on the picture pauses, like the pause button (user request, November 2026); a tapped monster only giggles,
          and the pause screen over it goes on again. Not at the end, which has nothing left to pause. */}
      <div
        className="teeth-stage"
        ref={stage}
        onPointerDown={() => {
          if (!done && !paused) togglePause();
        }}
      >
        <Scenes id={`${round}-${scene}`} kind={scene} paused={paused}>
          {scene === "story" ? (
            <Origin key={round} part={before === "sweets" ? "sweets" : "grow"} daytime={daytime} tickled={tickled} onTickle={tickle} free={room} />
          ) : scene === "sink" ? (
            <Prep key={round} part={before === "brush" || before === "paste" ? before : "tidy"} daytime={daytime} free={room} />
          ) : (
            <Mouth
              key={round}
              view={view}
              zone={step && { surface: step.surface, teeth: step.teeth }}
              monsters={spots}
              brush={step && { stops: inStep.map((m) => ({ tooth: m.tooth, spot: m.spot })), at: brushStop, surface: step.surface, motion: step.motion }}
              happy={done}
              dazzled={ending === "cheer"}
              action={action}
              gliding={gliding}
              glide={{ to: target, k: glided }}
              free={room}
              onTickle={tickle}
            />
          )}
        </Scenes>
      </div>

      {/* The buttons and the week's new star wait until the brush is put away. */}
      {done ? (
        ending === "rest" && (
          <div className="teeth-end">
            {settings.week && <Week log={week} today={new Date()} now={daytime} />}
            <GameEnd inline menu />
          </div>
        )
      ) : (
        <>
          {/* The week shows before brushing too, which star is to come (not during the story, nor on a phone, where the pictures need the room); while brushing, the mouth gets its room. */}
          {before && before !== "sweets" && before !== "grow" && settings.week && (
            <div className="teeth-week-before">
              <Week log={week} today={new Date()} now={daytime} />
            </div>
          )}
          <div className="teeth-controls">
            <button type="button" className="teeth-button" onClick={togglePause} aria-label={paused ? t(GO_ON) : t(PAUSE)}>
              <ControlIcon kind={paused ? "play" : "pause"} className="teeth-button-icon" />
            </button>
            <button
              type="button"
              className="teeth-button"
              onClick={again}
              aria-label={t({ de: "Von vorn", en: "Start again", zh: "重新开始", hi: "फिर से शुरू", es: "Otra vez", ar: "من جديد", ru: "Сначала" })}
            >
              <ControlIcon kind="again" className="teeth-button-icon" />
            </button>
            {teethSymbol("bonbon") && <img className="teeth-symbol" src={teethSymbol("bonbon")} alt="" draggable={false} aria-hidden />}
            <div
              className="teeth-progress"
              role="slider"
              aria-label={t({ de: "Fortschritt", en: "Progress", zh: "进度", hi: "प्रगति", es: "Progreso", ar: "التقدّم", ru: "Сколько уже почищено" })}
              aria-valuemin={0}
              aria-valuemax={Math.round((introMs + totalMs) / 1000)}
              aria-valuenow={Math.round(Math.max(0, Math.min(elapsed, introMs + totalMs)) / 1000)}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                seekFromPointer(e);
              }}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) seekFromPointer(e);
              }}
            >
              {/* Before the brushing: the story, the sink and the first look in the mirror, a part of its own with its own time. */}
              <span className={`teeth-segment intro${before ? " now" : ""}`} title={prelude.map((p) => t(PRELUDE[p].title)).join(" · ")}>
                <span style={{ transform: `scaleX(${Math.max(0, Math.min(1, elapsed / introMs))})` }} />
              </span>
              {STEPS.map((s, i) => (
                <span
                  key={i}
                  className={`teeth-segment ${s.surface}${i === phase ? " now" : ""}`}
                  title={`${stepText(s, "title", language).text} · ${stepText(s, "hint", language).text}`}
                >
                  <span style={{ transform: `scaleX(${Math.max(0, Math.min(1, (brushed - stepStarts[i]) / stepLength(i)))})` }} />
                </span>
              ))}
              {/* The toothbrush rides along the bar to where the clock is: an HTML layer moved by its transform. */}
              {teethSymbol("zahnbuerste") && (
                <span className="teeth-runner" style={runnerAt} aria-hidden>
                  <img src={teethSymbol("zahnbuerste")} alt="" draggable={false} />
                </span>
              )}
            </div>
            {teethSymbol("zahn") && <img className="teeth-symbol goal" src={teethSymbol("zahn")} alt="" draggable={false} aria-hidden />}
            {/* For the grown-up, only where the screen is wide enough (teeth.css): before the brushing the time until it
                starts, then the brushing time left – two clocks in one place. */}
            {before ? (
              <span
                className="teeth-time intro"
                aria-label={t({
                  de: "Zeit bis zum Start",
                  en: "Time until the start",
                  zh: "距开始的时间",
                  hi: "शुरू होने में बाकी समय",
                  es: "Tiempo hasta empezar",
                  ar: "الوقت حتى البداية",
                  ru: "Время до начала",
                })}
              >
                {formatTime(-brushed)}
              </span>
            ) : (
              <span
                className="teeth-time"
                aria-label={t({
                  de: "Restzeit",
                  en: "Time left",
                  zh: "剩余时间",
                  hi: "बाकी समय",
                  es: "Tiempo restante",
                  ar: "الوقت المتبقي",
                  ru: "Осталось времени",
                })}
              >
                {formatTime(totalMs - Math.max(0, Math.min(brushed, totalMs)))}
              </span>
            )}
          </div>
        </>
      )}

      {/* Under the pause screen. */}
      {count !== null && (
        <p className="teeth-count" key={count} aria-live="polite">
          {count}
        </p>
      )}
      {step && phase === 0 && brushed < GO_MS && (
        <p className="teeth-count go" aria-live="polite">
          {t({ de: "Los!", en: "Go!", zh: "开始！", hi: "चलो!", es: "¡Ya!", ar: "هيّا!", ru: "Поехали!" })}
        </p>
      )}

      {/* Only when the song is still not there after the story: the brushing waits for it. */}
      {waiting && (
        <div className="teeth-loading" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(song.progress * 100)}>
          🎵{" "}
          {t({
            de: "Musik lädt …",
            en: "Music is loading …",
            zh: "音乐加载中……",
            hi: "संगीत लोड हो रहा है …",
            es: "Cargando la música …",
            ar: "الموسيقى قيد التحميل …",
            ru: "Музыка загружается …",
          })}
          <span className="teeth-loading-bar">
            <span style={{ width: `${song.progress * 100}%` }} />
          </span>
        </div>
      )}

      {paused && (
        <button type="button" className="teeth-paused" onClick={togglePause}>
          <span className="teeth-paused-icon" aria-hidden>
            <ControlIcon kind="pause" className="teeth-button-icon" />
          </span>
          {t(PAUSE)}
          <small>{t(touchOnly ? TAP_TO_GO_ON : SPACE_OR_TAP_TO_GO_ON)}</small>
        </button>
      )}
    </div>
  );
}
