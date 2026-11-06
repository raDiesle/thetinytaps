// „Gefühle nachmachen“: what it says and its name, apart from „Wie geht's dir?“'s, so the language table's row of each
// game reads its own texts.

import type { Localized } from "@/lib/language";

/** The game's name (C-35, a game of its own since November 2026). German only so far: translations wait for the user. */
export const COPY_TITLE: Localized = { de: "Gefühle nachmachen" };

/** Its line for grown-ups. */
export const COPY_BLURB: Localized = { de: "Gesichter wie der kleine Bär machen" };

/** Said in „Gefühle nachmachen“ while the little bear shows a face big (C-35): the child copies it, for a mirror or the grown-up. */
export const FACE_LINE: Localized = {
  de: "Kannst du auch so gucken?",
  en: "Can you make this face too?",
  zh: "你也能做这个表情吗？",
  hi: "चलो, तुम भी ऐसा चेहरा बनाओ!",
  es: "¿Puedes poner esta cara tú también?",
  ar: "هيّا نصنع هذا الوجه نحن أيضًا!",
  ru: "А ты так можешь?",
};

/** Every line „Gefühle nachmachen“ says, for its recordings. */
export const COPY_LINES: string[] = [FACE_LINE.de];
