import type { StoryTranslation } from "../story";

// What Tapsi says in „Die Wolkenreise“ in Spanish: the lines of lines.ts, step by step.
// The little cloud Wolle is "Pelusa" (a bit of fluff). Nothing that changes for a boy or a girl ("listo", "lista").

/** „Die Wolkenreise“ in Spanish. */
export const TRANSLATION: StoryTranslation = {
  title: "El viaje en nube",
  defaultTurn: "¡Ahora tú!",
  opening: ["¡Oh! ¿Dónde está el sol?", "Está escondido detrás de la gran nube de lluvia.", "¡Vamos a sacarlo! ¿Vienes conmigo?"],
  steps: [
    // 👋
    {
      name: "Saludar a Kiki",
      situation: "¡Hola! Soy Tapsi. ¡Y esta es Pelusa, mi nubecita!",
      instruction: "¡Ahí viene Kiki! Saludamos con la mano, ¡así!",
      turn: "¿Saludas tú también a Kiki?",
      again: "¡Hola, Kiki!",
      praise: "¡Kiki vuela con nosotros!",
    },
    // 🐦
    {
      name: "Aletear como un pájaro",
      situation: "Pelusa quiere volar. ¡La ayudamos!",
      instruction: "Aletea con los brazos, como un pájaro, ¡así!",
      turn: "Ahora tú: ¡aletea!",
      again: "Aletea, aletea, ¡arriba, arriba!",
      praise: "¡Volamos muy alto!",
    },
    // ✈️
    {
      name: "Agacharse bajo los aviones",
      situation: "¡Oh, vienen avioncitos!",
      instruction: "Cuando viene uno, nos agachamos, ¡así!",
      turn: "¡Cuidado! ¡Agáchate!",
      again: "¡Y otra vez, agáchate!",
      praise: "Ya pasaron todos los avioncitos.",
    },
    // 🎈
    {
      name: "Tocar los globos",
      situation: "¡Cuántos globos!",
      instruction: "Los tocamos, ¡y pop! ¡Así!",
      turn: "Ahora tú: ¡tócalos!",
      again: "¡Pop! ¡Y pop!",
      praise: "¡Cuánto confeti!",
    },
    // 🪑
    { name: "Sentarse", instruction: "¡Ahora vamos rápido! Siéntate conmigo, ¡así!", praise: "¡Agárrate fuerte!" },
    // ⭐
    {
      name: "Inclinarse en las curvas por estrellas",
      situation: "¡Cuántas estrellas!",
      instruction: "Inclínate a un lado y agarra la estrella, ¡así!",
      turn: "Ahora tú: ¡inclínate a un lado!",
      again: "¡Y al otro lado!",
      praise: "¡Tenemos todas las estrellas!",
    },
    // 🧍
    { name: "Levantarse", instruction: "¡Ahí está la nube de lluvia! Levántate conmigo, ¡así!", praise: "¡Ahora sacamos el sol!" },
    // 🌧️
    {
      name: "Empujar la nube de lluvia",
      situation: "¡Aquí llueve! El sol está allá arriba.",
      instruction: "Empuja la nube hacia arriba con los dos brazos, ¡así!",
      turn: "Ahora tú: ¡empuja conmigo!",
      again: "Arriba, arriba, ¡ya sale el sol!",
      praise: "¡Ahí está el sol!",
    },
    // 🌈
    {
      name: "Pintar un arcoíris",
      situation: "Ahora solo falta el arcoíris.",
      instruction: "Pinta un gran arco con el brazo, ¡así!",
      turn: "Ahora tú: ¡pinta conmigo!",
      again: "¡Otro color!",
      praise: "¡Un arcoíris!",
    },
    // 🙌
    {
      name: "¡Hurra!",
      situation: "¡El sol sonríe!",
      instruction: "Brazos arriba, ¡hurra!",
      turn: "¡Tú también, hurra!",
      praise: "¡El sol ha vuelto!",
    },
    // 🏡
    {
      name: "Decir adiós",
      situation: "Pelusa nos lleva a casa.",
      instruction: "Decimos adiós con la mano, ¡así!",
      turn: "¿Dices adiós conmigo?",
      again: "¡Adiós, sol! ¡Adiós, Kiki!",
      praise: "¡Gracias por volar conmigo! ¡Hasta pronto!",
    },
  ],
};
