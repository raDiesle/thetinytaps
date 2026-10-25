import type { StepLines } from "../story";

// What Tapsi says in „Die Wolkenreise“: short German sentences, one set per step.

/** Said over the opening shots, `at` seconds into it. */
export const OPENING_LINES = [
  { at: 0.3, text: "Oh! Wo ist die Sonne?" },
  { at: 3, text: "Sie steckt hinter der dicken Regenwolke." },
  { at: 6.4, text: "Wir holen sie raus! Kommst du mit?" },
];

/** One entry per step of the story, in the order of the steps. */
export const LINES: StepLines[] = [
  {
    icon: "👋",
    situation: "Hallo! Ich bin Tapsi. Und das ist Wolle, meine Wolke!",
    instruction: "Da kommt Kiki! Wir winken – so!",
    turn: "Winkst du Kiki auch?",
    again: "Hallo, Kiki!",
    praise: "Kiki fliegt mit!",
  },
  {
    icon: "🐦",
    situation: "Wolle will fliegen. Wir helfen mit!",
    instruction: "Mit den Armen flattern, wie ein Vogel – so!",
    turn: "Jetzt du – flatter mit!",
    again: "Flattern, flattern – hoch hinauf!",
    praise: "Wir fliegen ganz hoch!",
  },
  {
    icon: "✈️",
    situation: "Oh, da kommen kleine Flugzeuge!",
    instruction: "Wenn eins kommt, ducken wir uns – so!",
    turn: "Achtung! Duck dich!",
    again: "Und nochmal ducken!",
    praise: "Alle Flugzeuge sind vorbei.",
  },
  {
    icon: "🎈",
    situation: "Lauter Luftballons!",
    instruction: "Wir tippen sie an – plopp! So!",
    turn: "Jetzt du – tipp sie an!",
    again: "Plopp! Und plopp!",
    praise: "Lauter Konfetti!",
  },
  {
    icon: "🪑",
    instruction: "Jetzt wird's schnell! Setz dich mit mir hin – so!",
    praise: "Gut festhalten!",
  },
  {
    icon: "⭐",
    situation: "Da hängen lauter Sterne!",
    instruction: "Zur Seite lehnen und den Stern holen – so!",
    turn: "Jetzt du – lehn dich zur Seite!",
    again: "Und zur anderen Seite!",
    praise: "Alle Sterne geholt!",
  },
  {
    icon: "🧍",
    instruction: "Da ist die Regenwolke! Steh mit mir auf – so!",
    praise: "Jetzt holen wir die Sonne!",
  },
  {
    icon: "🌧️",
    situation: "Hier regnet es! Die Sonne ist da oben.",
    instruction: "Mit beiden Armen die Wolke hochdrücken – so!",
    turn: "Jetzt du – drück mit!",
    again: "Hoch, hoch – die Sonne kommt!",
    praise: "Da ist die Sonne!",
  },
  {
    icon: "🌈",
    situation: "Jetzt fehlt nur noch der Regenbogen.",
    instruction: "Mit dem Arm einen großen Bogen malen – so!",
    turn: "Jetzt du – mal mit!",
    again: "Noch eine Farbe!",
    praise: "Ein Regenbogen!",
  },
  {
    icon: "🙌",
    situation: "Die Sonne lacht!",
    instruction: "Arme hoch – Hurra!",
    turn: "Du auch – Hurra!",
    praise: "Die Sonne ist wieder da!",
  },
  {
    icon: "🏡",
    situation: "Wolle fliegt uns nach Hause.",
    instruction: "Wir winken Tschüss – so!",
    turn: "Winkst du mit?",
    again: "Tschüss, Sonne! Tschüss, Kiki!",
    praise: "Danke fürs Mitfliegen! Bis bald!",
  },
];
