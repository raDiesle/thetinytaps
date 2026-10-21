import type { Metadata } from "next";
import { SCENES, findScene } from "@/games/scenes";
import { ScenesGame } from "@/games/scenes/ScenesGame";

type Props = { params: Promise<{ scene: string }> };

// Static export: one page per scene, nothing else.
export const dynamicParams = false;

export function generateStaticParams() {
  return SCENES.map((s) => ({ scene: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { scene } = await params;
  return { title: `${findScene(scene)?.title ?? "Lebendige Bilder"} – The Tiny Taps` };
}

export default async function ScenePage({ params }: Props) {
  const { scene } = await params;
  return <ScenesGame sceneId={scene} />;
}
