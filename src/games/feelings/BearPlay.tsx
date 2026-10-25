import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { COMFORTS, COMFORTS_NEEDED, FEELINGS, type ComfortId, type Feeling } from "./bear";
import { bearImages, preloadImages } from "./images";
import type { FeelingsSettings } from "./settings";
import { ChoiceCard, EndButtons, FloaterLayer, Mark, StoryPicture, useFloaters, useTimers, useVoice } from "./shared";
import { beatMs } from "./story";

/** How long a kind thing plays before the next one can start. */
const COMFORT_MS = 1600;
/** Time to enjoy the happy bear before a tap or key brings the next feeling. */
const CELEBRATE_MS = 1500;
/** Where hearts and notes float up from: the middle of the picture. */
const BEAR_CHEST = { x: 50, y: 42 };

const QUESTION = "Wie kannst du ihm helfen?";

/** A card at the bottom: one of the kind things, or the not-so-good idea. */
type Card = ComfortId | "instead";

interface Round {
  key: number;
  feeling: Feeling;
  /** The kind things and the not-so-good idea, mixed anew every round. */
  cards: Card[];
  used: ComfortId[];
  /** The not-so-good idea was tried already: its card stays crossed out. */
  tried: boolean;
  /** The not-so-good idea is shown big right now. */
  trying: boolean;
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
  cards: shuffle<Card>([...feeling.comforts, "instead"]),
  used: [],
  tried: false,
  trying: false,
  busy: false,
  happy: false,
});

export function BearPlay({ settings }: { settings: FeelingsSettings }) {
  // The feeling the grown-up picked comes first; without one all come in random order.
  const chosen = FEELINGS.find((f) => f.id === settings.feeling);
  const deck = useRef<Feeling[]>([]);
  const nextKey = useRef(0);
  const happyAt = useRef(0);
  const [round, setRound] = useState<Round>(() => freshRound(chosen ?? FEELINGS[0], nextKey.current++));
  const { later, clearAll } = useTimers();
  const { say, sound } = useVoice(settings);
  const { floaters, float } = useFloaters();

  const { feeling, used, happy } = round;

  const startFeeling = useCallback(
    (next: Feeling) => {
      clearAll();
      preloadImages([bearImages.feeling(next.id), bearImages.happy(next.id), bearImages.instead(next.id), ...next.comforts.map(bearImages.comfort)]);
      setRound(freshRound(next, nextKey.current++));
      say(`${next.intro} ${QUESTION}`);
      if (next.id === "scared") sound("rumble");
    },
    [clearAll, say, sound],
  );

  const nextFeeling = useCallback(() => {
    // After a picked feeling the others follow in order, so „Weiter“ never plays the same one again.
    if (chosen) return startFeeling(FEELINGS[(FEELINGS.indexOf(round.feeling) + 1) % FEELINGS.length]);
    if (deck.current.length === 0) {
      deck.current = shuffle(FEELINGS);
      const last = deck.current.length - 1;
      if (deck.current[last] === round.feeling) [deck.current[0], deck.current[last]] = [deck.current[last], deck.current[0]];
    }
    startFeeling(deck.current.pop()!);
  }, [chosen, round.feeling, startFeeling]);

  useEffect(() => (chosen ? startFeeling(chosen) : nextFeeling()), []);

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

  /** The not-so-good idea: shown big with a cross while it is told why it doesn't help, then the cards come back. */
  const tryInstead = useCallback(() => {
    if (round.busy || happy) return;
    const { answer } = feeling.instead;
    setRound((r) => ({ ...r, tried: true, trying: true, busy: true }));
    say(answer);
    sound("yuck");
    later(() => setRound((r) => ({ ...r, busy: false, trying: false })), beatMs({ narration: answer }, settings.speech));
  }, [round.busy, happy, feeling, say, sound, later, settings.speech]);

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
  let picture = bearImages.feeling(feeling.id);
  let caption = feeling.caption;
  if (happy) [picture, caption] = [bearImages.happy(feeling.id), feeling.endCaption];
  else if (round.trying) [picture, caption] = [bearImages.instead(feeling.id), feeling.instead.caption];
  else if (last) [picture, caption] = [bearImages.comfort(last), COMFORTS[last].caption];

  return (
    <div className="story-play bear-play" onPointerDown={() => happy && tryNextFeeling()}>
      <main className="story-middle">
        <StoryPicture key={`${round.key}-${picture}`} name={picture} caption={caption} onPointerDown={onBearPointer}>
          <FloaterLayer floaters={floaters} />
          {round.trying && <Mark good={false} className="fg-picture-mark" />}
        </StoryPicture>
      </main>
      <footer className="story-choices">
        {happy ? (
          <EndButtons onAgain={() => startFeeling(feeling)} onNext={nextFeeling} />
        ) : (
          round.cards.map((id) =>
            id === "instead" ? (
              <ChoiceCard
                key={id}
                image={bearImages.instead(feeling.id)}
                caption={feeling.instead.caption}
                state={round.tried ? "wrong" : round.busy ? "rest" : "choose"}
                onChoose={tryInstead}
              />
            ) : (
              <ChoiceCard
                key={id}
                image={bearImages.comfort(id)}
                caption={COMFORTS[id].caption}
                state={used.includes(id) ? "done" : round.busy ? "rest" : "choose"}
                onChoose={() => comfort(id)}
              />
            ),
          )
        )}
      </footer>
    </div>
  );
}
