import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { BRIGHT_COLORS, BurstLayer, useBursts } from "@/components/Bursts";
import { Picture } from "@/components/Picture";
import { TouchKeyboard, keyRows, useTouchKeys } from "@/components/TouchKeyboard";
import { inTheme } from "@/content/themes";
import type { LanguagePack, LetterEntry, WordEntry } from "@/content/types";
import { playChime, playCountNote, playRandomNote, playWhistle, setSfxVolume } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import type { LettersSettings } from "./settings";

/** Wagons per train; the train leaves on its own when it is full. */
const TRAIN_LENGTH = 5;
/** Presses closer together than this only spawn shapes, so mashing doesn't fill the train at once. */
const MIN_WAGON_MS = 300;
/** Time to look at the full train before it leaves. */
const FULL_WAIT_MS = 1000;
/** Whistle, wagons hop one after another, then the train rolls off (see .train.leaving). */
const LEAVE_MS = 3200;
/** A new, empty train rolling in (see @keyframes train-arrive). */
const ARRIVE_MS = 1400;

const BACKGROUND = "#e3f6ff";

interface Wagon {
  id: number;
  /** What is written on the wagon, e.g. "B", "Bb" or "3". */
  label: string;
  /** Spoken when the wagon is coupled and when the train leaves. */
  spoken: string;
  /** Spoken when the wagon is tapped. */
  sentence: string;
  /** Rides on top of the wagon. */
  cargo: WordEntry;
}

type Phase = "waiting" | "leaving" | "arriving";

/**
 * Buchstaben-Zug: every letter or number key couples a wagon to the engine.
 * At five wagons, or on Space / Enter / tapping the engine, the train whistles,
 * the engine reads the wagons out and the train rolls off; a new one comes in.
 */
export function TrainPlay({ pack, settings }: { pack: LanguagePack; settings: LettersSettings }) {
  const [wagons, setWagons] = useState<Wagon[]>([]);
  const [phase, setPhase] = useState<Phase>("waiting");
  const [trainId, setTrainId] = useState(0);
  const { bursts, spawn } = useBursts();

  const lastWagon = useRef(0);
  const nextId = useRef(0);
  const wordIndex = useRef(new Map<string, number>());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const say = useCallback(
    (text: string) => {
      if (settings.speech) speak(text, pack.speechLang, { rate: settings.calm ? 0.75 : 0.85 });
    },
    [settings.speech, settings.calm, pack.speechLang],
  );

  const funBurst = useCallback(
    (x?: number, y?: number) => {
      spawn(x, y);
      if (settings.sounds) playRandomNote();
    },
    [spawn, settings.sounds],
  );

  // Cycle through the letter's words so repeated presses bring different cargo.
  const pickWord = useCallback(
    (letter: LetterEntry) => {
      const words = inTheme(letter.words, settings.theme);
      const index = wordIndex.current.get(letter.upper) ?? 0;
      wordIndex.current.set(letter.upper, index + 1);
      return words[index % words.length];
    },
    [settings.theme],
  );

  const wagonFor = useCallback(
    (key: string): Wagon | null => {
      const id = nextId.current++;
      if (/^[0-9]$/.test(key)) {
        const n = Number(key);
        const things = inTheme(pack.countables, settings.theme);
        const thing = things[id % things.length];
        return {
          id,
          label: key,
          spoken: pack.numberWords[n],
          sentence: n === 0 ? `${pack.numberWords[0]}!` : pack.countSentence(n, thing),
          cargo: n === 0 ? { word: pack.numberWords[0], emoji: pack.zero.emoji } : { word: thing.singular, emoji: thing.emoji },
        };
      }
      if (key.length !== 1) return null;
      const letter = pack.letters.find((l) => l.upper === key.toLocaleUpperCase("de-DE"));
      if (!letter) return null;
      const word = pickWord(letter);
      const label = { upper: letter.upper, both: letter.upper + letter.lower, lower: letter.lower }[settings.letterCase];
      return { id, label, spoken: letter.spoken, sentence: pack.letterSentence(letter, word), cargo: word };
    },
    [pack, pickWord, settings.theme, settings.letterCase],
  );

  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

  /** Whistle, read the wagons out and roll off; then bring in an empty train. */
  const depart = useCallback(() => {
    if (phase !== "waiting") return;
    if (settings.sounds) playWhistle();
    if (wagons.length === 0) {
      say("Tschu-tschu!");
      return;
    }
    say(`Tschu-tschu! ${wagons.map((w) => w.spoken).join(", ")}!`);
    setPhase("leaving");
    later(() => {
      setWagons([]);
      setTrainId((id) => id + 1);
      setPhase("arriving");
    }, LEAVE_MS);
    later(() => setPhase("waiting"), LEAVE_MS + ARRIVE_MS);
  }, [phase, wagons, say, settings.sounds]);

  /** A key was pressed, on the keyboard or on the screen. */
  const pressKey = useCallback(
    (key: string) => {
      if (key === " " || key === "Enter") {
        if (phase === "waiting") depart();
        else funBurst();
        return;
      }
      const now = performance.now();
      const room = phase === "waiting" && wagons.length < TRAIN_LENGTH;
      const wagon = room && now - lastWagon.current >= MIN_WAGON_MS ? wagonFor(key) : null;
      if (!wagon) {
        funBurst();
        return;
      }
      lastWagon.current = now;
      if (settings.sounds) {
        if (wagons.length === 0) playChime();
        else playCountNote(wagons.length);
      }
      say(`${wagon.spoken}!`);
      setWagons([...wagons, wagon]);
    },
    [phase, wagons, wagonFor, depart, funBurst, say, settings.sounds],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (!e.repeat) pressKey(e.key);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pressKey]);

  // A full train leaves on its own after a moment.
  useEffect(() => {
    if (phase !== "waiting" || wagons.length < TRAIN_LENGTH) return;
    const timer = setTimeout(depart, FULL_WAIT_MS);
    return () => clearTimeout(timer);
  }, [phase, wagons.length, depart]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    setSfxVolume(settings.calm ? 0.4 : 1);
  }, [settings.calm]);

  // Tablets: digits, then the alphabet.
  const touchKeys = useTouchKeys(settings.touchKeys);
  const rows = useMemo(() => keyRows([..."1234567890", ...pack.letters.map((l) => l.upper)]), [pack]);

  const tapEngine = (e: PointerEvent) => {
    e.stopPropagation();
    depart();
  };
  const tapWagon = (wagon: Wagon, e: PointerEvent) => {
    e.stopPropagation();
    if (phase === "waiting") say(wagon.sentence);
    funBurst(e.clientX, e.clientY);
  };

  const empty = wagons.length === 0 && phase === "waiting";

  return (
    <div
      className={`letters-play train-play${settings.calm ? " calm" : ""}`}
      style={{ background: BACKGROUND }}
      onPointerDown={(e) => funBurst(e.clientX, e.clientY)}
    >
      <div className="stage">
        <div className="train-scene">
          <p className={`letters-welcome train-hint${empty ? "" : " gone"}`}>
            {touchKeys ? "Tipp auf einen Buchstaben! 👇" : "Drück eine Taste! ⌨️"}
          </p>
          <div key={trainId} className={`train ${phase}`}>
            <Engine moving={phase !== "waiting"} onPointerDown={tapEngine} />
            {Array.from({ length: TRAIN_LENGTH }, (_, i) => {
              const wagon = wagons[i];
              if (!wagon) return <div key={`slot-${i}`} className="wagon slot" aria-hidden />;
              return (
                <div
                  key={wagon.id}
                  className="wagon"
                  style={{ "--wagon": BRIGHT_COLORS[wagon.id % BRIGHT_COLORS.length], "--i": i } as CSSProperties}
                  onPointerDown={(e) => tapWagon(wagon, e)}
                >
                  <div className="wagon-cargo">
                    <Picture word={wagon.cargo} />
                  </div>
                  <div className="wagon-box">{wagon.label}</div>
                  <Wheels />
                </div>
              );
            })}
          </div>
          <div className="rails" aria-hidden />
        </div>
      </div>
      {touchKeys && (
        <TouchKeyboard
          rows={rows}
          onKey={pressKey}
          label={(key) => (settings.letterCase === "lower" ? key.toLocaleLowerCase("de-DE") : key)}
        />
      )}
      <BurstLayer bursts={bursts} />
    </div>
  );
}

