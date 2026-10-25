import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { GameEnd } from "@/components/GameEnd";
import { useAnyKey } from "@/games/marbles/level";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { playMelody } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import type { MarbleRunSettings } from "./settings";
import { TrackLevel } from "./TrackLevel";
import "./marblerun.css";

/** Party time after the basket is full, before "Nochmal" comes. */
const PARTY_MS = 3200;

/**
 * "Kugelbahn": one tap, and the marbles roll down the long run into the
 * basket. Afterwards the child lets them roll once more.
 */
export function MarbleRunPlay({ settings, speechLang }: { settings: MarbleRunSettings; speechLang: string }) {
  /** How often the run was started; a new round puts the marbles back into the hopper. */
  const [round, setRound] = useState(0);
  // The run plays its own notes and scales; a song on top would clash with them.
  useNoBackgroundMusic();
  const [party, setParty] = useState(false);
  const [ended, setEnded] = useState(false);
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
    say("Tipp! Dann rollen die Kugeln.");
  }, [round, say]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const onDone = useCallback(() => {
    setParty(true);
    sound(playMelody);
    for (let i = 0; i < 14; i++) timers.current.push(setTimeout(() => spawn(), i * 120));
    timers.current.push(
      setTimeout(() => {
        setParty(false);
        setEnded(true);
      }, PARTY_MS),
    );
  }, [sound, spawn]);

  const again = () => {
    setEnded(false);
    setRound((r) => r + 1);
  };

  // A key starts the run, so a key starts it again after the end too.
  useAnyKey(() => {
    if (ended) again();
  });

  // While the party is on, taps make more shapes.
  const onPointerDown = (e: PointerEvent) => {
    if (party) spawn(e.clientX, e.clientY);
  };

  return (
    <div className="run-play" onPointerDown={onPointerDown}>
      <TrackLevel key={round} sound={sound} say={say} onDone={onDone} rebuild={settings.rebuild} pick={settings.pick} />
      {ended && <GameEnd onAgain={again} />}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
