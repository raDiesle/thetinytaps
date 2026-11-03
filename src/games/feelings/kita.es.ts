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
        caption: "Mostrar las dos mitades",
        question: "Osito todavía está un poquito triste. ¿Qué puede hacer él?",
        beats: [{ narration: "Mira las mitades. ¡Una, dos!", line: "¡Ahora tengo dos galletas!" }],
        instead: { caption: "Hacer migas la galleta", answer: "Mmm, ahora la galleta ya no está. Mejor mira: ¡ahora tienes dos!" },
      },
      {
        caption: "Compartir con Zorrito",
        question: "Zorrito ya no tiene galleta. ¿Qué puede hacer Osito?",
        beats: [{ narration: "Osito le da una mitad a Zorrito.", line: "¡Para ti!" }, { line: "¡Gracias, Osito!" }],
        instead: { caption: "Sacar la lengua", answer: "Mmm, ahora Zorrito está triste. Mejor comparte con él." },
      },
    ],
    outro: [{ narration: "¡Genial! Estar triste está bien. Apretar el peluche, mirar de otra forma, compartir." }],
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
};
