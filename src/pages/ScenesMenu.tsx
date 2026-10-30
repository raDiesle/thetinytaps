import { GameCard } from "@/components/GameCard";
import { MenuHead } from "@/components/MenuTop";
import { Choice } from "@/components/SettingControls";
import { Sky } from "@/components/Sky";
import { categoryHref, categoryOf } from "@/content/games";
import { SCENES, UPCOMING_SCENES } from "@/games/scenes";
import { localizeScene } from "@/games/scenes/localize";
import { carryOverScenesSettings, DEFAULT_SCENES_SETTINGS, SCENES_SETTINGS_KEY, type SceneMode } from "@/games/scenes/settings";
import { useGameSettings } from "@/lib/common";
import { useFitGrid } from "@/lib/fitGrid";
import { useAppLanguage, useT } from "@/lib/language";
import { useUpdateBetweenGames } from "@/lib/pwa";
import { useTitle } from "@/lib/title";

const CATEGORY = categoryOf("/bilder/");

carryOverScenesSettings();

export function ScenesMenu() {
  const language = useAppLanguage();
  const t = useT();
  const title = t({
    de: "Lebendige Bilder",
    ru: "Живые картинки",
    en: "Living Pictures",
    zh: "会动的图画",
    hi: "जीवित तस्वीरें",
    es: "Dibujos vivos",
    ar: "صور حية",
  });
  useTitle(title);
  useUpdateBetweenGames();
  const [settings, update] = useGameSettings(SCENES_SETTINGS_KEY, DEFAULT_SCENES_SETTINGS);
  const grid = useFitGrid(SCENES.length + UPCOMING_SCENES.length);
  return (
    <main className="home">
      <Sky />
      <MenuHead
        to={CATEGORY ? categoryHref(CATEGORY) : "/"}
        back={
          CATEGORY
            ? t(CATEGORY.title)
            : t({ de: "Alle Spiele", ru: "Все игры", en: "All games", zh: "所有游戏", hi: "सारे खेल", es: "Todos los juegos", ar: "كل الألعاب" })
        }
        title={
          <>
            <span aria-hidden>🖼️</span> {title}
          </>
        }
      >
        {/* How the picture is played, always in sight above the pictures (on a phone in the top row, so they all still
            fit): a tap on a picture plays it so at once. */}
        <div className="mode-level">
          <Choice<SceneMode>
            label={t({
              de: "Spielart wählen",
              ru: "Выбрать игру",
              en: "Choose a way to play",
              zh: "选择玩法",
              hi: "खेलने का तरीका चुनें",
              es: "Elegir modo de juego",
              ar: "اختيار طريقة اللعب",
            })}
            value={settings.mode}
            onChange={(mode) => update({ mode })}
            options={[
              {
                value: "explore",
                label: t({
                  de: "👆 Freies Entdecken",
                  ru: "👆 Свободная игра",
                  en: "👆 Free exploring",
                  zh: "👆 自由探索",
                  hi: "👆 खुलकर खोजें",
                  es: "👆 Explorar libremente",
                  ar: "👆 استكشاف حر",
                }),
              },
              {
                value: "colour",
                label: t({ de: "🖍️ Ausmalen", ru: "🖍️ Раскраска", en: "🖍️ Coloring", zh: "🖍️ 涂颜色", hi: "🖍️ रंग भरें", es: "🖍️ Colorear", ar: "🖍️ تلوين" }),
              },
              { value: "find", label: t({ de: "🔍 Suchen", ru: "🔍 Поиск", en: "🔍 Find it", zh: "🔍 找一找", hi: "🔍 ढूँढें", es: "🔍 Buscar", ar: "🔍 بحث" }) },
              {
                value: "questions",
                label: t({ de: "❓ Fragen", ru: "❓ Вопросы", en: "❓ Questions", zh: "❓ 问一问", hi: "❓ सवाल", es: "❓ Preguntas", ar: "❓ أسئلة" }),
              },
            ]}
          />
        </div>
      </MenuHead>
      <ul ref={grid.ref} className={`game-list ${grid.className}`} style={grid.style}>
        {SCENES.map((scene) => localizeScene(scene, language.id)).map((s) => (
          <li key={s.id}>
            <GameCard href={`/bilder/${s.id}/`} emoji={s.emoji} title={s.title} />
          </li>
        ))}
        {UPCOMING_SCENES.map((s) => (
          <li key={s.title}>
            <GameCard emoji={s.emoji} title={s.title} />
          </li>
        ))}
      </ul>
    </main>
  );
}
