import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { playMelody } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import type { MarbleSettings } from "./settings";
import { ToppleLevel } from "./ToppleLevel";
import { TrackLevel } from "./TrackLevel";
import "./marbles.css";

type Level = "track" | "topple";

const INTRO: Record<Level, string> = {
  track: "Tipp! Dann rollt die Kugel.",
  topple: "Tipp an, dann fällt alles um!",
};

/** Party time after a level, before the next one starts. */
const PARTY_MS = 3200;

/**
 * "Kugelbahn": the marble run and the row of things that fall over, one level
 * after the other (or only one of them, as the grown-up chose).
 */
export function MarblePlay({ settings, speechLang }: { settings: MarbleSettings; speechLang: string }) {
  const levels: Level[] = settings.levels === "both" ? ["track", "topple"] : [settings.levels];
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
      {level === "track" ? (
        <TrackLevel key={round} sound={sound} say={say} onDone={onDone} />
      ) : (
        <ToppleLevel key={round} sound={sound} say={say} onDone={onDone} />
      )}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
