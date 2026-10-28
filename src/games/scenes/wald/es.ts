import type { SceneTranslation } from "../types";

// The Spanish words of the Wald picture: names (without article, with gender for el/la,
// `plural` for „crías de jabalí“), what each item says and the chain sentences. The Reh is the
// „cierva“ (the deer without antlers), so the fawn is her „cervatillo“; the Hirsch is the „ciervo“.
// Neutral Spanish for Spain and Latin America.

/** „Wald“ in Spanish. */
export const ES: SceneTranslation = {
  title: "Bosque",
  description: "Búho, pájaro carpintero, cierva y zorro en el claro junto al arroyo.",
  items: {
    sonne: { name: "sol", gender: "m", sentences: ["El sol brilla entre los árboles.", "El sol sonríe."] },
    wolke: { name: "nube", gender: "f", sentences: ["La nube trae lluvia. ¡Plic, plac!", "Después de la lluvia crecen los hongos."] },
    birke: { name: "abedul", gender: "m", sentences: ["El abedul tiene el tronco blanco.", "Las hojas del abedul brillan con el viento."] },
    specht: {
      name: "pájaro carpintero",
      gender: "m",
      sentences: ["¡Toc, toc, toc! El pájaro carpintero golpea el árbol.", "El pájaro carpintero tiene una gorra roja."],
    },
    vogelnest: { name: "nido", gender: "m", sentences: ["¡Pío, pío! Los pajaritos tienen hambre.", "La mamá trae un gusano."] },
    eiche: { name: "roble", gender: "m", sentences: ["El roble es un árbol viejo y grueso.", "¡Plof! Caen bellotas."] },
    eule: { name: "búho", gender: "m", sentences: ["¡Uh, uh! El búho gira la cabeza.", "El búho vive en el hueco del árbol.", "El búho tiene ojos grandes."] },
    hirsch: { name: "ciervo", gender: "m", sentences: ["¡Brrrooo! El ciervo llama muy fuerte.", "El ciervo tiene una cornamenta grande."] },
    tanne: { name: "abeto", gender: "m", sentences: ["El abeto es grande y verde.", "¡Plof! Se cae una piña."] },
    kuckuck: { name: "cuco", gender: "m", sentences: ["¡Cucú, cucú! Se oye en el bosque.", "El cuco está en el abeto."] },
    ameisenhaufen: { name: "hormiguero", gender: "m", sentences: ["En el hormiguero viven muchísimas hormigas.", "Las hormigas caminan en fila."] },
    dachs: { name: "tejón", gender: "m", sentences: ["El tejón se asoma por su madriguera.", "¡Snif, snif! El tejón tiene la nariz a rayas."] },
    eichhoernchen: { name: "ardilla", gender: "f", sentences: ["La ardilla esconde una nuez.", "La ardilla tiene una cola peluda."] },
    biber: {
      name: "castor",
      gender: "m",
      sentences: ["El castor roe una rama.", "¡Plas! El castor golpea el agua con la cola.", "El castor construye un dique."],
    },
    reh: { name: "cierva", gender: "f", sentences: ["¡Uy! La cierva salta.", "La cierva tiene orejas grandes."] },
    fuchs: { name: "zorro", gender: "m", sentences: ["¡Hop! El zorro salta alto.", "El zorro tiene una cola peluda.", "El zorro ladra: ¡guau!"] },
    rehkitz: { name: "cervatillo", gender: "m", sentences: ["El cervatillo es el bebé de la cierva.", "¡Fi! El cervatillo tiene manchas blancas."] },
    wildschwein: { name: "jabalí", gender: "m", sentences: ["¡Oinc, oinc! El jabalí escarba en la tierra.", "El jabalí busca bellotas."] },
    frischlinge: {
      name: "crías de jabalí",
      gender: "f",
      plural: true,
      sentences: ["Las crías son los bebés del jabalí.", "Las crías de jabalí tienen rayas."],
    },
    bruecke: { name: "puente", gender: "m", sentences: ["¡Toc, toc! Por el puente cruzamos el arroyo.", "Debajo del puente corre el agua."] },
    holzstapel: { name: "montón de leña", gender: "m", sentences: ["El guardabosques ha apilado la leña.", "¡Pataplum! Los troncos se tambalean."] },
    hirschkaefer: {
      name: "escarabajo ciervo",
      gender: "m",
      sentences: ["El escarabajo ciervo tiene pinzas grandes.", "¡Ñac! El escarabajo abre y cierra las pinzas."],
    },
    wegweiser: { name: "letrero", gender: "m", sentences: ["El letrero indica el camino.", "Por aquí se va al bosque y por allí al arroyo."] },
    rabe: { name: "cuervo", gender: "m", sentences: ["¡Cra, cra! El cuervo grazna.", "El cuervo es todo negro."] },
    kind: { name: "niño", gender: "m", sentences: ["El niño recoge hojas de colores.", "¡Hop! El niño salta a las hojas.", "¡Hola! El niño saluda."] },
    hase: { name: "conejo", gender: "m", sentences: ["¡Hop, hop! El conejo salta.", "El conejo mordisquea una hoja."] },
    foersterin: {
      name: "guardabosques",
      gender: "f",
      sentences: ["La guardabosques mira con los prismáticos.", "La guardabosques cuida el bosque.", "¡Hola! La guardabosques silba una canción."],
    },
    libelle: { name: "libélula", gender: "f", sentences: ["¡Zzzz! La libélula vuela sobre el arroyo.", "La libélula es azul."] },
    fisch: { name: "pez", gender: "m", sentences: ["¡Plas! El pez salta fuera del agua.", "El pez nada en el arroyo. ¡Blub!"] },
    igel: { name: "erizo", gender: "m", sentences: ["El erizo se hace una bola.", "El erizo tiene muchas púas.", "¡Snif! El erizo lleva una manzana."] },
    baumstumpf: { name: "tronco", gender: "m", sentences: ["¡Toc, toc! ¿Quién vive en el tronco?", "En el tronco crecen hongos pequeños."] },
    maus: { name: "ratón", gender: "m", sentences: ["¡Pii! El ratón vive en el tronco.", "¡Hola, ratoncito!"] },
    beerenstrauch: { name: "arbusto", gender: "m", sentences: ["En el arbusto crecen arándanos y frambuesas.", "¡Mmm, las frutas están ricas!"] },
    schmetterling: { name: "mariposa", gender: "f", sentences: ["La mariposa es azul.", "La mariposa revolotea sobre las frutas."] },
    frosch: { name: "rana", gender: "f", sentences: ["¡Croac! La rana está sentada en una piedra.", "¡Zas! La rana atrapa una mosca."] },
    fliegenpilz: { name: "hongo", gender: "m", sentences: ["El hongo es rojo con puntos blancos.", "El hongo es venenoso. ¡Solo se mira!"] },
    farn: { name: "helecho", gender: "m", sentences: ["El helecho tiene hojas largas y verdes.", "El helecho desenrolla su hoja."] },
    marienkaefer: { name: "mariquita", gender: "f", sentences: ["La mariquita es roja con puntos negros.", "¡Vuela, mariquita, vuela!"] },
    schnecke: { name: "caracol", gender: "m", sentences: ["El caracol avanza muy despacio.", "El caracol lleva su casa en la espalda."] },
    maulwurf: { name: "topo", gender: "m", sentences: ["¡Uy! El topo se asoma por la tierra.", "El topo cava con sus manos de pala."] },
  },
  chains: [
    ["El búho se despierta: ¡uh, uh! ¿Quién llama?", "Y el cuco canta: ¡cucú!"],
    ["Las crías de jabalí también gruñen.", "Y el tejón mira: ¿qué pasa aquí?"],
    ["El ratón se asoma: ¿quién llama?", "Y el erizo se hace una bola rápido."],
  ],
};
