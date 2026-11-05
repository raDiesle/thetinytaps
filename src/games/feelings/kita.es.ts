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
    title: "Tristeza, el peluche no está",
    caption: "El peluche no está, Osito llora",
    intro: [{ narration: "Osito quiere irse a dormir." }, { narration: "¡Pero su peluche no está! Está muy triste." }],
    steps: [
      {
        caption: "Decir «Estoy triste»",
        question: "El peluche no está. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito dice:", line: "Estoy triste. Mi peluche no está." }, { line: "Ay. Eso da tristeza." }],
        instead: { caption: "Vaciar la caja de juguetes", answer: "Mmm, ahora todo está revuelto. Mejor di cómo te sientes." },
      },
      {
        caption: "Buscarlo él mismo",
        question: "¿Dónde puede estar el peluche? ¿Qué puede hacer Osito?",
        beats: [{ narration: "Busca él mismo. ¿Debajo de la cama? No." }, { narration: "¿En la canasta? ¡Ahí está!" }],
        instead: { caption: "Quitarle el suyo a Zorrito", answer: "Mmm, ahora Zorrito está triste. Mejor busca tú." },
      },
      {
        caption: "Abrazarlo muy fuerte",
        question: "¡Ahí está el peluche! ¿Qué puede hacer Osito?",
        beats: [{ narration: "Lo abraza muy fuerte.", line: "¡Aquí estás!" }],
        instead: { caption: "Tirarlo al rincón", answer: "Mmm, ahora otra vez está solito en el rincón. Mejor abrázalo muy fuerte." },
      },
    ],
    outro: [{ narration: "¡Qué bien! Decir cómo te sientes, buscar, abrazar fuerte." }],
    endCaption: "Osito abraza su peluche en la cama",
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
      // „Komm doch auch hoch!“ rufen (4. November 2026): told in German until translated.
      null,
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
      // „Mit dem Fuchs Kochen spielen“ is new in German (November 2026): told in German until translated.
      null,
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
      // „Mit dem Fuchs Kuchen essen“ is new in German (November 2026): told in German until translated.
      null,
    ],
  },
};
