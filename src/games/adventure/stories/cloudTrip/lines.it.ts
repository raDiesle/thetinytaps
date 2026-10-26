import type { StoryTranslation } from "../story";

// What Tapsi says in „Die Wolkenreise“ in Italian: the lines of lines.ts, step by step.
// The little cloud Wolle is "Batuffolo" (a ball of cotton wool). Words that would change for a boy
// or a girl ("bravo", "pronto") are left out or said for "us".

/** „Die Wolkenreise“ in Italian. */
export const TRANSLATION: StoryTranslation = {
  defaultTurn: "Ora tu!",
  opening: ["Oh! Dov'è il sole?", "Si nasconde dietro la grande nuvola di pioggia.", "Andiamo a prenderlo! Vieni con me?"],
  steps: [
    // 👋
    {
      situation: "Ciao! Sono Tapsi. Ed ecco Batuffolo, la mia nuvoletta!",
      instruction: "Arriva Kiki! Salutiamo con la mano, così!",
      turn: "Saluti anche tu Kiki?",
      again: "Ciao, Kiki!",
      praise: "Kiki vola con noi!",
    },
    // 🐦
    {
      situation: "Batuffolo vuole volare. Lo aiutiamo!",
      instruction: "Sbatti le braccia come un uccellino, così!",
      turn: "Ora tu: sbatti le ali!",
      again: "Su e giù, su e giù, sempre più in alto!",
      praise: "Voliamo altissimo!",
    },
    // ✈️
    {
      situation: "Oh, arrivano degli aeroplanini!",
      instruction: "Quando ne arriva uno, ci abbassiamo, così!",
      turn: "Attenzione! Abbassati!",
      again: "E abbassati ancora!",
      praise: "Gli aeroplanini sono passati tutti.",
    },
    // 🎈
    {
      situation: "Quanti palloncini!",
      instruction: "Li tocchiamo, e pop! Così!",
      turn: "Ora tu: toccali!",
      again: "Pop! E pop!",
      praise: "Quanti coriandoli!",
    },
    // 🪑
    { instruction: "Adesso si va veloci! Siediti con me, così!", praise: "Tieniti forte!" },
    // ⭐
    {
      situation: "Quante stelline!",
      instruction: "Piegati di lato e prendi la stella, così!",
      turn: "Ora tu: piegati di lato!",
      again: "E dall'altra parte!",
      praise: "Abbiamo preso tutte le stelle!",
    },
    // 🧍
    { instruction: "Ecco la nuvola di pioggia! Alzati con me, così!", praise: "Adesso prendiamo il sole!" },
    // 🌧️
    {
      situation: "Qui piove! Il sole è lassù.",
      instruction: "Spingi la nuvola in su con tutte e due le braccia, così!",
      turn: "Ora tu: spingi con me!",
      again: "Su, su, il sole arriva!",
      praise: "Ecco il sole!",
    },
    // 🌈
    {
      situation: "Ora manca solo l'arcobaleno.",
      instruction: "Disegna un grande arco con il braccio, così!",
      turn: "Ora tu: disegna con me!",
      again: "Un altro colore!",
      praise: "Un arcobaleno!",
    },
    // 🙌
    {
      situation: "Il sole sorride!",
      instruction: "Braccia in alto, urrà!",
      turn: "Anche tu, urrà!",
      praise: "Il sole è tornato!",
    },
    // 🏡
    {
      situation: "Batuffolo ci porta a casa.",
      instruction: "Salutiamo con la mano, così!",
      turn: "Saluti con me?",
      again: "Ciao, sole! Ciao, Kiki!",
      praise: "Grazie del viaggio! A presto!",
    },
  ],
};
