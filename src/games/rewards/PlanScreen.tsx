import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { dayKey } from "@/games/teeth/daytime";
import { useAppLanguage, useT, voiceFor } from "@/lib/language";
import { playChime, playCountNote, playPop, playTusch, playTwinkle, unlockAudio } from "@/lib/sfx";
import { type RoutineVisit, waitForStep } from "@/lib/routine";
import { speak, unlockSpeech } from "@/lib/speech";
import { forwardNearTaps } from "@/lib/tapTargets";
import { addStar, type LinkedDays, parseCellKey, type StarLog, takeBackStar } from "./board";
import { useRewardLabel } from "./BoardSheet";
import { ItemPic, Pic, picture } from "./pictures";
import {
  bigDayStep,
  counting,
  currentStep,
  exampleTicks,
  gameOf,
  moonsLeft,
  nightsUntil,
  pairsOf,
  type Plan,
  planProgress,
  restartDay,
  routineStep,
  starsOf,
  stepDone,
  stepsOn,
} from "./plan";
import { PLAN_SCREEN, PlanSheet, SLEEPS_LEFT, SLEEPS_UNTIL, type StepState, TODAY, useStepLabel } from "./PlanSheet";

/** How long „Zurück“ stays after a tick, for a grown-up whose child tapped too soon. */
const UNDO_MS = 8000;

/** A Countdown counts its moons one after the other, this far apart – faster with many, so a month takes no longer than a few seconds. */
const MOON_MS = 320;
const ALL_MOONS_MS = 4000;

/**
 * A card on its way between the row and the Fertig-Kiste, started on the next render: `into` the box from where it
 * was in the row, or back out of the box (one card after „Zurück“, all of them after „Von vorn“ – `key` empty).
 */
interface Move {
  key: string;
  from: DOMRect;
  into: boolean;
}

