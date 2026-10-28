import type { SceneTranslation } from "../types";

// The Spanish words of the Bauernhof picture: names (without article, with gender for el/la),
// what each item says and the chain sentences. Neutral Spanish for Spain and Latin America.

/** „Bauernhof“ in Spanish. */
export const ES: SceneTranslation = {
  title: "Granja",
  description: "Vaca, tractor y cerdo en la granja.",
  items: {
    sonne: { name: "sol", gender: "m", sentences: ["¡El sol brilla!", "El sol sonríe."] },
    wolke: { name: "nube", gender: "f", sentences: ["La nube trae lluvia. ¡Plic, plac!", "La lluvia es buena para las flores."] },
    schwalbe: { name: "golondrina", gender: "f", sentences: ["¡La golondrina vuela muy rápido!", "¡Fiu, fiu! La golondrina cruza el cielo."] },
    windmuehle: { name: "molino", gender: "m", sentences: ["El molino gira con el viento.", "En el molino se hace harina."] },
    maehdrescher: { name: "cosechadora", gender: "f", sentences: ["La cosechadora corta el trigo.", "¡Brum! El grano sale por arriba."] },
    bauernhaus: {
      name: "casa de campo",
      gender: "f",
      sentences: [
        "En la casa de campo vive la familia granjera.",
        "¡Hola! La granjera saluda desde la ventana.",
        "La puerta se abre. ¿Quién está ahí?",
        "¡Se enciende la luz!",
      ],
    },
    storch: { name: "cigüeña", gender: "f", sentences: ["¡Cla, cla! La cigüeña hace ruido con el pico.", "La cigüeña vive arriba en el nido."] },
    katze: { name: "gato", gender: "m", sentences: ["¡Miau! El gato está delante de la puerta.", "El gato se lava."] },
    scheune: { name: "granero", gender: "m", sentences: ["Las puertas se abren. ¡En el granero hay heno!", "El granero es grande y rojo."] },
    eule: { name: "lechuza", gender: "f", sentences: ["¡Uh, uh! La lechuza vive en el granero.", "La lechuza tiene ojos grandes."] },
    baum: { name: "manzano", gender: "m", sentences: ["¡Plof! Las manzanas caen a la hierba.", "En el manzano crecen manzanas rojas."] },
    hahn: { name: "gallo", gender: "m", sentences: ["¡Quiquiriquí! El gallo canta.", "El gallo está sentado en la valla."] },
    pferd: { name: "caballo", gender: "m", sentences: ["¡Arre! El caballo se levanta sobre las patas.", "El caballo relincha.", "El caballo es marrón."] },
    heuballen: { name: "fardo de heno", gender: "m", sentences: ["¡El fardo de heno rueda!", "El heno es la comida de las vacas."] },
    vogelscheuche: { name: "espantapájaros", gender: "m", sentences: ["El espantapájaros se mueve. ¡Fuera, pájaros!", "El espantapájaros lleva sombrero."] },
    schaf: { name: "oveja", gender: "f", sentences: ["¡Beee! La oveja salta.", "La oveja tiene lana suave."] },
    kuh: { name: "vaca", gender: "f", sentences: ["¡Muuu! La vaca da leche.", "La vaca come hierba.", "¡Tolón, tolón! Suena el cencerro."] },
    ziege: { name: "cabra", gender: "f", sentences: ["¡Meee! La cabra se pone de pie.", "La cabra tiene barba."] },
    bauer: { name: "granjero", gender: "m", sentences: ["¡Hola! El granjero saluda.", "El granjero tiene una horca."] },
    schubkarre: { name: "carretilla", gender: "f", sentences: ["En la carretilla hay calabazas.", "¡Uy, las calabazas saltan!"] },
    gans: { name: "oca", gender: "f", sentences: ["¡Cua, cua, cua! La oca está nerviosa.", "La oca es blanca."] },
    traktor: { name: "tractor", gender: "m", sentences: ["¡El tractor arranca!", "¡Pof, pof, pof! El tractor es rojo.", "El tractor tiene ruedas grandes."] },
    hund: { name: "perro", gender: "m", sentences: ["¡Guau, guau! El perro cuida la granja.", "El perro salta."] },
    pumpe: { name: "bomba de agua", gender: "f", sentences: ["¡A bombear! Ahí sale agua.", "El agua cae en el cubo."] },
    huhn: { name: "gallina", gender: "f", sentences: ["¡Coc, coc! La gallina picotea granos.", "¡La gallina ha puesto un huevo!"] },
    ente: { name: "pato", gender: "m", sentences: ["¡Cua, cua! El pato nada en el estanque.", "El pato mete la cabeza en el agua."] },
    hase: { name: "conejo", gender: "m", sentences: ["¡Hop, hop! El conejo salta.", "Al conejo le gustan las zanahorias."] },
    schwein: { name: "cerdo", gender: "m", sentences: ["¡Oinc, oinc! El cerdo se revuelca en el barro.", "El cerdo es rosa."] },
    frosch: { name: "rana", gender: "f", sentences: ["¡Croac! La rana salta alto.", "La rana está sentada en la hoja del nenúfar."] },
    kueken: { name: "pollito", gender: "m", sentences: ["¡Pío, pío! El pollito ha salido del huevo.", "El pollito es pequeño y amarillo."] },
    ferkel: { name: "cerdito", gender: "m", sentences: ["El cerdito es el bebé del cerdo.", "¡Oinc! El cerdito salta."] },
    biene: { name: "abeja", gender: "f", sentences: ["¡Bzzz! La abeja vuela a la flor.", "La abeja hace miel."] },
    schnecke: { name: "caracol", gender: "m", sentences: ["El caracol avanza muy despacio.", "El caracol lleva su casa en la espalda."] },
  },
  chains: [
    ["La oca se asusta: ¡cua, cua, cua!", "¡Y la cabra da un salto!"],
    ["¡Buenos días! La granjera se despierta.", "Y la vaca dice: ¡muuu!"],
    ["¡El cerdito también salta al barro!", "¡Puaj, la gallina se moja toda!"],
  ],
};
