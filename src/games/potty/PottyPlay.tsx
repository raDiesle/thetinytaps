import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { GameEnd } from "@/components/GameEnd";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { useAppLanguage, useT, voiceFor } from "@/lib/language";
import {
  playBoing,
  playFlush,
  playGiggle,
  playKnock,
  playMelody,
  playPlop,
  playPop,
  playRandomNote,
  playRip,
  playScrub,
  playSplash,
  playTrickle,
  playWaitNote,
  playWhoosh,
  recorded,
  WAIT_BEATS,
} from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { animalById, BEAT_MS, nextAnimal, PEE_MS, POTTY_TEXTS, SIT_MS, STEPS, type AnimalId, type StepId } from "./content";
import { AnimalDrawing, Bathroom, Drops, FLOOR_Y, PaperRoll, Potty, PottyFront, Sink, ThoughtBubble, Toilet } from "./drawings";
import type { PottySettings } from "./settings";

const flush = recorded("flush", playFlush);
const splash = recorded("splash", playSplash);
const scrub = recorded("scrub", playScrub);
const cheer = recorded("cheer", playMelody);
const partyHorn = recorded("partyhorn", playPop);

/** Where things stand in the bathroom (world units, see drawings.tsx). */
const POTTY_X = 520;
const TOILET_X = 880;
const SINK_X = 1230;
const PAPER = { x: 650, y: 420 };

/** Before the first tap the animal waits by the door. */
type Place = StepId | "start";

/** Where the animal stands (or sits) during each step. */
const ANIMAL_X: Record<Place, number> = { start: 230, walk: 430, down: 430, sit: POTTY_X, paper: POTTY_X, up: 430, flush: 760, wash: 1090, party: 1090 };

/** How long the animal takes to get there; the walking bob in potty.css lasts as long. */
const MOVE_MS: Partial<Record<Place, number>> = { walk: 2200, sit: 700, up: 800, flush: 1400, wash: 1500 };

/** What the camera shows in each step (world units); it zooms this into the room left between ✕ and the row of steps. */
const FOCUS: Record<Place, Box> = {
  start: { x: 20, y: 130, width: 680, height: 480 },
  walk: { x: 280, y: 250, width: 420, height: 365 },
  down: { x: 280, y: 250, width: 420, height: 365 },
  sit: { x: 340, y: 265, width: 380, height: 345 },
  paper: { x: 340, y: 265, width: 380, height: 345 },
  up: { x: 280, y: 250, width: 420, height: 365 },
  flush: { x: 610, y: 250, width: 420, height: 365 },
  wash: { x: 950, y: 250, width: 400, height: 365 },
  party: { x: 600, y: 220, width: 760, height: 395 },
};

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Room kept free around the picture's focus, in px, besides the row of steps below; the ✕ sits in a corner, beside the animal's head. */
const MARGIN = { top: 16, side: 16, bottom: 8 };

/** While sitting: sitting down, the waiting tune, the trickle, then done. */
type SitPhase = "none" | "sitting" | "waiting" | "peeing" | "done";

/** The camera's transform that fits `focus` into the free part of a `width` × `height` screen. */
function camera(focus: Box, width: number, height: number, bar: number) {
  const free = { x: MARGIN.side, y: MARGIN.top, width: width - 2 * MARGIN.side, height: height - MARGIN.top - bar - MARGIN.bottom };
  const scale = Math.max(0.05, Math.min(free.width / focus.width, free.height / focus.height));
  const x = free.x + free.width / 2 - (focus.x + focus.width / 2) * scale;
  const y = free.y + free.height / 2 - (focus.y + focus.height / 2) * scale;
  return `translate(${x}px, ${y}px) scale(${scale})`;
}

