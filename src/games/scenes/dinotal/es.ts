import type { SceneTranslation } from "../types";

// The Spanish words of the Dinotal picture: names (without article, with gender for el/la,
// `plural` for „hongos“), what each item says and the chain sentences. Dinosaurs keep their Spanish
// names (braquiosaurio, estegosaurio); the T-Rex is the „tiranosaurio“. Neutral Spanish for Spain and Latin America.

/** „Dinotal“ in Spanish. */
export const ES: SceneTranslation = {
  title: "Valle de los dinosaurios",
  description: "Braquiosaurio, triceratops, huevos de dinosaurio y un tiranosaurio que estornuda.",
  items: {
    sonne: { name: "sol", gender: "m", sentences: ["El sol calienta el valle de los dinosaurios.", "El sol sonríe."] },
    wolke: { name: "nube", gender: "f", sentences: ["La nube trae lluvia. ¡Plic, plac!", "Después de la lluvia crecen los helechos."] },
    flugsaurier: {
      name: "pterodáctilo",
      gender: "m",
      sentences: ["¡Uy! El pterodáctilo da una vuelta grande.", "El pterodáctilo tiene alas grandes de piel.", "¡Craaa! El pterodáctilo llama."],
    },
    vulkan: {
      name: "volcán",
      gender: "m",
      sentences: ["¡Puf, puf! El volcán echa una nube.", "El volcán gruñe muy amable.", "El volcán es una montaña grande."],
    },
    baum: { name: "árbol", gender: "m", sentences: ["El árbol es enorme.", "¡Fris, fras! Las hojas susurran.", "En el árbol crecen frutas ricas."] },
    urvogel: {
      name: "pájaro prehistórico",
      gender: "m",
      sentences: ["¡Pío! El pájaro prehistórico está en la rama.", "El pájaro prehistórico tiene plumas y garras en las alas."],
    },
    brachiosaurus: {
      name: "braquiosaurio",
      gender: "m",
      sentences: ["¡Ñam, ñam! El braquiosaurio come de lo alto del árbol.", "El braquiosaurio tiene un cuello larguísimo.", "El braquiosaurio es enorme."],
    },
    hoehle: {
      name: "cueva",
      gender: "f",
      sentences: ["¿Quién vive en la cueva? ¡Jiji!", "En la cueva está oscuro.", "Se asoma un dinosaurio pequeño: ¡hola!"],
    },
    flugbaby: {
      name: "bebé pterodáctilo",
      gender: "m",
      sentences: ["¡Pío, pío! El bebé pterodáctilo tiene hambre.", "El bebé pterodáctilo vive en el nido, arriba en la roca."],
    },
    parasaurolophus: {
      name: "parasaurolofo",
      gender: "m",
      sentences: ["¡Tururú! El parasaurolofo toca la trompeta.", "El parasaurolofo tiene un tubo largo en la cabeza."],
    },
    wassersaurier: {
      name: "dinosaurio del lago",
      gender: "m",
      sentences: ["¡Blub! El dinosaurio del lago se sumerge.", "¡Plas! Ya está aquí otra vez.", "El dinosaurio del lago nada en el lago."],
    },
    libelle: { name: "libélula", gender: "f", sentences: ["¡Zzzz! La libélula vuela sobre el lago.", "La libélula es azul."] },
    fisch: { name: "pez", gender: "m", sentences: ["¡Plas! El pez salta fuera del agua.", "El pez es naranja. ¡Blub!"] },
    seerose: { name: "nenúfar", gender: "m", sentences: ["El nenúfar abre su flor.", "El nenúfar flota en el agua."] },
    frosch: { name: "rana", gender: "f", sentences: ["¡Croac! La rana está sentada en el nenúfar.", "¡Hop! La rana salta."] },
    schildkroete: {
      name: "tortuga",
      gender: "f",
      sentences: ["La tortuga esconde la cabeza.", "¡Cucú! Ya está aquí la cabeza.", "La tortuga toma el sol en la piedra."],
    },
    palmfarn: { name: "helecho palmera", gender: "m", sentences: ["El helecho palmera tiene hojas grandes y verdes.", "¡Fris, fras! Las hojas se mueven."] },
    stegosaurus: {
      name: "estegosaurio",
      gender: "m",
      sentences: ["¡Plin, plin! Las placas de la espalda se mueven.", "El estegosaurio tiene pinchos en la cola.", "El estegosaurio solo come hojas."],
    },
    triceratops: {
      name: "triceratops",
      gender: "m",
      sentences: ["El triceratops tiene tres cuernos.", "¡Fff! El triceratops mueve la cabeza.", "El triceratops es amarillo."],
    },
    babytri: {
      name: "bebé triceratops",
      gender: "m",
      sentences: ["El bebé triceratops salta hacia su mamá.", "El bebé triceratops tiene cuernos muy pequeños."],
    },
    dinomama: {
      name: "mamá dinosaurio",
      gender: "f",
      sentences: ["La mamá dinosaurio cuida sus huevos.", "La mamá dinosaurio tararea una canción.", "La mamá dinosaurio lleva una flor en la cabeza."],
    },
    nest: { name: "nido", gender: "m", sentences: ["En el nido hay tres huevos de dinosaurio.", "¡Toc, toc! ¿Quién llama dentro del huevo?"] },
    ankylosaurus: {
      name: "anquilosaurio",
      gender: "m",
      sentences: ["El anquilosaurio tiene un caparazón.", "¡Pum! El anquilosaurio mueve la maza de su cola."],
    },
    baumstamm: { name: "tronco", gender: "m", sentences: ["El tronco está hueco por dentro.", "¡Toc, toc! ¿Quién vive en el tronco?"] },
    eidechse: { name: "lagartija", gender: "f", sentences: ["La lagartija toma el sol en el tronco.", "La lagartija hace flexiones. ¡Hop, hop!"] },
    dinoei: {
      name: "huevo de dinosaurio",
      gender: "m",
      sentences: ["¡Crac! Un dinosaurio pequeño sale del huevo.", "¡Hola, dinosaurio pequeño!", "El huevo de dinosaurio se mueve."],
    },
    pfuetze: { name: "charco", gender: "m", sentences: ["¡Plas! Un dinosaurio ha saltado al charco.", "Aquí hay huellas grandes."] },
    bernstein: { name: "ámbar", gender: "m", sentences: ["El ámbar brilla como el oro.", "Dentro del ámbar hay una hojita."] },
    kaefer: { name: "escarabajo", gender: "m", sentences: ["¡Bzzz! El escarabajo vuela un poquito.", "El escarabajo es rojo."] },
    pilze: { name: "hongos", gender: "m", plural: true, sentences: ["Los hongos saltan. ¡Hop, hop, hop!", "¡Puf! Los hongos echan polvito."] },
    trex: {
      name: "tiranosaurio",
      gender: "m",
      sentences: ["El tiranosaurio ruge muy bajito: grrr…", "¡A… a… achís! El tiranosaurio estornuda.", "¡Salud, querido tiranosaurio!"],
    },
    blume: { name: "flor", gender: "f", sentences: ["La flor abre sus pétalos.", "La flor es rosa."] },
    schmetterling: { name: "mariposa", gender: "f", sentences: ["La mariposa es amarilla.", "La mariposa revolotea sobre la flor."] },
    schnecke: { name: "caracol", gender: "m", sentences: ["El caracol avanza muy despacio.", "El caracol tiene una casa rosa."] },
    farn: { name: "helecho", gender: "m", sentences: ["El helecho es muy, muy antiguo.", "El helecho desenrolla una hoja."] },
    schachtelhalm: {
      name: "cola de caballo",
      gender: "f",
      sentences: ["La cola de caballo se balancea de un lado a otro.", "¡Boing! La cola de caballo rebota."],
    },
  },
  chains: [
    ["¡Uy! El pterodáctilo se asusta y da una vuelta.", "Y el pájaro prehistórico pía: ¡salud!"],
    ["¡Crac! El bebé dinosaurio sale del huevo.", "La mamá dinosaurio se alegra: ¡hola, pequeñín!"],
    ["El parasaurolofo toca la trompeta: ¡tururú!", "Y el braquiosaurio mira: ¿qué pasa aquí?"],
  ],
};
