import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { GameEnd } from "@/components/GameEnd";
import {
  playChime,
  playClick,
  playGiggle,
  playLaugh,
  playLullaby,
  playPlop,
  playPoof,
  playPop,
  playRandomNote,
  playRip,
  playTwinkle,
  playWhoosh,
  playYawn,
} from "@/lib/sfx";
import { useT } from "@/lib/language";
import { tapState } from "@/lib/tapTargets";
import { centre, DROP, giftById, PACIFIERS, type Spot, SPOTS, type StepId } from "./content";
import { Balloon, Fairy, Lamp, MamaFox, Pacifier, PacifierBox, Present, PresentLid, Room, TapsiAsleep, TapsiStanding, WindowSky } from "./drawings";
import type { PacifierSettings } from "./settings";

/** Where the story stands. Everything seen follows from it, together with the grown-ups' choices (farewell, gift). */
interface Story {
  step: StepId;
  /** Which of the three pacifiers are in the box or on the balloon, in the order they were tapped. */
  taken: number[];
  /** The box stands on the windowsill, or the balloon has flown away. */
  sent: boolean;
  /** The lamp is off: the room is dark, Tapsi sleeps. */
  night: boolean;
  /** Mama has gone out after her good-night kiss. */
  mamaAway: boolean;
  fairy: "out" | "in" | "gone";
  /** How often the fairy was tapped; the third time she does her magic. */
  glitters: number;
  /** The fairy took the pacifiers and left the present. */
  magic: boolean;
  morning: boolean;
  opened: boolean;
  /** The step's thing was tapped once: the pointing hand goes away. */
  tapped: boolean;
  /** Counts taps on Tapsi and Mama, so their little hop starts again each time. */
  hops: { tapsi: number; mama: number };
  /** Something is moving that the next step waits for: taps on the step's thing only sparkle. */
  busy: boolean;
}

const START: Story = {
  step: "collect",
  taken: [],
  sent: false,
  night: false,
  mamaAway: false,
  fairy: "out",
  glitters: 0,
  magic: false,
  morning: false,
  opened: false,
  tapped: false,
  hops: { tapsi: 0, mama: 0 },
  busy: false,
};

/** How often the fairy is tapped before she does her magic. */
const GLITTERS = 3;

/** A spot as a layer's place in the picture, in per cent of the 1600 × 900 stage. */
const place = (s: Spot): CSSProperties => ({ left: `${s.x / 16}%`, top: `${s.y / 9}%`, width: `${s.w / 16}%`, height: `${s.h / 9}%` });

/** Moves a layer by (dx, dy) in the stage's units and scales it (`.sf-piece`'s transform). */
const shift = (dx: number, dy: number, s = 1) => ({ "--dx": dx, "--dy": dy, "--s": s }) as CSSProperties;

/** Where the window's middle is, relative to a layer's own middle: what leaves flies there, small. */
const toWindow = (s: Spot) => {
  const from = centre(s);
  const to = centre(SPOTS.window);
  return shift(to.x - from.x, to.y - from.y, 0.12);
};

/** A layer of the picture: its own small drawing at its spot, moved and faded by CSS. */
function Piece({
  spot,
  className = "",
  style,
  onTap,
  tap,
  label,
  children,
}: {
  spot: Spot;
  className?: string;
  style?: CSSProperties;
  onTap?: (e: PointerEvent) => void;
  tap?: string;
  label?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`sf-piece ${className}`}
      style={{ ...place(spot), ...style }}
      data-tap={onTap ? tap : undefined}
      role={onTap ? "button" : undefined}
      aria-label={label}
      onPointerDown={
        onTap &&
        ((e) => {
          e.stopPropagation();
          onTap(e);
        })
      }
    >
      {children}
    </div>
  );
}

/**
 * The story of the pacifier fairy in one room, evening to morning: the child gathers Tapsi's pacifiers into the box
 * (or ties them to the balloon), puts it on the windowsill (or lets it fly), switches the lamp off, calls the fairy
 * from the window and taps her until she swaps the pacifiers for a present, wakes Tapsi up and opens the present.
 */
