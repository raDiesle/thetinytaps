import { useMemo } from "react";
import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { TARGET_LANGUAGES, targetLanguageFor } from "@/content/targetLanguages";
import { useCommonSettings, useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { languageLabel, useAppLanguage, useT } from "@/lib/language";
import { AdventurePlay } from "./AdventurePlay";
import { ADVENTURE_SETTINGS_KEY, type AdventureStoryId, carryOverAdventureSettings, DEFAULT_ADVENTURE_SETTINGS } from "./settings";
import { CLOUD_TRIP } from "./stories/cloudTrip";
import { type Story, storyIn, storyTitle } from "./stories/story";
import { TREASURE_ISLAND } from "./stories/treasureIsland";

carryOverAdventureSettings();

/** The stories on the start screen, each a card. */
const STORIES: { id: AdventureStoryId; emoji: string; story: Story }[] = [
  { id: "schatzinsel", emoji: "🏝️", story: TREASURE_ISLAND },
  { id: "wolkenreise", emoji: "☁️", story: CLOUD_TRIP },
];

export function AdventureGame() {
  const [settings, update] = useGameSettings(ADVENTURE_SETTINGS_KEY, DEFAULT_ADVENTURE_SETTINGS);
  const [common] = useCommonSettings();
  const { touchOnly } = useDevice();
  const t = useT();
  const app = useAppLanguage();
  const chosen = (STORIES.find((s) => s.id === settings.story) ?? STORIES[0]).story;
  const wanted = settings.voiceLanguage === "app" ? app : targetLanguageFor(settings.voiceLanguage);
  // A story not translated yet is said in German, not German words with an English voice.
  const language = wanted.id === "de" || chosen.translations?.[wanted.id] ? wanted : targetLanguageFor("de");
  // Built once per story and language: the game starts anew when the story changes.
  const story = useMemo(() => storyIn(chosen, language.id), [chosen, language.id]);

  return (
    <GameShell
      title={t({ de: "Bewegungsabenteuer", ru: "Приключения в движении" })}
      emoji="🏝️"
      modes={STORIES.map((s) => ({ id: s.id, emoji: s.emoji, title: storyTitle(s.story, app.id) }))}
      mode={settings.story}
      onMode={(id) => update({ story: id as AdventureStoryId })}
      settings={
        <SettingsGroup title={t({ de: "Bewegungsabenteuer", ru: "Приключения в движении" })}>
          <p className="setting-note">
            {t({
              de: "Der kleine Fuchs Tapsi zeigt jede Bewegung vor, und das Kind macht sie vor dem Bildschirm mit. Die Welt reagiert von selbst im Takt der Bewegung – es gibt keine Kamera und kein „falsch“.",
              ru: "Маленький лисёнок Тапси показывает каждое движение, а ребёнок повторяет его перед экраном. Мир сам отвечает в такт движению – камеры нет, и «неправильно» не бывает.",
            })}
          </p>
          <p className="setting-note">
            {t({
              de: "🏝️ Die Schatzinsel: angeln, paddeln, über eine kleine Brücke hüpfen und mit dem Kopf an Sternkisten stoßen, sich unter einem schaukelnden Baumstamm ducken, trommeln, Kokosnüssen ausweichen, Spinnweben wegwedeln, die Truhe am Seil heranziehen und zum Schluss das Gold hochwerfen.",
              ru: "🏝️ Остров сокровищ: ловить рыбу, грести, прыгать по мостику и стукаться головой о звёздные ящики, пригибаться под качающимся бревном, барабанить, уворачиваться от кокосов, смахивать паутину, подтягивать сундук за верёвку, а в конце подбрасывать золото.",
            })}
          </p>
          <p className="setting-note">
            {t({
              de: "☁️ Die Wolkenreise: Tapsi fliegt auf der kleinen Wolke Wolle in den Himmel – flattern wie ein Vogel, sich unter Spielzeugflugzeugen ducken, Luftballons antippen, im Sitzen in die Kurven lehnen und Sterne holen, die Regenwolke hochdrücken, bis die Sonne lacht, und mit den Armen einen Regenbogen malen.",
              ru: "☁️ Полёт на облачке: Тапси летит в небо на маленьком облачке Пушинке – махать руками, как птичка, пригибаться под игрушечными самолётиками, трогать воздушные шарики, сидя наклоняться в повороты и собирать звёзды, толкать дождевую тучу вверх, пока не засмеётся солнышко, и рисовать руками радугу.",
            })}
          </p>
          <p className="setting-note">
            {t({
              de: "Am besten auf einem großen Bildschirm, mit etwas Platz um das Kind herum (Arme ausbreiten, ein Schritt zur Seite). Niemand muss tippen.",
              ru: "Лучше всего на большом экране и чтобы вокруг ребёнка было немного места (развести руки, шагнуть в сторону). Нажимать ничего не нужно.",
            })}
          </p>
          <Toggle
            label={t({
              de: "Am Fuchs leuchtet, worauf es bei der Bewegung ankommt (z. B. nur die Arme an der Kurbel)",
              ru: "У лисёнка светится то, что важно в движении (например, только руки, когда он крутит ручку)",
            })}
            checked={settings.glow}
            onChange={(glow) => update({ glow })}
          />
          <Toggle
            label={t({
              de: "Umriss-Hilfe: eine dunkle Figur mit leuchtendem Rand macht jede Bewegung groß mit",
              ru: "Подсказка-силуэт: тёмная фигура со светящимся контуром крупно повторяет каждое движение",
            })}
            checked={settings.outline}
            onChange={(outline) => update({ outline })}
          />
          <Choice
            label={t({ de: "Tapsi spricht", ru: "Тапси говорит" })}
            value={wanted.id}
            options={TARGET_LANGUAGES.map((l) => ({ value: l.id, label: languageLabel(l, app.id) }))}
            // Choosing the app's own language means "like the app", so Tapsi follows when the app language changes.
            onChange={(id) => update({ voiceLanguage: id === app.id ? "app" : id })}
          />
          {!settings.speech && (
            <p className="setting-note">
              {t({
                de: "Tapsi spricht nur, wenn „Vorlesen“ auf der Startseite an ist.",
                ru: "Тапси говорит, только если на главной странице включено «Читать вслух».",
              })}
            </p>
          )}
          {language !== wanted && (
            <p className="setting-note">
              {t({
                de: `„${storyTitle(chosen, "de")}“ gibt es noch nicht auf ${wanted.label.split(" ")[1]}, Tapsi spricht dort Deutsch.`,
                ru: `Для истории «${storyTitle(chosen, "ru")}» ещё нет перевода (${languageLabel(wanted, "ru")}), Тапси говорит по-немецки.`,
              })}
            </p>
          )}
          <Toggle label={t({ de: "Musik", ru: "Музыка" })} checked={settings.music} onChange={(music) => update({ music })} />
          {!common.music && (
            <p className="setting-note">
              {t({ de: "Die Musik ist für alle Spiele aus (⚙️ auf der Startseite).", ru: "Музыка выключена для всех игр (⚙️ на главной странице)." })}
            </p>
          )}
          {!touchOnly && (
            <p className="setting-note">
              {t({
                de: "Oben links: pausieren und zur vorigen oder nächsten Bewegung springen; ein Bild unten springt zu dieser Bewegung. Mit Tastatur: ",
                ru: "Слева вверху: пауза и переход к предыдущему или следующему движению; картинка внизу переходит к этому движению. С клавиатуры: ",
              })}
              <kbd>←</kbd> <kbd>→</kbd> {t({ de: "und die", ru: "и" })} <kbd>{t({ de: "Leertaste", ru: "Пробел" })}</kbd>.
            </p>
          )}
        </SettingsGroup>
      }
    >
      {/* Its own music, which plays only while music is on for all games too. */}
      <AdventurePlay story={story} language={language} settings={{ ...settings, music: settings.music && common.music }} />
    </GameShell>
  );
}
