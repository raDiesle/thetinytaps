import { type ReactNode, useEffect } from "react";
import { useCommonSettings } from "@/lib/common";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { playLullaby } from "@/lib/sfx";
import { hush as hushVoice, recordedVoice } from "@/lib/voice";
import goodNightFiles from "./stimme/**/*.mp3?glob";

// The one good-night screen of play time (`src/lib/playtime.ts`): a game shows it when the time runs out (GameShell),
// and the lock over the menus shows the same sky afterwards (PlaytimeLock). Its styles are in `src/styles/playtime.css`.

/** The good-night sentence's recordings. */
const goodNightVoice = recordedVoice(goodNightFiles);

/** Said when play time is over, from its recording (src/components/stimme/). */
export const GOOD_NIGHT: Localized = {
  de: "Gute Nacht! Die Spielzeit ist vorbei.",
  ru: "Спокойной ночи! Время игры закончилось.",
  en: "Good night! Play time is over.",
  zh: "晚安！游戏时间结束了。",
  hi: "शुभ रात्रि! खेलने का समय ख़त्म हो गया।",
  es: "¡Buenas noches! Se acabó el tiempo de juego.",
  ar: "ليلة سعيدة! انتهى وقت اللعب.",
};

/** Star positions in percent of the screen, with a twinkle delay in seconds. */
const STARS: [number, number, number][] = [
  [8, 12, 0],
  [22, 30, 1.2],
  [35, 8, 2.1],
  [52, 22, 0.6],
  [68, 10, 1.7],
  [84, 26, 0.3],
  [92, 8, 2.4],
  [14, 52, 1.9],
  [78, 48, 0.9],
  [44, 40, 2.8],
];

/**
 * The night sky with the moon, the sleeping teddy and „Gute Nacht!“; what follows the words (a hint, the grown-ups'
 * ⏳) comes as `children`.
 */
export function GoodNightSky({ still, role, children }: { still?: boolean; role?: "status"; children?: ReactNode }) {
  const t = useT();
  return (
    <div className="good-night" role={role}>
      {STARS.map(([x, y, delay], i) => (
        <span
          key={i}
          className="good-night-star"
          style={still ? { left: `${x}%`, top: `${y}%` } : { left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s` }}
          aria-hidden
        >
          ✦
        </span>
      ))}
      <span className="good-night-moon" aria-hidden>
        🌙
      </span>
      <span className="good-night-sleeper" aria-hidden>
        🧸<span className="good-night-zzz">💤</span>
      </span>
      <p className="good-night-text">
        {t({ de: "Gute Nacht!", ru: "Спокойной ночи!", en: "Good night!", zh: "晚安！", hi: "शुभ रात्रि!", es: "¡Buenas noches!", ar: "ليلة سعيدة!" })}
      </p>
      {children}
    </div>
  );
}

/** Play time is over in a game: a quiet night sky that ignores taps and keys until a grown-up exits. */
export function GoodNight() {
  const t = useT();
  const language = useAppLanguage();
  const [{ leave }] = useCommonSettings();
  useEffect(() => {
    playLullaby();
    const timer = setTimeout(() => goodNightVoice.say(GOOD_NIGHT[language.id] ?? GOOD_NIGHT.de, language.id, { english: GOOD_NIGHT.en }), 1200);
    return () => {
      clearTimeout(timer);
      hushVoice();
    };
  }, [language.id]);

  return (
    <GoodNightSky role="status">
      {/* No side named: the ✕ is the page's corner, top left. */}
      <p className="good-night-hint">
        {leave === "hold"
          ? t({
              de: "Die Spielzeit ist vorbei. Zum Beenden ✕ gedrückt halten.",
              ru: "Время игры закончилось. Чтобы выйти, удерживайте ✕.",
              en: "Play time is over. To leave, hold ✕.",
              zh: "游戏时间结束了。按住 ✕ 即可退出。",
              hi: "खेलने का समय ख़त्म हो गया। बाहर निकलने के लिए ✕ दबाए रखें।",
              es: "Se acabó el tiempo de juego. Para salir, mantenga pulsada la ✕.",
              ar: "انتهى وقت اللعب. للخروج اضغطوا مطولًا على ✕.",
            })
          : t({
              de: "Die Spielzeit ist vorbei. Zum Beenden auf ✕ tippen.",
              ru: "Время игры закончилось. Чтобы выйти, нажмите ✕.",
              en: "Play time is over. To leave, tap ✕.",
              zh: "游戏时间结束了。轻点 ✕ 即可退出。",
              hi: "खेलने का समय ख़त्म हो गया। बाहर निकलने के लिए ✕ पर टैप करें।",
              es: "Se acabó el tiempo de juego. Para salir, toque la ✕.",
              ar: "انتهى وقت اللعب. للخروج انقروا على ✕.",
            })}
      </p>
    </GoodNightSky>
  );
}
