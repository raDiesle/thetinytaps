import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { type Localized, useT } from "@/lib/language";
import { ShadowsPlay } from "./ShadowsPlay";
import { DEFAULT_SHADOWS_SETTINGS, SHADOWS_SETTINGS_KEY, type ChoiceCount, type ShadowTheme } from "./settings";
import "./shadows.css";

/** The game's name, on its start screen and in the browser tab. */
export const SHADOWS_TITLE: Localized = { de: "Schatten finden", ru: "Найди тень" };

export function ShadowsGame() {
  const t = useT();
  const [settings, update] = useGameSettings(SHADOWS_SETTINGS_KEY, DEFAULT_SHADOWS_SETTINGS);
  const device = useDevice();

  return (
    <GameShell
      title={t(SHADOWS_TITLE)}
      emoji="👤"
      modes={[
        { id: "all", emoji: "🔀", title: t({ de: "Gemischt", ru: "Вперемешку" }) },
        { id: "animals", emoji: "🐘", title: t({ de: "Tiere", ru: "Животные" }) },
        { id: "vehicles", emoji: "🚗", title: t({ de: "Fahrzeuge", ru: "Транспорт" }) },
        { id: "food", emoji: "🍌", title: t({ de: "Essen", ru: "Еда" }) },
        { id: "things", emoji: "☂️", title: t({ de: "Dinge", ru: "Вещи" }) },
      ]}
      mode={settings.theme}
      onMode={(theme) => update({ theme: theme as ShadowTheme })}
      level={
        <Choice<ChoiceCount>
          label={t({ de: "Zur Auswahl", ru: "На выбор" })}
          value={settings.choices}
          onChange={(choices) => update({ choices })}
          options={[
            { value: "2", label: t({ de: "2 Bilder", ru: "2 картинки" }) },
            { value: "3", label: t({ de: "3 Bilder", ru: "3 картинки" }) },
            { value: "4", label: t({ de: "4 Bilder", ru: "4 картинки" }) },
          ]}
        />
      }
      settings={
        <>
          <SettingsGroup title={t({ de: "Anzeige", ru: "Отображение" })}>
            <Toggle
              label={t({ de: "Namen zeigen (Elefant, Auto …)", ru: "Показывать названия (слон, машина …)" })}
              checked={settings.names}
              onChange={(names) => update({ names })}
            />
          </SettingsGroup>

          <SettingsGroup title={t({ de: "Verhalten", ru: "Поведение" })}>
            <Toggle
              label={t({ de: "Schatten antippen reicht (sonst muss man das Bild ziehen)", ru: "Достаточно нажать на тень (иначе нужно перетащить картинку)" })}
              checked={settings.tap}
              onChange={(tap) => update({ tap })}
            />
            {!device.touchOnly && (
              <p className="setting-note">
                {t({
                  de: "Mit der Tastatur: Pfeiltasten wählen ein Bild, Leertaste oder Enter nimmt es, 1–4 direkt.",
                  ru: "С клавиатуры: стрелки выбирают картинку, пробел или Enter берёт её, 1–4 сразу.",
                })}
              </p>
            )}
          </SettingsGroup>
        </>
      }
    >
      <ShadowsPlay settings={settings} />
    </GameShell>
  );
}
