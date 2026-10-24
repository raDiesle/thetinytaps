import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { loadRecordings, playChime, playCountNote, playDing, playKnock, playPop } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { engine, honk, RECORDINGS, SAY, VOICES } from "./content";
import { AnimalFigure, CarFigure, CarLight, StopBubble, Street, WalkLight } from "./drawings";
import type { TrafficSettings } from "./settings";
import { ANIMALS, busy, callDuck, createWorld, LANE_Y, SIDE_Y, step, toggle, VIEW_H, VIEW_W, type AnimalId, type TrafficEvent, type World } from "./world";

/** Longest step of one frame, so a hidden tab doesn't make everyone jump. */
const MAX_FRAME_MS = 50;

/** Animals on the far pavement are drawn this much smaller. */
const FAR_SCALE = 0.8;

const scaleAt = (y: number) => FAR_SCALE + ((1 - FAR_SCALE) * (y - SIDE_Y.far)) / (SIDE_Y.near - SIDE_Y.far);

declare global {
  interface Window {
    /** Development helper: the street as it is now. */
    __traffic?: World;
  }
}

/**
 * The street with the light: a tap anywhere (or any key) changes it. Green: the animals walk
 * over the zebra and the cars wait. Red: the animals stay and the cars drive. Frames run only
 * while something moves, so the picture is still between taps.
 */
export function TrafficPlay({ lang, settings }: { lang: string; settings: TrafficSettings }) {
  // One street for the whole game; its objects are changed in place by toggle() and step().
  const [world] = useState(() => createWorld(settings.duck));
  const [, setFrame] = useState(0);
  const [hops, setHops] = useState<Partial<Record<AnimalId, number>>>({});
  const [press, setPress] = useState(0);
  const raf = useRef(0);
  const last = useRef(0);
  const { bursts, spawn } = useBursts();

  const sound = (play: () => void) => {
    if (settings.sounds) play();
  };

  const hear = (events: TrafficEvent[]) => {
    for (const e of events) {
      const text = SAY[e.type];
      if (text && settings.speech) speak(text, lang, { queue: true });
      if (e.type === "change") sound(playPop);
      else if (e.type === "walk") sound(playDing);
      else if (e.type === "tick") sound(() => playKnock(2200));
      else if (e.type === "stop") sound(engine);
      else if (e.type === "start") sound(VOICES[e.id]);
      else if (e.type === "arrive") sound(() => playCountNote(ANIMALS.indexOf(e.id) + 2));
      else if (e.type === "call") sound(playChime);
      else if (e.type === "thanks") sound(VOICES.ente);
    }
  };

  const frame = (now: number) => {
    const dt = Math.min(MAX_FRAME_MS, now - last.current);
    last.current = now;
    hear(step(world, dt));
    setFrame((f) => f + 1);
    raf.current = busy(world) ? requestAnimationFrame(frame) : 0;
  };

  /** Starts the frames, unless they run already. */
  const run = () => {
    if (raf.current) return;
    last.current = performance.now();
    raf.current = requestAnimationFrame(frame);
  };

  useEffect(() => {
    if (import.meta.env.DEV) window.__traffic = world;
    return () => cancelAnimationFrame(raf.current);
  }, []);

  useEffect(() => {
    if (settings.sounds) loadRecordings(RECORDINGS);
  }, [settings.sounds]);

  /** A tap or key: the light changes; if it has only just changed, the button clicks. */
  const pushButton = () => {
    setPress((p) => p + 1);
    const events = toggle(world);
    if (events.length) {
      hear(events);
      run();
    } else sound(() => playKnock(1500));
  };

  const tapAnimal = (id: AnimalId) => (e: PointerEvent) => {
    e.stopPropagation();
    spawn(e.clientX, e.clientY);
    const called = id === "ente" ? callDuck(world) : [];
    if (called.length) {
      hear(called);
      run();
      return;
    }
    setHops((h) => ({ ...h, [id]: (h[id] ?? 0) + 1 }));
    sound(VOICES[id]);
  };

  const tapCar = (e: PointerEvent) => {
    e.stopPropagation();
    spawn(e.clientX, e.clientY);
    sound(honk);
  };

  // Every key works the button (Esc is for leaving).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      spawn();
      pushButton();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const bear = world.animals.find((a) => a.id === "baer");

  // Cars and animals are drawn from back to front.
  const things: [number, ReactNode][] = [
    ...world.cars.map((c): [number, ReactNode] => [
      LANE_Y[c.lane],
      <g key={`car${c.n}`} transform={`translate(${c.x} ${LANE_Y[c.lane]}) scale(${c.lane === 0 ? 1 : -0.9} ${c.lane === 0 ? 1 : 0.9})`}>
        <g className="amp-car" onPointerDown={tapCar}>
          <CarFigure kind={c.kind} n={c.n} rolling={c.v > 5} />
        </g>
      </g>,
    ]),
    ...world.animals.map((a): [number, ReactNode] => [
      a.y,
      <g key={a.id} transform={`translate(${a.x} ${a.y}) scale(${scaleAt(a.y)})`}>
        <g key={hops[a.id] ?? 0} className={`amp-animal${hops[a.id] ? " amp-hop" : ""}`} onPointerDown={tapAnimal(a.id)}>
          <g className={a.y !== a.ty && a.wait <= 0 ? "amp-walking" : undefined}>
            <rect x="-30" y="-110" width="60" height="114" fill="transparent" />
            <AnimalFigure id={a.id} wave={a.id === "baer" && world.duck?.stage === "called"} look={a.id === "ente" && world.duck?.stage === "look"} />
          </g>
        </g>
      </g>,
    ]),
  ];
  things.sort((p, q) => p[0] - q[0]);

  return (
    <div
      className="traffic-play"
      onPointerDown={(e) => {
        spawn(e.clientX, e.clientY);
        pushButton();
      }}
    >
      <svg className="amp-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet">
        <Street />
        <CarLight phase={world.phase} />
        {things.map(([, node]) => node)}
        <WalkLight phase={world.phase} press={press} />
        {bear && world.duck?.stage === "called" && (
          <g transform={`translate(${bear.x} ${bear.y}) scale(${scaleAt(bear.y)})`}>
            <StopBubble />
          </g>
        )}
      </svg>
      <BurstLayer bursts={bursts} />
    </div>
  );
}
