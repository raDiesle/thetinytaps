import type { SceneTranslation } from "../types";

// The Spanish words of the Kinderarzt picture: names (without article, with gender for el/la,
// `plural` for „pegatinas“ and „curitas“), what each item says and the chain sentences.
// Neutral Spanish for Spain and Latin America.

/** „Kinderarzt“ in Spanish. */
export const ES: SceneTranslation = {
  title: "Pediatra",
  description: "Báscula, estetoscopio y al final una pegatina.",
  items: {
    mobile: { name: "móvil", gender: "m", sentences: ["El móvil gira. ¡Plin, plin!", "La nube, la estrella y la luna se balancean."] },
    fenster: { name: "ventana", gender: "f", sentences: ["La ventana se abre. ¡Aire fresco!", "¡Pío, pío! Un pájaro se asoma."] },
    hampelmann: { name: "títere", gender: "m", sentences: ["¡Tira del cordón! El títere salta.", "¡Brazos arriba, piernas arriba!"] },
    uhr: { name: "reloj", gender: "m", sentences: ["¡Tic, tac! El reloj hace tictac.", "Las agujas dan vueltas y vueltas."] },
    tuer: { name: "puerta", gender: "f", sentences: ["¡Toc, toc! ¿Quién es?", "La puerta se abre. ¡Hola, pasa!"] },
    sehtafel: { name: "cartel de la vista", gender: "m", sentences: ["¿Qué ves? ¡Un sol, una casa, un coche!", "Los dibujos son cada vez más pequeños."] },
    messlatte: { name: "medidor", gender: "m", sentences: ["La jirafa mide lo alto que eres.", "¡Zas! La regla baja.", "¡Ya eres muy alto!"] },
    schrank: { name: "armario", gender: "m", sentences: ["Las puertas se abren. ¿Qué hay en el armario?", "Ahí hay curitas y vendas."] },
    seifenspender: { name: "jabón", gender: "m", sentences: ["¡Aprieta! Sale espuma.", "¡Primero nos lavamos las manos!"] },
    lampe: { name: "lámpara", gender: "f", sentences: ["¡Clic! La lámpara se enciende.", "Ahora hay mucha luz."] },
    papa: { name: "papá", gender: "m", sentences: ["Papá espera y lee un libro.", "¡Aaaah! Papá bosteza y se estira."] },
    waschbecken: { name: "lavabo", gender: "m", sentences: ["¡Plic, plac! El agua corre.", "En el armario hay toallas y un pato. ¿Y quién más?"] },
    aquarium: {
      name: "acuario",
      gender: "m",
      sentences: ["¡Blub, blub! Los peces nadan.", "El cofre del tesoro se abre.", "Abajo en el armario está la comida de los peces."],
    },
    waage: { name: "báscula", gender: "f", sentences: ["¡Súbete! ¡Pi, pi!", "La aguja gira. ¿Cuánto pesas?"] },
    wasserspender: { name: "dispensador de agua", gender: "m", sentences: ["¡Glu, glu! Un vaso de agua.", "¡Blub! Las burbujas suben."] },
    arzthelferin: { name: "enfermera", gender: "f", sentences: ["¡Hola! La enfermera saluda.", "Tararea una canción: ¡la, la, la!"] },
    empfang: { name: "recepción", gender: "f", sentences: ["Aquí dices que has llegado.", "El cajón se abre. ¡Hay lápices!"] },
    telefon: { name: "teléfono", gender: "m", sentences: ["¡Rin, rin! Suena el teléfono.", "¡Hola, aquí la pediatra!"] },
    aufkleber: {
      name: "pegatinas",
      gender: "f",
      plural: true,
      sentences: ["¡Al final te dan una pegatina!", "Salen volando estrellas y corazones.", "¿Cuál te gusta?"],
    },
    liege: { name: "camilla", gender: "f", sentences: ["En la camilla te tumbas.", "¡Fris! El papel se desenrolla.", "El cajón se abre y se cierra."] },
    kind: {
      name: "niño",
      gender: "m",
      sentences: ["El niño está sentado en la camilla. ¡Jiji!", "El niño es muy valiente.", "En la rodilla tiene una curita."],
    },
    kinderwagen: { name: "cochecito", gender: "m", sentences: ["El cochecito se balancea.", "El bebé se ríe: ¡jiji!"] },
    spielkiste: {
      name: "caja de juguetes",
      gender: "f",
      sentences: ["La tapa se abre.", "¡Boing! Sale un conejo de un salto.", "En la caja hay una pelota y un pato."],
    },
    aerztin: { name: "doctora", gender: "f", sentences: ["¡Hola! Soy la pediatra.", "La doctora saluda y se ríe.", "Aquí te pones bien otra vez."] },
    rollwagen: { name: "carrito", gender: "m", sentences: ["¡Ñic! El carrito rueda.", "Los cajones se abren, uno detrás de otro."] },
    stethoskop: { name: "estetoscopio", gender: "m", sentences: ["¡Bum-bum, bum-bum! Así suena tu corazón.", "Con el estetoscopio escucha la doctora."] },
    ohrenlampe: {
      name: "linterna",
      gender: "f",
      sentences: ["¡Plin! Se enciende la luz.", "Con la linterna la doctora mira dentro de la oreja.", "¡Todo limpio!"],
    },
    pflaster: { name: "curitas", gender: "f", plural: true, sentences: ["La caja se abre. ¡Curitas!", "Una curita con estrellas. ¡Qué colores!"] },
    muelleimer: { name: "papelera", gender: "f", sentences: ["¡Písala! La tapa se abre.", "El papel cae en la papelera."] },
    schaukelpferd: { name: "caballito", gender: "m", sentences: ["¡Arre! El caballito se balancea.", "¡Iiiih! El caballito mueve la cabeza."] },
    pflanze: { name: "planta", gender: "f", sentences: ["¡Fris, fras! Las hojas se mueven.", "Por ahí camina una mariquita."] },
    arzttasche: { name: "maletín", gender: "m", sentences: ["¡Clac! El maletín se abre.", "Dentro hay un martillito. ¡Toc, toc!"] },
    bauklotz: { name: "torre", gender: "f", sentences: ["¡Uy! La torre se tambalea.", "¡Pero no se cae!"] },
    teddy: { name: "osito", gender: "m", sentences: ["El osito tiene una venda.", "El osito saluda. ¡Ya no le duele!", "El osito ya está bien."] },
    kugelbahn: { name: "pista de canicas", gender: "f", sentences: ["La canica rueda de un lado a otro.", "¡Clac, clac! Ya ha llegado abajo."] },
    ball: { name: "pelota", gender: "f", sentences: ["¡Boing, boing! La pelota rebota.", "La pelota es de muchos colores."] },
    feuerwehr: { name: "camión de bomberos", gender: "m", sentences: ["¡Nino, nino! El camión de bomberos sale rápido.", "La escalera sube."] },
    bilderbuch: { name: "libro de cuentos", gender: "m", sentences: ["Las páginas pasan. ¡Fris!", "En el libro hay un corazón y una estrella."] },
  },
  chains: [
    ["La enfermera contesta el teléfono.", "¡Y ya llega el siguiente niño!"],
    ["La doctora escucha: ¡bum-bum! Todo bien.", "El niño se ríe: ¡me hace cosquillas!"],
    ["¡Oh! La torre se tambalea.", "Y el camión de bomberos sale rápido: ¡nino, nino!"],
  ],
};