/** Plays a card's way from `from` to where it now is, shrunk or grown from `scale`. */
function flyFrom(el: Element, from: DOMRect, scale: number, delay = 0) {
  const to = el.getBoundingClientRect();
  const dx = from.left + from.width / 2 - (to.left + to.width / 2);
  const dy = from.top + from.height / 2 - (to.top + to.height / 2);
  el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${scale})` }, { transform: "none" }], {
    duration: 550,
    delay,
    easing: "cubic-bezier(0.3, 0, 0.2, 1)",
    fill: "backwards",
  });
}

/**
 * A plan on screen, as big as the room allows, and how its steps get done: the child taps the card that glows
 * („Jetzt“) when that step is done – it gets a tick with a sound and the next card glows. A card done before
 * twinkles, a later one wiggles and says when it comes („noch 2-mal schlafen“ in the week). The last tick of the day
 * is a party, and „↺ Von vorn“ starts the day again (after an Erst–Dann, the next one). On a Jetzt – Dann the marker
 * slides on to the next card, as the child moves the paper one; with its „Jetzt“ field a done card flies into the
 * Fertig-Kiste instead of getting a tick, and „Von vorn“ takes them all out again. The teeth card under
 * „Jetzt“ opens Zähne putzen instead, which comes back here with the card done. A new plan shows example ticks until
 * the first tap. Where the cards count stars (a Zähler above 0), any open card of today takes a tap: one star per tap
 * pops into its fields until it has its Zähler's stars, and the reward's party comes when the goal is reached. A
 * Countdown has nothing to tick: a tap (or a key) counts its moons one by one, each with a rising note, and the big day's
 * picture jumps at the end – on the day itself the tap is its party.
 */
export function PlanScreen({
  plan,
  log,
  setLog,
  linked,
  day,
  sounds,
  speech,
  onExamplesOff,
}: {
  plan: Plan;
  log: StarLog;
  setLog: (log: StarLog) => void;
  linked: LinkedDays;
  /** The day shown: today, or another one a grown-up looks at (only today's cards can be ticked). */
  day: Date;
  sounds: boolean;
  speech: boolean;
  onExamplesOff: () => void;
}) {
  const t = useT();
  const language = useAppLanguage();
  const stepLabel = useStepLabel();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const box = useRef<HTMLDivElement>(null);
  const [aspect, setAspect] = useState(1.6);
  const [fresh, setFresh] = useState<string | null>(null);
  const [undo, setUndo] = useState<string | null>(null);
  const [party, setParty] = useState<string | null>(null);
  const bigDay = plan.view === "countdown" ? bigDayStep(plan) : undefined;
  /** The party is the reward's, its stars all there (else the day's, every card done). */
  const [won, setWon] = useState(false);
  const rewardLabel = useRewardLabel();
  const counts = counting(plan);
  const { effects, glow, celebrate } = useTapFeedback();
  const move = useRef<Move | null>(null);
  /** A Countdown's moons still to count: a new tap starts the count again. */
  const moonTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  /** Where the marker lay before a tick or „Zurück“: it slides from there to the card to do now. */
  const markerFrom = useRef<DOMRect | null>(null);
  const today = new Date();
  const ticks = log[plan.id];
  const shown = plan.examples ? { ...exampleTicks(plan, today), ...ticks } : ticks;
  const todaySteps = stepsOn(plan, today);
  const allDone = todaySteps.length > 0 && currentStep(todaySteps, ticks, linked, today) === -1;
  /** A Jetzt – Dann with the „Jetzt“ field puts done cards into the Fertig-Kiste; the others keep them in place with a tick. */
  const boxed = plan.view === "day" && !!plan.nowField;
  /** An Erst–Dann's pairs done today: „Von vorn“ makes them ready for the next time. */
  const pairsDone = plan.view === "first-then" ? pairsOf(todaySteps).filter((pair) => pair.every((step) => stepDone(ticks, linked, today, step))) : [];

  const sound = (play: () => void) => sounds && play();
  // A line without its translation is German and gets the German voice.
  const say = (text: string) => speech && speak(text, voiceFor(text, language));

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setAspect(el.clientWidth / Math.max(1, el.clientHeight)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Taps a little next to a card still count for it (see tapTargets.ts).
  useEffect(() => (box.current ? forwardNearTaps(box.current) : undefined), []);

  useEffect(() => {
    if (!undo) return;
    const timer = setTimeout(() => setUndo(null), UNDO_MS);
    return () => clearTimeout(timer);
  }, [undo]);

  useEffect(() => {
    setUndo(null);
    setFresh(null);
    setParty(null);
  }, [plan.id]);

  useEffect(() => () => moonTimers.current.forEach(clearTimeout), []);

  // A card that just went into the box or came out of it flies there from where it was (only after a tap).
  useLayoutEffect(() => {
    const m = move.current;
    const root = box.current;
    const from = markerFrom.current;
    move.current = null;
    markerFrom.current = null;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const marker = root.querySelector(".pl-marker");
    if (from && marker) flyFrom(marker, from, 1);
    if (!m) return;
    if (m.into) {
      const card = root.querySelector<HTMLElement>(`.pl-box-card[data-step="${m.key}"]`);
      if (card) flyFrom(card, m.from, m.from.height / Math.max(1, card.getBoundingClientRect().height));
      return;
    }
    const cards = root.querySelectorAll<HTMLElement>(m.key ? `.pl-dayview .pl-card[data-step="${m.key}"]` : ".pl-dayview .pl-card");
    cards.forEach((card, i) => flyFrom(card, m.from, 0.2, i * 70));
  });

  /** Notes where the marker is, so it slides on from there after the next render. */
  const keepMarker = () => {
    markerFrom.current = box.current?.querySelector(".pl-marker")?.getBoundingClientRect() ?? null;
  };

  /** Where the Fertig-Kiste is now, for a card leaving it; null in the week, which has none. */
  const boxRect = () => box.current?.querySelector(".pl-box")?.getBoundingClientRect() ?? null;

  /** Restarts a short CSS animation on a card. */
  const poke = (el: Element, name: "wiggle" | "twinkle") => {
    el.classList.remove("wiggle", "twinkle");
    void (el as HTMLElement).offsetWidth;
    el.classList.add(name);
  };

  // Keys: the card to do now wiggles and says itself; a key never ticks it, only the child's tap on it does.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || (e.target as Element).closest("input, textarea, button, a, select")) return;
      unlockAudio();
      if (plan.view === "countdown") return countDown();
      const now = box.current?.querySelector("[data-state='now']") ?? box.current?.querySelector("[data-state='done']");
      if (now) poke(now, now.getAttribute("data-state") === "now" ? "wiggle" : "twinkle");
      sound(playTwinkle);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  /**
   * A Countdown tapped: its moons light up one after the other with rising notes, then the big day's picture jumps, and
   * it says „Noch 3-mal schlafen, dann Geburtstag“. On the day itself the picture's party instead.
   */
  const countDown = () => {
    const root = box.current;
    const step = bigDayStep(plan);
    if (!root || !step) return;
    moonTimers.current.forEach(clearTimeout);
    const card = root.querySelector(".pl-big-day");
    const moons = moonsLeft(plan, day);
    if (moons === 0) {
      if (card) poke(card, "wiggle");
      setWon(false);
      setParty(step.emoji);
      sound(playTusch);
      celebrate();
      say(
        `${t({ de: "Heute ist es so weit:", en: "Today is the day:", zh: "今天就是这一天：", hi: "आज वह दिन आ गया:", es: "¡Hoy es el día!", ar: "اليوم هو اليوم:", ru: "Сегодня этот день:" })} ${stepLabel(step)}`,
      );
      return;
    }
    const each = Math.min(MOON_MS, ALL_MOONS_MS / moons);
    const later = (ms: number, then: () => void) => moonTimers.current.push(setTimeout(then, ms));
    root.querySelectorAll(".pl-moon").forEach((moon, i) =>
      later(i * each, () => {
        poke(moon, "twinkle");
        sound(() => playCountNote(i));
      }),
    );
    later(moons * each, () => {
      if (card) poke(card, "wiggle");
      sound(playChime);
    });
    say(t(SLEEPS_UNTIL)(moons, stepLabel(step)));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    unlockAudio();
    unlockSpeech();
    if (plan.view === "countdown") {
      if ((e.target as Element).closest("[data-moon], [data-big-day]")) countDown();
      return;
    }
    const header = (e.target as Element).closest<HTMLElement>("[data-day]");
    if (header) return sayDay(header);
    const el = (e.target as Element).closest<HTMLElement>("[data-step]");
    const doneBox = el ? null : (e.target as Element).closest<HTMLElement>("[data-box]");
    if (!el && !doneBox) return;
    // The first tap ends the examples and shows the plan as it really is.
    if (plan.examples) {
      const from = boxRect();
      if (from) move.current = { key: "", from, into: false };
      keepMarker();
      onExamplesOff();
      sound(playPop);
      return;
    }
    if (doneBox) return sayBox(doneBox);
    if (!el) return;
    const key = el.dataset.step as string;
    const state = el.dataset.state as StepState;
    const { day: stepDay, taskId } = parseCellKey(key);
    const steps = stepsOn(plan, stepDay);
    const index = steps.findIndex((step) => step.id === taskId);
    const step = steps[index];
    if (!step) return;
    const label = stepLabel(step);
    if (state === "done") {
      poke(el, "twinkle");
      sound(playTwinkle);
      say(label);
      return;
    }
    if (state === "later") {
      poke(el, "wiggle");
      sound(playPop);
      const nights = nightsUntil(today, stepDay);
      say(nights > 0 ? `${t(SLEEPS_LEFT)(nights)}: ${label}` : label);
      return;
    }
    // The teeth card opens Zähne putzen; leaving comes back here, and a finished brushing ticks this card.
    const game = gameOf(step);
    if (game) {
      sound(playPop);
      waitForStep(pathname, routineStep(plan.id, key));
      navigate(game, { state: { returnTo: pathname } satisfies RoutineVisit });
      return;
    }
    // The card to do now: done, with a tick, and the next one glows – or, counting stars, one star more on it.
    const before = planProgress(plan, ticks, linked, stepDay);
    const next = addStar(log, plan.id, key, today, starsOf(step));
    const after = planProgress(plan, next[plan.id], linked, stepDay);
    if (boxed) move.current = { key, from: el.getBoundingClientRect(), into: true };
    keepMarker();
    setLog(next);
    setFresh(key);
    setUndo(key);
    sound(playChime);
    const rect = el.getBoundingClientRect();
    glow(rect.left + rect.width / 2, rect.top + rect.height / 2);
    // The reward reached: its party, whatever else is left.
    if (counts && plan.reward && before.count < before.goal && after.count >= after.goal) {
      const reward = plan.reward;
      setTimeout(() => {
        setWon(true);
        setParty(reward.emoji);
        sound(playTusch);
        celebrate();
        say(
          `${t({ de: "Geschafft! Jetzt gibt es:", en: "You did it! Now it’s time for:", zh: "完成啦！现在可以：", hi: "हो गया! अब बारी है:", es: "¡Lo lograste! Ahora toca:", ar: "نجحنا! والآن:", ru: "Получилось! А теперь:" })} ${rewardLabel(reward)}`,
        );
      }, 450);
      return;
    }
    // Counting stars, the card isn't done until it has them all: it says itself again.
    if (counts && !stepDone(next[plan.id], linked, stepDay, step)) {
      say(label);
      return;
    }
    // An Erst–Dann pair stands on its own: done with its Dann card, and its Erst card says what comes then.
    const pair = plan.view === "first-then" ? pairsOf(steps)[Math.floor(index / 2)] : steps;
    const left = currentStep(pair, next[plan.id], linked, stepDay);
    if (left === -1) {
      setTimeout(() => {
        setWon(false);
        setParty(step.emoji);
        sound(playTusch);
        celebrate();
        say(
          t({
            de: "Alles geschafft! Hurra!",
            en: "All done! Hooray!",
            zh: "全部完成啦！好耶！",
            hi: "सब हो गया! हुर्रे!",
            es: "¡Todo listo! ¡Hurra!",
            ar: "انتهينا من كل شيء! يا للفرح!",
            ru: "Всё готово! Ура!",
          }),
        );
      }, 450);
    } else if (counts) {
      say(t({ de: "Super!", en: "Super!", zh: "太棒了！", hi: "शाबाश!", es: "¡Genial!", ar: "رائع!", ru: "Супер!" }));
    } else {
      say(
        `${t({ de: "Super! Jetzt:", en: "Super! Now:", zh: "太棒了！现在：", hi: "शाबाश! अब:", es: "¡Genial! Ahora:", ar: "رائع! والآن:", ru: "Супер! Теперь:" })} ${stepLabel(pair[left])}`,
      );
    }
  };

  /** The Fertig-Kiste tapped: it wiggles and names what is in it. */
  const sayBox = (el: HTMLElement) => {
    poke(el, "wiggle");
    sound(playPop);
    const done = stepsOn(plan, day).filter((step) => stepDone(ticks, linked, day, step));
    say(
      done.length
        ? `${t({ de: "Schon fertig:", en: "Already done:", zh: "已经完成：", hi: "हो चुका है:", es: "Ya está hecho:", ar: "انتهينا من:", ru: "Уже готово:" })} ${done.map(stepLabel).join(", ")}`
        : t({
            de: "Hier kommt rein, was fertig ist.",
            en: "What’s done goes in here.",
            zh: "做完的放到这里。",
            hi: "जो हो गया, वह यहाँ आता है।",
            es: "Aquí va lo que ya está hecho.",
            ar: "هنا نضع ما انتهينا منه.",
            ru: "Сюда кладём то, что готово.",
          }),
    );
  };

  /** A day of the week tapped: it says when it is and what comes then. */
  const sayDay = (header: HTMLElement) => {
    poke(header, "wiggle");
    sound(playPop);
    const d = new Date(`${header.dataset.day}T12:00`);
    const nights = nightsUntil(today, d);
    const when =
      nights === 0
        ? t(TODAY)
        : nights === 1
          ? t({
              de: "Morgen, noch einmal schlafen",
              en: "Tomorrow, one more sleep",
              zh: "明天，再睡一觉",
              hi: "कल, बस एक बार और सोना है",
              es: "Mañana, falta una noche",
              ar: "غدًا، بعد ليلة واحدة",
              ru: "Завтра, ещё разок поспать",
            })
          : nights > 1
            ? t(SLEEPS_LEFT)(nights)
            : new Intl.DateTimeFormat(language.speechLang, { weekday: "long" }).format(d);
    say(`${when}: ${stepsOn(plan, d).map(stepLabel).join(", ")}`);
  };

  const takeBack = () => {
    if (!undo) return;
    const from = boxRect();
    if (from) move.current = { key: undo, from, into: false };
    keepMarker();
    setLog(takeBackStar(log, plan.id, undo));
    setUndo(null);
    setFresh(null);
  };

  /** „Von vorn“: the day's ticks go (an Erst–Dann's only for its pairs done), and every card comes back out of the box. */
  const startOver = () => {
    const from = boxRect();
    if (from) move.current = { key: "", from, into: false };
    setLog(restartDay(log, plan.id, today, pairsDone.length ? pairsDone.flat().map((step) => step.id) : undefined));
  };

  return (
    <div className="rw-screen">
      <div ref={box} className="rw-screen-box" onPointerDown={onPointerDown}>
        <PlanSheet plan={plan} ticks={shown} linked={linked} today={today} day={day} look={PLAN_SCREEN} aspect={aspect} fresh={fresh} />
      </div>
      {plan.examples && (
        <div className="rw-example-note">
          <span>
            ✨{" "}
            {boxed
              ? t({
                  de: "Die Karten in der Kiste sind nur ein Beispiel – mit dem ersten Tippen kommen sie wieder heraus.",
                  en: "The cards in the box are only an example – the first tap brings them back out.",
                  zh: "盒子里的卡片只是示例——第一次点按后它们就会回来。",
                  hi: "डिब्बे के कार्ड सिर्फ़ उदाहरण हैं – पहली बार टैप करते ही ये बाहर आ जाएँगे।",
                  es: "Las tarjetas de la caja son solo un ejemplo: con el primer toque vuelven a salir.",
                  ar: "البطاقات في الصندوق مجرد مثال – تخرج منه مع أول نقرة.",
                  ru: "Карточки в коробке – только пример: при первом касании они вернутся обратно.",
                })
              : t({
                  de: "Die Haken sind nur ein Beispiel – mit dem ersten Tippen gehen sie weg.",
                  en: "The ticks are only an example – they go away with the first tap.",
                  zh: "这些勾只是示例——第一次点按后就会消失。",
                  hi: "ये सही के निशान सिर्फ़ उदाहरण हैं – पहली बार टैप करते ही हट जाएँगे।",
                  es: "Las marcas son solo un ejemplo: desaparecen con el primer toque.",
                  ar: "علامات الصح مجرد مثال – تختفي مع أول نقرة.",
                  ru: "Галочки – только пример: они исчезнут при первом касании.",
                })}
          </span>
          <button type="button" onClick={onExamplesOff}>
            {t({ de: "Ausblenden", en: "Hide", zh: "隐藏", hi: "छिपाएँ", es: "Ocultar", ar: "إخفاء", ru: "Скрыть" })}
          </button>
        </div>
      )}
      {!plan.examples && (allDone || pairsDone.length > 0) && dayKey(day) === dayKey(today) && (
        <button type="button" className="pl-again" onClick={startOver}>
          ↺ {t({ de: "Von vorn", en: "Start again", zh: "重新开始", hi: "फिर से शुरू", es: "Otra vez", ar: "من جديد", ru: "Сначала" })}
        </button>
      )}
      {undo && (
        <button type="button" className="rw-undo" onClick={takeBack}>
          ↶ {t({ de: "Zurück", en: "Undo", zh: "撤销", hi: "वापस", es: "Deshacer", ar: "تراجع", ru: "Отменить" })}
        </button>
      )}
      {party && (
        <button type="button" className="rw-party" onClick={() => setParty(null)}>
          {/* A Countdown's party is its big day, never „Alles geschafft!“: nothing was done, the day has come. */}
          <span className="rw-party-emoji" aria-hidden>
            {won && plan.reward ? (
              <ItemPic item={plan.reward} kind="reward" />
            ) : bigDay ? (
              <ItemPic item={bigDay} kind="task" />
            ) : (
              <Pic src={picture("fest")} emoji={party} />
            )}
          </span>
          <span className="rw-party-text">
            {won && plan.reward
              ? rewardLabel(plan.reward)
              : bigDay
                ? stepLabel(bigDay)
                : t({
                    de: "Alles geschafft!",
                    en: "All done!",
                    zh: "全部完成啦！",
                    hi: "सब हो गया!",
                    es: "¡Todo listo!",
                    ar: "انتهينا من كل شيء!",
                    ru: "Всё готово!",
                  })}
          </span>
        </button>
      )}
      <FeedbackLayer effects={effects} />
    </div>
  );
}
