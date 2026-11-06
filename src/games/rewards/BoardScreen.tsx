import { useEffect, useRef, useState } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { playChime, playPop, playTusch, playTwinkle, unlockAudio } from "@/lib/sfx";
import { useAppLanguage, useT, voiceFor } from "@/lib/language";
import { speak, unlockSpeech } from "@/lib/speech";
import { forwardNearTaps } from "@/lib/tapTargets";
import {
  addStar,
  addWayStar,
  type Board,
  type BoardReward,
  type CollectWay,
  collectWays,
  dayFull,
  exampleStars,
  type LinkedDays,
  parseCellKey,
  progress,
  type StarLog,
  suggestsCertificate,
  takeBackStar,
  takeBackWayStar,
  wayCount,
} from "./board";
import { BoardSheet, type FieldState, SCREEN_LOOK, useRewardLabel, useTaskLabel } from "./BoardSheet";
import { ItemPic, Pic, picture } from "./pictures";

/** How long „Stern zurück“ stays after a star, for a grown-up who tapped the wrong field. */
const UNDO_MS = 8000;

/** Where a tapped star lands. */
interface Landing {
  /** The field it lands on. */
  field: string;
  /** Its log key: a `cellKey`, or null on a collecting board. */
  key: string | null;
  /** On a collecting board: the way it lands on. */
  way?: CollectWay;
  /** Day of the field, for the „day full“ party. */
  day: Date;
}

/**
 * The board on screen, as big as the room allows, and how stars come on it: the child taps an open field and its star
 * pops in with a sound – one tap is enough (user decision, November 2026: no grown-up's hold, no big star to send off
 * first). A star already there twinkles, a later day's field wiggles. A full day, and the reward reached, are
 * celebrated. Stars are never taken away – „Stern zurück“ only undoes a wrong tap right after it.
 * A new board shows example stars (`Board.examples`) until its first real star.
 */
