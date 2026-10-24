import { ground } from "../layout";
import type { Scene } from "../types";
import { osterei } from "./osterei";

// Placeholder: the picture is being drawn.

export const ostern: Scene = {
  id: "ostern",
  title: "Ostern",
  emoji: "🐣",
  description: "Osterhase, Küken und versteckte Eier.",
  width: 1600,
  height: 1000,
  sky: "#bde0fe",
  ground: "#95d5b2",
  Background: () => null,
  items: [osterei(ground(0, 0, 800, 800))],
};
