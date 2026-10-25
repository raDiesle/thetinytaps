import { useCallback, useEffect, useRef, useState, type ComponentType, type RefObject } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { GameEnd } from "@/components/GameEnd";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { playMelody } from "@/lib/sfx";
import { useWakeLock } from "@/lib/wakeLock";
import { BlowPlay } from "./BlowPlay";
import { useMicrophone, type MicState } from "./mic";
import type { LoudLevel, LoudSettings } from "./settings";
import { VoicePlay } from "./VoicePlay";
import "./loud.css";

/** The microphone's loudness of one frame, in dBFS, and the time since the last one. */
export type FrameHandler = (db: number, ms: number) => void;

export interface LevelProps {
  speechLang: string;
  settings: LoudSettings;
  mic: MicState;
  /** The level puts its handler here to hear the microphone; it stays on between levels, so the browser asks only once. */
  listen: RefObject<FrameHandler | null>;
  /** Cheer, then `then`; the microphone is deaf meanwhile. */
  celebrate: (then: () => void) => void;
  /** Set when another level follows: the level calls it when it is over. */
  onDone?: () => void;
}

const LEVELS: { id: LoudLevel; emoji: string; name: string; tapHint: string; Level: ComponentType<LevelProps> }[] = [
  { id: "voice", emoji: "🦁", name: "Löwe und Maus", tapHint: "Löwe und Maus antippen", Level: VoicePlay },
  { id: "blow", emoji: "🎂", name: "Pusten", tapHint: "antippen, das pustet auch", Level: BlowPlay },
];

/** Which levels to play, in turn; in development `?level=blow` in the address picks one. */
function chosenLevels(choice: LoudSettings["levels"]): LoudLevel[] {
  const fromUrl = import.meta.env.DEV ? new URLSearchParams(window.location.search).get("level") : null;
  const one = LEVELS.find((l) => l.id === (fromUrl ?? choice));
  return one ? [one.id] : LEVELS.map((l) => l.id);
}

/** Party time after a level or a blowing picture, before the next picture (or "Nochmal" and "Weiter") comes. */
const PARTY_MS = 3200;

/**
 * "Laut und leise": everything with the microphone, one level after the
 * other (or only one, as the grown-up chose); after each level the child
 * plays it again or goes on. The microphone only measures how loud it is.
 */
export function LoudPlay({ speechLang, settings }: { speechLang: string; settings: LoudSettings }) {
  const levels = chosenLevels(settings.levels);
  // The microphone would hear the background song and take it for the child.
  useNoBackgroundMusic();
  /** Which of the chosen levels is on, and how often a level was started (a new one or the same again). */
  const [index, setIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [party, setParty] = useState(false);
  const [ended, setEnded] = useState(false);
  const levelAt = (i: number) => LEVELS.find((l) => l.id === levels[i % levels.length]) ?? LEVELS[0];
  const level = levelAt(index);
  const next = levelAt(index + 1);
  const listen = useRef<FrameHandler | null>(null);
  const partying = useRef(false);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const { bursts, spawn } = useBursts();
  useWakeLock(true);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const later = useCallback((ms: number, run: () => void) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      run();
    }, ms);
    timers.current.add(timer);
  }, []);

  const celebrate = useCallback(
    (then: () => void) => {
      partying.current = true;
      setParty(true);
      playMelody();
      for (let i = 0; i < 14; i++) later(i * 120, () => spawn());
      later(PARTY_MS, () => {
        partying.current = false;
        setParty(false);
        then();
      });
    },
    [later, spawn],
  );

  // Nobody listens during the party: the melody would blow out the next candle or wake the lion.
  const mic = useMicrophone(true, (db, ms) => {
    if (!partying.current) listen.current?.(db, ms);
  });

  const startLevel = (nextIndex: number) => {
    setEnded(false);
    setIndex(nextIndex);
    setRound((r) => r + 1);
  };

  const Level = level.Level;
  return (
    <div className={["loud-root", party && "party"].filter(Boolean).join(" ")}>
      <Level
        key={round}
        speechLang={speechLang}
        settings={settings}
        mic={mic}
        listen={listen}
        celebrate={celebrate}
        onDone={levels.length > 1 ? () => setEnded(true) : undefined}
      />
      {ended && <GameEnd onAgain={() => startLevel(index)} next={{ emoji: next.emoji, name: next.name, onNext: () => startLevel(index + 1) }} />}
      <MicNote state={mic} tapHint={level.tapHint} />
      <BurstLayer bursts={bursts} />
    </div>
  );
}

/** For the grown-up: what's up with the microphone. Tapping works meanwhile. */
function MicNote({ state, tapHint }: { state: MicState; tapHint: string }) {
  if (state === "on") return null;
  return (
    <div className={`loud-mic-note ${state}`} role="status">
      <span aria-hidden>🎤</span>
      {state === "asking" && <p>Darf das Spiel das Mikrofon benutzen? Bitte „Erlauben“ tippen. Es wird nichts aufgenommen.</p>}
      {state === "denied" && <p>Das Mikrofon ist blockiert. In den Browser-Einstellungen für diese Seite erlauben – bis dahin {tapHint}.</p>}
      {state === "missing" && <p>Kein Mikrofon gefunden – einfach {tapHint}.</p>}
    </div>
  );
}
