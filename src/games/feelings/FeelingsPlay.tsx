import { useState } from "react";
import { useT } from "@/lib/language";
import { groupAfter, groupById } from "./groups";
import { PassPlay } from "./PassPlay";
import type { FeelingsSettings } from "./settings";
import { VoiceSwitch } from "./VoiceSwitch";

/**
 * „Alltagssituationen“: the picked group, scene after scene, going on where the child stopped last time; „Nochmal“
 * plays the group again (its scenes with their next choices), „Weiter“ brings the next group. In the top left corner
 * grown-ups switch the voice off to tell the story themselves (`VoiceSwitch`); in the picture's bottom left corner they
 * open its whole text to read out (`ReadAlong`).
 */
export function FeelingsPlay({ settings, update }: { settings: FeelingsSettings; update: (patch: Partial<FeelingsSettings>) => void }) {
  const t = useT();
  const [now, setNow] = useState(() => ({ group: groupById(settings.group), startAt: settings.scene, key: 0 }));
  const following = groupAfter(now.group);

  return (
    <>
      <PassPlay
        key={now.key}
        group={now.group}
        startAt={now.startAt}
        settings={settings}
        update={update}
        onAgain={() => setNow({ group: now.group, startAt: 0, key: now.key + 1 })}
        next={{ name: t(following.title), onNext: () => setNow({ group: following, startAt: 0, key: now.key + 1 }) }}
        readAlong={{ open: settings.text, onToggle: () => update({ text: !settings.text }) }}
      />
      <VoiceSwitch on={settings.voice} onToggle={() => update({ voice: !settings.voice })} />
    </>
  );
}
