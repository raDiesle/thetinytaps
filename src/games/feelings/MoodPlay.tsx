import { useCallback, useEffect, useState } from "react";
import { PROD } from "@/lib/buildInfo";
import { useT } from "@/lib/language";
import { finishRoutineStep } from "@/lib/routine";
import { imageFor, moodImages, preloadImages } from "./images";
import {
  BREATH_MS,
  CALM_CAPTION,
  CALM_DONE,
  CALM_LINE,
  FACE_CAPTION,
  FACE_LINE,
  HELP_QUESTION,
  HELPS,
  type Help,
  type HelpId,
  HUG_CAPTION,
  loadMoodDay,
  MOOD_ANSWER,
  MOOD_QUESTION,
  MOODS,
  type Mood,
  morningMood,
  NOW,
  saveMoodDay,
  STRENGTH_QUESTION,
  STRENGTHS,
  type Strength,
  THIS_MORNING,
  withMood,
} from "./mood";
import { BigFace, SkySign } from "./moodArt";
import type { FeelingsSettings } from "./settings";
import { ChoiceCard, StoryPicture, useTimers, useVoice } from "./shared";

/** How long the hug, and then the picked help, stay big before the next part begins. */
const ANSWER_MS = 2200;
/** In the evening beside the morning's feeling a little longer, for the grown-up to talk about it. */
const COMPARE_MS = 4500;

/** How long a picked size keeps its tick before the next part. */
const STRENGTH_MS = 1200;

/** How many slow breaths are blown together. */
const BREATHS = 2;

/** Whether „Was hilft dir jetzt?“ is asked: the built site leaves it out until all its pictures are made, the dev server shows their placeholders. */
const ASKS_HELP = !PROD || (Object.keys(HELPS) as HelpId[]).every((id) => imageFor(moodImages.help(id)));

/**
 * Whether the cards are faces (C-30): the built site keeps the four weather cards of before until every face and hug
 * is made, the dev server shows the faces' placeholders.
 */
const SHOWS_FACES = !PROD || MOODS.every((m) => imageFor(moodImages.face(m.id)) && imageFor(moodImages.hug(m.id)));

/** The feelings on the first screen: all eight as faces, or the four that had a weather card. */
const SHOWN = SHOWS_FACES ? MOODS : MOODS.filter((m) => m.weather);

/** Where the child is: picking a feeling, held in the grown-up's arms, copying the face, how strong, breathing, what helps. */
type Stage =
  | { at: "mood" }
  | { at: "hug"; mood: Mood; morning?: Mood }
  | { at: "face"; mood: Mood }
  | { at: "strength"; mood: Mood; picked?: Strength }
  | { at: "calm"; mood: Mood }
  | { at: "help"; mood: Mood; picked?: Help };

/**
 * Wie geht's dir heute? Eight faces (C-29, C-30); the picked one's grown-up takes the little one in its arms – in the
 * evening the morning's card stands beside it instead, „Heute früh“ and „Jetzt“ (C-33) –, the
 * little one shows the face big to copy (C-35, waits for a tap), the child shows how strong it is on the feeling's
 * weather in three sizes (C-36) – a hard feeling „ganz doll“ first gets two slow breaths blown together –, then „Was
 * hilft dir jetzt?“ (C-31), and `onPick` plays the scenes of that feeling (its group).
 */
