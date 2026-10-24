import { ground } from "../layout";
import type { Scene } from "../types";
import { schneemann } from "./schneemann";

// Placeholder: the picture is being drawn.

export const winter: Scene = {
  id: "winter",
  title: "Winter",
  emoji: "⛄",
  description: "Schneemann, Schlitten und Schneeflocken.",
  width: 1600,
  height: 1000,
  sky: "#9cc3e6",
  ground: "#e7eff7",
  Background: () => null,
  items: [schneemann(ground(0, 0, 800, 800))],
};
