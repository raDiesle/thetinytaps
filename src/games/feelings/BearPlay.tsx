import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { COMFORTS, COMFORTS_NEEDED, FEELINGS, type ComfortId, type Feeling } from "./bear";
import { bearImages, preloadImages } from "./images";
import type { FeelingsSettings } from "./settings";
import { ChoiceCard, EndButtons, FloaterLayer, StoryPicture, useFloaters, useTimers, useVoice } from "./shared";

/** How long a kind thing plays before the next one can start. */
const COMFORT_MS = 1600;
/** Time to enjoy the happy bear before a tap or key brings the next feeling. */
const CELEBRATE_MS = 1500;
/** Where hearts and notes float up from: the middle of the picture. */
const BEAR_CHEST = { x: 50, y: 42 };

const QUESTION = "Wie kannst du ihm helfen?";

interface Round {
  key: number;
  feeling: Feeling;
  used: ComfortId[];
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

const freshRound = (feeling: Feeling, key: number): Round => ({ key, feeling, used: [], busy: false, happy: false });

export function BearPlay({ settings }: { settings: FeelingsSettings }) {
  const feelings = useMemo(() => (settings.feeling === "all" ? FEELINGS : FEELINGS.filter((f) => f.id === settings.feeling)), [settings.feeling]);
  const deck = useRef<Feeling[]>([]);
  const nextKey = useRef(0);
  const happyAt = useRef(0);
  const [round, setRound] = useState<Round>(() => freshRound(feelings[0], nextKey.current++));
  const { later, clearAll } = useTimers();
  const { say, sound } = useVoice(settings);
  const { floaters, float } = useFloaters();

  const { feeling, used, happy } = round;
  const level = Math.min(used.length, COMFORTS_NEEDED);

  const startFeeling = useCallback(
    (next: Feeling) => {
      clearAll();
      preloadImages([bearImages.feeling(next.id), bearImages.happy(next.id), ...next.comforts.map(bearImages.comfort)]);
      setRound(freshRound(next, nextKey.current++));
      say(`${next.intro} ${QUESTION}`);
      if (next.id === "scared") sound("rumble");
    },
    [clearAll, say, sound],
  );

  const nextFeeling = useCallback(() => {
    if (deck.current.length === 0) {
      deck.current = shuffle(feelings);
      const last = deck.current.length - 1;
      if (deck.current[last] === round.feeling) [deck.current[0], deck.current[last]] = [deck.current[last], deck.current[0]];
    }
    startFeeling(deck.current.pop()!);
  }, [feelings, round.feeling, startFeeling]);

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
      setRound((r) => ({ ...r, used: nowUsed, busy: true }));
      say(c.narration);
      sound(c.sound);
      float(c.float, BEAR_CHEST.x, BEAR_CHEST.y);

      later(() => {
        if (!nowHappy) {
          setRound((r) => ({ ...r, busy: false }));
          return;
        }
        const { end } = feeling;
        happyAt.current = performance.now();
        setRound((r) => ({ ...r, busy: false, happy: true }));
        say(`${end.narration} ${end.line}`, true);
        sound("chime");
        float(feeling.id === "tired" ? "💤" : "💛", BEAR_CHEST.x, BEAR_CHEST.y + 20, 5);
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

  // The bear as he feels at first, then the last kind thing the child did, and at the end happy again.
  const last = used.at(-1);
  const picture = happy ? bearImages.happy(feeling.id) : last ? bearImages.comfort(last) : bearImages.feeling(feeling.id);

  return (
    <div className="story-play bear-play" onPointerDown={() => happy && tryNextFeeling()}>
      <header className="story-top">
        <span className="fg-hearts" aria-hidden>
          {Array.from({ length: COMFORTS_NEEDED }, (_, i) => (
            <span key={i} className={`fg-heart${i < level ? " full" : ""}`}>
              💛
            </span>
          ))}
        </span>
      </header>
      <main className="story-middle">
        <StoryPicture key={`${round.key}-${picture}`} name={picture} onPointerDown={onBearPointer}>
          <FloaterLayer floaters={floaters} />
        </StoryPicture>
      </main>
      <footer className="story-choices">
        {happy ? (
          <EndButtons onAgain={() => startFeeling(feeling)} onNext={nextFeeling} />
        ) : (
          feeling.comforts.map((id) => (
            <ChoiceCard
              key={id}
              image={bearImages.comfort(id)}
              label={COMFORTS[id].label}
              state={used.includes(id) ? "done" : round.busy ? "rest" : "choose"}
              onChoose={() => comfort(id)}
            />
          ))
        )}
      </footer>
    </div>
  );
}
