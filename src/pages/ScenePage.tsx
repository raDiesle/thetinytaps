import { Navigate, useParams } from "react-router";
import { findScene } from "@/games/scenes";
import { ScenesGame } from "@/games/scenes/ScenesGame";
import { useTitle } from "@/lib/title";

export function ScenePage() {
  const { scene = "" } = useParams();
  const found = findScene(scene);
  useTitle(found?.title ?? "Lebendige Bilder");
  if (!found) return <Navigate to="/bilder/" replace />;
  return <ScenesGame sceneId={found.id} />;
}
