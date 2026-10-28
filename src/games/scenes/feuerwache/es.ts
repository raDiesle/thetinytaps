import type { SceneTranslation } from "../types";

// The Spanish words of the Feuerwache picture: names (without article, with gender for el/la,
// `plural` for „cascos“, „flores“ and „botas“), what each item says and the chain sentences.
// The siren says „nino, nino“, as Spanish children say it. Neutral Spanish for Spain and Latin America.

/** „Feuerwache“ in Spanish. */
export const ES: SceneTranslation = {
  title: "Estación de bomberos",
  description: "Camión con escalera, sirena y perro bombero en la estación de bomberos.",
  items: {
    sonne: { name: "sol", gender: "m", sentences: ["¡El sol brilla!", "El sol sonríe."] },
    wolke: { name: "nube", gender: "f", sentences: ["La nube trae lluvia. ¡Plic, plac!", "La nube ayuda a los bomberos."] },
    hubschrauber: { name: "helicóptero", gender: "m", sentences: ["El helicóptero vuela. ¡Fup, fup, fup!", "Abajo cuelga un cubo con agua."] },
    turm: { name: "torre", gender: "f", sentences: ["En la torre se secan las mangueras.", "La puerta se abre. ¡Hola!", "La torre es muy alta."] },
    sirene: { name: "sirena", gender: "f", sentences: ["¡Nino, nino! La sirena suena.", "¡Bomberos, vengan rápido!"] },
    wache: {
      name: "estación de bomberos",
      gender: "f",
      sentences: ["Esta es la estación de bomberos. Aquí viven los camiones de bomberos.", "Las ventanas se abren. ¡Hola!", "El reloj gira: ¡din, don!"],
    },
    tor: { name: "portón", gender: "m", sentences: ["¡El portón se abre!", "Dentro está el camión de bomberos pequeño.", "El portón se cierra otra vez."] },
    helme: { name: "cascos", gender: "m", plural: true, sentences: ["Aquí cuelgan las chaquetas y los cascos.", "¡A vestirse rápido, y nos vamos!"] },
    rutschstange: { name: "barra", gender: "f", sentences: ["¡Fiuuu! El bombero baja por la barra.", "Así se baja muy rápido."] },
    glocke: { name: "campana de alarma", gender: "f", sentences: ["¡Riiiin! Suena la campana de alarma.", "¡Alarma! Los bomberos tienen que salir."] },
    taube: { name: "paloma", gender: "f", sentences: ["¡Cu, cu! La paloma está en el tejado.", "La paloma es gris."] },
    fahne: { name: "bandera", gender: "f", sentences: ["La bandera ondea al viento.", "En la bandera hay un casco."] },
    vogel: { name: "pájaro", gender: "m", sentences: ["¡Pío, pío! El pájaro canta.", "El pájaro está arriba del todo, en la bandera."] },
    blumen: { name: "flores", gender: "f", plural: true, sentences: ["Las flores son rojas y amarillas.", "Los bomberos riegan las flores."] },
    schmetterling: { name: "mariposa", gender: "f", sentences: ["Una mariposa revolotea.", "A la mariposa le gustan las flores."] },
    baum: { name: "árbol", gender: "m", sentences: ["El viento sopla en el árbol.", "En el árbol crecen manzanas rojas."] },
    katze: { name: "gato", gender: "m", sentences: ["¡Miau! El gato está arriba en el árbol.", "El gato no puede bajar. ¡Los bomberos ayudan!"] },
    eichhoernchen: { name: "ardilla", gender: "f", sentences: ["La ardilla roe una nuez.", "¡Hola, ardilla!"] },
    kommandowagen: { name: "coche de la jefa", gender: "m", sentences: ["En el coche está la jefa.", "La puerta se abre. ¡Pi, pi!"] },
    hydrant: { name: "hidrante", gender: "m", sentences: ["Del hidrante sale el agua para la manguera.", "¡Blub, blub!"] },
    krankenwagen: {
      name: "ambulancia",
      gender: "f",
      sentences: ["¡Nino, nino! La ambulancia ayuda cuando alguien está enfermo.", "La puerta se abre. ¡El osito saluda!"],
    },
    grill: { name: "parrilla", gender: "f", sentences: ["El abuelo asa salchichas. ¡Mmm!", "La parrilla echa un poco de humo."] },
    opa: { name: "abuelo", gender: "m", sentences: ["El abuelo da la vuelta a las salchichas.", "¡Hola! El abuelo se ríe."] },
    puppe: { name: "muñeco de práctica", gender: "m", sentences: ["Con el muñeco practican los bomberos.", "¡Uy, el muñeco se tambalea!"] },
    feuerwehrauto: {
      name: "camión de bomberos",
      gender: "m",
      sentences: ["¡Nino, nino! Llega el camión de bomberos.", "La escalera sube muy alto.", "El camión de bomberos es rojo."],
    },
    feuerwehrfrau: { name: "bombera", gender: "f", sentences: ["¡Agua va! La bombera echa agua.", "La manguera es larga y roja."] },
    feuerwehrmann: { name: "bombero", gender: "m", sentences: ["¡Priiip! El bombero toca el silbato.", "El bombero saluda. ¡Hola!"] },
    huetchen: { name: "cono", gender: "m", sentences: ["El cono es naranja y blanco.", "¡Hop! El cono salta."] },
    hund: { name: "perro bombero", gender: "m", sentences: ["¡Guau, guau! El perro bombero lleva casco.", "El perro tiene manchas negras."] },
    kind: { name: "niño", gender: "m", sentences: ["El niño visita a los bomberos.", "El niño también tiene casco. ¡Hurra!"] },
    luftballon: { name: "globo", gender: "m", sentences: ["El globo es amarillo.", "¡Agárralo fuerte!"] },
    feuerloescher: { name: "extintor", gender: "m", sentences: ["¡Pffft! Del extintor sale espuma blanca.", "El extintor es rojo."] },
    bobbycar: { name: "carrito", gender: "m", sentences: ["El carrito es un camión de bomberos pequeño.", "¡Pi, pi! El carrito avanza."] },
    ente: { name: "patito", gender: "m", sentences: ["¡Cua! El patito nada en el charco.", "El patito es amarillo."] },
    schlauchrolle: { name: "carrete de manguera", gender: "m", sentences: ["En el carrete está enrollada la manguera.", "El carrete gira. ¡Ratatá!"] },
    stiefel: { name: "botas", gender: "f", plural: true, sentences: ["Las botas están listas. ¡Adentro y vamos!", "¡Pum, pum!"] },
    maus: { name: "ratón", gender: "m", sentences: ["¡Pii! El ratón vive en la bota.", "¡Hola, ratoncito!"] },
    schnecke: { name: "caracol", gender: "m", sentences: ["El caracol avanza muy despacio.", "El caracol lleva su casa en la espalda."] },
  },
  chains: [
    ["¡Riiiin! La parrilla echa humo. ¡Alarma!", "¡Agua va! La bombera echa agua.", "El abuelo se ríe: ¡gracias, bomberos!"],
    ["¡La escalera sube hasta el gato!", "¡Hurra! ¡El gato está a salvo!"],
    ["¡Rápido! El bombero baja por la barra.", "¡El portón se abre!", "El perro bombero ladra: ¡guau, guau!"],
  ],
};
