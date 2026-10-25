import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { COMFORTS, COMFORTS_NEEDED, type ComfortId, type Feeling, type FeelingId } from "./bear";
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

/** What floats up when he is happy again, if not hearts. */
const END_FLOAT: Partial<Record<FeelingId, string>> = { tired: "💤", happy: "🎉" };

interface Round {
  /** Changes when the feeling is played again, so its pictures start fresh. */
  key: number;
  used: ComfortId[];
  /** The not-so-good idea was tried already: its card stays crossed out. */
  tried: boolean;
  /** The not-so-good idea is shown big right now. */
  trying: boolean;
  busy: boolean;
  /** All kind things done and the bear has said thanks. */
  happy: boolean;
}

const freshRound = (key: number): Round => ({
  key,
  used: [],
  tried: false,
  trying: false,
  busy: false,
  happy: false,
});

/** Zu Hause: one feeling of the bear, until he is happy again. `onNext` goes on to the next story. */
export function BearPlay({ feeling, settings, onNext }: { feeling: Feeling; settings: FeelingsSettings; onNext: () => void }) {
  const nextKey = useRef(0);
  const happyAt = useRef(0);
  const [round, setRound] = useState<Round>(() => freshRound(nextKey.current++));
  const { later, clearAll } = useTimers();
  const { say, sound } = useVoice(settings);
  const { floaters, float } = useFloaters();

  const { used, happy } = round;

  const startFeeling = useCallback(() => {
    clearAll();
    preloadImages([bearImages.feeling(feeling.id), bearImages.happy(feeling.id), bearImages.instead(feeling.id), ...feeling.comforts.map(bearImages.comfort)]);
    setRound(freshRound(nextKey.current++));
    say(`${feeling.intro} ${feeling.question ?? QUESTION}`);
    if (feeling.id === "scared") sound("rumble");
  }, [feeling, clearAll, say, sound]);

  useEffect(() => startFeeling(), []);

  const tryNextFeeling = () => {
    if (performance.now() - happyAt.current >= CELEBRATE_MS) onNext();
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
        float(END_FLOAT[feeling.id] ?? "💛", BEAR_CHEST.x, BEAR_CHEST.y + 20, 5);
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
  let caption = feeling.title;
  if (happy) [picture, caption] = [bearImages.happy(feeling.id), feeling.endCaption];
  else if (round.trying) [picture, caption] = [bearImages.instead(feeling.id), feeling.instead.caption];
  else if (last) [picture, caption] = [bearImages.comfort(last), COMFORTS[last].caption];

  return (
    // While the child chooses, the cards are big and the bear's picture makes room for them.
    <div className={`story-play bear-play${happy || round.busy ? "" : " choosing"}`} onPointerDown={() => happy && tryNextFeeling()}>
      <main className="story-middle">
        <StoryPicture key={`${round.key}-${picture}`} name={picture} caption={caption} onPointerDown={onBearPointer}>
          <FloaterLayer floaters={floaters} />
          {round.trying && <Mark good={false} className="fg-picture-mark" />}
        </StoryPicture>
      </main>
      <footer className="story-choices">
        {happy ? (
          <EndButtons onAgain={startFeeling} onNext={onNext} />
        ) : (
          // The not-so-good idea first, then the kind things, the best one first.
          <>
            <ChoiceCard
              image={bearImages.instead(feeling.id)}
              caption={feeling.instead.caption}
              state={round.tried ? "wrong" : round.busy ? "rest" : "choose"}
              onChoose={tryInstead}
            />
            {feeling.comforts.map((id) => (
              <ChoiceCard
                key={id}
                image={bearImages.comfort(id)}
                caption={COMFORTS[id].caption}
                state={used.includes(id) ? "done" : round.busy ? "rest" : "choose"}
                onChoose={() => comfort(id)}
              />
            ))}
          </>
        )}
      </footer>
    </div>
  );
}
