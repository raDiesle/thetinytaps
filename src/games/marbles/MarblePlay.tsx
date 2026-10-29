import { useCallback, useEffect, useRef, useState, type ComponentType, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { GameEnd } from "@/components/GameEnd";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { playMelody } from "@/lib/sfx";
import { type Localized, pick, spokenIn, useAppLanguage } from "@/lib/language";
import { speak } from "@/lib/speech";
import { BathLevel } from "./BathLevel";
import { BuildingLevel } from "./BuildingLevel";
import { CircusLevel } from "./CircusLevel";
import { LEVEL_TEXTS } from "./content";
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
import { DEV } from "@/lib/buildInfo";

/** The levels in turn (names and first lines in `content.ts`). The marble run takes the rebuild and pick settings, so it is drawn by itself below (`Level` is null). */
const LEVELS: { id: MarbleLevel; emoji: string; Level: ComponentType<LevelProps> | null }[] = [
  { id: "track", emoji: "🎢", Level: null },
  { id: "machine", emoji: "⚙️", Level: MachineLevel },
  { id: "sneeze", emoji: "🤧", Level: SneezeLevel },
  { id: "kitchen", emoji: "🍳", Level: KitchenLevel },
  { id: "garden", emoji: "🌻", Level: GardenLevel },
  { id: "pegs", emoji: "📍", Level: PegsLevel },
  { id: "topple", emoji: "📚", Level: ToppleLevel },
  { id: "building", emoji: "🚧", Level: BuildingLevel },
  { id: "water", emoji: "🦆", Level: WaterLevel },
  { id: "circus", emoji: "🎪", Level: CircusLevel },
  { id: "space", emoji: "🚀", Level: SpaceLevel },
  { id: "light", emoji: "🔦", Level: LightLevel },
  { id: "bath", emoji: "🛁", Level: BathLevel },
];

/** The levels in turn, beginning with the chosen one (in development `?level=garden` in the address), so „Weiter“ always has a next. */
function chosenLevels(choice: MarbleSettings["levels"]): MarbleLevel[] {
  const fromUrl = DEV ? new URLSearchParams(window.location.search).get("level") : null;
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
export function MarblePlay({ settings }: { settings: MarbleSettings }) {
  const language = useAppLanguage();
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
  // Every line is said in the app language, with that language's voice; a line not translated yet in German, with the German voice.
  const say = useCallback(
    (text: Localized) => {
      if (!settings.speech) return;
      const line = spokenIn(text, language);
      speak(line.text, line.lang, { queue: true });
    },
    [settings.speech, language],
  );

  useEffect(() => {
    say(LEVEL_TEXTS[level.id].intro);
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
      {ended && <GameEnd onAgain={again} next={{ emoji: next.emoji, name: pick(LEVEL_TEXTS[next.id].name, language.id), onNext: goOn }} />}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
