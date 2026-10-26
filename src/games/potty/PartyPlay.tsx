import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { GameEnd } from "@/components/GameEnd";
import { dayKey, weekOf } from "@/games/teeth/daytime";
import { type Localized, useAppLanguage, useT, voiceFor } from "@/lib/language";
import { playMelody, playPop, playRandomNote, playTwinkle, recorded } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { POTTY_TEXTS, TAPSI } from "./content";
import type { PottySettings } from "./settings";
import { addStar, loadStars, saveStars, type StarLog } from "./stars";
import { StoryPicture } from "./StoryPicture";

const cheer = recorded("cheer", playMelody);
const partyHorn = recorded("partyhorn", playPop);

/** The jumping and the confetti, before „Menü / Nochmal / Weiter“ show. */
const PARTY_MS = 2600;

/** More stars than this on one day are shown as a number. */
const MAX_SHOWN = 4;

const DAY_NAMES: Localized<string[]> = { de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] };

/**
 * „Hat geklappt!“: the child really went to the potty. The first tap brings
 * applause, confetti and a star on today's column of the week; further taps
 * only sparkle, so one opening is one star.
 */
export function PartyPlay({ settings, onStory }: { settings: PottySettings; onStory: () => void }) {
  const language = useAppLanguage();
  const t = useT();
  const texts = t(POTTY_TEXTS);
  const [log, setLog] = useState<StarLog>(loadStars);
  /** The star of this opening is on the chart. */
  const [starred, setStarred] = useState(false);
  /** Bumped for every celebration, so the jump plays again for „Nochmal“. */
  const [party, setParty] = useState(0);
  const [ended, setEnded] = useState(false);
  const { bursts, spawn } = useBursts();
  const starredRef = useRef(false);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const today = new Date();

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

  const celebrate = () => {
    setParty((p) => p + 1);
    setEnded(false);
    if (settings.sounds) {
      cheer();
      later(300, partyHorn);
    }
    for (let i = 0; i < 14; i++) later(i * 140, () => spawn());
    later(PARTY_MS, () => setEnded(true));
  };

  const act = (x?: number, y?: number) => {
    if (starredRef.current) {
      spawn(x, y);
      if (settings.sounds) playRandomNote();
      return;
    }
    starredRef.current = true;
    setStarred(true);
    const next = addStar(loadStars(), new Date());
    setLog(next);
    saveStars(next);
    if (settings.speech) speak(texts.star, voiceFor(texts.star, language));
    if (settings.sounds) later(900, playTwinkle);
    celebrate();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      act();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const todayKey = dayKey(today);
  const dayNames = t(DAY_NAMES);

  return (
    <div className={`potty-party${party > 0 ? " pt-happy" : ""}`} onPointerDown={(e: PointerEvent) => act(e.clientX, e.clientY)}>
      <StoryPicture key={party} name={`${TAPSI.pictures}-party`} moving={party > 0} className="pt-party-picture" />
      <ol className="pt-week" aria-label={t({ de: "Sterne dieser Woche" })}>
        {weekOf(today).map((day, i) => {
          const key = dayKey(day);
          const isToday = key === todayKey;
          const count = log[key] ?? 0;
          return (
            <li key={key} className={`pt-day${isToday ? " today" : ""}`}>
              {isToday && <span className="pt-today-tag">{t({ de: "Heute" })}</span>}
              <span className="pt-day-name">{dayNames[i]}</span>
              <span className="pt-day-stars" aria-label={`${count} ⭐`}>
                {count > MAX_SHOWN ? (
                  <span className={isToday && starred ? "pt-star fresh" : "pt-star"}>⭐×{count}</span>
                ) : (
                  Array.from({ length: count }, (_, k) => (
                    <span key={k} className={isToday && starred && k === count - 1 ? "pt-star fresh" : "pt-star"}>
                      ⭐
                    </span>
                  ))
                )}
                {isToday && !starred && <span className="pt-star empty">☆</span>}
              </span>
            </li>
          );
        })}
      </ol>
      {ended && <GameEnd onAgain={celebrate} next={{ emoji: "💧", name: t({ de: "Muss Pipi!" }), onNext: onStory }} />}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
