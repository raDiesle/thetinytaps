import { sectionStart } from "./seekBar";
import { type CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { flushSync } from "react-dom";
import { ControlIcon } from "@/components/ControlIcon";
import { GameEnd } from "@/components/GameEnd";
import { GO_ON, PAUSE, SPACE_OR_TAP_TO_GO_ON, TAP_TO_GO_ON } from "@/lib/sharedTexts";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { useCommonSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { type Localized, useAppLanguage, useT, type Spoken, spokenIn } from "@/lib/language";
import { loadRecordings, playChime, playCountNote, playDrumRoll, playRecorded, playSqueak, playTusch } from "@/lib/sfx";
import { pageMoving, usePageStill } from "@/lib/pageMotion";
import { finishRoutineStep } from "@/lib/routine";
import { useTimers } from "@/lib/timers";
import { hush, recordedVoice } from "@/lib/voice";
import { useWakeLock } from "@/lib/wakeLock";
import { type Daytime, daytimeOf } from "@/lib/days";
import { addBrushing, daytimeText, loadWeek, saveWeek, type WeekLog } from "./daytime";
import { lerpView, type ToothId, type View } from "./jaw";
import { Mouth, type MonsterSpot, type MouthAction } from "./mouth";
import { dirtyFaces } from "./stains";
import { SUNG_LANGUAGES, songEndMs, sungSteps, useBrushingMusic, useSongLoad } from "./music";
import type { Cue } from "./cues";
import { DONE_SAY, type Prelude, PRELUDE_TEXTS, preludeTexts, TIDY_SAY } from "./lines";
import { HoneyBread, Origin, ORIGIN_CUES, ORIGIN_MS, ORIGIN_RECORDINGS } from "./origin";
import { Scenes, type SceneKind } from "./scenes";
import { Prep, PREP_CUES, PREP_MS, PREP_RECORDINGS, TIDY_RECORDINGS } from "./prep";
import { Spit, SPIT_CUES, SPIT_MS } from "./spit";
import type { TeethSettings } from "./settings";
import { GRIN_VIEW, STEPS, stepText } from "./steps";
import { sungLanguageFor } from "./sung";
import { type TeethSymbol, teethSymbol } from "./symbols";
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
/** The last seconds before the brushing are counted down big, with a drum roll. */
const COUNTDOWN = 3;
/** How long „Los!“ shows when the brushing begins. */
const GO_MS = 1300;
/**
 * After the brushing: two bars of cheering at the clean grin, two of spitting the foam out over the basin (X-18: only
 * spitting, no rinsing of the mouth), then the brush is rinsed and put away, then the buttons.
 */
const CHEER_MS = 4290;
/** When the brush is rinsed, in ms after the brushing. */
const TIDY_FROM = CHEER_MS + SPIT_MS;
const ENDING_MS = TIDY_FROM + PREP_MS.tidy;
/** A video recording ends at least this long after the brush is put away, so the last grin stays a moment. */
const VIDEO_TAIL_MS = 3000;
/** After the sung finale has rung out, the recording keeps the still grin this much longer, so the video doesn't end on the last note. */
const VIDEO_AFTER_SONG_MS = 1000;

/** The brushing played for a video (`TeethVideo`): the picture alone, with nothing to tap and nothing kept. */
export interface VideoRun {
  /** Morning or evening, chosen for the video instead of read from the clock. */
  daytime: Daytime;
  /** The brush is put away and the song has rung out: the recording can end. */
  onFinished: () => void;
}

/** Loads the voice and the sounds of a whole brushing ahead, for a video recording, where nothing may come late. */
export function preloadBrushing(language: string) {
  voice.loadAll(language);
  loadRecordings([...ORIGIN_RECORDINGS, ...PREP_RECORDINGS, ...TIDY_RECORDINGS, "cheer", "laugh"]);
}

/** The parts of the end: cheering at the clean teeth, spitting the foam out, tidying the brush away, and resting with the week chart and the buttons. */
type Ending = "cheer" | "spit" | "tidy" | "rest";

/**
 * How the monsters grow depends on the time of day (over the day or the night), see DAYTIME, and so does what the
 * story eats (`preludeTexts`, `ORIGIN_CUES`: breakfast in the morning). `sounds` play at their moment of the part;
 * titles and lines are in lines.ts.
 */
export const PRELUDE: Record<Prelude, { ms: number; title: Localized; cue?: Localized; sounds?: Cue[] }> = {
  sweets: { ...PRELUDE_TEXTS.sweets, ms: ORIGIN_MS.sweets },
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

/** A frame that came this much later than the one before missed the screen's beat. */
const MISSED_FRAME_MS = 24;
/** Drawing an in-between picture of the mirror (React's render and commit) that takes longer leaves a frame too little for the rest. */
const SLOW_PICTURE_MS = 5;
/** After this many missed frames or slow pictures a glide draws every other frame only, at least this far apart. */
const SLOW_TO_PACE = 2;
const PACED_GAP_MS = 28;

/**
 * Glides from one view to the next, so the child sees the head turn and the mouth open; `gliding` while it does, `k`
 * how far (eased). Each in-between picture redraws the whole mirror: where a device can't do that well within a frame
 * (an old phone), the glide draws every other frame only, so it moves at an even 30 frames a second instead of
 * stumbling between one, two and three frames per picture, and leaves the main thread time for taps (`bun run perf
 * zaehne`, „Putzen: springen“, November 2026). A device that keeps up draws every frame. Each picture is drawn inside
 * its animation frame (`flushSync`), so it shows in that frame and its cost can be measured.
 */
function useGlidingView(target: View, ms: number): { view: View; gliding: boolean; k: number } {
  const [glide, setGlide] = useState({ view: target, k: 1, to: target });
  const current = useRef(target);
  useEffect(() => {
    const from = current.current;
    const start = performance.now();
    let frame = 0;
    // The first frame comes after the commit that changed the target, which is no measure of the glide's own frames.
    let last = Number.NaN;
    let drawn = -Infinity;
    let slow = 0;
    const step = (t: number) => {
      const k = ms <= 0 ? 1 : Math.min(1, (t - start) / ms);
      if (t - last > MISSED_FRAME_MS) slow++;
      last = t;
      if (k < 1 && slow >= SLOW_TO_PACE && t - drawn < PACED_GAP_MS) {
        frame = requestAnimationFrame(step);
        return;
      }
      drawn = t;
      current.current = k >= 1 ? target : lerpView(from, target, ease(k));
      const before = performance.now();
      flushSync(() => setGlide({ view: current.current, k: ease(k), to: target }));
      if (performance.now() - before > SLOW_PICTURE_MS) slow++;
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

/** The phases of the routine the bar shows apart: eating sweets, getting the brush, brushing, putting the brush away. */
type BarPhase = "eat" | "fetch" | "ready" | "tidy";

/** The symbol of each phase on the bar; the brushing has its frame with the riding brush and the clean tooth instead. */
const PHASE_SYMBOL: Record<BarPhase, TeethSymbol | null> = { eat: "bonbon", fetch: "zahnpasta", ready: null, tidy: "becher" };
/** In the morning the story eats breakfast (X-19), so its phase shows the honey bread instead of the sweet. */
const symbolOf = (phase: BarPhase, daytime: Daytime): TeethSymbol | null => (phase === "eat" && daytime === "morning" ? "fruehstueck" : PHASE_SYMBOL[phase]);

/**
 * The prelude's parts as the bar's tiles before the brushing: the story is eating, the sink is getting the brush. The
 * first look in the mirror with its 3, 2, 1 ends the tile before it, or stands alone when neither is shown.
 */
function preludeTiles(prelude: Prelude[]): { phase: BarPhase; parts: Prelude[] }[] {
  const tiles: { phase: BarPhase; parts: Prelude[] }[] = [];
  const eat = prelude.filter((p) => p === "sweets" || p === "grow");
  const fetch = prelude.filter((p) => p === "brush" || p === "paste");
  if (eat.length) tiles.push({ phase: "eat", parts: eat });
  if (fetch.length) tiles.push({ phase: "fetch", parts: fetch });
  if (tiles.length) tiles[tiles.length - 1].parts.push("monsters");
  else tiles.push({ phase: "ready", parts: ["monsters"] });
  return tiles;
}

/** A symbol of the bar: its painted picture, else an empty place (never an emoji). */
function BarSymbol({ name }: { name: TeethSymbol | null }) {
  const src = name && teethSymbol(name);
  if (src) return <img className="teeth-symbol" src={src} alt="" draggable={false} aria-hidden />;
  // Until its painted picture comes (queued in src/games/potty/symbolPictures.ts), the morning's breakfast shows the
  // story's own honey bread, drawn in the same ink line.
  if (name === "fruehstueck")
    return (
      <svg className="teeth-symbol" viewBox="-40 -42 80 84" aria-hidden>
        <HoneyBread />
      </svg>
    );
  return <span className="teeth-symbol" aria-hidden />;
}

/** One phase outside the brushing on the bar: its symbol beside a groove that fills as the time goes by. */
function PhaseTile({ phase, daytime, now, done, title }: { phase: BarPhase; daytime: Daytime; now: boolean; done: number; title: string }) {
  return (
    <span className={`teeth-tile ${phase}`}>
      <BarSymbol name={symbolOf(phase, daytime)} />
      <span className="teeth-lane">
        <span className={`teeth-segment ${phase}${now ? " now" : ""}`} title={title}>
          <span style={{ "--done": done } as CSSProperties} />
        </span>
      </span>
    </span>
  );
}

/**
 * A brushing timer that needs no tapping: first a short story of how sweets
 * become sugar monsters, fetching the brush and putting toothpaste on, then the mirror shows where to brush next
 * (chewing surfaces, outside, inside), and the sugar monsters there vanish
 * one by one. Arrow keys skip ahead or back, Space or the pause button pauses,
 * and tapping the progress bar jumps there.
 */
export function TeethPlay({ settings, video }: { settings: TeethSettings; video?: VideoRun }) {
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
  /** The free part of the screen between heading and controls; the picture fills the whole screen and fits what matters in here. */
  const room = useRef<HTMLDivElement>(null);
  /** Where the pictures are; a jump finds the picture shown in here. */
  const stage = useRef<HTMLDivElement>(null);
  /** Counts the jumps of the clock (progress bar, arrow keys), so the picture before the brushing can follow them. */
  const [jumps, setJumps] = useState(0);

  // A fresh set of monsters for every round, and a fresh look at the clock.
  const monsters = useMemo(placeMonsters, [round]);
  const daytime = useMemo(() => video?.daytime ?? daytimeOf(), [round]);
  const preludeCue = (p: Prelude) => {
    const cue = preludeTexts(p, daytime).cue;
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
  const after = brushed - totalMs;
  const ending: Ending | null = !done ? null : after < CHEER_MS ? "cheer" : after < TIDY_FROM ? "spit" : after < ENDING_MS ? "tidy" : "rest";
  /** -1 during the prelude, STEPS.length when done. */
  const phase = brushed < 0 ? -1 : done ? STEPS.length : stepStarts.filter((at, k) => k < STEPS.length && brushed >= at).length - 1;
  const before = brushed < 0 ? preludeAt(prelude, elapsed) : null;
  /** Prelude parts first, then the steps, then the end: what the arrow keys step through. */
  const part = before ? prelude.indexOf(before) : prelude.length + phase;
  // The last one goes a moment before the step's time is up, so it's gone when the brush moves on.
  const isGone = (m: Monster) => brushed >= stepStarts[m.step] + ((m.order + 1) / perStep[m.step] - 0.04) * stepLength(m.step);
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

  // The sounds of the story, the sink, spitting and tidying up, each when the clock passes its moment; none of those a jump skips over.
  const lastElapsed = useRef(elapsed);
  useEffect(() => {
    const from = lastElapsed.current;
    lastElapsed.current = elapsed;
    const sounds = before
      ? { start: preludeStart(prelude, before), cues: before === "sweets" ? ORIGIN_CUES[daytime] : (PRELUDE[before].sounds ?? []) }
      : ending === "spit"
        ? { start: introMs + totalMs + CHEER_MS, cues: SPIT_CUES }
        : ending === "tidy"
          ? { start: introMs + totalMs + TIDY_FROM, cues: PREP_CUES.tidy }
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
      // A video's brushing is no child's: nothing goes on the week chart or the routine.
      if (video) return;
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

  // A video ends once the brush is put away and the sung finale has rung out (most finales last longer than the tidying; Hindi's ends before it).
  useEffect(() => {
    if (!video || ending !== "rest") return;
    const songLeft = (songEndMs(sungIn, song.buffer) ?? 0) + VIDEO_AFTER_SONG_MS - (totalMs + ENDING_MS);
    later(video.onFinished, Math.max(VIDEO_TAIL_MS, songLeft));
    // Only when the end moves on.
  }, [ending]);

  // A drum roll under the countdown, louder each second.
  useEffect(() => {
    if (count !== null && !paused) playDrumRoll(COUNTDOWN - count);
    // Only when the number changes.
  }, [count, round]);

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
    // Spitting and the sink at the end (tidying up) are such parts too, reached from the bar's last part.
    const into = before
      ? elapsed - preludeStart(prelude, before)
      : ending === "spit"
        ? brushed - totalMs - CHEER_MS
        : ending === "tidy"
          ? brushed - totalMs - TIDY_FROM
          : null;
    if (!jumps || into === null) return;
    const picture = stage.current?.querySelector(":scope > .teeth-scene:last-child :is(.origin, .prep, .spit)");
    for (const animation of picture?.getAnimations({ subtree: true }) ?? []) animation.currentTime = into;
  }, [jumps]);

  /** Jump to the start of a part: the prelude ones first, then the steps, then the end. */
  const jumpTo = useCallback(
    (target: number) =>
      seek(target < prelude.length ? preludeStart(prelude, prelude[target]) : introMs + stepStarts[Math.min(target - prelude.length, STEPS.length)]),
    [seek, prelude, introMs, stepStarts],
  );

  /**
   * The progress bar shows the routine's four phases, each plainly apart (user feedback, November 2026: a sweet at the
   * start and a tooth at the end said nothing of what each part is): eating sweets (the story), getting the brush with
   * its toothpaste (the sink), the brushing itself – its steps in a frame of their own, the brush riding along them to
   * the clean tooth – and putting the brush away at the end. Each part is [start, length] on the clock, in ms.
   */
  const tiles = preludeTiles(prelude);
  const tileParts: [number, number][] = tiles.map(({ parts }) => [preludeStart(prelude, parts[0]), parts.reduce((sum, p) => sum + PRELUDE[p].ms, 0)]);
  const stepParts = STEPS.map((_, k): [number, number] => [introMs + stepStarts[k], stepLength(k)]);
  const tidyPart: [number, number] = [introMs + totalMs, ENDING_MS];
  /** Every `.teeth-segment` of the bar in its order, as tapping and dragging find them. */
  const segments: [number, number][] = [...tileParts, ...stepParts, tidyPart];
  /** How far through a part the clock is, 0 to 1. */
  const share = ([start, length]: [number, number]) => Math.max(0, Math.min(1, (elapsed - start) / length));

  /**
   * Where the toothbrush rides in the brushing's frame: the step it is in and how far through it, as one number (2.5 is
   * halfway through the third step); afterwards it stands at the clean tooth. The steps are equally wide, so
   * `teeth.css` turns it into a place without measuring.
   */
  const runnerPart = done ? STEPS.length - 1 : Math.max(0, phase);
  const runnerShare = done ? 1 : phase < 0 ? 0 : (brushed - stepStarts[phase]) / stepLength(phase);
  const runnerAt = {
    "--parts": STEPS.length,
    "--part": runnerPart,
    "--at": Math.round((runnerPart + Math.max(0, Math.min(1, runnerShare))) * 1000) / 1000,
  } as CSSProperties;

  /**
   * Tapping or dragging on the progress bar plays the groove under the finger from its start (`sectionStart`), before,
   * while or after brushing: eating sweets from the first sweet, getting the brush from the cup, a step, or the end's
   * cheer and tidying – the groove as it is seen, never a part hidden inside it (a tap low on the sweets' groove once
   * started only the monsters growing, user feedback, November 2026). Dragging jumps only when it reaches another
   * groove, so one is never started again and again under a moving finger.
   */
  const sectionStarts = segments.map(([start]) => start);
  const lastSection = useRef<number | null>(null);
  const seekFromPointer = (e: PointerEvent<HTMLDivElement>, first: boolean) => {
    const parts = [...e.currentTarget.querySelectorAll(".teeth-segment")];
    // Standing at the picture's side on a wide screen (teeth.css), the bar runs from top to bottom.
    const upright = getComputedStyle(e.currentTarget).flexDirection === "column";
    const along = upright ? e.clientY : e.clientX;
    const i = parts.findIndex((s, k) => {
      const r = s.getBoundingClientRect();
      return k === parts.length - 1 || along < (upright ? r.bottom : r.right);
    });
    const rect = parts[i].getBoundingClientRect();
    const k = Math.max(0, Math.min(1, upright ? (e.clientY - rect.top) / rect.height : (e.clientX - rect.left) / rect.width));
    const [start, length] = segments[i];
    const target = sectionStart(Math.min(start + k * length, introMs + totalMs + ENDING_MS - 1), sectionStarts);
    if (!first && target === lastSection.current) return;
    lastSection.current = target;
    seek(target);
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
  /** The picture on: the camera looks from the child's face down to the sink, up into the mirror, down to the basin the child spits into, and down again to tidy up. */
  const scene: SceneKind =
    before === "sweets" || before === "grow"
      ? "story"
      : before === "brush" || before === "paste" || ending === "tidy"
        ? "sink"
        : ending === "spit"
          ? "spit"
          : "mirror";
  const target = step?.view ?? GRIN_VIEW;
  const { view, gliding, k: glided } = useGlidingView(target, mouthMoves ? MOUTH_MS : TURN_MS);

  // The brush glides along the step's teeth and reaches each monster just as it goes.
  const inStep = monsters.filter((m) => m.step === phase);
  const brushAt = inStep.find((m) => !isGone(m));
  const stepDone = step ? (brushed - stepStarts[phase]) / stepLength(phase) : 0;
  const brushStop = Math.max(0, Math.min(inStep.length - 1, stepDone * inStep.length - 0.6));
  // Every face a step brushes is stained until the brush has taken all of its monsters off: then it turns white.
  const dirty = dirtyFaces(phase, monsters, isGone);
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
    <div className={`teeth-play ${daytime}${done ? " done" : ""}${paused ? " paused" : ""}${video ? " video" : ""}`}>
      {/* Before the picture, so it is there when the picture measures it. */}
      <div className="teeth-room" ref={room} />
      {/* A tap on the picture pauses, like the pause button (user request, November 2026); a tapped monster only giggles,
          and the pause screen over it goes on again. Not at the end, which has nothing left to pause. */}
      <div
        className="teeth-stage"
        ref={stage}
        onPointerDown={() => {
          // In a video nothing on the picture answers a click: the recording must not stop by chance.
          if (!video && !done && !paused) togglePause();
        }}
      >
        <Scenes id={`${round}-${scene}`} kind={scene} paused={paused}>
          {scene === "story" ? (
            <Origin key={round} part={before === "sweets" ? "sweets" : "grow"} daytime={daytime} tickled={tickled} onTickle={tickle} free={room} />
          ) : scene === "sink" ? (
            <Prep key={round} part={before === "brush" || before === "paste" ? before : "tidy"} daytime={daytime} free={room} />
          ) : scene === "spit" ? (
            <Spit key={round} daytime={daytime} free={room} />
          ) : (
            <Mouth
              key={round}
              view={view}
              zone={step && { surface: step.surface, teeth: step.teeth }}
              monsters={spots}
              dirty={dirty}
              brush={step && { stops: inStep.map((m) => ({ tooth: m.tooth, spot: m.spot })), at: brushStop, surface: step.surface, motion: step.motion }}
              happy={done}
              spat={ending === "tidy" || ending === "rest"}
              action={action}
              gliding={gliding}
              glide={{ to: target, k: glided }}
              free={room}
              onTickle={tickle}
            />
          )}
        </Scenes>
      </div>

      {/* The buttons and the week's new star wait until the brush is put away. A video shows only the picture: no
          controls, no week, no buttons and no trophy, whose end would hand it over. */}
      {video ? null : ending === "rest" ? (
        <div className="teeth-end">
          {settings.week && <Week log={week} today={new Date()} now={daytime} />}
          <GameEnd inline menu />
        </div>
      ) : (
        <>
          {/* The week waits for the end: beside the sink it took the picture's room, and beside the first look in the
              mirror it pushed the face aside, which jumped to the middle as the brushing began (user feedback, November 2026). */}
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
            <div
              className="teeth-progress"
              role="slider"
              aria-label={t({ de: "Fortschritt", en: "Progress", zh: "进度", hi: "प्रगति", es: "Progreso", ar: "التقدّم", ru: "Сколько уже почищено" })}
              aria-valuemin={0}
              aria-valuemax={Math.round((introMs + totalMs + ENDING_MS) / 1000)}
              aria-valuenow={Math.round(Math.max(0, Math.min(elapsed, introMs + totalMs + ENDING_MS)) / 1000)}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                seekFromPointer(e, true);
              }}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) seekFromPointer(e, false);
              }}
            >
              {/* Before the brushing: eating sweets, then getting the brush (the first look in the mirror and 3, 2, 1 end the last of them). */}
              {tiles.map(({ phase: kind, parts }, i) => (
                <PhaseTile
                  key={kind}
                  phase={kind}
                  daytime={daytime}
                  now={before !== null && parts.includes(before)}
                  done={share(tileParts[i])}
                  title={parts.map((p) => t(preludeTexts(p, daytime).title)).join(" · ")}
                />
              ))}
              {/* The brushing itself: its steps in a frame of their own, the brush riding along them to the clean tooth. */}
              <div className="teeth-brushing">
                <div className="teeth-lane teeth-track">
                  {STEPS.map((s, i) => (
                    <span
                      key={i}
                      className={`teeth-segment ${s.surface}${i === phase ? " now" : ""}`}
                      title={`${stepText(s, "title", language).text} · ${stepText(s, "hint", language).text}`}
                    >
                      <span style={{ "--done": share(stepParts[i]) } as CSSProperties} />
                    </span>
                  ))}
                  {/* An HTML layer moved by its transform to where the clock is; it comes with the brushing, so before it nothing lies over the groove of getting the brush. */}
                  {!before && teethSymbol("zahnbuerste") && (
                    <span className="teeth-runner" style={runnerAt} aria-hidden>
                      <img src={teethSymbol("zahnbuerste")} alt="" draggable={false} />
                    </span>
                  )}
                </div>
                <BarSymbol name="zahn" />
              </div>
              {/* After the brushing: the cheer at the clean teeth, spitting the foam out, then the brush rinsed and put back in its cup. */}
              <PhaseTile phase="tidy" daytime={daytime} now={ending !== null} done={share(tidyPart)} title={t(TIDY_SAY)} />
            </div>
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
