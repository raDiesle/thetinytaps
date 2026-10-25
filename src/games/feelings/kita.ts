// Little stories from the kindergarten: someone pushes, kicks, grabs, the
// slide is full, someone has the toy you want, or you are angry yourself.
// Each one shows what the little bear can do instead of hitting back:
// say "Stopp!", step away, get a grown-up, ask, wait, swap. Every step has a
// not-so-good idea before it, so the child always chooses between two.

import type { Beat } from "./story";

export type SituationId = "push" | "kick" | "grab" | "slide" | "want" | "angry";

/** The not-so-good idea next to a good step. */
export interface KitaInstead {
  /** What it is, in a word or two („Zurückschubsen“): for grown-ups under the card, said by screen readers. */
  caption: string;
  /** Read aloud when the child picks it: why it is not so good, and what is better. */
  answer: string;
}

/** One good thing the little bear does, with the not-so-good idea offered before it. */
export interface KitaStep {
  /** What to do, in a word or two („Weggehen“): for grown-ups under the card, said by screen readers. */
  caption: string;
  beats: Beat[];
  instead: KitaInstead;
}

/** One kindergarten story: what happens, three good steps, a happy end. */
export interface Situation {
  id: SituationId;
  emoji: string;
  title: string;
  /** What the picture of what happened shows, for grown-ups under it. */
  caption: string;
  /** What happens, told while the picture of it is shown. */
  intro: Beat[];
  steps: KitaStep[];
  outro: Beat[];
  /** What the picture at the happy end shows. */
  endCaption: string;
}

/** Asked before the first step of a story. */
export const QUESTION = "Was kann der kleine Bär tun?";

