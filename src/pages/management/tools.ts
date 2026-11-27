import { ALL_TROPHIES, MUSEUM_PATH } from "@/lib/museum";

/** A page for grown-ups reached from the contents of /management/: where it is, what it is for, and the ideas it came from. */
export interface ToolPage {
  to: string;
  emoji: string;
  label: string;
  about: string;
  ideas?: string[];
}

/**
 * Every page of its own that /management/ leads to, by kind. A new page under `/management/` gets its line here
 * (`tools.test.ts` checks it against the routes in `App.tsx`): what is not listed here is not found.
 */
export const TOOL_GROUPS: { title: string; pages: ToolPage[] }[] = [
  {
    title: "📚 Nachschlagen",
    pages: [
      { to: "/management/recherchen/", emoji: "🔍", label: "Recherchen", about: "alles, was nachgeschaut wurde, nach Thema geordnet, mit Quellen" },
      { to: "/management/bilder/", emoji: "🖼️", label: "Alle Bilder", about: "jedes Bild der App auf einer Seite, nach Spiel und Geschichte" },
      {
        to: "/management/lieder/",
        emoji: "🎶",
        label: "Lieder für Suno",
        about: "Liedtexte für den Timer zum Lesen und Einfügen in Suno: das schnelle Aufräumlied",
        ideas: ["H-119"],
      },
      {
        to: `${MUSEUM_PATH}?${ALL_TROPHIES}`,
        emoji: "🏆",
        label: "Alle Pokale",
        about: "das Pokalzimmer mit jedem Pokal, zum Testen – nichts wird gespeichert",
      },
    ],
  },
  {
    title: "🎬 Videos für YouTube",
    pages: [
      { to: "/management/video-intro/", emoji: "📖", label: "Intro", about: "das Buch kommt aus dem Regal, 7,5 s", ideas: ["Y-01"] },
      { to: "/management/video-outro/", emoji: "📚", label: "Abspann", about: "das Buch geht zurück, Adresse und QR-Code, 12 s", ideas: ["Y-04", "Y-05"] },
      { to: "/management/video-zaehne/", emoji: "🪥", label: "Zähne putzen", about: "das ganze Zähneputzen zum Mitputzen aufnehmen", ideas: ["Y-06"] },
      {
        to: "/management/video-haende/",
        emoji: "🧼",
        label: "Hände waschen",
        about: "das ganze Händewaschen zum Mitwaschen aufnehmen – noch mit Platzhalter-Melodie statt Lied",
        ideas: ["H-136", "Y-36"],
      },
      {
        to: "/management/video-toepfchen/",
        emoji: "🚽",
        label: "Aufs Töpfchen",
        about: "die Töpfchen-Geschichte ohne Tippen aufnehmen",
        ideas: ["Y-21", "Y-22"],
      },
      {
        to: "/management/video-toepfchen-eltern/",
        emoji: "👪",
        label: "Aufs Töpfchen für Eltern",
        about: "das Spiel auf einem Tablet, eine Hand tippt es durch",
        ideas: ["Y-29"],
      },
    ],
  },
];
