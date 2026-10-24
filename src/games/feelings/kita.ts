// Little stories from the kindergarten: someone pushes, kicks, grabs, the
// slide is full, someone has the toy you want, or you are angry yourself.
// Each one shows what the little bear can do instead of hitting back:
// say "Stopp!", step away, get a grown-up, ask, wait, swap.

import type { Beat } from "./story";

export type SituationId = "push" | "kick" | "grab" | "slide" | "want" | "angry";

export interface KitaStep {
  emoji: string;
  /** Not shown: the card is only a picture. Said by screen readers. */
  label: string;
  beats: Beat[];
}

export interface Situation {
  id: SituationId;
  emoji: string;
  title: string;
  /** What happens, told while the picture of it is shown. */
  intro: Beat[];
  steps: KitaStep[];
  /** The not-so-good idea, offered next to the first step when children choose themselves. */
  instead: { emoji: string; label: string; answer: string };
  outro: Beat[];
}

export const QUESTION = "Was kann der kleine Bär tun?";

export const SITUATIONS: Situation[] = [
  {
    id: "push",
    emoji: "💥",
    title: "Geschubst",
    intro: [{ narration: "Der kleine Bär spielt draußen." }, { narration: "Der Fuchs schubst den kleinen Bären. Aua!", sound: "boing" }],
    steps: [
      {
        emoji: "✋",
        label: "Stopp! Nein!",
        beats: [{ narration: "Der kleine Bär sagt laut:", line: "Stopp! Nein! Ich will das nicht!" }],
      },
      {
        emoji: "👣",
        label: "Weggehen",
        beats: [{ narration: "Dann geht er weg. So hat er Abstand." }],
      },
      {
        emoji: "🙋",
        label: "Hilfe holen",
        beats: [
          { narration: "Er holt die Erzieherin.", line: "Der Fuchs hat mich geschubst!" },
          { line: "Stopp, Fuchs. Schubsen tut weh." },
          { line: "Entschuldigung, Bär." },
        ],
      },
    ],
    instead: {
      emoji: "👊",
      label: "Zurückschubsen",
      answer: "Hmm, dann tut es noch mehr weh. Sag lieber laut: Stopp!",
    },
    outro: [{ narration: "Super! Stopp sagen, weggehen, Hilfe holen.", sound: "chime" }],
  },
  {
    id: "kick",
    emoji: "🦶",
    title: "Getreten",
    intro: [{ narration: "Der kleine Bär und der Fuchs sind draußen." }, { narration: "Der Fuchs tritt den kleinen Bären ans Bein. Aua!", sound: "boing" }],
    steps: [
      {
        emoji: "✋",
        label: "Stopp!",
        beats: [{ narration: "Der kleine Bär sagt laut:", line: "Stopp! Nicht treten!" }],
      },
      {
        emoji: "👣",
        label: "Weggehen",
        beats: [{ narration: "Er geht ein paar Schritte weg." }],
      },
      {
        emoji: "🙋",
        label: "Hilfe holen",
        beats: [
          { narration: "Er ruft die Erzieherin.", line: "Hilfe! Der Fuchs hat mich getreten." },
          { line: "Fuchs, Treten tut weh. Das machen wir nicht." },
          { line: "Entschuldigung." },
        ],
      },
    ],
    instead: {
      emoji: "🦶",
      label: "Zurücktreten",
      answer: "Hmm, dann tut es beiden weh. Sag lieber laut: Stopp!",
    },
    outro: [{ narration: "Prima! Stopp sagen, Abstand halten, Hilfe holen.", sound: "chime" }],
  },
  {
    id: "grab",
    emoji: "🚜",
    title: "Weggenommen",
    intro: [{ narration: "Der kleine Bär spielt mit seinem Traktor." }, { narration: "Da nimmt ihm der Fuchs einfach den Traktor weg!" }, { sound: "pop" }],
    steps: [
      {
        emoji: "✋",
        label: "Das ist meins!",
        beats: [{ narration: "Der kleine Bär sagt laut:", line: "Stopp! Das ist mein Traktor!" }],
      },
      {
        emoji: "🤲",
        label: "Zurück, bitte",
        beats: [{ line: "Gib ihn mir bitte zurück." }, { line: "Hier. Entschuldigung." }, { sound: "pop" }],
      },
      {
        emoji: "🤝",
        label: "Mitspielen?",
        beats: [{ line: "Willst du mitspielen? Du kannst den Eimer haben." }, { line: "Au ja!" }],
      },
    ],
    instead: {
      emoji: "😤",
      label: "Wegreißen",
      answer: "Hmm, dann zerren beide und es gibt Streit. Sag lieber: Stopp, das ist meins!",
    },
    outro: [{ narration: "Toll! Und gibt er es nicht zurück, holst du die Erzieherin.", sound: "chime" }],
  },
  {
    id: "slide",
    emoji: "🎢",
    title: "Rutsche voll",
    intro: [{ narration: "Alle wollen rutschen." }, { narration: "Der kleine Bär will sofort rutschen. Aber die Rutsche ist voll!" }],
    steps: [
      {
        emoji: "🚶",
        label: "Anstellen",
        beats: [{ narration: "Er stellt sich hinten an.", line: "Ich bin nach dem Fuchs dran." }],
      },
      {
        emoji: "⏳",
        label: "Warten",
        beats: [{ narration: "Er wartet. Erst rutscht der Hase …" }, { narration: "… dann der Fuchs." }],
      },
      {
        emoji: "🥳",
        label: "Jetzt ich!",
        beats: [{ narration: "Jetzt ist der kleine Bär dran!" }, { line: "Juhuu!", sound: "boing" }],
      },
    ],
    instead: {
      emoji: "💥",
      label: "Vordrängeln",
      answer: "Hmm, auf der Rutsche kann jemand runterfallen. Lieber hinten anstellen.",
    },
    outro: [{ narration: "Super gewartet! Jeder kommt mal dran.", sound: "chime" }],
  },
  {
    id: "want",
    emoji: "🚗",
    title: "Haben wollen",
    intro: [{ narration: "Der Hase spielt mit einem tollen Auto." }, { narration: "Der kleine Bär will das Auto auch haben!" }],
    steps: [
      {
        emoji: "🗣️",
        label: "Fragen",
        beats: [{ narration: "Er fragt:", line: "Darf ich auch mal?" }, { line: "Gleich. Ich spiele noch." }],
      },
      {
        emoji: "⏳",
        label: "Warten",
        beats: [{ narration: "Der kleine Bär wartet. Solange spielt er mit dem Ball.", sound: "boing" }],
      },
      {
        emoji: "🔄",
        label: "Tauschen",
        beats: [{ line: "Jetzt darfst du. Tauschen wir?" }, { line: "Ja! Danke!", sound: "pop" }],
      },
    ],
    instead: {
      emoji: "✊",
      label: "Wegnehmen",
      answer: "Hmm, dann ist der Hase traurig. Frag lieber: Darf ich auch mal?",
    },
    outro: [{ narration: "Prima! Fragen, warten, tauschen.", sound: "chime" }],
  },
  {
    id: "angry",
    emoji: "😠",
    title: "Selbst wütend",
    intro: [
      { narration: "Der kleine Bär baut einen hohen Turm." },
      { narration: "Rums! Der Fuchs stößt den Turm um. Der kleine Bär ist sooo wütend. Er will schubsen!", sound: "rumble" },
    ],
    steps: [
      {
        emoji: "🦶",
        label: "Stampfen",
        beats: [{ narration: "Aber er stampft lieber. Stampf, stampf!", sound: "rumble" }],
      },
      {
        emoji: "💨",
        label: "Tief pusten",
        beats: [{ narration: "Er atmet tief ein und pustet: Puuuh." }],
      },
      {
        emoji: "🗣️",
        label: "Sagen",
        beats: [
          { narration: "Dann sagt er:", line: "Ich bin wütend! Mein Turm ist kaputt!" },
          { line: "Oh, Entschuldigung! Ich helfe dir." },
          { sound: "pop" },
        ],
      },
    ],
    instead: {
      emoji: "👊",
      label: "Schubsen",
      answer: "Hmm, Schubsen tut weh. Lass die Wut lieber raus: Stampf ganz fest!",
    },
    outro: [{ narration: "Toll! Wütend sein ist okay. Stampfen, pusten, sagen – nicht hauen.", sound: "chime" }],
  },
];
