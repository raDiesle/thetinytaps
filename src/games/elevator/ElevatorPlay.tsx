import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { loadRecordings, playDing, playKnock, playLift, playRandomNote, playSlide, setSfxVolume } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { RECORDINGS, RIDERS, ROOMS, texts, type Rider } from "./content";
import type { ElevatorSettings } from "./settings";

/** Time the lift takes per floor. */
const FLOOR_MS = 1300;
/** Time the doors take to open or close. */
const DOOR_MS = 650;
/** Walking time per percent of the house's width. */
const WALK_MS = 22;
/** Time after the lift has left a floor before the next animal comes to wait there. */
const NEXT_GUEST_MS = 2500;
/** Calm mode: everything a bit slower. */
const CALM_PACE = 1.4;

/** Where an animal is: walking in from the side, waiting at the lift, in the room, riding, or leaving for good. */
type Spot = "outside" | "waiting" | "room" | "cabin" | "gone";

/** Where each spot is, in percent of the house's width (the middle of the animal). */
const SPOT_X: Record<Spot, number> = { outside: -12, waiting: 62, room: 38, cabin: 82, gone: -12 };

interface Walker {
  key: number;
  rider: Rider;
  /** Floor from the ground up, 0 is "1". */
  floor: number;
  spot: Spot;
  /** Length of the current walk in ms; 0 while standing. */
  walk: number;
  /** Walking to the right: mirrored, since most animal emojis look left. */
  right: boolean;
  /** Bumped to make it hop again. */
  hop: number;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** "Aufzug" (N-37): big buttons fetch the lift; at every floor one animal gets out and another one in. */
export function ElevatorPlay({ lang, settings }: { lang: string; settings: ElevatorSettings }) {
  const count = Number(settings.floors);
  const pace = settings.calm ? CALM_PACE : 1;
  const floorMs = FLOOR_MS * pace;

  const [walkers, setWalkers] = useState<Walker[]>([]);
  const [cabin, setCabin] = useState(0);
  const [doorsOpen, setDoorsOpen] = useState(true);
  /** Length of the current ride, for the cabin's and the riders' transition. */
  const [ride, setRide] = useState(0);
  /** What the display next to the buttons shows: the floor the lift is passing, and where it is heading. */
  const [shown, setShown] = useState(0);
  const [heading, setHeading] = useState<"up" | "down" | null>(null);
  /** Pressed buttons, lit until the lift gets there. */
  const [lit, setLit] = useState<number[]>([]);
  const { bursts, spawn } = useBursts();

  // The ride logic runs from timers, so it reads and writes refs; the state above is only for drawing.
  const walkersRef = useRef<Walker[]>([]);
  const cabinRef = useRef(0);
  const queue = useRef<number[]>([]);
  /** From a button press until the lift has arrived and everyone got in and out. */
  const busy = useRef(false);
  const moving = useRef(false);
  const nextKey = useRef(0);
  const deck = useRef<Rider[]>([]);
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

  useEffect(() => {
    setSfxVolume(settings.calm ? 0.4 : 1);
  }, [settings.calm]);

  const say = useCallback(
    (text: string, queued = false) => {
      if (settings.speech) speak(text, lang, { queue: queued, rate: settings.calm ? 0.75 : 0.85 });
    },
    [settings.speech, settings.calm, lang],
  );

  const sound = (play: () => void) => {
    if (settings.sounds) play();
  };

  const updateWalkers = (change: (all: Walker[]) => Walker[]) => {
    walkersRef.current = change(walkersRef.current);
    setWalkers(walkersRef.current);
  };

  const patch = (key: number, values: Partial<Walker>) =>
    updateWalkers((all) => all.map((w) => (w.key === key ? { ...w, ...values } : w)));

  /** Sends an animal to `spot` on its floor; returns how long the walk takes. */
  const walkTo = (key: number, spot: Spot) => {
    const walker = walkersRef.current.find((w) => w.key === key);
    if (!walker) return 0;
    const ms = Math.abs(SPOT_X[spot] - SPOT_X[walker.spot]) * WALK_MS * pace;
    patch(key, { spot, walk: ms, right: SPOT_X[spot] > SPOT_X[walker.spot] });
    later(ms, () => {
      if (spot === "gone") updateWalkers((all) => all.filter((w) => w.key !== key));
      else patch(key, { walk: 0, right: false });
    });
    return ms;
  };

  const hop = (key: number) => {
    const walker = walkersRef.current.find((w) => w.key === key);
    if (walker) patch(key, { hop: walker.hop + 1 });
  };

  /** An animal nobody can see right now, all of them in turn. */
  const draw = () => {
    const visible = new Set(walkersRef.current.filter((w) => w.spot !== "gone").map((w) => w.rider.id));
    if (!deck.current.some((r) => !visible.has(r.id))) deck.current = shuffle(RIDERS);
    return deck.current.splice(
      deck.current.findIndex((r) => !visible.has(r.id)),
      1,
    )[0];
  };

  const guest = (floor: number, spot: Spot): Walker => ({
    key: nextKey.current++,
    rider: draw(),
    floor,
    spot,
    walk: 0,
    right: false,
    hop: 0,
  });

  /** A new animal walks up to wait for the lift, unless the lift stands there or someone waits already. */
  const nextGuest = (floor: number) => {
    if (floor === cabinRef.current && !moving.current) return;
    if (walkersRef.current.some((w) => w.floor === floor && w.spot === "waiting")) return;
    const walker = guest(floor, "outside");
    updateWalkers((all) => [...all, walker]);
    // One frame on the outside first, so it walks in instead of popping up.
    later(60, () => walkTo(walker.key, "waiting"));
  };

  /** The doors are open at `floor`: the rider gets out, the waiting animal gets in. */
  const exchange = (floor: number) => {
    const all = walkersRef.current;
    const inside = all.find((w) => w.spot === "cabin");
    const waiting = all.find((w) => w.spot === "waiting" && w.floor === floor);
    const resident = all.find((w) => w.spot === "room" && w.floor === floor);
    let wait = 0;
    if (inside) {
      // The one who got out here last time goes on its way and makes room.
      if (resident) walkTo(resident.key, "gone");
      const ms = walkTo(inside.key, "room");
      later(ms, () => sound(inside.rider.sound));
      say(texts.out(inside.rider), true);
      wait = ms * 0.6;
    }
    if (waiting) {
      const ms = Math.abs(SPOT_X.cabin - SPOT_X.waiting) * WALK_MS * pace;
      later(wait, () => {
        walkTo(waiting.key, "cabin");
        later(ms, () => sound(waiting.rider.sound));
      });
      say(texts.in(waiting.rider), true);
      wait += ms;
    }
    later(wait + 500, serveNext);
  };

  const arrive = (floor: number) => {
    moving.current = false;
    queue.current = queue.current.filter((f) => f !== floor);
    setLit(queue.current);
    setHeading(null);
    sound(playDing);
    say(texts.floor(floor));
    setDoorsOpen(true);
    later(150, () => sound(playSlide));
    later(DOOR_MS, () => exchange(floor));
  };

  const move = (target: number) => {
    const from = cabinRef.current;
    const up = target > from;
    const floors = Math.abs(target - from);
    const ms = floors * floorMs;
    moving.current = true;
    cabinRef.current = target;
    setCabin(target);
    setRide(ms);
    setHeading(up ? "up" : "down");
    updateWalkers((all) => all.map((w) => (w.spot === "cabin" ? { ...w, floor: target } : w)));
    // The display counts the floors as the lift passes them.
    for (let i = 1; i <= floors; i++) later(i * floorMs - floorMs * 0.4, () => setShown(from + (up ? i : -i)));
    say(up ? texts.up : texts.down);
    sound(() => playLift(ms / 1000, up));
    later(NEXT_GUEST_MS, () => nextGuest(from));
    later(ms, () => arrive(target));
  };

  /** Rides to the first pressed button, or stops with the doors open. */
  function serveNext() {
    const target = queue.current[0];
    if (target === undefined) {
      busy.current = false;
      return;
    }
    busy.current = true;
    setDoorsOpen(false);
    sound(playSlide);
    later(DOOR_MS, () => move(target));
  }

  /** The button of the floor where the lift already stands: "Pling", and the rider waves. */
  const greet = () => {
    sound(playDing);
    say(texts.floor(cabinRef.current));
    const inside = walkersRef.current.find((w) => w.spot === "cabin");
    if (inside) {
      hop(inside.key);
      later(300, () => sound(inside.rider.sound));
    }
  };

  const request = (floor: number) => {
    if (floor < 0 || floor >= count || queue.current.includes(floor)) return;
    if (floor === cabinRef.current && !moving.current) {
      greet();
      return;
    }
    sound(() => playKnock(1500));
    queue.current = [...queue.current, floor];
    setLit(queue.current);
    if (!busy.current) serveNext();
  };

  // An animal waits on every floor; the one at the bottom gets in right away.
  useEffect(() => {
    if (settings.sounds) loadRecordings(RECORDINGS);
    walkersRef.current = Array.from({ length: count }, (_, floor) => guest(floor, "waiting"));
    setWalkers(walkersRef.current);
    busy.current = true;
    later(900, () => exchange(0));
  }, []);

  const funBurst = useCallback(
    (x?: number, y?: number) => {
      spawn(x, y);
      if (settings.sounds) playRandomNote();
    },
    [spawn, settings.sounds],
  );

  const onAnimalDown = (walker: Walker) => (e: PointerEvent) => {
    e.stopPropagation();
    hop(walker.key);
    sound(walker.rider.sound);
  };

  const onButtonDown = (floor: number) => (e: PointerEvent) => {
    e.stopPropagation();
    request(floor);
  };

  // 1–5 fetch the lift, arrows ride one floor up or down, any other key makes a burst.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      const digit = Number(e.key);
      const last = queue.current.at(-1) ?? cabinRef.current;
      if (Number.isInteger(digit) && digit >= 1 && digit <= count) request(digit - 1);
      else if (e.key === "ArrowUp") request(Math.min(count - 1, last + 1));
      else if (e.key === "ArrowDown") request(Math.max(0, last - 1));
      else funBurst();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const floors = Array.from({ length: count }, (_, i) => i);

  return (
    <div
      className={`elevator-play${settings.calm ? " calm" : ""}`}
      style={{ "--floors": count } as CSSProperties}
      onPointerDown={(e) => funBurst(e.clientX, e.clientY)}
    >
      <div className="el-house">
        <div className="el-roof" />
        <div className="el-floors" style={{ "--ride": `${ride}ms` } as CSSProperties}>
          {floors.map((f) => (
            <div key={f} className="el-floor" style={{ "--f": f, background: ROOMS[f].wall } as CSSProperties}>
              <span className="el-window" />
              {ROOMS[f].things.map((thing, i) => (
                <span key={thing} className={`el-thing el-thing-${i}`} aria-hidden>
                  {thing}
                </span>
              ))}
              <span className={`el-plate${cabin === f && !heading ? " here" : ""}`} aria-hidden>
                {f + 1}
              </span>
            </div>
          ))}
          <div className="el-shaft">
            <div className="el-cabin" style={{ "--f": cabin } as CSSProperties} />
            <div className={`el-doors${doorsOpen ? " open" : ""}`} style={{ "--f": cabin } as CSSProperties}>
              <span />
              <span />
            </div>
          </div>
          {walkers.map((w) => (
            <span
              key={w.key}
              className={`el-animal${w.walk ? " walking" : ""}${w.right ? " right" : ""}${w.spot === "gone" ? " gone" : ""}`}
              style={{ "--f": w.floor, "--walk": `${w.walk}ms`, left: `${SPOT_X[w.spot]}%` } as CSSProperties}
              role="img"
              aria-label={w.rider.the}
              onPointerDown={onAnimalDown(w)}
            >
              <span className="el-face">
                <span className={`el-body${w.hop && !w.walk ? ` hop-${w.hop % 2}` : ""}`}>{w.rider.emoji}</span>
              </span>
            </span>
          ))}
        </div>
        <div className="el-ground" />
      </div>

      <div className="el-panel">
        <div className="el-display" aria-live="polite">
          <span className="el-arrow">{heading === "up" ? "▲" : heading === "down" ? "▼" : ""}</span>
          {shown + 1}
        </div>
        {[...floors].reverse().map((f) => (
          <button
            key={f}
            type="button"
            className={`el-button${lit.includes(f) ? " lit" : ""}`}
            aria-label={`Stock ${f + 1}`}
            onPointerDown={onButtonDown(f)}
          >
            {f + 1}
          </button>
        ))}
      </div>
      <BurstLayer bursts={bursts} />
    </div>
  );
}