export function PacifierPlay({ settings }: { settings: PacifierSettings }) {
  const t = useT();
  const [story, setStory] = useState<Story>(START);
  const storyRef = useRef(story);
  storyRef.current = story;
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const { bursts, spawn } = useBursts();
  const balloon = settings.farewell === "balloon";
  const gift = giftById(settings.gift);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const sound = (play: () => void) => settings.sounds && play();
  const change = (update: Partial<Story>) => setStory((s) => ({ ...s, ...update }));
  const later = (ms: number, then: () => void) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      then();
    }, ms);
    timers.current.add(timer);
  };
  /** The next step begins: its thing glows and the hand points at it. */
  const goTo = (step: StepId) => change({ step, tapped: false, busy: false });

  /** Sparkles where the finger is (or somewhere, for a key), with a soft note: a tap that sets nothing off still does something. */
  const sparkle = (e?: PointerEvent) => {
    spawn(e?.clientX, e?.clientY);
    sound(playRandomNote);
  };

  const collect = (i: number, e?: PointerEvent) => {
    const s = storyRef.current;
    if (s.step !== "collect" || i < 0 || s.taken.includes(i)) return;
    const taken = [...s.taken, i];
    change({ taken, tapped: true });
    sound(playPop);
    later(650, () => sound(playPlop));
    if (e) spawn(e.clientX, e.clientY);
    if (taken.length < PACIFIERS.length) return;
    // All three in: the box shuts with its bow (or the balloon is ready), then it is to be sent off.
    change({ taken, tapped: true, busy: true });
    later(1000, () => sound(playTwinkle));
    later(1900, () => goTo("send"));
  };

  const send = () => {
    change({ sent: true, tapped: true, busy: true });
    sound(playWhoosh);
    later(balloon ? 2400 : 1100, () => {
      sound(playChime);
      goTo("sleep");
    });
  };

  const sleep = () => {
    change({ night: true, tapped: true, busy: true });
    sound(playClick);
    later(500, () => sound(playLullaby));
    later(2200, () => change({ mamaAway: true }));
    later(3400, () => goTo("fairy"));
  };

  const callFairy = () => {
    change({ fairy: "in", tapped: true, busy: true });
    sound(playTwinkle);
    later(1300, () => change({ busy: false }));
  };

  const glitter = (e?: PointerEvent) => {
    const glitters = storyRef.current.glitters + 1;
    change({ glitters, tapped: true });
    sound(playTwinkle);
    spawn(e?.clientX, e?.clientY);
    if (glitters < GLITTERS) return;
    // The magic: the box (or the balloon she holds) goes in a puff, the present is there, she flies out again.
    change({ glitters, tapped: true, busy: true });
    later(700, () => {
      change({ magic: true });
      sound(playPoof);
    });
    later(2100, () => {
      change({ fairy: "gone" });
      sound(playWhoosh);
    });
    later(3600, () => goTo("wake"));
  };

  const wake = () => {
    change({ morning: true, tapped: true, busy: true });
    sound(playChime);
    later(600, () => sound(playYawn));
    later(1800, () => goTo("gift"));
  };

  const open = () => {
    change({ opened: true, step: "party", tapped: true, busy: true });
    sound(playRip);
    later(450, () => {
      sound(playChime);
      for (let i = 0; i < 10; i++) later(i * 90, () => spawn());
    });
    later(900, () => sound(playLaugh));
  };

  /** Does what the step is waiting for: what every key does, and a tap on the step's thing. */
  const act = (e?: PointerEvent) => {
    const s = storyRef.current;
    if (s.busy) return sparkle(e);
    switch (s.step) {
      case "collect":
        return collect(
          PACIFIERS.findIndex((_, i) => !s.taken.includes(i)),
          e,
        );
      case "send":
        return send();
      case "sleep":
        return sleep();
      case "fairy":
        return s.fairy === "out" ? callFairy() : glitter(e);
      case "wake":
        return wake();
      case "gift":
        return open();
      default:
        return sparkle(e);
    }
  };

  const hop = (who: "tapsi" | "mama") => {
    const s = storyRef.current;
    change({ hops: { ...s.hops, [who]: s.hops[who] + 1 } });
    sound(who === "tapsi" ? playGiggle : playLaugh);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      act();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const restart = () => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    setStory(START);
  };

  const { step } = story;
  const at = (s: StepId) => step === s && !story.busy;
  const asleep = story.night && !story.morning;
  const mamaHere = !story.mamaAway || story.morning;
  const time = story.morning ? "morning" : story.night ? "night" : "evening";
  const shut = story.taken.length === PACIFIERS.length;
  const goal = goalSpot(story, balloon);

  return (
    <div className={`sf-play sf-at-${time}`} onPointerDown={(e) => sparkle(e)}>
      <div className="sf-stage">
        {(["evening", "night", "morning"] as const).map((sky) => (
          <div key={sky} className={`sf-sky${time === sky ? " on" : ""}`} style={place({ x: 915, y: 145, w: 250, h: 270 })}>
            <WindowSky time={sky} />
          </div>
        ))}
        <Room />
        <div className="sf-lamp-light" />
        <Piece
          spot={SPOTS.lamp}
          className={goalClass(at("sleep"))}
          onTap={at("sleep") ? () => sleep() : undefined}
          tap={tapState({ goal: true })}
          label={t({ de: "Lampe", en: "Lamp", zh: "台灯", hi: "लैंप", es: "Lámpara", ar: "المصباح", ru: "Лампа" })}
        >
          <Lamp on={!story.night} />
        </Piece>

        {/* Tapsi asleep under the blanket, or standing in the room */}
        <Piece
          spot={SPOTS.asleep}
          className={`sf-asleep${asleep ? " on" : ""} ${goalClass(at("wake"))}`}
          onTap={asleep ? () => (at("wake") ? wake() : sparkle()) : undefined}
          tap={tapState({ goal: at("wake") })}
          label={t({ de: "Tapsi", en: "Tapsi", zh: "塔普西", hi: "टैप्सी", es: "Tapsi", ar: "تابسي", ru: "Тапси" })}
        >
          <TapsiAsleep />
        </Piece>
        <Piece
          spot={SPOTS.tapsi}
          className={`sf-figure${asleep ? " away" : ""}${step === "party" ? " sf-cheer" : ""}`}
          onTap={asleep ? undefined : () => hop("tapsi")}
          tap={tapState({})}
          label={t({ de: "Tapsi", en: "Tapsi", zh: "塔普西", hi: "टैप्सी", es: "Tapsi", ar: "تابسي", ru: "Тапси" })}
        >
          <div key={story.hops.tapsi} className={story.hops.tapsi ? "sf-hop" : undefined}>
            <TapsiStanding />
          </div>
        </Piece>
        <Piece
          spot={SPOTS.mama}
          className={`sf-figure${mamaHere ? "" : " away"}${step === "party" ? " sf-cheer" : ""}`}
          onTap={mamaHere ? () => hop("mama") : undefined}
          tap={tapState({})}
          label={t({ de: "Mama", en: "Mommy", zh: "妈妈", hi: "मम्मी", es: "Mamá", ar: "ماما", ru: "Мама" })}
        >
          <div key={story.hops.mama} className={story.hops.mama ? "sf-hop" : undefined}>
            <MamaFox />
          </div>
        </Piece>
        {story.night && !story.mamaAway && !story.morning && (
          <span className="sf-kiss" aria-hidden>
            ❤️
          </span>
        )}

        {/* The box, or the balloon, and the pacifiers going into it */}
        {balloon ? (
          <Piece
            spot={SPOTS.balloon}
            className={`sf-balloon${story.sent ? " sent" : ""} ${goalClass(at("send"))}`}
            style={story.sent ? toWindow(SPOTS.balloon) : undefined}
            onTap={at("send") ? () => send() : undefined}
            tap={tapState({ goal: true })}
            label={t({ de: "Luftballon", en: "Balloon", zh: "气球", hi: "गुब्बारा", es: "Globo", ar: "البالون", ru: "Воздушный шарик" })}
          >
            <Balloon tied={story.taken.map((i) => PACIFIERS[i].colour)} />
          </Piece>
        ) : (
          <Piece
            spot={SPOTS.box}
            className={`sf-box${story.magic ? " gone" : ""} ${goalClass(at("send"))}`}
            style={story.sent ? shift(SPOTS.sill.x - SPOTS.box.x, SPOTS.sill.y - SPOTS.box.y, story.magic ? 0.3 : 1) : undefined}
            onTap={at("send") ? () => send() : undefined}
            tap={tapState({ goal: true })}
            label={t({
              de: "Schnullerkästchen",
              en: "Pacifier box",
              zh: "奶嘴盒",
              hi: "चुसनी का डिब्बा",
              es: "Cajita de chupetes",
              ar: "علبة اللهّايات",
              ru: "Коробочка для пустышек",
            })}
          >
            <PacifierBox inside={story.taken.map((i) => PACIFIERS[i].colour)} shut={shut} />
          </Piece>
        )}
        {PACIFIERS.map((p, i) => {
          const taken = story.taken.includes(i);
          const from = centre(p.spot);
          const to = balloon ? DROP.balloon : DROP.box;
          return (
            <Piece
              key={i}
              spot={p.spot}
              className={`sf-pacifier${taken ? " taken" : ""} ${goalClass(at("collect") && !taken)}`}
              style={taken ? shift(to.x - from.x, to.y - from.y, 0.5) : undefined}
              onTap={taken ? undefined : (e) => (step === "collect" ? collect(i, e) : sparkle(e))}
              tap={tapState({ goal: at("collect") })}
              label={t({ de: "Schnuller", en: "Pacifier", zh: "奶嘴", hi: "चुसनी", es: "Chupete", ar: "اللهّاية", ru: "Пустышка" })}
            >
              <Pacifier colour={p.colour} />
            </Piece>
          );
        })}

        <div className={`sf-night${asleep ? " on" : ""}`} />

        {/* The fairy, the star in the window that calls her, and the present she leaves */}
        {step === "fairy" && story.fairy === "out" && (
          <Piece
            spot={{ x: 990, y: 200, w: 100, h: 100 }}
            className={`sf-star ${goalClass(at("fairy"))}`}
            onTap={() => act()}
            tap={tapState({ goal: true })}
            label={t({ de: "Stern", en: "Star", zh: "星星", hi: "तारा", es: "Estrella", ar: "نجمة", ru: "Звезда" })}
          >
            <span aria-hidden>⭐</span>
          </Piece>
        )}
        {step === "fairy" && (
          <Piece
            spot={SPOTS.fairy}
            className={`sf-fairy ${story.fairy} ${goalClass(at("fairy") && story.fairy === "in")}`}
            style={story.fairy === "in" ? undefined : toWindow(SPOTS.fairy)}
            onTap={story.fairy === "in" ? (e) => (at("fairy") ? glitter(e) : sparkle(e)) : undefined}
            tap={tapState({ goal: at("fairy") })}
            label={t({
              de: "Schnullerfee",
              en: "Pacifier fairy",
              zh: "奶嘴仙子",
              hi: "चुसनी परी",
              es: "Hada del chupete",
              ar: "جنّية اللهّاية",
              ru: "Фея пустышек",
            })}
          >
            <div key={story.glitters} className={story.glitters ? "sf-twirl" : undefined}>
              <Fairy balloon={balloon} />
            </div>
            {story.glitters > 0 && (
              <span key={`g${story.glitters}`} className="sf-glitter" aria-hidden>
                <i>✨</i>
                <i>✨</i>
                <i>✨</i>
              </span>
            )}
          </Piece>
        )}
        {story.magic && (
          <Piece
            spot={SPOTS.sill}
            className={`sf-present${story.opened ? " opened" : ""} ${goalClass(at("gift"))}`}
            onTap={(e) => (at("gift") ? open() : sparkle(e))}
            tap={tapState({ goal: at("gift") })}
            label={t({ de: "Geschenk", en: "Present", zh: "礼物", hi: "तोहफ़ा", es: "Regalo", ar: "هدية", ru: "Подарок" })}
          >
            <Present />
            <div className="sf-lid">
              <PresentLid />
            </div>
            <span className="sf-gift" aria-label={t(gift.name)}>
              {gift.emoji}
            </span>
          </Piece>
        )}

        {goal && !story.tapped && !story.busy && <Hand spot={goal} />}
      </div>
      <BurstLayer bursts={bursts} />
      {step === "party" && <GameEnd onAgain={restart} corners delayMs={2400} />}
    </div>
  );
}