export function MoodPlay({ settings, onPick }: { settings: FeelingsSettings; onPick: (group: string) => void }) {
  const [stage, setStage] = useState<Stage>({ at: "mood" });
  const { later } = useTimers();
  const { say, sound, preload } = useVoice(settings);
  const t = useT();

  useEffect(() => {
    preloadImages(SHOWN.map(cardImage));
    preload([
      t(MOOD_ANSWER),
      t(FACE_LINE),
      t(STRENGTH_QUESTION),
      ...STRENGTHS.map((s) => t(s.answer)),
      t(CALM_LINE),
      t(CALM_DONE),
      ...(ASKS_HELP ? [t(HELP_QUESTION), ...Object.values(HELPS).map((h) => t(h.answer))] : []),
    ]);
    say(t(MOOD_QUESTION));
  }, []);

  /** After the size, or after the breaths: what helps, or the scenes when that isn't asked yet. */
  const toHelp = useCallback(
    (mood: Mood) => {
      if (!ASKS_HELP) return onPick(mood.group);
      setStage({ at: "help", mood });
      say(t(HELP_QUESTION));
    },
    [onPick, say, t],
  );

  const pickMood = useCallback(
    (mood: Mood) => {
      if (stage.at !== "mood") return;
      // The answer a plan's „Wie geht's dir?“ card waited for (the Tagesplan, rituals.ts): it is ticked on the way back.
      finishRoutineStep();
      const now = new Date();
      const day = loadMoodDay();
      const morning = MOODS.find((m) => m.id === morningMood(day, now));
      saveMoodDay(withMood(day, mood.id, now));
      setStage({ at: "hug", mood, morning });
      say(t(MOOD_ANSWER));
      sound("chime");
      if (ASKS_HELP) preloadImages(mood.helps.map(moodImages.help));
      later(
        () => {
          setStage({ at: "face", mood });
          say(t(FACE_LINE));
        },
        morning ? COMPARE_MS : ANSWER_MS,
      );
    },
    [stage.at, say, sound, later, t],
  );

  const faceDone = useCallback(() => {
    if (stage.at !== "face") return;
    setStage({ at: "strength", mood: stage.mood });
    say(t(STRENGTH_QUESTION));
  }, [stage, say, t]);

  const pickStrength = useCallback(
    (strength: Strength) => {
      if (stage.at !== "strength" || stage.picked) return;
      const { mood } = stage;
      setStage({ at: "strength", mood, picked: strength });
      say(t(strength.answer));
      sound("chime");
      const calming = mood.hard && strength.id === "gross";
      later(() => {
        if (!calming) return toHelp(mood);
        setStage({ at: "calm", mood });
        say(t(CALM_LINE));
        later(() => {
          say(t(CALM_DONE));
          later(() => toHelp(mood), 1500);
        }, BREATH_MS * BREATHS);
      }, STRENGTH_MS);
    },
    [stage, say, sound, later, t, toHelp],
  );

  const pickHelp = useCallback(
    (help: Help) => {
      if (stage.at !== "help" || stage.picked) return;
      setStage({ at: "help", mood: stage.mood, picked: help });
      say(t(help.answer));
      sound("chime");
      later(() => onPick(stage.mood.group), ANSWER_MS);
    },
    [stage, say, sound, later, onPick, t],
  );

  // Digits pick that card; any other key picks one, or goes on from the face, so every key does something.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.repeat) return;
      const choose = <T,>(list: T[]) => {
        const digit = Number(e.key) - 1;
        return list[digit >= 0 && digit < list.length ? digit : Math.floor(Math.random() * list.length)];
      };
      if (stage.at === "mood") pickMood(choose(SHOWN));
      else if (stage.at === "face") faceDone();
      else if (stage.at === "strength") pickStrength(choose(STRENGTHS));
      else if (stage.at === "help") pickHelp(HELPS[choose(stage.mood.helps)]);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [stage, pickMood, faceDone, pickStrength, pickHelp]);

  return (
    <div className="story-play mood-play">
      <main className="story-middle">
        {stage.at === "mood" && (
          <div className={`mood-cards${SHOWS_FACES ? " mood-faces" : ""}`}>
            {SHOWN.map((m) => (
              <ChoiceCard key={m.id} image={cardImage(m)} caption={t(cardCaption(m))} state="choose" onChoose={() => pickMood(m)} />
            ))}
          </div>
        )}
        {stage.at === "hug" && stage.morning && (
          <div className="mood-cards mood-compare">
            <ChoiceCard image={cardImage(stage.morning)} caption={`${t(THIS_MORNING)}: ${t(cardCaption(stage.morning))}`} state="rest" />
            <ChoiceCard image={cardImage(stage.mood)} caption={`${t(NOW)}: ${t(cardCaption(stage.mood))}`} state="rest" />
          </div>
        )}
        {stage.at === "hug" && !stage.morning && (
          <StoryPicture
            key="hug"
            name={SHOWS_FACES ? moodImages.hug(stage.mood.id) : cardImage(stage.mood)}
            caption={t(SHOWS_FACES ? HUG_CAPTION : cardCaption(stage.mood))}
          />
        )}
        {stage.at === "face" && (
          <StoryPicture key="face" name="" art={<BigFace mood={stage.mood} />} caption={`${t(stage.mood.caption)}: ${t(FACE_CAPTION)}`} onNext={faceDone} />
        )}
        {stage.at === "strength" && (
          <div className="mood-cards mood-helps">
            {STRENGTHS.map((s) => (
              <ChoiceCard
                key={s.id}
                image=""
                art={<SkySign sky={stage.mood.sky} scale={s.scale} />}
                caption={t(s.caption)}
                state={!stage.picked ? "choose" : stage.picked === s ? "playing" : "rest"}
                onChoose={() => pickStrength(s)}
              />
            ))}
          </div>
        )}
        {stage.at === "calm" && <StoryPicture key="calm" name="" art={<BigFace mood={stage.mood} blowing />} caption={t(CALM_CAPTION)} />}
        {stage.at === "help" &&
          (stage.picked ? (
            <StoryPicture key={stage.picked.id} name={moodImages.help(stage.picked.id)} caption={t(stage.picked.caption)} />
          ) : (
            <div className="mood-cards mood-helps">
              {stage.mood.helps.map((id) => (
                <ChoiceCard key={id} image={moodImages.help(id)} caption={t(HELPS[id].caption)} state="choose" onChoose={() => pickHelp(HELPS[id])} />
              ))}
            </div>
          ))}
      </main>
    </div>
  );
}

/** A feeling's card: its face, or its weather card where the built site has no faces yet. */
function cardImage(mood: Mood): string {
  return SHOWS_FACES || !mood.weather ? moodImages.face(mood.id) : moodImages.weather(mood.weather.picture);
}

function cardCaption(mood: Mood) {
  return SHOWS_FACES || !mood.weather ? mood.caption : mood.weather.caption;
}
