// Zu Hause in Spanish: the words of bear.ts, by id. The bear is „Osito“ (a he, so
// what is said about him may be masculine: „contento“, „tranquilo“); nothing is said
// about the child that depends on boy or girl. Latin American Spanish, „tú“ for the child.

import type { ComfortId, FeelingId } from "./bear";
import type { ComfortText, FeelingText } from "./localized";

/** The kind things in Spanish. */
export const COMFORTS_ES: Partial<Record<ComfortId, ComfortText>> = {
  stroke: { caption: "Acariciar", narration: "Acaricias a Osito. Muy suavecito." },
  hug: { caption: "Abrazar", narration: "Abrazas fuerte a Osito." },
  teddy: { caption: "Dar un peluche", narration: "Le das a Osito un peluche para abrazar." },
  stomp: { caption: "Zapatear", narration: "¡Pum, pum! Que salga el enojo." },
  blow: { caption: "Soplar hondo", narration: "Respira hondo … y sopla: Fuuu." },
  blanket: { caption: "Arropar", narration: "Arropas a Osito. Bien calientito." },
  lullaby: { caption: "Cantar una canción de cuna", narration: "Cantas bajito una canción de cuna." },
  hand: { caption: "Tomarle la patita", narration: "Le tomas la patita. Estás a su lado." },
  light: { caption: "Encender la luz", narration: "Enciendes la luz. Ahora hay luz." },
  dance: { caption: "Bailar juntos", narration: "Bailas con Osito. ¡Salta, salta!" },
  streamers: { caption: "Lanzar serpentinas", narration: "Lanzas serpentinas de colores. ¡Hurra!" },
};

/** The bear's feelings in Spanish. */
export const FEELINGS_ES: Partial<Record<FeelingId, FeelingText>> = {
  sad: {
    title: "Triste, llora",
    questions: ["Osito está triste y llora. ¿Qué haces tú?", "Osito sigue triste. ¿Qué haces tú?", "Osito todavía está un poquito triste. ¿Qué haces tú?"],
    intro: "Osito está triste. Llora.",
    instead: [
      { caption: "Empujar", answer: "Mmm, empujar duele. Mejor abrázalo." },
      { caption: "Romper el juguete", answer: "Mmm, ahora su juguete está roto. Mejor acarícialo." },
      { caption: "Quitarle los bloques", answer: "Mmm, ahora Osito llora todavía más. Mejor dale su peluche." },
    ],
    end: { narration: "¡Osito está contento otra vez!", line: "¡Gracias!" },
    endCaption: "Contento otra vez",
  },
  angry: {
    title: "Enojo, la torre se cayó",
    questions: [
      "La torre se cayó y Osito está enojado. ¿Qué puede hacer él?",
      "Osito sigue enojado. ¿Qué puede hacer él?",
      "Osito todavía está un poquito enojado. ¿Qué haces tú?",
    ],
    intro: "¡Osito está enojado! Su torre se cayó.",
    instead: [
      { caption: "Tirar juguetes", answer: "Mmm, si tiras las cosas, se rompen. Mejor saca el enojo: ¡zapatea fuerte!" },
      { caption: "Gritar fuerte", answer: "Mmm, con los gritos el enojo se hace más grande. Mejor sopla hondo: Fuuu." },
      { caption: "Pegar", answer: "Mmm, pegar duele. Mejor abrázalo." },
    ],
    end: { narration: "El enojo se fue. Osito está tranquilo otra vez.", line: "¡Gracias!" },
    endCaption: "Tranquilo otra vez",
  },
  tired: {
    title: "Sueño por la noche",
    questions: ["Osito tiene sueño y bosteza. ¿Qué haces tú?", "Osito sigue despierto. ¿Qué haces tú?", "Osito ya casi se duerme. ¿Qué haces tú?"],
    intro: "Osito tiene sueño. Bosteza.",
    instead: [
      { caption: "Quitar la manta", answer: "Mmm, sin manta Osito tiene frío. Mejor arrópalo." },
      { caption: "Tocar fuerte el tambor", answer: "Mmm, con tanto ruido Osito no puede dormir. Mejor guarda silencio." },
      { caption: "Enseñar la tableta", answer: "Mmm, la luz de la pantalla despierta otra vez a Osito. Mejor dale su peluche." },
    ],
    end: { narration: "Osito se duerme feliz. ¡Buenas noches!", line: "Buenas noches …" },
    endCaption: "Se duerme",
  },
  scared: {
    title: "Miedo a la tormenta",
    questions: ["Truena y Osito tiene miedo. ¿Qué haces tú?", "Osito todavía tiene miedo. ¿Qué haces tú?", "Está muy oscuro. ¿Qué haces tú?"],
    intro: "Osito tiene miedo. ¡Truena!",
    instead: [
      { caption: "Decir «¡Bu!»", answer: "Mmm, ahora Osito tiene todavía más miedo. Mejor abrázalo." },
      { caption: "Dejarlo a solas", answer: "Mmm, a solas Osito tiene todavía más miedo. Mejor tómale la patita." },
      { caption: "Apagar la luz", answer: "Mmm, a oscuras Osito tiene todavía más miedo. Mejor enciende la luz." },
    ],
    end: { narration: "La tormenta pasó. ¡Osito se ríe otra vez!", line: "¡Gracias!" },
    endCaption: "Contento otra vez",
  },
  happy: {
    title: "Alegría, cumpleaños",
    questions: ["¡Es el cumpleaños de Osito! ¿Cómo celebras tú con él?", "Osito sigue de fiesta. ¿Qué haces tú?", "Osito está muy contento. ¿Qué haces tú?"],
    intro: "¡Es el cumpleaños de Osito! Está muy contento.",
    question: "¿Cómo celebras tú con él?",
    instead: [
      { caption: "Reventar el globo", answer: "Mmm, ahora su globo se reventó. Mejor baila con él." },
      { caption: "Quitarle el regalo", answer: "Mmm, es su regalo. Ahora Osito está triste. Mejor celebra con él." },
      { caption: "Quitarle el pastel", answer: "Mmm, es su pastel de cumpleaños. Ahora Osito está triste. Mejor celebra con él." },
    ],
    end: { narration: "¡Qué cumpleaños tan bonito!", line: "¡Gracias! ¡Fue genial!" },
    endCaption: "Fiesta de cumpleaños",
  },
};
