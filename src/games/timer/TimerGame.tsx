import { useState } from "react";
import { GameShell } from "@/components/GameShell";
import { Choice } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { TimerCardArt } from "./cardArt";
import { isTurns, PICTURES, SWAP_NOTE, TIMER_TITLE } from "./content";
import { TURNS_GROUP } from "./playersNames";
import { OwnTimeSheet } from "./OwnTimeSheet";
import { DEFAULT_TIMER_SETTINGS, TIMER_SECONDS, TIMER_SETTINGS_KEY, type TimerPicture } from "./settings";
import { lengthWords, type OwnTime } from "./time";
import { TimerPlay } from "./TimerPlay";
import "./timer.css";

/** The row's value for the own time's slip and for „Andere …“, which opens the sheet instead of being chosen. */
const OWN = "own";
const OTHER = "other";

/**
 * The length chosen on this visit. It is never stored: every visit starts at 5 minutes (`DEFAULT_TIMER_SETTINGS`, user
 * request, November 2026 – a stored length greeted the next visit with whatever was picked last), while within a visit
 * the row keeps what was picked, also after a run and back. The own time behind „Andere …“ stays stored as its slip.
 */
let visitLength = { seconds: DEFAULT_TIMER_SETTINGS.seconds, useOwn: DEFAULT_TIMER_SETTINGS.useOwn };

export function TimerGame() {
  const t = useT();
  const [settings, update] = useGameSettings(TIMER_SETTINGS_KEY, DEFAULT_TIMER_SETTINGS);
  const [sheet, setSheet] = useState(false);
  const [length, setLength] = useState(visitLength);
  const choose = (next: typeof visitLength) => {
    visitLength = next;
    setLength(next);
  };
  // Each card is its picture as it looks at the end, with no words on it (user request, November 2026); its name, and
  // for „Abwechseln“ the line saying it goes on and on, are only read out and its tooltip. „Abwechseln“ is a category
  // of its own, named on its frame after all the pictures, which share a frame with no name (user request, November 2026).
  const modes = PICTURES.map((p) => ({
    id: p.id,
    emoji: p.emoji,
    title: t(p.name),
    note: isTurns(p.id) ? t(SWAP_NOTE) : undefined,
    kind: isTurns(p.id) ? t(TURNS_GROUP) : undefined,
    art: <TimerCardArt picture={p.id} kids={settings.kids} players={settings.players} />,
  }));
  // A picture kept from before may since have been taken out („Eimer“, „Kuchen“): then the first one is marked.
  const picture = PICTURES.some((p) => p.id === settings.picture) ? settings.picture : DEFAULT_TIMER_SETTINGS.picture;
  const seconds = TIMER_SECONDS.includes(length.seconds as (typeof TIMER_SECONDS)[number]) ? length.seconds : DEFAULT_TIMER_SETTINGS.seconds;
  const own = settings.own;
  const useOwn = length.useOwn && own !== null;
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
      levelInHead
      level={
        // The grown-up sets the time here; the child sees no numbers, only the picture running down. Behind the
        // lengths, the time set last behind „Andere …“ stays as a slip of its own until another comes (H-59).
        <>
          <div className="tm-lengths">
            <Choice
              label={t({ de: "Wie lange?", en: "How long?", zh: "多长时间？", hi: "कितनी देर?", es: "¿Cuánto tiempo?", ar: "كم من الوقت؟", ru: "Как долго?" })}
              value={useOwn ? OWN : String(seconds)}
              onChange={(value) => {
                if (value === OTHER) setSheet(true);
                else if (value === OWN) choose({ seconds, useOwn: true });
                else choose({ seconds: Number(value), useOwn: false });
              }}
              options={[
                ...TIMER_SECONDS.map((s) => ({ value: String(s), label: t(lengthWords(s)) })),
                ...(own ? [{ value: OWN, label: ownLabel(own) }] : []),
                { value: OTHER, label: t({ de: "Andere …", en: "Other …", zh: "其他……", hi: "अन्य …", es: "Otro …", ar: "غير ذلك …", ru: "Другое …" }) },
              ]}
            />
          </div>
          {sheet && (
            <OwnTimeSheet
              start={own}
              onClose={() => setSheet(false)}
              onDone={(time) => {
                update({ own: time });
                choose({ seconds, useOwn: true });
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
        onKids={(kids) => update({ kids })}
        onPlayers={(players) => update({ players })}
        onShown={(timeNote) => update({ timeNote })}
        onBar={(bar) => update({ bar })}
      />
    </GameShell>
  );
}
