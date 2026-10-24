import { ground } from "../layout";
import type { Scene } from "../types";
import { kuerbis } from "./kuerbis";

// Placeholder: the picture is being drawn.

export const herbst: Scene = {
  id: "herbst",
  title: "Herbst",
  emoji: "🍂",
  description: "Bunte Blätter, Kürbis und Drachen im Wind.",
  width: 1600,
  height: 1000,
  sky: "#a8d0e6",
  ground: "#c9a227",
  Background: () => null,
  items: [kuerbis(ground(0, 0, 800, 800))],
};
