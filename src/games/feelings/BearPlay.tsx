import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { COMFORTS_NEEDED, type ComfortId, type Feeling, type FeelingId } from "./bear";
import { bearImages, preloadImages } from "./images";
import { comfortsIn } from "./localized";
import type { FeelingsSettings } from "./settings";
import {
  CHEER_MS,
  ChoiceCard,
  EndButtons,
  FloaterLayer,
  OOPS_MS,
  StoryPicture,
  cheer,
  oops,
  useFloaters,
  useTimers,
  useVoice,
  type PictureLook,
} from "./shared";
import { beatMs } from "./story";

/** How long a kind thing plays, after the cheering, before the next one can start. */
const COMFORT_MS = 1600;
/** Time to enjoy the happy bear before a tap or key brings the next feeling. */
const CELEBRATE_MS = 1500;
/** Where hearts and notes float up from: the middle of the picture. */
const BEAR_CHEST = { x: 50, y: 42 };

/** Asked after the intro, unless the feeling has its own question. */
const QUESTION: Localized = { de: "Wie kannst du ihm helfen?", ru: "Как ты можешь ему помочь?" };

/** What floats up when he is happy again, if not hearts. */
const END_FLOAT: Partial<Record<FeelingId, string>> = { tired: "💤", happy: "🎉" };

/** One of the cards: a kind thing or the not-so-good idea. */
type Pick = ComfortId | "instead";

interface Round {
  /** Changes when the feeling is played again, so its pictures start fresh. */
  key: number;
  used: ComfortId[];
  /** The not-so-good idea was tried already: its card stays crossed out. */
  tried: boolean;
  /** The not-so-good idea is shown big right now. */
  trying: boolean;
  /** The card tapped once, shown big; tapped again it is chosen. */
  picked: Pick | null;
  /** A kind thing was just chosen: the picture is framed green while the child laughs. */
  cheering: boolean;
  busy: boolean;
  /** All kind things done and the bear has said thanks. */
  happy: boolean;
}

const freshRound = (key: number): Round => ({
  key,
  used: [],
  tried: false,
  trying: false,
  picked: null,
  cheering: false,
  busy: false,
  happy: false,
});

