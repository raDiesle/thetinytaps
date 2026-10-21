// Little stories from the kindergarten: someone pushes, kicks, grabs, the
// slide is full, someone has the toy you want, or you are angry yourself.
// Each one shows what the little bear can do instead of hitting back:
// say "Stopp!", step away, get a grown-up, ask, wait, swap.

import { GROUND, type Beat } from "./story";

export type SituationId = "push" | "kick" | "grab" | "slide" | "want" | "angry";

/** Where it happens; draws the background and its things (see KitaPlay). */
export type Place = "playground" | "sandbox" | "slide" | "room";

export interface KitaStep {
  emoji: string;
  /** Short, on the button. */
  label: string;
  beats: Beat[];
}

export interface Situation {
  id: SituationId;
  emoji: string;
  title: string;
  place: Place;
  /** How it starts: the first beat sets everyone up, the others show what happens. */
  intro: Beat[];
  steps: KitaStep[];
  /** The not-so-good idea, offered next to the first step when children choose themselves. */
  instead: { emoji: string; label: string; answer: string };
  outro: Beat[];
}

/** Off stage, where the teacher waits until someone gets her. */
const OFF_RIGHT = 118;
/** Standing on top of the slide, and at the end of the chute; see the slide drawing in KitaPlay. */
const SLIDE_TOP = { x: 36, y: 54 };
const SLIDE_END = { x: 66, y: GROUND };
const LADDER = { x: 29, y: GROUND };

export const QUESTION = "Was kann der kleine Bär tun?";

