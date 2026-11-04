import { useState } from "react";
import { useT } from "@/lib/language";
import { DayPlay } from "./DayPlay";
import { dayAfter, dayById, dayTitle } from "./days";
import { groupAfter, groupById } from "./groups";
import { PassPlay, type ReadAlongCorner } from "./PassPlay";
import type { FeelingsSettings } from "./settings";
import { VoiceSwitch } from "./VoiceSwitch";

/**
 * „Alltagssituationen“: the picked day (`byDay`) or feeling, going on where the child stopped last time; „Nochmal“
 * plays it again (its scenes with their next choices), „Weiter“ brings the next day or feeling. In the bottom right
 * corner grown-ups switch the voice off to tell the story themselves (`VoiceSwitch`) and open its whole text to read
 * out (`ReadAlong`), which switching the voice off opens by itself.
 */
export function FeelingsPlay({
  settings,
  update,
  byDay,
}: {
  settings: FeelingsSettings;
  update: (patch: Partial<FeelingsSettings>) => void;
  /** Plays the days of the little bear (`days.ts`) instead of the feelings (`groups.ts`). */
  byDay: boolean;
}) {
  const readAlong: ReadAlongCorner = {
    open: settings.text,
    onToggle: () => update({ text: !settings.text }),
    // Switched off, the grown-up tells the scene: its whole text opens at once, to be read out.
    voiceSwitch: <VoiceSwitch on={settings.voice} onToggle={() => update(settings.voice ? { voice: false, text: true } : { voice: true })} />,
  };
  const props = { settings, update, readAlong };
  return byDay ? <Days {...props} /> : <Groups {...props} />;
}

type PlayProps = { settings: FeelingsSettings; update: (patch: Partial<FeelingsSettings>) => void; readAlong: ReadAlongCorner };

/** One day after the other, from the day played last. */
function Days({ settings, update, readAlong }: PlayProps) {
  const t = useT();
  const [now, setNow] = useState(() => ({ day: dayById(settings.day), startAt: settings.dayScene, key: 0 }));
  const following = dayAfter(now.day);

  return (
    <DayPlay
      key={now.key}
      day={now.day}
      startAt={now.startAt}
      settings={settings}
      update={update}
      onAgain={() => setNow({ day: now.day, startAt: 0, key: now.key + 1 })}
      next={{ name: t(dayTitle(following)), onNext: () => setNow({ day: following, startAt: 0, key: now.key + 1 }) }}
      readAlong={readAlong}
    />
  );
}

/** One feeling after the other, from the one played last. */
function Groups({ settings, update, readAlong }: PlayProps) {
  const t = useT();
  const [now, setNow] = useState(() => ({ group: groupById(settings.group), startAt: settings.scene, key: 0 }));
  const following = groupAfter(now.group);

  return (
    <PassPlay
      key={now.key}
      group={now.group}
      startAt={now.startAt}
      settings={settings}
      update={update}
      onAgain={() => setNow({ group: now.group, startAt: 0, key: now.key + 1 })}
      next={{ name: t(following.title), onNext: () => setNow({ group: following, startAt: 0, key: now.key + 1 }) }}
      readAlong={readAlong}
    />
  );
}
