import type { SceneTranslation } from "../types";

// The Spanish words of the Winter picture: names (without article, with gender for el/la,
// `plural` for „carámbanos“, „patines“, „niños“ and „huellas“), what each item says and the chain
// sentences. The Reh is the „cierva“, as in the Wald picture. Neutral Spanish for Spain and Latin America.

/** „Winter“ in Spanish. */
export const ES: SceneTranslation = {
  title: "Invierno",
  description: "Muñeco de nieve, trineo, patinaje y un trineo de caballos en la nieve.",
  items: {
    sonne: { name: "sol", gender: "m", sentences: ["¡El sol de invierno brilla!", "El sol sonríe. ¡Pero hace frío!"] },
    schneewolke: {
      name: "nube de nieve",
      gender: "f",
      sentences: ["¡La nube trae nieve!", "Los copos de nieve caen muy despacito.", "La nube es blanca y suave."],
    },
    schneeflocke: {
      name: "copo de nieve",
      gender: "m",
      sentences: ["¡El copo de nieve gira!", "¡Brilla, brilla! El copo de nieve centellea.", "Cada copo de nieve tiene seis puntas."],
    },
    kirchturm: {
      name: "campanario",
      gender: "m",
      sentences: ["¡Din, don! Suena la campana.", "Arriba en la torre gira un gallo.", "El reloj de la torre dice la hora."],
    },
    hase: { name: "conejo", gender: "m", sentences: ["¡Mira, un conejo en el arbusto nevado!", "Salta que salta, hace el conejo."] },
    schneetanne: { name: "abeto", gender: "m", sentences: ["El abeto se sacude. ¡Cae la nieve!", "El abeto está verde en invierno.", "¡Plof! Mucha nieve."] },
    eichhoernchen: { name: "ardilla", gender: "f", sentences: ["La ardilla está en el abeto.", "La ardilla mordisquea una nuez."] },
    futterkrippe: {
      name: "comedero",
      gender: "m",
      sentences: [
        "En el comedero hay heno para las ciervas.",
        "En invierno los animales encuentran poca comida.",
        "¡Ahí también hay zanahorias y una manzana!",
      ],
    },
    reh: { name: "cierva", gender: "f", sentences: ["La cierva viene al comedero.", "¡Hop! La cierva salta por la nieve.", "La cierva tiene orejas grandes."] },
    holzhaus: {
      name: "casita de madera",
      gender: "f",
      sentences: ["En la casita de madera se está calentito.", "De la chimenea sale humo.", "La puerta se abre. ¿Quién está ahí?"],
    },
    eiszapfen: {
      name: "carámbanos",
      gender: "m",
      plural: true,
      sentences: ["Del tejado cuelgan carámbanos.", "Los carámbanos brillan. ¡Plic, plic!", "Los carámbanos son fríos y lisos."],
    },
    tannenbaum: {
      name: "árbol de Navidad",
      gender: "m",
      sentences: ["¡El árbol de Navidad brilla!", "Arriba del árbol hay una estrella.", "Debajo del árbol hay regalos."],
    },
    schneeopa: { name: "abuelo", gender: "m", sentences: ["El abuelo aparta la nieve.", "¡Aúpa! El camino queda libre.", "¡Uf, el abuelo resopla!"] },
    vogelhaus: {
      name: "casita de pájaros",
      gender: "f",
      sentences: ["En la casita de pájaros hay semillas para los pájaros.", "La bola de semillas se balancea."],
    },
    meise: { name: "pajarito", gender: "m", sentences: ["¡Pío! El pajarito picotea semillas.", "El pajarito tiene la cabeza azul y la barriga amarilla."] },
    eisente: {
      name: "pato",
      gender: "m",
      sentences: ["¡Uy! El pato resbala en el hielo.", "¡Cua! ¡El hielo resbala mucho!", "El pato lleva una bufanda roja."],
    },
    eislaeuferin: { name: "patinadora", gender: "f", sentences: ["La niña patina sobre hielo.", "Gira en círculo. ¡Qué bonito!", "El hielo brilla."] },
    iglu: { name: "iglú", gender: "m", sentences: ["El iglú está hecho de nieve.", "¿Quién vive en el iglú? ¡Hola!", "En el iglú se enciende la luz."] },
    skifahrer: { name: "esquiador", gender: "m", sentences: ["El niño esquía. ¡Uy!", "Se empuja con los bastones.", "La nieve sale volando."] },
    schlitten: {
      name: "trineo",
      gender: "m",
      sentences: ["¡Yupi! El niño va en trineo.", "El trineo baja la colina a toda velocidad.", "Tilín, tilín, hace la campanita."],
    },
    rutscher: {
      name: "deslizador",
      gender: "m",
      sentences: ["El niño se desliza en el deslizador.", "Da vueltas en círculo. ¡Yupi!", "El deslizador es rojo."],
    },
    schlittschuhe: {
      name: "patines",
      gender: "m",
      plural: true,
      sentences: ["Aquí hay unos patines.", "Con patines se puede patinar sobre el hielo.", "¡Hop! Los patines saltan."],
    },
    schlittenmama: { name: "mamá", gender: "f", sentences: ["Mamá tira del trineo.", "El bebé saluda. ¡Hola!", "Cruj, cruj, hace la nieve."] },
    parkbank: { name: "banco", gender: "m", sentences: ["En el banco hay nieve.", "¡Plof! La nieve se cae.", "Aquí se puede descansar."] },
    kakao: {
      name: "chocolate caliente",
      gender: "m",
      sentences: ["¡Mmm, chocolate caliente!", "¡Fuu, fuu! El chocolate quema.", "El chocolate calienta las manos."],
    },
    rotkehlchen: { name: "petirrojo", gender: "m", sentences: ["El petirrojo está en el banco.", "¡Tirilí! El petirrojo canta."] },
    pferdeschlitten: {
      name: "trineo de caballos",
      gender: "m",
      sentences: ["El caballo tira del trineo.", "¡Tilín, tilín! Suenan las campanitas.", "¡Arre, caballito, corre!"],
    },
    laterne: { name: "farola", gender: "f", sentences: ["La farola se enciende. En invierno oscurece pronto.", "La farola tiene un gorro de nieve."] },
    handschuh: {
      name: "guante",
      gender: "m",
      sentences: ["Ahí hay un guante en la nieve.", "¿Quién ha perdido el guante?", "¡Mira, alguien vive en el guante!"],
    },
    winterfuchs: {
      name: "zorro",
      gender: "m",
      sentences: ["¡Hop! El zorro salta a la nieve.", "El zorro oye un ratón debajo de la nieve.", "El zorro tiene una cola peluda."],
    },
    schneekugel: {
      name: "bola de nieve",
      gender: "f",
      sentences: ["El niño hace rodar una bola de nieve grande.", "¡La bola se hace cada vez más gorda!", "Con ella hacemos un muñeco de nieve."],
    },
    schneeengel: {
      name: "ángel de nieve",
      gender: "m",
      sentences: ["La niña hace un ángel de nieve.", "¡Brazos arriba, brazos abajo!", "¡Jiji, la nieve hace cosquillas!"],
    },
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
    hund: {
      name: "perro",
      gender: "m",
      sentences: ["¡Guau, guau! El perro juega en la nieve.", "El perro mueve la cola.", "¡El perro también quiere una bola de nieve!"],
    },
    fussspuren: {
      name: "huellas",
      gender: "f",
      plural: true,
      sentences: ["Aquí hay huellas en la nieve. ¿Quién ha sido?", "¡Cruj, cruj! Huellas en la nieve."],
    },
  },
  chains: [
    ["El perro quiere jugar. ¡Guau, guau!", "¡Plas! Una bola de nieve le da al muñeco de nieve. Se quita el sombrero."],
    ["¿Quién ha sido? ¡El zorro! Hop, salta a la nieve.", "El petirrojo se asusta y se va saltando."],
    ["Ahora baja el deslizador a toda velocidad.", "¡Y el esquiador viene detrás!"],
  ],
};