/** The glow round what the step waits for. */
const goalClass = (goal: boolean) => (goal ? "sf-goal" : "");

/** Where the pointing hand shows before the step's first tap: on what the step waits for. */
function goalSpot(story: Story, balloon: boolean): Spot | undefined {
  switch (story.step) {
    case "collect":
      return PACIFIERS.find((_, i) => !story.taken.includes(i))?.spot;
    case "send":
      return balloon ? { ...SPOTS.balloon, h: 200 } : SPOTS.box;
    case "sleep":
      return SPOTS.lamp;
    case "fairy":
      return story.fairy === "out" ? { x: 990, y: 200, w: 100, h: 100 } : SPOTS.fairy;
    case "wake":
      return { x: 250, y: 420, w: 140, h: 120 };
    case "gift":
      return SPOTS.sill;
    default:
      return undefined;
  }
}

/** The still pointing hand: below what it points at, or above it where that lies low in the picture. */
function Hand({ spot }: { spot: Spot }) {
  const low = spot.y + spot.h > 700;
  const x = spot.x + spot.w / 2;
  return (
    <span className={`sf-hand${low ? " above" : ""}`} style={{ left: `${x / 16}%`, top: `${(low ? spot.y : spot.y + spot.h) / 9}%` }} aria-hidden>
      {low ? "👇" : "👆"}
    </span>
  );
}
