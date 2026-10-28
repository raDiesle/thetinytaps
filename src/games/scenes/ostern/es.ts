import type { SceneTranslation } from "../types";

// The Spanish words of the Ostern picture: names (without article, with gender for el/la,
// `plural` for „tulipanes“ and „narcisos“), what each item says and the chain sentences. The Easter
// bunny is the „conejo de Pascua“; the eggs are told apart by colour („huevo verde“), noun first.
// Neutral Spanish for Spain and Latin America.

/** „Ostern“ in Spanish. */
export const ES: SceneTranslation = {
  title: "Pascua",
  description: "Conejo de Pascua, pollitos y huevos escondidos.",
  items: {
    sonne: { name: "sol", gender: "m", sentences: ["¡El sol brilla!", "El sol sonríe."] },
    wolke: { name: "nube", gender: "f", sentences: ["La nube trae lluvia. ¡Plic, plac!", "La nube es blanca y suave."] },
    gartentor: {
      name: "puerta del jardín",
      gender: "f",
      sentences: ["¡Ñic! La puerta del jardín se abre.", "¿Quién entra en el jardín?", "En la puerta cuelga una corona de Pascua."],
    },
    mutterschaf: { name: "oveja", gender: "f", sentences: ["¡Beee! La oveja llama a su corderito.", "La oveja tiene lana suave."] },
    laemmchen: {
      name: "corderito",
      gender: "m",
      sentences: ["¡El corderito salta de alegría!", "Tilín, tilín, hace la campanita.", "El corderito todavía es pequeño."],
    },
    nistkasten: {
      name: "casita de pájaros",
      gender: "f",
      sentences: ["¿Quién vive en la casita de pájaros? ¡Un pajarito!", "¡Chi-chi-pi! El pajarito canta."],
    },
    kirschbaum: {
      name: "cerezo",
      gender: "m",
      sentences: ["El cerezo tiene flores rosas.", "¡Uy! Las flores vuelan por el aire.", "En primavera los árboles florecen."],
    },
    amselnest: { name: "nido", gender: "m", sentences: ["¡Pío, pío! Los mirlos pequeños tienen hambre.", "La mamá mirlo trae un gusano."] },
    gartenhaus: {
      name: "caseta del jardín",
      gender: "f",
      sentences: ["La puerta de la caseta se abre.", "¿Quién está ahí dentro?", "En la caseta viven las cosas del jardín."],
    },
    osterstrauch: {
      name: "árbol de Pascua",
      gender: "m",
      sentences: ["Del árbol de Pascua cuelgan huevos de colores.", "Los huevos se balancean de un lado a otro.", "¿Cuántos huevos ves?"],
    },
    schubkarre: { name: "carretilla", gender: "f", sentences: ["En la carretilla hay flores.", "¡La carretilla se pone en marcha!"] },
    vogelbad: { name: "bebedero", gender: "m", sentences: ["El gorrión se baña. ¡Plic, plac!", "En el bebedero hay agua para los pájaros."] },
    henne: { name: "gallina", gender: "f", sentences: ["¡Coc, coc! La gallina ha puesto un huevo.", "La gallina está en el nido."] },
    maltisch: { name: "mesa de pintar", gender: "f", sentences: ["Aquí se pintan huevos.", "Rojo, amarillo y azul. ¡El huevo queda de colores!"] },
    schokohase: {
      name: "conejo de chocolate",
      gender: "m",
      sentences: ["El conejo de chocolate brilla dorado.", "¡Tilín! El conejo de chocolate tiene una campanita.", "¡Mmm, chocolate!"],
    },
    forsythie: { name: "arbusto amarillo", gender: "m", sentences: ["El arbusto tiene flores muy amarillas.", "Fris, fras, hace el arbusto."] },
    gruenesei: { name: "huevo verde", gender: "m", sentences: ["¡Ahí, debajo del arbusto! ¡Un huevo verde!", "El huevo verde rueda."] },
    hohlerbaum: {
      name: "árbol viejo",
      gender: "m",
      sentences: ["¡Toc, toc! El pájaro carpintero golpea el árbol.", "El árbol tiene un agujero. ¿Quién se asoma?", "En las ramas hay amentos de sauce."],
    },
    gelbesei: { name: "huevo amarillo", gender: "m", sentences: ["Escondido en el árbol: ¡un huevo amarillo!", "El huevo amarillo se mueve."] },
    eikueken: { name: "pollito", gender: "m", sentences: ["¡Crac! El pollito sale del huevo.", "¡Pío, pío! ¡Hola, pollito!"] },
    blauesei: { name: "huevo azul", gender: "m", sentences: ["¡Detrás de la maceta! ¡Un huevo azul!", "El huevo azul tiene puntos blancos."] },
    blumentopf: { name: "maceta", gender: "f", sentences: ["En la maceta florecen prímulas.", "La maceta se tambalea."] },
    tulpen: { name: "tulipanes", gender: "m", plural: true, sentences: ["Los tulipanes se abren.", "¡Tulipanes rojos, amarillos y lilas!"] },
    hummel: { name: "abejorro", gender: "m", sentences: ["¡Bzzz! El abejorro vuela a las flores.", "El abejorro es gordito y peludo."] },
    bollerwagen: { name: "carrito", gender: "m", sentences: ["El carrito rueda.", "En el carrito hay huevos y flores."] },
    osterglocken: {
      name: "narcisos",
      gender: "m",
      plural: true,
      sentences: ["¡Din, don! Los narcisos suenan como campanitas.", "Los narcisos son amarillos."],
    },
    zitronenfalter: { name: "mariposa", gender: "f", sentences: ["La mariposa amarilla revolotea.", "La mariposa es amarilla como un limón."] },
    regenwurm: { name: "lombriz", gender: "f", sentences: ["¡Hola, lombriz!", "La lombriz vive en la tierra."] },
    osterhase: {
      name: "conejo de Pascua",
      gender: "m",
      sentences: ["¡Hola! Soy el conejo de Pascua.", "¡Hop, hop! El conejo de Pascua trae los huevos.", "¡Felices Pascuas!"],
    },
    gartenzwerg: {
      name: "enanito de jardín",
      gender: "m",
      sentences: ["El enanito de jardín tiene sueño. ¡Aaah!", "El enanito de jardín tiene un gorro rojo."],
    },
    haeschen: { name: "conejito", gender: "m", sentences: ["¡Ñam, ñam! El conejito come una zanahoria.", "El conejito mueve la nariz."] },
    korbkind: { name: "niña", gender: "f", sentences: ["¡Yupi! ¡He encontrado un huevo!", "La niña busca huevos de Pascua."] },
    eierlauf: { name: "niño", gender: "m", sentences: ["¡Carrera de huevos! El huevo se mueve en la cuchara.", "¡Uy! Casi se cae el huevo."] },
    osternest: {
      name: "cesta de Pascua",
      gender: "f",
      sentences: ["¡La cesta de Pascua está llena de huevos!", "En la cesta también hay un huevo de chocolate."],
    },
    giesskanne: { name: "regadera", gender: "f", sentences: ["La regadera riega las flores.", "¡Plic, plac! Agua para los tulipanes."] },
    osterei: { name: "huevo rojo", gender: "m", sentences: ["¡Hay un huevo rojo en la hierba!", "¿Quién se asoma detrás del huevo?"] },
    glueckskaefer: { name: "mariquita", gender: "f", sentences: ["¡La mariquita sale volando!", "La mariquita es roja con puntos negros."] },
    pusteblume: { name: "diente de león", gender: "m", sentences: ["¡Sopla! Las semillas salen volando.", "¡Uy! Como paracaídas pequeños."] },
  },
  chains: [
    ["Los tulipanes beben y se abren.", "¡Qué mojado! Se asoma la lombriz."],
    ["¡Crac! El pollito sale del huevo.", "El conejo de Pascua se alegra y salta."],
    ["El corderito oye a su mamá y salta.", "Ahí sale volando la mariposa."],
  ],
};
