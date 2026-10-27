import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { GameEnd } from "@/components/GameEnd";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { useAppLanguage, useT, voiceFor } from "@/lib/language";
import {
  playBoing,
  playChime,
  playDrops,
  playDrumRoll,
  playFlush,
  playGiggle,
  playGlug,
  playKnock,
  playMelody,
  playMunch,
  playPlop,
  playPop,
  playRandomNote,
  playRip,
  playRumble,
  playScrub,
  playSplash,
  playSqueak,
  playTrain,
  playTrickle,
  playTusch,
  playBlow,
  playWhoosh,
  recorded,
} from "@/lib/sfx";
import { speak } from "@/lib/speech";
import {
  expectedWent,
  iconFor,
  type Need,
  picturesFor,
  POTTY_TEXTS,
  SAID,
  type Said,
  SCENE_MS,
  type SceneSound,
  scenePicture,
  scenesFor,
  STEPS,
  TAPSI,
  WAIT_SCENE_MS,
  type Went,
} from "./content";
import { preloadImages } from "./images";
import type { PottySettings } from "./settings";
import { StoryPicture } from "./StoryPicture";
import { useWaitingMusic } from "./waitMusic";

const flush = recorded("flush", playFlush);
const splash = recorded("splash", playSplash);
const scrub = recorded("scrub", playScrub);
const munch = recorded("munch", playMunch);
const blow = recorded("blow", playBlow);
const cheer = recorded("cheer", playMelody);
const partyHorn = recorded("partyhorn", playPop);

/** Where the story is: at a step, or sitting with Mama and Papa playing a waiting scene. */
interface At {
  /** Index in STEPS. */
  step: number;
  /** While sitting: the waiting scene shown (an index into scenesFor), -1 for the sitting picture itself. */
  scene: number;
}

/** The story opens on Tapsi eating and drinking, already moving but silent until the first tap. */
const START: At = { step: 0, scene: -1 };

const NEEDS: Need[] = ["pipi", "kaka"];
const NEED_EMOJI: Record<Need, string> = { pipi: "💧", kaka: "💩" };
/** The ✓ while sitting, one for each thing that can be in the potty. */
const WENTS: Went[] = ["pipi", "kaka", "both"];
const WENT_EMOJI: Record<Went, string> = { ...NEED_EMOJI, both: "💧💩" };
const DONE = STEPS.findIndex((s) => s.id === "done");

/**
 * „Aufs Töpfchen“ (H-06): Tapsi eats, drinks, has to go, calls Mama and Papa and goes to the potty. The story goes on
 * by itself where nothing real has to happen (`Step.auto`), else on a tap or „Weiter“. What it has to do is what the
 * child said, noted by a grown-up on a small button while Tapsi calls (unknown until then); what came is chosen at the ✓.
 */
