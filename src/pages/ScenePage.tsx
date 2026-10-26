import { Navigate, useParams } from "react-router";
import { findScene } from "@/games/scenes";
import { ScenesGame } from "@/games/scenes/ScenesGame";
import { localizeScene } from "@/games/scenes/localize";
import { useAppLanguage, useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function ScenePage() {
  const { scene = "" } = useParams();
  const found = findScene(scene);
  const language = useAppLanguage();
  const t = useT();
  useTitle(found ? localizeScene(found, language.id).title : t({ de: "Lebendige Bilder", ru: "Живые картинки" }));
  if (!found) return <Navigate to="/bilder/" replace />;
  return <ScenesGame sceneId={found.id} />;
}
