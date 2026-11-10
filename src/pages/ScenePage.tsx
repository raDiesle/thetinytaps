import { Navigate, useParams } from "react-router";
import { sceneEntry, sceneTitle } from "@/games/scenes/catalog";
import { ScenesGame } from "@/games/scenes/ScenesGame";
import { useAppLanguage, useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function ScenePage() {
  const { scene = "" } = useParams();
  const found = sceneEntry(scene);
  const language = useAppLanguage();
  const t = useT();
  useTitle(
    found
      ? sceneTitle(found.id, language.id)
      : t({ de: "Lebendige Bilder", ru: "Живые картинки", en: "Living Pictures", zh: "会动的图画", hi: "जीवंत तस्वीरें", es: "Imágenes vivas", ar: "صور حيّة" }),
  );
  if (!found) return <Navigate to="/bilder/" replace />;
  return <ScenesGame sceneId={found.id} />;
}
