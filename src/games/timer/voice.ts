import { recordedVoice } from "@/lib/voice";
import type { TimerPicture, TurnPicture } from "./settings";
import type { Holder } from "./swap";
import voiceFiles from "./stimme/**/*.mp3?glob";

// What the Timer says (H-72, November 2026): where a picture goes as it starts, „Gleich ist es so weit!“ with the bell a
// while before the end (H-49), and what is there at the end; Abwechseln and Tennis say who begins and whose turn it is.
// German only, from the recordings in ./stimme/ (`bun run voice make --only timer`): silent until they are made and in
// every other app language, never the browser's voice.

/** The Timer's voice: its recordings in ./stimme/. */
export const timerVoice = recordedVoice(voiceFiles);

/** A picture that runs until the time is up. */
export type TimedPicture = Exclude<TimerPicture, TurnPicture>;

/** Each picture's two lines: where it goes, said as it starts, and what is there at the end. */
export const PICTURE_LINES: Record<TimedPicture, { start: string; end: string }> = {
  disc: { start: "Die rote Scheibe wird kleiner.", end: "Die Scheibe ist weg!" },
  sand: { start: "Der Sand rieselt.", end: "Der Sand ist durch!" },
  candle: { start: "Die Kerzen brennen.", end: "Alle Kerzen sind aus!" },
  apple: { start: "Der Apfelbaum wächst.", end: "Alle Äpfel sind im Wagen!" },
  flower: { start: "Die Blume bekommt Wasser.", end: "Die Blume blüht!" },
  pizza: { start: "Wir essen die Pizza.", end: "Die Pizza ist aufgegessen!" },
  clock: { start: "Der Wecker zählt.", end: "Der Wecker klingelt!" },
  train: { start: "Der Zug fährt zum Bahnhof.", end: "Der Zug ist am Bahnhof!" },
  caterpillar: { start: "Die Raupe frisst das Blatt.", end: "Das Blatt ist weg. Ein Schmetterling!" },
  sunset: { start: "Der Mond geht schlafen.", end: "Die Sonne ist da!" },
};

/** Said with the bell a while before the end (H-49). */
export const SOON_LINE = "Gleich ist es so weit!";

/** Abwechseln and Tennis: said as the lamps start to draw who begins. */
export const WHO_BEGINS = "Wer fängt an?";

/** Said as the lamps have drawn the first child. */
export const BEGINS: Record<Holder, string> = {
  fox: "Das Fuchskind fängt an!",
  bear: "Das Bärenkind fängt an!",
};

/** Said at every change of turn, and when a grown-up gives the turn to a child behind ⚙️. */
export const TURN_TO: Record<Holder, string> = {
  fox: "Tauschen! Jetzt ist das Fuchskind dran.",
  bear: "Tauschen! Jetzt ist das Bärenkind dran.",
};
