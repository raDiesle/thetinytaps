import { GameCard } from "@/components/GameCard";
import { MenuHead } from "@/components/MenuTop";
import { Sky } from "@/components/Sky";
import { categoryHref, categoryOf } from "@/content/games";
import { SCENES, UPCOMING_SCENES } from "@/games/scenes";
import { localizeScene } from "@/games/scenes/localize";
import { useFitGrid } from "@/lib/fitGrid";
import { useAppLanguage, useT } from "@/lib/language";
import { useUpdateBetweenGames } from "@/lib/pwa";
import { useTitle } from "@/lib/title";

const CATEGORY = categoryOf("/bilder/");

export function ScenesMenu() {
  const language = useAppLanguage();
  const t = useT();
  const title = t({ de: "Lebendige Bilder", ru: "Живые картинки" });
  useTitle(title);
  useUpdateBetweenGames();
  const grid = useFitGrid(SCENES.length + UPCOMING_SCENES.length);
  return (
    <main className="home">
      <Sky />
      <MenuHead
        to={CATEGORY ? categoryHref(CATEGORY) : "/"}
        back={CATEGORY ? t(CATEGORY.title) : t({ de: "Alle Spiele", ru: "Все игры" })}
        title={
          <>
            <span aria-hidden>🖼️</span> {title}
          </>
        }
      />
      <p className="home-subtitle">{t({ de: "Bild aussuchen – dann alles antippen und entdecken!", ru: "Выбери картинку – и нажимай на всё, что видишь!" })}</p>
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
