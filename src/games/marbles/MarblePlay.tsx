import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { playMelody } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { MachineLevel } from "./MachineLevel";
import type { MarbleLevel, MarbleSettings } from "./settings";
import { ToppleLevel } from "./ToppleLevel";
import { TrackLevel } from "./TrackLevel";
import "./marbles.css";

const LEVELS: MarbleLevel[] = ["track", "topple", "machine"];

const INTRO: Record<MarbleLevel, string> = {
  track: "Tipp! Dann rollt die Kugel.",
  topple: "Tipp an, dann fällt alles um!",
  machine: "Tipp! Dann läuft die große Maschine.",
};

/** Party time after a level, before the next one starts. */
const PARTY_MS = 3200;

/**
 * "Kugelbahn": the marble run, the row of things that fall over and the big
 * machine, one level after the other (or only one of them, as the grown-up chose).
 */
export function MarblePlay({ settings, speechLang }: { settings: MarbleSettings; speechLang: string }) {
  const levels = LEVELS.includes(settings.levels as MarbleLevel) ? [settings.levels as MarbleLevel] : LEVELS;
  const [round, setRound] = useState(0);
  const [party, setParty] = useState(false);
  const level = levels[round % levels.length];
  const { bursts, spawn } = useBursts();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const sound = useCallback(
    (play: () => void) => {
      if (settings.sounds) play();
    },
    [settings.sounds],
  );
  const say = useCallback(
    (text: string) => {
      if (settings.speech) speak(text, speechLang, { queue: true });
    },
    [settings.speech, speechLang],
  );

  useEffect(() => {
    say(INTRO[level]);
  }, [level, round, say]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const onDone = useCallback(() => {
    setParty(true);
    sound(playMelody);
    for (let i = 0; i < 14; i++) timers.current.push(setTimeout(() => spawn(), i * 120));
    timers.current.push(
      setTimeout(() => {
        setParty(false);
        setRound((r) => r + 1);
      }, PARTY_MS),
    );
  }, [sound, spawn]);

  // While the party is on, taps make more shapes.
  const onPointerDown = (e: PointerEvent) => {
    if (party) spawn(e.clientX, e.clientY);
  };

  return (
    <div className={`marble-play${party ? " party" : ""}`} onPointerDown={onPointerDown}>
      {level === "track" && <TrackLevel key={round} sound={sound} say={say} onDone={onDone} />}
      {level === "topple" && <ToppleLevel key={round} sound={sound} say={say} onDone={onDone} />}
      {level === "machine" && <MachineLevel key={round} sound={sound} say={say} onDone={onDone} />}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
