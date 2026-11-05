import { GameShell, type GameMode } from "@/components/GameShell";
import { Choice } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { dayById, dayTitle, playableDays } from "./days";
import { FeelingsPlay } from "./FeelingsPlay";
import { groupById, playableGroups } from "./groups";
import { ALLTAG_TITLE } from "./names";
import { DEFAULT_FEELINGS_SETTINGS, FEELINGS_SETTINGS_KEY, type FeelingsOrder } from "./settings";
import "./feelings.css";

/**
 * „Alltagssituationen“: by default one card per day of the little bear („Tag 1“, „Tag 2“ …, `DAYS`), its scenes of
 * feelings told as one story from morning to night (user idea, November 2026); the row above the cards switches to one
 * card per feeling (`GROUPS`), without the days' pages of the story. The cards stand in their fixed order; the one
 * played last keeps its place, marked „zuletzt“, and goes on with the scene where the child stopped. Where the built
 * site has no day whose pictures are all made yet, it shows the feelings and no row.
 */
export function FeelingsGame() {
  const [settings, update] = useGameSettings(FEELINGS_SETTINGS_KEY, DEFAULT_FEELINGS_SETTINGS);
  const t = useT();
  const days = playableDays();
  const byDay = settings.order === "tage" && days.length > 0;
  const modes: GameMode[] = byDay
    ? days.map((day) => ({ id: day.id, emoji: day.emoji, title: t(dayTitle(day)) }))
    : playableGroups().map(({ id, emoji, title }) => ({ id, emoji, title: t(title) }));

  return (
    <GameShell
      title={t(ALLTAG_TITLE)}
      modes={modes}
      mode={byDay ? dayById(settings.day).id : groupById(settings.group).id}
      // Another day or feeling starts with its first scene; the one played last goes on where it stopped.
      onMode={(id) =>
        byDay
          ? update({ day: id, dayScene: id === settings.day ? settings.dayScene : 0 })
          : update({ group: id, scene: id === settings.group ? settings.scene : 0 })
      }
      level={
        days.length > 0 && (
          <Choice<FeelingsOrder>
            label={t({ de: "Geschichten", en: "Stories", zh: "故事", hi: "कहानियाँ", es: "Historias", ar: "القصص", ru: "Истории" })}
            value={byDay ? "tage" : "gefuehle"}
            onChange={(order) => update({ order })}
            options={[
              { value: "tage", label: t({ de: "📅 Tage", en: "📅 Days", zh: "📅 按天", hi: "📅 दिन", es: "📅 Días", ar: "📅 الأيام", ru: "📅 По дням" }) },
              {
                value: "gefuehle",
                label: t({
                  de: "😊 Nach Gefühlen",
                  en: "😊 By feeling",
                  zh: "😊 按心情",
                  hi: "😊 भावनाओं के हिसाब से",
                  es: "😊 Por emoción",
                  ar: "😊 حسب الشعور",
                  ru: "😊 По чувствам",
                }),
              },
            ]}
          />
        )
      }
    >
      <FeelingsPlay settings={settings} update={update} byDay={byDay} />
    </GameShell>
  );
}
