import type { SceneTranslation } from "../types";

// The Spanish words of the Spielplatz picture: names (without article, with gender for el/la,
// `plural` for „burbujas de jabón“, „palomas“, „flores“ and „moldes“), what each item says and
// the chain sentences. Neutral Spanish for Spain and Latin America.

/** „Spielplatz“ in Spanish. */
export const ES: SceneTranslation = {
  title: "Parque infantil",
  description: "Tobogán, columpio, balancín y arenero.",
  items: {
    sonne: { name: "sol", gender: "m", sentences: ["¡El sol brilla!", "El sol sonríe."] },
    wolke: { name: "nube", gender: "f", sentences: ["La nube trae lluvia. ¡Plic, plac!", "La nube es blanca y suave."] },
    flugzeug: { name: "avión", gender: "m", sentences: ["El avión vuela alto en el cielo.", "¡Brum! La hélice gira.", "La piloto saluda moviendo las alas."] },
    drachen: {
      name: "cometa",
      gender: "f",
      sentences: ["¡La cometa vuela con el viento!", "¡Uy! La cometa va de un lado a otro.", "La cometa tiene una cola larga."],
    },
    luftballon: { name: "globo", gender: "m", sentences: ["¡El globo rojo se va volando!", "El globo sube flotando."] },
    opa: {
      name: "abuelo",
      gender: "m",
      sentences: ["El abuelo lee el periódico.", "¡Hola, abuelo! El abuelo levanta la gorra.", "El abuelo está sentado en el banco."],
    },
    muelleimer: { name: "papelera", gender: "f", sentences: ["¡Clac! La papelera se abre.", "La basura va a la papelera."] },
    eiswagen: {
      name: "camión de helados",
      gender: "m",
      sentences: ["¡Tilín, tilín! Llega el camión de helados.", "¡Mmm, un helado de fresa!", "El heladero saluda."],
    },
    baum: { name: "árbol", gender: "m", sentences: ["El viento sopla en el árbol.", "En el árbol crecen manzanas rojas.", "El árbol es grande y verde."] },
    vogel: { name: "pájaro", gender: "m", sentences: ["¡Pío, pío! El pájaro vuela.", "El pájaro está sentado en la rama."] },
    eichhoernchen: { name: "ardilla", gender: "f", sentences: ["¡Hop! La ardilla trepa al árbol.", "La ardilla mordisquea una nuez."] },
    schaukel: { name: "columpio", gender: "m", sentences: ["¡Uy! El columpio sube muy alto.", "¡Adelante y atrás, más y más!", "Ñic, ñic, hace el columpio."] },
    kletterturm: {
      name: "torre de juegos",
      gender: "f",
      sentences: ["¡Ahoy! Es un barco pirata.", "La escalera sube a la torre.", "¿Quién se asoma por la ventana?"],
    },
    rutsche: { name: "tobogán", gender: "m", sentences: ["¡Yupi! ¡Por el tobogán abajo!", "El tobogán es amarillo y liso.", "¡Otra vez!"] },
    katze: { name: "gato", gender: "m", sentences: ["¡Miau! El gato está en el tejado.", "El gato se limpia la pata."] },
    seifenblasen: {
      name: "burbujas de jabón",
      gender: "f",
      plural: true,
      sentences: ["¡Fuu! Salen volando muchas burbujas de jabón.", "Las burbujas de jabón brillan de colores.", "¡Plop! La burbuja ha explotado."],
    },
    wippe: { name: "balancín", gender: "m", sentences: ["¡Arriba y abajo con el balancín!", "En el balancín hay dos niños.", "¡Sube, baja, hurra!"] },
    karussell: {
      name: "carrusel",
      gender: "m",
      sentences: ["¡El carrusel da vueltas y vueltas!", "Los niños se agarran fuerte.", "¡Vueltas y más vueltas, qué divertido!"],
    },
    hund: { name: "perro", gender: "m", sentences: ["¡Guau, guau! El perro quiere jugar.", "El perro mueve la cola."] },
    schaukelpferd: {
      name: "caballito",
      gender: "m",
      sentences: ["¡Arre! El caballito se balancea.", "El caballito tiene la crin lila.", "¡Arre, arre, caballito, al galope!"],
    },
    ball: { name: "pelota", gender: "f", sentences: ["¡Boing! La pelota rebota alto.", "La pelota es roja, azul y amarilla."] },
    mama: { name: "mamá", gender: "f", sentences: ["Mamá empuja el cochecito.", "¡Hola! Mamá saluda."] },
    kinderwagen: { name: "cochecito", gender: "m", sentences: ["En el cochecito hay un bebé.", "El bebé se ríe y agita el sonajero.", "El cochecito rueda."] },
    tauben: { name: "palomas", gender: "f", plural: true, sentences: ["¡Cu, cu! Las palomas picotean migas.", "Las palomas buscan comida."] },
    roller: { name: "patinete", gender: "m", sentences: ["¡Fiuuu! El patinete sale disparado.", "¡Un empujón con el pie, y a correr!"] },
    laufrad: {
      name: "bicicleta sin pedales",
      gender: "f",
      sentences: ["La bicicleta sin pedales rueda. ¡Corre, corre!", "¡Rin, rin! El timbre de la bicicleta.", "El niño lleva casco."],
    },
    pumpe: { name: "bomba de agua", gender: "f", sentences: ["¡A bombear! Sale el agua.", "¡Plic, plac! El agua corre al arroyo."] },
    sandburg: {
      name: "castillo de arena",
      gender: "m",
      sentences: ["¡Es un castillo de arena!", "La puerta se abre. ¿Quién vive ahí?", "La bandera ondea en el castillo de arena."],
    },
    kind: { name: "niño", gender: "m", sentences: ["El niño cava en la arena.", "¡Jiji! La arena vuela.", "El niño lleva un sombrero para el sol."] },
    schnecke: { name: "caracol", gender: "m", sentences: ["El caracol avanza muy despacio.", "El caracol lleva su casa en la espalda."] },
    blumen: { name: "flores", gender: "f", plural: true, sentences: ["Las flores son de muchos colores.", "Las flores se mueven con el viento."] },
    schmetterling: { name: "mariposa", gender: "f", sentences: ["Una mariposa revolotea.", "A la mariposa le gustan las flores."] },
    marienkaefer: { name: "mariquita", gender: "f", sentences: ["¡La mariquita sale volando!", "La mariquita tiene puntos negros."] },
    eimer: { name: "cubo", gender: "m", sentences: ["El cubo se cae. ¡Sale la arena!", "El cubo es rojo."] },
    bagger: { name: "excavadora de juguete", gender: "f", sentences: ["La excavadora pequeña recoge arena.", "¡Brum, brum! La excavadora es amarilla."] },
    foermchen: { name: "moldes", gender: "m", plural: true, sentences: ["Con los moldes hacemos pasteles de arena.", "¡Una estrella, un pez y un corazón!"] },
  },
  chains: [
    ["¡El gato se asusta!", "¡Y el pájaro sale volando rápido!"],
    ["¡Helado! La bicicleta sin pedales va rápido.", "¡Y el patinete corre detrás!"],
    ["¡Lluvia! El caracol se alegra.", "Rápido, se cierra la capota del cochecito."],
  ],
};
