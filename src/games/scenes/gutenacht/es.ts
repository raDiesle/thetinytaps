import type { SceneTranslation } from "../types";

// The Spanish words of the Gute Nacht picture: names (without article, with gender for el/la,
// `plural` for the stars, fireflies, blocks and slippers), what each item says and the chain sentences.
// Neutral Spanish for Spain and Latin America.

/** „Gute Nacht“ in Spanish. */
export const ES: SceneTranslation = {
  title: "Buenas noches",
  description: "Todos dicen buenas noches, hasta que el cuarto queda a oscuras.",
  items: {
    lichterkette: {
      name: "guirnalda de luces",
      gender: "f",
      sentences: ["La guirnalda brilla de colores. ¡Buenas noches, lucecitas!", "Las luces se apagan una a una."],
    },
    bild: { name: "cuadro", gender: "m", sentences: ["El sol del cuadro se pone. ¡Buenas noches, sol!", "En el cuadro se hace de noche."] },
    mobile: { name: "móvil", gender: "m", sentences: ["El móvil gira muy despacito. ¡Buenas noches, móvil!", "La lunita del móvil se duerme."] },
    kuckucksuhr: { name: "reloj de cuco", gender: "m", sentences: ["¡Cucú! ¡Buenas noches, cuco!", "El cuco entra en su casita."] },
    mond: { name: "luna", gender: "f", sentences: ["La luna bosteza: ¡aaah! ¡Buenas noches, luna!", "La luna lleva un gorro de dormir."] },
    sterne: { name: "estrellas", gender: "f", plural: true, sentences: ["Las estrellas brillan. ¡Buenas noches, estrellas!", "Brilla, brilla, estrellita."] },
    gluehwuermchen: {
      name: "luciérnagas",
      gender: "f",
      plural: true,
      sentences: ["Las luciérnagas brillan. ¡Buenas noches, luciérnagas!", "¡Bzzz! Vuelan en círculo."],
    },
    eule: { name: "búho", gender: "m", sentences: ["¡Uh, uh! ¡Buenas noches, búho!", "El búho cierra sus ojos grandes."] },
    vorhang: { name: "cortina", gender: "f", sentences: ["La cortina se cierra. ¡Buenas noches, cortina!", "La cortina se mueve muy suave."] },
    schlafanzug: {
      name: "pijama",
      gender: "m",
      sentences: ["El pijama se balancea en el gancho. ¡Buenas noches, pijama!", "El pijama es azul con estrellas."],
    },
    nachtlicht: {
      name: "luz de noche",
      gender: "f",
      sentences: ["La luz de noche brilla toda la noche. ¡Buenas noches, lucecita!", "La luz de noche cuida a todos."],
    },
    maus: { name: "ratón", gender: "m", sentences: ["¡Pii! ¡Buenas noches, ratoncito!", "El ratón se acurruca en su agujero."] },
    tuer: {
      name: "puerta",
      gender: "f",
      sentences: ["La puerta se queda un poquito abierta. ¡Buenas noches, puerta!", "En el pasillo hay luz y se está calentito."],
    },
    mama: { name: "mamá", gender: "f", sentences: ["Mamá dice: ¡buenas noches, que duermas bien!", "Mamá manda un besito."] },
    goldfisch: { name: "pez dorado", gender: "m", sentences: ["¡Blub! ¡Buenas noches, pececito!", "El pez dorado nada en círculo."] },
    buch: { name: "libro de cuentos", gender: "m", sentences: ["El libro se abre. ¡Buenas noches, libro!", "Había una vez una ovejita…"] },
    spieluhr: {
      name: "caja de música",
      gender: "f",
      sentences: ["La caja de música toca una nana. ¡Buenas noches, caja de música!", "Plin, plon. Muy bajito."],
    },
    puppenhaus: {
      name: "casa de muñecas",
      gender: "f",
      sentences: ["En la casa de muñecas se apagan las luces. ¡Buenas noches, muñecas!", "La puerta de la casa de muñecas se abre y se cierra."],
    },
    nachttisch: { name: "mesita de noche", gender: "f", sentences: ["El cajón se abre. ¡Buenas noches, mesita!", "¡Anda, dentro hay un calcetín!"] },
    lampe: { name: "lámpara", gender: "f", sentences: ["¡Clic! La lámpara se apaga. ¡Buenas noches, lámpara!", "Ahora se está muy a gusto."] },
    wecker: { name: "despertador", gender: "m", sentences: ["¡Tic, tac! ¡Buenas noches, despertador!", "Mañana temprano nos despierta el despertador."] },
    bett: { name: "cama", gender: "f", sentences: ["La cama es muy blandita. ¡Buenas noches, cama!", "Las estrellas de la cama brillan."] },
    decke: { name: "mantita", gender: "f", sentences: ["La mantita está calentita. ¡Buenas noches, mantita!", "Arriba, abajo. La mantita respira también."] },
    kind: { name: "niño", gender: "m", sentences: ["El niño bosteza: ¡aaah! ¡Buenas noches!", "El niño saluda y se acurruca."] },
    teddy: { name: "osito", gender: "m", sentences: ["El osito saluda. ¡Buenas noches, osito!", "El osito duerme con el niño."] },
    teppich: { name: "alfombra", gender: "f", sentences: ["La alfombra es muy suave. ¡Buenas noches, alfombra!", "En la alfombra brillan estrellas."] },
    hase: { name: "conejo", gender: "m", sentences: ["El conejo olfatea. ¡Buenas noches, conejo!", "Las orejas largas se doblan."] },
    bausteine: { name: "bloques", gender: "m", plural: true, sentences: ["Los bloques se tambalean. ¡Buenas noches, bloques!", "La torre sigue en pie. ¡Uf!"] },
    katze: { name: "gato", gender: "m", sentences: ["¡Miau! El gato bosteza. ¡Buenas noches, gato!", "El gato se hace un ovillo en su cesta."] },
    schaukelpferd: { name: "caballito", gender: "m", sentences: ["El caballito se balancea. ¡Buenas noches, caballito!", "¡Arre! Y ahora muy despacio."] },
    eisenbahn: { name: "tren", gender: "m", sentences: ["¡Tuut, tuut! El tren se va a dormir. ¡Buenas noches, tren!", "Las ruedas giran muy despacio."] },
    ball: { name: "pelota", gender: "f", sentences: ["La pelota rebota una vez más. ¡Buenas noches, pelota!", "¡Hop! Y ahora se queda quieta."] },
    puppenwagen: {
      name: "cochecito de muñecas",
      gender: "m",
      sentences: ["El cochecito se balancea. ¡Buenas noches, muñeca!", "La muñeca duerme en el cochecito."],
    },
    roboter: { name: "robot", gender: "m", sentences: ["¡Pi, bip! ¡Buenas noches, robot!", "Los ojos del robot se apagan."] },
    kreisel: { name: "trompo", gender: "m", sentences: ["El trompo gira. ¡Buenas noches, trompo!", "Gira cada vez más despacio."] },
    schaf: { name: "ovejita", gender: "f", sentences: ["¡Beee! ¡Buenas noches, ovejita!", "La ovejita cuenta las estrellas."] },
    elefant: { name: "elefante", gender: "m", sentences: ["¡Tuuu, muy bajito! ¡Buenas noches, elefante!", "El elefante mueve las orejas."] },
    hausschuhe: {
      name: "pantuflas",
      gender: "f",
      plural: true,
      sentences: ["Las pantuflas saltan hasta la cama. ¡Buenas noches, pantuflas!", "Las orejas de conejo se mueven."],
    },
    taschenlampe: {
      name: "linterna",
      gender: "f",
      sentences: ["¡Clic! La linterna se apaga. ¡Buenas noches, linterna!", "Ahora está oscuro y se está a gusto."],
    },
    spielzeugkiste: {
      name: "caja de juguetes",
      gender: "f",
      sentences: ["¡Clac! La caja de juguetes se cierra. ¡Buenas noches, juguetes!", "Todo está recogido."],
    },
  },
  chains: [
    ["El móvil gira con la música.", "Y el niño bosteza: ¡aaah!"],
    ["El gato oye al búho y bosteza.", "Y el ratón se acurruca en su agujero."],
    ["Mamá apaga la luz. ¡Clic!", "Y el osito se acurruca."],
  ],
};
