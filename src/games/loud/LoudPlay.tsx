import { useCallback, useEffect, useRef, useState, type ComponentType, type RefObject } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { playMelody, setSfxVolume } from "@/lib/sfx";
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

const LEVELS: { id: LoudLevel; tapHint: string; Level: ComponentType<LevelProps> }[] = [
  { id: "voice", tapHint: "Löwe und Maus antippen", Level: VoicePlay },
  { id: "blow", tapHint: "antippen, das pustet auch", Level: BlowPlay },
];

/** Which levels to play, in turn; in development `?level=blow` in the address picks one. */
function chosenLevels(choice: LoudSettings["levels"]): LoudLevel[] {
  const fromUrl = import.meta.env.DEV ? new URLSearchParams(window.location.search).get("level") : null;
  const one = LEVELS.find((l) => l.id === (fromUrl ?? choice));
  return one ? [one.id] : LEVELS.map((l) => l.id);
}

/** Party time after a level or a blowing picture, before the next one starts. */
const PARTY_MS = 3200;

/**
 * "Laut und leise": everything with the microphone, one level after the
 * other (or only one, as the grown-up chose). The microphone only measures
 * how loud it is.
 */
export function LoudPlay({ speechLang, settings }: { speechLang: string; settings: LoudSettings }) {
  const levels = chosenLevels(settings.levels);
  const [round, setRound] = useState(0);
  const [party, setParty] = useState(false);
  const level = LEVELS.find((l) => l.id === levels[round % levels.length]) ?? LEVELS[0];
  const listen = useRef<FrameHandler | null>(null);
  const partying = useRef(false);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const { bursts, spawn } = useBursts();
  useWakeLock(true);

  useEffect(() => {
    setSfxVolume(settings.calm ? 0.4 : 1);
  }, [settings.calm]);

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
      for (let i = 0; i < (settings.calm ? 4 : 14); i++) later(i * 120, () => spawn());
      later(PARTY_MS, () => {
        partying.current = false;
        setParty(false);
        then();
      });
    },
    [later, settings.calm, spawn],
  );

  // Nobody listens during the party: the melody would blow out the next candle or wake the lion.
  const mic = useMicrophone(true, (db, ms) => {
    if (!partying.current) listen.current?.(db, ms);
  });

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
        onDone={levels.length > 1 ? () => setRound((r) => r + 1) : undefined}
      />
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