/** „Aufs Töpfchen“ (H-06): an animal goes to the potty, one tap for every step, and it ends with a party. */
export function PottyPlay({ settings }: { settings: PottySettings }) {
  const language = useAppLanguage();
  const texts = useT()(POTTY_TEXTS);
  const [animalId, setAnimalId] = useState<AnimalId>(settings.animal);
  const animal = animalById(animalId);
  /** Index in STEPS of the step going on now; -1 before the first tap. */
  const [step, setStep] = useState(-1);
  const [sit, setSit] = useState<SitPhase>("none");
  const [busy, setBusy] = useState(false);
  /** Bumped for „Nochmal“ and „Weiter“: the scene starts again without gliding back. */
  const [round, setRound] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0, bar: 0 });
  const { bursts, spawn } = useBursts();

  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLOListElement>(null);
  // A ref as well as state: a quick second tap can come before React has rendered the first.
  const busyRef = useRef(false);
  const stepRef = useRef(-1);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const later = useCallback((ms: number, run: () => void) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      run();
    }, ms);
    timers.current.add(timer);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // The waiting tune is music of its own; the background song waits meanwhile.
  useNoBackgroundMusic(sit === "waiting" && settings.sounds);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => setSize({ width: root.clientWidth, height: root.clientHeight, bar: barRef.current?.offsetHeight ?? 0 });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const say = (text: string) => {
    if (settings.speech) speak(text, voiceFor(text, language));
  };
  const sound = (ms: number, play: () => void) => {
    if (settings.sounds) later(ms, play);
  };
  const footsteps = (ms: number) => {
    for (let t = 0; t < ms; t += 320) sound(t, () => playKnock(t % 640 ? 380 : 440));
  };

  const ready = (ms: number) =>
    later(ms, () => {
      busyRef.current = false;
      setBusy(false);
    });

  /** Plays step `index`: its motion is in potty.css (by the class on the root), its sounds and words here. */
  const begin = (index: number) => {
    const { id, ms } = STEPS[index];
    stepRef.current = index;
    busyRef.current = true;
    setStep(index);
    setBusy(true);
    say(texts.steps[id](animal.name));
    switch (id) {
      case "walk":
        footsteps(MOVE_MS.walk ?? 0);
        break;
      case "down":
        sound(0, playWhoosh);
        break;
      case "sit": {
        setSit("sitting");
        sound(500, playPlop);
        const tuneMs = WAIT_BEATS * BEAT_MS;
        later(SIT_MS, () => setSit("waiting"));
        for (let beat = 0; beat < WAIT_BEATS; beat++) sound(SIT_MS + beat * BEAT_MS, () => playWaitNote(beat));
        later(SIT_MS + tuneMs, () => {
          setSit("peeing");
          if (settings.sounds) playTrickle();
          say(texts.pee);
        });
        later(SIT_MS + tuneMs + PEE_MS, () => setSit("done"));
        ready(SIT_MS + tuneMs + PEE_MS);
        return;
      }
      case "paper":
        sound(650, playRip);
        sound(1300, playGiggle);
        break;
      case "up":
        setSit("none");
        sound(0, playBoing);
        sound(500, playWhoosh);
        break;
      case "flush":
        footsteps(MOVE_MS.flush ?? 0);
        sound(1700, playPlop);
        sound(1900, splash);
        sound(2800, flush);
        break;
      case "wash":
        footsteps(MOVE_MS.wash ?? 0);
        sound(1800, splash);
        sound(2500, scrub);
        sound(3700, splash);
        break;
      case "party":
        sound(0, cheer);
        sound(300, partyHorn);
        for (let i = 0; i < 12; i++) later(i * 150, () => spawn());
        break;
    }
    ready(ms);
  };

  /** A tap or key: the next step when the last one has finished, a sparkle while it still runs. */
  const act = (x?: number, y?: number) => {
    const next = stepRef.current + 1;
    if (busyRef.current || next >= STEPS.length) {
      spawn(x, y);
      if (settings.sounds) playRandomNote();
      return;
    }
    begin(next);
  };

  const restart = (id: AnimalId) => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    setAnimalId(id);
    setRound((r) => r + 1);
    stepRef.current = -1;
    busyRef.current = false;
    setStep(-1);
    setSit("none");
    setBusy(false);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      act();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const place: Place = step < 0 ? "start" : STEPS[step].id;
  const at = (from: StepId) => step >= STEPS.findIndex((s) => s.id === from);
  const pantsDown = place === "down" || place === "sit" || place === "paper";
  const sitting = place === "sit" || place === "paper";
  const peed = (place === "sit" && (sit === "peeing" || sit === "done")) || place === "paper" || place === "up";
  const happy = sit === "peeing" || place === "party";
  const flags = [
    `pt-at-${place}`,
    busy && "busy",
    pantsDown && "pt-pants-down",
    sitting && "pt-sitting",
    peed && "pt-peed",
    happy && "pt-happy",
    sit === "waiting" && "pt-waiting",
    sit === "peeing" && "pt-peeing",
    at("flush") && "pt-potty-away",
  ].filter(Boolean);
  const done = step === STEPS.length - 1;
  const next = nextAnimal(animalId);

  return (
    <div ref={rootRef} className={`potty-play ${flags.join(" ")}`} onPointerDown={(e: PointerEvent) => act(e.clientX, e.clientY)}>
      <svg className="pt-scene" width="100%" height="100%" aria-hidden>
        {size.width > 0 && (
          <g key={round} className="pt-camera" style={{ transform: camera(FOCUS[place], size.width, size.height, size.bar) }}>
            <Bathroom />
            <g transform={`translate(${PAPER.x} ${PAPER.y})`}>
              <PaperRoll />
            </g>
            <g transform={`translate(${TOILET_X} ${FLOOR_Y})`}>
              <Toilet />
            </g>
            <g transform={`translate(${SINK_X} ${FLOOR_Y})`}>
              <Sink />
            </g>
            <g transform={`translate(${POTTY_X} ${FLOOR_Y})`}>
              <g className="pt-potty-move">
                <Potty />
              </g>
            </g>
            <g
              className="pt-animal-pos"
              style={{ transform: `translate(${ANIMAL_X[place]}px, ${FLOOR_Y}px)`, "--move-ms": `${MOVE_MS[place] ?? 0}ms` } as CSSProperties}
            >
              <g className="pt-bob">
                <AnimalDrawing animal={animal} />
              </g>
              <ThoughtBubble />
            </g>
            <g transform={`translate(${POTTY_X} ${FLOOR_Y})`}>
              <PottyFront />
              <Drops />
            </g>
          </g>
        )}
      </svg>

      <ol ref={barRef} className="pt-steps" aria-hidden>
        {STEPS.map((s, i) => (
          <li key={s.id} className={i < step ? "done" : i === step ? "now" : undefined}>
            {s.icon}
            {s.arrow && <span className="pt-arrow">{s.arrow}</span>}
          </li>
        ))}
      </ol>

      {done && (
        <GameEnd delayMs={STEPS[step].ms} onAgain={() => restart(animalId)} next={{ emoji: next.emoji, name: next.name, onNext: () => restart(next.id) }} />
      )}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
