// Im Kindergarten in Spanish: the words of kita.ts, by story id, beat for beat and
// step for step (the sounds stay the German beats'). Osito the bear, Zorrito the fox,
// Conejito the hare, Erizo the hedgehog, la maestra, and el oso grande who brings Osito;
// „Stopp!“ is „¡Alto!“. Latin American Spanish. Nothing is said about the child that
// depends on boy or girl (the bear's own line is „¡Me enojé!“, which the child is asked to say too).

import type { SituationId } from "./kita";
import type { SituationText } from "./localized";

/** The kindergarten stories in Spanish. */
export const SITUATIONS_ES: Partial<Record<SituationId, SituationText>> = {
  push: {
    title: "Un empujón",
    caption: "Zorrito empuja a Osito",
    intro: [{ narration: "Osito juega afuera." }, { narration: "Zorrito empuja a Osito. ¡Ay!" }],
    steps: [
      {
        caption: "Decir «¡Alto!»",
        question: "Zorrito empuja a Osito. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito dice fuerte:", line: "¡Alto! ¡No! ¡No quiero eso!" }],
        instead: { caption: "Empujar también", answer: "Mmm, así duele todavía más. Mejor di fuerte: ¡Alto!" },
      },
      {
        caption: "Alejarse",
        question: "Zorrito sigue ahí. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Luego se aleja. Así hay espacio entre los dos." }],
        instead: { caption: "Tirar arena", answer: "Mmm, la arena en los ojos duele. Mejor aléjate." },
      },
      {
        caption: "Buscar a la maestra",
        question: "Osito necesita ayuda. ¿Qué puede hacer él?",
        beats: [{ narration: "Va a buscar a la maestra.", line: "¡Zorrito me empujó!" }, { line: "Alto, Zorrito. Empujar duele." }, { line: "Perdón, Osito." }],
        instead: { caption: "Romper el balde", answer: "Mmm, ahora el balde está roto y Zorrito llora. Mejor busca ayuda." },
      },
    ],
    outro: [{ narration: "¡Súper! Decir alto, alejarse, buscar ayuda." }],
    endCaption: "Osito y Zorrito están contentos otra vez",
  },
  kick: {
    title: "Una patada",
    caption: "Zorrito patea a Osito",
    intro: [{ narration: "Osito y Zorrito están afuera." }, { narration: "Zorrito le da una patada a Osito en la pierna. ¡Ay!" }],
    steps: [
      {
        caption: "Decir «¡Alto!»",
        question: "Zorrito patea a Osito. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito dice fuerte:", line: "¡Alto! ¡No patees!" }],
        instead: { caption: "Patear también", answer: "Mmm, así les duele a los dos. Mejor di fuerte: ¡Alto!" },
      },
      {
        caption: "Alejarse",
        question: "Zorrito sigue ahí. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Se aleja unos pasos." }],
        instead: { caption: "Jalar la oreja", answer: "Mmm, jalar también duele. Mejor aléjate." },
      },
      {
        caption: "Llamar a la maestra",
        question: "Osito necesita ayuda. ¿Qué puede hacer él?",
        beats: [
          { narration: "Llama a la maestra.", line: "¡Ayuda! Zorrito me pateó." },
          { line: "Zorrito, patear duele. Eso no se hace." },
          { line: "Perdón." },
        ],
        instead: { caption: "Tirar la gorra", answer: "Mmm, así Zorrito se pone triste y se pelean. Mejor llama a la maestra." },
      },
    ],
    outro: [{ narration: "¡Muy bien! Decir alto, alejarse, buscar ayuda." }],
    endCaption: "Osito y Zorrito están contentos otra vez",
  },
  grab: {
    title: "Se lo quitaron",
    caption: "Zorrito le quita el tractor",
    intro: [{ narration: "Osito juega con su tractor." }, { narration: "¡Y de repente Zorrito le quita el tractor!" }, {}],
    steps: [
      {
        caption: "Decir «¡Es mío!»",
        question: "Zorrito le quita el tractor. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito dice fuerte:", line: "¡Alto! ¡Es mi tractor!" }],
        instead: { caption: "Arrebatar el tractor", answer: "Mmm, así los dos jalan y se pelean. Mejor di: ¡Alto, es mío!" },
      },
      {
        caption: "Pedir el tractor",
        question: "Zorrito todavía tiene el tractor. ¿Qué puede hacer Osito?",
        beats: [{ line: "Devuélvemelo, por favor." }, { line: "Toma. Perdón." }, {}],
        instead: { caption: "Pegar", answer: "Mmm, pegar duele. Mejor di: Devuélvemelo, por favor." },
      },
      {
        caption: "Jugar juntos",
        question: "Osito tiene otra vez su tractor. ¿Qué puede hacer él?",
        beats: [{ line: "¿Quieres jugar conmigo? Puedes usar el balde." }, { line: "¡Sí!" }],
        instead: { caption: "Echarlo", answer: "Mmm, ahora Zorrito está a solas y triste. Mejor pregunta: ¿Quieres jugar conmigo?" },
      },
    ],
    outro: [{ narration: "¡Genial! Y si no lo devuelve, llamas a la maestra." }],
    endCaption: "Osito levanta el tractor, Zorrito aplaude",
  },
  slide: {
    title: "Tobogán lleno",
    caption: "El tobogán está lleno, Osito quiere bajar ya",
    intro: [{ narration: "Todos quieren bajar por el tobogán." }, { narration: "Osito quiere bajar ya mismo. ¡Pero el tobogán está lleno!" }],
    steps: [
      {
        caption: "Hacer fila",
        question: "El tobogán está lleno. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Se pone al final de la fila.", line: "Voy después de Zorrito." }],
        instead: { caption: "Colarse", answer: "Mmm, en el tobogán alguien se puede caer. Mejor haz fila." },
      },
      {
        caption: "Esperar",
        question: "Osito está en la fila. ¿Qué puede hacer él?",
        beats: [{ narration: "Espera. Primero baja Conejito …" }, { narration: "… luego Zorrito." }],
        instead: { caption: "Gritar y patalear", answer: "Mmm, gritar no lo hace más rápido. Mejor espera, ya casi es tu turno." },
      },
      {
        caption: "Bajar por el tobogán",
        question: "Es el turno de Osito. ¿Qué puede hacer él?",
        beats: [{ narration: "¡Ahora le toca a Osito!" }, { line: "¡Yupiii!" }],
        instead: { caption: "Quedarse arriba", answer: "Mmm, así nadie más puede bajar. Mejor baja, y luego le toca al siguiente." },
      },
    ],
    outro: [{ narration: "¡Súper, qué bien esperar! A todos les llega su turno." }],
    endCaption: "Osito, Zorrito y Conejito festejan",
  },
  want: {
    title: "Lo quiero",
    caption: "Conejito juega con un carrito, Osito lo quiere",
    intro: [{ narration: "Conejito juega con un carrito genial." }, { narration: "¡Osito también quiere el carrito!" }],
    steps: [
      {
        caption: "Preguntar",
        question: "Osito quiere el carrito. ¿Qué puede hacer él?",
        beats: [{ narration: "Pregunta:", line: "¿Me lo prestas?" }, { line: "En un ratito. Todavía estoy jugando." }],
        instead: { caption: "Quitar el carrito", answer: "Mmm, así Conejito se pone triste. Mejor pregunta: ¿Me lo prestas?" },
      },
      {
        caption: "Esperar, jugar a la pelota",
        question: "Conejito sigue jugando. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito espera. Mientras, juega con la pelota." }],
        instead: { caption: "Gritarle", answer: "Mmm, los gritos ponen triste a Conejito. Mejor espera y, mientras, juega con la pelota." },
      },
      {
        caption: "Cambiar",
        question: "Osito tiene la pelota. ¿Qué puede hacer él?",
        beats: [{ line: "Ahora sí te toca. ¿Cambiamos?" }, { line: "¡Sí! ¡Gracias!" }],
        instead: { caption: "Quedarse con todo", answer: "Mmm, ahora Conejito no tiene nada. Mejor cambiar: el carrito por la pelota." },
      },
    ],
    outro: [{ narration: "¡Muy bien! Preguntar, esperar, cambiar." }],
    endCaption: "Osito maneja el carrito, Conejito tiene la pelota",
  },
  angry: {
    title: "Osito se enoja",
    caption: "Zorrito tumba la torre, Osito está enojado",
    intro: [{ narration: "Osito construye una torre alta." }, { narration: "¡Pum! Zorrito tumba la torre. Osito está muuuy enojado. ¡Quiere empujar!" }],
    steps: [
      {
        caption: "Zapatear",
        question: "Osito está enojado. ¿Qué puede hacer él?",
        beats: [{ narration: "Pero mejor zapatea. ¡Pum, pum!" }],
        instead: { caption: "Empujar", answer: "Mmm, empujar duele. Mejor saca el enojo: ¡zapatea fuerte!" },
      },
      {
        caption: "Soplar hondo",
        question: "Osito sigue enojado. ¿Qué puede hacer él?",
        beats: [{ narration: "Respira hondo y sopla: Fuuu." }],
        instead: { caption: "Patear la torre", answer: "Mmm, ahora Zorrito también llora. Mejor sopla hondo: Fuuu." },
      },
      {
        caption: "Decir «¡Me enojé!»",
        question: "Osito todavía está un poquito enojado. ¿Qué puede hacer él?",
        beats: [{ narration: "Luego dice:", line: "¡Me enojé! ¡Mi torre se rompió!" }, { line: "¡Ay, perdón! Te ayudo." }, {}],
        instead: { caption: "Pegar", answer: "Mmm, pegar duele. Mejor di: ¡Me enojé!" },
      },
    ],
    outro: [{ narration: "¡Genial! Enojarse está bien. Zapatear, soplar, decirlo, pero no pegar." }],
    endCaption: "La torre está de pie otra vez, los dos se ríen",
  },
  bye: {
    title: "Despedida en la puerta",
    caption: "Osito se agarra del oso grande",
    intro: [{ narration: "Osito llega a la guardería." }, { narration: "El oso grande tiene que irse. Osito llora. ¡No quiere que se vaya!" }],
    steps: [
      {
        caption: "Abrazar fuerte",
        question: "El oso grande tiene que irse. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito abraza muy fuerte al oso grande.", line: "¡Adiós! ¡Te quiero!" }, { line: "Luego vengo por ti." }],
        instead: { caption: "Correr detrás", answer: "Mmm, afuera pasan autos, es peligroso. Mejor dale un abrazo fuerte para despedirte." },
      },
      {
        caption: "Decir adiós en la ventana",
        question: "El oso grande ya se va. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Luego dice adiós con la mano en la ventana.", line: "¡Adiós!" }, { narration: "El oso grande también dice adiós con la mano." }],
        instead: { caption: "Esconderse", answer: "Mmm, a solas en el escondite es triste. Mejor di adiós en la ventana." },
      },
      {
        caption: "Jugar con los demás",
        question: "Osito todavía está triste. ¿Qué puede hacer él?",
        beats: [{ line: "Ven, hacemos una torre con Zorrito." }, { narration: "Osito deja de llorar. Juega con los demás." }],
        instead: { caption: "A solas en el rincón", answer: "Mmm, a solas en el rincón es aburrido. Mejor juega con los demás." },
      },
    ],
    outro: [{ narration: "¡Súper! Abrazar, decir adiós, jugar. Y luego el oso grande vuelve." }],
    endCaption: "Lo recogen, los dos contentos",
  },
  new: {
    title: "Nuevo en la guardería",
    caption: "Erizo es nuevo y está solo",
    intro: [{ narration: "Hoy hay alguien nuevo: el pequeño Erizo." }, { narration: "Está solito en la puerta. Es tímido." }],
    steps: [
      {
        caption: "Decir «¡Hola!»",
        question: "Erizo es nuevo y está solo. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito va y lo saluda con la mano.", line: "¡Hola! Soy Osito." }, { line: "Hola. Soy Erizo." }],
        instead: { caption: "Burlarse", answer: "Mmm, ahora Erizo está triste. Mejor di: ¡Hola!" },
      },
      {
        caption: "Enseñar los bloques",
        question: "Erizo sigue tímido. ¿Qué puede hacer Osito?",
        beats: [{ line: "Mira, aquí están los bloques." }, { narration: "Erizo mira. Sonríe un poquito." }],
        instead: { caption: "Esconder los bloques", answer: "Mmm, así Erizo no puede jugar. Mejor enséñale los bloques." },
      },
      {
        caption: "Invitar a jugar",
        question: "Erizo quiere jugar también. ¿Qué puede hacer Osito?",
        beats: [{ line: "¿Quieres jugar con nosotros?" }, { line: "¡Sí!" }],
        instead: { caption: "Jugar solo con Zorrito", answer: "Mmm, ahora Erizo está muy solo. Mejor pregúntale: ¿Quieres jugar con nosotros?" },
      },
    ],
    outro: [{ narration: "¡Genial! Decir hola, enseñar, invitar a jugar. Ahora Erizo tiene amigos." }],
    endCaption: "Osito, Zorrito y Erizo festejan",
  },
  fall: {
    title: "Se cayó",
    caption: "Osito se cayó, le duele la rodilla",
    intro: [{ narration: "Osito corre muy rápido." }, { narration: "¡Pum! Se cae. ¡Ay, le duele la rodilla!" }],
    steps: [
      {
        caption: "Pedir ayuda",
        question: "Osito se cayó. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito grita:", line: "¡Ay! ¡Ayuda!" }, { line: "¡Ya voy! A ver, enséñame." }],
        instead: { caption: "Patalear y gritar", answer: "Mmm, así nadie puede ayudar. Mejor llama a la maestra." },
      },
      {
        caption: "Poner una curita",
        question: "La maestra tiene una curita. ¿Qué hace Osito?",
        beats: [{ narration: "La maestra le pone una curita y sopla." }, { line: "Listo. Ya se va a pasar." }],
        instead: { caption: "Quitar la curita", answer: "Mmm, así vuelve a doler. Mejor deja la curita puesta." },
      },
      {
        caption: "Seguir jugando despacio",
        question: "La rodilla ya no duele. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Zorrito lo ayuda a levantarse.", line: "Ven, jugamos despacito." }, { narration: "Se pasan la pelota rodando." }],
        instead: { caption: "Correr rápido enseguida", answer: "Mmm, así se vuelve a caer. Mejor juega despacio primero." },
      },
    ],
    outro: [{ narration: "¡Súper! Pedir ayuda, una curita, seguir despacio. El dolor se pasa." }],
    endCaption: "Osito enseña orgulloso su curita",
  },
  stop: {
    title: "No para",
    caption: "Zorrito le hace cosquillas, Osito ya no quiere",
    intro: [
      { narration: "Zorrito le hace cosquillas a Osito. Al principio es divertido." },
      { narration: "Pero ahora Osito ya no quiere. ¡Y Zorrito no para!" },
    ],
    steps: [
      {
        caption: "Decir «¡Alto!»",
        question: "Zorrito no para. ¿Qué puede hacer Osito?",
        beats: [
          { narration: "Osito dice fuerte:", line: "¡Alto! ¡Ya no quiero!" },
          { narration: "Zorrito para.", line: "Oh. Está bien." },
        ],
        instead: { caption: "Morder", answer: "Mmm, morder duele. Mejor di fuerte: ¡Alto! ¡No quiero eso!" },
      },
      {
        caption: "Proponer atraparse",
        question: "Zorrito ya paró. ¿Qué puede hacer Osito?",
        beats: [{ line: "¿Mejor jugamos a atraparnos?" }, { line: "¡Sí!" }],
        instead: {
          caption: "Hacerle cosquillas también",
          answer: "Mmm, ahora Zorrito no quiere. Alto quiere decir alto, para todos. Mejor pregunta: ¿Jugamos a atraparnos?",
        },
      },
      {
        caption: "Jugar a atraparse",
        question: "Los dos quieren jugar a atraparse. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Corren y se ríen.", line: "¡Atrápame!" }],
        instead: { caption: "Irse ofendido", answer: "Mmm, ahora los dos están a solas. Mejor jueguen juntos a atraparse." },
      },
    ],
    outro: [{ narration: "¡Muy bien! Alto quiere decir alto. Y luego juegan a algo que les guste a los dos." }],
    endCaption: "Osito y Zorrito chocan los cinco",
  },
};
