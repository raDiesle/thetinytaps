/**
 * What `GameShell` shows about play time: the note on the start screen, the dusk of its last minute, and whether the
 * game on screen counts at all. The good-night screen is `GoodNight.tsx`, shared with `PlaytimeLock`.
 */
import { createContext, useContext, useEffect, useRef } from "react";
import { useT } from "@/lib/language";
import { usePlaytimeState } from "@/lib/playtime";
import { setSfxVolume } from "@/lib/sfx";

/** Whether what plays counts as play time: not a tool for the day (`GameShellProps.tool`) nor a routine's step. */
export const CountsPlaytime = createContext(true);

/** Whether the game on screen counts as play time, for the „Nochmal“ and „Weiter“ at the end of a level. */
export const useCountsPlaytime = () => useContext(CountsPlaytime);

/** On the start screen, for the grown-up: how much of today's play time is used. */
export function PlaytimeNote() {
  const t = useT();
  const { settings, played } = usePlaytimeState();
  if (settings.by === "none") return null;
  const playedMinutes = Math.min(Math.floor(played.ms / 60_000), settings.minutes);
  return (
    <p className="shared-settings-note">
      <span aria-hidden>⏳</span>{" "}
      {settings.by === "time"
        ? t({
            de: `Spielzeit heute: ${playedMinutes} von ${settings.minutes} Min.`,
            ru: `Время игры сегодня: ${playedMinutes} из ${settings.minutes} мин.`,
            en: `Play time today: ${playedMinutes} of ${settings.minutes} min`,
            zh: `今天的游戏时间：${playedMinutes} / ${settings.minutes} 分钟`,
            hi: `आज खेलने का समय: ${settings.minutes} में से ${playedMinutes} मिनट`,
            es: `Tiempo de juego hoy: ${playedMinutes} de ${settings.minutes} min`,
            ar: `وقت اللعب اليوم: ${playedMinutes} من ${settings.minutes} دقيقة`,
          })
        : t({
            de: `Spiele heute: ${Math.min(played.games, settings.games)} von ${settings.games}`,
            ru: `Игры сегодня: ${Math.min(played.games, settings.games)} из ${settings.games}`,
            en: `Games today: ${Math.min(played.games, settings.games)} of ${settings.games}`,
            zh: `今天的游戏：${Math.min(played.games, settings.games)} / ${settings.games} 局`,
            hi: `आज के खेल: ${settings.games} में से ${Math.min(played.games, settings.games)}`,
            es: `Juegos hoy: ${Math.min(played.games, settings.games)} de ${settings.games}`,
            ar: `ألعاب اليوم: ${Math.min(played.games, settings.games)} من ${settings.games}`,
          })}
    </p>
  );
}

/**
 * The last minute of play time: the screen slowly darkens, sounds get quieter
 * and every animation slows down. Once it is over (more time given, the game left), sounds and animations are as before.
 */
export function Dusk({ level }: { level: number }) {
  /** How fast each slowed animation ran before, to give that back when the dusk ends. */
  const slowed = useRef(new Map<Animation, number>());

  useEffect(() => {
    setSfxVolume(1 - 0.7 * level);
    const rate = 1 - 0.6 * level;
    for (const animation of document.getAnimations()) {
      const target = (animation.effect as KeyframeEffect | null)?.target;
      // The exit ring must keep matching its timer.
      if (target?.closest(".hold-exit")) continue;
      if (!slowed.current.has(animation)) slowed.current.set(animation, animation.playbackRate);
      animation.playbackRate = rate;
    }
  }, [level]);

  // Without this an animation still running stayed slow for good: after a grown-up gave more time, the game went on
  // at the last minute's pace.
  useEffect(() => {
    const before = slowed.current;
    return () => {
      setSfxVolume(1);
      for (const [animation, rate] of before) animation.playbackRate = rate;
      before.clear();
    };
  }, []);

  return <div className="playtime-dusk" style={{ opacity: 0.65 * level }} aria-hidden />;
}
