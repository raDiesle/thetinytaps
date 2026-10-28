import type { SceneTranslation } from "../types";

// The Spanish words of the Hof am Teich picture: names (without article, with gender for el/la,
// `plural` for „pollitos“ and „cerditos“), what each item says and the chain sentences.
// Neutral Spanish for Spain and Latin America.

/** „Hof am Teich“ in Spanish. */
export const ES: SceneTranslation = {
  title: "Granja del estanque",
  description: "Pato, rana y cerditos junto al estanque de la granja.",
  items: {
    sonne: { name: "sol", gender: "m", sentences: ["¡El sol brilla!", "El sol sonríe."] },
    wolke: { name: "nube", gender: "f", sentences: ["La nube trae lluvia. ¡Plic, plac!", "La lluvia es buena para las plantas."] },
    windmuehle: { name: "molino", gender: "m", sentences: ["El viento mueve el molino.", "En el molino se hace harina."] },
    vogelscheuche: { name: "espantapájaros", gender: "m", sentences: ["El espantapájaros se mueve. ¡Fuera, cuervos!", "El espantapájaros cuida el campo."] },
    bauernhaus: {
      name: "casa de campo",
      gender: "f",
      sentences: ["En la casa de campo vive la familia granjera.", "La granjera saluda desde la ventana. ¡Hola!"],
    },
    scheune: { name: "granero", gender: "m", sentences: ["Las puertas del granero se abren.", "En el granero está el heno.", "¡Sale volando una golondrina!"] },
    storch: { name: "cigüeña", gender: "f", sentences: ["¡Cla, cla! La cigüeña hace ruido con el pico.", "La cigüeña vive arriba en el nido."] },
    apfelbaum: { name: "manzano", gender: "m", sentences: ["En el manzano crecen manzanas rojas.", "¡Plof! Se cae una manzana."] },
    schaf: { name: "oveja", gender: "f", sentences: ["¡Beee! La oveja salta.", "La oveja tiene lana suave."] },
    lamm: { name: "corderito", gender: "m", sentences: ["¡Beee! El corderito llama a su mamá.", "El corderito es muy pequeño."] },
    huehnerstall: { name: "gallinero", gender: "m", sentences: ["En el gallinero duermen las gallinas.", "La puerta se abre. ¡Sale rodando un huevo!"] },
    hahn: { name: "gallo", gender: "m", sentences: ["¡Quiquiriquí! El gallo canta.", "El gallo despierta a todos."] },
    kuh: { name: "vaca", gender: "f", sentences: ["¡Muuu! La vaca da leche.", "La vaca come hierba.", "Tolón, tolón, hace el cencerro."] },
    ziege: { name: "cabra", gender: "f", sentences: ["¡Meee! La cabra empuja con la cabeza.", "La cabra tiene barba."] },
    pferd: {
      name: "caballo",
      gender: "m",
      sentences: ["¡Iiiih! El caballo se levanta sobre las patas.", "El caballo tiene una crin larga.", "El caballo corre muy rápido."],
    },
    hund: { name: "perro", gender: "m", sentences: ["¡Guau, guau! El perro se llama Bello.", "El perro cuida la granja."] },
    huhn: { name: "gallina", gender: "f", sentences: ["¡Coc, coc! La gallina picotea granos.", "La gallina pone huevos."] },
    gans: { name: "oca", gender: "f", sentences: ["¡Cua, cua, cua! La oca estira el cuello.", "La oca lleva un lazo azul."] },
    kueken: { name: "pollitos", gender: "m", plural: true, sentences: ["¡Pío, pío! Los pollitos saltan.", "Los pollitos son pequeños y amarillos."] },
    bauer: {
      name: "granjero",
      gender: "m",
      sentences: ["El granjero silba una canción.", "En la carretilla hay verduras.", "¡Hola! El granjero saluda con el sombrero."],
    },
    traktor: { name: "tractor", gender: "m", sentences: ["¡Pof, pof, pof! El tractor arranca.", "El tractor es rojo.", "El tractor tiene ruedas grandes."] },
    heuballen: { name: "fardo de heno", gender: "m", sentences: ["El heno es la comida de los animales.", "El fardo de heno es redondo."] },
    katze: { name: "gato", gender: "m", sentences: ["¡Miau! El gato se ha despertado.", "Al gato le gusta dormir en el heno."] },
    kuerbis: { name: "calabaza", gender: "f", sentences: ["La calabaza es grande y naranja.", "La calabaza crece en el huerto."] },
    schwein: {
      name: "cerdo",
      gender: "m",
      sentences: ["¡Oinc, oinc! El cerdo juega en el barro.", "Al cerdo le encanta el barro.", "El cerdo tiene la cola rizada."],
    },
    ente: { name: "pato", gender: "m", sentences: ["¡La cabeza en el agua, la colita para arriba!", "¡Cua, cua! El pato nada en el estanque."] },
    frosch: { name: "rana", gender: "f", sentences: ["¡Croac! La rana salta alto.", "La rana está sentada en una hoja de nenúfar."] },
    bienenkorb: { name: "colmena", gender: "f", sentences: ["En la colmena viven las abejas.", "¡Bzzz! Salen las abejas."] },
    biene: { name: "abeja", gender: "f", sentences: ["¡Bzzz! La abeja vuela.", "La abeja hace miel."] },
    blumen: { name: "flores", gender: "f", plural: true, sentences: ["Las flores crecen en el prado.", "Rojo, azul, amarillo y blanco."] },
    schmetterling: { name: "mariposa", gender: "f", sentences: ["La mariposa es amarilla como un limón.", "La mariposa vuela de flor en flor."] },
    ferkel: { name: "cerditos", gender: "m", plural: true, sentences: ["Los cerditos son los hijos del cerdo.", "¡Oinc! Los cerditos saltan."] },
    hase: { name: "conejo", gender: "m", sentences: ["¡Hop, hop! El conejo salta.", "El conejo mordisquea una zanahoria."] },
    schnecke: { name: "caracol", gender: "m", sentences: ["El caracol avanza muy despacio.", "El caracol lleva su casa en la espalda."] },
    maus: { name: "ratón", gender: "m", sentences: ["¡Pii! El ratón ha encontrado una espiga.", "¡Hola, ratoncito!"] },
  },
  chains: [
    ["La gallina cacarea: ¡buenos días!", "¡Y los pollitos pían también!"],
    ["El gato se despierta: ¡miau!", "Y el ratón chilla: ¡socorro, el gato!"],
    ["El pato mete la cabeza en el agua.", "Y la cigüeña hace cla, cla: ¿dónde está la rana?"],
  ],
};
