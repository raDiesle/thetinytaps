import type { SceneTranslation } from "../types";

// The Spanish words of the Winter-Baustelle picture: names (without article, with gender for el/la,
// `plural` for „carámbanos“, „niños“ and „huellas“), what each item says and the chain sentences.
// Neutral Spanish for Spain and Latin America.

/** „Winter-Baustelle“ in Spanish. */
export const ES: SceneTranslation = {
  title: "Obra en invierno",
  description: "Quitanieves, muñeco de nieve y trineo en la obra nevada.",
  items: {
    sonne: { name: "sol", gender: "m", sentences: ["¡El sol de invierno brilla!", "El sol sonríe, pero hace frío."] },
    schneewolke: {
      name: "nube de nieve",
      gender: "f",
      sentences: ["¡La nube trae nieve!", "Los copos de nieve caen muy despacito.", "La nube es blanca y suave."],
    },
    heli: { name: "helicóptero", gender: "m", sentences: ["El helicóptero vuela sobre la nieve.", "Tac, tac, tac, hace el helicóptero."] },
    hase: { name: "conejo", gender: "m", sentences: ["¡Mira, un conejo en el arbusto nevado!", "Salta que salta, hace el conejo."] },
    klo: {
      name: "baño portátil",
      gender: "m",
      sentences: ["¡Toc, toc! El baño está ocupado.", "Encima del baño hay nieve.", "La puerta se abre. ¿Quién está ahí?"],
    },
    bauwagen: {
      name: "caseta de obra",
      gender: "f",
      sentences: ["En la caseta de obra se está calentito.", "¡Mmm, en la caseta hay chocolate caliente!", "En la caseta brilla una guirnalda de luces."],
    },
    schneetanne: { name: "abeto", gender: "m", sentences: ["El abeto se sacude. ¡Cae la nieve!", "El abeto está verde en invierno.", "¡Plof! Mucha nieve."] },
    eichhoernchen: { name: "ardilla", gender: "f", sentences: ["La ardilla está en el abeto.", "La ardilla mordisquea una nuez de su despensa."] },
    container: { name: "contenedor", gender: "m", sentences: ["El contenedor está lleno de nieve.", "¡Pum! La nieve se resbala."] },
    gabelstapler: { name: "montacargas", gender: "m", sentences: ["El montacargas levanta las cajas.", "¡Arriba y abajo, también en la nieve!"] },
    iglu: { name: "iglú", gender: "m", sentences: ["El iglú está hecho de nieve.", "¿Quién vive en el iglú? ¡Hola!", "En el iglú se enciende la luz."] },
    haus: {
      name: "casa",
      gender: "f",
      sentences: ["¡Aquí construyen una casa, también en invierno!", "Encima de la casa hay nieve.", "Pronto alguien vivirá aquí."],
    },
    eiszapfen: {
      name: "carámbanos",
      gender: "m",
      plural: true,
      sentences: ["En la ventana cuelgan carámbanos.", "Los carámbanos brillan. ¡Plic, plic!", "Los carámbanos son fríos y lisos."],
    },
    katze: { name: "gato", gender: "m", sentences: ["¡Miau! Al gato se le enfrían las patas.", "El gato está sentado en el muro nevado."] },
    kran: { name: "grúa", gender: "f", sentences: ["¡La grúa levanta los ladrillos!", "Encima de la grúa hay nieve.", "¡Muy arriba con la grúa!"] },
    weihnachtsbaum: {
      name: "árbol de Navidad",
      gender: "m",
      sentences: ["¡Arriba en la grúa hay un árbol de Navidad!", "Las luces del árbol de Navidad parpadean.", "La estrella brilla."],
    },
    radio: { name: "radio", gender: "f", sentences: ["La radio pone una canción de invierno. ¡La, la, la!", "Con música entramos en calor."] },
    bagger: {
      name: "excavadora",
      gender: "f",
      sentences: ["¡La excavadora recoge nieve!", "¡Brum, brum! La excavadora hace una montaña de nieve.", "La excavadora es amarilla."],
    },
    karre: { name: "carretilla", gender: "f", sentences: ["¡La carretilla rueda!", "En la carretilla hay nieve."] },
    schild: { name: "señal", gender: "f", sentences: ["¡Cuidado, obra!", "¡Cuidado, resbala!"] },
    teearbeiter: {
      name: "obrero",
      gender: "m",
      sentences: ["El obrero bebe té caliente. ¡Fuu, fuu!", "Lleva un gorro calentito.", "Junto al fuego se calientan las manos."],
    },
    feuertonne: { name: "bidón con fuego", gender: "m", sentences: ["En el bidón arde un fuego.", "¡Cric, crac! El fuego da calor.", "¡No se toca, quema!"] },
    vogelhaus: { name: "comedero", gender: "m", sentences: ["En el comedero hay semillas para los pájaros.", "La bola de semillas se balancea."] },
    meise: { name: "pajarito", gender: "m", sentences: ["¡Pío! El pajarito picotea semillas.", "El pajarito tiene la cabeza azul y la barriga amarilla."] },
    schneeschaufel: { name: "pala de nieve", gender: "f", sentences: ["Con la pala quitamos la nieve.", "¡Aúpa! La nieve sale volando."] },
    laterne: { name: "farola", gender: "f", sentences: ["La farola se enciende. En invierno oscurece pronto.", "La farola tiene un gorro de nieve."] },
    streuwagen: {
      name: "camión de sal",
      gender: "m",
      sentences: ["El camión de sal echa sal en la calle.", "Ahora la calle ya no resbala.", "El disco gira muy rápido."],
    },
    kipper: { name: "camión volquete", gender: "m", sentences: ["¡El camión volquete se lleva la nieve!", "¡Cuidado, el camión volquete vacía la nieve!"] },
    schneepflug: {
      name: "quitanieves",
      gender: "m",
      sentences: ["¡El quitanieves empuja la nieve!", "¡Brum! El quitanieves limpia la calle.", "El quitanieves es naranja."],
    },
    winterfuchs: {
      name: "zorro",
      gender: "m",
      sentences: ["¡Hop! El zorro salta a la nieve.", "El zorro oye un ratón debajo de la nieve.", "El zorro tiene una cola peluda."],
    },
    schlitten: {
      name: "trineo",
      gender: "m",
      sentences: ["¡Yupi! El niño va en trineo.", "El trineo corre por la nieve.", "Tilín, tilín, hace la campanita."],
    },
    rotkehlchen: { name: "petirrojo", gender: "m", sentences: ["El petirrojo salta por la nieve.", "¡Tirilí! El petirrojo canta."] },
    schneemann: {
      name: "muñeco de nieve",
      gender: "m",
      sentences: ["¡Hola, muñeco de nieve!", "El muñeco de nieve tiene una nariz de zanahoria.", "El muñeco de nieve se quita el sombrero."],
    },
    schneeballkinder: {
      name: "niños",
      gender: "m",
      plural: true,
      sentences: ["¡Los niños juegan a tirarse bolas de nieve!", "¡Plas! ¡Por poco!", "Los niños se ríen."],
    },
    hund: { name: "perro", gender: "m", sentences: ["¡Guau, guau! El perro juega en la nieve.", "El perro mueve la cola."] },
    fussspuren: {
      name: "huellas",
      gender: "f",
      plural: true,
      sentences: ["Aquí hay huellas en la nieve. ¿Quién ha sido?", "¡Cruj, cruj! Huellas en la nieve."],
    },
    huetchen: { name: "cono", gender: "m", sentences: ["¡El cono salta!", "El cono tiene un gorro de nieve."] },
    maus: { name: "ratón", gender: "m", sentences: ["¡Pii! El ratón vive en el tubo.", "En el tubo hace calorcito, dice el ratón."] },
  },
  chains: [
    ["Ahora viene el camión de sal y echa sal.", "Y el camión volquete se lleva la nieve."],
    ["¿Quién ha sido? ¡El zorro! Hop, salta a la nieve.", "El ratón se esconde rápido en el tubo."],
    ["El petirrojo se asusta y se va saltando.", "¡Plof! El cono se tambalea."],
  ],
};