export const SITUATIONS: Situation[] = [
  {
    id: "push",
    emoji: "💥",
    title: "Geschubst",
    place: "playground",
    intro: [
      {
        narration: "Der kleine Bär spielt draußen.",
        cast: {
          bear: { x: 46, mood: "happy", face: "right" },
          fox: { x: 24, mood: "neutral", face: "right" },
          teacher: { x: OFF_RIGHT, face: "left" },
        },
      },
      {
        narration: "Der Fuchs schubst den kleinen Bären. Aua!",
        cast: { fox: { x: 36, pose: "push", mood: "angry" }, bear: { x: 54, pose: "fall", mood: "sad" } },
        sound: "boing",
      },
    ],
    steps: [
      {
        emoji: "✋",
        label: "Stopp! Nein!",
        beats: [
          {
            narration: "Der kleine Bär sagt laut:",
            line: { who: "bear", text: "Stopp! Nein! Ich will das nicht!" },
            cast: { bear: { pose: "stop", mood: "angry", face: "left" }, fox: { pose: "stand", mood: "surprised" } },
          },
        ],
      },
      {
        emoji: "👣",
        label: "Weggehen",
        beats: [
          { narration: "Dann geht er weg. So hat er Abstand.", cast: { bear: { x: 78, pose: "walk", mood: "neutral", face: "right" } } },
          { cast: { bear: { pose: "stand", face: "left" } } },
        ],
      },
      {
        emoji: "🙋",
        label: "Hilfe holen",
        beats: [
          {
            narration: "Er holt die Erzieherin.",
            line: { who: "bear", text: "Der Fuchs hat mich geschubst!" },
            cast: { teacher: { x: 60, pose: "walk" } },
          },
          {
            line: { who: "teacher", text: "Stopp, Fuchs. Schubsen tut weh." },
            cast: { teacher: { pose: "stand", mood: "neutral" } },
          },
          { line: { who: "fox", text: "Entschuldigung, Bär." }, cast: { fox: { mood: "sorry" } } },
        ],
      },
    ],
    instead: { emoji: "👊", label: "Zurückschubsen", answer: "Hmm, dann tut es noch mehr weh. Sag lieber laut: Stopp!" },
    outro: [
      {
        narration: "Super! Stopp sagen, weggehen, Hilfe holen.",
        cast: { bear: { pose: "hop", mood: "joy" }, teacher: { mood: "happy" }, fox: { mood: "happy" } },
        sound: "chime",
      },
    ],
  },
  {
    id: "kick",
    emoji: "🦶",
    title: "Getreten",
    place: "playground",
    intro: [
      {
        narration: "Der kleine Bär und der Fuchs sind draußen.",
        cast: {
          bear: { x: 40, mood: "happy", face: "right" },
          fox: { x: 60, mood: "neutral", face: "left" },
          teacher: { x: OFF_RIGHT, face: "left" },
        },
      },
      {
        narration: "Der Fuchs tritt den kleinen Bären ans Bein. Aua!",
        cast: { fox: { x: 55, pose: "kick", mood: "angry" }, bear: { x: 36, pose: "fall", mood: "sad" } },
        sound: "boing",
      },
    ],
    steps: [
      {
        emoji: "✋",
        label: "Stopp!",
        beats: [
          {
            narration: "Der kleine Bär sagt laut:",
            line: { who: "bear", text: "Stopp! Nicht treten!" },
            cast: { bear: { pose: "stop", mood: "angry" }, fox: { pose: "stand", mood: "surprised" } },
          },
        ],
      },
      {
        emoji: "👣",
        label: "Weggehen",
        beats: [
          { narration: "Er geht ein paar Schritte weg.", cast: { bear: { x: 20, pose: "walk", mood: "neutral", face: "left" } } },
          { cast: { bear: { pose: "stand", face: "right" } } },
        ],
      },
      {
        emoji: "🙋",
        label: "Hilfe holen",
        beats: [
          {
            narration: "Er ruft die Erzieherin.",
            line: { who: "bear", text: "Hilfe! Der Fuchs hat mich getreten." },
            cast: { teacher: { x: 80, pose: "walk" } },
          },
          {
            line: { who: "teacher", text: "Fuchs, Treten tut weh. Das machen wir nicht." },
            cast: { teacher: { pose: "stand" }, fox: { face: "right" } },
          },
          { line: { who: "fox", text: "Entschuldigung." }, cast: { fox: { mood: "sorry", face: "left" } } },
        ],
      },
    ],
    instead: { emoji: "🦶", label: "Zurücktreten", answer: "Hmm, dann tut es beiden weh. Sag lieber laut: Stopp!" },
    outro: [
      {
        narration: "Prima! Stopp sagen, Abstand halten, Hilfe holen.",
        cast: { bear: { pose: "hop", mood: "joy" }, teacher: { mood: "happy" }, fox: { mood: "happy" } },
        sound: "chime",
      },
    ],
  },
  {
    id: "grab",
    emoji: "🚜",
    title: "Weggenommen",
    place: "sandbox",
    intro: [
      {
        narration: "Der kleine Bär spielt mit seinem Traktor.",
        cast: {
          bear: { x: 38, mood: "happy", face: "right", holds: "🚜" },
          fox: { x: 68, mood: "neutral", face: "left" },
        },
      },
      {
        narration: "Da nimmt ihm der Fuchs einfach den Traktor weg!",
        cast: { fox: { x: 52, pose: "reach", mood: "neutral" } },
      },
      {
        cast: { fox: { x: 66, pose: "stand", holds: "🚜" }, bear: { holds: "", mood: "sad" } },
        sound: "pop",
      },
    ],
    steps: [
      {
        emoji: "✋",
        label: "Das ist meins!",
        beats: [
          {
            narration: "Der kleine Bär sagt laut:",
            line: { who: "bear", text: "Stopp! Das ist mein Traktor!" },
            cast: { bear: { pose: "stop", mood: "angry" }, fox: { mood: "surprised" } },
          },
        ],
      },
      {
        emoji: "🤲",
        label: "Zurück, bitte",
        beats: [
          { line: { who: "bear", text: "Gib ihn mir bitte zurück." }, cast: { bear: { pose: "reach", mood: "neutral" } } },
          { line: { who: "fox", text: "Hier. Entschuldigung." }, cast: { fox: { x: 54, pose: "give", mood: "sorry" } } },
          { cast: { fox: { x: 64, pose: "stand", holds: "" }, bear: { pose: "stand", holds: "🚜", mood: "happy" } }, sound: "pop" },
        ],
      },
      {
        emoji: "🤝",
        label: "Mitspielen?",
        beats: [
          { line: { who: "bear", text: "Willst du mitspielen? Du kannst den Eimer haben." } },
          { line: { who: "fox", text: "Au ja!" }, cast: { fox: { x: 60, mood: "joy", holds: "🪣" } } },
        ],
      },
    ],
    instead: { emoji: "😤", label: "Wegreißen", answer: "Hmm, dann zerren beide und es gibt Streit. Sag lieber: Stopp, das ist meins!" },
    outro: [
      {
        narration: "Toll! Und gibt er es nicht zurück, holst du die Erzieherin.",
        cast: { bear: { pose: "hop", mood: "joy" }, fox: { pose: "hop", mood: "joy" } },
        sound: "chime",
      },
    ],
  },
  {
    id: "slide",
    emoji: "🎢",
    title: "Rutsche voll",
    place: "slide",
    intro: [
      {
        narration: "Alle wollen rutschen.",
        cast: {
          bunny: { ...SLIDE_TOP, mood: "happy", face: "right" },
          fox: { ...LADDER, mood: "neutral", face: "right" },
          bear: { x: 4, mood: "happy", face: "right", pose: "walk" },
        },
      },
      {
        narration: "Der kleine Bär will sofort rutschen. Aber die Rutsche ist voll!",
        cast: { bear: { x: 23, pose: "stand", mood: "sad" } },
      },
    ],
    steps: [
      {
        emoji: "🚶",
        label: "Anstellen",
        beats: [
          {
            narration: "Er stellt sich hinten an.",
            line: { who: "bear", text: "Ich bin nach dem Fuchs dran." },
            cast: { bear: { x: 15, mood: "neutral" } },
          },
        ],
      },
      {
        emoji: "⏳",
        label: "Warten",
        beats: [
          { narration: "Er wartet. Erst rutscht der Hase …", cast: { bunny: { ...SLIDE_END, pose: "slide", mood: "joy" } } },
          {
            narration: "… dann der Fuchs.",
            cast: { bunny: { x: 88, pose: "walk" }, fox: { ...SLIDE_TOP }, bear: { ...LADDER, pose: "walk" } },
          },
          { cast: { fox: { ...SLIDE_END, pose: "slide", mood: "joy" }, bear: { pose: "stand" }, bunny: { pose: "stand", face: "left" } } },
          { cast: { fox: { x: 78, pose: "stand", face: "left" } } },
        ],
      },
      {
        emoji: "🥳",
        label: "Jetzt ich!",
        beats: [
          { narration: "Jetzt ist der kleine Bär dran!", cast: { bear: { ...SLIDE_TOP, mood: "happy" } } },
          { line: { who: "bear", text: "Juhuu!" }, cast: { bear: { ...SLIDE_END, pose: "slide", mood: "joy" } }, sound: "boing" },
        ],
      },
    ],
    instead: { emoji: "💥", label: "Vordrängeln", answer: "Hmm, auf der Rutsche kann jemand runterfallen. Lieber hinten anstellen." },
    outro: [
      {
        narration: "Super gewartet! Jeder kommt mal dran.",
        cast: { bear: { x: 58, pose: "hop", mood: "joy" }, fox: { pose: "hop" }, bunny: { pose: "hop" } },
        sound: "chime",
      },
    ],
  },
  {
    id: "want",
    emoji: "🚗",
    title: "Haben wollen",
    place: "playground",
    intro: [
      {
        narration: "Der Hase spielt mit einem tollen Auto.",
        cast: {
          bunny: { x: 62, mood: "joy", face: "left", holds: "🚗" },
          bear: { x: 30, mood: "neutral", face: "right" },
        },
      },
      {
        narration: "Der kleine Bär will das Auto auch haben!",
        cast: { bear: { x: 40, pose: "reach", mood: "sorry" } },
      },
    ],
    steps: [
      {
        emoji: "🗣️",
        label: "Fragen",
        beats: [
          { narration: "Er fragt:", line: { who: "bear", text: "Darf ich auch mal?" }, cast: { bear: { pose: "stand", mood: "neutral" } } },
          { line: { who: "bunny", text: "Gleich. Ich spiele noch." }, cast: { bunny: { mood: "happy" } } },
        ],
      },
      {
        emoji: "⏳",
        label: "Warten",
        beats: [
          {
            narration: "Der kleine Bär wartet. Solange spielt er mit dem Ball.",
            cast: { bear: { x: 30, holds: "⚽", mood: "happy", pose: "hop" } },
            sound: "boing",
          },
          { cast: { bear: { pose: "stand" } } },
        ],
      },
      {
        emoji: "🔄",
        label: "Tauschen",
        beats: [
          { line: { who: "bunny", text: "Jetzt darfst du. Tauschen wir?" }, cast: { bunny: { x: 54 } } },
          { line: { who: "bear", text: "Ja! Danke!" }, cast: { bear: { x: 38, holds: "🚗", mood: "joy" }, bunny: { holds: "⚽" } }, sound: "pop" },
        ],
      },
    ],
    instead: { emoji: "✊", label: "Wegnehmen", answer: "Hmm, dann ist der Hase traurig. Frag lieber: Darf ich auch mal?" },
    outro: [
      {
        narration: "Prima! Fragen, warten, tauschen.",
        cast: { bear: { pose: "hop", mood: "joy" }, bunny: { pose: "hop", mood: "joy" } },
        sound: "chime",
      },
    ],
  },
  {
    id: "angry",
    emoji: "😠",
    title: "Selbst wütend",
    place: "room",
    intro: [
      {
        narration: "Der kleine Bär baut einen hohen Turm.",
        cast: {
          bear: { x: 32, mood: "happy", face: "right" },
          fox: { x: 86, mood: "neutral", face: "left" },
        },
        stage: "tower-up",
      },
      { cast: { fox: { x: 66, pose: "walk" } } },
      {
        narration: "Rums! Der Fuchs stößt den Turm um. Der kleine Bär ist sooo wütend. Er will schubsen!",
        cast: { fox: { pose: "stand", mood: "surprised" }, bear: { mood: "angry", pose: "push" } },
        stage: "tower-down",
        sound: "rumble",
      },
    ],
    steps: [
      {
        emoji: "🦶",
        label: "Stampfen",
        beats: [
          { narration: "Aber er stampft lieber. Stampf, stampf!", cast: { bear: { pose: "stomp" } }, sound: "rumble" },
          { cast: { bear: { pose: "stand" } } },
        ],
      },
      {
        emoji: "💨",
        label: "Tief pusten",
        beats: [
          { narration: "Er atmet tief ein und pustet: Puuuh.", cast: { bear: { pose: "breathe", mood: "sorry" } } },
          { cast: { bear: { pose: "stand", mood: "neutral" } } },
        ],
      },
      {
        emoji: "🗣️",
        label: "Sagen",
        beats: [
          { narration: "Dann sagt er:", line: { who: "bear", text: "Ich bin wütend! Mein Turm ist kaputt!" } },
          { line: { who: "fox", text: "Oh, Entschuldigung! Ich helfe dir." }, cast: { fox: { x: 70, mood: "sorry" } } },
          { stage: "tower-up", cast: { fox: { mood: "happy" }, bear: { mood: "happy" } }, sound: "pop" },
        ],
      },
    ],
    instead: { emoji: "👊", label: "Schubsen", answer: "Hmm, Schubsen tut weh. Lass die Wut lieber raus: Stampf ganz fest!" },
    outro: [
      {
        narration: "Toll! Wütend sein ist okay. Stampfen, pusten, sagen – nicht hauen.",
        cast: { bear: { pose: "hop", mood: "joy" }, fox: { pose: "hop", mood: "joy" } },
        sound: "chime",
      },
    ],
  },
];
