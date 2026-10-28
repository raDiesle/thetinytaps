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
  playTrickle,
  playTusch,
  playTwinkle,
  playBlow,
  playWhistle,
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
  storyFor,
  TAPSI,
  WAIT_SCENE_MS,
  type Went,
} from "./content";
import { framesFor, preloadImages } from "./images";
import type { PottySettings } from "./settings";
import { addStar, loadStars, saveStars, type StarLog } from "./stars";
import { StoryPicture } from "./StoryPicture";
import { WaitClock } from "./WaitClock";
import { WeekStars } from "./WeekStars";
import { useWaitingMusic } from "./waitMusic";

const flush = recorded("flush", playFlush);
const splash = recorded("splash", playSplash);
const scrub = recorded("scrub", playScrub);
const munch = recorded("munch", playMunch);
const blow = recorded("blow", playBlow);
const cheer = recorded("cheer", playMelody);
const partyHorn = recorded("partyhorn", playPop);

/** Where the story is: at a step, or sitting and thinking of a waiting scene. */
interface At {
  /** Index in STEPS. */
  step: number;
  /** While sitting: the scene in the thought bubble (an index into scenesFor), -1 before the first one. */
  scene: number;
  /** Nothing came on the potty: the story goes on with `NOTHING_STEPS`. */
  nothing: boolean;
}

/** The story opens on Tapsi eating and drinking, already moving but silent until the first tap. */
const START: At = { step: 0, scene: -1, nothing: false };

const NEEDS: Need[] = ["pipi", "kaka"];
const NEED_EMOJI: Record<Need, string> = { pipi: "💧", kaka: "💩" };
/** Taps this soon after a step began only sparkle, so a double tap doesn't skip a step. */
const TAP_GUARD_MS = 350;
const DONE = STEPS.findIndex((s) => s.id === "done");
const SIT = STEPS.findIndex((s) => s.id === "sit");

/** What `begin` plays a step with, when it is not what is picked now. */
interface Begin {
  /** What the ✓ chose. */
  came?: Went | null;
  /** What the child said, when it was just picked. */
  said?: Said;
  /** Whether nothing came (the other story). */
  nothing?: boolean;
}

/**
 * „Aufs Töpfchen“ (H-06): Tapsi eats, drinks, has to go, calls Mama and Papa and goes to the potty. Any tap or key goes on, a few
 * steps by themselves (`Step.auto`); while sitting a tap brings the next thought. What it has to do is what the child said,
 * picked by a grown-up while Tapsi calls (unknown until then); what came – or that nothing came – is chosen at the ✓.
 */
