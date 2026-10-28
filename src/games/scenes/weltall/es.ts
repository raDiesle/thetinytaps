import type { SceneTranslation } from "../types";

// The Spanish words of the Weltall picture: names (without article, with gender for el/la,
// `plural` for „estrellas“ and „paneles solares“), what each item says and the chain sentences.
// Mars and Saturn are „planeta Marte“ and „planeta Saturno“, since Spanish says the planet's own
// name without an article; „Tierra“ keeps its capital letter (la Tierra). Neutral Spanish for Spain and Latin America.

/** „Weltall“ in Spanish. */
export const ES: SceneTranslation = {
  title: "Espacio",
  description: "Cohete, ovni y planetas en la Luna.",
  items: {
    erde: { name: "Tierra", gender: "f", sentences: ["¡Hola, Tierra! Ahí vivimos.", "La Tierra gira.", "La Tierra es azul y verde."] },
    mars: { name: "planeta Marte", gender: "m", sentences: ["Marte es rojo.", "Marte gira. Su lunita vuela con él."] },
    saturn: { name: "planeta Saturno", gender: "m", sentences: ["Saturno tiene un anillo.", "El anillo da vueltas y vueltas.", "Saturno guiña un ojo."] },
    sterne: { name: "estrellas", gender: "f", plural: true, sentences: ["Las estrellas brillan.", "¡Brilla, brilla, estrellita!"] },
    stern: { name: "estrella", gender: "f", sentences: ["La estrella brilla mucho.", "La estrella gira y guiña un ojo."] },
    sternschnuppe: { name: "estrella fugaz", gender: "f", sentences: ["¡Fiuuu! La estrella fugaz pasa volando.", "¡Pide un deseo!"] },
    komet: { name: "cometa", gender: "m", sentences: ["El cometa tiene una cola larga.", "¡Fiuuu! El cometa vuela por el espacio."] },
    asteroid: { name: "asteroide", gender: "m", sentences: ["El asteroide da volteretas por el espacio.", "¡Pataplum!"] },
    satellit: { name: "satélite", gender: "m", sentences: ["¡Pi, pi! El satélite envía mensajes.", "El satélite abre sus alas."] },
    raumstation: { name: "estación espacial", gender: "f", sentences: ["En la estación espacial viven astronautas.", "Las ventanas se encienden. ¡Hola!"] },
    astronaut: { name: "astronauta", gender: "m", sentences: ["El astronauta flota en el espacio.", "¡El astronauta te saluda!"] },
    ufo: { name: "ovni", gender: "m", sentences: ["¡Uiu, uiu! El ovni brilla.", "En el ovni hay un extraterrestre pequeño.", "El ovni flota."] },
    flagge: { name: "bandera", gender: "f", sentences: ["La bandera ondea.", "En la bandera hay una estrella."] },
    solarzellen: { name: "paneles solares", gender: "m", plural: true, sentences: ["Los paneles solares atrapan la luz del sol.", "Así hay electricidad."] },
    antenne: { name: "antena", gender: "f", sentences: ["La antena manda saludos a la Tierra.", "¡Ping! La antena gira."] },
    landefaehre: { name: "módulo lunar", gender: "m", sentences: ["El módulo lunar ha aterrizado en la Luna.", "La puerta se abre. ¿Quién se asoma?"] },
    mondbasis: {
      name: "base lunar",
      gender: "f",
      sentences: ["¡Din, don! En la base lunar viven astronautas.", "La puerta se abre y alguien saluda.", "Las ventanas brillan."],
    },
    rakete: {
      name: "cohete",
      gender: "m",
      sentences: ["Tres, dos, uno… ¡despegue! El cohete vuela.", "El cohete sube muy alto y vuelve a aterrizar.", "El cohete es rojo y blanco."],
    },
    weltraumblume: { name: "flor espacial", gender: "f", sentences: ["La flor espacial gira sus pétalos.", "La flor se ríe. ¡Brilla, brilla!"] },
    gewaechshaus: { name: "invernadero", gender: "m", sentences: ["En el invernadero crecen tomates.", "¡Plic, plac! Las plantas reciben agua."] },
    ausserirdischer: {
      name: "extraterrestre",
      gender: "m",
      sentences: ["¡Blip, blop! El extraterrestre dice hola.", "El extraterrestre salta y saluda.", "Tiene dos antenas."],
    },
    mondbagger: { name: "excavadora lunar", gender: "f", sentences: ["¡Brum! La excavadora lunar recoge polvo de luna.", "La excavadora lunar es amarilla."] },
    alienbaby: { name: "bebé extraterrestre", gender: "m", sentences: ["El bebé extraterrestre se ríe.", "¡Chiqui, chiqui! El bebé extraterrestre juega."] },
    buggy: { name: "coche lunar", gender: "m", sentences: ["El coche lunar recorre la Luna.", "¡Traca, traca! ¡Pi, pi!"] },
    mondhase: {
      name: "conejo lunar",
      gender: "m",
      sentences: ["¡Hop! El conejo lunar salta muy alto.", "En la Luna se puede saltar muy alto.", "El conejo lunar tiene una zanahoria."],
    },
    krater: { name: "cráter", gender: "m", sentences: ["Esto es un cráter. Un agujero en la Luna.", "¡Hop, hop! Las piedras saltan."] },
    roboterhund: { name: "perro robot", gender: "m", sentences: ["¡Guau, bip! El perro robot ladra.", "El perro robot mueve la cola."] },
    kristall: { name: "cristal", gender: "m", sentences: ["El cristal brilla azul.", "El cristal da luz."] },
    helm: { name: "casco", gender: "m", sentences: ["¡Cucú! Detrás del casco vive un extraterrestre pequeño.", "El casco se tambalea."] },
    mondball: { name: "pelota", gender: "f", sentences: ["¡Boing, boing! La pelota rebota.", "En la Luna la pelota rebota muy alto."] },
    kiste: { name: "caja", gender: "f", sentences: ["La caja se abre. ¿Qué hay dentro?", "¡Sale una estrella de un salto!"] },
    maus: { name: "ratón", gender: "m", sentences: ["¡Pii! El ratón mordisquea el queso de la Luna.", "La Luna es de queso, dice el ratón."] },
    astronautin: { name: "astronauta", gender: "f", sentences: ["La astronauta salta por la Luna.", "La astronauta saluda. ¡Hola!"] },
    fernrohr: { name: "telescopio", gender: "m", sentences: ["Con el telescopio se ven las estrellas.", "El telescopio mira hacia arriba."] },
    roboter: { name: "robot", gender: "m", sentences: ["¡Bip, bop, bip! El robot habla.", "El robot levanta los brazos.", "El robot es azul."] },
  },
  chains: [
    ["¡El extraterrestre saluda al ovni!", "Y el bebé extraterrestre se ríe y salta."],
    ["¡Con el telescopio se ve Saturno!", "Y ahí pasa volando un cometa."],
    ["¡El conejo lunar se asusta y salta muy alto!", "El ratón se asoma por el queso."],
  ],
};
