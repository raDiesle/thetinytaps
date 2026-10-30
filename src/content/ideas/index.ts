// Idea collection for grown-ups, shown on the hidden page /management/ (hold the
// "p" in the home page title for 2 seconds). IDs are fixed so they can be
// referenced ("mach N-04"); new ideas get the next free number of their area,
// never a reused one.
//
// One file per area (`<prefix>-<name>.ts`); areas are sorted into IDEA_GROUPS,
// whose order is the order on the page.

import { lettersIdeas } from "./l-letters";
import { wordsIdeas } from "./w-words";
import { scenesIdeas } from "./b-scenes";
import { newScenesIdeas } from "./s-new-scenes";
import { newGamesIdeas } from "./n-new-games";
import { adventureIdeas } from "./m-adventure";
import { littleAdventuresIdeas } from "./g-little-adventures";
import { otherGamesIdeas } from "./x-other-games";
import { marblesIdeas } from "./k-marbles";
import { chainReactionIdeas } from "./r-chain-reactions";
import { parentPhoneIdeas } from "./e-parent-phone";
import { everydayHelpersIdeas } from "./h-everyday-helpers";
import { allGamesIdeas } from "./a-all-games";
import { figureIdeas } from "./f-figure";
import { rewardChartIdeas } from "./t-reward-chart";
import { firstVisitIdeas } from "./v-first-visit";
import { bookIdeas } from "./d-book";
import type { IdeaArea, IdeaGroup } from "./types";

export * from "./types";
export * from "./foxStatus";
export * from "./languageStatus";

/** Areas sorted by what kind of work they are: grow a game, make a new one, or for parents. */
export const IDEA_GROUPS: IdeaGroup[] = [
  {
    emoji: "🧱",
    title: "Bestehende Spiele ausbauen",
    areas: [scenesIdeas, newScenesIdeas, lettersIdeas, wordsIdeas, marblesIdeas, chainReactionIdeas, adventureIdeas, littleAdventuresIdeas, otherGamesIdeas],
  },
  { emoji: "✨", title: "Ganz neue Spiele", areas: [newGamesIdeas] },
  {
    emoji: "👪",
    title: "Für Eltern & Technik",
    areas: [everydayHelpersIdeas, rewardChartIdeas, figureIdeas, bookIdeas, parentPhoneIdeas, firstVisitIdeas, allGamesIdeas],
  },
];

/** Every area in page order. */
export const IDEA_AREAS: IdeaArea[] = IDEA_GROUPS.flatMap((g) => g.areas);

/** My suggestion of what to do first, with a short reason each. */
export const TOP_PICKS: { id: string; reason: string }[] = [
  { id: "X-14", reason: "Zuerst: Heute kann eine richtige Antwort als falsch gelten (der Hase mag auch Salat)." },
  { id: "N-01", reason: "Klein, sofort lustig, nutzt den vorhandenen Klang-Baukasten." },
  { id: "N-03", reason: "Löst das Problem „Bildschirmzeit beenden“." },
  { id: "B-01", reason: "Guck-guck passt perfekt zu 2-Jährigen und zur bestehenden Baustelle." },
  { id: "B-02", reason: "Neuer Suchmodus fast ohne neue Zeichnungen." },
  { id: "L-03", reason: "Der eigene Name ist der stärkste Motivator." },
  { id: "N-04", reason: "Wischen + Fahrzeuge = Dauerbrenner." },
  { id: "W-01", reason: "Kleine Änderung, macht „Wörter tippen“ für Kleine viel lohnender." },
  { id: "A-03", reason: "Spielzeit-Grenze, die das Spiel setzt – zusammen mit N-03 ein starkes Paar." },
  { id: "K-01", reason: "Macht die Kugelbahn vom Zuschauen zum Mitspielen, mit der vorhandenen Bahn." },
  { id: "N-26", reason: "Nur wischen, sofort ein Tier – einfacher geht es für 2-Jährige kaum." },
  { id: "E-01", reason: "Öffnet die ganze Eltern-Handy-Reihe; danach sind E-03, E-06 und E-10 je nur klein." },
  { id: "E-03", reason: "Spiel beenden, ohne dem Kind das Tablet wegzunehmen." },
];

/** What every idea has to meet so a 2-year-old can play it alone. */
export const TODDLER_RULES: { emoji: string; text: string }[] = [
  { emoji: "👆", text: "Ein Tippen = eine Reaktion, sofort sichtbar und hörbar." },
  { emoji: "💚", text: "Es gibt kein Falsch: Daneben tippen macht auch etwas Schönes, nie ein Fehlerton." },
  { emoji: "🖼️", text: "Kein Lesen nötig: Bilder, Töne und Stimme statt Text." },
  { emoji: "🎯", text: "Riesige Ziele, mindestens daumengroß, mit Platz dazwischen." },
  { emoji: "✌️", text: "Höchstens 2–4 Möglichkeiten auf einmal." },
  { emoji: "🐢", text: "Keine Zeitnot, kein Verlieren, keine Punkte." },
  { emoji: "🔁", text: "Wiederholen ist das Ziel: Das 50. Mal ist genauso lustig wie das erste." },
  { emoji: "🛡️", text: "Nichts kann kaputtgehen: keine Menüs, kein Zurück, Verlassen nur für Eltern (Halten)." },
  { emoji: "🌙", text: "Ruhig statt grell: sanfte Töne, kein Blinken, freundliches Ende." },
  { emoji: "📱", text: "Alles für Eltern ist versteckt – oder auf dem Eltern-Handy (Bereich E)." },
];
