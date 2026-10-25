import { useCallback, useEffect, useRef, useState, type ComponentType, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { GameEnd } from "@/components/GameEnd";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { playMelody } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { BuildingLevel } from "./BuildingLevel";
import { CircusLevel } from "./CircusLevel";
import { GardenLevel } from "./GardenLevel";
import { KitchenLevel } from "./KitchenLevel";
import { useAnyKey, type LevelProps } from "./level";
import { LightLevel } from "./LightLevel";
import { MachineLevel } from "./MachineLevel";
import { PegsLevel } from "./PegsLevel";
import type { MarbleLevel, MarbleSettings } from "./settings";
import { SneezeLevel } from "./SneezeLevel";
import { SpaceLevel } from "./SpaceLevel";
import { ToppleLevel } from "./ToppleLevel";
import { TrackLevel } from "./TrackLevel";
import { WaterLevel } from "./WaterLevel";
import "./marbles.css";
import "./track.css";

/** The levels in turn. The marble run takes the rebuild and pick settings, so it is drawn by itself below (`Level` is null). */
const LEVELS: { id: MarbleLevel; emoji: string; name: string; intro: string; Level: ComponentType<LevelProps> | null }[] = [
  { id: "track", emoji: "🎢", name: "Klingende Kugelbahn", intro: "Tipp! Dann rollen die Kugeln.", Level: null },
  { id: "machine", emoji: "⚙️", name: "Große Maschine", intro: "Tipp! Dann läuft die große Maschine.", Level: MachineLevel },
  { id: "sneeze", emoji: "🤧", name: "Hatschi-Kette", intro: "Tipp! Dann kitzelt die Feder die Maus.", Level: SneezeLevel },
  { id: "kitchen", emoji: "🍳", name: "Verrückte Küche", intro: "Tipp! Dann wird in der Küche gezaubert.", Level: KitchenLevel },
  { id: "garden", emoji: "🌻", name: "Im Garten", intro: "Tipp! Dann wacht der Garten auf.", Level: GardenLevel },
  { id: "pegs", emoji: "📍", name: "Nagelbrett", intro: "Tipp oben hin! Dort fällt die Kugel los.", Level: PegsLevel },
  { id: "topple", emoji: "📚", name: "Alles fällt um", intro: "Tipp an, dann fällt alles um!", Level: ToppleLevel },
  { id: "building", emoji: "🚧", name: "Baustelle", intro: "Tipp! Dann geht es los auf der Baustelle.", Level: BuildingLevel },
  { id: "water", emoji: "🦆", name: "Wasserbahn", intro: "Tipp auf das Tor! Dann schwimmt die Ente weiter.", Level: WaterLevel },
  { id: "circus", emoji: "🎪", name: "Zirkus", intro: "Tipp! Manege frei!", Level: CircusLevel },
  { id: "space", emoji: "🚀", name: "Raketenstart", intro: "Tipp! Dann startet die Rakete.", Level: SpaceLevel },
  { id: "light", emoji: "🔦", name: "Licht-Kette", intro: "Tipp! Dann geht das Licht an.", Level: LightLevel },
];

/** The levels in turn, beginning with the chosen one (in development `?level=garden` in the address), so „Weiter“ always has a next. */
function chosenLevels(choice: MarbleSettings["levels"]): MarbleLevel[] {
  const fromUrl = import.meta.env.DEV ? new URLSearchParams(window.location.search).get("level") : null;
  const first = Math.max(
    0,
    LEVELS.findIndex((l) => l.id === (fromUrl ?? choice)),
  );
  return [...LEVELS.slice(first), ...LEVELS.slice(0, first)].map((l) => l.id);
}

/** Party time after a level, before "Nochmal" and "Weiter" come. */
const PARTY_MS = 3200;

/**
 * "Kettenreaktion": one tap, and one thing sets off the next – the marble
 * run, the Rube Goldberg machines and the long row of things that fall over,
 * one level after the other (from the one the grown-up chose).
 * After each level the child plays it again or goes on.
 */
export function MarblePlay({ settings, speechLang }: { settings: MarbleSettings; speechLang: string }) {
  const levels = chosenLevels(settings.levels);
  /** Which level in turn is on, and how often a level was started (a new one or the same again). */
  const [index, setIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [party, setParty] = useState(false);
  const [ended, setEnded] = useState(false);
  const levelAt = (i: number) => LEVELS.find((l) => l.id === levels[i % levels.length]) ?? LEVELS[0];
  const level = levelAt(index);
  const next = levelAt(index + 1);
  const { bursts, spawn } = useBursts();
  // The marble run plays its own notes and scales; a song on top would clash with them.
  useNoBackgroundMusic(level.id === "track");
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
        setEnded(true);
      }, PARTY_MS),
    );
  }, [sound, spawn]);

  const startLevel = (nextIndex: number) => {
    setEnded(false);
    setIndex(nextIndex);
    setRound((r) => r + 1);
  };
  const again = () => startLevel(index);
  const goOn = () => startLevel(index + 1);

  // Keys start each level, so a key goes on after one too.
  useAnyKey(() => {
    if (ended) goOn();
  });

  // While the party is on, taps make more shapes.
  const onPointerDown = (e: PointerEvent) => {
    if (party) spawn(e.clientX, e.clientY);
  };

  return (
    <div className={`marble-play${party ? " party" : ""}`} onPointerDown={onPointerDown}>
      {level.Level ? (
        <level.Level key={round} sound={sound} say={say} onDone={onDone} />
      ) : (
        <TrackLevel key={round} sound={sound} say={say} onDone={onDone} rebuild={settings.rebuild} pick={settings.pick} />
      )}
      {ended && <GameEnd onAgain={again} next={{ emoji: next.emoji, name: next.name, onNext: goOn }} />}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
