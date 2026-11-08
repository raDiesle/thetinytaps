import type { TogetherTranslation } from "./pairs";

// Spanish sentences for "Was gehört zusammen?", by the ids of the pairs in pairs.tsx: things "van con" each other,
// helpers "necesitan" their tools. The helpers keep the German ones' gender (la doctora, la peluquera, el cartero).

/** Spanish, for the table of languages in pairs.tsx. */
export const SPANISH: TogetherTranslation = {
  zahnbuerste: {
    name: "Cepillo de dientes",
    partner: "Pasta de dientes",
    question: "Queremos lavarnos los dientes.",
    right: "La pasta de dientes va con el cepillo de dientes. ¡Genial!",
    belongs: "¡La pasta de dientes va con el cepillo de dientes!",
  },
  tuer: {
    name: "Puerta",
    partner: "Llave",
    question: "La puerta está cerrada. Queremos entrar.",
    right: "La llave va con la puerta. ¡Genial!",
    belongs: "¡La llave va con la puerta!",
  },
  topf: {
    name: "Olla",
    partner: "Tapa",
    question: "La olla está abierta. Queremos cerrarla.",
    right: "La tapa va con la olla. ¡Genial!",
    belongs: "¡La tapa va con la olla!",
  },
  blume: {
    name: "Flor",
    partner: "Regadera",
    question: "La flor tiene sed.",
    right: "La regadera va con la flor. ¡Genial!",
    belongs: "¡La regadera va con la flor!",
  },
  papier: {
    name: "Papel",
    partner: "Crayón",
    question: "Queremos pintar un dibujo.",
    right: "El crayón va con el papel. ¡Genial!",
    belongs: "¡El crayón va con el papel!",
  },
  feuerwehr: {
    name: "Bombero",
    partner: "Manguera",
    question: "El bombero quiere apagar el fuego.",
    right: "El bombero necesita la manguera. ¡Genial!",
    belongs: "¡El bombero necesita la manguera!",
  },
  aerztin: {
    name: "Doctora",
    partner: "Estetoscopio",
    question: "La doctora quiere escuchar tu corazón.",
    right: "La doctora necesita el estetoscopio. ¡Genial!",
    belongs: "¡La doctora necesita el estetoscopio!",
  },
  baecker: {
    name: "Panadero",
    partner: "Panecillo",
    question: "El panadero quiere hornear algo rico para el desayuno.",
    right: "El panadero necesita el panecillo. ¡Genial!",
    belongs: "¡El panadero necesita el panecillo!",
  },
  friseurin: {
    name: "Peluquera",
    partner: "Tijeras",
    question: "La peluquera quiere cortar el pelo.",
    right: "La peluquera necesita las tijeras. ¡Genial!",
    belongs: "¡La peluquera necesita las tijeras!",
  },
};
