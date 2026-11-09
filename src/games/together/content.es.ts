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
    caption: "Queremos lavarnos los dientes. ¿Qué ponemos en el cepillo?",
  },
  tuer: {
    name: "Puerta",
    partner: "Llave",
    question: "La puerta está cerrada. Queremos entrar.",
    right: "La llave va con la puerta. ¡Genial!",
    belongs: "¡La llave va con la puerta!",
    caption: "La puerta está cerrada. Queremos entrar. ¿Con qué se abre?",
  },
  topf: {
    name: "Olla",
    partner: "Tapa",
    question: "La olla está abierta. Queremos cerrarla.",
    right: "La tapa va con la olla. ¡Genial!",
    belongs: "¡La tapa va con la olla!",
    caption: "La olla está abierta. Queremos cerrarla. ¿Qué le queda bien encima?",
  },
  blume: {
    name: "Flor",
    partner: "Regadera",
    question: "La flor tiene sed.",
    right: "La regadera va con la flor. ¡Genial!",
    belongs: "¡La regadera va con la flor!",
    caption: "La flor tiene sed. ¿Con qué recibe agua?",
  },
  papier: {
    name: "Papel",
    partner: "Crayón",
    question: "Queremos pintar un dibujo.",
    right: "El crayón va con el papel. ¡Genial!",
    belongs: "¡El crayón va con el papel!",
    caption: "Queremos pintar un dibujo. ¿Con qué se pone de colores el papel?",
  },
  feuerwehr: {
    name: "Bombero",
    partner: "Manguera",
    question: "El bombero quiere apagar el fuego.",
    right: "El bombero necesita la manguera. ¡Genial!",
    belongs: "¡El bombero necesita la manguera!",
    caption: "El bombero quiere apagar el fuego. ¿Con qué lanza el agua?",
  },
  aerztin: {
    name: "Doctora",
    partner: "Estetoscopio",
    question: "La doctora quiere escuchar tu corazón.",
    right: "La doctora necesita el estetoscopio. ¡Genial!",
    belongs: "¡La doctora necesita el estetoscopio!",
    caption: "La doctora quiere escuchar tu corazón. ¿Con qué escucha por dentro?",
  },
  baecker: {
    name: "Panadero",
    partner: "Panecillo",
    question: "El panadero quiere hornear algo rico para el desayuno.",
    right: "El panadero necesita el panecillo. ¡Genial!",
    belongs: "¡El panadero necesita el panecillo!",
    caption: "El panadero quiere hornear algo rico para el desayuno. ¿Qué pone después sobre la mesa?",
  },
  friseurin: {
    name: "Peluquera",
    partner: "Tijeras",
    question: "La peluquera quiere cortar el pelo.",
    right: "La peluquera necesita las tijeras. ¡Genial!",
    belongs: "¡La peluquera necesita las tijeras!",
    caption: "La peluquera quiere cortar el pelo. ¿Con qué se hace?",
  },
};