function Wheels() {
  return (
    <div className="wagon-wheels" aria-hidden>
      <span />
      <span />
    </div>
  );
}

/** The steam engine, facing left (the way it drives), with smoke while it moves. */
function Engine({ moving, onPointerDown }: { moving: boolean; onPointerDown: (e: PointerEvent) => void }) {
  return (
    <div className="engine" role="button" aria-label="Lok: losfahren" onPointerDown={onPointerDown}>
      {moving && (
        <div className="smoke" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      )}
      <svg viewBox="0 0 150 104" aria-hidden>
        <g stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round">
          <path d="M4 90 L16 64 L16 90 Z" fill="#ffd23f" />
          <rect x="14" y="42" width="80" height="36" rx="14" fill="#ff6b6b" />
          <path d="M22 14 H44 L40 26 V42 H26 V26 Z" fill="#4a4e69" />
          <path d="M56 42 a10 10 0 0 1 20 0 Z" fill="#ffd23f" />
          <rect x="84" y="10" width="62" height="12" rx="5" fill="#4a4e69" />
          <rect x="90" y="20" width="50" height="58" rx="6" fill="#4cc9f0" />
          <rect x="102" y="30" width="26" height="22" rx="5" fill="#e3f6ff" />
          <rect x="8" y="76" width="138" height="8" rx="3" fill="#4a4e69" />
          <g className="engine-wheel">
            <circle cx="32" cy="90" r="11" fill="#fff4d6" />
            <path d="M32 79 V101" />
            <circle cx="32" cy="90" r="3" fill="var(--ink)" />
          </g>
          <g className="engine-wheel">
            <circle cx="60" cy="90" r="11" fill="#fff4d6" />
            <path d="M60 79 V101" />
            <circle cx="60" cy="90" r="3" fill="var(--ink)" />
          </g>
          <g className="engine-wheel">
            <circle cx="114" cy="85" r="16" fill="#fff4d6" />
            <path d="M114 69 V101" />
            <circle cx="114" cy="85" r="4" fill="var(--ink)" />
          </g>
          <path d="M32 90 H114" fill="none" strokeLinecap="round" />
        </g>
        {/* A friendly face in the cab window. */}
        <circle cx="111" cy="40" r="2.5" fill="var(--ink)" />
        <circle cx="120" cy="40" r="2.5" fill="var(--ink)" />
        <path d="M110 46 Q115.5 50 121 46" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
