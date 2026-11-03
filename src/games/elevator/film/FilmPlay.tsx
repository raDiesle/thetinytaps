import { type CSSProperties, type PointerEvent, memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { type TargetLanguage, targetLanguageFor } from "@/content/targetLanguages";
import { INK } from "@/games/scenes/shared";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { touchOnly } from "@/lib/device";
import { useT } from "@/lib/language";
import { playPop, playRandomNote, playRecorded, playTusch } from "@/lib/sfx";
import { tapState } from "@/lib/tapTargets";
import { hush } from "@/lib/voice";
import { StoryEnd, nextCard } from "../cards";
import { translationOf } from "../phrases";
import { sayIn } from "../voice";
import type { ElevatorSettings } from "../settings";
import { Fitted, type Picture } from "../trail/items";
import type { Cue } from "../trail/types";
import type { Choice, Film, Option, Spot } from "./types";
import "./film.css";

/** Without a tap for so long, the hand points again and the question is asked again. */
const NUDGE_MS = 7000;
/** A tap while a beat still goes on is kept: at the next tap the glow shows this long, then it goes on by itself. */
const QUEUED_MS = 900;
/** How long the iris takes to close, and again to open on the next scene. */
const IRIS_MS = 450;
/** After a pick, before the film goes on: the picked card comes to the middle. */
const PICKED_MS = 1600;
/** A choice's cards come out of the picture one after the other, this long apart (their line is said meanwhile). */
const CARD_MS = 2300;
/** How long a card takes to fly out of its place in the picture. */
const FLY_MS = 650;
/** From the end of the film until „Nochmal“ and „Weiter“ come, while the strip runs through the scenes once more. */
const END_MS = 6500;
/** The language a film speaks until it is translated. */
const GERMAN = targetLanguageFor("de");

/** What the screen shows: the scene, how far its beats are, and what waits for the child. */
interface View {
  picks: string[];
  /** The scene's place in `film.scenes(picks)`. */
  scene: number;
  /** How many of its beats have started, and whether the last of them still goes on. */
  step: number;
  busy: boolean;
  /** Where the beat waiting for a tap glows. */
  spot: Spot | null;
  /** The choice waiting for a pick, and the option picked. */
  choice: Choice | null;
  /** How many of its cards have come out so far. */
  shown: number;
  picked: string | null;
  /** Bumped by the reminders and by taps beside a choice: the hand points again, the options hop. */
  nudge: number;
  /** The still hand pointing at what to tap: before the child's first tap, and after a reminder. */
  hand: boolean;
  /** The iris is closed for a cut. */
  shut: boolean;
  party: boolean;
  picking: boolean;
}

const START: View = {
  picks: [],
  scene: 0,
  step: 0,
  busy: false,
  spot: null,
  choice: null,
  shown: 0,
  picked: null,
  nudge: 0,
  hand: false,
  shut: true,
  party: false,
  picking: false,
};

/** A wait of the film's script that can be held while the film is paused. */
interface Timer {
  run: () => void;
  /** Milliseconds still to wait when it was last held (or set). */
  left: number;
  /** When it is due, while it runs. */
  due: number;
  handle: number | null;
}

/** The strip of scenes along the bottom: as tall as this share of the screen, within these pixels. */
const STRIP = { share: 0.12, min: 46, max: 92, gap: 6 };

/** A choice's card: a frame of film, its picture inside the frame, in the svg's units; and the pixels the row keeps
 * clear at both sides, for the ⏸ in the top left corner (and the same on the right, so the row stays in the middle). */
const CARD = { w: 400, h: 330, edge: 16, holes: 40, clear: 72 };

/** A film („Filme“, G-14): scenes cut one after the other, a few taps in each, and choices that pick how it goes on. */
export function FilmPlay({
  language,
  settings,
  film,
  onPick,
}: {
  /** The app language: what the child hears is spoken in it. */
  language: TargetLanguage;
  settings: ElevatorSettings;
  film: Film;
  onPick: (id: string) => void;
}) {
  const [view, setView] = useState<View>(START);
  const viewRef = useRef<View>(view);
  const { effects, ripple, glow, celebrate } = useTapFeedback();
  const t = useT();

  const put = useCallback((change: Partial<View> | ((v: View) => Partial<View>)) => {
    const patch = typeof change === "function" ? change(viewRef.current) : change;
    viewRef.current = { ...viewRef.current, ...patch };
    setView(viewRef.current);
  }, []);

  // The screen's size, so the scene's focus fills the room above the strip.
  const playEl = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1600, h: 900 });
  useLayoutEffect(() => {
    const measure = () => {
      const box = playEl.current?.getBoundingClientRect();
      if (box?.width && box.height) setSize({ w: box.width, h: box.height });
    };
    measure();
    const watch = new ResizeObserver(measure);
    if (playEl.current) watch.observe(playEl.current);
    return () => watch.disconnect();
  }, []);

  // The film is a script of waits; leaving bumps the generation and drops its timers, a pause holds them.
  const generation = useRef(0);
  const timers = useRef(new Set<Timer>());
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  /** The animations the pause held, to go on with when it ends. */
  const held = useRef<Animation[]>([]);
  useNoBackgroundMusic(paused);
  /** Set while a beat waits for a tap anywhere. */
  const tapper = useRef<(() => void) | null>(null);
  /** Set while a choice waits: it gets the picked option's id. */
  const chooser = useRef<((id: string) => void) | null>(null);
  /** A tap came while a beat still went on: the next tap beat of the scene goes on by itself. */
  const queued = useRef(false);
  /** The child has tapped once: from then on the hand comes only with a reminder. */
  const tapped = useRef(false);

  const arm = (timer: Timer) => {
    timer.due = performance.now() + timer.left;
    timer.handle = window.setTimeout(() => {
      timers.current.delete(timer);
      timer.run();
    }, timer.left);
  };

  const later = (ms: number, run: () => void) => {
    const g = generation.current;
    const timer: Timer = { run: () => g === generation.current && run(), left: ms, due: 0, handle: null };
    timers.current.add(timer);
    if (!pausedRef.current) arm(timer);
    return () => {
      if (timer.handle !== null) clearTimeout(timer.handle);
      timers.current.delete(timer);
    };
  };

  /** Holds the film where it is – its waits, everything moving in the picture, the voice and the music – or goes on. */
  const pause = (on: boolean) => {
    if (pausedRef.current === on) return;
    pausedRef.current = on;
    setPaused(on);
    const now = performance.now();
    for (const timer of timers.current) {
      if (!on) arm(timer);
      else if (timer.handle !== null) {
        clearTimeout(timer.handle);
        timer.handle = null;
        timer.left = Math.max(0, timer.due - now);
      }
    }
    if (on) {
      held.current = (playEl.current?.getAnimations({ subtree: true }) ?? []).filter((a) => a.playState === "running");
      for (const a of held.current) a.pause();
      hush();
    } else {
      for (const a of held.current) a.play();
      held.current = [];
    }
  };

  /** Resolves after `ms`; never, once the child has left, so the script just stops. */
  const wait = (ms: number) => new Promise<void>((resolve) => later(ms, resolve));

  useEffect(
    () => () => {
      generation.current++;
      for (const timer of timers.current) if (timer.handle !== null) clearTimeout(timer.handle);
    },
    [],
  );

  /** A film not yet translated into the app language is said all in German, never in two languages. */
  const voice = translationOf(film.title, language.id) === undefined ? GERMAN : language;

  /** Says a German line of the film in the app language, from its recording. */
  const say = (german: string) => sayIn(german, voice);

  const sound = (play: () => void) => {
    if (settings.sounds) play();
  };

  const cue = (sounds: Cue[]) => sounds.forEach(([ms, play]) => later(ms, () => sound(play)));

  /** Asks again every `NUDGE_MS` until stopped: the hand points again and the question is said again. */
  const remind = (ask?: string) => {
    let stop = () => {};
    const next = () => {
      stop = later(NUDGE_MS, () => {
        put((v) => ({ nudge: v.nudge + 1, hand: true }));
        if (ask) say(ask);
        next();
      });
    };
    next();
    return () => stop();
  };

  /** Waits for a tap anywhere, while the spot glows (a tap kept from before goes on by itself after a moment). */
  const waitTap = (spot: Spot, ask?: string) =>
    new Promise<void>((resolve) => {
      if (queued.current) {
        queued.current = false;
        put({ spot, hand: false });
        later(QUEUED_MS, () => {
          put({ spot: null });
          resolve();
        });
        return;
      }
      put({ spot, hand: !tapped.current, nudge: 0 });
      if (ask) say(ask);
      const stop = remind(ask);
      tapper.current = () => {
        tapper.current = null;
        tapped.current = true;
        stop();
        put({ spot: null, hand: false });
        resolve();
      };
    });

  /** Shows the choice's cards one by one, each with its sound and line, then asks and waits for the child to pick
   * one; a card already out can be picked before the others come. Every option is right. */
  const waitChoice = (choice: Choice) =>
    new Promise<string>((resolve) => {
      queued.current = false;
      put({ choice, shown: 0, picked: null, hand: false, nudge: 0 });
      let stop = () => {};
      const show = (i: number) => {
        const option = choice.options[i];
        if (!option) {
          put({ hand: !tapped.current });
          say(choice.ask);
          stop = remind(choice.ask);
          return;
        }
        put({ shown: i + 1 });
        if (option.sounds) cue(option.sounds);
        say(option.say);
        stop = later(CARD_MS, () => show(i + 1));
      };
      show(0);
      chooser.current = (id) => {
        chooser.current = null;
        tapped.current = true;
        stop();
        const option = choice.options.find((o) => o.id === id);
        if (option) say(option.say);
        sound(playPop);
        put({ picked: id, hand: false, shown: choice.options.length });
        resolve(id);
      };
    });

  const play = async () => {
    let picks: string[] = [];
    for (let i = 0; ; i++) {
      const scene = film.scenes(picks)[i];
      if (!scene) break;
      if (i > 0) {
        put({ shut: true });
        await wait(IRIS_MS);
      }
      queued.current = false;
      put({ scene: i, step: 0, busy: false, spot: null, choice: null, shown: 0, picked: null });
      await wait(60);
      put({ shut: false });
      await wait(IRIS_MS);
      for (const [j, beat] of scene.beats.entries()) {
        if (beat.tap) await waitTap(beat.tap, beat.ask);
        put({ step: j + 1, busy: true });
        if (beat.sounds) cue(beat.sounds);
        if (beat.say) say(beat.say);
        await wait(beat.ms);
        put({ busy: false });
      }
      if (scene.choice) {
        picks = [...picks, await waitChoice(scene.choice)];
        put({ picks });
        await wait(PICKED_MS);
      }
    }
    put({ party: true });
    say(film.end);
    sound(() => playRecorded("cheer", playTusch));
    celebrate();
    await wait(END_MS);
    put({ picking: true });
  };

  useEffect(() => {
    void play();
  }, []);

  const softTap = (x?: number, y?: number) => {
    ripple(x, y);
    sound(playRandomNote);
  };

  /** A tap on the picture (or a key): it sets off the waiting beat, makes the options hop, or is kept for later. */
  const tap = (x?: number, y?: number) => {
    const v = viewRef.current;
    if (v.picking || pausedRef.current) return;
    if (tapper.current) {
      glow(x, y);
      sound(playPop);
      return tapper.current();
    }
    if (chooser.current) put((w) => ({ nudge: w.nudge + 1 }));
    else if (v.busy && laterTap()) queued.current = true;
    softTap(x, y);
  };

  /** Whether a beat of this scene still waits for a tap, so a tap now can be kept for it. */
  const laterTap = () => {
    const v = viewRef.current;
    const scene = film.scenes(v.picks)[v.scene];
    return !!scene?.beats.slice(v.step).some((b) => b.tap);
  };

  const pickOption = (id: string) => (e: PointerEvent) => {
    const choose = chooser.current;
    if (!choose || pausedRef.current) return;
    e.stopPropagation();
    glow(e.clientX, e.clientY);
    choose(id);
  };

  // Any key taps; 1–3 pick an option of a choice; any key at the end goes on to the next story; paused, any key goes on.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      if (pausedRef.current) return pause(false);
      if (viewRef.current.picking) return onPick(nextCard(film.id).id);
      const { choice, shown } = viewRef.current;
      const n = Number(e.key);
      const option = chooser.current && n <= shown && choice?.options[n - 1];
      if (option && chooser.current) return chooser.current(option.id);
      tap();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const scenes = film.scenes(view.picks);
  const scene = scenes[view.scene] ?? scenes[0];
  const { Draw } = scene;
  const more = !!scenes[scenes.length - 1].choice;

  // The focus fills the screen above the strip; the picture goes on round it.
  const strip = Math.round(Math.min(STRIP.max, Math.max(STRIP.min, size.h * STRIP.share)));
  const room = { w: size.w - 2 * STRIP.gap, h: size.h - strip - 3 * STRIP.gap };
  const [fx, fy, fw, fh] = scene.focus;
  const s = Math.min(room.w / fw, room.h / fh);
  const top = fy + fh / 2 - (STRIP.gap + room.h / 2) / s;
  const vx = fx + fw / 2 - size.w / 2 / s;
  const viewBox = `${vx} ${top} ${size.w / s} ${size.h / s}`;

  // A choice's cards stand side by side in the middle of the room above the strip, as big as it allows.
  const count = view.choice?.options.length ?? 0;
  const cardGap = Math.max(12, room.w * 0.03);
  const row = size.w - 2 * CARD.clear;
  const cardW = Math.min(row * 0.31, (room.h * 0.8 * CARD.w) / CARD.h, (row - (count - 1) * cardGap) / Math.max(1, count));
  const cardH = (cardW * CARD.h) / CARD.w;
  const middle = { x: size.w / 2, y: STRIP.gap + room.h / 2 };
  const rowLeft = middle.x - (count * cardW + (count - 1) * cardGap) / 2;
  const cards = Array.from({ length: count }, (_, i) => ({ x: rowLeft + i * (cardW + cardGap), y: middle.y - cardH / 2, w: cardW, h: cardH }));

  const { spot, choice } = view;
  const goOn = t({ de: "Weiter", en: "Go on", zh: "继续", hi: "जारी रखें", es: "Seguir", ar: "متابعة", ru: "Дальше" });
  return (
    <div ref={playEl} className="fm-play" onPointerDown={(e) => tap(e.clientX, e.clientY)}>
      <svg className="fm-svg" viewBox={viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden>
        <Draw step={view.step} busy={view.busy} picks={view.picks} />
        {spot && (
          <g>
            <circle className="fm-spot" cx={spot.at[0]} cy={spot.at[1]} r={spot.r} data-tap={tapState({ goal: true })} />
            {view.hand && <Hand key={view.nudge} spot={spot} again={view.nudge > 0} />}
          </g>
        )}
        {choice?.options.map((o, i) => (
          <g
            key={o.id}
            className={`fm-option${view.picked && view.picked !== o.id ? " off" : ""}${view.picked === o.id ? " picked" : ""}`}
            onPointerDown={pickOption(o.id)}
            role="button"
            aria-label={o.say}
            data-tap={tapState({ goal: true, done: !!view.picked })}
          >
            <g transform={`translate(${o.at[0]} ${o.at[1]})`}>
              <g key={view.nudge} className={view.nudge > 0 ? "fm-hop" : undefined} style={{ animationDelay: `${i * 120}ms` }}>
                {o.sign && <circle r={o.r} fill="#fff" stroke={INK} strokeWidth="6" />}
                {o.sign && <Fitted picture={o.picture} width={o.r * 1.45} />}
                {/* Unmarked: its card is the mark, but a tap on the thing itself picks it too */}
                <circle r={o.r} fill="transparent" />
              </g>
            </g>
          </g>
        ))}
      </svg>
      {choice && (
        <>
          <div className={`fm-dim${view.shown > 0 ? " on" : ""}`} />
          {choice.options.slice(0, view.shown).map((o, i) => {
            const card = cards[i];
            const from = { x: (o.at[0] - vx) * s, y: (o.at[1] - top) * s, size: 2 * o.r * s };
            return (
              <ChoiceCard
                key={o.id}
                option={o}
                n={i + 1}
                box={card}
                from={from}
                middle={middle}
                picked={view.picked === o.id}
                off={!!view.picked && view.picked !== o.id}
                nudge={view.nudge}
                hand={view.hand && i === 0 && !view.picked}
                onPick={pickOption(o.id)}
              />
            );
          })}
        </>
      )}
      <div className={`fm-strip${view.party ? " run" : ""}`} style={{ height: strip, bottom: STRIP.gap }} aria-hidden>
        {scenes.map((sc, i) => (
          <div key={sc.id} className={`fm-frame${i < view.scene ? " done" : i === view.scene ? " now" : ""}`} style={{ animationDelay: `${i * 0.35}s` }}>
            <svg viewBox="-80 -60 160 120">
              <Fitted picture={sc.icon} width={130} height={100} />
            </svg>
          </div>
        ))}
        {/* More scenes follow, once the child has picked how */}
        {more && <div className="fm-frame more" />}
      </div>
      <div className={`fm-iris${view.shut ? " shut" : ""}`} />
      {!view.picking && (
        <button
          type="button"
          className="fm-pause"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => pause(!paused)}
          aria-label={paused ? goOn : t({ de: "Pause", en: "Pause", zh: "暂停", hi: "रुकें", es: "Pausa", ar: "إيقاف مؤقت", ru: "Пауза" })}
        >
          {paused ? "▶" : "⏸"}
        </button>
      )}
      {paused && (
        <button type="button" className="fm-paused" onPointerDown={(e) => e.stopPropagation()} onClick={() => pause(false)} aria-label={goOn}>
          ▶
        </button>
      )}
      {view.picking && <StoryEnd id={film.id} onPick={onPick} />}
      <FeedbackLayer effects={effects} />
    </div>
  );
}

