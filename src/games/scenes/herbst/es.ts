import type { SceneTranslation } from "../types";

// The Spanish words of the Herbst picture: names (without article, with gender for el/la,
// `plural` for „gansos salvajes“, „hongos“ and „botas de agua“), what each item says and the chain
// sentences. The St. Martin's lantern is a „farolillo“. Neutral Spanish for Spain and Latin America.

/** „Herbst“ in Spanish. */
export const ES: SceneTranslation = {
  title: "Otoño",
  description: "Hojas de colores, calabaza y cometa al viento.",
  items: {
    sonne: { name: "sol", gender: "m", sentences: ["¡El sol de otoño brilla!", "El sol sonríe.", "El sol todavía calienta un poquito."] },
    wolke: { name: "nube", gender: "f", sentences: ["La nube trae lluvia. ¡Plic, plac!", "En otoño llueve mucho."] },
    herbstwind: { name: "viento", gender: "m", sentences: ["El viento sopla: ¡fuuu!", "El viento se lleva las hojas.", "¡Fiuuu! Hoy hace viento."] },
    wildgaense: {
      name: "gansos salvajes",
      gender: "m",
      plural: true,
      sentences: ["Los gansos salvajes vuelan hacia el sur.", "¡Cua, cua, cua! ¡Adiós, gansos!"],
    },
    herbstdrachen: {
      name: "cometa",
      gender: "f",
      sentences: ["¡La cometa vuela muy alto!", "La cometa baila con el viento.", "La cometa tiene una cara sonriente."],
    },
    pflugtraktor: { name: "tractor", gender: "m", sentences: ["El tractor ara el campo.", "Pof, pof, pof, hace el tractor."] },
    kraehe: { name: "cuervo", gender: "m", sentences: ["¡Cra, cra! El cuervo grazna.", "El cuervo está en el poste."] },
    schuppen: { name: "cobertizo", gender: "m", sentences: ["En el cobertizo viven el rastrillo y la escoba.", "¡Ñic! La puerta se abre. ¿Quién está ahí?"] },
    spinnennetz: { name: "telaraña", gender: "f", sentences: ["En la telaraña brillan gotas de rocío.", "La araña baja por su hilo."] },
    baeuerin: { name: "granjera", gender: "f", sentences: ["¡Hola! ¿Quieres una calabaza?", "La granjera vende calabazas."] },
    kuerbisstand: {
      name: "puesto de calabazas",
      gender: "m",
      sentences: ["En el puesto hay muchas calabazas.", "¡Calabazas amarillas, verdes y naranjas!", "¿Qué hay en la caja?"],
    },
    apfelkorb: { name: "cesta de manzanas", gender: "f", sentences: ["La cesta está llena de manzanas.", "Manzanas rojas, verdes y amarillas. ¡Mmm!"] },
    ahorn: {
      name: "arce",
      gender: "m",
      sentences: ["El arce tiene hojas rojas.", "¡Las semillas vuelan como helicópteros pequeños!", "¡Fris, fras! Las hojas caen."],
    },
    drachenjunge: { name: "niño de la cometa", gender: "m", sentences: ["El niño hace volar la cometa.", "¡Yupi! El niño agarra fuerte la cuerda."] },
    laubopa: {
      name: "abuelo",
      gender: "m",
      sentences: ["El abuelo junta las hojas con el rastrillo.", "Ras, ras, hace el rastrillo.", "El abuelo dice: ¡hola!"],
    },
    laubhaufen: {
      name: "montón de hojas",
      gender: "m",
      sentences: ["¡Uy! Las hojas salen volando.", "En el montón de hojas uno se puede esconder.", "¡Fris, fras! ¿Quién está en las hojas?"],
    },
    strickoma: {
      name: "abuela",
      gender: "f",
      sentences: ["La abuela teje una bufanda.", "Clic, clac, hacen las agujas.", "La bufanda queda larga y calentita."],
    },
    bankkatze: { name: "gato", gender: "m", sentences: ["¡Miau! El gato juega con la lana.", "El gato está sentado en el banco."] },
    kastanienbaum: { name: "castaño", gender: "m", sentences: ["¡Plof! Caen castañas.", "Las hojas son amarillas y marrones.", "El castaño es grande."] },
    herbsthoernchen: { name: "ardilla", gender: "f", sentences: ["La ardilla junta nueces para el invierno.", "¡Ñam, ñam! Qué rica, una nuez."] },
    laubigel: { name: "erizo", gender: "m", sentences: ["El erizo lleva una manzana en la espalda.", "¡Snif, snif! El erizo busca una cama de hojas."] },
    kuerbiswagen: { name: "carrito", gender: "m", sentences: ["En el carrito hay calabazas.", "Traca, traca, el carrito rueda."] },
    laubhund: { name: "perro", gender: "m", sentences: ["¡Guau, guau! El perro quiere atrapar la hoja.", "¡El perro salta!"] },
    kastanie: { name: "castaña", gender: "f", sentences: ["La castaña es marrón y brilla.", "La cáscara pincha. ¡Ay!"] },
    steinpilze: { name: "hongos", gender: "m", plural: true, sentences: ["¡Plop, plop! Los hongos crecen.", "Los hongos tienen sombreros marrones."] },
    kastanienmann: { name: "muñeco de castañas", gender: "m", sentences: ["¡El muñeco de castañas baila!", "Está hecho con castañas."] },
    herbstwindrad: { name: "molinillo", gender: "m", sentences: ["El molinillo gira con el viento.", "Rojo, amarillo, azul y verde. ¡Fsss!"] },
    amsel: { name: "mirlo", gender: "m", sentences: ["El mirlo picotea bayas rojas.", "El mirlo canta una canción."] },
    riesenkuerbis: {
      name: "calabaza",
      gender: "f",
      sentences: ["¡La calabaza salta! ¡Fris, fras!", "La calabaza es gorda y redonda.", "Detrás de la calabaza vive un ratón."],
    },
    martinslaterne: {
      name: "farolillo",
      gender: "m",
      sentences: ["¡Farolillo, farolillo, sol, luna y estrellas!", "El farolillo brilla mucho.", "El niño canta la canción del farolillo."],
    },
    matschpfuetze: { name: "charco", gender: "m", sentences: ["¡Plas! El charco salpica.", "Una hoja flota como un barco."] },
    pfuetzenkind: {
      name: "niña",
      gender: "f",
      sentences: ["¡Hop! La niña salta al charco.", "La niña tiene un paraguas.", "¡Con botas de agua se puede saltar en los charcos!"],
    },
    apfelwurm: { name: "gusano", gender: "m", sentences: ["¡Hola, gusanito!", "El gusano vive en la manzana. ¡Ñam, ñam!"] },
    herbststiefel: {
      name: "botas de agua",
      gender: "f",
      plural: true,
      sentences: ["¡Las botas de agua saltan!", "Botas de agua rojas con puntos blancos.", "¿Quién se esconde en la bota?"],
    },
    regenschnecke: { name: "caracol", gender: "m", sentences: ["Al caracol le gusta la lluvia.", "El caracol avanza muy despacio."] },
  },
  chains: [
    ["¡El viento sube la cometa muy alto!", "Y el molinillo gira.", "Las hojas vuelan del árbol."],
    ["¡Lluvia! La niña salta al charco.", "El caracol sale.", "Después de la lluvia crecen los hongos."],
    ["¡Plof! Cae una castaña.", "¡La ardilla la ha visto!"],
  ],
};
