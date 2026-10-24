import { useCallback, useEffect, useRef, useState, type ComponentType, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { playMelody } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { BuildingLevel } from "./BuildingLevel";
import { CircusLevel } from "./CircusLevel";
import { GardenLevel } from "./GardenLevel";
import { KitchenLevel } from "./KitchenLevel";
import type { LevelProps } from "./level";
import { MachineLevel } from "./MachineLevel";
import type { MarbleLevel, MarbleSettings } from "./settings";
import { SpaceLevel } from "./SpaceLevel";
import { ToppleLevel } from "./ToppleLevel";
import { TrackLevel } from "./TrackLevel";
import "./marbles.css";

const LEVELS: { id: MarbleLevel; intro: string; Level: ComponentType<LevelProps> }[] = [
  { id: "track", intro: "Tipp! Dann rollt die Kugel.", Level: TrackLevel },
  { id: "topple", intro: "Tipp an, dann fällt alles um!", Level: ToppleLevel },
  { id: "machine", intro: "Tipp! Dann läuft die große Maschine.", Level: MachineLevel },
  { id: "kitchen", intro: "Tipp! Dann wird in der Küche gezaubert.", Level: KitchenLevel },
  { id: "garden", intro: "Tipp! Dann wacht der Garten auf.", Level: GardenLevel },
  { id: "building", intro: "Tipp! Dann geht es los auf der Baustelle.", Level: BuildingLevel },
  { id: "circus", intro: "Tipp! Manege frei!", Level: CircusLevel },
  { id: "space", intro: "Tipp! Dann startet die Rakete.", Level: SpaceLevel },
];

/** The Rube Goldberg machines: one tap, and one thing sets off the next. */
const MACHINES: MarbleLevel[] = ["machine", "kitchen", "garden", "building", "circus", "space"];

/** Which levels to play, in turn; in development `?level=garden` in the address picks one. */
function chosenLevels(choice: MarbleSettings["levels"]): MarbleLevel[] {
  const fromUrl = import.meta.env.DEV ? new URLSearchParams(window.location.search).get("level") : null;
  const one = LEVELS.find((l) => l.id === (fromUrl ?? choice));
  if (one) return [one.id];
  return choice === "machines" ? MACHINES : LEVELS.map((l) => l.id);
}

/** Party time after a level, before the next one starts. */
const PARTY_MS = 3200;

/**
 * "Kugelbahn": the marble run, the row of things that fall over and the Rube
 * Goldberg machines, one level after the other (or only some of them, as the
 * grown-up chose).
 */
export function MarblePlay({ settings, speechLang }: { settings: MarbleSettings; speechLang: string }) {
  const levels = chosenLevels(settings.levels);
  const [round, setRound] = useState(0);
  const [party, setParty] = useState(false);
  const level = LEVELS.find((l) => l.id === levels[round % levels.length]) ?? LEVELS[0];
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
    say(level.intro);
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
      <level.Level key={round} sound={sound} say={say} onDone={onDone} rebuild={settings.rebuild} />
      <BurstLayer bursts={bursts} />
    </div>
  );
}