/** The pointing hand, its fingertip in the lower right of the spot (below it the strip may cover it); still, or popping
 * up again after a reminder. */
function Hand({ spot: { at, r }, again }: { spot: Spot; again: boolean }) {
  return (
    <text className={`fm-hand${again ? " again" : ""}`} x={at[0] + r * 0.45} y={at[1] + r * 0.3 + 110} fontSize="120" textAnchor="middle">
      👆
    </text>
  );
}

/** Where a card stands on the screen, in pixels. */
interface CardBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** One way the film can go on, as a frame of film with a close-up of it: it flies out of its place in the picture,
 * glows until a pick, hops at a tap beside it, and when picked comes to the middle while the others fall away. */
function ChoiceCard({
  option,
  n,
  box,
  from,
  middle,
  picked,
  off,
  nudge,
  hand,
  onPick,
}: {
  option: Option;
  /** Its number, the key that picks it. */
  n: number;
  box: CardBox;
  /** Where its thing is in the picture, and how big, in pixels: it flies out from there. */
  from: { x: number; y: number; size: number };
  middle: { x: number; y: number };
  picked: boolean;
  off: boolean;
  nudge: number;
  hand: boolean;
  onPick: (e: PointerEvent) => void;
}) {
  const el = useRef<HTMLDivElement>(null);
  // Out of its place in the picture, once, as it comes; held by the pause like every animation of the film.
  useLayoutEffect(() => {
    const dx = from.x - (box.x + box.w / 2);
    const dy = from.y - (box.y + box.h / 2);
    const scale = Math.max(0.15, Math.min(1, from.size / box.w));
    el.current?.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0.4 },
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
      ],
      { duration: FLY_MS, easing: "cubic-bezier(0.3, 0.9, 0.35, 1.15)", fill: "backwards" },
    );
  }, []);
  const grow = Math.min(1.35, (middle.y * 2 * 0.9) / box.h);
  const style = {
    left: box.x,
    top: box.y,
    width: box.w,
    height: box.h,
    "--to-x": `${middle.x - (box.x + box.w / 2)}px`,
    "--to-y": `${middle.y - (box.y + box.h / 2)}px`,
    "--grow": grow,
  } as CSSProperties;
  return (
    <div
      ref={el}
      className="fm-card"
      style={style}
      onPointerDown={onPick}
      role="button"
      aria-label={option.say}
      data-tap={tapState({ goal: true, done: off || picked })}
    >
      <div className={`fm-card-move${picked ? " picked" : ""}${off ? " off" : ""}`}>
        <div key={`hop${nudge}`} className={nudge > 0 ? "fm-card-hop" : undefined} style={{ animationDelay: `${(n - 1) * 120}ms` }}>
          <FilmFrame picture={option.card} n={n} />
        </div>
        {hand && (
          <span key={`hand${nudge}`} className={`fm-card-hand${nudge > 0 ? " again" : ""}`} style={{ fontSize: box.w * 0.32 }}>
            👆
          </span>
        )}
      </div>
    </div>
  );
}

