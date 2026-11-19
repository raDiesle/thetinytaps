import type { StoryTranslation } from "../story";

// What Tapsi says in „Fire Rescue“ in Spanish: the English lines of lines.ts, step by step (translated on request,
// 19 November 2026). Robo, the hover robot, keeps its name. Nothing that changes for a boy or a girl ("listo", "lista").

/** „Fire Rescue“ in Spanish. */
export const TRANSLATION: StoryTranslation = {
  title: "Rescate de bomberos",
  defaultTurn: "¡Ahora tú!",
  opening: ["¡Oh! ¡Mira, sale humo allí!", "Y hay gatitos arriba en el tejado.", "¡Vamos a ayudar! ¿Vienes conmigo?"],
  steps: [
    // 👋
    {
      name: "Saludar a Kiki",
      situation: "¡Hola! Soy Tapsi. ¡Y este es Robo, mi robot volador!",
      instruction: "¡Ahí viene Kiki! Saludamos con la mano, ¡así!",
      turn: "¿Saludas tú también a Kiki?",
      again: "¡Hola, Kiki!",
      praise: "¡Kiki viene con nosotros!",
    },
    // 🔔
    {
      name: "Tocar la campana de bomberos",
      situation: "La puerta está cerrada. ¡Tocamos la campana de bomberos!",
      instruction: "Estira los brazos bien arriba y tira hacia abajo, ¡así!",
      turn: "Ahora tú: ¡tira!",
      again: "¡Din, don! ¡La puerta sube!",
      praise: "La puerta está abierta. ¡En marcha!",
    },
    // 👕
    {
      name: "Agacharse bajo los tendederos",
      situation: "Robo vuela por la calle. ¡Mira, tendederos!",
      instruction: "Cuando viene uno, nos agachamos, ¡así!",
      turn: "¡Cuidado! ¡Agáchate!",
      again: "¡Y otra vez, agáchate!",
      praise: "¡Ya pasamos!",
    },
    // 💧
    {
      name: "Bombear el agua",
      situation: "Robo necesita agua para la manguera. ¡Mira, una fuente!",
      instruction: "Agarra la palanca y empújala hacia abajo, ¡así!",
      turn: "Ahora tú: ¡bombea!",
      again: "¡Glu, glu! ¡Entra el agua!",
      praise: "¡Los tanques de Robo están llenos!",
    },
    // 💦
    {
      name: "Apagar el humo con agua",
      situation: "¡Ahí está la casa con el humo!",
      instruction: "Agarra la manguera y echa agua: ¡a la izquierda y a la derecha! ¡Así!",
      turn: "Ahora tú: ¡echa el agua!",
      again: "¡Pssss! ¡El humo se va!",
      praise: "¡Ya no queda humo!",
    },
    // 🐱
    {
      name: "Atrapar a los gatitos",
      situation: "Los gatitos están arriba en el tejado. ¡Robo sube volando!",
      instruction: "Abre los brazos y atrapa, ¡así!",
      turn: "Ahí viene un gatito: ¡atrápalo!",
      again: "¡Y otro más!",
      praise: "¡Todos los gatitos están a salvo!",
    },
    // 🎉
    {
      name: "¡Hurra!",
      situation: "¡Lo logramos!",
      instruction: "Brazos arriba, ¡hurra!",
      turn: "¡Tú también, hurra!",
      praise: "¡Hurra por los bomberos!",
    },
    // 👋
    {
      name: "Decir adiós",
      situation: "Robo lleva a los gatitos a casa.",
      instruction: "Decimos adiós con la mano, ¡así!",
      turn: "¿Dices adiós conmigo?",
      again: "¡Adiós, gatitos! ¡Adiós, Kiki!",
      praise: "¡Gracias por ayudar! ¡Hasta pronto!",
    },
  ],
};
