import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useDevice, type Device } from "@/lib/device";
import { useAppLanguage, useT } from "@/lib/language";
import { findScene } from ".";
import { localizeScene } from "./localize";
import { ScenePlay } from "./ScenePlay";
import { carryOverScenesSettings, DEFAULT_SCENES_SETTINGS, SCENES_SETTINGS_KEY, type SceneAnnounce, type SceneMode, type SceneTrigger } from "./settings";

carryOverScenesSettings();

export function ScenesGame({ sceneId }: { sceneId: string }) {
  const [stored, update] = useGameSettings(SCENES_SETTINGS_KEY, DEFAULT_SCENES_SETTINGS);
  const device = useDevice();
  const language = useAppLanguage();
  const t = useT();
  // Tablets and phones have no keys, and the finger is right on the picture anyway.
  const settings = device.touchOnly && stored.trigger === "keys" ? { ...stored, trigger: "tap" as const } : stored;
  const found = findScene(sceneId);
  if (!found) return null;
  const scene = localizeScene(found, language.id);

  return (
    <GameShell
      title={scene.title}
      emoji={scene.emoji}
      backHref="/bilder/"
      backLabel={t({ de: "Alle Bilder", ru: "Все картинки" })}
      modes={[
        { id: "colour", emoji: "🖍️", title: t({ de: "Ausmalen", ru: "Раскраска" }) },
        { id: "find", emoji: "🔍", title: t({ de: "Suchen", ru: "Поиск" }) },
        { id: "questions", emoji: "❓", title: t({ de: "Fragen", ru: "Вопросы" }) },
        { id: "explore", emoji: "👆", title: t({ de: "Freies Entdecken", ru: "Свободная игра" }) },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as SceneMode })}
      info={
        <>
          <p>
            {t({
              de: "Ein Wimmelbild, in dem alles auf Antippen antwortet: Der Bagger baggert, die Kuh muht.",
              ru: "Большая картинка, где всё отвечает на касание: экскаватор копает, корова мычит.",
            })}
          </p>
          <p>
            {t({
              de: "Ausmalen: Das Bild ist grau, und jedes angetippte Ding bekommt seine Farbe zurück; jeder Tipp malt auch einen Farbklecks in den Hintergrund.",
              ru: "Раскраска: картинка серая, и каждая вещь, которой коснулся ребёнок, снова становится цветной; каждое касание ещё оставляет цветную кляксу на фоне.",
            })}
          </p>
          <p>
            {t({
              de: "Suchen: Ein Ding erscheint groß in der Blase, und das Kind sucht es im Bild. Fragen: „Was ist rot?“, „Wer kann fliegen?“ – das Kind tippt, was passt.",
              ru: "Поиск: в пузыре появляется большая вещь, и ребёнок ищет её на картинке. Вопросы: «Что красное?», «Кто умеет летать?» – ребёнок нажимает на то, что подходит.",
            })}
          </p>
          <p>
            {t({
              de: "Freies Entdecken: Alles darf angetippt werden, manches stößt etwas anderes an, und Fahrzeuge fahren am Rand in andere Bilder weiter.",
              ru: "Свободная игра: можно нажимать на всё, одно иногда приводит в движение другое, а машины уезжают за край в другие картинки.",
            })}
          </p>
        </>
      }
      settings={
        <>
          <SettingsGroup title={t({ de: "Spiel", ru: "Игра" })}>
            <Choice<SceneTrigger>
              label={t({ de: "Auslösen", ru: "Как оживает картинка" })}
              value={settings.trigger}
              onChange={(trigger) => update({ trigger })}
              options={triggerOptions(device, t)}
            />
            {settings.trigger === "keys" && (
              <Toggle
                label={t({ de: "Tasten im Bild zeigen", ru: "Показывать клавиши на картинке" })}
                checked={settings.showKeys}
                onChange={(showKeys) => update({ showKeys })}
              />
            )}
            <Toggle
              label={t({
                de: "Entdecken und Ausmalen: Mitzählen – wenn alles entdeckt ist, gibt es eine Party",
                ru: "Свободная игра и раскраска: считать – когда всё найдено, будет праздник",
              })}
              checked={settings.goal}
              onChange={(goal) => update({ goal })}
            />
            <Toggle
              label={t({
                de: "Entdecken: Fahrzeuge fahren in andere Bilder – am Rand antippen und mitfahren",
                ru: "Свободная игра: машины уезжают в другие картинки – нажать на знак у края и поехать следом",
              })}
              checked={settings.roads}
              onChange={(roads) => update({ roads })}
            />
            <Toggle
              label={t({ de: "Fragen: Tipp zeigen, wenn es länger dauert", ru: "Вопросы: показать подсказку, если ребёнок долго ищет" })}
              checked={settings.hints}
              onChange={(hints) => update({ hints })}
            />
            {settings.speech && (
              <Choice<SceneAnnounce>
                label={t({ de: "Ansage beim Entdecken", ru: "Что говорить при нажатии" })}
                value={settings.announce}
                onChange={(announce) => update({ announce })}
                options={[
                  { value: "sentence", label: t({ de: "„Der Bagger baggert!“", ru: "«Экскаватор копает!»" }) },
                  { value: "name", label: t({ de: "„Der Bagger!“", ru: "«Экскаватор!»" }) },
                ]}
              />
            )}
          </SettingsGroup>

          <SettingsGroup title={t({ de: "Bild", ru: "Картинка" })}>
            <Toggle
              label={t({
                de: "Bild bewegt sich auch von allein, ohne Ton (Wolken, Rotor, Blinklichter …)",
                ru: "Картинка двигается и сама, без звука (облака, винт, мигалки …)",
              })}
              checked={settings.ambient}
              onChange={(ambient) => update({ ambient })}
            />
          </SettingsGroup>
        </>
      }
    >
      {/* A new picture (a vehicle was followed into it) starts afresh. */}
      <ScenePlay key={scene.id} scene={scene} settings={settings} />
    </GameShell>
  );
}

/** The ways to bring the picture to life, worded for this device and in the app language (`t`); the keys only where there is a keyboard. */
function triggerOptions(device: Device, t: ReturnType<typeof useT>): { value: SceneTrigger; label: string }[] {
  if (device.touchOnly) {
    return [
      { value: "tap", label: t({ de: "👆 Antippen", ru: "👆 Нажимать" }) },
      { value: "hover", label: t({ de: "👆 Wischen (Finger übers Bild ziehen)", ru: "👆 Проводить пальцем по картинке" }) },
    ];
  }
  // With a mouse, keys are often easier for the youngest than aiming and clicking.
  const keys = {
    value: "keys" as const,
    label: t({ de: "⌨️ Jedes Ding hat eine Taste, oder Pfeile + Leertaste", ru: "⌨️ У каждой вещи своя клавиша, или стрелки + пробел" }),
  };
  if (!device.hasTouch) {
    return [
      { value: "tap", label: t({ de: "🖱️ Klicken", ru: "🖱️ Щёлкать мышкой" }) },
      { value: "hover", label: t({ de: "🖱️ Mit der Maus darüberfahren", ru: "🖱️ Наводить мышку" }) },
      keys,
    ];
  }
  return [
    { value: "tap", label: t({ de: "👆 Antippen / Klicken", ru: "👆 Нажимать / щёлкать" }) },
    { value: "hover", label: t({ de: "🖱️ Darüberfahren / Wischen", ru: "🖱️ Наводить мышку / проводить пальцем" }) },
    keys,
  ];
}
