import type { StoryTranslation } from "../story";

// What Tapsi says in „Fire Rescue“ in German: the English lines of lines.ts, step by step (translated on request,
// 19 November 2026). Robo, the hover robot, keeps its name.

/** „Fire Rescue“ in German. */
export const TRANSLATION: StoryTranslation = {
  title: "Feuerwehr-Einsatz",
  defaultTurn: "Jetzt du!",
  opening: ["Oh! Schau mal, da drüben ist Rauch!", "Und oben auf dem Dach sitzen kleine Kätzchen.", "Wir helfen! Kommst du mit?"],
  steps: [
    // 👋
    {
      name: "Kiki winken",
      situation: "Hallo! Ich bin Tapsi. Und das ist Robo, mein Schwebe-Roboter!",
      instruction: "Da kommt Kiki! Wir winken – so!",
      turn: "Winkst du Kiki auch?",
      again: "Hallo, Kiki!",
      praise: "Kiki kommt mit!",
    },
    // 🔔
    {
      name: "Die Feuerglocke läuten",
      situation: "Das Tor ist zu. Wir läuten die Feuerglocke!",
      instruction: "Hoch greifen und runterziehen – so!",
      turn: "Jetzt du – zieh!",
      again: "Bim, bam! Das Tor geht hoch!",
      praise: "Das Tor ist offen. Los geht's!",
    },
    // 👕
    {
      name: "Unter den Wäscheleinen ducken",
      situation: "Robo fliegt die Straße entlang. Schau, Wäscheleinen!",
      instruction: "Wenn eine kommt, ducken wir uns – so!",
      turn: "Achtung! Duck dich!",
      again: "Und nochmal ducken!",
      praise: "Wir sind durch!",
    },
    // 💧
    {
      name: "Wasser pumpen",
      situation: "Robo braucht Wasser für den Schlauch. Schau, ein Brunnen!",
      instruction: "Den Griff festhalten und runterdrücken – so!",
      turn: "Jetzt du – pump!",
      again: "Gluck, gluck! Das Wasser kommt rein!",
      praise: "Robos Tanks sind voll!",
    },
    // 💦
    {
      name: "Den Rauch wegspritzen",
      situation: "Da ist das Haus mit dem Rauch!",
      instruction: "Den Schlauch halten und spritzen – nach links und nach rechts! So!",
      turn: "Jetzt du – spritz das Wasser!",
      again: "Pschhh! Der Rauch geht weg!",
      praise: "Der ganze Rauch ist weg!",
    },
    // 🐱
    {
      name: "Die Kätzchen fangen",
      situation: "Die Kätzchen sitzen oben auf dem Dach. Robo fliegt hoch!",
      instruction: "Arme auf und fangen – so!",
      turn: "Da kommt ein Kätzchen – fang!",
      again: "Und noch eins!",
      praise: "Alle Kätzchen sind in Sicherheit!",
    },
    // 🎉
    {
      name: "Hurra!",
      situation: "Geschafft!",
      instruction: "Arme hoch – Hurra!",
      turn: "Du auch – Hurra!",
      praise: "Hurra für die Feuerwehr!",
    },
    // 👋
    {
      name: "Zum Abschied winken",
      situation: "Robo bringt die Kätzchen nach Hause.",
      instruction: "Wir winken Tschüss – so!",
      turn: "Winkst du mit?",
      again: "Tschüss, Kätzchen! Tschüss, Kiki!",
      praise: "Danke fürs Helfen! Bis bald!",
    },
  ],
};
