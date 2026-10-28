import type { SceneTranslation } from "../types";

// The Spanish words of the Strand picture: names (without article, with gender for el/la,
// `plural` for „olas“ and „papas fritas“), what each item says and the chain sentences. Chips are
// „papas fritas“, as most Spanish speakers say. Neutral Spanish for Spain and Latin America.

/** „Strand“ in Spanish. */
export const ES: SceneTranslation = {
  title: "Playa",
  description: "Olas, castillo de arena, cangrejo y faro.",
  items: {
    sonne: { name: "sol", gender: "m", sentences: ["¡El sol calienta!", "El sol sonríe sobre el mar."] },
    wolke: { name: "nube", gender: "f", sentences: ["La nube trae lluvia. ¡Plic, plac!", "Después de la lluvia sale un arcoíris."] },
    flugzeug: { name: "avión", gender: "m", sentences: ["El avión lleva una pancarta. Pone: ¡hola!", "¡Brum! La hélice gira.", "El piloto saluda."] },
    drachen: { name: "cometa", gender: "f", sentences: ["¡La cometa vuela con el viento!", "¡Uy! La cometa va de un lado a otro.", "La cometa se ríe."] },
    leuchtturm: {
      name: "faro",
      gender: "m",
      sentences: ["¡El faro parpadea! Así los barcos encuentran el camino.", "La puerta se abre. ¡Hola, farero!", "El faro es rojo y blanco."],
    },
    segelboot: {
      name: "velero",
      gender: "m",
      sentences: ["El velero se mece en las olas.", "El viento sopla en las velas. ¡Uy!", "¡Ahoy! El marinero saluda."],
    },
    schiff: { name: "barco", gender: "m", sentences: ["¡Tuut, tuut! El barco grande cruza el mar.", "De la chimenea sale humo.", "El capitán saluda."] },
    delfin: {
      name: "delfín",
      gender: "m",
      sentences: ["¡Hop! El delfín salta fuera del agua.", "¡Ji, ji, ji! El delfín se ríe.", "¡Plas! Ya se zambulle otra vez."],
    },
    boot: {
      name: "bote",
      gender: "m",
      sentences: ["El bote se mece de un lado a otro.", "El pescador rema. ¡Chap, chap!", "¡Oh, un pez ha picado el anzuelo!"],
    },
    boje: { name: "boya", gender: "f", sentences: ["La boya se mueve en el agua.", "¡Din, don! Suena la campana.", "La boya es roja."] },
    schwimmring: { name: "flotador", gender: "m", sentences: ["El niño chapotea en el flotador.", "¡Yupi! El agua salpica.", "El flotador es rojo y blanco."] },
    badeente: {
      name: "pato de goma",
      gender: "m",
      sentences: ["¡Cua, cua! El pato de goma grande nada.", "El pato de goma mueve la cabeza.", "El pato de goma es amarillo."],
    },
    luftmatratze: {
      name: "colchoneta",
      gender: "f",
      sentences: ["Papá está tumbado en la colchoneta.", "¡Uy! La colchoneta se tambalea.", "¡Oh, el sombrero sale volando!"],
    },
    wellen: { name: "olas", gender: "f", plural: true, sentences: ["Las olas llegan a la playa.", "¡Shhh, shhh! ¡Plas!", "Las olas hacen espuma blanca."] },
    rettungsturm: {
      name: "torre del socorrista",
      gender: "f",
      sentences: ["La socorrista vigila con atención.", "El silbato: ¡priiiip!", "La bandera ondea al viento."],
    },
    pommesbude: {
      name: "puesto de papas fritas",
      gender: "m",
      sentences: ["¡El puesto de papas fritas abre!", "¡Chis, chas! Las papas fritas están calientes.", "El cocinero saluda con un cucurucho de papas fritas."],
    },
    strandhaus: {
      name: "casita de playa",
      gender: "f",
      sentences: ["La puerta de la casita de playa se abre.", "¡Hola! ¿Quién se asoma?", "La casita de playa es azul y blanca."],
    },
    strandzelt: { name: "carpa de playa", gender: "f", sentences: ["En la carpa hay un bebé.", "El bebé aplaude.", "¡Cucú! La carpa se abre."] },
    strandkorb: {
      name: "silla de playa",
      gender: "f",
      sentences: ["El abuelo está sentado en la silla de playa.", "¡Aaaah! El abuelo bosteza y se estira.", "El abuelo levanta el sombrero. ¡Buenos días!"],
    },
    sonnenschirm: {
      name: "sombrilla",
      gender: "f",
      sentences: ["La sombrilla gira. ¡Uy!", "Debajo de la sombrilla hay sombra.", "La sombrilla es roja y blanca."],
    },
    hund: { name: "perro", gender: "m", sentences: ["¡Guau, guau! El perro salta en la arena.", "El perro mueve la cola."] },
    mama: { name: "mamá", gender: "f", sentences: ["Mamá toma el sol.", "Mamá se sube las gafas de sol.", "¡Hola! Mamá saluda."] },
    pommes: { name: "papas fritas", gender: "f", plural: true, sentences: ["¡Mmm, papas fritas con kétchup!", "Las papas fritas saltan del plato."] },
    moewe: {
      name: "gaviota",
      gender: "f",
      sentences: ["¡Kía! ¡La gaviota roba una papa frita!", "La gaviota traviesa sube volando.", "La gaviota es blanca y gris."],
    },
    kind: { name: "niño", gender: "m", sentences: ["El niño tiene una red.", "¡Eh! El niño grita y saluda.", "¡Hop! El niño salta."] },
    ball: { name: "pelota de playa", gender: "f", sentences: ["¡Boing! La pelota de playa rebota alto.", "La pelota de playa es roja, azul y amarilla."] },
    krebs: {
      name: "cangrejo",
      gender: "m",
      sentences: ["El cangrejo camina de lado. ¡Tip, tip, tip!", "¡Clic, clac! El cangrejo tiene pinzas.", "El cangrejo es rojo."],
    },
    sonnencreme: { name: "crema solar", gender: "f", sentences: ["¡Fsss! La crema solar sale disparada.", "Con crema solar el sol no quema."] },
    seestern: { name: "estrella de mar", gender: "f", sentences: ["La estrella de mar tiene cinco brazos.", "La estrella de mar se mueve y se ríe."] },
    eimer: { name: "cubo", gender: "m", sentences: ["En el cubo hay agua.", "¡Plic! Salta un pececito.", "El cubo es azul."] },
    sandburg: {
      name: "castillo de arena",
      gender: "m",
      sentences: ["¡El castillo de arena crece! ¡Una torre, otra torre!", "Arriba ondea una bandera.", "¡Qué castillo de arena tan grande!"],
    },
    windrad: { name: "molinillo", gender: "m", sentences: ["¡El molinillo gira rápido!", "El viento sopla. ¡Uy!"] },
    schaufel: { name: "pala", gender: "f", sentences: ["La pala cava en la arena.", "¡Aúpa! La arena vuela.", "La pala es verde."] },
    sandhaufen: {
      name: "montón de arena",
      gender: "m",
      sentences: ["¿Quién vive en el montón de arena?", "¡Cucú! Se asoma un gusanito.", "El gusano se mete otra vez."],
    },
    schatztruhe: {
      name: "cofre del tesoro",
      gender: "m",
      sentences: ["¡Un cofre del tesoro en la arena!", "La tapa se abre. ¡El oro brilla!", "¡Oh, cuántas monedas! ¿Y quién está ahí dentro?"],
    },
    kuehlbox: {
      name: "nevera portátil",
      gender: "f",
      sentences: ["La nevera portátil se abre. ¡Brrr, qué frío!", "¡Dentro hay un helado!", "Los cubitos de hielo tintinean."],
    },
    muschel: { name: "ostra", gender: "f", sentences: ["La ostra se abre.", "¡Oh, una perla!", "La ostra se cierra otra vez."] },
  },
  chains: [
    ["¡Eh, gaviota! ¡Son las papas fritas de mamá!", "¡Guau, guau! El perro le ladra a la gaviota."],
    ["¡Uy! La ola mece al niño.", "¡Uy! Papá se tambalea en la colchoneta."],
    ["El barco ve la luz. ¡Tuut!", "Y el bote pequeño se mece."],
  ],
};