/** A frame of film round a picture: dark, with the holes along top and bottom, and on a computer the number key. */
const FilmFrame = memo(function FilmFrame({ picture, n }: { picture: Picture; n: number }) {
  const { w, h, edge, holes } = CARD;
  const inner = { x: edge, y: holes, w: w - 2 * edge, h: h - 2 * holes };
  const keys = !touchOnly();
  return (
    <svg className="fm-card-film" viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <rect width={w} height={h} rx="22" fill="#2b2d31" />
      {[holes / 2, h - holes / 2].map((y) =>
        Array.from({ length: 9 }, (_, i) => <rect key={`${y}-${i}`} x={22 + i * 42} y={y - 8} width="22" height="16" rx="5" fill="#f1f3f5" opacity="0.9" />),
      )}
      <svg x={inner.x} y={inner.y} width={inner.w} height={inner.h} viewBox={`${-picture.w / 2} ${-picture.h} ${picture.w} ${picture.h}`}>
        <rect x={-picture.w * 1.5} y={-picture.h} width={picture.w * 3} height={picture.h} fill="#e7f5ff" />
        {picture.draw()}
      </svg>
      <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="3" />
      {keys && (
        <g transform={`translate(${inner.x + 34} ${inner.y + inner.h - 34})`}>
          <rect x="-24" y="-22" width="48" height="48" rx="10" fill="#495057" />
          <rect x="-24" y="-26" width="48" height="46" rx="10" fill="#fff" stroke={INK} strokeWidth="3" />
          <text y="9" textAnchor="middle" fontSize="30" fontWeight="700" fill={INK}>
            {n}
          </text>
        </g>
      )}
    </svg>
  );
});
