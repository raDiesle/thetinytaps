import { GameShell } from "@/components/GameShell";
import { Choice } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { PICTURES, TIMER_TITLE } from "./content";
import { DEFAULT_TIMER_SETTINGS, TIMER_MINUTES, TIMER_SETTINGS_KEY, type TimerPicture } from "./settings";
import { TimerPlay } from "./TimerPlay";
import "./timer.css";

export function TimerGame() {
  const t = useT();
  const [settings, update] = useGameSettings(TIMER_SETTINGS_KEY, DEFAULT_TIMER_SETTINGS);
  const modes = PICTURES.map((p) => ({ id: p.id, emoji: p.emoji, title: t(p.name) }));
  const minutes = TIMER_MINUTES.includes(settings.minutes as (typeof TIMER_MINUTES)[number]) ? settings.minutes : DEFAULT_TIMER_SETTINGS.minutes;

  return (
    <GameShell
      title={t(TIMER_TITLE)}
      // A tool for the day like the Belohnungstafel: it counts no play time and still runs when play time is over.
      tool
      modes={modes}
      mode={settings.picture}
      onMode={(picture) => update({ picture: picture as TimerPicture })}
      level={
        // The grown-up sets the minutes here; the child sees no numbers, only the picture running down.
        <Choice
          label={t({ de: "Wie lange?" })}
          value={String(minutes)}
          onChange={(value) => update({ minutes: Number(value) })}
          options={TIMER_MINUTES.map((m) => ({ value: String(m), label: t({ de: `${m} Min.` }) }))}
        />
      }
    >
      <TimerPlay settings={{ ...settings, minutes }} onPicture={(picture) => update({ picture })} />
    </GameShell>
  );
}
