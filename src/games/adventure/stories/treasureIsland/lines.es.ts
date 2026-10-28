import type { StoryTranslation } from "../story";

// What Tapsi says in „Die Schatzinsel“ in Spanish: the lines of lines.ts, step by step.

/** „Die Schatzinsel“ in Spanish. */
export const TRANSLATION: StoryTranslation = {
  title: "La isla del tesoro",
  defaultTurn: "¡Ahora tú!",
  opening: ["¡Mira, allí está la Isla del Tesoro!", "¡Y allí hay un tesoro!", "¿Vienes conmigo?"],
  steps: [
    // 👋
    {
      name: "Saludar a Kiki",
      situation: "¡Ahoy! Soy Tapsi. ¡Y aquí viene Kiki, mi loro!",
      instruction: "Saludo a Kiki con la mano, ¡así!",
      turn: "¿Saludas tú también a Kiki?",
      again: "¡Hola, Kiki!",
      praise: "¡Kiki está feliz de que estés aquí!",
    },
    // 🎣
    {
      name: "Lanzar la caña",
      situation: "¡Ahora vamos a pescar!",
      instruction: "Atrás, por encima del hombro, y ¡a lanzar lejos, así!",
      turn: "Ahora tú: ¡lanza la caña!",
      again: "Atrás, y ¡plaf!",
      praise: "¡Cuántos peces!",
    },
    // 🪑
    { name: "Sentarse", instruction: "Siéntate conmigo, ¡así!", praise: "¡Nos vamos!" },
    // 🛶
    {
      name: "Remar",
      situation: "¡Ole se va nadando a la Isla del Tesoro!",
      instruction: "Mira: el remo al agua por la derecha, y por la izquierda.",
      turn: "¡Rema conmigo!",
      again: "Rema, rema, ¡la isla está más cerca!",
      praise: "¡Llegamos! Ole está en la playa.",
    },
    // 🧍
    { name: "Levantarse", instruction: "¡Estamos en la isla! Levántate conmigo, ¡así!", praise: "¡Seguimos!" },
    // 🦂
    {
      name: "Pisotear a los escorpiones",
      situation: "¡Uy! ¡Hay escorpiones encima de Ole!",
      instruction: "El pie arriba, y ¡a pisar fuerte y rápido, así!",
      turn: "Ahora tú: ¡pisa fuerte!",
      again: "Pisa, pisa, ¡plop!",
      praise: "¡Ya no hay escorpiones!",
    },
    // 🌉
    {
      name: "Saltar por el puente",
      situation: "¡Un puentecito! Y arriba flotan muchas cajas.",
      instruction: "¡Hop! Y con la cabeza a la caja, ¡pum!",
      turn: "Ahora tú: ¡salta conmigo!",
      again: "¡Hop, pum! ¡Hop, pum!",
      praise: "¡Al otro lado! ¡Muchas estrellas doradas!",
    },
    // 🪵
    {
      name: "Agacharse bajo el tronco",
      situation: "¡Cuidado! Allí arriba se balancea un tronco.",
      instruction: "Cuando viene, nos agachamos, ¡así!",
      turn: "¡Ya viene! ¡Agáchate!",
      again: "¡Y otra vez abajo!",
      praise: "¡Uf, el tronco ya pasó!",
    },
    // 🥁
    {
      name: "Tocar el tambor",
      situation: "¡Oh, hay muchos pájaros en el camino! Y allí cuelgan dos tambores.",
      instruction: "Izquierda, ¡pum! Y derecha, ¡pum! ¡Así!",
      turn: "Ahora tú: ¡toca el tambor!",
      again: "Pum, pum, ¡los pájaros se van volando!",
      praise: "¡El camino está libre!",
    },
    // ⚙️
    {
      name: "Girar la manivela",
      situation: "¡Una puerta! Y allí hay una manivela.",
      instruction: "Giramos la manivela, vuelta y vuelta, ¡así!",
      turn: "Ahora tú: ¡gira conmigo!",
      again: "Vuelta y vuelta, ¡la puerta sube!",
      praise: "¡La puerta está abierta!",
    },
    // 🥥
    {
      name: "Paso al lado",
      situation: "¡Oh, el mono tira cocos! Ruedan justo hacia nosotros.",
      instruction: "Un paso grande al lado, y de vuelta. ¡Así!",
      turn: "¡Un coco! ¡Paso grande al lado!",
      again: "¡Y otra vez a un lado!",
      praise: "Todos los cocos pasaron rodando.",
    },
    // 🦵
    {
      name: "Pierna arriba, coco por debajo",
      situation: "¡Ahora ruedan por la izquierda!",
      instruction: "La pierna arriba, el coco pasa por debajo. ¡Así!",
      turn: "Ahora tú: ¡pierna arriba!",
      again: "¡Pierna arriba!",
      praise: "¡Por debajo! Genial.",
    },
    // 🦶
    {
      name: "Piernas abiertas, coco por en medio",
      situation: "¡Y ahora vienen por el medio!",
      instruction: "Las piernas bien abiertas, el coco pasa. ¡Así!",
      turn: "Ahora tú: ¡piernas abiertas!",
      again: "¡Piernas abiertas!",
      praise: "¡Entre las piernas! Los monos se ríen.",
    },
    // 🐒
    {
      name: "Esquivar los cocos",
      situation: "¡Oh, monos! ¡Tiran cocos!",
      instruction: "Nos apartamos muy despacio, a un lado, ¡así!",
      turn: "Ahora tú: ¡apártate!",
      again: "¡Y al otro lado!",
      praise: "¡Fallaron! Los monos aplauden.",
    },
    // 🍎
    {
      name: "Coger una manzana",
      situation: "¡Un manzano! Y allí hay una cesta.",
      instruction: "Nos estiramos muy alto y recogemos, ¡así!",
      turn: "Ahora tú: ¡recoge una manzana!",
      again: "Arriba, y ¡plof, a la cesta!",
      praise: "¡La cesta está llena!",
    },
    // 🧩
    {
      name: "Adivinanza con dibujos",
      situation: "Una puerta con tres dibujos. ¡Una adivinanza!",
      instruction: "Imitamos los dibujos. Primero muy alto, ¡así!",
      turn: "Ahora tú: ¡muy alto!",
      more: ["¡Y ahora muy ancho, como una estrella!", "¡Y ahora muy pequeño!", "Otra vez desde el principio: ¡muy alto!", "¡Muy ancho!", "¡Y muy pequeño!"],
      praise: "¡Adivinanza resuelta! La puerta se abre.",
    },
    // 🕸️
    {
      name: "Apartar las telarañas",
      situation: "¡Oh, cuántas telarañas! Así no podemos pasar.",
      instruction: "La pata arriba, y ¡a apartarlas lejos, a un lado, así!",
      turn: "Ahora tú: ¡apártalas conmigo!",
      again: "Izquierda, y derecha, ¡fuera!",
      praise: "¡El camino está libre! La araña saluda.",
    },
    // 🪢
    {
      name: "Tirar del cofre con la cuerda",
      situation: "¡Ahí flota el cofre del tesoro!",
      instruction: "Tiramos de la cuerda, una mano tras otra, ¡así!",
      turn: "¡Tira conmigo!",
      again: "Tira, tira, ¡ya viene!",
      praise: "¡El cofre está aquí!",
    },
    // 🔑
    {
      name: "Girar la llave",
      situation: "¡Oh, un candado! Kiki trae la llave.",
      instruction: "La levanto, la meto y la giro, ¡así!",
      turn: "Ahora tú: ¡gira la llave!",
      again: "¡Clic! Y otra vez.",
      praise: "¡El candado está abierto!",
    },
    // 💰
    {
      name: "Lanzar el oro",
      situation: "¡Oh! ¡Oro! Los cangrejos nos traen el cofre. ¡Me bajo de un salto!",
      instruction: "Metemos las manos hasta el fondo, y ¡lanzamos las monedas arriba! ¡Así!",
      turn: "Ahora tú: ¡mete las manos y lanza!",
      again: "Mete las manos, ¡lanza arriba!",
      praise: "¡Una lluvia de oro!",
    },
    // 🙌
    {
      name: "¡Hurra!",
      situation: "¡Encontramos el tesoro!",
      instruction: "¡Brazos arriba, hurra!",
      turn: "Tú también: ¡hurra!",
      again: "¡Hurra, un tesoro!",
      praise: "¡Cuánto oro! ¡Somos ricos!",
    },
    // 🌅
    {
      name: "Decir adiós",
      situation: "El sol se pone.",
      instruction: "Digo adiós a Kiki con la mano, ¡así!",
      turn: "¿Dices adiós tú también?",
      again: "¡Adiós, Kiki! ¡Adiós, isla!",
      praise: "¡Gracias por jugar conmigo! ¡Hasta pronto!",
    },
  ],
};
