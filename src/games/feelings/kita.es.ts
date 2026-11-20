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
  // The stories of more feelings (selbst.ts), played like the kindergarten's.
  cookie: {
    title: "Desilusión, la galleta se rompió",
    caption: "La galleta se rompió, Osito está triste",
    intro: [{ narration: "Osito y Zorrito comen galletas." }, { narration: "¡Crac! La galleta de Osito se parte en dos. ¡Qué desilusión!" }],
    steps: [
      {
        caption: "Apretar el peluche",
        question: "La galleta se rompió y Osito está triste. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito aprieta muy fuerte su peluche.", line: "Estoy triste." }],
        instead: { caption: "Tirar el vaso", answer: "Mmm, ahora la leche cayó sobre Zorrito. Mejor aprieta muy fuerte tu peluche." },
      },
      {
        caption: "Compartir con Zorrito",
        question: "Zorrito ya no tiene galleta. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito le da una mitad a Zorrito.", line: "¡Para ti!" }, { line: "¡Gracias, Osito!" }],
        instead: { caption: "Sacar la lengua", answer: "Mmm, ahora Zorrito está triste. Mejor comparte con él." },
      },
    ],
    outro: [{ narration: "¡Genial! Estar triste está bien. Apretar el peluche y compartir." }],
    endCaption: "Osito y Zorrito comen una mitad cada uno",
  },
  baby: {
    title: "Celos del bebé",
    caption: "El oso grande abraza al bebé, Osito tiene celos",
    intro: [{ narration: "El oso grande abraza al bebé oso." }, { narration: "Osito mira. ¡Él también quiere! Tiene celos." }],
    steps: [
      {
        caption: "Decir «¡Yo también quiero un abrazo!»",
        question: "El oso grande abraza al bebé. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito dice:", line: "¡Yo también quiero un abrazo!" }, { line: "¡Ven aquí! Aquí hay lugar para ti." }],
        instead: { caption: "Pegarle al bebé", answer: "Mmm, pegar duele. Mejor di: ¡Yo también quiero un abrazo!" },
      },
      {
        caption: "Traer un pañal",
        question: "El bebé necesita un pañal limpio. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito trae un pañal por su cuenta.", line: "¡Aquí está!" }, { line: "¡Gracias! Me ayudas mucho." }],
        instead: { caption: "Quitarle la sonaja", answer: "Mmm, es la sonaja del bebé. Ahora llora. Mejor trae un pañal." },
      },
      {
        caption: "Cantarle al bebé",
        question: "El bebé tiene sueño. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito le canta una canción al bebé." }, { narration: "El bebé se ríe. Y el oso grande abraza a los dos." }],
        instead: { caption: "Tocar fuerte el tambor", answer: "Mmm, con tanto ruido el bebé llora. Mejor cántale una canción." },
      },
    ],
    outro: [{ narration: "¡Súper! Decir lo que necesitas, ayudar, cantar. Ahora se abrazan los tres." }],
    endCaption: "El oso grande abraza a los dos",
  },
  broccoli: {
    title: "Puaj, brócoli",
    caption: "Brócoli en el plato, a Osito no le gusta",
    intro: [{ narration: "Osito, Zorrito y el oso grande comen juntos." }, { narration: "En el plato hay brócoli. ¡Puaj! A Osito no le gusta." }],
    steps: [
      {
        caption: "Decir «No, gracias»",
        question: "A Osito no le gusta el brócoli. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito dice:", line: "No, gracias. No me gusta." }, { line: "Está bien. No tienes que comerlo." }],
        instead: { caption: "Tirar el plato al piso", answer: "Mmm, ahora el plato está roto. Mejor di: No, gracias." },
      },
      {
        caption: "Olerlo primero",
        question: "El brócoli sigue ahí. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito lo huele con mucho cuidado. Snif, snif." }, { line: "Mmm. Huele como un arbolito." }],
        instead: { caption: "Escupir en la mesa", answer: "Mmm, escupir le da asco a todos. Mejor huélelo primero." },
      },
      {
        caption: "Ponerlo a un lado",
        question: "Hoy Osito no quiere comérselo. ¿Qué puede hacer él?",
        beats: [{ narration: "Pone el brócoli en la orilla del plato.", line: "Tal vez otro día." }, { narration: "Y se come sus papas." }],
        instead: { caption: "Tirarle brócoli a Zorrito", answer: "Mmm, ahora Zorrito está todo sucio. Mejor ponlo a un lado." },
      },
    ],
    outro: [{ narration: "¡Muy bien! Decir no, gracias, olerlo, ponerlo a un lado. A nadie le tiene que gustar todo." }],
    endCaption: "Osito come papas, el brócoli a un lado",
  },
  oops: {
    title: "Ups, se hizo pipí",
    caption: "Un charquito, a Osito le da vergüenza",
    intro: [{ narration: "Osito juega en la guardería." }, { narration: "¡Ups! Se hizo pipí en los pantalones. Le da vergüenza." }],
    steps: [
      {
        caption: "Decirle a la maestra",
        question: "Los pantalones están mojados. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito va con la maestra.", line: "¡Ups! Mis pantalones están mojados." }, { line: "No pasa nada. A todos nos pasa alguna vez." }],
        instead: { caption: "Seguir jugando sin cambiarse", answer: "Mmm, con los pantalones mojados le da frío. Mejor dile a la maestra." },
      },
      {
        caption: "Traer pantalones limpios",
        question: "Osito necesita pantalones secos. ¿Qué puede hacer él?",
        beats: [{ narration: "Saca unos pantalones limpios de su casillero por su cuenta." }, { line: "¡Muy bien, eso ya lo puedes hacer tú!" }],
        instead: { caption: "Esparcir el charco", answer: "Mmm, ahora todo el piso está mojado y resbaloso. Mejor trae pantalones secos." },
      },
      {
        caption: "Guardar los pantalones mojados",
        question: "Ya no tiene puestos los pantalones mojados. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Mete los pantalones mojados en la bolsa. ¡Listo!" }],
        instead: { caption: "Tirar los pantalones al rincón", answer: "Mmm, ahí se quedan tirados y mojados. Mejor mételos en la bolsa." },
      },
    ],
    outro: [{ narration: "¡Súper! Decirlo, cambiarse, guardarlos. Un ups no es nada grave." }],
    endCaption: "Osito juega otra vez con pantalones limpios",
  },
  snow: {
    title: "Emoción, está nevando",
    caption: "La primera nieve, ¡qué emoción para Osito!",
    intro: [{ narration: "Osito mira por la ventana." }, { narration: "¡Está nevando! ¡La primera nieve! Osito siente mucha emoción." }],
    steps: [
      {
        caption: "Gritar de alegría",
        question: "¡Está nevando! Osito siente mucha emoción. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito grita de alegría muy fuerte:", line: "¡Yupi! ¡Nieve!" }],
        instead: { caption: "Brincar en el sillón", answer: "Mmm, ahora se cayó la lámpara. Mejor grita de alegría muy fuerte: ¡Yupi!" },
      },
      {
        caption: "Ponerse botas y chaqueta",
        question: "Osito quiere salir a la nieve. ¿Qué puede hacer él?",
        beats: [{ narration: "Primero se pone las botas y la chaqueta por su cuenta.", line: "¡Ya! ¡Ven conmigo afuera!" }, { line: "¡Ya voy!" }],
        instead: { caption: "Salir corriendo en pijama", answer: "Mmm, en pijama afuera hace muchísimo frío. Mejor ponte las botas y la chaqueta." },
      },
      {
        caption: "Hacer un ángel de nieve",
        question: "Afuera hay nieve. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Se acuesta en la nieve y hace un ángel de nieve." }],
        instead: { caption: "Tirar una bola de nieve a la cara", answer: "Mmm, en la cara duele. Mejor haz un ángel de nieve." },
      },
    ],
    outro: [{ narration: "¡Yupi! Gritar de alegría, vestirse, ángel de nieve. La alegría puede ser enorme." }],
    endCaption: "Osito y el oso grande hacen un muñeco de nieve",
  },
  leave: {
    title: "Enojo, nos vamos a casa",
    caption: "El oso grande espera en la puerta, Osito no quiere irse",
    intro: [
      { narration: "Osito está sentado arriba del tobogán." },
      { narration: "El oso grande espera en la puerta.", line: "¡Ven, nos vamos a casa!" },
      { narration: "Osito no quiere. Está enojado." },
    ],
    steps: [
      {
        caption: "Decir «¡Adiós, tobogán!» con la mano",
        question: "Osito no quiere irse a casa. ¿Qué puede hacer él?",
        beats: [{ narration: "Baja por el tobogán una última vez." }, { narration: "Luego dice adiós con la mano.", line: "¡Adiós, tobogán! ¡Hasta mañana!" }],
        instead: { caption: "Salir corriendo", answer: "Mmm, ahí adelante está la calle. Es peligroso. Mejor di adiós con la mano: ¡Adiós, tobogán!" },
      },
      {
        caption: "Guardar una piedra tesoro",
        question: "Osito todavía está un poquito enojado. ¿Qué puede hacer él?",
        beats: [{ narration: "Encuentra una piedra bonita y se la guarda.", line: "¡Mi tesoro! Me la llevo." }],
        instead: { caption: "Tirar la pala", answer: "Mmm, la pala le pega al oso grande. Mejor guarda una piedra bonita." },
      },
      {
        caption: "Empujar su bici sin ayuda",
        question: "La bici está en la puerta. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito empuja su bici sin ayuda.", line: "¡Yo puedo!" }, { line: "¡Genial! Vámonos." }],
        instead: { caption: "Tirar arena", answer: "Mmm, la arena en los ojos duele. Mejor empuja tu bici sin ayuda." },
      },
    ],
    outro: [{ narration: "¡Súper! Decir adiós, llevarse un tesoro, empujar sin ayuda. ¡Y a casa!" }],
    endCaption: "Osito se va orgulloso en su bici",
  },
  screen: {
    title: "Tristeza, se acabó el programa",
    caption: "Se acabó el programa, Osito está triste y enojado",
    intro: [{ narration: "Osito y Zorrito ven un programa." }, { narration: "Ahora se acabó. Osito está triste y enojado." }],
    steps: [
      {
        caption: "Decir adiós y cerrar la tableta",
        question: "Se acabó el programa. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito dice adiós con la mano.", line: "¡Adiós! ¡Hasta mañana!" }, { narration: "Luego cierra la tableta él mismo." }],
        instead: { caption: "Tirar la tableta", answer: "Mmm, ahora la tableta está rota. Mejor di adiós y ciérrala." },
      },
      {
        caption: "Apretar fuerte el cojín",
        question: "Osito todavía está enojado. ¿Qué puede hacer él?",
        beats: [{ narration: "Aprieta su cojín muy fuerte. Y otra vez." }, { line: "Uf. Ya estoy mejor." }],
        instead: { caption: "Patear la mesa", answer: "Mmm, eso duele en el pie. Mejor aprieta tu cojín muy fuerte." },
      },
      {
        caption: "Jugar con el tren",
        question: "Osito quiere seguir jugando. ¿Qué puede hacer él?",
        beats: [{ narration: "Trae su tren y juega a lo que vio en el programa.", line: "¡Chu-chu!" }, { line: "¡Yo también juego!" }],
        instead: { caption: "Tirarle el cojín a Zorrito", answer: "Mmm, el cojín le pega a Zorrito en la cara. Mejor juega con tu tren." },
      },
    ],
    outro: [{ narration: "¡Muy bien! Decir adiós, apretar el cojín, seguir jugando por tu cuenta." }],
    endCaption: "Osito y Zorrito juegan con el tren",
  },
  checkout: {
    title: "Enojo en la caja",
    caption: "Osito quiere una paleta, el oso grande dice que no",
    intro: [
      { narration: "Osito va sentado en el carrito del súper. En la caja hay paletas." },
      { narration: "El oso grande dice:", line: "Hoy no hay paleta." },
      { narration: "¡Osito está enojado!" },
    ],
    steps: [
      {
        caption: "Decir «¡Me enojé!»",
        question: "Osito no tiene paleta. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito dice muy fuerte:", line: "¡Me enojé!" }, { line: "Sí, te entiendo." }],
        instead: { caption: "Tirar las paletas", answer: "Mmm, ahora todas las paletas están en el piso. Mejor di fuerte: ¡Me enojé!" },
      },
      {
        caption: "Apretar los puños",
        question: "Osito todavía está enojado. ¿Qué puede hacer él?",
        beats: [{ narration: "Aprieta los puños muy fuerte. Y los vuelve a abrir." }, { line: "Uf. Ya estoy mejor." }],
        instead: { caption: "Patear", answer: "Mmm, las patadas le duelen al oso grande. Mejor aprieta los puños muy fuerte." },
      },
      {
        caption: "Poner los plátanos en la banda",
        question: "Los plátanos van en la banda. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito pone los plátanos en la banda él mismo." }, { line: "¡Gracias! ¿Quieres apretar el botón?" }, { narration: "¡Bip!" }],
        instead: { caption: "Guardarse una paleta", answer: "Mmm, la paleta es de la tienda. Mejor pon los plátanos en la banda." },
      },
    ],
    outro: [{ narration: "¡Genial! Decir cómo te sientes, apretar los puños, ayudar." }],
    endCaption: "Osito aprieta el botón en la caja",
  },
  jacket: {
    title: "Frustración, la chaqueta no entra",
    caption: "La chaqueta no entra, Osito está enojado",
    intro: [{ narration: "Osito quiere vestirse por su cuenta." }, { narration: "Pero la manga está volteada. ¡La chaqueta no entra! Está enojado." }],
    steps: [
      {
        caption: "Soplar hondo",
        question: "La chaqueta no entra. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito sopla muy hondo. Fuuuh." }, { narration: "Ya está un poquito más tranquilo." }],
        instead: { caption: "Tirar el zapato", answer: "Mmm, ahora el florero está roto. Mejor sopla muy hondo." },
      },
      {
        caption: "El truco de la chaqueta",
        question: "La manga está volteada. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Pone la chaqueta en el piso y mete los brazos." }, { narration: "¡Uy, por encima de la cabeza!", line: "¡Ya me la puse!" }],
        instead: { caption: "Jalar la chaqueta", answer: "Mmm, ahora la chaqueta está rota. Mejor prueba el truco de la chaqueta." },
      },
      {
        caption: "Decir «¡Ayúdame, por favor!»",
        question: "El cierre se atora. ¿Qué puede hacer Osito?",
        beats: [
          { narration: "Osito dice:", line: "¡Ayúdame, por favor!" },
          { line: "Claro. Yo lo detengo abajo y tú lo subes." },
          { narration: "¡Zip! Lo sube él mismo." },
        ],
        instead: { caption: "Pegarle al oso grande", answer: "Mmm, pegar duele. Mejor di: ¡Ayúdame, por favor!" },
      },
    ],
    outro: [{ narration: "¡Listo! Soplar, probar de otra forma, pedir ayuda." }],
    endCaption: "Osito está orgulloso con su chaqueta puesta",
  },
  pancake: {
    title: "Impaciencia, esperar la comida",
    caption: "El oso grande hace panqueques, Osito tiene hambre",
    intro: [{ narration: "El oso grande hace panqueques." }, { narration: "¡Osito tiene mucha hambre! Esperar es difícil." }],
    steps: [
      {
        caption: "Cantar una canción",
        question: "A los panqueques les falta un poco. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito canta una canción." }, { line: "¡Qué bonito! Ya casi están." }],
        instead: { caption: "Empujar el plato al piso", answer: "Mmm, ahora el plato está roto. Mejor canta una canción." },
      },
      {
        caption: "Poner las cucharas",
        question: "Todavía falta. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Pone las cucharas en la mesa él mismo. Una, dos.", line: "¡Yo ayudo!" }],
        instead: { caption: "Tocar la sartén", answer: "Mmm, la sartén está caliente. Mejor pon las cucharas." },
      },
      {
        caption: "Mirar por la ventana",
        question: "Hay que esperar solo un poquito más. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Mira por la ventana.", line: "¡Ahí va volando un pájaro!" }, { narration: "¡Y aquí viene el panqueque!" }],
        instead: { caption: "Golpear el plato", answer: "Mmm, ahora el plato tiene una grieta. Mejor mira por la ventana." },
      },
    ],
    outro: [{ narration: "¡Ñam! Cantar, ayudar, mirar. Y ya se acabó la espera." }],
    endCaption: "Osito come panqueques",
  },
  vacuum: {
    title: "Miedo a la aspiradora",
    caption: "El oso grande aspira, Osito se asusta",
    intro: [{ narration: "El oso grande pasa la aspiradora. ¡Brrrum!" }, { narration: "Osito se asusta. ¡Qué ruido!" }],
    steps: [
      {
        caption: "Taparse los oídos",
        question: "La aspiradora hace mucho ruido. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito se tapa los oídos." }, { line: "Ya se oye menos." }],
        instead: { caption: "Patear la aspiradora", answer: "Mmm, eso duele en el pie. Mejor tápate los oídos." },
      },
      {
        caption: "Ir por el peluche",
        question: "Osito todavía tiene un poquito de miedo. ¿Qué puede hacer él?",
        beats: [{ narration: "Se sube al sillón y abraza muy fuerte su peluche." }],
        instead: { caption: "Jalar el cable", answer: "Mmm, jalar el cable es peligroso. Mejor ve por tu peluche." },
      },
      {
        caption: "Apagarla él mismo",
        question: "El oso grande le enseña el botón. ¿Qué puede hacer Osito?",
        beats: [{ line: "¿Quieres apretarlo? Con el pie, aquí." }, { narration: "¡Clic, apagada! ¡Clic, prendida! Osito se ríe." }],
        instead: { caption: "Tirar la aspiradora", answer: "Mmm, ahora hay polvo por todos lados. Mejor aprieta tú el botón." },
      },
    ],
    outro: [{ narration: "¡Genial! Taparse los oídos, ir por el peluche, apretar el botón. Ahora la aspiradora ya no da tanto miedo." }],
    endCaption: "Osito aprieta el botón y se ríe",
  },
  dog: {
    title: "Miedo al perro grande",
    caption: "Un perro grande ladra, Osito se asusta",
    intro: [{ narration: "Osito y el oso grande pasean por el parque." }, { narration: "¡Guau! Un perro grande ladra. Osito se asusta." }],
    steps: [
      {
        caption: "Pararse como un árbol",
        question: "El perro ladra. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito se para como un árbol, sin moverse. Los pies firmes, los brazos en la panza." }, { narration: "El perro solo olfatea." }],
        instead: { caption: "Salir corriendo", answer: "Mmm, si corres, el perro quiere ir detrás. Mejor párate como un árbol, sin moverte." },
      },
      {
        caption: "Ir con el oso grande",
        question: "Osito todavía tiene miedo. ¿Qué puede hacer él?",
        beats: [{ narration: "Va con el oso grande y le toma la pata." }, { line: "Aquí estoy contigo." }],
        instead: { caption: "Tirar un palo", answer: "Mmm, el palo le pega al perro. Mejor ve con el oso grande." },
      },
      {
        caption: "Decir «¡Hola, perro!» con la mano",
        question: "Ahora el perro está sentadito. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Desde lejos le dice hola con la mano.", line: "¡Hola, perro!" }, { narration: "El perro mueve la cola." }],
        instead: { caption: "Jalarle la cola", answer: "Mmm, eso le duele al perro. Mejor salúdalo con la mano desde lejos." },
      },
    ],
    outro: [{ narration: "¡Súper! Pararse como un árbol, ir con el oso grande, saludar desde lejos." }],
    endCaption: "Osito saluda, el perro mueve la cola",
  },
  doctor: {
    title: "Miedo con la doctora",
    caption: "La doctora tiene el estetoscopio, Osito tiene miedo",
    intro: [
      { narration: "Osito está con la doctora. Está sentado en las piernas del oso grande." },
      { narration: "La doctora quiere escucharle el pecho. Osito tiene miedo." },
    ],
    steps: [
      {
        caption: "Apretar el peluche",
        question: "Osito tiene miedo. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito aprieta muy fuerte su peluche." }, { line: "Eres muy valiente." }],
        instead: { caption: "Pegarle a la doctora", answer: "Mmm, pegar duele. Mejor aprieta muy fuerte tu peluche." },
      },
      {
        caption: "Soplar hondo",
        question: "El estetoscopio está un poquito frío. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Sopla muy hondo. Fuuuh." }, { line: "¡Muy bien! Oigo tu corazón. Pum, pum." }],
        instead: { caption: "Quitar el estetoscopio de un golpe", answer: "Mmm, ahora el estetoscopio está roto. Mejor sopla muy hondo." },
      },
      {
        caption: "Escoger una curita",
        question: "¡Listo! Osito quiere irse rápido. ¿Qué puede hacer él?",
        beats: [{ narration: "Escoge él mismo una curita. ¡Una con estrellas!" }, { line: "¡Lo hiciste muy bien!" }],
        instead: { caption: "Salir corriendo", answer: "Mmm, irse corriendo sin nadie es peligroso. Mejor escoge una curita." },
      },
    ],
    outro: [{ narration: "¡Listo! Apretar el peluche, soplar, escoger una curita." }],
    endCaption: "Osito muestra orgulloso su curita de estrellas",
  },
  hairwash: {
    title: "Miedo al lavarse el pelo",
    caption: "Espuma en la cabeza, Osito tiene miedo",
    intro: [
      { narration: "Osito está en la tina. Tiene espuma en la cabeza." },
      { narration: "Ahorita viene el agua. Osito tiene miedo de que le entre en los ojos." },
    ],
    steps: [
      {
        caption: "Toallita en los ojos",
        question: "Ahorita viene el agua. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Él mismo se pone la toallita en los ojos.", line: "¡Así no entra nada!" }],
        instead: { caption: "Salpicar agua afuera", answer: "Mmm, ahora el piso está mojado y resbaloso. Mejor ponte la toallita en los ojos." },
      },
      {
        caption: "Mirar arriba al patito",
        question: "Osito todavía tiene un poquito de miedo. ¿Qué puede hacer él?",
        beats: [{ narration: "Echa la cabeza hacia atrás y mira arriba al patito.", line: "¡Hola, patito!" }],
        instead: { caption: "Salirse de la tina", answer: "Mmm, con todo mojado y resbaloso te puedes caer. Mejor mira arriba al patito." },
      },
      {
        caption: "Enjuagarse él mismo",
        question: "Hay que quitar la espuma. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Toma el vaso y se enjuaga él mismo. ¡Splash!" }, { line: "¡Lo logré!" }],
        instead: { caption: "Tirar el vaso", answer: "Mmm, ahora se cayeron todas las botellas. Mejor enjuágate tú con el vaso." },
      },
    ],
    outro: [{ narration: "¡Súper! Toallita en los ojos, mirar arriba, enjuagarse. ¡Todo limpio!" }],
    endCaption: "Osito está feliz en la tina, con el pelo limpio",
  },
  night: {
    title: "Miedo, despierto en la noche",
    caption: "De noche una sombra en la pared, Osito está despierto",
    intro: [{ narration: "Es de noche. Osito se despierta." }, { narration: "¡Hay una sombra grande en la pared! Osito tiene miedo." }],
    steps: [
      {
        caption: "Prender la lamparita",
        question: "Hay una sombra. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Prende él mismo la lamparita." }, { narration: "¡La sombra es solo el perchero!" }],
        instead: { caption: "Tirar un bloque", answer: "Mmm, ahora se cayó el perchero. Mejor prende la lamparita." },
      },
      {
        caption: "Abrazar el peluche y tararear",
        question: "Osito todavía está un poquito inquieto. ¿Qué puede hacer él?",
        beats: [{ narration: "Abraza su peluche y tararea bajito." }],
        instead: {
          caption: "Ir a oscuras a la escalera",
          answer: "Mmm, a oscuras te puedes caer en la escalera. Mejor abraza tu peluche y tararea bajito.",
        },
      },
      {
        caption: "Llamar al oso grande",
        question: "Osito no quiere estar sin nadie. ¿Qué puede hacer él?",
        beats: [
          { narration: "Llama:", line: "¿Puedes venir?" },
          { narration: "El oso grande viene y se sienta junto a la cama.", line: "Aquí estoy." },
        ],
        instead: { caption: "Tirar el peluche", answer: "Mmm, ahora tu peluche está solito en el piso. Mejor llama al oso grande." },
      },
    ],
    outro: [{ narration: "¡Muy bien! Prender la luz, abrazar el peluche, llamar. Y ahora: que duermas bien." }],
    endCaption: "Osito duerme otra vez, el oso grande está junto a la cama",
  },
  lost: {
    title: "Tristeza, el conejo de peluche no está",
    caption: "El conejo de peluche no está, Osito llora",
    intro: [{ narration: "Osito quiere irse a dormir." }, { narration: "¡Pero su conejo de peluche no está! Está muy triste." }],
    steps: [
      {
        caption: "Decir «Estoy triste»",
        question: "Su conejo de peluche no está. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito dice:", line: "Estoy triste. Mi conejo de peluche no está." }, { line: "Ay. Eso da tristeza." }],
        instead: { caption: "Vaciar la caja de juguetes", answer: "Mmm, ahora todo está revuelto. Mejor di cómo te sientes." },
      },
      {
        caption: "Buscarlo él mismo",
        question: "¿Dónde puede estar el conejo de peluche? ¿Qué puede hacer Osito?",
        beats: [{ narration: "Busca él mismo. ¿Debajo de la cama? No." }, { narration: "¿En la canasta? ¡Ahí está!" }],
        instead: {
          caption: "Quitarle el perro a Zorrito",
          answer: "Mmm, es el perro de peluche de Zorrito. Ahora Zorrito está triste. Mejor busca tu conejo de peluche.",
        },
      },
      {
        caption: "Abrazarlo muy fuerte",
        question: "¡Ahí está el conejo de peluche! ¿Qué puede hacer Osito?",
        beats: [{ narration: "Lo abraza muy fuerte.", line: "¡Aquí estás!" }],
        instead: { caption: "Tirarlo al rincón", answer: "Mmm, ahora otra vez está solito en el rincón. Mejor abrázalo muy fuerte." },
      },
    ],
    outro: [{ narration: "¡Qué bien! Decir cómo te sientes, buscar, abrazar fuerte." }],
    endCaption: "Osito abraza su conejo de peluche en la cama",
  },
  join: {
    title: "Tristeza, no lo dejan jugar",
    caption: "Zorrito y Conejito hacen un castillo, Osito está al lado",
    intro: [{ narration: "En la guardería, Zorrito y Conejito hacen un castillo de arena." }, { narration: "Osito quiere jugar también. Erizo juega solo." }],
    steps: [
      {
        caption: "Preguntar",
        question: "Osito quiere jugar también. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito pregunta:", line: "¿Puedo jugar?" }, { line: "No, ahora no." }],
        instead: { caption: "Patear el castillo", answer: "Mmm, ahora el castillo está roto y todos están tristes. Mejor pregunta: ¿Puedo jugar?" },
      },
      {
        caption: "Decir «Eso me pone triste»",
        question: "Zorrito dice que no. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito dice:", line: "Eso me pone triste." }, { line: "Ay. Tal vez más tarde." }],
        instead: { caption: "Tirar arena", answer: "Mmm, la arena en los ojos duele. Mejor di: Eso me pone triste." },
      },
      {
        caption: "Construir con Erizo",
        question: "Erizo juega solo. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Construye con Erizo una torre alta." }, { narration: "Pronto llegan también Zorrito y Conejito." }],
        instead: { caption: "Quitarle la pala a Erizo", answer: "Mmm, ahora Erizo también está triste. Mejor construye con él." },
      },
    ],
    outro: [{ narration: "¡Genial! Preguntar, decir cómo te sientes, jugar con alguien más." }],
    endCaption: "Los cuatro construyen juntos",
  },
  loud: {
    title: "Demasiado ruido",
    caption: "Fiesta ruidosa, Osito se tapa los oídos",
    intro: [{ narration: "En la guardería hay una fiesta. Música, globos, todos bailan." }, { narration: "Para Osito es demasiado, y hay mucho ruido." }],
    steps: [
      {
        caption: "A la cueva de cojines",
        question: "Hay tanto ruido. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Gatea a la cueva de cojines. Ahí hay calma." }],
        instead: { caption: "Gritarles a todos", answer: "Mmm, ahora todos se asustan. Mejor gatea a la cueva de cojines." },
      },
      {
        caption: "Abrazar el peluche y soplar",
        question: "En la cueva hay calma. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Abraza el peluche y sopla muy hondo. Fuuuh." }],
        instead: { caption: "Reventar un globo", answer: "Mmm, ¡pum! Ahora hay todavía más ruido. Mejor abraza el peluche y sopla." },
      },
      {
        caption: "Salir despacio",
        question: "Osito ya está tranquilo. ¿Qué puede hacer él?",
        beats: [{ narration: "Sale despacio y primero juega solo con Conejito." }, { line: "¡Qué bueno que estás aquí!" }],
        instead: { caption: "Salir corriendo a lo loco", answer: "Mmm, así tumba a Erizo. Mejor sal despacio." },
      },
    ],
    outro: [{ narration: "¡Súper! Descansar, soplar, volver a jugar despacio." }],
    endCaption: "Osito y Conejito juegan tranquilos a un lado de la fiesta",
  },
  proud: {
    title: "Orgullo, hasta arriba",
    caption: "Osito está hasta arriba del juego para trepar, sin ayuda",
    intro: [{ narration: "Osito sube al juego para trepar. ¡Sin ayuda!" }, { narration: "Ya está arriba. ¡Está muy orgulloso!" }],
    steps: [
      {
        caption: "Gritar «¡Sube tú también!»",
        question: "Osito está hasta arriba. ¿Qué puede hacer él?",
        beats: [{ narration: "Le grita a Zorrito:", line: "¡Sube tú también!" }, { line: "¡Sí, ya voy!" }],
        instead: { caption: "Empujar a Zorrito para abajo", answer: "Mmm, empujar duele. Mejor grita: ¡Sube tú también!" },
      },
      {
        caption: "Festejar",
        question: "Osito está feliz, feliz. ¿Qué puede hacer él?",
        beats: [{ narration: "Se agarra fuerte y festeja.", line: "¡Yupi! ¡Lo logré!" }],
        instead: { caption: "Burlarse de Zorrito", answer: "Mmm, ahora Zorrito está triste. Mejor festeja muy fuerte." },
      },
      {
        caption: "Ayudar a Zorrito",
        question: "Zorrito no puede subir. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Le enseña a Zorrito dónde poner el pie.", line: "¡Ahí! ¡Y ahora ahí!" }, { line: "¡Estoy arriba!" }],
        instead: { caption: "Saltar para abajo", answer: "Mmm, saltar desde tan alto duele. Mejor enséñale a Zorrito cómo se hace." },
      },
    ],
    outro: [{ narration: "¡Yupi! Invitar, festejar, ayudar. Ahora los dos están orgullosos." }],
    endCaption: "Osito y Zorrito juntos arriba",
  },
  miss: {
    title: "Extrañar, la abuela se va",
    caption: "La abuela se va, Osito está triste",
    intro: [{ narration: "La abuela Osa vino de visita. Ahora regresa a su casa." }, { narration: "Osito ya la extraña." }],
    steps: [
      {
        caption: "Decir «Extraño a la abuela»",
        question: "La abuela se fue. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito dice:", line: "Extraño a la abuela." }, { line: "Yo también. Ven aquí." }],
        instead: { caption: "Tirar la taza de la abuela", answer: "Mmm, ahora la taza de la abuela está rota. Mejor di: Extraño a la abuela." },
      },
      {
        caption: "Hacer un dibujo",
        question: "Osito piensa en la abuela. ¿Qué puede hacer él?",
        beats: [{ narration: "Hace un dibujo para la abuela. Con sol y corazón." }],
        instead: { caption: "Romper los crayones", answer: "Mmm, ahora los crayones están rotos. Mejor haz un dibujo para la abuela." },
      },
      {
        caption: "Ver la foto de la abuela",
        question: "Ahí está la foto de la abuela. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Mira la foto de la abuela y le da un beso." }, { narration: "¡Y llama la abuela!", line: "¡Mira, mi dibujo!" }],
        instead: { caption: "Arrancar la foto", answer: "Mmm, ahora la foto está rota. Mejor mírala." },
      },
    ],
    outro: [{ narration: "¡Qué bien! Decirlo, dibujar, pensar en la abuela. Pronto vuelve." }],
    endCaption: "Osito le enseña su dibujo a la abuela en la videollamada",
  },
  shy: {
    title: "Timidez, llegó visita",
    caption: "La señora Zorro viene de visita, Osito se esconde",
    intro: [{ narration: "Suena el timbre. La señora Zorro viene de visita.", line: "¡Hola, Osito!" }, { narration: "Osito no la conoce. Es tímido." }],
    steps: [
      {
        caption: "Primero solo mirar",
        question: "Llegó la visita. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Se agarra del oso grande y primero solo mira." }, { line: "Puedes mirar primero." }],
        instead: { caption: "Gritar «¡Vete!»", answer: "Mmm, ahora la señora Zorro se asustó. Mejor primero solo mira." },
      },
      {
        caption: "Saludar con la mano",
        question: "La señora Zorro sonríe. ¿Qué puede hacer Osito?",
        beats: [{ narration: "La saluda con la mano. Muy despacito." }, { line: "¡Hola! Qué gusto verte." }],
        instead: { caption: "Patearla", answer: "Mmm, las patadas duelen. Mejor salúdala con la mano." },
      },
      {
        caption: "Enseñar su carrito",
        question: "Osito se anima un poquito más. ¿Qué puede hacer él?",
        beats: [{ narration: "Trae su carrito favorito y se lo enseña." }, { line: "¡Ay, qué bonito!" }],
        instead: { caption: "Arrebatar el regalo", answer: "Mmm, ahora el regalo está roto. Mejor enséñale tu carrito." },
      },
    ],
    outro: [{ narration: "¡Muy bien! Primero mirar, luego saludar, luego enseñar algo. Tú decides qué tan cerca." }],
    endCaption: "Osito y la señora Zorro juegan con el carrito",
  },
  bored: {
    title: "Aburrimiento en un día de lluvia",
    caption: "Afuera llueve, Osito se aburre",
    intro: [{ narration: "Afuera llueve. Osito está acostado en el sillón." }, { narration: "¡Se aburre muchísimo!" }],
    steps: [
      {
        caption: "Jugar a cocinar con Zorrito",
        question: "Está lloviendo. ¿Qué puede hacer Osito?",
        beats: [
          { narration: "Trae las ollas y cocina una sopa de lluvia con Zorrito. ¡A revolver, a revolver!" },
          { line: "¡Mmm, qué rico! ¡Ahora cocino yo!" },
        ],
        instead: { caption: "Jalarle la oreja a Zorrito", answer: "Mmm, eso le duele a Zorrito. Mejor juega algo con él." },
      },
      {
        caption: "Hacer una cueva",
        question: "¿A qué se puede jugar adentro? ¿Qué puede hacer Osito?",
        beats: [{ narration: "Con una cobija y cojines hace una cueva." }, { line: "¡Entra!" }],
        instead: { caption: "Golpear la ventana con una olla", answer: "Mmm, ahora la ventana tiene una grieta. Mejor haz una cueva." },
      },
      {
        caption: "Manejar el carro de cartón",
        question: "Ahí hay una caja grande. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Se sienta en la caja. ¡Es su carro! Brum, brum." }, { line: "¡Llévame!" }],
        instead: { caption: "Aplastar la caja", answer: "Mmm, ahora la caja está rota. Mejor haz un carro con ella." },
      },
    ],
    outro: [{ narration: "¡Qué bien! Del aburrimiento salen ideas: cocinar juntos, hacer una cueva, manejar un carro." }],
    endCaption: "Osito y Zorrito manejan el carro de cartón",
  },
  empathy: {
    title: "Empatía, Zorrito llora",
    caption: "El globo de Zorrito se reventó, Zorrito llora",
    intro: [{ narration: "Osito y Zorrito tienen un globo cada uno." }, { narration: "¡Pum! El globo de Zorrito se reventó. Zorrito llora." }],
    steps: [
      {
        caption: "Preguntar «¿Estás triste?»",
        question: "Zorrito llora. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito va y le pregunta:", line: "¿Estás triste?" }, { line: "Sí. Mi globo se rompió." }],
        instead: { caption: "Reírse y señalar", answer: "Mmm, burlarse pone a Zorrito más triste. Mejor ve y pregúntale." },
      },
      {
        caption: "Acariciarle la espalda",
        question: "Zorrito está muy triste. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Le acaricia la espalda a Zorrito." }, { line: "Gracias, Osito." }],
        instead: { caption: "Levantar su propio globo", answer: "Mmm, así Zorrito se pone más triste. Mejor acarícialo." },
      },
      {
        caption: "Sostener el globo juntos",
        question: "Osito todavía tiene su globo. ¿Qué puede hacer él?",
        beats: [{ narration: "Le pone el hilo en la pata a Zorrito también.", line: "¡Nuestro globo!" }, { narration: "Zorrito se ríe." }],
        instead: { caption: "Irse corriendo", answer: "Mmm, ahora Zorrito está muy solito. Mejor sostén el globo con él." },
      },
    ],
    outro: [{ narration: "¡Qué bien! Preguntar, consolar, compartir. Así Zorrito ya se siente mejor." }],
    endCaption: "Osito y Zorrito sostienen el globo juntos",
  },
  startle: {
    title: "Susto, un ruido muy fuerte",
    caption: "Un globo revienta, Osito se asusta",
    intro: [{ narration: "Osito festeja su cumpleaños con Zorrito." }, { narration: "¡Pum! Un globo revienta justo a su lado. Osito se asusta." }],
    steps: [
      {
        caption: "Taparse los oídos",
        question: "¡Sonó muy fuerte! ¿Qué puede hacer Osito?",
        beats: [{ narration: "Se tapa los oídos." }, { line: "Ya estoy mejor." }],
        instead: { caption: "Reventar todos los globos", answer: "Mmm, ¡pum, pum! Ahora todos se asustan. Mejor tápate los oídos." },
      },
      {
        caption: "Soplar hondo",
        question: "El corazón todavía late muy rápido. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Sopla muy hondo. Fuuuh." }, { narration: "El corazón se calma." }],
        instead: { caption: "Tirar el pastel", answer: "Mmm, ahora el pastel está arruinado. Mejor sopla muy hondo." },
      },
      {
        caption: "Comer pastel con Zorrito",
        question: "Zorrito espera en la mesa del cumpleaños. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Va con Zorrito a la mesa. Comen pastel juntos." }, { line: "¡Mmm, qué rico!" }],
        instead: { caption: "Gritarle a Zorrito", answer: "Mmm, ahora Zorrito también se asusta. Mejor ve con él y come pastel con él." },
      },
    ],
    outro: [{ narration: "¡Súper! Taparse los oídos, soplar hondo y luego comer pastel juntos." }],
    endCaption: "Osito y Zorrito comen pastel juntos",
  },
  // The everyday scenes (alltag.ts). El mapache is the raccoon, as in days.es.ts.
  puzzle: {
    title: "Frustración, la pieza no entra",
    caption: "La vaca no entra, Osito está enojado",
    intro: [{ narration: "Osito arma un rompecabezas de animales de la granja." }, { narration: "¡La vaca no entra en su hueco! Osito está enojado." }],
    steps: [
      {
        caption: "Apretar los puños",
        question: "La vaca no entra. Osito está enojado. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito aprieta los puños muy fuerte. Y los suelta." }, { line: "Uf. Ya estoy mejor." }],
        instead: { caption: "Tirar el rompecabezas de la mesa", answer: "Mmm, ahora todas las piezas están en el piso. Mejor aprieta los puños muy fuerte." },
      },
      {
        caption: "Voltear la pieza",
        question: "La vaca no entra en su hueco. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito voltea la vaca y prueba al revés." }, { line: "¡Clic! ¡Entró!" }],
        instead: { caption: "Meter la pieza a golpes", answer: "Mmm, ahora el rompecabezas está roto. Mejor voltea la vaca y prueba al revés." },
      },
      {
        caption: "Decir «¡Ayúdame, por favor!»",
        question: "Osito no lo logra sin ayuda. ¿Qué puede hacer él?",
        beats: [
          { narration: "Osito le dice al oso grande:", line: "¡Ayúdame, por favor!" },
          { narration: "El oso grande señala la esquina. Y la vaca entra." },
        ],
        instead: { caption: "Gritarle al oso grande", answer: "Mmm, ahora el oso grande se asustó. Mejor di: ¡Ayúdame, por favor!" },
      },
    ],
    outro: [{ narration: "¡Súper! Apretar los puños, voltear la pieza, pedir ayuda. El rompecabezas está listo, y la vaca hace: ¡Muu!" }],
    endCaption: "Rompecabezas listo, Osito sonríe feliz",
  },
  race: {
    title: "Perder una carrera",
    caption: "Zorrito llega primero al árbol, Osito está enojado",
    intro: [{ narration: "Osito y Zorrito echan una carrera. ¡Hasta el manzano!" }, { narration: "Zorrito llega primero. Osito perdió. Está enojado." }],
    steps: [
      {
        caption: "Zapatear fuerte",
        question: "Zorrito ganó. Osito está enojado. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito zapatea muy fuerte en el suelo. ¡Pum, pum!" }, { line: "Uf. Ya se me pasó el enojo." }],
        instead: { caption: "Empujar a Zorrito", answer: "Mmm, empujar duele. Mejor zapatea muy fuerte en el suelo." },
      },
      {
        caption: "Gritar «¡Otra vez!»",
        question: "Osito también quiere ganar alguna vez. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito grita:", line: "¡Otra vez! ¡Otra carrera!" }, { line: "¡Sí! ¡En sus marcas, listos, fuera!" }],
        instead: { caption: "Gritar «¡No vale!» y salir corriendo", answer: "Mmm, ahora Zorrito está solito y triste. Mejor grita: ¡Otra vez!" },
      },
      {
        caption: "Chocar los cinco",
        question: "Zorrito está contento. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito le extiende la pata a Zorrito.", line: "¡Qué bien corres!" }, { narration: "¡Plas! Chocan los cinco." }],
        instead: { caption: "Jalarle la oreja a Zorrito", answer: "Mmm, eso le duele a Zorrito. Mejor choca los cinco con él." },
      },
    ],
    outro: [{ narration: "¡Súper! Zapatear, correr otra vez, chocar los cinco. Y ahora corren los dos de la mano." }],
    endCaption: "Osito y Zorrito corren de la mano",
  },
  farewell: {
    title: "Tristeza, el amigo se va a casa",
    caption: "Zorrito se va a casa, Osito llora",
    intro: [{ narration: "Zorrito vino a jugar. Ahora su papá viene por él." }, { narration: "Zorrito se pone su gorro. Osito llora." }],
    steps: [
      {
        caption: "Abrazar fuerte",
        question: "Zorrito se va a su casa. Osito está triste. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito abraza muy fuerte a Zorrito.", line: "¡Adiós, Zorrito!" }, { line: "¡Adiós, Osito!" }],
        instead: { caption: "Quitarle el gorro a Zorrito", answer: "Mmm, ahora Zorrito llora. Quiere su gorro. Mejor abrázalo para despedirte." },
      },
      {
        caption: "Apretar el carrito",
        question: "Osito tiene el carrito con el que jugaron. Está triste. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito aprieta el carrito muy fuerte contra su panza.", line: "Mañana seguimos jugando con él." }],
        instead: { caption: "Aventar el carrito", answer: "Mmm, ahora el carrito está roto. Mejor apriétalo muy fuerte contra tu panza." },
      },
      {
        caption: "Decir adiós desde la ventana",
        question: "Zorrito se va con su papá. ¿Qué puede hacer Osito?",
        beats: [
          { narration: "Osito corre a la ventana y dice adiós con la mano hasta que Zorrito da vuelta en la esquina." },
          { narration: "Zorrito también dice adiós con la mano." },
        ],
        instead: { caption: "Patear la puerta", answer: "Mmm, eso duele en el pie. Mejor corre a la ventana y di adiós con la mano." },
      },
    ],
    outro: [{ narration: "¡Súper! Abrazar, apretar el carrito, decir adiós. Y el oso grande dice:", line: "¡Hasta mañana!" }],
    endCaption: "Zorrito dice adiós desde afuera, Osito también",
  },
  myself: {
    title: "Enojo, quiero hacerlo yo",
    caption: "El jugo ya está servido, Osito está enojado",
    intro: [{ narration: "Osito y el oso grande desayunan." }, { narration: "El oso grande ya sirvió el jugo. ¡Pero Osito quería hacerlo él! Está enojado." }],
    steps: [
      {
        caption: "Decir «¡Quiero hacerlo yo!»",
        question: "El oso grande sirvió el jugo. Osito quería hacerlo él. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito dice fuerte:", line: "¡Quiero hacerlo yo!" }, { line: "Qué bueno que lo dices. Entonces ahora sirves tú." }],
        instead: { caption: "Tirar el vaso de jugo", answer: "Mmm, ahora todo el jugo está en la mesa. Mejor di: ¡Quiero hacerlo yo!" },
      },
      {
        caption: "Soplar hondo",
        question: "Osito está muy enojado. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito se voltea de la mesa y sopla muy hondo hacia arriba. Fuuuh." }, { line: "Ya estoy mejor." }],
        instead: { caption: "Pegarle al oso grande", answer: "Mmm, pegar duele. Mejor sopla muy hondo." },
      },
      {
        caption: "Servir él mismo",
        question: "El vaso del oso grande está vacío. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito le sirve él mismo al oso grande. El oso grande solo detiene un poquito la jarra." }, { line: "¡Yo puedo!" }],
        instead: { caption: "Tirar la jarra", answer: "Mmm, ahora la jarra está rota. Mejor sirve tú." },
      },
    ],
    outro: [{ narration: "¡Súper! Decir lo que quieres, soplar hondo, servir por tu cuenta. Ahora toman los dos." }],
    endCaption: "Osito y el oso grande toman jugo, Osito sonríe feliz",
  },
  homesick: {
    title: "Extrañar la casa, la primera noche con la abuela",
    caption: "Primera noche con la abuela, Osito extraña su casa",
    intro: [
      { narration: "Hoy Osito duerme por primera vez en casa de la abuela Osa." },
      { narration: "El oso grande ya se fue a casa. Osito extraña su casa." },
    ],
    steps: [
      {
        caption: "Apretar el conejo de peluche",
        question: "Osito extraña su casa. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito aprieta muy fuerte su conejo de peluche. Vino con él desde casa." }, { line: "Qué bueno que estás aquí." }],
        instead: { caption: "Tirar la lamparita", answer: "Mmm, ahora la lamparita está rota. Mejor aprieta muy fuerte tu conejo de peluche." },
      },
      {
        caption: "Decir «Extraño mi casa»",
        question: "La abuela está sentada junto a la cama. ¿Qué puede hacer Osito?",
        beats: [
          { narration: "Osito le dice a la abuela:", line: "Extraño mi casa." },
          { narration: "La abuela asiente y le acaricia la cabeza.", line: "Mañana temprano el oso grande viene por ti." },
        ],
        instead: { caption: "Empujar a la abuela", answer: "Mmm, empujar le duele a la abuela. Mejor dile lo que extrañas." },
      },
      {
        caption: "Respirar despacio",
        question: "Osito no se puede dormir. ¿Qué puede hacer él?",
        beats: [{ narration: "Cierra los ojos y pone la pata en la panza." }, { narration: "Aire adentro. Y afuera. Muy despacio." }],
        instead: { caption: "Arrancar el cuadro de la pared", answer: "Mmm, ahora el cuadro está roto. Mejor respira muy despacio, con la pata en la panza." },
      },
    ],
    outro: [{ narration: "¡Súper! Apretar el conejo de peluche, decir lo que extrañas, respirar despacio. Ahora Osito duerme." }],
    endCaption: "Osito duerme sonriendo en casa de la abuela",
  },
  barber: {
    title: "Miedo en la peluquería",
    caption: "Osito en la silla de la peluquería tiene miedo",
    intro: [
      { narration: "Osito está en la peluquería. Está sentado en la silla alta." },
      { narration: "La peluquera llega con el peine y las tijeras. Osito tiene miedo." },
    ],
    steps: [
      {
        caption: "Agarrarse fuerte de la silla",
        question: "Osito tiene miedo de las tijeras. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito se agarra muy fuerte de los brazos de la silla. Y no se mueve." }, { line: "Me agarro bien fuerte." }],
        instead: { caption: "Patear a la peluquera", answer: "Mmm, las patadas le duelen a la peluquera. Mejor agárrate de los brazos de la silla." },
      },
      {
        caption: "Mirar en el espejo",
        question: "Detrás de la oreja hace chic, chic. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito se mira en el espejo. Ahí cae un mechón de pelo." }, { line: "¡Oh! ¡Ahí va volando mi pelo!" }],
        instead: { caption: "Tirar el atomizador", answer: "Mmm, ahora el atomizador está roto. Mejor mírate en el espejo." },
      },
      {
        caption: "Decir «¡Una pausa, por favor!»",
        question: "Esto es mucho para Osito. ¿Qué puede hacer él?",
        beats: [
          { narration: "Osito dice:", line: "¡Una pausa, por favor!" },
          { narration: "La peluquera espera. Y el oso grande lo saluda con la mano.", line: "¡Claro! Avisa cuando sigamos." },
        ],
        instead: { caption: "Gritarle a la peluquera", answer: "Mmm, ahora la peluquera se asustó. Mejor di: ¡Una pausa, por favor!" },
      },
    ],
    outro: [{ narration: "¡Súper! Agarrarse, mirar en el espejo, pedir una pausa. ¡Y ahora Osito tiene un corte nuevo!" }],
    endCaption: "Osito se ríe en el espejo con su corte nuevo",
  },
  accident: {
    title: "Ups, sin querer",
    caption: "Osito tumbó la torre de Zorrito y se asusta",
    intro: [{ narration: "Osito corre por la guardería." }, { narration: "¡Pum! Sin querer choca con la torre de Zorrito. La torre se cae. Osito se asusta." }],
    steps: [
      {
        caption: "Decir «¡Perdón!»",
        question: "La torre de Zorrito se cayó. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito le dice a Zorrito:", line: "¡Perdón! No fue a propósito." }, { line: "Está bien." }],
        instead: { caption: "Patear los otros bloques", answer: "Mmm, ahora todo se cayó, y Zorrito está triste. Mejor di: ¡Perdón!" },
      },
      {
        caption: "Soplar hondo",
        question: "Osito está muy asustado. ¿Qué puede hacer él?",
        beats: [{ narration: "Se arrodilla junto a Zorrito y sopla muy hondo hacia arriba. Fuuuh." }, { narration: "Ahora su corazón late más tranquilo." }],
        instead: { caption: "Reírse y seguir corriendo", answer: "Mmm, ahora Zorrito llora. Mejor arrodíllate junto a él y sopla muy hondo." },
      },
      {
        caption: "Construir juntos otra vez",
        question: "Los bloques están en el piso. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Le da un bloque a Zorrito.", line: "¿Construimos juntos?" }, { line: "¡Sí!" }],
        instead: { caption: "Aventar bloques", answer: "Mmm, el bloque le pega a Zorrito. Eso duele. Mejor construye con él." },
      },
    ],
    outro: [{ narration: "¡Súper! Pedir perdón, soplar hondo, construir juntos. ¡La torre nueva es todavía más alta!" }],
    endCaption: "Torre nueva y alta, Osito y Zorrito se ríen",
  },
  laughed: {
    title: "Dolido, se burlan de su dibujo",
    caption: "El mapache se ríe del dibujo, Osito se siente herido",
    intro: [
      { narration: "Osito pinta en la guardería. Círculos de colores. ¡Es el oso grande!" },
      { narration: "El mapache lo señala y se ríe. Osito se siente herido." },
    ],
    steps: [
      {
        caption: "Decir «¡Eso no me gusta!»",
        question: "El mapache se ríe del dibujo de Osito. ¿Qué puede hacer Osito?",
        beats: [
          { narration: "Osito dice fuerte:", line: "¡No te rías! ¡Eso no me gusta!" },
          { narration: "El mapache deja de reírse.", line: "Está bien. Perdón." },
        ],
        instead: {
          caption: "Romper el dibujo del mapache",
          answer: "Mmm, ahora el dibujo del mapache está roto, y llora. Mejor di fuerte: ¡Eso no me gusta!",
        },
      },
      {
        caption: "Apretar los puños y soplar",
        question: "Osito se siente muy herido. ¿Qué puede hacer él?",
        beats: [{ narration: "Aprieta los puños muy fuerte. Luego sopla hondo hacia arriba. Fuuuh." }, { line: "Ya estoy mejor." }],
        instead: { caption: "Aventar los crayones", answer: "Mmm, los crayones le pegan al mapache. Eso duele. Mejor aprieta los puños y sopla." },
      },
      {
        caption: "Seguir pintando con Conejito",
        question: "Conejito pinta muy tranquilo. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito se sienta junto a Conejito y sigue pintando." }, { line: "¡Qué bonito! ¡Es el oso grande!" }],
        instead: { caption: "Arrugar su propio dibujo", answer: "Mmm, ahora tu dibujo bonito está arruinado. Mejor siéntate con Conejito y sigue pintando." },
      },
    ],
    outro: [{ narration: "¡Súper! Decir lo que no te gusta, soplar, seguir pintando. Ahora el dibujo está colgado en la pared." }],
    endCaption: "El dibujo de Osito cuelga en la pared, el mapache lo mira",
  },
  excited: {
    title: "Demasiada emoción para dormir",
    caption: "La maleta lista, Osito no tiene nada de sueño en la cama",
    intro: [
      { narration: "¡Mañana Osito va al mar! Su maleta ya está lista." },
      { narration: "Está acostado en la cama. Tiene tanta emoción que no se puede dormir." },
    ],
    steps: [
      {
        caption: "Poner la pata en la panza",
        question: "Osito tiene mucha emoción. ¿Qué puede hacer él?",
        beats: [{ narration: "Pone la pata en la panza y respira muy despacio. Aire adentro y afuera." }],
        instead: { caption: "Vaciar la maleta", answer: "Mmm, ¡pum! Ahora todo está en el piso. Mejor pon la pata en la panza y respira despacio." },
      },
      {
        caption: "Susurrarle al conejo de peluche",
        question: "Osito piensa todo el tiempo en el mar. ¿Qué puede hacer él?",
        beats: [{ narration: "Le susurra al oído a su conejo de peluche:", line: "Mañana hacemos un castillo de arena." }],
        instead: {
          caption: "Tocar el balde como tambor",
          answer: "Mmm, ¡qué ruido! Ahora se despertó el bebé en el otro cuarto. Mejor susúrrale a tu conejo de peluche lo que vas a construir mañana.",
        },
      },
      {
        caption: "Cerrar los ojos y pensar en las olas",
        question: "Ya es tarde. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Cierra los ojos y piensa en las olas." }, { narration: "Shh, shh. Se va calmando." }],
        instead: { caption: "Prender la luz y jugar", answer: "Mmm, con la luz prendida se va el sueño. Mejor cierra los ojos y piensa en las olas." },
      },
    ],
    outro: [{ narration: "¡Súper! Respirar despacio, susurrarle al conejo de peluche, pensar en las olas. ¡Buenas noches!" }],
    endCaption: "Osito duerme con la pala en los brazos",
  },
  envy: {
    title: "Envidia por la bici",
    caption: "Zorrito enseña su bici de equilibrio nueva, Osito tiene envidia",
    intro: [
      { narration: "Zorrito tiene una bici de equilibrio nueva. ¡Roja, con timbre!" },
      { narration: "Osito solo tiene su monopatín viejo. Tiene envidia." },
    ],
    steps: [
      {
        caption: "Apretar los puños",
        question: "Osito también quiere una bici así. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito aprieta los puños muy fuerte y dice:", line: "¡Yo también quiero una!" }, { narration: "Uf. Ahora se siente mejor." }],
        instead: { caption: "Tumbar la bici", answer: "Mmm, ahora el timbre está roto. Mejor aprieta los puños muy fuerte." },
      },
      {
        caption: "Preguntar «¿Me prestas?»",
        question: "Osito también quiere andar en la bici. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito pregunta:", line: "¿Me prestas?" }, { line: "¡Sí! Después de mi vuelta." }],
        instead: { caption: "Bajar a Zorrito de la bici", answer: "Mmm, ahora Zorrito se cayó. Mejor pregunta: ¿Me prestas?" },
      },
      {
        caption: "Intercambiar",
        question: "Osito tiene un monopatín. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito pregunta:", line: "¿Cambiamos?" }, { narration: "Zorrito prueba el monopatín, Osito la bici." }],
        instead: { caption: "Patear el monopatín", answer: "Mmm, ahora tu monopatín está roto. Mejor cambia con Zorrito." },
      },
    ],
    outro: [{ narration: "¡Súper! Apretar los puños, preguntar, intercambiar. Ahora andan los dos juntos." }],
    endCaption: "Osito y Zorrito andan lado a lado, Osito toca el timbre",
  },
  supermarket: {
    title: "Miedo, perdido en el súper",
    caption: "Osito está entre los estantes sin nadie, tiene miedo",
    intro: [{ narration: "Osito está en el súper." }, { narration: "¿Dónde está el oso grande? Osito ya no lo ve. Tiene miedo." }],
    steps: [
      {
        caption: "Pararse como un árbol",
        question: "Osito está solo. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito se para como un árbol. Los pies firmes en el piso." }, { narration: "Respira hondo, adentro y afuera." }],
        instead: { caption: "Treparse al estante", answer: "Mmm, el estante se tambalea, y todo se cae. Mejor párate como un árbol." },
      },
      {
        caption: "Gritar «¡Papá!»",
        question: "Osito no ve al oso grande. ¿Qué puede hacer él?",
        beats: [{ narration: "Grita muy fuerte:", line: "¡Papá! ¡Aquí estoy!" }, { line: "¡Te oigo! ¡Ya voy!" }],
        instead: { caption: "Tumbar la torre de latas", answer: "Mmm, ahora todas las latas están en el piso. Mejor grita muy fuerte: ¡Papá!" },
      },
      {
        caption: "Apretar el conejo de peluche y esperar",
        question: "El oso grande lo busca. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Aprieta muy fuerte su conejo de peluche y espera justo donde está." }],
        instead: { caption: "Tirar las manzanas", answer: "Mmm, ahora las manzanas ruedan por todos lados. Mejor aprieta tu conejo de peluche y espera aquí." },
      },
    ],
    outro: [{ narration: "¡Ahí viene el oso grande por el pasillo!", line: "¡Aquí estás!" }, { narration: "¡Súper! Pararse, gritar fuerte, esperar." }],
    endCaption: "El oso grande llegó, los dos se abrazan",
  },
  pointing: {
    title: "Enojo, nadie me entiende",
    caption: "El oso grande levanta una manzana, Osito quiere el yogur",
    intro: [
      { narration: "Osito quiere el yogur. Grita:", line: "¡Ahí! ¡Ahí!" },
      { narration: "El oso grande levanta una manzana. ¡No! Osito está muy enojado." },
    ],
    steps: [
      {
        caption: "Señalar bien",
        question: "El oso grande levanta una manzana. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito señala con la pata justo el yogur." }, { line: "¡Ah, el yogur!" }],
        instead: { caption: "Quitarle la manzana de un manotazo", answer: "Mmm, eso le duele al oso grande. Mejor señala justo el yogur." },
      },
      {
        caption: "Zapatear y soplar",
        question: "Osito está muy enojado. ¿Qué puede hacer él?",
        beats: [{ narration: "Zapatea muy fuerte. ¡Pum, pum!" }, { narration: "Luego sopla muy hondo. Fuuuh." }],
        instead: { caption: "Patear el refrigerador", answer: "Mmm, ahora todo se cayó adentro del refrigerador. Mejor zapatea muy fuerte y sopla." },
      },
      {
        caption: "Llevarlo al refrigerador",
        question: "El oso grande no lo entiende. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Toma al oso grande de la pata y lo lleva al refrigerador." }, { line: "¡Ah, el yogur! Ahora entiendo." }],
        instead: { caption: "Gritar muy fuerte", answer: "Mmm, ¡qué ruido! Eso le duele en los oídos al oso grande. Mejor tómalo de la pata." },
      },
    ],
    outro: [{ narration: "¡Súper! Señalar, zapatear y soplar, llevarlo. Ahora comen yogur los dos." }],
    endCaption: "Osito y el oso grande comen yogur",
  },
  bee: {
    title: "Miedo a la abeja",
    caption: "Una abeja zumba alrededor del jugo, Osito tiene miedo",
    intro: [
      { narration: "Osito y el oso grande hacen un pícnic en el pasto." },
      { narration: "¡Bzz, bzz! Una abeja vuela alrededor del jugo. Osito tiene miedo." },
    ],
    steps: [
      {
        caption: "Sentarse sin moverse",
        question: "La abeja zumba alrededor del jugo. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito se sienta sin moverse. Como una piedra." }, { line: "Muy bien. La abeja solo quiere el jugo." }],
        instead: { caption: "Manotear a la abeja", answer: "Mmm, ahora la abeja picó. Mejor siéntate sin moverte." },
      },
      {
        caption: "Alejarse despacio",
        question: "La abeja se queda en el vaso. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Se levanta despacio y se aleja unos pasos." }, { narration: "Aquí no hay abeja. ¡Uf!" }],
        instead: { caption: "Tirar el jugo", answer: "Mmm, ¡plaf! Ahora el mantel está todo mojado. Mejor aléjate despacio unos pasos." },
      },
      {
        caption: "Mirar y soltar el aire",
        question: "La abeja se va volando. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Mira cómo la abeja vuela a las flores." }, { narration: "Luego suelta el aire muy hondo. Fuuuh." }],
        instead: { caption: "Aventarle la pelota a la abeja", answer: "Mmm, ahora se cayeron el jugo y el té. Mejor mira cómo se va volando la abeja." },
      },
    ],
    outro: [{ narration: "¡Súper! Sentarse sin moverse, alejarse, soltar el aire. Ahora la abeja zumba en las flores." }],
    endCaption: "Los dos sentados en el mantel, la abeja está en las flores",
  },
  phone: {
    title: "Esperar, el oso grande habla por teléfono",
    caption: "El oso grande habla por teléfono, Osito quiere enseñarle su dibujo",
    intro: [
      { narration: "El oso grande habla por teléfono en la cocina." },
      { narration: "Osito le quiere enseñar su dibujo nuevo. ¡Ahorita mismo! Esperar es muy difícil." },
    ],
    steps: [
      {
        caption: "Tocarle el brazo despacito",
        question: "El oso grande habla por teléfono. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito le toca el brazo despacito al oso grande." }, { narration: "El oso grande levanta la pata y susurra:", line: "Ahorita." }],
        instead: { caption: "Arrebatarle el teléfono", answer: "Mmm, ahora el teléfono se cayó y se rompió. Mejor tócale el brazo despacito." },
      },
      {
        caption: "Contar con el conejo de peluche",
        question: "La llamada tarda. ¿Qué puede hacer Osito?",
        beats: [
          { narration: "Se sienta en la silla con su conejo de peluche en los brazos y cuenta con los dedos." },
          { line: "¡Uno, dos, tres, cuatro, cinco!" },
        ],
        instead: { caption: "Gritar en medio de la llamada", answer: "Mmm, ¡qué ruido! Eso le duele en los oídos al oso grande. Mejor cuenta con los dedos." },
      },
      {
        caption: "Poner el dibujo en la mesa",
        question: "Osito tiene su dibujo. ¿Qué puede hacer él?",
        beats: [{ narration: "Pone su dibujo bien en la mesa y le pinta un sol." }, { narration: "Así está listo cuando venga el oso grande." }],
        instead: { caption: "Arrugar el dibujo", answer: "Mmm, ahora tu dibujo bonito está arrugado. Mejor ponlo bien en la mesa." },
      },
    ],
    outro: [
      { narration: "El oso grande cuelga y mira el dibujo un buen rato.", line: "¡Ay, qué bonito!" },
      { narration: "¡Súper! Tocar despacito, contar, poner el dibujo en la mesa." },
    ],
    endCaption: "El oso grande mira el dibujo un buen rato",
  },
  hit: {
    title: "Pegó, ¿y ahora?",
    caption: "Zorrito se agarra el brazo, Osito se asusta",
    intro: [{ narration: "Osito y Zorrito se pelean por la pala. Y Osito le pega a Zorrito." }, { narration: "Zorrito llora. Osito se asusta." }],
    steps: [
      {
        caption: "Bajar las patas, soplar hondo",
        question: "Osito pegó. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito baja las patas y sopla muy hondo. Fuuuh." }, { narration: "Ahora está más tranquilo." }],
        instead: { caption: "Pegar otra vez", answer: "Mmm, eso le duele todavía más a Zorrito. Mejor baja las patas y sopla." },
      },
      {
        caption: "Decir «¡Perdón!»",
        question: "Zorrito llora. ¿Qué puede hacer Osito?",
        beats: [
          { narration: "Osito dice:", line: "¡Perdón! No fue a propósito." },
          { narration: "Zorrito sorbe la nariz.", line: "Está bien." },
        ],
        instead: { caption: "Seguir escarbando con la pala", answer: "Mmm, ahora Zorrito llora todavía más. Mejor dile: ¡Perdón!" },
      },
      {
        caption: "Ir con la maestra",
        question: "A Zorrito le duele el brazo. ¿Qué puede hacer Osito?",
        beats: [
          { narration: "Va con Zorrito a ver a la maestra." },
          { narration: "Ella le pone una bolsa de hielo en el brazo.", line: "Listo, ahorita se siente mejor." },
        ],
        instead: { caption: "Burlarse de Zorrito", answer: "Mmm, burlarse pone a Zorrito más triste. Mejor ve con él a ver a la maestra." },
      },
    ],
    outro: [{ narration: "¡Súper! Soplar, pedir perdón, buscar ayuda. Ahora escarban los dos juntos." }],
    endCaption: "Osito y Zorrito escarban juntos",
  },
  pickup: {
    title: "Alegría, vienen por él",
    caption: "El oso grande saluda en la puerta, Osito sonríe feliz",
    intro: [{ narration: "Es la tarde en la guardería. ¡Ahí está el oso grande en la puerta!" }, { narration: "¡Osito está feliz, feliz!" }],
    steps: [
      {
        caption: "Brincar y saludar",
        question: "¡Llegó el oso grande! ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito brinca de alegría y saluda con la mano.", line: "¡Papá!" }, { line: "¡Hola, Osito!" }],
        instead: { caption: "Tumbar a Zorrito corriendo", answer: "Mmm, ahora Zorrito se cayó. Mejor brinca y saluda con la mano." },
      },
      {
        caption: "Decirle «¡Adiós!» a Zorrito",
        question: "Zorrito construye una torre. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Primero Osito va con Zorrito.", line: "¡Adiós, hasta mañana!" }, { line: "¡Adiós, Osito!" }],
        instead: { caption: "Tumbar la torre corriendo", answer: "Mmm, ahora la torre de Zorrito está rota. Mejor primero dile: ¡Adiós!" },
      },
      {
        caption: "Abrazar muy fuerte",
        question: "¡Osito está tan feliz! ¿Qué puede hacer él?",
        beats: [{ narration: "Corre a los brazos del oso grande y lo abraza muy fuerte." }, { line: "¡Te extrañé!" }],
        instead: { caption: "Arrebatar la bolsa", answer: "Mmm, ¡ras! Ahora la correa se rompió. Mejor corre a sus brazos y abrázalo." },
      },
    ],
    outro: [{ narration: "¡Súper! Brincar y saludar, decir adiós, abrazar muy fuerte. Ahora, ¡a casa!" }],
    endCaption: "Osito y el oso grande van de la mano, Zorrito dice adiós",
  },
  bath: {
    title: "Risitas en la tina",
    caption: "Osito y Zorrito se ríen en la tina",
    intro: [{ narration: "Zorrito vino de visita. Él y Osito se bañan juntos." }, { narration: "Se ríen y se ríen. ¡Osito está de lo más payaso!" }],
    steps: [
      {
        caption: "Hacerse una barba de espuma",
        question: "Osito está de lo más payaso. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito se hace una barba de espuma.", line: "¡Jo, jo, jo!" }, { narration: "Zorrito se ríe también." }],
        instead: { caption: "Salpicar a Zorrito", answer: "Mmm, ahora Zorrito tiene agua en los ojos y llora. Mejor hazte una barba de espuma." },
      },
      {
        caption: "Soplar espuma hacia arriba",
        question: "Osito está muy alborotado de alegría. ¿Qué puede hacer él?",
        beats: [
          { narration: "Toma espuma en la pata y sopla muy despacio. Fuuuh." },
          { narration: "Los copos vuelan hacia arriba. Osito se calma y se ríe bajito." },
        ],
        instead: {
          caption: "Vaciar el champú",
          answer: "Mmm, ahora se acabó el champú, y la espuma le arde a Zorrito en los ojos. Mejor sopla espuma muy despacio hacia arriba.",
        },
      },
      {
        caption: "Envolverse en la toalla",
        question: "Ya terminó el baño. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito sale despacio de la tina.", line: "¡Toalla, por favor!" }, { narration: "Se acurruca en la toalla suavecita." }],
        instead: { caption: "Saltar fuera de la tina", answer: "Mmm, en el piso mojado uno se resbala. Mejor sal despacio y envuélvete en la toalla." },
      },
    ],
    outro: [{ narration: "¡Súper! Barba de espuma, soplar espuma, acurrucarse en la toalla. Ahora los dos se ríen bajito." }],
    endCaption: "Osito y Zorrito se ríen bajito en la toalla",
  },
  butterfly: {
    title: "Asombro, una mariposa",
    caption: "Una mariposa en la flor, Osito se asombra",
    intro: [{ narration: "Osito y Zorrito están en el jardín." }, { narration: "¡Mira! En la flor hay una mariposa. Osito se asombra." }],
    steps: [
      {
        caption: "Pararse sin moverse",
        question: "La mariposa está muy cerca. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito se para sin moverse. Respira muy bajito." }, { narration: "La mariposa se queda y abre y cierra las alas." }],
        instead: {
          caption: "Agarrar la mariposa",
          answer: "Mmm, las mariposas son muy delicadas. Ahora se fue volando, y Zorrito está triste. Mejor párate sin moverte.",
        },
      },
      {
        caption: "Susurrar «¡Mira!»",
        question: "Zorrito también quiere ver la mariposa. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito le hace lugar y señala la flor.", line: "¡Shh, mira!" }, { line: "¡Ay, qué bonita!" }],
        instead: { caption: "Empujar a Zorrito", answer: "Mmm, empujar duele. Mejor hazle lugar y susurra: ¡Mira!" },
      },
      {
        caption: "Aletear como una mariposa",
        question: "La mariposa se va volando. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito aletea con los brazos como una mariposa.", line: "¡Aleteo, aleteo!" }, { narration: "Zorrito aletea también." }],
        instead: { caption: "Correr por las flores", answer: "Mmm, ahora las flores están dobladas, y Zorrito está triste. Mejor aletea como una mariposa." },
      },
    ],
    outro: [{ narration: "¡Súper! Pararse sin moverse, señalar bajito, aletear. Y la mariposa se posa en la regadera." }],
    endCaption: "La mariposa en la regadera, los dos se ríen bajito",
  },
  morning: {
    title: "De malas en la mañana, levantarse cuesta",
    caption: "En la mañana en la cama, Osito está de malas",
    intro: [{ narration: "Es de mañana. Osito se despierta." }, { narration: "Tiene mucho sueño. ¡Levantarse cuesta! Está de malas." }],
    steps: [
      {
        caption: "Estirarse y bostezar",
        question: "Osito tiene sueño y está de malas. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito se estira muy largo, como un gato." }, { narration: "Luego bosteza muy grande. ¡Aaaah! Ya tiene menos sueño." }],
        instead: { caption: "Tirar el despertador", answer: "Mmm, ahora el despertador está roto. Mejor estírate muy largo como un gato." },
      },
      {
        caption: "Ponerse las pantuflas",
        question: "Las pantuflas están junto a la cama. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito se pone las pantuflas. Primero una, luego la otra." }, { line: "¡Buenos días, bebé!" }],
        instead: { caption: "Aventarle una pantufla al bebé", answer: "Mmm, la pantufla le pega al bebé. Mejor ponte tus pantuflas." },
      },
      {
        caption: "Abrir la cortina",
        question: "La cortina está cerrada, el cuarto está oscuro. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito abre la cortina." }, { narration: "Entra el sol. Parpadea y sonríe.", line: "¡Hola, sol!" }],
        instead: { caption: "Arrancar la cortina", answer: "Mmm, ahora la cortina está en el piso. Mejor ábrela y deja entrar el sol." },
      },
    ],
    outro: [{ narration: "¡Súper! Estirarse, ponerse las pantuflas, dejar entrar el sol. ¡Buenos días!" }],
    endCaption: "Osito en pantuflas va a desayunar con el bebé",
  },
  worn: {
    title: "Agotado después de la guardería",
    caption: "Osito está acostado en el pasillo con la chaqueta puesta, muy agotado",
    intro: [{ narration: "Osito llega a casa de la guardería." }, { narration: "Se acuesta en el piso con la chaqueta puesta. Está agotado y llorón." }],
    steps: [
      {
        caption: "Seguir en el piso y respirar hondo",
        question: "Osito está agotado y llorón. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito sigue acostado. Respira hondo y suelta el aire muy despacio. Fuuuh." }, { narration: "Ya está un poquito más tranquilo." }],
        instead: { caption: "Aventar la lonchera a la pared", answer: "Mmm, ahora la lonchera está rota. Mejor sigue en el piso y respira hondo." },
      },
      {
        caption: "Decir «Ya no puedo más»",
        question: "Todo es demasiado para Osito. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito le dice al oso grande:", line: "Ya no puedo más." }, { line: "Te creo. Ven, te ayudo con la chaqueta." }],
        instead: { caption: "Tumbar la torre del bebé", answer: "Mmm, ahora la torre del bebé está rota, y llora. Mejor di: Ya no puedo más." },
      },
      {
        caption: "Gatear al rincón de cojines",
        question: "Osito necesita calma. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito gatea él solo al rincón de cojines." }, { narration: "Se acurruca en el cojín y aprieta su conejo de peluche." }],
        instead: { caption: "Pegarle al oso grande", answer: "Mmm, pegar duele. El oso grande solo quiere ayudar. Mejor gatea al rincón de cojines." },
      },
    ],
    outro: [{ narration: "¡Súper! Respirar hondo, decir cómo te sientes, descansar. Ahora Osito se siente mejor." }],
    endCaption: "Osito está acostado con su conejo de peluche en el rincón de cojines",
  },
  sick: {
    title: "Enfermo y sin fuerzas",
    caption: "Osito está enfermo, afuera juega Zorrito",
    intro: [
      { narration: "Osito está enfermo. Está acostado en el sillón, le escurre la nariz." },
      { narration: "Afuera Zorrito juega con la pelota. Osito no tiene fuerzas y está triste." },
    ],
    steps: [
      {
        caption: "Acurrucarse en la cobija",
        question: "Osito está enfermo y sin fuerzas. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito se acurruca en la cobija y cierra los ojos." }, { narration: "Respira muy tranquilo. Descansar hace bien." }],
        instead: { caption: "Tirar la taza de té", answer: "Mmm, ahora la taza está rota y el té se derramó. Mejor acurrúcate en la cobija." },
      },
      {
        caption: "Saludar a Zorrito",
        question: "Osito también quiere salir, pero tiene que quedarse adentro. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito saluda a Zorrito con la mano por la ventana." }, { narration: "Zorrito lo saluda también y se ríe." }],
        instead: { caption: "Golpear la ventana", answer: "Mmm, eso duele en la pata, y la ventana se puede romper. Mejor saluda a Zorrito con la mano." },
      },
      {
        caption: "Ver un libro de dibujos",
        question: "En el sillón Osito se aburre. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito abre el libro de dibujos." }, { narration: "Mira los dibujos. ¡Un barco, una ballena!" }],
        instead: { caption: "Romper el libro", answer: "Mmm, ahora el libro bonito está roto. Mejor mira los dibujos." },
      },
    ],
    outro: [{ narration: "¡Súper! Descansar, saludar, ver los dibujos. Pronto Osito se va a aliviar." }],
    endCaption: "Osito saluda con el libro, Zorrito saluda desde afuera",
  },
  car: {
    title: "De malas en el carro",
    caption: "Viaje largo a casa de la abuela Osa, Osito está de malas",
    intro: [
      { narration: "El oso grande va con Osito y el bebé a casa de la abuela Osa." },
      { narration: "¡El viaje es tan largo! El bebé duerme. Osito está de malas." },
    ],
    steps: [
      {
        caption: "Apretar el conejo de peluche",
        question: "El viaje es tan largo. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito abraza muy fuerte a su conejo de peluche." }, { narration: "Apretar fuerte. Y soltar. Ya está mejor." }],
        instead: {
          caption: "Patear el asiento",
          answer: "Mmm, eso le duele en la espalda al oso grande, y él tiene que manejar. Mejor aprieta muy fuerte tu conejo de peluche.",
        },
      },
      {
        caption: "Contar carros",
        question: "Osito ya lleva mucho rato en su sillita. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito mira por la ventana y cuenta carros." }, { line: "¡Un carro rojo! ¡Uno azul! ¡Uno amarillo!" }],
        instead: {
          caption: "Aventar la botella hacia adelante",
          answer: "Mmm, la botella vuela hacia el oso grande. Mientras maneja, eso es peligroso. Mejor cuenta carros.",
        },
      },
      {
        caption: "Cerrar los ojos",
        question: "Osito tiene sueño y está de malas. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito recarga la cabeza y cierra los ojos." }, { narration: "Ya casi se duerme, como el bebé." }],
        instead: { caption: "Despertar al bebé", answer: "Mmm, ahora el bebé se despertó y llora. Mejor cierra los ojos." },
      },
    ],
    outro: [{ narration: "¡Súper! Apretar el conejo de peluche, contar carros, cerrar los ojos. Ya casi llegan con la abuela Osa." }],
    endCaption: "Osito y el bebé duermen, el oso grande maneja a casa de la abuela",
  },
  sticky: {
    title: "Puaj, patas pegajosas",
    caption: "Patas llenas de pintura, a Osito le da asco",
    intro: [{ narration: "Osito y Zorrito pintan con pintura de dedos." }, { narration: "Ahora las patas de Osito están todas pegajosas. ¡Puaj! Le da asco." }],
    steps: [
      {
        caption: "Levantar las patas y soplar",
        question: "La pintura se pega en las patas. ¡Puaj! ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito levanta las patas.", line: "¡Puaj, se pega!" }, { narration: "Luego suelta el aire muy despacio. Fuuuh. Ya está mejor." }],
        instead: {
          caption: "Limpiarse las patas en Zorrito",
          answer: "Mmm, ahora la camiseta de Zorrito está llena de pintura, y llora. Mejor levanta las patas y sopla.",
        },
      },
      {
        caption: "Lavarse las patas",
        question: "Osito quiere las patas limpias. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito va al lavabo y se lava las patas." }, { line: "¡Todo limpio!" }],
        instead: { caption: "Tirar el vaso de pintura", answer: "Mmm, ahora hay pintura en toda la mesa. Mejor lávate las patas." },
      },
      {
        caption: "Pintar con el pincel",
        question: "A Osito no le gusta pintar con los dedos. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito toma el pincel y sigue pintando.", line: "¡Así también se puede!" }, { narration: "¡Un árbol y un sol!" }],
        instead: {
          caption: "Arrugar el dibujo de Zorrito",
          answer: "Mmm, ahora el dibujo de Zorrito está arruinado, y llora. Mejor sigue pintando con el pincel.",
        },
      },
    ],
    outro: [{ narration: "¡Súper! Levantar las patas y soplar, lavarse, pintar con el pincel. Ahora los dos enseñan sus dibujos." }],
    endCaption: "Osito y Zorrito levantan sus dibujos",
  },
  nappy: {
    title: "Puf, el pañal huele feo",
    caption: "El pañal del bebé huele feo, Osito arruga la nariz",
    intro: [{ narration: "Osito juega con su carrito. El bebé está sentado a su lado." }, { narration: "¡Puf! El pañal del bebé huele feo. ¡Puaj!" }],
    steps: [
      {
        caption: "Taparse la nariz y reírse",
        question: "El pañal del bebé huele feo. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito se tapa la nariz.", line: "¡Puuuf!" }, { narration: "Se ríe. El bebé se ríe también." }],
        instead: { caption: "Empujar al bebé", answer: "Mmm, ahora el bebé se cayó y llora. Mejor tápate la nariz." },
      },
      {
        caption: "Abrir la ventana",
        question: "El cuarto huele a pañal. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito abre la ventana." }, { narration: "Entra aire fresco. ¡Aaah!" }],
        instead: { caption: "Aventarle el carrito al bebé", answer: "Mmm, el carrito le pega al bebé. Eso duele. Mejor abre la ventana." },
      },
      {
        caption: "Pasar un pañal limpio",
        question: "El oso grande quiere cambiarle el pañal al bebé. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito toma el pañal limpio y se lo da al oso grande.", line: "¡Toma!" }, { line: "¡Gracias! Me ayudas mucho." }],
        instead: {
          caption: "Salir corriendo y azotar la puerta",
          answer: "Mmm, la puerta suena muy fuerte, y el bebé se asusta. Mejor dale al oso grande el pañal limpio.",
        },
      },
    ],
    outro: [{ narration: "¡Súper! Taparse la nariz, abrir la ventana, ayudar. Ahora el bebé huele rico y se ríe." }],
    endCaption: "El bebé con pañal limpio se ríe con Osito",
  },
  socks: {
    title: "Puaj, calcetines mojados",
    caption: "Agua en la bota, a Osito le da asco",
    intro: [{ narration: "Llovió. Osito y Zorrito salen a pasear." }, { narration: "¡Plaf! Osito pisa un charco hondo. ¡Agua en la bota! ¡Puaj!" }],
    steps: [
      {
        caption: "Sacudir el pie",
        question: "Hay agua en la bota. ¡Puaj! ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito sacude el pie muy fuerte.", line: "¡Puaj, todo mojado!" }, { narration: "Y le da risa." }],
        instead: { caption: "Empujar a Zorrito al charco", answer: "Mmm, ahora Zorrito está sentado en el charco y llora. Mejor sacude tu pie muy fuerte." },
      },
      {
        caption: "Vaciar la bota",
        question: "La bota está llena de agua. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Se sienta en la banca y se quita la bota." }, { narration: "Luego la voltea. ¡Plaf!", line: "¡Fuera el agua!" }],
        instead: { caption: "Aventarle la bota a Zorrito", answer: "Mmm, la bota le pega a Zorrito. Eso duele. Mejor siéntate en la banca y vacíala." },
      },
      {
        caption: "Exprimir el calcetín",
        question: "El calcetín está empapado. ¿Qué puede hacer Osito?",
        beats: [
          { narration: "Se quita el calcetín mojado y lo exprime. ¡Plic, plic!" },
          { narration: "Luego se pone otra vez la bota.", line: "¡Mucho mejor!" },
        ],
        instead: { caption: "Salpicar a Zorrito", answer: "Mmm, ahora Zorrito también está mojado y llora. Mejor exprime tu calcetín." },
      },
    ],
    outro: [{ narration: "¡Súper! Sacudir el pie, vaciar la bota, exprimir el calcetín. ¡Y a seguir!" }],
    endCaption: "Osito y Zorrito siguen paseando y se ríen",
  },
  lick: {
    title: "Puaj, el perro lame",
    caption: "Un perro lame a Osito, a Osito le da asco",
    intro: [
      { narration: "Osito está en el parque. Ahí viene la señora Zorro con un perrito." },
      { narration: "¡Slurp! El perro le lame toda la cara. ¡Puaj!" },
    ],
    steps: [
      {
        caption: "Decir «¡No me lamas!»",
        question: "El perro le lame la cara a Osito. ¿Qué puede hacer Osito?",
        beats: [
          { narration: "Osito voltea la cara y dice fuerte:", line: "¡No me lamas!" },
          { line: "¡Ay, perdón! ¡Sentado, perrito!" },
          { narration: "El perro se sienta muy obediente." },
        ],
        instead: { caption: "Pegarle al perro", answer: "Mmm, pegar le duele al perro. Mejor voltea la cara y di: ¡No me lamas!" },
      },
      {
        caption: "Limpiarse la cara",
        question: "La cara está toda mojada. ¡Puaj! ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito se limpia la cara con la pata.", line: "¡Puaj!" }, { narration: "Y luego le da risa." }],
        instead: { caption: "Jalarle las orejas", answer: "Mmm, eso le duele al perro. Mejor límpiate la cara." },
      },
      {
        caption: "Acariciarle la espalda",
        question: "El perrito es muy bueno. ¿Qué puede hacer Osito?",
        beats: [
          { narration: "La señora Zorro señala la espalda del perro.", line: "Aquí le gusta." },
          { narration: "Osito lo acaricia con mucho cuidado.", line: "¡Qué suavecito!" },
          { narration: "El perro mueve la cola." },
        ],
        instead: { caption: "Aventarle un palo al perro", answer: "Mmm, el palo le pega al perro. Mejor acarícialo con mucho cuidado en la espalda." },
      },
    ],
    outro: [{ narration: "¡Súper! Decir no, limpiarse la cara, acariciar con cuidado. ¡Adiós, perrito!" }],
    endCaption: "El perro mueve la cola, Osito le dice adiós",
  },
  paintbrush: {
    title: "Enojo, el bebé agarra el pincel",
    caption: "El bebé tiene el pincel, Osito está enojado",
    intro: [
      { narration: "Osito pinta en la mesa. El bebé oso está sentado a su lado." },
      { narration: "¡Zas! El bebé le agarra el pincel a Osito y embarra todo. ¡Osito está enojado!" },
    ],
    steps: [
      {
        caption: "Decir «¡Es mío!»",
        question: "El bebé tiene el pincel de Osito. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito dice fuerte:", line: "¡Es mío! Dámelo, por favor." }, { narration: "El bebé lo mira. Luego le da el pincel." }],
        instead: { caption: "Arrebatarle el pincel", answer: "Mmm, ahora el bebé llora. Mejor di fuerte: ¡Es mío!" },
      },
      {
        caption: "Golpear el cojín",
        question: "¡Osito está tan enojado! ¿Qué puede hacer él?",
        beats: [{ narration: "Va al sillón y golpea el cojín. ¡Pum, pum, pum!" }, { narration: "Ya se le pasó el enojo.", line: "Uf. Ya estoy mejor." }],
        instead: {
          caption: "Aventar el vaso de pintura",
          answer: "Mmm, ahora hay pintura por todos lados, y el bebé se asusta. Mejor golpea el cojín del sillón.",
        },
      },
      {
        caption: "Darle un crayón",
        question: "El bebé también quiere pintar. ¿Qué puede hacer Osito?",
        beats: [
          { narration: "Osito le da un crayón al bebé.", line: "¡Toma, este es para ti!" },
          { narration: "El bebé suelta el pincel. Ahora pintan los dos." },
        ],
        instead: { caption: "Romper la hoja del bebé", answer: "Mmm, ahora la hoja está rota y el bebé llora. Mejor dale un crayón." },
      },
    ],
    outro: [{ narration: "¡Súper! Decir lo que es tuyo, golpear el cojín, pintar juntos." }],
    endCaption: "Osito y el bebé pintan juntos",
  },
  bluecup: {
    title: "Enojo, el vaso azul",
    caption: "La leche en el vaso rojo, Osito está enojado",
    intro: [{ narration: "¡Desayuno! El oso grande sirve leche en el vaso rojo." }, { narration: "¡Pero Osito quiere el azul! Está enojado." }],
    steps: [
      {
        caption: "Decir «¡Quiero el azul!»",
        question: "Osito quiere el vaso azul. ¿Qué puede hacer él?",
        beats: [
          { narration: "Osito dice fuerte:", line: "¡Quiero el vaso azul!" },
          { line: "Ah, el azul. ¡Qué bueno que lo dices!" },
          { narration: "El oso grande pone el vaso azul en la mesa." },
        ],
        instead: { caption: "Tirar el vaso rojo", answer: "Mmm, ahora la leche se derramó. Mejor di fuerte: ¡Quiero el azul!" },
      },
      {
        caption: "Zapatear muy fuerte",
        question: "Osito está muy enojado. ¿Qué puede hacer él?",
        beats: [{ narration: "Osito zapatea muy fuerte con los dos pies. ¡Pum, pum!" }, { line: "Uf. Ya estoy mejor." }],
        instead: { caption: "Golpear con la cuchara", answer: "Mmm, eso hace mucho ruido, y la avena salpica por todos lados. Mejor zapatea muy fuerte." },
      },
      {
        caption: "Pasar la leche él mismo",
        question: "La leche está en el vaso rojo. ¿Qué puede hacer Osito?",
        beats: [
          { narration: "Osito trae el vaso azul. El oso grande lo detiene." },
          { narration: "Y Osito pasa la leche él mismo. ¡Glu, glu!", line: "¡Lo logré!" },
        ],
        instead: { caption: "Tirar la avena", answer: "Mmm, ahora el plato está roto y la avena está en el piso. Mejor pasa tú la leche al vaso azul." },
      },
    ],
    outro: [{ narration: "¡Súper! Decir lo que quieres, zapatear muy fuerte, pasar la leche por tu cuenta. ¡Buen provecho!" }],
    endCaption: "Osito toma feliz de su vaso azul",
  },
  nap: {
    title: "Sin sueño a la hora de la siesta",
    caption: "Todos duermen, Osito no tiene nada de sueño",
    intro: [
      { narration: "Hora de la siesta en la guardería. Zorrito y Erizo ya duermen." },
      { narration: "Solo Osito no tiene nada de sueño. Se mueve y se mueve. No se puede dormir." },
    ],
    steps: [
      {
        caption: "Apretar el conejo de peluche",
        question: "Todos duermen, solo Osito no. ¿Qué puede hacer él?",
        beats: [
          { narration: "Osito aprieta muy fuerte su conejo de peluche.", line: "Buenas noches, conejo." },
          { narration: "Muy suavecito y calientito. Se va calmando." },
        ],
        instead: { caption: "Picar a Zorrito", answer: "Mmm, ahora Zorrito se despertó y llora. Mejor aprieta muy fuerte tu conejo de peluche." },
      },
      {
        caption: "Soplar despacio",
        question: "Osito se mueve y se mueve. ¿Qué puede hacer él?",
        beats: [{ narration: "Sopla muy despacio, como a una vela. Fuuuh." }, { narration: "Y otra vez. Los brazos se sienten muy pesados." }],
        instead: { caption: "Cantar fuerte", answer: "Mmm, ahora todos se despertaron, y Erizo llora. Mejor sopla muy despacio." },
      },
      {
        caption: "Pensar en algo bonito",
        question: "Osito no se puede dormir. ¿Qué puede hacer él?",
        beats: [
          { narration: "Se queda acostado sin moverse y piensa en algo bonito." },
          { narration: "En el columpio. Para acá y para allá, para acá y para allá." },
        ],
        instead: { caption: "Correr por el salón", answer: "Mmm, se tropieza con Erizo. Eso duele. Mejor no te muevas y piensa en algo bonito." },
      },
    ],
    outro: [{ narration: "¡Súper! Apretar el conejo de peluche, soplar despacio, pensar en algo bonito. Y ya se durmió." }],
    endCaption: "Osito duerme con su conejo de peluche",
  },
  teeth: {
    title: "Enojo al lavarse los dientes",
    caption: "Boca cerrada, Osito no quiere lavarse los dientes",
    intro: [
      { narration: "Es de noche. Osito ya tiene puesta la pijama." },
      { narration: "El oso grande le da el cepillo de dientes. ¡Pero Osito no quiere! Cierra la boca muy fuerte." },
    ],
    steps: [
      {
        caption: "Zapatear muy fuerte",
        question: "Osito no quiere lavarse los dientes. ¿Qué puede hacer él?",
        beats: [
          { narration: "Osito zapatea muy fuerte con los dos pies.", line: "¡No quiero!" },
          { line: "Lo sé. Zapatea fuerte, está bien." },
          { narration: "Uf. Ya se le pasó el enojo." },
        ],
        instead: { caption: "Tirar el cepillo de un manotazo", answer: "Mmm, ahora el cepillo está en el piso. Mejor zapatea muy fuerte y di: ¡No quiero!" },
      },
      {
        caption: "Voltear el reloj de arena",
        question: "Lavarse los dientes tarda mucho. ¿Qué puede hacer Osito?",
        beats: [
          { narration: "Osito voltea él mismo el reloj de arena.", line: "¡Vamos!" },
          { narration: "La arena cae. Ahora a lavar hasta que esté toda abajo." },
        ],
        instead: { caption: "Salir corriendo", answer: "Mmm, en el piso liso se resbala. Mejor voltea tú el reloj de arena." },
      },
      {
        caption: "Lavarse él mismo",
        question: "El oso grande le da el cepillo de dientes. ¿Qué puede hacer Osito?",
        beats: [
          { narration: "Osito toma el cepillo y se lava los dientes él mismo. ¡Ras, ras!" },
          { narration: "Luego le enseña los dientes al espejo.", line: "¡Mira, bien limpios!" },
        ],
        instead: { caption: "Tirar el vaso", answer: "Mmm, ahora el vaso está roto. Mejor lávate tú los dientes y enséñaselos al espejo." },
      },
    ],
    outro: [{ narration: "¡Súper! Zapatear, voltear el reloj de arena, lavarse sin ayuda. ¡Relucientes!" }],
    endCaption: "Osito enseña sus dientes limpios en el espejo",
  },
  bedtime: {
    title: "Enojo, todavía no a la cama",
    caption: "Hora de dormir, Osito quiere seguir jugando",
    intro: [
      { narration: "Es de noche. Osito juega en pijama con su tren." },
      { narration: "El oso grande tiene un libro de cuentos.", line: "¡Ven, hora de dormir!" },
      { narration: "Osito dice que no con la cabeza. Está enojado." },
    ],
    steps: [
      {
        caption: "Apretar los puños",
        question: "Osito quiere seguir jugando. ¿Qué puede hacer él?",
        beats: [
          { narration: "Osito aprieta los puños muy fuerte y dice:", line: "¡Quiero seguir jugando!" },
          { line: "Lo sé. Una vuelta más, y luego a dormir." },
          { narration: "Abre los puños. Uf." },
        ],
        instead: { caption: "Aventar el tren", answer: "Mmm, ahora la locomotora está rota. Mejor aprieta los puños y di: ¡Quiero seguir jugando!" },
      },
      {
        caption: "Meter el tren al túnel",
        question: "Es hora de dormir para el tren. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito mete él mismo el tren al túnel.", line: "¡Buenas noches, tren!" }, { narration: "Chu-chu. Ahora el tren duerme." }],
        instead: { caption: "Romper las vías a patadas", answer: "Mmm, ahora las vías están rotas. Mejor mete el tren al túnel: ¡Buenas noches, tren!" },
      },
      {
        caption: "Escoger un libro",
        question: "Ahorita le van a leer un cuento. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito escoge él mismo un libro del librero.", line: "¡Este! El de la luna." }, { line: "Ay, qué bonito. Ven, te lo leo." }],
        instead: { caption: "Romper el libro", answer: "Mmm, ahora el libro está roto. Mejor escoge tú un libro." },
      },
    ],
    outro: [{ narration: "¡Súper! Apretar los puños, darle las buenas noches al tren, escoger un libro. Ahora, a leer." }],
    endCaption: "El oso grande lee un cuento, Osito se acurruca con él",
  },
};
