import type { ComponentType } from "react";
import { type LazyPart, lazyPart } from "@/lib/lazyPart";
import type { LevelProps } from "./level";
import type { MarbleLevel } from "./settings";

// Every level is a chunk of its own, loaded only when it is played: all 21 levels in the start screen's chunk were
// 454 KB of code, which the book's table of contents fetched ahead for one card (code review R-P12, November 2026).
// What the start screen, the address and „Weiter“ need before a level is loaded – its id and emoji, its name from
// content.ts – stands here; `catalog.test.ts` checks that nothing here, in MarbleGame.tsx or in MarblePlay.tsx imports
// a level statically. The six marble runs share one chunk: they are one `Run` drawn in six worlds (TrackLevel.tsx).

/** A level as the start screen knows it before its code is loaded. */
export interface LevelEntry {
  id: MarbleLevel;
  emoji: string;
  /** Loads the level's own chunk. */
  load: () => Promise<ComponentType<LevelProps>>;
}

const runs = () => import("./TrackLevel");

/** The levels in menu order, one card each; „Weiter“ at a level's end goes on with the next. */
export const LEVELS: LevelEntry[] = [
  { id: "track", emoji: "🎢", load: () => runs().then((m) => m.TrackLevel) },
  { id: "colortrack", emoji: "🎨", load: () => runs().then((m) => m.ColorTrackLevel) },
  { id: "snowtrack", emoji: "☃️", load: () => runs().then((m) => m.SnowTrackLevel) },
  { id: "spacetrack", emoji: "🪐", load: () => runs().then((m) => m.SpaceTrackLevel) },
  { id: "slidetrack", emoji: "🛟", load: () => runs().then((m) => m.SlideTrackLevel) },
  { id: "sitetrack", emoji: "🏗️", load: () => runs().then((m) => m.SiteTrackLevel) },
  { id: "machine", emoji: "⚙️", load: () => import("./MachineLevel").then((m) => m.MachineLevel) },
  { id: "sneeze", emoji: "🤧", load: () => import("./SneezeLevel").then((m) => m.SneezeLevel) },
  { id: "kitchen", emoji: "🍳", load: () => import("./KitchenLevel").then((m) => m.KitchenLevel) },
  { id: "garden", emoji: "🌻", load: () => import("./GardenLevel").then((m) => m.GardenLevel) },
  { id: "pegs", emoji: "📍", load: () => import("./PegsLevel").then((m) => m.PegsLevel) },
  { id: "topple", emoji: "📚", load: () => import("./ToppleLevel").then((m) => m.ToppleLevel) },
  { id: "building", emoji: "🚧", load: () => import("./BuildingLevel").then((m) => m.BuildingLevel) },
  { id: "water", emoji: "🦆", load: () => import("./WaterLevel").then((m) => m.WaterLevel) },
  { id: "circus", emoji: "🎪", load: () => import("./CircusLevel").then((m) => m.CircusLevel) },
  { id: "space", emoji: "🚀", load: () => import("./SpaceLevel").then((m) => m.SpaceLevel) },
  { id: "light", emoji: "🔦", load: () => import("./LightLevel").then((m) => m.LightLevel) },
  { id: "bath", emoji: "🛁", load: () => import("./BathLevel").then((m) => m.BathLevel) },
  { id: "farm", emoji: "🐓", load: () => import("./FarmLevel").then((m) => m.FarmLevel) },
  { id: "night", emoji: "🌙", load: () => import("./NightLevel").then((m) => m.NightLevel) },
  { id: "tidy", emoji: "🧸", load: () => import("./TidyLevel").then((m) => m.TidyLevel) },
];

/** The marble runs, the wooden one and its other worlds (K-18): they play their own notes, so no background song. */
export const RUNS: MarbleLevel[] = ["track", "colortrack", "snowtrack", "spacetrack", "slidetrack", "sitetrack"];

const parts = new Map<MarbleLevel, LazyPart<ComponentType<LevelProps>>>();
const partOf = (entry: LevelEntry) => {
  let part = parts.get(entry.id);
  if (!part) {
    part = lazyPart(entry.load);
    parts.set(entry.id, part);
  }
  return part;
};

/** The level's code, loaded once (the same promise every time, as `use()` needs); a failed download is tried again next time. */
export const loadLevel = (entry: LevelEntry): Promise<ComponentType<LevelProps>> => partOf(entry).load();

/** Fetches a level's code ahead, quietly: a failure (offline) leaves it to the tap, which shows the loading paper and tries again. */
export function prefetchLevel(entry: LevelEntry | undefined) {
  if (entry) loadLevel(entry).catch(() => {});
}
