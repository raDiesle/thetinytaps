import type { TogetherTranslation } from "./pairs";

// Spanish sentences for "Was gehört zusammen?", by the ids of the pairs in pairs.tsx: things "van con" each other,
// helpers "necesitan" their tools. The helpers keep the German ones' gender (la doctora, la peluquera, el cartero).

/** Spanish, for the table of languages in pairs.tsx. */
export const SPANISH: TogetherTranslation = {
  zahnbuerste: {
    name: "Cepillo de dientes",
    partner: "Pasta de dientes",
    question: "¿Qué va con el cepillo de dientes?",
    right: "La pasta de dientes va con el cepillo de dientes. ¡Genial!",
    belongs: "¡La pasta de dientes va con el cepillo de dientes!",
  },
  tuer: {
    name: "Puerta",
    partner: "Llave",
    question: "¿Qué va con la puerta?",
    right: "La llave va con la puerta. ¡Genial!",
    belongs: "¡La llave va con la puerta!",
  },
  topf: {
    name: "Olla",
    partner: "Tapa",
    question: "¿Qué va con la olla?",
    right: "La tapa va con la olla. ¡Genial!",
    belongs: "¡La tapa va con la olla!",
  },
  blume: {
    name: "Flor",
    partner: "Regadera",
    question: "¿Qué va con la flor?",
    right: "La regadera va con la flor. ¡Genial!",
    belongs: "¡La regadera va con la flor!",
  },
  papier: {
    name: "Papel",
    partner: "Crayón",
    question: "¿Qué va con el papel?",
    right: "El crayón va con el papel. ¡Genial!",
    belongs: "¡El crayón va con el papel!",
  },
  feuerwehr: {
    name: "Bombero",
    partner: "Manguera",
    question: "¿Qué necesita el bombero?",
    right: "El bombero necesita la manguera. ¡Genial!",
    belongs: "¡El bombero necesita la manguera!",
  },
  aerztin: {
    name: "Doctora",
    partner: "Estetoscopio",
    question: "¿Qué necesita la doctora?",
    right: "La doctora necesita el estetoscopio. ¡Genial!",
    belongs: "¡La doctora necesita el estetoscopio!",
  },
  baecker: {
    name: "Panadero",
    partner: "Panecillo",
    question: "¿Qué necesita el panadero?",
    right: "El panadero necesita el panecillo. ¡Genial!",
    belongs: "¡El panadero necesita el panecillo!",
  },
  friseurin: {
    name: "Peluquera",
    partner: "Tijeras",
    question: "¿Qué necesita la peluquera?",
    right: "La peluquera necesita las tijeras. ¡Genial!",
    belongs: "¡La peluquera necesita las tijeras!",
  },
  post: {
    name: "Cartero",
    partner: "Paquete",
    question: "¿Qué necesita el cartero?",
    right: "El cartero necesita el paquete. ¡Genial!",
    belongs: "¡El cartero necesita el paquete!",
  },
};
