import type { SceneTranslation } from "../types";

// The Spanish words of the Kita picture: names (without article, with gender for el/la,
// `plural` for the pennants, drawings, boots, children at the window, toy boxes and slippers), what
// each item says and the chain sentences. The children are told apart like in German, by what they
// do („niño dormido“, „niño de los fideos“). Neutral Spanish for Spain and Latin America.

/** „Kita“ in Spanish. */
export const ES: SceneTranslation = {
  title: "Guardería",
  description: "Chaquetas en el perchero, rincón de construcciones, cuentos, comida y siesta.",
  items: {
    wimpelkette: {
      name: "banderines",
      gender: "m",
      plural: true,
      sentences: ["Los banderines de colores se mueven de un lado a otro.", "¡Hoy hay fiesta en la guardería!"],
    },
    bilder: { name: "dibujos", gender: "m", plural: true, sentences: ["¡Los niños han pintado esto!", "Mira, una casa, un arcoíris y un gato."] },
    tuer: { name: "puerta", gender: "f", sentences: ["La puerta se abre. ¡Hola, mamá!", "Mamá viene a buscarnos pronto."] },
    geburtstagszug: {
      name: "tren de cumpleaños",
      gender: "m",
      sentences: ["¡Chu, chu! El tren de cumpleaños avanza.", "En el tren hay un pastel con una vela."],
    },
    uhr: { name: "reloj", gender: "m", sentences: ["¡Tic, tac! El reloj hace tictac.", "Pronto es la hora de comer."] },
    garderobe: { name: "perchero", gender: "m", sentences: ["Aquí cuelgan las chaquetas.", "Cada niño tiene un dibujo en su gancho: sol, pato, estrella."] },
    rucksack: { name: "mochila", gender: "f", sentences: ["La mochila se abre. ¡Hay una manzana!", "Y el osito también viene a la guardería."] },
    fenster: { name: "ventana", gender: "f", sentences: ["La ventana se abre. ¡Aire fresco!", "Papá saluda en el jardín: ¡adiós!"] },
    vogel: { name: "pájaro", gender: "m", sentences: ["¡Pío, pío! El pájaro picotea un grano.", "El pajarito está en el comedero."] },
    hamster: { name: "hámster", gender: "m", sentences: ["El hámster corre en la rueda.", "¡Mira, tiene los mofletes llenos!", "La puertecita se abre."] },
    schrank: {
      name: "armario de manualidades",
      gender: "m",
      sentences: ["El armario de manualidades se abre.", "Ahí hay pinturas, pinceles y purpurina.", "¡Mira quién está detrás de las pinturas!"],
    },
    rollo: { name: "persiana", gender: "f", sentences: ["La persiana baja. Es la hora de la siesta.", "Y sube otra vez. ¡Buenos días!"] },
    gummistiefel: {
      name: "botas de agua",
      gender: "f",
      plural: true,
      sentences: ["¡Chof, chof! Las botas de agua pisan fuerte.", "Con botas de agua vamos a los charcos."],
    },
    winkekinder: { name: "niños de la ventana", gender: "m", plural: true, sentences: ["¡Adiós, papá! Los niños saludan.", "¡Hasta la tarde!"] },
    schlafkind: { name: "niño dormido", gender: "m", sentences: ["¡Chsss! El niño duerme.", "Sueña con una estrella."] },
    kisten: { name: "cajas de juguetes", gender: "f", plural: true, sentences: ["Las cajas se abren.", "Ahí hay un coche, un pato y una pelota."] },
    puppenwagen: { name: "cochecito de muñecas", gender: "m", sentences: ["La muñeca se mece en el cochecito.", "¡Hola, muñeca! Abre los ojos."] },
    trommel: { name: "tambor", gender: "m", sentences: ["¡Pum, pum! El tambor suena fuerte.", "Tocamos una canción con el tambor."] },
    spieluhr: { name: "caja de música", gender: "f", sentences: ["La caja de música toca una nana.", "La lunita da vueltas."] },
    erzieherin: {
      name: "maestra",
      gender: "f",
      sentences: ["La maestra lee un cuento.", "Había una vez un patito.", "¡Mira, en la página siguiente hay una rana!"],
    },
    junge: { name: "niño del osito", gender: "m", sentences: ["El niño abraza a su osito.", "El osito también escucha."] },
    baukind: { name: "niño de los bloques", gender: "m", sentences: ["¡Clac, clac! El niño construye con bloques.", "¡Alto, muy alto!"] },
    maedchen: { name: "niña", gender: "f", sentences: ["La niña aplaude.", "¡El cuento es divertido!"] },
    aufwachkind: { name: "niño con sueño", gender: "m", sentences: ["¡Aaaah! El niño se ha despertado.", "Se estira muchísimo."] },
    turm: { name: "torre", gender: "f", sentences: ["La torre se tambalea. ¡Uy!", "La torre es muy alta."] },
    nudelkind: { name: "niño de los fideos", gender: "m", sentences: ["¡Ñam! El niño come fideos.", "¡Sssup! El fideo ha desaparecido."] },
    becherkind: { name: "niño del vaso", gender: "m", sentences: ["¡Glu, glu! El niño bebe jugo.", "Con la pajita hace burbujas."] },
    kipplaster: { name: "camión volquete", gender: "m", sentences: ["¡Brum, brum! El camión volquete avanza.", "Vacía los bloques."] },
    bilderbuch: { name: "libro de cuentos", gender: "m", sentences: ["El libro se abre. ¡Croac! ¡Una rana!", "La rana salta fuera del libro."] },
    kuscheltier: { name: "conejito de peluche", gender: "m", sentences: ["El conejito de peluche salta.", "Es muy suave y blandito."] },
    tisch: { name: "mesa", gender: "f", sentences: ["¡Cataplán! La mesa se tambalea.", "En la mesa se come."] },
    topf: { name: "olla de sopa", gender: "f", sentences: ["¡Mmm, qué bien huele la sopa!", "La tapa salta. ¡Sale una zanahoria!"] },
    pudding: { name: "flan", gender: "m", sentences: ["¡Tiembla, tiembla! El flan se mueve.", "Encima hay una cereza."] },
    kanne: { name: "jarra de agua", gender: "f", sentences: ["¡Glu, glu! Agua en el vaso.", "Ahora el vaso está lleno."] },
    xylophon: { name: "xilófono", gender: "m", sentences: ["¡Plin, plan, plon! El xilófono suena.", "Cada nota tiene un color."] },
    ball: { name: "pelota", gender: "f", sentences: ["¡Boing, boing! La pelota rebota.", "La pelota es de muchos colores."] },
    spielzeugkiste: { name: "caja sorpresa", gender: "f", sentences: ["La caja se abre. ¡Boing! ¡Un payaso!", "El payaso salta y saluda."] },
    hausschuhe: { name: "pantuflas", gender: "f", plural: true, sentences: ["¡Tip, tap! Las pantuflas saltan.", "En la guardería llevamos pantuflas."] },
  },
  chains: [
    ["Papá también saluda: ¡adiós!", "Y el pájaro canta: ¡pío, pío!"],
    ["¡Uy, la torre se tambalea! El niño sigue construyendo.", "El camión volquete trae más bloques."],
    ["El niño oye la nana y sueña.", "Y el conejito de peluche se acurruca."],
  ],
};
