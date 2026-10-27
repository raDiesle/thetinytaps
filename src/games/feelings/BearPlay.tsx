import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { useAppLanguage } from "@/lib/language";
import type { Feeling, FeelingId } from "./bear";
import { bearImages, preloadImages } from "./images";
import { comfortsIn } from "./localized";
import type { FeelingsSettings } from "./settings";
import {
  CHEER_MS,
  ChoiceCard,
  EndButtons,
  FloaterLayer,
  OOPS_MS,
  StepDots,
  StoryPicture,
  cheer,
  oops,
  useFloaters,
  useTimers,
  useVoice,
  type CardState,
  type PictureLook,
} from "./shared";
import { beatMs } from "./story";

/** How long a kind thing plays, after the cheering, before the next round. */
const COMFORT_MS = 1600;
/** Time to enjoy the happy bear before a tap or key brings the next feeling. */
const CELEBRATE_MS = 1500;
/** Where hearts and notes float up from: the middle of the picture. */
const BEAR_CHEST = { x: 50, y: 42 };

/** What floats up when he is happy again, if not hearts. */
const END_FLOAT: Partial<Record<FeelingId, string>> = { tired: "💤", happy: "🎉" };

/** One of the two cards of a round: the kind thing or the not-so-good idea. */
type Pick = "good" | "instead";

interface Round {
  /** Changes when the feeling is played again, so its pictures start fresh. */
  key: number;
  /** Which round is played now: its kind thing and its not-so-good idea are on the cards. */
  index: number;
  /** The not-so-good idea of this round was tried already: its card stays crossed out. */
  tried: boolean;
  /** The not-so-good idea is shown big right now. */
  trying: boolean;
  /** The card tapped once, shown big; tapped again it is chosen. */
  picked: Pick | null;
  /** The kind thing was just chosen: the picture is framed green while the child laughs. */
  cheering: boolean;
  /** The kind thing is done right now: its picture is shown big. */
  comforting: boolean;
  busy: boolean;
  /** All kind things done and the bear has said thanks. */
  happy: boolean;
}

const freshRound = (key: number): Round => ({
  key,
  index: 0,
  tried: false,
  trying: false,
  picked: null,
  cheering: false,
  comforting: false,
  busy: false,
  happy: false,
});

/**
 * Zu Hause: one feeling of the bear (its words already in the app language), until he is happy again.
 * Every round shows him as he feels at the start, with two cards: a not-so-good idea and a kind thing.
 * `onNext` goes on to the next story.
 */
