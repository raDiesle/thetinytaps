import { useMemo } from "react";
import { GameShell } from "@/components/GameShell";
import { type TargetLanguageId, targetLanguageFor } from "@/content/targetLanguages";
import { useCommonSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { useAppLanguage, useT } from "@/lib/language";
import { useStoredSettings } from "@/lib/storage";
import { AdventurePlay } from "./AdventurePlay";
import { ADVENTURE_SETTINGS_KEY, type AdventureStoryId, DEFAULT_ADVENTURE_SETTINGS } from "./settings";
import { CLOUD_TRIP } from "./stories/cloudTrip";
import { type Story, storyIn, storyTitle } from "./stories/story";
import { TREASURE_ISLAND } from "./stories/treasureIsland";

/** The stories on the start screen, each a card. */
const STORIES: { id: AdventureStoryId; emoji: string; story: Story }[] = [
  { id: "schatzinsel", emoji: "🏝️", story: TREASURE_ISLAND },
  { id: "wolkenreise", emoji: "☁️", story: CLOUD_TRIP },
];

/** The start screen: no options of its own, read aloud, sounds, music and Tapsi's language come from the home page. */
export function AdventureGame() {
  const [settings, update] = useStoredSettings(ADVENTURE_SETTINGS_KEY, DEFAULT_ADVENTURE_SETTINGS);
  const [common] = useCommonSettings();
  const { touchOnly } = useDevice();
  const t = useT();
  const app = useAppLanguage();
  const at = Math.max(
    0,
    STORIES.findIndex((s) => s.id === settings.story),
  );
  const chosen = STORIES[at].story;
  // „Weiter“ at the end: the next story on the start screen, after the last the first.
  const next = STORIES[(at + 1) % STORIES.length];
  // The app language, like every game. A story not told in it yet is said in English,
  // or else German – never German words with a Russian voice.
  const told = (id: string) => id === "de" || Boolean(chosen.translations?.[id as TargetLanguageId]);
  const language = targetLanguageFor(told(app.id) ? app.id : told("en") ? "en" : "de");
  // Built once per story and language: the game starts anew when the story changes.
  const story = useMemo(() => storyIn(chosen, language.id), [chosen, language.id]);

  return (
    <GameShell
      title={t({ de: "Bewegungsabenteuer", ru: "Приключения в движении" })}
      emoji="🏝️"
      modes={STORIES.map((s) => ({ id: s.id, emoji: s.emoji, title: storyTitle(s.story, app.id) }))}
      mode={settings.story}
      onMode={(id) => update({ story: id as AdventureStoryId })}
      info={
        <>
          <p>
            {t({
              de: "Der kleine Fuchs Tapsi zeigt jede Bewegung vor, und das Kind macht sie vor dem Bildschirm mit. Die Welt reagiert von selbst im Takt der Bewegung – es gibt keine Kamera und kein „falsch“.",
              ru: "Маленький лисёнок Тапси показывает каждое движение, а ребёнок повторяет его перед экраном. Мир сам отвечает в такт движению – камеры нет, и «неправильно» не бывает.",
            })}
          </p>
          <p>
            {t({
              de: "🏝️ Die Schatzinsel: angeln, paddeln, über eine kleine Brücke hüpfen und mit dem Kopf an Sternkisten stoßen, sich unter einem schaukelnden Baumstamm ducken, trommeln, Kokosnüssen ausweichen, Spinnweben wegwedeln, die Truhe am Seil heranziehen und zum Schluss das Gold hochwerfen.",
              ru: "🏝️ Остров сокровищ: ловить рыбу, грести, прыгать по мостику и стукаться головой о звёздные ящики, пригибаться под качающимся бревном, барабанить, уворачиваться от кокосов, смахивать паутину, подтягивать сундук за верёвку, а в конце подбрасывать золото.",
            })}
          </p>
          <p>
            {t({
              de: "☁️ Die Wolkenreise: Tapsi fliegt auf der kleinen Wolke Wolle in den Himmel – flattern wie ein Vogel, sich unter Spielzeugflugzeugen ducken, Luftballons antippen, im Sitzen in die Kurven lehnen und Sterne holen, die Regenwolke hochdrücken, bis die Sonne lacht, und mit den Armen einen Regenbogen malen.",
              ru: "☁️ Полёт на облачке: Тапси летит в небо на маленьком облачке Пушинке – махать руками, как птичка, пригибаться под игрушечными самолётиками, трогать воздушные шарики, сидя наклоняться в повороты и собирать звёзды, толкать дождевую тучу вверх, пока не засмеётся солнышко, и рисовать руками радугу.",
            })}
          </p>
          <p>
            {t({
              de: "Am Fuchs leuchtet, worauf es bei der Bewegung ankommt (z. B. nur die Arme an der Kurbel), und eine dunkle Figur mit leuchtendem Rand macht jede Bewegung groß mit.",
              ru: "У лисёнка светится то, что важно в движении (например, только руки, когда он крутит ручку), а тёмная фигура со светящимся контуром крупно повторяет каждое движение.",
            })}
          </p>
          <p>
            {t({
              de: "Am besten auf einem großen Bildschirm, mit etwas Platz um das Kind herum (Arme ausbreiten, ein Schritt zur Seite). Niemand muss tippen.",
              ru: "Лучше всего на большом экране и чтобы вокруг ребёнка было немного места (развести руки, шагнуть в сторону). Нажимать ничего не нужно.",
            })}
          </p>
          <p>
            {t({
              de: "Ob Tapsi spricht, Töne und Musik stellt ⚙️ auf der Startseite für alle Spiele ein, die Sprache 🌐.",
              ru: "Говорит ли Тапси, звуки и музыку настраивает ⚙️ на главной странице для всех игр, язык – 🌐.",
            })}
            {language.id !== app.id &&
              t({
                de: ` „${storyTitle(chosen, "de")}“ gibt es noch nicht auf ${app.label.split(" ")[1]}, Tapsi spricht dort ${language.label.split(" ")[1]}.`,
                // The language only by its flag, so its Russian name needs no declining.
                ru: ` Для истории «${storyTitle(chosen, "ru")}» ещё нет перевода на этот язык (${app.label.split(" ")[0]}), Тапси говорит ${language.id === "en" ? "по-английски" : "по-немецки"}.`,
              })}
          </p>
          {!touchOnly && (
            <p>
              {t({
                de: "Oben links: pausieren und zur vorigen oder nächsten Bewegung springen; ein Bild unten springt zu dieser Bewegung. Mit Tastatur: ",
                ru: "Слева вверху: пауза и переход к предыдущему или следующему движению; картинка внизу переходит к этому движению. С клавиатуры: ",
              })}
              <kbd>←</kbd> <kbd>→</kbd> {t({ de: "und die", ru: "и" })} <kbd>{t({ de: "Leertaste", ru: "Пробел" })}</kbd>.
            </p>
          )}
        </>
      }
    >
      {/* Its own music, which plays while music is on for all games. */}
      <AdventurePlay
        key={story.sequence.title}
        story={story}
        language={language}
        settings={common}
        next={{ emoji: next.emoji, name: storyTitle(next.story, app.id), onNext: () => update({ story: next.id }) }}
      />
    </GameShell>
  );
}