export const SITUATIONS: Situation[] = [
  {
    id: "push",
    emoji: "💥",
    title: "Geschubst",
    caption: "Fuchs schubst Bär",
    intro: [{ narration: "Der kleine Bär spielt draußen." }, { narration: "Der Fuchs schubst den kleinen Bären. Aua!", sound: "boing" }],
    steps: [
      {
        caption: "„Stopp!“ sagen",
        beats: [{ narration: "Der kleine Bär sagt laut:", line: "Stopp! Nein! Ich will das nicht!" }],
        instead: { caption: "Zurückschubsen", answer: "Hmm, dann tut es noch mehr weh. Sag lieber laut: Stopp!" },
      },
      {
        caption: "Weggehen",
        beats: [{ narration: "Dann geht er weg. So hat er Abstand." }],
        instead: { caption: "Sand werfen", answer: "Hmm, Sand in den Augen tut weh. Geh lieber weg." },
      },
      {
        caption: "Erzieherin holen",
        beats: [
          { narration: "Er holt die Erzieherin.", line: "Der Fuchs hat mich geschubst!" },
          { line: "Stopp, Fuchs. Schubsen tut weh." },
          { line: "Entschuldigung, Bär." },
        ],
        instead: { caption: "Eimer kaputt machen", answer: "Hmm, jetzt ist der Eimer kaputt und der Fuchs weint. Hol lieber Hilfe." },
      },
    ],
    outro: [{ narration: "Super! Stopp sagen, weggehen, Hilfe holen.", sound: "chime" }],
    endCaption: "Bär und Fuchs sind wieder froh",
  },
  {
    id: "kick",
    emoji: "🦶",
    title: "Getreten",
    caption: "Fuchs tritt Bär",
    intro: [{ narration: "Der kleine Bär und der Fuchs sind draußen." }, { narration: "Der Fuchs tritt den kleinen Bären ans Bein. Aua!", sound: "boing" }],
    steps: [
      {
        caption: "„Stopp!“ sagen",
        beats: [{ narration: "Der kleine Bär sagt laut:", line: "Stopp! Nicht treten!" }],
        instead: { caption: "Zurücktreten", answer: "Hmm, dann tut es beiden weh. Sag lieber laut: Stopp!" },
      },
      {
        caption: "Weggehen",
        beats: [{ narration: "Er geht ein paar Schritte weg." }],
        instead: { caption: "Am Ohr ziehen", answer: "Hmm, Ziehen tut auch weh. Geh lieber weg." },
      },
      {
        caption: "Erzieherin rufen",
        beats: [
          { narration: "Er ruft die Erzieherin.", line: "Hilfe! Der Fuchs hat mich getreten." },
          { line: "Fuchs, Treten tut weh. Das machen wir nicht." },
          { line: "Entschuldigung." },
        ],
        instead: { caption: "Mütze wegwerfen", answer: "Hmm, dann ist der Fuchs traurig und es gibt Streit. Ruf lieber die Erzieherin." },
      },
    ],
    outro: [{ narration: "Prima! Stopp sagen, Abstand halten, Hilfe holen.", sound: "chime" }],
    endCaption: "Bär und Fuchs sind wieder froh",
  },
  {
    id: "grab",
    emoji: "🚜",
    title: "Weggenommen",
    caption: "Fuchs nimmt Traktor weg",
    intro: [{ narration: "Der kleine Bär spielt mit seinem Traktor." }, { narration: "Da nimmt ihm der Fuchs einfach den Traktor weg!" }, { sound: "pop" }],
    steps: [
      {
        caption: "„Das ist meins!“ sagen",
        beats: [{ narration: "Der kleine Bär sagt laut:", line: "Stopp! Das ist mein Traktor!" }],
        instead: { caption: "Traktor wegreißen", answer: "Hmm, dann zerren beide und es gibt Streit. Sag lieber: Stopp, das ist meins!" },
      },
      {
        caption: "Um Traktor bitten",
        beats: [{ line: "Gib ihn mir bitte zurück." }, { line: "Hier. Entschuldigung." }, { sound: "pop" }],
        instead: { caption: "Hauen", answer: "Hmm, Hauen tut weh. Sag lieber: Gib ihn mir bitte zurück." },
      },
      {
        caption: "Zusammen spielen",
        beats: [{ line: "Willst du mitspielen? Du kannst den Eimer haben." }, { line: "Au ja!" }],
        instead: { caption: "Wegschicken", answer: "Hmm, jetzt ist der Fuchs allein und traurig. Frag lieber: Willst du mitspielen?" },
      },
    ],
    outro: [{ narration: "Toll! Und gibt er es nicht zurück, holst du die Erzieherin.", sound: "chime" }],
    endCaption: "Bär hält Traktor hoch, Fuchs klatscht",
  },
  {
    id: "slide",
    emoji: "🎢",
    title: "Rutsche voll",
    caption: "Rutsche ist voll, Bär will sofort",
    intro: [{ narration: "Alle wollen rutschen." }, { narration: "Der kleine Bär will sofort rutschen. Aber die Rutsche ist voll!" }],
    steps: [
      {
        caption: "Anstellen",
        beats: [{ narration: "Er stellt sich hinten an.", line: "Ich bin nach dem Fuchs dran." }],
        instead: { caption: "Vordrängeln", answer: "Hmm, auf der Rutsche kann jemand runterfallen. Lieber hinten anstellen." },
      },
      {
        caption: "Warten",
        beats: [{ narration: "Er wartet. Erst rutscht der Hase …" }, { narration: "… dann der Fuchs." }],
        instead: { caption: "Schreien und strampeln", answer: "Hmm, Schreien macht es nicht schneller. Warte lieber, gleich bist du dran." },
      },
      {
        caption: "Rutschen",
        beats: [{ narration: "Jetzt ist der kleine Bär dran!" }, { line: "Juhuu!", sound: "boing" }],
        instead: { caption: "Oben sitzen bleiben", answer: "Hmm, dann kann keiner mehr rutschen. Rutsch lieber runter, dann ist der Nächste dran." },
      },
    ],
    outro: [{ narration: "Super gewartet! Jeder kommt mal dran.", sound: "chime" }],
    endCaption: "Bär, Fuchs und Hase jubeln",
  },
  {
    id: "want",
    emoji: "🚗",
    title: "Haben wollen",
    caption: "Hase spielt mit Auto, Bär will es",
    intro: [{ narration: "Der Hase spielt mit einem tollen Auto." }, { narration: "Der kleine Bär will das Auto auch haben!" }],
    steps: [
      {
        caption: "Fragen",
        beats: [{ narration: "Er fragt:", line: "Darf ich auch mal?" }, { line: "Gleich. Ich spiele noch." }],
        instead: { caption: "Auto wegnehmen", answer: "Hmm, dann ist der Hase traurig. Frag lieber: Darf ich auch mal?" },
      },
      {
        caption: "Warten, Ball spielen",
        beats: [{ narration: "Der kleine Bär wartet. Solange spielt er mit dem Ball.", sound: "boing" }],
        instead: { caption: "Anschreien", answer: "Hmm, Schreien macht den Hasen traurig. Warte lieber und spiel solange mit dem Ball." },
      },
      {
        caption: "Tauschen",
        beats: [{ line: "Jetzt darfst du. Tauschen wir?" }, { line: "Ja! Danke!", sound: "pop" }],
        instead: { caption: "Alles behalten", answer: "Hmm, jetzt hat der Hase gar nichts. Lieber tauschen: Auto gegen Ball." },
      },
    ],
    outro: [{ narration: "Prima! Fragen, warten, tauschen.", sound: "chime" }],
    endCaption: "Bär fährt Auto, Hase hat Ball",
  },
  {
    id: "angry",
    emoji: "😠",
    title: "Selbst wütend",
    caption: "Fuchs stößt Turm um, Bär ist wütend",
    intro: [
      { narration: "Der kleine Bär baut einen hohen Turm." },
      { narration: "Rums! Der Fuchs stößt den Turm um. Der kleine Bär ist sooo wütend. Er will schubsen!", sound: "rumble" },
    ],
    steps: [
      {
        caption: "Stampfen",
        beats: [{ narration: "Aber er stampft lieber. Stampf, stampf!", sound: "rumble" }],
        instead: { caption: "Schubsen", answer: "Hmm, Schubsen tut weh. Lass die Wut lieber raus: Stampf ganz fest!" },
      },
      {
        caption: "Tief pusten",
        beats: [{ narration: "Er atmet tief ein und pustet: Puuuh." }],
        instead: { caption: "Turm umtreten", answer: "Hmm, jetzt weint der Fuchs auch. Puste lieber ganz tief: Puuuh." },
      },
      {
        caption: "„Ich bin wütend!“ sagen",
        beats: [
          { narration: "Dann sagt er:", line: "Ich bin wütend! Mein Turm ist kaputt!" },
          { line: "Oh, Entschuldigung! Ich helfe dir." },
          { sound: "pop" },
        ],
        instead: { caption: "Hauen", answer: "Hmm, Hauen tut weh. Sag lieber: Ich bin wütend!" },
      },
    ],
    outro: [{ narration: "Toll! Wütend sein ist okay. Stampfen, pusten, sagen – nicht hauen.", sound: "chime" }],
    endCaption: "Turm steht wieder, beide lachen",
  },
];