export function PottyPlay({ settings }: { settings: PottySettings }) {
  const language = useAppLanguage();
  const texts = useT()(POTTY_TEXTS);
  const [said, setSaid] = useState<Said>("unsure");
  /** What really came, chosen at the ✓; null before. */
  const [went, setWent] = useState<Went | null>(null);
  const scenes = useMemo(() => scenesFor(said), [said]);
  const [at, setAt] = useState<At>(START);
  const [busy, setBusy] = useState(false);
  /** The buttons for what the child said show in this step: while calling, and on the way while nothing was picked. */
  const [asking, setAsking] = useState(false);
  /** Bumped for every step and scene, so the overlays and the picture start again. */
  const [beat, setBeat] = useState(0);
  const { bursts, spawn } = useBursts();

  // Refs as well as state: a quick second tap can come before React has rendered the first.
  const busyRef = useRef(false);
  const atRef = useRef<At>(START);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  /** The ✓ was explained once in this round. */
  const toldFinish = useRef(false);

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

  const step = STEPS[at.step];
  const sitting = step.id === "sit";
  const last = at.step === STEPS.length - 1;

  // The waiting song is part of sitting (like the brushing song), so it plays even with Töne or Musik off;
  // the background song waits meanwhile.
  useNoBackgroundMusic(sitting);
  useWaitingMusic(sitting, language.id);

  // The next step's pictures load while this one plays, the waiting scenes once the animal sits.
  useEffect(() => {
    // After sitting both endings load, since either can come.
    const next = STEPS[at.step + 1];
    const names = next ? picturesFor(next, next.id === "done" ? "unsure" : (went ?? said)).map((p) => `${TAPSI.pictures}-${p}`) : [];
    if (STEPS[at.step]?.id === "down") names.push(...scenes.map((s) => `${TAPSI.pictures}-${scenePicture(s)}`));
    preloadImages(names);
  }, [at.step, said, went, scenes]);

  const say = (text: string) => {
    if (settings.speech) speak(text, voiceFor(text, language));
  };
  const sound = (ms: number, play: () => void) => {
    if (settings.sounds) later(ms, play);
  };
  const footsteps = (ms: number) => {
    for (let t = 0; t < ms; t += 320) sound(t, () => playKnock(t % 640 ? 380 : 440));
  };

  const goTo = (next: At, ms: number) => {
    atRef.current = next;
    busyRef.current = true;
    setAt(next);
    setBusy(true);
    setBeat((b) => b + 1);
    later(ms, () => {
      busyRef.current = false;
      setBusy(false);
    });
  };

  /** Plays step `index`: its picture shows, its sounds and words come here. `came` is what the ✓ chose. */
  const begin = (index: number, came: Went | null = went) => {
    const { id, ms } = STEPS[index];
    goTo({ step: index, scene: -1 }, ms);
    setAsking(id === "call" || (id === "go" && said === "unsure"));
    say(texts.steps[id](TAPSI.name, came ?? said));
    switch (id) {
      case "eat":
        // In time with the pictures: eating first, drinking when its picture comes.
        sound(0, munch);
        sound(1800, playGlug);
        break;
      case "need":
        if (said !== "kaka") {
          sound(0, playBoing);
          sound(500, playDrops);
        }
        if (said !== "pipi") {
          sound(said === "kaka" ? 0 : 900, playRumble);
          sound(said === "kaka" ? 700 : 1300, playRumble);
        }
        break;
      case "call":
        sound(0, playChime);
        break;
      case "go":
        footsteps(1500);
        break;
      case "down":
        sound(STEPS[index].moves ? 700 : 0, playWhoosh);
        break;
      case "sit":
        sound(STEPS[index].moves ? 1500 : 300, playPlop);
        break;
      case "done":
        if (came !== "kaka") sound(0, playTrickle);
        if (came !== "pipi") sound(came === "both" ? 500 : 0, playPlop);
        sound(900, cheer);
        for (let i = 0; i < 8; i++) later(600 + i * 120, () => spawn());
        break;
      case "wipe":
        sound(300, playRip);
        sound(1000, playGiggle);
        break;
      case "up":
        sound(0, playBoing);
        sound(500, playWhoosh);
        break;
      case "flush":
        sound(200, flush);
        break;
      case "wash":
        sound(0, splash);
        sound(900, scrub);
        break;
      case "party":
        sound(0, cheer);
        sound(300, partyHorn);
        for (let i = 0; i < 12; i++) later(i * 150, () => spawn());
        break;
    }
  };

  const SCENE_SOUNDS: Record<SceneSound, () => void> = {
    trickle: () => playTrickle(),
    splash: () => splash(),
    glug: () => {
      playGlug();
      later(600, playGlug);
    },
    whoosh: () => playWhoosh(),
    squeeze: () => playSqueak(),
    blow: () => blow(),
    push: () => playRumble(),
    drops: () => playDrops(),
    train: () => playTrain(),
    dance: () => {
      playDrumRoll(0);
      later(1000, playTusch);
    },
    juggle: () => [0, 300, 600].forEach((ms) => later(ms, playBoing)),
    peekaboo: () => playGiggle(),
    bubbles: () => [0, 250, 500, 750].forEach((ms) => later(ms, playPop)),
  };

  /**
   * While sitting Mama and Papa do the next thing, endlessly – the animal sits as long as it takes. It comes by itself
   * every few seconds, or at once on a tap; only a tapped one is said, so the voice doesn't talk all the time.
   */
  const nextScene = (tapped: boolean) => {
    const index = (atRef.current.scene + 1) % scenes.length;
    const scene = scenes[index];
    goTo({ step: atRef.current.step, scene: index }, SCENE_MS);
    if (settings.sounds) SCENE_SOUNDS[scene.sound]();
    // Once per round the voice says what the ✓ is for; after that only tapped scenes speak.
    if (!toldFinish.current) {
      toldFinish.current = true;
      say(`${texts.scenes[scene.id]} ${texts.finish}`);
    } else if (tapped) say(texts.scenes[scene.id]);
  };

  /** A tap or key: the next step (or waiting scene) when the last one has finished, a sparkle while it still runs. */
  const act = (x?: number, y?: number) => {
    const next = atRef.current.step + 1;
    if (busyRef.current || next >= STEPS.length) {
      spawn(x, y);
      if (settings.sounds) playRandomNote();
      return;
    }
    if (STEPS[atRef.current.step]?.id === "sit") nextScene(true);
    else begin(next);
  };

  // The story goes on by itself where nothing real has to happen (Step.auto), and the waiting scenes follow each
  // other. Through a ref, so the timer started for a step runs with what was picked meanwhile.
  const goOn = useRef(() => {});
  goOn.current = () => {
    if (STEPS[atRef.current.step].id === "sit") nextScene(false);
    else begin(atRef.current.step + 1);
  };
  useEffect(() => {
    const here = STEPS[at.step];
    const ms = here.id === "sit" && at.scene >= 0 ? WAIT_SCENE_MS : here.auto;
    if (ms === undefined) return;
    const timer = setTimeout(() => goOn.current(), ms);
    return () => clearTimeout(timer);
  }, [at]);

  /** A small button while calling: what the child said, only noted – the story goes on by itself. */
  const pick = (choice: Said, e: PointerEvent) => {
    if (settings.sounds) playPop();
    spawn(e.clientX, e.clientY);
    if (choice === said) return;
    setSaid(choice);
    say(texts.said[choice]);
  };

  /** A ✓ while sitting: a grown-up says what is in the potty, and the story goes on with it. */
  const finish = (came: Went) => {
    setWent(came);
    begin(atRef.current.step + 1, came);
  };

  /** Stops what the step before still had to play, so another one can begin at once. */
  const stopTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    busyRef.current = false;
  };

  /**
   * A tap on the row of steps: the story jumps there at once, also while a step still plays. Before the
   * potty nothing has come yet; from „fertig“ on, what the child said came (pipi when nobody knew) unless a ✓ chose.
   */
  const jump = (index: number) => {
    stopTimers();
    const came = index < DONE ? null : (went ?? expectedWent(said));
    setWent(came);
    begin(index, came);
  };

  /** „Weiter“: the next step at once, also while this one's sounds still play. */
  const next = (e: PointerEvent) => {
    e.stopPropagation();
    if (settings.sounds) playPop();
    jump(atRef.current.step + 1);
  };

  const restart = () => {
    stopTimers();
    setSaid("unsure");
    setWent(null);
    toldFinish.current = false;
    begin(0, null);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      // While sitting Enter is the ✓ for what the child said (pipi when nobody knew), every other key the next scene.
      if (e.key === "Enter" && STEPS[atRef.current.step]?.id === "sit" && !busyRef.current) finish(expectedWent(said));
      else act();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const pictures = (sitting && at.scene >= 0 ? [scenePicture(scenes[at.scene])] : picturesFor(step, went ?? said)).map((p) => `${TAPSI.pictures}-${p}`);
  const moves = sitting && at.scene >= 0 ? undefined : step.moves?.map((p) => `${TAPSI.pictures}-${p}`);
  // The picture before stays under the new one while it fades in, so pictures blend into each other.
  const [shown, setShown] = useState({ now: pictures, before: null as string[] | null });
  if (shown.now.join() !== pictures.join()) setShown({ now: pictures, before: shown.now });
  /** The needs Tapsi feels and calls for: both while nobody knows. */
  const feels = said === "pipi" || said === "kaka" ? [said] : NEEDS;
  const expected = expectedWent(said);

  return (
    <div className={`potty-play pt-${went ?? said} pt-at-${step.id}${busy ? " busy" : ""}`} onPointerDown={(e: PointerEvent) => act(e.clientX, e.clientY)}>
      {shown.before && <StoryPicture key={`before-${shown.before.join()}`} name={shown.before} moving={false} />}
      <StoryPicture key={pictures.join()} name={pictures} moves={moves} moving className="pt-picture pt-picture-new" />

      {/* Drawn on top of the picture: what the animal feels and says, without words. */}
      {step.id === "need" && (
        <div key={beat} className="pt-feel" aria-hidden>
          {feels.map((n) => (n === "pipi" ? "💦" : "🌀")).join("")}
        </div>
      )}
      {step.id === "call" && (
        <div className="pt-call" aria-hidden>
          <span>📣</span>
          {feels.map((n) => (
            <span key={n}>{NEED_EMOJI[n]}</span>
          ))}
        </div>
      )}

      {/* Only for grown-ups, so small and calm in the corner next to the row of steps: the child looks at the story. */}
      <div className="pt-bottom">
        {/* Every step in the row jumps there. Plain buttons, not grown tap areas: only a tap right on one jumps,
            one next to the row goes on with the story, and the buttons next to it keep their reach. */}
        <ol className="pt-steps">
          {STEPS.map((s, i) => (
            <li key={s.id} className={i < at.step ? "done" : i === at.step ? "now" : undefined}>
              <button
                type="button"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  jump(i);
                }}
              >
                {iconFor(s, i >= DONE ? (went ?? said) : said)}
                {s.arrow && <span className="pt-arrow">{s.arrow}</span>}
              </button>
            </li>
          ))}
        </ol>

        <div className="pt-grown">
          {/* What the child said: only noted, the story goes on by itself; untouched it stays „muss mal“. */}
          {asking && (
            <div className="pt-saids">
              {SAID.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`pt-said${s.id === said ? " picked" : ""}`}
                  data-tap
                  aria-label={texts.said[s.id]}
                  aria-pressed={s.id === said}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    pick(s.id, e);
                  }}
                >
                  {s.emoji}
                </button>
              ))}
            </div>
          )}

          {/* Three ✓, since what comes may not be what the child said: a grown-up taps what is in the potty. */}
          {sitting && (
            <div className="pt-finishes">
              {WENTS.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`pt-finish${n === expected ? " expected" : ""}`}
                  data-tap="goal"
                  aria-label={texts.went[n]}
                  onPointerDown={(e) => {
                    if (busyRef.current) return; // the tap goes on to sparkle
                    e.stopPropagation();
                    finish(n);
                  }}
                >
                  <span className="pt-finish-check">✓</span>
                  <span className="pt-finish-need">{WENT_EMOJI[n]}</span>
                </button>
              ))}
            </div>
          )}

          {!sitting && !last && (
            <button type="button" className="pt-next" data-tap aria-label={texts.next} onPointerDown={next}>
              ▶
            </button>
          )}
        </div>
      </div>

      {last && <GameEnd delayMs={STEPS[at.step].ms} onAgain={restart} next={{ emoji: "🚽", name: TAPSI.name, onNext: restart }} />}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
