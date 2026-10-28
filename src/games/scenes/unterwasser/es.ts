import type { SceneTranslation } from "../types";

// The Spanish words of the Unterwasser picture: names (without article, with gender for el/la,
// `plural` for „peces“, „burbujas“ and „algas“), what each item says and the chain sentences.
// „ancla“ is feminine but takes „el“ in the singular (stressed a), like „el agua“.
// Neutral Spanish for Spain and Latin America.

/** „Unterwasser“ in Spanish. */
export const ES: SceneTranslation = {
  title: "Bajo el mar",
  description: "Ballena, pulpo y cofre del tesoro en el mar.",
  items: {
    leuchtturm: { name: "faro", gender: "m", sentences: ["El faro brilla mucho.", "Así los barcos encuentran el camino."] },
    wolke: { name: "nube", gender: "f", sentences: ["La nube trae lluvia. ¡Plic, plac!", "La lluvia cae en el mar."] },
    moewe: { name: "gaviota", gender: "f", sentences: ["¡Kía, kía! La gaviota vuela sobre el mar.", "La gaviota busca un pez."] },
    sonne: { name: "sol", gender: "m", sentences: ["¡El sol brilla!", "El sol calienta el agua."] },
    anker: { name: "ancla", gender: "f", sentences: ["¡Clin, clin, clin! El ancla sube.", "¡Plof! El ancla cae en la arena."] },
    boot: { name: "bote", gender: "m", sentences: ["¡Tuut, tuut! El bote se mece en las olas.", "El capitán saluda desde el bote."] },
    wal: { name: "ballena", gender: "f", sentences: ["¡Pfff! La ballena echa un chorro de agua.", "La ballena canta: ¡uuuuh!", "La ballena es enorme."] },
    delfin: { name: "delfín", gender: "m", sentences: ["¡Uy! El delfín salta fuera del agua.", "¡Ji, ji, ji! El delfín se ríe."] },
    rochen: { name: "raya", gender: "f", sentences: ["La raya vuela por el agua.", "La raya mueve las aletas."] },
    fische: { name: "peces", gender: "m", plural: true, sentences: ["Los peces nadan en círculo.", "Muchos pececitos nadan juntos."] },
    qualle: { name: "medusa", gender: "f", sentences: ["La medusa flota hacia arriba.", "¡Bambolea, bambolea! La medusa es rosa."] },
    schiff: {
      name: "barco viejo",
      gender: "m",
      sentences: ["¡Din, don! Suena la campana del barco viejo.", "En el barco viejo vive un pez.", "El barco viejo está en el fondo del mar."],
    },
    uboot: {
      name: "submarino",
      gender: "m",
      sentences: ["¡Ping! El submarino bucea por el mar.", "El submarino es amarillo.", "El capitán mira por la ventana."],
    },
    seepferdchen: {
      name: "caballito de mar",
      gender: "m",
      sentences: ["¡Hop, hop! El caballito de mar salta en el agua.", "El caballito de mar es amarillo."],
    },
    schildkroete: { name: "tortuga", gender: "f", sentences: ["La tortuga rema con las aletas.", "La tortuga nada muy despacio."] },
    meerjungfrau: { name: "sirena", gender: "f", sentences: ["La sirena canta una canción. ¡La, la, la!", "La sirena te saluda."] },
    taucher: { name: "buzo", gender: "m", sentences: ["¡Blub, blub! El buzo hace burbujas.", "El buzo saluda."] },
    schnecke: { name: "caracol", gender: "m", sentences: ["El caracol se esconde en su casa.", "¡Cucú! Ya está aquí el caracol."] },
    koralle: { name: "coral", gender: "m", sentences: ["El coral brilla.", "El coral es de muchos colores."] },
    clownfisch: { name: "pez payaso", gender: "m", sentences: ["¡Uy! El pez payaso se esconde.", "El pez payaso vive en la anémona."] },
    krake: { name: "pulpo", gender: "m", sentences: ["El pulpo saluda con ocho brazos.", "¡Hola! El pulpo es rojo."] },
    hai: { name: "tiburón", gender: "m", sentences: ["El tiburón da una vuelta.", "El tiburón se ríe. Es muy bueno."] },
    hummer: { name: "langosta", gender: "f", sentences: ["¡Clic, clac! La langosta levanta las pinzas.", "La langosta es roja."] },
    krabbe: { name: "cangrejo", gender: "m", sentences: ["El cangrejo camina de lado.", "¡Clic, clac! El cangrejo hace ruido con las pinzas."] },
    schatztruhe: { name: "cofre del tesoro", gender: "m", sentences: ["El cofre del tesoro se abre. ¡Hay oro!", "¡Oh, cómo brilla!"] },
    seestern: { name: "estrella de mar", gender: "f", sentences: ["La estrella de mar baila en círculo.", "La estrella de mar tiene cinco brazos."] },
    flaschenpost: { name: "botella con mensaje", gender: "f", sentences: ["¡Plop! La botella con mensaje se abre.", "En la botella hay una carta."] },
    seegras: { name: "algas", gender: "f", plural: true, sentences: ["Las algas se mecen de un lado a otro.", "¡Mira! En las algas vive un pececito."] },
    flunder: { name: "lenguado", gender: "m", sentences: ["¡Uy! El lenguado estaba escondido en la arena.", "El lenguado es muy plano."] },
    kugelfisch: { name: "pez globo", gender: "m", sentences: ["¡Pfff! El pez globo se infla muchísimo.", "El pez globo es amarillo."] },
    blauerfisch: { name: "pez azul", gender: "m", sentences: ["El pez azul nada de un lado a otro.", "¡Blub! El pez azul hace burbujas."] },
    luftblasen: { name: "burbujas", gender: "f", plural: true, sentences: ["¡Blub, blub! Las burbujas suben.", "¡Plop! Las burbujas explotan."] },
    gruenerfisch: { name: "pez verde", gender: "m", sentences: ["El pez verde mueve la aleta.", "¡Blub! El pez verde hace burbujas."] },
    seeigel: { name: "erizo de mar", gender: "m", sentences: ["El erizo de mar mueve las púas.", "¡Hop! El erizo de mar es lila."] },
    muschel: { name: "ostra", gender: "f", sentences: ["La ostra se abre. ¡Hay una perla!", "La perla brilla."] },
  },
  chains: [
    ["¡El delfín salta por el chorro de agua!", "Y el bote se mece en las olas."],
    ["¡El buzo encuentra un cofre del tesoro!", "El cangrejo baila alrededor del tesoro."],
    ["El pulpo saluda al tiburón.", "¡Y el pez payaso se esconde rápido!"],
  ],
};
