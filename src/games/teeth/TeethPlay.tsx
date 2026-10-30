import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { MenuIcon } from "@/components/GameEnd";
import { useLeaveGame } from "@/components/GameShell";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { useCommonSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { type Localized, useAppLanguage, useT, type Spoken, spokenIn } from "@/lib/language";
import { loadRecordings, playChime, playCountNote, playDrumRoll, playPoof, playRecorded, playSqueak, playTusch } from "@/lib/sfx";
import { finishRoutineStep } from "@/lib/routine";
import { speak, stopSpeaking } from "@/lib/speech";
import { useWakeLock } from "@/lib/wakeLock";
import { addBrushing, daytimeOf, daytimeText, loadWeek, saveWeek, type WeekLog } from "./daytime";
import { lerpView, type ToothId, type View } from "./jaw";
import { Medal } from "./medal";
import { Mouth, type MonsterSpot, type MouthAction } from "./mouth";
import { SUNG_LANGUAGES, sungSteps, useBrushingMusic, useSongLoad } from "./music";
import type { Cue } from "./cues";
import { Origin, ORIGIN_CUES, ORIGIN_MS, ORIGIN_RECORDINGS } from "./origin";
import { Prep, PREP_CUES, PREP_MS, PREP_RECORDINGS, TIDY_RECORDINGS } from "./prep";
import type { TeethSettings } from "./settings";
import { GRIN_VIEW, STEPS, stepText } from "./steps";
import { sungLanguageFor } from "./sung";
import { Week } from "./week";
import "./teeth.css";

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

/** Before the clock starts: where the monsters come from, get the brush, toothpaste on, and see them in the mirror. */
type Prelude = "sweets" | "grow" | "brush" | "paste" | "monsters";

/** How the monsters grow depends on the time of day (over the day or the night), see DAYTIME. `sounds` play at their moment of the part. */
export const PRELUDE: Record<Prelude, { ms: number; title: Localized; cue?: Localized; sounds?: Cue[] }> = {
  sweets: {
    ms: ORIGIN_MS.sweets,
    sounds: ORIGIN_CUES,
    title: {
      de: "🍭 Süßes essen",
      en: "🍭 Eating sweets",
      zh: "🍭 吃甜食",
      hi: "🍭 मीठा खाना",
      es: "🍭 Comer dulces",
      ar: "🍭 نأكل الحلوى",
      ru: "🍭 Едим сладкое",
    },
    cue: {
      de: "Mmh, Süßes! Ein bisschen Zucker bleibt an den Zähnen.",
      en: "Mmm, sweets! A little sugar stays on the teeth.",
      zh: "嗯，好甜！一点点糖留在了牙齿上。",
      hi: "म्म, मीठा! थोड़ी-सी चीनी दाँतों पर रह जाती है।",
      es: "¡Mmm, dulces! Un poco de azúcar se queda en los dientes.",
      ar: "مممم، حلوى! يبقى قليل من السكر على الأسنان.",
      ru: "Ммм, сладкое! Немного сахара остаётся на зубках.",
    },
  },
  grow: {
    ms: ORIGIN_MS.grow,
    title: {
      de: "👾 Zuckermonster wachsen",
      en: "👾 Sugar monsters grow",
      zh: "👾 糖怪兽长大了",
      hi: "👾 चीनी-मॉन्स्टर बढ़ते हैं",
      es: "👾 Crecen los monstruos de azúcar",
      ar: "👾 وحوش السكر تكبر",
      ru: "👾 Растут сахарные монстры",
    },
  },
  brush: {
    ms: PREP_MS.brush,
    sounds: PREP_CUES.brush,
    title: {
      de: "🪥 Zahnbürste holen",
      en: "🪥 Get the toothbrush",
      zh: "🪥 拿牙刷",
      hi: "🪥 टूथब्रश लेना",
      es: "🪥 Tomar el cepillo",
      ar: "🪥 نُحضر الفرشاة",
      ru: "🪥 Берём щётку",
    },
    cue: {
      de: "Zuerst holen wir die Zahnbürste!",
      en: "First we get the toothbrush!",
      zh: "先拿牙刷！",
      hi: "पहले हम टूथब्रश लेते हैं!",
      es: "¡Primero tomamos el cepillo de dientes!",
      ar: "أولًا نُحضر فرشاة الأسنان!",
      ru: "Сначала берём зубную щётку!",
    },
  },
  paste: {
    ms: PREP_MS.paste,
    sounds: PREP_CUES.paste,
    title: {
      de: "🫧 Zahnpasta drauf",
      en: "🫧 Toothpaste on",
      zh: "🫧 挤牙膏",
      hi: "🫧 टूथपेस्ट लगाना",
      es: "🫧 Un poco de pasta",
      ar: "🫧 قليل من المعجون",
      ru: "🫧 Немного пасты",
    },
    cue: {
      de: "Jetzt ein kleiner Klecks Zahnpasta drauf.",
      en: "Now a little blob of toothpaste.",
      zh: "现在挤一点点牙膏。",
      hi: "अब थोड़ा-सा टूथपेस्ट।",
      es: "Ahora, un poquito de pasta de dientes.",
      ar: "والآن قليل من معجون الأسنان.",
      ru: "Теперь капельку зубной пасты.",
    },
  },
  monsters: {
    ms: 4500,
    title: {
      de: "😱 Zuckermonster!",
      en: "😱 Sugar monsters!",
      zh: "😱 糖怪兽！",
      hi: "😱 चीनी-मॉन्स्टर!",
      es: "😱 ¡Monstruos de azúcar!",
      ar: "😱 وحوش السكر!",
      ru: "😱 Сахарные монстры!",
    },
    cue: {
      de: "Oh je, da sind sie! Komm, wir putzen sie alle weg!",
      en: "Oh no, there they are! Come on, let's brush them all away!",
      zh: "哎呀，它们在这儿！来，我们把它们都刷掉！",
      hi: "अरे, ये रहे! चलो, इन सबको ब्रश से भगाएँ!",
      es: "¡Ay, ahí están! ¡Ven, vamos a cepillarlos todos!",
      ar: "يا إلهي، ها هي! هيّا ننظّفها كلها!",
      ru: "Ой-ой, вот они! Давай прогоним их щёткой!",
    },
  },
};

/** Said at the end, before the daytime's goodbye (unless the sung finale sings it). */
export const DONE_SAY: Localized = {
  de: "Fertig! Alle Zuckermonster sind weg. Jetzt den Schaum ausspucken. Blitzeblank!",
  en: "Done! All the sugar monsters are gone. Now spit out the foam. Sparkling clean!",
  zh: "刷好啦！糖怪兽都没有了。现在把泡沫吐掉。亮晶晶！",
  hi: "हो गया! सारे चीनी-मॉन्स्टर चले गए। अब झाग थूक दो। चमचमाते दाँत!",
  es: "¡Listo! Ya no quedan monstruos de azúcar. Ahora escupe la espuma. ¡Relucientes!",
  ar: "انتهينا! لم تعد هناك وحوش سكر. والآن هيّا نبصق الرغوة. نظيفة لامعة!",
  ru: "Готово! Сахарных монстров больше нет. Теперь сплюнь пенку. Чисто-чисто!",
};

/** Said while the brush is rinsed and put away (unless the song sings). */
export const TIDY_SAY: Localized = {
  de: "Zahnbürste ausspülen und zurück in den Becher. Geschafft!",
  en: "Rinse the toothbrush and back into the cup. All done!",
  zh: "把牙刷冲干净，放回杯子里。完成啦！",
  hi: "टूथब्रश धोकर वापस गिलास में। हो गया!",
  es: "Enjuagamos el cepillo y de vuelta al vaso. ¡Listo!",
  ar: "نشطف الفرشاة ونعيدها إلى الكوب. انتهينا!",
  ru: "Споласкиваем щётку и ставим в стаканчик. Готово!",
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

/** Glides from one view to the next, so the child sees the head turn and the mouth open. */
function useGlidingView(target: View, ms: number): View {
  const [view, setView] = useState(target);
  const current = useRef(target);
  useEffect(() => {
    const from = current.current;
    const start = performance.now();
    let frame = 0;
    const step = (t: number) => {
      const k = ms <= 0 ? 1 : Math.min(1, (t - start) / ms);
      current.current = lerpView(from, target, ease(k));
      setView(current.current);
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
  return view;
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
  const leave = useLeaveGame();
  // Everything shown and said follows the app language; a line without a translation is said in German with the German voice (spoken.ts).
  const language = useAppLanguage();
  const t = useT();
  // The song began loading in the menu; the story plays meanwhile, and the brushing waits for it (`until`).
  const song = useSongLoad(sungLanguageFor(language.id, SUNG_LANGUAGES));
  const [clock, setClock] = useState<Clock>(() => ({ banked: 0, since: performance.now(), until: song.ready ? undefined : waitAt(preludeOf(settings)) }));
  const [now, setNow] = useState(() => performance.now());
  const [round, setRound] = useState(0);
  const [tickled, setTickled] = useState<number | null>(null);
  const [week, setWeek] = useState<WeekLog>(loadWeek);
  const { touchOnly } = useDevice();
  const { bursts, spawn } = useBursts();
  const tickleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastGone = useRef(0);
  /** The free part of the screen between heading and controls; the picture fills the whole screen and fits what matters in here. */
  const room = useRef<HTMLDivElement>(null);

  // A fresh set of monsters for every round, and a fresh look at the clock.
  const monsters = useMemo(placeMonsters, [round]);
  const daytime = useMemo(() => daytimeOf(), [round]);
  const preludeCue = (p: Prelude) => {
    const cue = PRELUDE[p].cue;
    return cue ? spokenIn(cue, language) : daytimeText(daytime, "grow", language);
  };
  const perStep = useMemo(() => STEPS.map((_, s) => monsters.filter((m) => m.step === s).length), [monsters]);
  const prelude = useMemo(() => preludeOf(settings), [settings.origin, settings.prep]);
  const introMs = introOf(prelude);
  // The song is sung in the app language; the brushing lasts as long as the song and each step as long as its verse.
  const sungIn = sungLanguageFor(language.id, SUNG_LANGUAGES);
  const stepStarts = useMemo(() => sungSteps(sungIn), [sungIn]);
  const stepLength = (k: number) => stepStarts[k + 1] - stepStarts[k];
  const totalMs = stepStarts[STEPS.length];
  const paused = clock.since === null;
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

  const say = useCallback(
    ({ text, lang }: Spoken, queue = false) => {
      if (settings.speech) speak(text, lang, { queue, rate: 0.85 });
    },
    [settings.speech],
  );

  useWakeLock(ending !== "rest");

  // The clock runs on through the end until the brush is put away; the story, the sink and tidying up tick faster for their sounds.
  const ticking = ending !== "rest" && !waiting;
  const fastTick = before !== null || done;
  useEffect(() => {
    if (!ticking || paused) return;
    const timer = setInterval(() => setNow(performance.now()), fastTick ? PRELUDE_TICK_MS : TICK_MS);
    return () => clearInterval(timer);
  }, [ticking, paused, round, fastTick]);

  // When the song is there, the clock goes on from where it waited.
  useEffect(() => {
    if (!song.ready) return;
    const t = performance.now();
    setNow(t);
    setClock((c) => (c.until === undefined ? c : { banked: readClock(c, t), since: c.since === null ? null : t }));
  }, [song.ready]);

  useEffect(() => {
    if (settings.sounds)
      loadRecordings([...(settings.origin ? ORIGIN_RECORDINGS : []), ...(settings.prep ? PREP_RECORDINGS : []), ...TIDY_RECORDINGS, "cheer"]);
  }, [settings.sounds, settings.origin, settings.prep]);

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
    if (!settings.sounds || !sounds || elapsed <= from || elapsed - from > CUE_GAP_MS) return;
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
      if (settings.sounds && part > 0) playChime();
      if (part === 0) say(daytimeText(daytime, "hello", language));
      say(preludeCue(before), part === 0);
    } else if (phase < STEPS.length) {
      // The drum roll before the brushing ends with a „Tusch“.
      if (settings.sounds) (phase === 0 ? playTusch : playChime)();
      if (!sung) say(stepText(STEPS[phase], "cue", language));
    } else {
      // Done: a fanfare of notes and children cheering, and confetti for two bars.
      if (settings.sounds) {
        [0, 1, 2, 3, 4, 5].forEach((i) => setTimeout(() => playCountNote(i), i * 120));
        setTimeout(() => playRecorded("cheer", playTusch), 700);
      }
      // The sung finale sings "Fertig, blitzeblank" itself; the voice would talk over it.
      if (!sung) say(spokenIn(DONE_SAY, language));
      // A star on the week chart, whether or not it is shown, so it is complete when turned on.
      const next = addBrushing(loadWeek(), new Date(), daytime);
      saveWeek(next);
      setWeek(next);
      // Opened by the Tagesplan's teeth card: that card is done, morning or evening.
      finishRoutineStep();
      for (let i = 0; i < 24; i++) setTimeout(() => spawn(), i * 160);
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
    if (count !== null && !paused && settings.sounds) playDrumRoll(COUNTDOWN - count);
    // Only when the number changes.
  }, [count, round]);

  useEffect(() => {
    if (goneCount > lastGone.current && settings.sounds) playPoof();
    lastGone.current = goneCount;
  }, [goneCount, settings.sounds]);

  useEffect(
    () => () => {
      if (tickleTimer.current) clearTimeout(tickleTimer.current);
    },
    [],
  );

  // Tapping isn't needed, but a tapped monster giggles and wiggles.
  // The same function from tick to tick, so the monsters in the mirror aren't drawn again with every tick (`PlacedMonster`).
  const tickle = useCallback(
    (id: number) => {
      if (settings.sounds) playSqueak();
      setTickled(id);
      if (tickleTimer.current) clearTimeout(tickleTimer.current);
      tickleTimer.current = setTimeout(() => setTickled(null), TICKLE_MS);
    },
    [settings.sounds],
  );

  const again = useCallback(() => {
    const t = performance.now();
    setClock({ banked: 0, since: t, until: song.ready ? undefined : waitAt(prelude) });
    setNow(t);
    setRound((r) => r + 1);
  }, [song.ready, prelude]);

  const togglePause = useCallback(() => {
    const t = performance.now();
    setNow(t);
    setClock((c) => (c.since === null ? { ...c, since: t } : { ...c, banked: readClock(c, t), since: null }));
  }, []);

  // Pausing stops the voice mid-sentence; going on repeats what to do.
  useEffect(() => {
    if (paused) stopSpeaking();
    else if (cue && !(sung && step)) say(cue);
    // Only when pausing or going on.
  }, [paused]);

  /** Move the clock to `at` ms after the start; a paused clock stays paused. A jump into the brushing while the song loads waits there for it. */
  const seek = useCallback(
    (at: number) => {
      const t = performance.now();
      setNow(t);
      setClock((c) => ({ banked: at, since: c.since === null ? null : t, until: c.until === undefined ? undefined : Math.max(waitAt(prelude), at) }));
    },
    [prelude],
  );

  /** Jump to the start of a part: the prelude ones first, then the steps, then the end. */
  const jumpTo = useCallback(
    (target: number) =>
      seek(target < prelude.length ? preludeStart(prelude, prelude[target]) : introMs + stepStarts[Math.min(target - prelude.length, STEPS.length)]),
    [seek, prelude, introMs, stepStarts],
  );

  /** Tapping or dragging on the progress bar jumps to that point of the brushing. */
  const seekFromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const segments = [...e.currentTarget.children];
    const i = segments.findIndex((s, k) => k === segments.length - 1 || e.clientX < s.getBoundingClientRect().right);
    const rect = segments[i].getBoundingClientRect();
    const k = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    // Stop just short of the end, so dragging to the right edge doesn't finish at once.
    seek(introMs + Math.min(stepStarts[i] + k * stepLength(i), totalMs - SEEK_END_MS));
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
  const target = step?.view ?? GRIN_VIEW;
  const view = useGlidingView(target, mouthMoves ? MOUTH_MS : TURN_MS);

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
      <span className="teeth-sky" aria-hidden>
        {daytime === "morning" ? "☀️" : "🌙"}
      </span>
      {/* Before the brushing it counts down to its start; the brushing time left sits next to the progress bar. */}
      {before && (
        <p
          className="teeth-clock"
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
          🪥 {formatTime(-brushed)}
        </p>
      )}
      {/* While brushing no text at all: the picture, the song and the voice say what to do, and the mouth gets the room. */}
      {!step && (
        <div className="teeth-heading" key={`${round}-${part}`}>
          {before ? (
            <h2 className="teeth-cue">{t(PRELUDE[before].title)}</h2>
          ) : (
            <h2 className="teeth-cue teeth-done">
              <Medal
                label={t({ de: "Goldmedaille", en: "Gold medal", zh: "金牌", hi: "स्वर्ण पदक", es: "Medalla de oro", ar: "ميدالية ذهبية", ru: "Золотая медаль" })}
              />
              {t({ de: "Geschafft!", en: "Done it!", zh: "成功啦！", hi: "हो गया!", es: "¡Lo logramos!", ar: "نجحنا!", ru: "Ура, получилось!" })}
            </h2>
          )}
          {before === "paste" && (
            <p className="teeth-mouth prep">
              👌{" "}
              {t({
                de: "Erbsengroß",
                en: "Pea-sized",
                zh: "豌豆大小",
                hi: "मटर के दाने जितना",
                es: "Del tamaño de un guisante",
                ar: "بحجم حبة البازلاء",
                ru: "С горошину",
              })}
              <span className="teeth-hint">
                {" "}
                ·{" "}
                {t({
                  de: "unter 2 Jahren nur reiskorngroß",
                  en: "under 2 years only rice-grain-sized",
                  zh: "2岁以下只要米粒大小",
                  hi: "2 साल से कम में सिर्फ़ चावल के दाने जितना",
                  es: "antes de los 2 años, solo como un grano de arroz",
                  ar: "تحت السنتين بحجم حبة الأرز فقط",
                  ru: "до 2 лет — с рисовое зёрнышко",
                })}
              </span>
            </p>
          )}
          {/* First spit out; when the brush is put away, the daytime's goodbye. */}
          {ending === "rest" ? (
            <p className="teeth-mouth goodbye" key="goodbye">
              {daytimeText(daytime, "doneTitle", language).text}
            </p>
          ) : (
            done && (
              <p className="teeth-mouth spit">
                💦 {t({ de: "Ausspucken", en: "Spit out", zh: "吐掉", hi: "थूकना", es: "Escupir", ar: "البصق", ru: "Сплюнуть" })}
                <span className="teeth-hint">
                  {" "}
                  ·{" "}
                  {t({
                    de: "nicht mit Wasser nachspülen",
                    en: "don't rinse with water",
                    zh: "不要用水漱口",
                    hi: "पानी से कुल्ला नहीं",
                    es: "sin enjuagar con agua",
                    ar: "دون المضمضة بالماء",
                    ru: "водой не полоскать",
                  })}
                </span>
              </p>
            )
          )}
        </div>
      )}

      {/* Before the picture, so it is there when the picture measures it. */}
      <div className="teeth-room" ref={room} />
      <div className="teeth-stage">
        {before === "sweets" || before === "grow" ? (
          <Origin key={round} part={before} daytime={daytime} tickled={tickled} onTickle={tickle} free={room} />
        ) : before === "brush" || before === "paste" ? (
          <Prep key={round} part={before} daytime={daytime} free={room} />
        ) : ending === "tidy" ? (
          <Prep key={round} part="tidy" daytime={daytime} free={room} />
        ) : (
          <Mouth
            key={round}
            view={view}
            zone={step && { surface: step.surface, teeth: step.teeth }}
            monsters={spots}
            brush={step && { stops: inStep.map((m) => ({ tooth: m.tooth, spot: m.spot })), at: brushStop, surface: step.surface, motion: step.motion }}
            happy={done}
            daytime={daytime}
            action={action}
            paused={paused}
            free={room}
            onTickle={tickle}
          />
        )}
      </div>

      {/* The buttons and the week's new star wait until the brush is put away. */}
      {done ? (
        ending === "rest" && (
          <div className="teeth-end">
            {settings.week && <Week log={week} today={new Date()} now={daytime} />}
            <div className="teeth-end-buttons">
              <button type="button" className="teeth-again teeth-menu" onClick={leave}>
                <MenuIcon /> {t({ de: "Menü", en: "Menu", zh: "菜单", hi: "मेन्यू", es: "Menú", ar: "القائمة", ru: "Меню" })}
              </button>
              <button type="button" className="teeth-again" onClick={again}>
                🔁 {t({ de: "Nochmal", en: "Again", zh: "再来一次", hi: "फिर से", es: "Otra vez", ar: "مرة أخرى", ru: "Ещё раз" })}
              </button>
            </div>
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
            <button
              type="button"
              className="teeth-pause"
              onClick={togglePause}
              aria-label={
                paused
                  ? t({ de: "Weiter", en: "Next", zh: "继续", hi: "आगे", es: "Siguiente", ar: "التالي", ru: "Дальше" })
                  : t({ de: "Pause", en: "Pause", zh: "暂停", hi: "रुकें", es: "Pausa", ar: "إيقاف مؤقت", ru: "Пауза" })
              }
            >
              {paused ? "▶️" : "⏸️"}
            </button>
            <div
              className="teeth-progress"
              role="slider"
              aria-label={t({ de: "Fortschritt", en: "Progress", zh: "进度", hi: "प्रगति", es: "Progreso", ar: "التقدّم", ru: "Сколько уже почищено" })}
              aria-valuemin={0}
              aria-valuemax={Math.round(totalMs / 1000)}
              aria-valuenow={Math.round(Math.max(0, Math.min(brushed, totalMs)) / 1000)}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                seekFromPointer(e);
              }}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) seekFromPointer(e);
              }}
            >
              {STEPS.map((s, i) => (
                <span
                  key={i}
                  className={`teeth-segment ${s.surface}${i === phase ? " now" : ""}`}
                  title={`${stepText(s, "title", language).text} · ${stepText(s, "hint", language).text}`}
                >
                  <span style={{ width: `${Math.max(0, Math.min(1, (brushed - stepStarts[i]) / stepLength(i))) * 100}%` }} />
                </span>
              ))}
            </div>
            {/* The brushing time left, for the grown-up; only where the screen is wide enough (teeth.css). */}
            {!before && (
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
            ⏸️
          </span>
          {t({ de: "Pause", en: "Pause", zh: "暂停", hi: "रुकें", es: "Pausa", ar: "إيقاف مؤقت", ru: "Пауза" })}
          <small>
            {touchOnly
              ? t({ de: "Tippen: weiter", en: "Tap: go on", zh: "点一下：继续", hi: "टैप: आगे", es: "Toca: seguir", ar: "لمسة: متابعة", ru: "Нажми — и дальше" })
              : t({
                  de: "Leertaste oder Tippen: weiter",
                  en: "Space or tap: go on",
                  zh: "空格键或点一下：继续",
                  hi: "स्पेस या टैप: आगे",
                  es: "Espacio o toque: seguir",
                  ar: "المسافة أو لمسة: متابعة",
                  ru: "Пробел или нажатие — и дальше",
                })}
          </small>
        </button>
      )}

      <BurstLayer bursts={bursts} />
    </div>
  );
}