/** Zu Hause: one feeling of the bear (its words already in the app language), until he is happy again. `onNext` goes on to the next story. */
export function BearPlay({ feeling, settings, onNext }: { feeling: Feeling; settings: FeelingsSettings; onNext: () => void }) {
  const nextKey = useRef(0);
  const happyAt = useRef(0);
  const [round, setRound] = useState<Round>(() => freshRound(nextKey.current++));
  const { later, clearAll } = useTimers();
  const { say, sound } = useVoice(settings);
  const { floaters, float } = useFloaters();
  const t = useT();
  const { id: language } = useAppLanguage();
  const comforts = useMemo(() => comfortsIn(language), [language]);

  const { used, happy } = round;

  const startFeeling = useCallback(() => {
    clearAll();
    preloadImages([bearImages.feeling(feeling.id), bearImages.happy(feeling.id), bearImages.instead(feeling.id), ...feeling.comforts.map(bearImages.comfort)]);
    setRound(freshRound(nextKey.current++));
    say(`${feeling.intro} ${feeling.question ?? t(QUESTION)}`);
    if (feeling.id === "scared") sound("rumble");
  }, [feeling, clearAll, say, sound, t]);

  useEffect(() => startFeeling(), []);

  const tryNextFeeling = () => {
    if (performance.now() - happyAt.current >= CELEBRATE_MS) onNext();
  };

  // A kind thing is cheered first – green frame, a laugh, stars – then it is done: its sound, its hearts.
  const comfort = useCallback(
    (id: ComfortId) => {
      if (round.busy || happy) return;
      const c = comforts[id];
      const nowUsed = used.includes(id) ? used : [...used, id];
      const nowHappy = nowUsed.length >= COMFORTS_NEEDED;
      setRound((r) => ({ ...r, used: nowUsed, picked: null, cheering: true, busy: true }));
      cheer(say, sound, float);

      later(() => {
        setRound((r) => ({ ...r, cheering: false }));
        say(c.narration, true);
        sound(c.sound);
        float(c.float, BEAR_CHEST.x, BEAR_CHEST.y);
      }, CHEER_MS);

      later(() => {
        if (!nowHappy) {
          setRound((r) => ({ ...r, busy: false }));
          return;
        }
        const { end } = feeling;
        happyAt.current = performance.now();
        setRound((r) => ({ ...r, busy: false, happy: true }));
        say(`${end.narration} ${end.line}`, true);
        sound("cheer");
        float(END_FLOAT[feeling.id] ?? "💛", BEAR_CHEST.x, BEAR_CHEST.y + 20, 5);
      }, CHEER_MS + COMFORT_MS);
    },
    [round.busy, happy, used, feeling, comforts, say, sound, float, later],
  );

  /** The not-so-good idea: shown big in a red frame that shakes, with crying or a crash, while it is told why it doesn't help; then the cards come back. */
  const tryInstead = useCallback(() => {
    if (round.busy || happy) return;
    const { answer, sound: heard } = feeling.instead;
    setRound((r) => ({ ...r, tried: true, trying: true, picked: null, busy: true }));
    say(answer);
    oops(heard, sound, float);
    later(() => setRound((r) => ({ ...r, busy: false, trying: false })), Math.max(OOPS_MS, beatMs({ narration: answer }, settings.speech)));
  }, [round.busy, happy, feeling, say, sound, float, later, settings.speech]);

  /** The first tap on a card shows it big, so the child sees what it chose; the second tap (on the card or the big picture) chooses it. */
  const pick = (card: Pick) => {
    if (round.busy || happy) return;
    if (round.picked !== card) {
      setRound((r) => ({ ...r, picked: card }));
      sound("pop");
    } else if (card === "instead") tryInstead();
    else comfort(card);
  };

  /** Tapping the bear strokes him: it counts if stroking is one of the kind things, else he just giggles. A card shown big is chosen instead. */
  const onBearPointer = (e: PointerEvent) => {
    e.stopPropagation();
    if (happy) return tryNextFeeling();
    if (round.picked) return pick(round.picked);
    if (feeling.comforts.includes("stroke") && !used.includes("stroke")) return comfort("stroke");
    if (round.busy) return;
    float("💛", BEAR_CHEST.x, BEAR_CHEST.y, 2);
    sound("pop");
  };

  const pressKey = () => {
    if (happy) return tryNextFeeling();
    const next = feeling.comforts.find((id) => !used.includes(id));
    if (next) pick(next);
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
  let look: PictureLook = round.busy ? "story" : "quiet";
  if (happy) [picture, caption, look] = [bearImages.happy(feeling.id), feeling.endCaption, "story"];
  else if (round.picked === "instead") [picture, caption, look] = [bearImages.instead(feeling.id), feeling.instead.caption, "option"];
  else if (round.picked) [picture, caption, look] = [bearImages.comfort(round.picked), comforts[round.picked].caption, "option"];
  else if (round.trying) [picture, caption, look] = [bearImages.instead(feeling.id), feeling.instead.caption, "bad"];
  else if (last) [picture, caption] = [bearImages.comfort(last), comforts[last].caption];
  if (round.cheering) look = "good";

  return (
    <div className="story-play bear-play" onPointerDown={() => happy && tryNextFeeling()}>
      <main className="story-middle">
        <StoryPicture key={`${round.key}-${picture}`} name={picture} caption={caption} look={look} zoom={round.picked !== null} onPointerDown={onBearPointer}>
          <FloaterLayer floaters={floaters} />
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
              state={round.tried ? "wrong" : round.busy ? "rest" : round.picked === "instead" ? "picked" : "choose"}
              onChoose={() => pick("instead")}
            />
            {feeling.comforts.map((id) => (
              <ChoiceCard
                key={id}
                image={bearImages.comfort(id)}
                caption={comforts[id].caption}
                state={used.includes(id) ? "done" : round.busy ? "rest" : round.picked === id ? "picked" : "choose"}
                onChoose={() => pick(id)}
              />
            ))}
          </>
        )}
      </footer>
    </div>
  );
}
