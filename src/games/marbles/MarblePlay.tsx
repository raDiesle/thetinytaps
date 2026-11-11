import { useCallback, useEffect, useRef, useState, type ComponentType, type PointerEvent } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { GameEnd } from "@/components/GameEnd";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { playLullaby, playMelody } from "@/lib/sfx";
import { type Localized, pick, useAppLanguage } from "@/lib/language";
import { BathLevel } from "./BathLevel";
import { BuildingLevel } from "./BuildingLevel";
import { CircusLevel } from "./CircusLevel";
import { LEVEL_TEXTS } from "./content";
import { FarmLevel } from "./FarmLevel";
import { GardenLevel } from "./GardenLevel";
import { KitchenLevel } from "./KitchenLevel";
import { useAnyKey, type LevelProps } from "./level";
import { LightLevel } from "./LightLevel";
import { MachineLevel } from "./MachineLevel";
import { NightLevel } from "./NightLevel";
import { PegsLevel } from "./PegsLevel";
import type { MarbleLevel, MarbleSettings } from "./settings";
import { SneezeLevel } from "./SneezeLevel";
import { SpaceLevel } from "./SpaceLevel";
import { TidyLevel } from "./TidyLevel";
import { ToppleLevel } from "./ToppleLevel";
import { ColorTrackLevel, SiteTrackLevel, SlideTrackLevel, SnowTrackLevel, SpaceTrackLevel, TrackLevel } from "./TrackLevel";
import { marblesVoice } from "./voice";
import { WaterLevel } from "./WaterLevel";
import "./marbles.css";
import "./track.css";
import { DEV } from "@/lib/buildInfo";

/** The levels in turn (names and first lines in `content.ts`). */
const LEVELS: { id: MarbleLevel; Level: ComponentType<LevelProps> }[] = [
  { id: "track", Level: TrackLevel },
  { id: "colortrack", Level: ColorTrackLevel },
  { id: "snowtrack", Level: SnowTrackLevel },
  { id: "spacetrack", Level: SpaceTrackLevel },
  { id: "slidetrack", Level: SlideTrackLevel },
  { id: "sitetrack", Level: SiteTrackLevel },
  { id: "machine", Level: MachineLevel },
  { id: "sneeze", Level: SneezeLevel },
  { id: "kitchen", Level: KitchenLevel },
  { id: "garden", Level: GardenLevel },
  { id: "pegs", Level: PegsLevel },
  { id: "topple", Level: ToppleLevel },
  { id: "building", Level: BuildingLevel },
  { id: "water", Level: WaterLevel },
  { id: "circus", Level: CircusLevel },
  { id: "space", Level: SpaceLevel },
  { id: "light", Level: LightLevel },
  { id: "bath", Level: BathLevel },
  { id: "farm", Level: FarmLevel },
  { id: "night", Level: NightLevel },
  { id: "tidy", Level: TidyLevel },
];

/** The marble runs, the wooden one and its other worlds (K-18). */
const RUNS: MarbleLevel[] = ["track", "colortrack", "snowtrack", "spacetrack", "slidetrack", "sitetrack"];

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
  const { effects, ripple } = useTapFeedback();
  // The marble runs play their own notes and scales, and the good-night machine its music box: a song on top would clash with them.
  useNoBackgroundMusic(RUNS.includes(level.id) || level.id === "night");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const sound = useCallback(
    (play: () => void) => {
      if (settings.sounds) play();
    },
    [settings.sounds],
  );
  // Every line is said from its ElevenLabs recording in the app language; a line not translated yet in German. Lines wait
  // for each other, but a level's first line cuts off what is still said from before.
  const say = useCallback((text: Localized, queue = true) => marblesVoice.say(pick(text, language.id), language.id, { queue }), [language.id]);
  // Its few dozen lines are fetched as it starts, so none comes late (src/lib/voice.ts: `loadAll` only for so few).
  useEffect(() => marblesVoice.loadAll(language.id), [language.id]);

  useEffect(() => {
    say(LEVEL_TEXTS[level.id].intro, false);
  }, [level, round, say]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const onDone = useCallback(() => {
    setParty(true);
    // The good-night machine ends as calmly as it ran.
    sound(level.id === "night" ? playLullaby : playMelody);
    timers.current.push(
      setTimeout(() => {
        setParty(false);
        setEnded(true);
      }, PARTY_MS),
    );
  }, [sound, level.id]);

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

  // While the party is on, taps make ripples.
  const onPointerDown = (e: PointerEvent) => {
    if (party) ripple(e.clientX, e.clientY);
  };

  return (
    <div className={`marble-play${party ? " party" : ""}`} data-level={level.id} onPointerDown={onPointerDown}>
      <level.Level key={round} sound={sound} say={say} onDone={onDone} watch={settings.play === "watch"} />
      {ended && <GameEnd level={level.id} onAgain={again} next={{ name: pick(LEVEL_TEXTS[next.id].name, language.id), onNext: goOn }} />}
      <FeedbackLayer effects={effects} />
    </div>
  );
}