export function PottyPlay({ settings }: { settings: PottySettings }) {
  const language = useAppLanguage();
  const t = useT();
  const texts = t(POTTY_TEXTS);
  const [said, setSaid] = useState<Said>("unsure");
  /** What really came, chosen at the ✓; null before. */
  const [went, setWent] = useState<Went | null>(null);
  const scenes = useMemo(() => scenesFor(said), [said]);
  const [at, setAt] = useState<At>(START);
  const [busy, setBusy] = useState(false);
  /**
   * The buttons for what the child said show in this step: while calling, and on the way while nothing was picked.
   * They carry „Weiter“'s ▶ then, so there is no „Weiter“ beside them; a tap elsewhere goes on with nothing picked.
   */
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
  /** When the step began, for `TAP_GUARD_MS`. */
  const startedAt = useRef(0);
  /** A grown-up tapped a ✓ in this round: something really came, so the end brings a star. */
  const checked = useRef(false);
  /** This round's star is on the chart: one round, one star, also when the end is reached twice. */
  const starred = useRef(false);
  const [log, setLog] = useState<StarLog>(loadStars);
  /** The star of this round pops in on the chart. */
  const [fresh, setFresh] = useState(false);

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

  const story = storyFor(at.nothing);
  const step = story[at.step];
  const sitting = step.id === "sit";
  const last = at.step === story.length - 1;

  // The waiting song is part of sitting (like the brushing song), so it plays even with Töne or Musik off;
  // the background song waits meanwhile.
  useNoBackgroundMusic(sitting);
  useWaitingMusic(sitting, language.id);

  // The next step's pictures load while this one plays, the thought bubble's once the animal sits.
  useEffect(() => {
    // After sitting both endings load, since either can come.
    const here = storyFor(at.nothing);
    const nexts = here[at.step]?.id === "sit" ? [STEPS[SIT + 1], ...storyFor(true).slice(SIT + 1)] : [here[at.step + 1]];
    const names = nexts.flatMap((s) => (s ? picturesFor(s, s.id === "done" ? "unsure" : (went ?? said)) : [])).map((p) => `${TAPSI.pictures}-${p}`);
    if (here[at.step]?.id === "down") names.push(...scenes.map((s) => `${TAPSI.pictures}-${scenePicture(s)}`));
    preloadImages(names);
  }, [at.step, at.nothing, said, went, scenes]);

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

  /** Plays step `index`: its picture shows, its sounds and words come here. */
  const begin = (index: number, { came = went, said: saidNow = said, nothing = atRef.current.nothing }: Begin = {}) => {
    const { id, ms, moves } = storyFor(nothing)[index];
    goTo({ step: index, scene: -1, nothing }, ms);
    startedAt.current = performance.now();
    setAsking(id === "call" || (id === "go" && saidNow === "unsure"));
    const line = texts.steps[id](t(TAPSI.name), came ?? saidNow);
    // The end shows this week's stars, with a new one only when a ✓ said what really came in this round.
    const star = id === "stars" && checked.current && !starred.current;
    say(star ? texts.star : nothing && id === "wash" ? `${texts.nothing} ${line}` : line);
    switch (id) {
      case "eat":
        // In time with the pictures: eating first, drinking when its picture comes.
        sound(0, munch);
        sound(1800, playGlug);
        break;
      case "need":
        if (saidNow !== "kaka") {
          sound(0, playBoing);
          sound(500, playDrops);
        }
        if (saidNow !== "pipi") {
          sound(saidNow === "kaka" ? 0 : 900, playRumble);
          sound(saidNow === "kaka" ? 700 : 1300, playRumble);
        }
        break;
      case "call":
        sound(0, playChime);
        break;
      case "go":
        footsteps(1500);
        break;
      case "down":
        sound(moves ? 700 : 0, playWhoosh);
        break;
      case "sit":
        sound(moves ? 800 : 300, playPlop);
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
      case "stars":
        if (star) {
          starred.current = true;
          const next = addStar(loadStars(), new Date());
          saveStars(next);
          setLog(next);
          setFresh(true);
          // In time with the new star popping in.
          sound(900, playTwinkle);
        } else setLog(loadStars());
        break;
      case "play":
        // Mama and Papa knock at the open door before they ask.
        sound(0, () => playKnock(440));
        sound(260, () => playKnock(440));
        sound(1200, playGiggle);
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
    // The hen presses (a squeak), then the egg drops.
    plop: () => {
      playSqueak();
      later(700, playPlop);
    },
    dance: () => {
      playDrumRoll(0);
      later(1000, playTusch);
    },
    juggle: () => [0, 300, 600].forEach((ms) => later(ms, playBoing)),
    peekaboo: () => playGiggle(),
    bubbles: () => [0, 250, 500, 750].forEach((ms) => later(ms, playPop)),
    // The train whistles as it comes out of the tunnel.
    toot: () => later(500, playWhistle),
    // The butterfly is out and flies away.
    chime: () => playChime(),
  };

  /**
   * While sitting Tapsi thinks of the next thing, endlessly – the animal sits as long as it takes. It comes by itself
   * every few seconds, or at once on a tap; only a tapped one is said, so the voice doesn't talk all the time.
   */
  const nextScene = (tapped: boolean) => {
    const index = (atRef.current.scene + 1) % scenes.length;
    const scene = scenes[index];
    goTo({ ...atRef.current, scene: index }, SCENE_MS);
    if (settings.sounds) SCENE_SOUNDS[scene.sound]();
    // Once per round the voice says what the ✓ is for; after that only tapped scenes speak.
    if (!toldFinish.current) {
      toldFinish.current = true;
      say(`${texts.scenes[scene.id]} ${texts.finish}`);
    } else if (tapped) say(texts.scenes[scene.id]);
  };

  /**
   * A tap anywhere on the picture (not on a button) or a key: while sitting the next thought, everywhere else just what
   * „Weiter“ does, also while the step's sounds still run (what the child said stays as picked, unknown when nobody
   * did). It only sparkles at the end, right after a step began (a double tap), and while a thought still runs.
   */
  const act = (x?: number, y?: number) => {
    const { step: index, nothing } = atRef.current;
    const here = storyFor(nothing);
    const sittingNow = here[index].id === "sit";
    if (index >= here.length - 1 || (sittingNow ? busyRef.current : performance.now() - startedAt.current < TAP_GUARD_MS)) {
      spawn(x, y);
      if (settings.sounds) playRandomNote();
      return;
    }
    if (sittingNow) nextScene(true);
    else {
      if (settings.sounds) playPop();
      jump(index + 1);
    }
  };

  // The story goes on by itself where nothing real has to happen (Step.auto), and the thoughts follow each other. Through a ref, so the timer started for a step runs with what was picked meanwhile.
  const goOn = useRef(() => {});
  goOn.current = () => {
    if (storyFor(atRef.current.nothing)[atRef.current.step].id === "sit") nextScene(false);
    else begin(atRef.current.step + 1);
  };
  useEffect(() => {
    const here = storyFor(at.nothing)[at.step];
    const ms = here.id === "sit" && at.scene >= 0 ? WAIT_SCENE_MS : here.auto;
    if (ms === undefined) return;
    const timer = setTimeout(() => goOn.current(), ms);
    return () => clearTimeout(timer);
  }, [at]);

  /** A button while calling: what the child said is kept, and the story goes on with it at once – the only way on there. */
  const pick = (choice: Went, e: PointerEvent) => {
    if (settings.sounds) playPop();
    spawn(e.clientX, e.clientY);
    setSaid(choice);
    stopTimers();
    begin(atRef.current.step + 1, { came: null, said: choice });
    // Said before the next step's words, which the speech queues after it.
    say(texts.said[choice]);
  };

  /** A ✓ while sitting: a grown-up says what is in the potty, and the story goes on with it. */
  const finish = (came: Went) => {
    checked.current = true;
    setWent(came);
    begin(atRef.current.step + 1, { came });
  };

  /** Nothing came: the other story, washing hands and then playing, until Mama and Papa ask again. */
  const finishWithNothing = () => {
    checked.current = false;
    setWent(null);
    begin(SIT + 1, { came: null, nothing: true });
  };

  /** Stops what the step before still had to play, so another one can begin at once. */
  const stopTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    busyRef.current = false;
  };

  /**
   * A tap on the row of steps: the story jumps there at once, also while a step still plays. Before the
   * potty nothing has come yet; from „fertig“ on, what the child said came (both when nobody knew) unless a ✓ chose.
   * Back on the potty or before it, the usual story starts again, since nothing has been chosen there yet.
   */
  const jump = (index: number) => {
    stopTimers();
    const nothing = atRef.current.nothing && index > SIT;
    const came = nothing || index < DONE ? null : (went ?? expectedWent(said));
    if (came === null) checked.current = false;
    setWent(came);
    begin(index, { came, nothing });
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
    checked.current = false;
    starred.current = false;
    setFresh(false);
    begin(0, { came: null, said: "unsure", nothing: false });
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      // While sitting Enter is the ✓ for what the child said (pipi when it said both or nothing), every other key the
      // next thought. Everywhere else every key is „Weiter“.
      const here = storyFor(atRef.current.nothing)[atRef.current.step];
      if (e.key === "Enter" && here?.id === "sit" && !busyRef.current) finish(expected ?? "pipi");
      else act();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // While sitting the picture stays the same (its frames only clap): the thoughts come in the bubble, so nothing jumps.
  const pictures = picturesFor(step, went ?? said).map((p) => `${TAPSI.pictures}-${p}`);
  const moves = step.moves?.map((p) => `${TAPSI.pictures}-${p}`);
  const thought = sitting && at.scene >= 0 ? scenes[at.scene] : null;
  const thoughtPicture = thought ? `${TAPSI.pictures}-${scenePicture(thought)}` : "";
  // The picture before stays under the new one while it fades in, so pictures blend into each other.
  const [shown, setShown] = useState({ now: pictures, before: null as string[] | null });
  if (shown.now.join() !== pictures.join()) setShown({ now: pictures, before: shown.now });
  /** The needs Tapsi feels and calls for: both while nobody knows. */
  const feels = said === "pipi" || said === "kaka" ? [said] : NEEDS;
  /** The ✓ with a yellow ring: what the child said, when that was one of the two. */
  const expected = said === "pipi" || said === "kaka" ? said : null;

  return (
    <div className={`potty-play pt-${went ?? said} pt-at-${step.id}${busy ? " busy" : ""}`} onPointerDown={(e: PointerEvent) => act(e.clientX, e.clientY)}>
      {shown.before && <StoryPicture key={`before-${shown.before.join()}`} name={shown.before} moving={false} />}
      <StoryPicture key={pictures.join()} name={pictures} moves={moves} again={step.again} moving className="pt-picture pt-picture-new" />

      {/* Drawn on top of the picture: what the animal feels and says, without words. */}
      {step.id === "need" && (
        <div key={beat} className="pt-feel" aria-hidden>
          {feels.map((n) => (n === "pipi" ? "💦" : "🌀")).join("")}
        </div>
      )}
      {/* While sitting: everybody waits (a clock on the wall ticks), Tapsi thinks of things that help in a bubble. */}
      {sitting && <WaitClock />}
      {thought && (
        <div className="pt-think" aria-hidden>
          <div key={beat} className="pt-think-scene">
            {framesFor(thoughtPicture).length > 0 ? (
              <StoryPicture name={thoughtPicture} moving className="pt-think-picture" />
            ) : (
              <span className="pt-think-emoji">{thought.emoji}</span>
            )}
          </div>
        </div>
      )}
      {/* The end: this week's stars over the party picture. */}
      {step.id === "stars" && <WeekStars log={log} fresh={fresh} />}
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
          {story.map((s, i) => (
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
          {/* What the child said: one choice of three, each going on at once, so each carries „Weiter“'s ▶ and they
              call for attention like „Weiter“ does elsewhere. */}
          {asking && (
            <div className="pt-choice pt-ask" role="group" aria-label={texts.askSaid}>
              <span className="pt-choice-label">{texts.askSaid}</span>
              <div className="pt-choice-buttons">
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
                    <span className="pt-said-next">▶</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* A ✓ for pipi and one for kaka, since what comes may not be what the child said: a grown-up taps what is in
              the potty (for both, either one: the user wanted only the two). */}
          {sitting && (
            <div className="pt-choice" role="group" aria-label={texts.askWent}>
              <span className="pt-choice-label">{texts.askWent}</span>
              <div className="pt-choice-buttons">
                {NEEDS.map((n) => (
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
                    <span className="pt-finish-need">{NEED_EMOJI[n]}</span>
                  </button>
                ))}
                {/* Nothing came: a story of its own, so it looks unlike the ✓, and says so in a word for the grown-up. */}
                <button
                  type="button"
                  className="pt-finish pt-nothing"
                  data-tap
                  aria-label={texts.nothing}
                  onPointerDown={(e) => {
                    if (busyRef.current) return; // the tap goes on to sparkle
                    e.stopPropagation();
                    finishWithNothing();
                  }}
                >
                  {texts.nothingButton}
                </button>
              </div>
            </div>
          )}

          {/* On the first steps nothing goes on without it, so it calls for attention there; never next to the buttons
              for what the child said, which are the way on then. */}
          {!sitting && !last && !asking && (
            <button type="button" className={`pt-next${step.nudge ? " nudge" : ""}`} data-tap aria-label={texts.next} onPointerDown={next}>
              ▶
            </button>
          )}
        </div>
      </div>

      {/* There is one story only, so „Weiter“ would be „Nochmal“ again: only „Menü“ and „Nochmal“, small in the corners
          so the party picture stays free. */}
      {last && <GameEnd delayMs={step.ms} onAgain={restart} corners />}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
