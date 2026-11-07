import { useState } from "react";
import { GameShell } from "@/components/GameShell";
import { Choice } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { PICTURES, SWAP_NOTE, TIMER_TITLE } from "./content";
import { OwnTimeSheet } from "./OwnTimeSheet";
import { DEFAULT_TIMER_SETTINGS, TIMER_SECONDS, TIMER_SETTINGS_KEY, type TimerPicture } from "./settings";
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
  // „Abwechseln“ stands on its own above the others, with a line saying it goes on and on; the others run until the time is up.
  const modes = PICTURES.map((p) => ({ id: p.id, emoji: p.emoji, title: t(p.name), note: p.id === "swap" ? t(SWAP_NOTE) : undefined }));
  // A picture kept from before may since have been taken out („Eimer“, „Kuchen“): then the first one is marked.
  const picture = PICTURES.some((p) => p.id === settings.picture) ? settings.picture : DEFAULT_TIMER_SETTINGS.picture;
  const seconds = TIMER_SECONDS.includes(settings.seconds as (typeof TIMER_SECONDS)[number]) ? settings.seconds : DEFAULT_TIMER_SETTINGS.seconds;
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
      mode={picture}
      onMode={(picture) => update({ picture: picture as TimerPicture })}
      level={
        // The grown-up sets the time here; the child sees no numbers, only the picture running down. Behind the
        // lengths, the time set last behind „Andere …“ stays as a slip of its own until another comes (H-59).
        <>
          <Choice
            label={t({ de: "Wie lange?", en: "How long?", zh: "多长时间？", hi: "कितनी देर?", es: "¿Cuánto tiempo?", ar: "كم من الوقت؟", ru: "Как долго?" })}
            value={useOwn ? OWN : String(seconds)}
            onChange={(value) => {
              if (value === OTHER) setSheet(true);
              else if (value === OWN) update({ useOwn: true });
              else update({ seconds: Number(value), useOwn: false });
            }}
            options={[
              ...TIMER_SECONDS.map((s) => ({ value: String(s), label: t(lengthWords(s)) })),
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
      <TimerPlay
        settings={{ ...settings, picture, seconds, useOwn }}
        onPicture={(picture) => update({ picture })}
        onToy={(toy) => update({ toy })}
        onShown={(shown) => update({ shown })}
      />
    </GameShell>
  );
}
