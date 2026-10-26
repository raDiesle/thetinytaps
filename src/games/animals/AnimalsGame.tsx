import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { type Localized, useT } from "@/lib/language";
import { PeekPlay } from "@/games/shadows/PeekPlay";
import "@/games/shadows/shadows.css";
import { AnimalsPlay } from "./AnimalsPlay";
import { ANIMALS_SETTINGS_KEY, DEFAULT_ANIMALS_SETTINGS, type AnimalsMode, type ChoiceCount } from "./settings";
import "./animals.css";

/** The game's name, on its start screen and in the browser tab. */
export const ANIMALS_TITLE: Localized = { de: "Was gehört zum Tier?", ru: "Что нужно зверюшке?" };

export function AnimalsGame() {
  const t = useT();
  const [settings, update] = useGameSettings(ANIMALS_SETTINGS_KEY, DEFAULT_ANIMALS_SETTINGS);

  return (
    <GameShell
      title={t(ANIMALS_TITLE)}
      emoji="🐰"
      modes={[
        { id: "feed", emoji: "🥕", title: t({ de: "Tiere füttern", ru: "Покорми зверюшку" }) },
        { id: "home", emoji: "🏠", title: t({ de: "Wer wohnt wo?", ru: "Кто где живёт?" }) },
        { id: "peek", emoji: "🙈", title: t({ de: "Wer schaut da raus?", ru: "Кто там выглядывает?" }) },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as AnimalsMode })}
      level={
        <>
          <Choice<ChoiceCount>
            label={t({ de: "Zur Auswahl", ru: "На выбор" })}
            value={settings.choices}
            onChange={(choices) => update({ choices })}
            options={[
              { value: "2", label: t({ de: "2 Dinge", ru: "2 предмета" }) },
              { value: "3", label: t({ de: "3 Dinge", ru: "3 предмета" }) },
              { value: "4", label: t({ de: "4 Dinge", ru: "4 предмета" }) },
            ]}
          />
          <Toggle
            label={t({ de: "Abwechselnd füttern und Zuhause finden", ru: "По очереди: кормить и искать домик" })}
            checked={settings.mix}
            onChange={(mix) => update({ mix })}
          />
        </>
      }
      info={
        <>
          <p>
            {t({
              de: "Tiere füttern: Ein Tier hat Hunger, und das Kind zieht das passende Futter zu ihm – die Möhre zum Hasen, den Knochen zum Hund.",
              ru: "Покорми зверюшку: зверюшка проголодалась, и ребёнок тянет к ней подходящую еду – морковку к зайке, косточку к собачке.",
            })}
          </p>
          <p>
            {t({
              de: "Wer wohnt wo? Das Kind bringt das Tier in sein Zuhause: den Vogel ins Nest, die Kuh in den Stall.",
              ru: "Кто где живёт? Ребёнок относит зверюшку в её домик: птичку в гнездо, корову в хлев.",
            })}
          </p>
          <p>
            {t({
              de: "Wer schaut da raus? Nur ein Stück von einem Tier schaut aus dem Busch oder dem Teich. Das Kind tippt unten auf das ganze Tier, und es kommt heraus.",
              ru: "Кто там выглядывает? Из куста или пруда видна только часть зверюшки. Ребёнок нажимает внизу на всю зверюшку, и она выходит.",
            })}
          </p>
        </>
      }
      settings={
        <>
          <SettingsGroup title={t({ de: "Anzeige", ru: "Отображение" })}>
            <Toggle
              label={t({ de: "Namen zeigen (Hase, Möhre …)", ru: "Показывать названия (зайка, морковка …)" })}
              checked={settings.names}
              onChange={(names) => update({ names })}
            />
          </SettingsGroup>

          <SettingsGroup title={t({ de: "Verhalten", ru: "Поведение" })}>
            <Toggle
              label={t({
                de: "Antippen reicht (sonst muss man ziehen; bei „Wer schaut da raus?“ wird immer getippt)",
                ru: "Достаточно нажать (иначе нужно перетащить; в «Кто там выглядывает?» всегда просто нажимают)",
              })}
              checked={settings.tap}
              onChange={(tap) => update({ tap })}
            />
          </SettingsGroup>
        </>
      }
    >
      {settings.mode === "peek" ? <PeekPlay settings={settings} /> : <AnimalsPlay settings={settings} />}
    </GameShell>
  );
}
