import { useState } from "react";
import { GameShell } from "@/components/GameShell";
import { Choice } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { PICTURES, TIMER_TITLE } from "./content";
import { OwnTimeSheet } from "./OwnTimeSheet";
import { DEFAULT_TIMER_SETTINGS, TIMER_MINUTES, TIMER_SETTINGS_KEY, type TimerPicture } from "./settings";
import { lengthWords, type OwnTime } from "./time";
import { TimerPlay } from "./TimerPlay";
import "./timer.css";

/** The row's value for the own time's slip and for „Andere …“, which opens the sheet instead of being chosen. */
const OWN = "own";
const OTHER = "other";

export function TimerGame() {
  const t = useT();
  const [settings, update] = useGameSettings(TIMER_SETTINGS_KEY, DEFAULT_TIMER_SETTINGS);
  const [sheet, setSheet] = useState(false);
  const modes = PICTURES.map((p) => ({ id: p.id, emoji: p.emoji, title: t(p.name) }));
  const minutes = TIMER_MINUTES.includes(settings.minutes as (typeof TIMER_MINUTES)[number]) ? settings.minutes : DEFAULT_TIMER_SETTINGS.minutes;
  const own = settings.own;
  const useOwn = settings.useOwn && own !== null;
  const ownLabel = (time: OwnTime) =>
    time.kind === "for"
      ? t(lengthWords(time.seconds))
      : t({
          de: `bis ${time.at}`,
          en: `until ${time.at}`,
          zh: `到 ${time.at}`,
          hi: `${time.at} बजे तक`,
          es: `hasta las ${time.at}`,
          ar: `حتى ${time.at}`,
          ru: `до ${time.at}`,
        });

  return (
    <GameShell
      title={t(TIMER_TITLE)}
      // A tool for the day like the Belohnungstafel: it counts no play time and still runs when play time is over.
      tool
      modes={modes}
      mode={settings.picture}
      onMode={(picture) => update({ picture: picture as TimerPicture })}
      level={
        // The grown-up sets the time here; the child sees no numbers, only the picture running down. Behind the
        // minutes, the time set last behind „Andere …“ stays as a slip of its own until another comes (H-59).
        <>
          <Choice
            label={t({ de: "Wie lange?", en: "How long?", zh: "多长时间？", hi: "कितनी देर?", es: "¿Cuánto tiempo?", ar: "كم من الوقت؟", ru: "Как долго?" })}
            value={useOwn ? OWN : String(minutes)}
            onChange={(value) => {
              if (value === OTHER) setSheet(true);
              else if (value === OWN) update({ useOwn: true });
              else update({ minutes: Number(value), useOwn: false });
            }}
            options={[
              ...TIMER_MINUTES.map((m) => ({
                value: String(m),
                label: t({
                  de: `${m} Min.`,
                  en: `${m} min`,
                  zh: `${m} 分钟`,
                  hi: `${m} मिनट`,
                  es: `${m} min`,
                  ar: `${m} ${m >= 3 && m <= 10 ? "دقائق" : "دقيقة"}`,
                  ru: `${m} мин`,
                }),
              })),
              ...(own ? [{ value: OWN, label: ownLabel(own) }] : []),
              { value: OTHER, label: t({ de: "Andere …", en: "Other …", zh: "其他……", hi: "अन्य …", es: "Otro …", ar: "غير ذلك …", ru: "Другое …" }) },
            ]}
          />
          {sheet && (
            <OwnTimeSheet
              start={own}
              onClose={() => setSheet(false)}
              onDone={(time) => {
                update({ own: time, useOwn: true });
                setSheet(false);
              }}
            />
          )}
        </>
      }
    >
      <TimerPlay settings={{ ...settings, minutes, useOwn }} onPicture={(picture) => update({ picture })} onToy={(toy) => update({ toy })} />
    </GameShell>
  );
}
