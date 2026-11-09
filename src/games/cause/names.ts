// „Was ist passiert?“ (idea J-03, area J of /management/): a game of its own in the book „Gefühle“. Its name and line
// stand here, in the game's folder, so its row in the language table says that they are still German only.

import type { Localized } from "@/lib/language";

/** The game's name on the shelf's table of contents and in the browser tab. */
export const CAUSE_TITLE: Localized = { de: "Was ist passiert?" };

/** The game's line for grown-ups, on the book's table of contents. */
export const CAUSE_BLURB: Localized = { de: "Warum fühlt sich das Kind so?" };

/**
 * What the game is and how a round goes, for grown-ups on the management page („🚧 In Arbeit“) while it is still being
 * built: when trying it, it made no sense to the user (November 2026), so this says what it is meant to be.
 */
export const CAUSE_HELP =
  "Idee: Gefühle haben einen Grund. Oben steht ein Fuchs- oder Bärenkind mit seinem Großen daneben, und sein Gesicht zeigt ein Gefühl " +
  "(traurig, fröhlich, wütend, erschrocken). Darunter liegen zwei Bilder – das sind zwei mögliche Gründe, „was passiert ist“. " +
  "Das Kind tippt den Grund, der zum Gefühl passt: dann lächelt das Kind, der Große klatscht, und nach gut zwei Sekunden kommt die nächste Runde. " +
  "Beim anderen Bild schüttelt das Kind nur sanft den Kopf. Die vier Runden: Fuchskind traurig → 🎈 der Luftballon ist weggeflogen (nicht 🍦 Eis); " +
  "Bärenkind lacht → 👵 Oma kommt (nicht 🌧️ Regen); Bärenkind wütend → ✋🪏 jemand nimmt ihm die Schaufel (nicht 🛝 Rutsche); " +
  "Fuchskind erschrickt → 🐕 ein Hund bellt (nicht 🦋 Schmetterling). Danach „Nochmal“. " +
  "Warum es noch nicht verständlich ist: Das Gefühl zeigt sich nur am kleinen Mund (traurig und wütend sehen gleich aus), die Gründe sind nur Emojis ohne Szene, " +
  "nichts sagt die Frage, und es wird nicht gezeigt, wie es dazu kam. Das sind die Punkte, die vor dem Freischalten besser werden müssen.";
