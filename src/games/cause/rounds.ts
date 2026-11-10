// The rounds of „Was ist passiert?“: a child shows a feeling with its face and body, and two pictures show what happened.
// Exactly one of them fits the feeling; the other one does not, and the child's figure only shakes its head gently.

import type { MascotKind, MascotMouth } from "@/components/Mascot";
import type { Localized } from "@/lib/language";

/**
 * One picture of what happened: an emoji (a placeholder until its Gemini picture is made), and its question for
 * grown-ups, shown small under it and read out, which they can ask the child for that picture.
 */
export interface CauseOption {
  id: string;
  emoji: string;
  label: Localized;
  /** Exactly one option per round fits the feeling. */
  fits: boolean;
}

/** One round: the child (a fox or a bear, with its grown-up beside it) and its face, then the two pictures. */
export interface CauseRound {
  id: string;
  /** The child's animal; the grown-up beside it is the same animal. */
  kind: MascotKind;
  /** The child's face before the answer: the feeling it shows. */
  before: MascotMouth;
  options: readonly [CauseOption, CauseOption];
}

/** The question under the pictures, the same in every round. */
export const CAUSE_QUESTION: Localized = {
  de: "Was ist passiert?",
  en: "What happened?",
  zh: "发生了什么？",
  hi: "क्या हुआ?",
  es: "¿Qué pasó?",
  ar: "ماذا حدث؟",
  ru: "Что случилось?",
};

export const CAUSE_ROUNDS: readonly CauseRound[] = [
  {
    id: "weint-ballon",
    kind: "fox",
    before: "frown",
    options: [
      {
        id: "ballon",
        emoji: "🎈",
        label: {
          de: "Fliegt der Luftballon weg?",
          en: "Is the balloon flying away?",
          zh: "气球飞走了吗？",
          hi: "क्या गुब्बारा उड़ रहा है?",
          es: "¿Se va volando el globo?",
          ar: "هل يطير البالون بعيدًا؟",
          ru: "Улетает воздушный шарик?",
        },
        fits: true,
      },
      {
        id: "eis",
        emoji: "🍦",
        label: {
          de: "Gibt es ein Eis?",
          en: "Is there ice cream?",
          zh: "有冰淇淋吗？",
          hi: "क्या आइसक्रीम मिलती है?",
          es: "¿Hay helado?",
          ar: "هل هناك مثلّجات؟",
          ru: "Будет мороженое?",
        },
        fits: false,
      },
    ],
  },
  {
    id: "lacht-oma",
    kind: "bear",
    before: "grin",
    options: [
      {
        id: "oma",
        emoji: "👵",
        label: {
          de: "Kommt Oma zu Besuch?",
          en: "Is Grandma coming to visit?",
          zh: "奶奶来看我们了吗？",
          hi: "क्या दादी मिलने आ रही हैं?",
          es: "¿Viene la abuela de visita?",
          ar: "هل تأتي الجدة لزيارتنا؟",
          ru: "Бабушка приходит в гости?",
        },
        fits: true,
      },
      {
        id: "regen",
        emoji: "🌧️",
        label: {
          de: "Regnet es?",
          en: "Is it raining?",
          zh: "下雨了吗？",
          hi: "क्या बारिश हो रही है?",
          es: "¿Está lloviendo?",
          ar: "هل تمطر؟",
          ru: "Идёт дождь?",
        },
        fits: false,
      },
    ],
  },
  {
    id: "wuetend-schaufel",
    kind: "bear",
    before: "frown",
    options: [
      {
        id: "schaufel",
        emoji: "✋🪏",
        label: {
          de: "Nimmt jemand die Schaufel weg?",
          en: "Is someone taking the shovel away?",
          zh: "有人把铲子拿走了吗？",
          hi: "क्या कोई फावड़ा छीन रहा है?",
          es: "¿Alguien le quita la pala?",
          ar: "هل يأخذ أحدٌ المجرفة؟",
          ru: "Кто-то забирает лопатку?",
        },
        fits: true,
      },
      {
        id: "rutschen",
        emoji: "🛝",
        label: {
          de: "Darf es rutschen?",
          en: "Can the little one go down the slide?",
          zh: "可以滑滑梯吗？",
          hi: "क्या फिसलपट्टी पर फिसलने को मिलता है?",
          es: "¿Puede tirarse por el tobogán?",
          ar: "هل يُسمح بالتزحلق؟",
          ru: "Можно покататься с горки?",
        },
        fits: false,
      },
    ],
  },
  {
    id: "erschrickt-hund",
    kind: "fox",
    before: "o",
    options: [
      {
        id: "hund",
        emoji: "🐕",
        label: {
          de: "Bellt ein Hund laut?",
          en: "Is a dog barking loudly?",
          zh: "有狗在大声叫吗？",
          hi: "क्या कोई कुत्ता ज़ोर से भौंक रहा है?",
          es: "¿Ladra fuerte un perro?",
          ar: "هل ينبح كلب بصوت عالٍ؟",
          ru: "Громко лает собака?",
        },
        fits: true,
      },
      {
        id: "schmetterling",
        emoji: "🦋",
        label: {
          de: "Landet ein Schmetterling?",
          en: "Is a butterfly landing?",
          zh: "有蝴蝶落下来了吗？",
          hi: "क्या कोई तितली आकर बैठ रही है?",
          es: "¿Se posa una mariposa?",
          ar: "هل تحطّ فراشة؟",
          ru: "Садится бабочка?",
        },
        fits: false,
      },
    ],
  },
];