export function BearPlay({ feeling, settings, onNext }: { feeling: Feeling; settings: FeelingsSettings; onNext: () => void }) {
  const nextKey = useRef(0);
  const happyAt = useRef(0);
  const [round, setRound] = useState<Round>(() => freshRound(nextKey.current++));
  const { later, clearAll } = useTimers();
  const { say, sound } = useVoice(settings);
  const { floaters, float } = useFloaters();
  const { id: language } = useAppLanguage();
  const comforts = useMemo(() => comfortsIn(language), [language]);

  const { index, happy } = round;
  const comfortId = feeling.comforts[index];

  const startFeeling = useCallback(() => {
    clearAll();
    preloadImages([
      bearImages.feeling(feeling.id),
      bearImages.happy(feeling.id),
      ...feeling.instead.map((_, i) => bearImages.instead(feeling.id, i)),
      ...feeling.comforts.map(bearImages.comfort),
    ]);
    setRound(freshRound(nextKey.current++));
    say(feeling.questions[0]);
    if (feeling.id === "scared") sound("rumble");
  }, [feeling, clearAll, say, sound]);

  useEffect(() => startFeeling(), []);

  const tryNextFeeling = () => {
    if (performance.now() - happyAt.current >= CELEBRATE_MS) onNext();
  };

  // The kind thing is cheered first – green frame, a laugh, stars – then it is done: its picture, its sound, its hearts.
  // Then the next round starts from the first picture again, or he is happy.
  const comfort = useCallback(() => {
    const c = comforts[comfortId];
    const last = index + 1 >= feeling.comforts.length;
    setRound((r) => ({ ...r, picked: null, cheering: true, comforting: true, busy: true }));
    cheer(say, sound, float);

    later(() => {
      setRound((r) => ({ ...r, cheering: false }));
      say(c.narration, true);
      sound(c.sound);
      float(c.float, BEAR_CHEST.x, BEAR_CHEST.y);
    }, CHEER_MS);

    later(
      () => {
        if (!last) {
          setRound((r) => ({ ...r, index: r.index + 1, tried: false, comforting: false, busy: false }));
          say(feeling.questions[index + 1], true);
          return;
        }
        const { end } = feeling;
        happyAt.current = performance.now();
        setRound((r) => ({ ...r, comforting: false, busy: false, happy: true }));
        say(`${end.narration} ${end.line}`, true);
        sound("cheer");
        float(END_FLOAT[feeling.id] ?? "💛", BEAR_CHEST.x, BEAR_CHEST.y + 20, 5);
      },
      CHEER_MS + Math.max(COMFORT_MS, beatMs({ narration: c.narration }, settings.speech)),
    );
  }, [comforts, comfortId, index, feeling, say, sound, float, later, settings.speech]);

  /** The not-so-good idea: shown big in a red frame that shakes, with crying or a crash, while it is told why it doesn't help; then the cards come back. */
  const tryInstead = useCallback(() => {
    const { answer, sound: heard } = feeling.instead[index];
    setRound((r) => ({ ...r, tried: true, trying: true, picked: null, busy: true }));
    say(answer);
    oops(heard, sound, float);
    later(() => setRound((r) => ({ ...r, busy: false, trying: false })), Math.max(OOPS_MS, beatMs({ narration: answer }, settings.speech)));
  }, [feeling, index, say, sound, float, later, settings.speech]);

  /** The first tap on a card shows it big, so the child sees what it chose; the second tap (on the card or the big picture) chooses it. */
  const pick = (card: Pick) => {
    if (round.busy || happy) return;
    if (round.picked !== card) {
      setRound((r) => ({ ...r, picked: card }));
      sound("pop");
    } else if (card === "instead") tryInstead();
    else comfort();
  };

  /** Tapping the bear makes him giggle a little; a card shown big is chosen instead. */
  const onBearPointer = (e: PointerEvent) => {
    e.stopPropagation();
    if (happy) return tryNextFeeling();
    if (round.picked) return pick(round.picked);
    if (round.busy) return;
    float("💛", BEAR_CHEST.x, BEAR_CHEST.y, 2);
    sound("pop");
  };

  // The left arrow picks the not-so-good idea on the left; every other key the kind thing, so mashing keys still comforts him.
  /** Back from a card looked at big to the first picture, without choosing. */
  const unpick = () => setRound((r) => ({ ...r, picked: null }));

  // Backspace goes back from a card looked at big, like the small first picture in its corner.
  const pressKey = (key: string) => {
    if (happy) return tryNextFeeling();
    if (key === "Backspace" && round.picked) return unpick();
    pick(!round.tried && key === "ArrowLeft" ? "instead" : "good");
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (!e.repeat) pressKey(e.key);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pressKey]);

  // The bear as he feels at first, in every round; a card looked at or chosen, its answer, and at the end happy again.
  const instead = feeling.instead[index];
  let picture = bearImages.feeling(feeling.id);
  // While the child chooses, the caption asks the round's question: it tells grown-ups who acts – the child or the bear.
  let caption = round.busy ? feeling.title : feeling.questions[index];
  let look: PictureLook = round.busy ? "story" : "quiet";
  if (happy) [picture, caption, look] = [bearImages.happy(feeling.id), feeling.endCaption, "story"];
  else if (round.picked === "instead") [picture, caption, look] = [bearImages.instead(feeling.id, index), instead.caption, "option"];
  else if (round.picked === "good") [picture, caption, look] = [bearImages.comfort(comfortId), comforts[comfortId].caption, "option"];
  else if (round.trying) [picture, caption, look] = [bearImages.instead(feeling.id, index), instead.caption, "bad"];
  else if (round.comforting) [picture, caption] = [bearImages.comfort(comfortId), comforts[comfortId].caption];
  if (round.cheering) look = "good";

  const playing = round.comforting;
  const goodState: CardState = playing ? "playing" : round.trying ? "rest" : round.picked === "good" ? "picked" : "choose";
  const insteadState: CardState = round.tried ? "wrong" : playing ? "rest" : round.picked === "instead" ? "picked" : "choose";

  return (
    <div className="story-play bear-play" onPointerDown={() => happy && tryNextFeeling()}>
      <header className="story-top">
        <StepDots total={feeling.comforts.length} done={happy ? feeling.comforts.length : index + (playing ? 1 : 0)} current={!happy} />
      </header>
      <main className="story-middle">
        <StoryPicture
          key={`${round.key}-${picture}`}
          name={picture}
          caption={caption}
          look={look}
          zoom={round.picked !== null}
          back={{ image: bearImages.feeling(feeling.id), onBack: unpick }}
          onPointerDown={onBearPointer}
        >
          <FloaterLayer floaters={floaters} />
        </StoryPicture>
      </main>
      <footer className="story-choices">
        {happy ? (
          <EndButtons onAgain={startFeeling} onNext={onNext} />
        ) : (
          // The not-so-good idea always on the left, the kind thing on the right.
          <>
            <ChoiceCard
              key={`instead-${index}`}
              image={bearImages.instead(feeling.id, index)}
              caption={instead.caption}
              state={insteadState}
              onChoose={() => pick("instead")}
            />
            <ChoiceCard
              key={`good-${index}`}
              image={bearImages.comfort(comfortId)}
              caption={comforts[comfortId].caption}
              state={goodState}
              onChoose={() => pick("good")}
            />
          </>
        )}
      </footer>
    </div>
  );
}