export function BoardScreen({
  board,
  log,
  setLog,
  linked,
  day,
  sounds,
  speech,
  onExamplesOff,
  onCertificate,
}: {
  board: Board;
  log: StarLog;
  setLog: (log: StarLog) => void;
  linked: LinkedDays;
  /** A day of the week, month or day shown: today, or an earlier one a grown-up went back to. */
  day: Date;
  sounds: boolean;
  speech: boolean;
  /** The example stars go: with the first real star, or when a grown-up hides them. */
  onExamplesOff: () => void;
  /** Opens „🏅 Urkunde“, which the board offers once its goal is reached (T-15). */
  onCertificate: () => void;
}) {
  const t = useT();
  const language = useAppLanguage();
  const taskLabel = useTaskLabel();
  const rewardLabel = useRewardLabel();
  const box = useRef<HTMLDivElement>(null);
  const [aspect, setAspect] = useState(1.6);
  const [fresh, setFresh] = useState<string | null>(null);
  const [undo, setUndo] = useState<{ key: string | null; way?: CollectWay } | null>(null);
  // The party's reward: a way's on a collecting board, else the board's; null for a party together.
  const [party, setParty] = useState<{ reward: BoardReward | null } | null>(null);
  const { effects, glow, celebrate } = useTapFeedback();
  const today = new Date();
  const stars = log[board.id];

  const sound = (play: () => void) => sounds && play();
  // A line without its translation is German and gets the German voice.
  const say = (text: string) => speech && speak(text, voiceFor(text, language));

  // The path of a collecting board follows the shape of the room it has.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setAspect(el.clientWidth / Math.max(1, el.clientHeight)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Taps a little next to a field still count for it (see tapTargets.ts).
  useEffect(() => (box.current ? forwardNearTaps(box.current) : undefined), []);

  useEffect(() => {
    if (!undo) return;
    const timer = setTimeout(() => setUndo(null), UNDO_MS);
    return () => clearTimeout(timer);
  }, [undo]);

  // Keys: the stars there twinkle (a key never gives a star, only a tap on a field does).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || (e.target as Element).closest("input, textarea, button, a")) return;
      unlockAudio();
      const filled = box.current?.querySelectorAll("[data-state='filled']") ?? [];
      for (const el of filled) poke(el, "twinkle");
      if (filled.length === 0) {
        const open = box.current?.querySelector("[data-state='open']");
        if (open) poke(open, "wiggle");
      }
      sound(playTwinkle);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  // Another board: nothing of this one's stars can be taken back there.
  useEffect(() => {
    setUndo(null);
    setFresh(null);
  }, [board.id]);

  /** Restarts a short CSS animation on a field. */
  const poke = (el: Element, name: "wiggle" | "twinkle") => {
    el.classList.remove("wiggle", "twinkle");
    void (el as HTMLElement).offsetWidth;
    el.classList.add(name);
  };

  /** What a field stands for, to say it: the task of a week or day board. */
  const fieldTask = (field: string) => board.tasks.find((task) => task.id === parseCellKey(field).taskId);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = (e.target as Element).closest<HTMLElement>("[data-field]");
    if (!el) return;
    unlockAudio();
    unlockSpeech();
    const field = el.dataset.field as string;
    const state = el.dataset.state as FieldState;
    const task = fieldTask(field);
    if (state === "filled") {
      if (task) say(taskLabel(task));
      poke(el, "twinkle");
      sound(playTwinkle);
      return;
    }
    if (state === "future") {
      if (task) say(taskLabel(task));
      poke(el, "wiggle");
      sound(playPop);
      return;
    }
    // An open field: its star comes at once; on a collecting board the next free field gets it, whichever was tapped.
    if (board.kind === "collect") {
      const way = collectWays(board)[Number(field.slice(1).split(".")[0])];
      if (way) land({ field: `c${way.index}.${wayCount(stars, way)}`, key: null, way, day: today });
    } else if (task) land({ field, key: field, day: parseCellKey(field).day });
  };

  /** A star lands on its field: the log, a pop and a sound, and the parties of a full day or the goal. */
  const land = (pending: Landing) => {
    const before = progress(board, stars, linked, day);
    const wasFull = dayFull(board, stars, linked, pending.day);
    const next = pending.way ? addWayStar(log, board, pending.way) : addStar(log, board.id, pending.key, today);
    const after = progress(board, next[board.id], linked, day);
    setLog(next);
    if (board.examples) onExamplesOff();
    setFresh(pending.field);
    setUndo({ key: pending.key, way: pending.way });
    sound(playChime);
    const target = document.querySelector(`[data-field="${CSS.escape(pending.field)}"]`)?.getBoundingClientRect();
    const x = target ? target.left + target.width / 2 : undefined;
    const y = target ? target.top + target.height / 2 : undefined;
    glow(x, y);
    // A collecting way's end is its own goal, with its own reward.
    const { way } = pending;
    const goalReached = way
      ? wayCount(stars, way) < way.goal && wayCount(next[board.id], way) >= way.goal
      : before.count < before.goal && after.count >= after.goal;
    const reward = way ? way.reward : board.reward;
    if (goalReached) {
      // The big party: the reward, or just the joy of it.
      setTimeout(() => {
        setParty({ reward });
        sound(playTusch);
        celebrate();
        say(
          reward
            ? `${t({ de: "Geschafft! Jetzt gibt es:", en: "You did it! Now it’s time for:", zh: "完成啦！现在可以：", hi: "हो गया! अब बारी है:", es: "¡Lo lograste! Ahora toca:", ar: "نجحنا! والآن:", ru: "Получилось! А теперь:" })} ${rewardLabel(reward)}`
            : t({
                de: "Geschafft! Hurra!",
                en: "You did it! Hooray!",
                zh: "完成啦！好耶！",
                hi: "हो गया! हुर्रे!",
                es: "¡Lo lograste! ¡Hurra!",
                ar: "نجحنا! يا للفرح!",
                ru: "Получилось! Ура!",
              }),
        );
      }, 500);
    } else if ((board.kind === "week" || board.kind === "month") && !wasFull && dayFull(board, next[board.id], linked, pending.day)) {
      // A day with all its stars: a small party right there.
      setTimeout(() => celebrate({ at: { x: x ?? window.innerWidth / 2, y: y ?? window.innerHeight / 2 } }), 120);
      setTimeout(() => sound(playChime), 300);
      say(
        t({
          de: "Super! Der Tag ist voll!",
          en: "Super! The day is full!",
          zh: "太棒了！今天满啦！",
          hi: "शाबाश! आज का दिन पूरा हो गया!",
          es: "¡Genial! ¡El día está completo!",
          ar: "رائع! اكتمل اليوم!",
          ru: "Супер! Весь день в звёздах!",
        }),
      );
    } else {
      say(t({ de: "Super!", en: "Super!", zh: "太棒了！", hi: "शाबाश!", es: "¡Genial!", ar: "رائع!", ru: "Супер!" }));
    }
  };

  const takeBack = () => {
    if (!undo) return;
    setLog(undo.way ? takeBackWayStar(log, board, undo.way) : takeBackStar(log, board.id, undo.key));
    setUndo(null);
    setFresh(null);
  };

  return (
    <div className="rw-screen">
      {/* The fields inside are the targets; one listener for all of them. */}
      <div ref={box} className="rw-screen-box" onPointerDown={onPointerDown}>
        <BoardSheet
          board={board}
          stars={stars}
          examples={board.examples ? exampleStars(board, day) : null}
          linked={linked}
          today={today}
          day={day}
          look={SCREEN_LOOK}
          aspect={aspect}
          fresh={fresh}
        />
      </div>
      {board.examples && (
        <div className="rw-example-note">
          <span>
            ✨{" "}
            {t({
              de: "Blasse Sterne sind nur ein Beispiel – mit dem ersten echten Stern gehen sie weg.",
              en: "Pale stars are only an example – they go away with the first real star.",
              zh: "浅色星星只是示例——放上第一颗真星星后就会消失。",
              hi: "हल्के सितारे सिर्फ़ उदाहरण हैं – पहला असली सितारा मिलते ही ये हट जाएँगे।",
              es: "Las estrellas pálidas son solo un ejemplo: desaparecen con la primera estrella de verdad.",
              ar: "النجوم الباهتة مجرد مثال – تختفي مع أول نجمة حقيقية.",
              ru: "Бледные звёзды – только пример: они исчезнут с первой настоящей звездой.",
            })}
          </span>
          <button type="button" onClick={onExamplesOff}>
            {t({ de: "Ausblenden", en: "Hide", zh: "隐藏", hi: "छिपाएँ", es: "Ocultar", ar: "إخفاء", ru: "Скрыть" })}
          </button>
        </div>
      )}
      {/* A line for grown-ups, never a tap a child sets off by chance: it only opens the panel. */}
      {!undo && suggestsCertificate(board, stars, linked, today) && (
        <div className="rw-example-note rw-cert-note">
          <span>
            🏅{" "}
            {t({
              de: "Klappt es schon von selbst? Dann gibt es eine Urkunde.",
              en: "Does it already work by itself? Then there’s a certificate.",
              zh: "已经能自己做到了吗？那就发一张奖状吧。",
              hi: "क्या यह अब अपने-आप होने लगा है? तो एक प्रमाण-पत्र बनता है।",
              es: "¿Ya sale solo? Entonces toca un diploma.",
              ar: "هل صار يتمّ من تلقاء نفسه؟ إذن هناك شهادة.",
              ru: "Уже получается само? Тогда пора вручить грамоту.",
            })}
          </span>
          <button type="button" onClick={onCertificate}>
            {t({ de: "Zur Urkunde", en: "To the certificate", zh: "去看奖状", hi: "प्रमाण-पत्र देखें", es: "Ver el diploma", ar: "إلى الشهادة", ru: "К грамоте" })}
          </button>
        </div>
      )}
      {undo && (
        <button type="button" className="rw-undo" onClick={takeBack}>
          ↶{" "}
          {t({
            de: "Stern zurück",
            en: "Take star back",
            zh: "撤回星星",
            hi: "सितारा वापस लें",
            es: "Quitar la estrella",
            ar: "التراجع عن النجمة",
            ru: "Убрать звезду",
          })}
        </button>
      )}
      {party && (
        <button type="button" className="rw-party" onClick={() => setParty(null)}>
          <span className="rw-party-emoji" aria-hidden>
            {party.reward ? <ItemPic item={party.reward} kind="reward" /> : <Pic src={picture("fest")} emoji="🎉" />}
          </span>
          <span className="rw-party-text">
            {party.reward
              ? rewardLabel(party.reward)
              : t({ de: "Geschafft!", en: "You did it!", zh: "完成啦！", hi: "हो गया!", es: "¡Lo lograste!", ar: "نجحنا!", ru: "Получилось!" })}
          </span>
        </button>
      )}
      <FeedbackLayer effects={effects} />
    </div>
  );
}
