import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { COMFORTS, COMFORTS_NEEDED, FEELINGS, type ComfortId, type Feeling } from "./bear";
import { blendFace, MOODS } from "./Critter";
import { PlaceDrawing } from "./places";
import type { FeelingsSettings } from "./settings";
import { Actor, ChoiceCard, FloaterLayer, useFloaters, useTimers, useVoice } from "./shared";
import { GROUND, type Pose } from "./story";

/** How long a kind thing plays before the next one can start. */
const COMFORT_MS = 1600;
/** Time to enjoy the happy bear before a tap or key brings the next feeling. */
const CELEBRATE_MS = 1500;
/** Where hearts and notes float up from: the bear's chest. */
const BEAR_CHEST = { x: 50, y: 42 };

const QUESTION = "Wie kannst du ihm helfen?";

interface Round {
  key: number;
  feeling: Feeling;
  used: ComfortId[];
  pose: Pose;
  narration: string;
  line: string | null;
  busy: boolean;
  /** All kind things done and the bear has said thanks. */
  happy: boolean;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const freshRound = (feeling: Feeling, key: number): Round => ({
  key,
  feeling,
  used: [],
  pose: "stand",
  narration: feeling.intro,
  line: feeling.sound,
  busy: false,
  happy: false,
});

export function BearPlay({ settings }: { settings: FeelingsSettings }) {
  const deck = useRef<Feeling[]>([]);
  const nextKey = useRef(0);
  const happyAt = useRef(0);
  const [round, setRound] = useState<Round>(() => freshRound(FEELINGS[0], nextKey.current++));
  const { later, clearAll } = useTimers();
  const { say, sound } = useVoice(settings);
  const { floaters, float } = useFloaters();

  const { feeling, used, happy } = round;
  const level = Math.min(used.length, COMFORTS_NEEDED);
  const face = blendFace(MOODS[feeling.mood], MOODS[feeling.end.mood], level / COMFORTS_NEEDED);
  const holdsTeddy = used.includes("teddy");

  const startFeeling = useCallback(
    (next: Feeling) => {
      clearAll();
      setRound(freshRound(next, nextKey.current++));
      say(`${next.intro} ${QUESTION}`);
      if (next.id === "scared") sound("rumble");
    },
    [clearAll, say, sound],
  );

  const nextFeeling = useCallback(() => {
    if (deck.current.length === 0) {
      deck.current = shuffle(FEELINGS);
      const last = deck.current.length - 1;
      if (deck.current[last] === round.feeling) [deck.current[0], deck.current[last]] = [deck.current[last], deck.current[0]];
    }
    startFeeling(deck.current.pop()!);
  }, [round.feeling, startFeeling]);

  useEffect(() => nextFeeling(), []);

  const tryNextFeeling = () => {
    if (performance.now() - happyAt.current >= CELEBRATE_MS) nextFeeling();
  };

  const comfort = useCallback(
    (id: ComfortId) => {
      if (round.busy || happy) return;
      const c = COMFORTS[id];
      const nowUsed = used.includes(id) ? used : [...used, id];
      const nowHappy = nowUsed.length >= COMFORTS_NEEDED;
      setRound((r) => ({ ...r, used: nowUsed, pose: c.pose, narration: c.narration, line: null, busy: true }));
      say(c.narration);
      sound(c.sound);
      float(c.float, BEAR_CHEST.x, BEAR_CHEST.y);

      later(() => {
        if (!nowHappy) {
          setRound((r) => ({ ...r, pose: "stand", busy: false }));
          return;
        }
        const { end } = feeling;
        happyAt.current = performance.now();
        setRound((r) => ({
          ...r,
          pose: end.mood === "asleep" ? "breathe" : "hop",
          narration: end.narration,
          line: end.line,
          busy: false,
          happy: true,
        }));
        say(`${end.narration} ${end.line}`, true);
        sound("chime");
        float(end.mood === "asleep" ? "💤" : "💛", BEAR_CHEST.x, BEAR_CHEST.y + 20, 5);
      }, COMFORT_MS);
    },
    [round.busy, happy, used, feeling, say, sound, float, later],
  );

  /** Tapping the bear strokes him: it counts if stroking is one of the kind things, else he just giggles. */
  const onBearPointer = (e: PointerEvent) => {
    e.stopPropagation();
    if (happy) return tryNextFeeling();
    if (feeling.comforts.includes("stroke") && !used.includes("stroke")) return comfort("stroke");
    if (round.busy) return;
    float("💛", BEAR_CHEST.x, BEAR_CHEST.y, 2);
    sound("pop");
  };

  const pressKey = () => {
    if (happy) return tryNextFeeling();
    const next = feeling.comforts.find((id) => !used.includes(id));
    if (next) comfort(next);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (!e.repeat) pressKey();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pressKey]);

  const stageClass = [
    `feel-${feeling.id}`,
    (feeling.id === "tired" || feeling.id === "scared") && "night",
    used.includes("light") && "lit",
    happy && "happy",
    feeling.id === "angry" && "tower-down",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`story-play bear-play${settings.calm ? " calm" : ""}`} onPointerDown={() => happy && tryNextFeeling()}>
      <header className="story-narration">
        <span key={`${round.key}-${happy}`} className="story-tag feeling-tag">
          <span aria-hidden>{happy ? feeling.end.emoji : feeling.emoji}</span> {happy ? feeling.end.name : feeling.name}
        </span>
        <span className="fg-hearts" aria-hidden>
          {Array.from({ length: COMFORTS_NEEDED }, (_, i) => (
            <span key={i} className={`fg-heart${i < level ? " full" : ""}`}>
              💛
            </span>
          ))}
        </span>
        <p key={round.narration}>{round.narration}</p>
      </header>
      <div className="story-stage-wrap place-room">
        <div key={round.key} className={`story-stage ${stageClass}`}>
          <PlaceDrawing place="room" tower={feeling.id === "angry"} />
          {feeling.id === "tired" && (
            <span className="bear-moon" aria-hidden>
              🌙
            </span>
          )}
          {feeling.id === "scared" && (
            <span className="bear-thunder" aria-hidden>
              ⛈️
            </span>
          )}
          <Actor
            id="bear"
            className="big"
            state={{ x: 50, y: GROUND - 4, pose: round.pose, mood: feeling.mood, face: "right", holds: holdsTeddy ? "🧸" : "" }}
            face={face}
            line={round.line ?? undefined}
            onPointerDown={onBearPointer}
          />
          {used.includes("blanket") && <div className="bear-blanket" aria-hidden />}
          <FloaterLayer floaters={floaters} />
        </div>
      </div>
      <footer className="story-buttons">
        {feeling.comforts.map((id) => {
          const c = COMFORTS[id];
          const done = used.includes(id);
          return (
            <ChoiceCard
              key={id}
              picture={c.picture}
              place="room"
              label={c.label}
              state={done ? "done" : round.busy || happy ? "rest" : "choose"}
              small={happy}
              onChoose={() => comfort(id)}
            />
          );
        })}
        {happy && (
          <button
            type="button"
            className="story-button next again"
            onPointerDown={(e: PointerEvent) => {
              e.stopPropagation();
              nextFeeling();
            }}
          >
            <span className="story-button-emoji" aria-hidden>
              ▶
            </span>
            Weiter
          </button>
        )}
      </footer>
    </div>
  );
}
