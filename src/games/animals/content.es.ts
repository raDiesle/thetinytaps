import type { Animal, AnimalTexts, AnimalTranslation, Food } from "./content";
import type { Home, HomeId } from "./homes";

// Spanish texts for "Was gehört zum Tier?", by the ids of the animals, foods and homes in content.ts and
// homes.tsx. Each animal and food carries its article ("el conejito", "las zanahorias"); "a" + "el" becomes "al"
// ("Al conejito le gustan las zanahorias."), and "gusta"/"gustan" follows the food, never the child.

/** An animal in Spanish. */
export interface SpanishAnimal {
  /** Lower case, without article, shown under it: "conejito". */
  name: string;
  /** With its article: "el conejito", "la vaca". */
  the: string;
}

/** Animals by their id (one without an entry is said in German); warm diminutives where a child would say them. */
export const SPANISH_ANIMALS: Record<string, SpanishAnimal> = {
  hase: { name: "conejito", the: "el conejito" },
  hund: { name: "perrito", the: "el perrito" },
  katze: { name: "gatito", the: "el gatito" },
  maus: { name: "ratoncito", the: "el ratoncito" },
  vogel: { name: "pajarito", the: "el pajarito" },
  baer: { name: "osito", the: "el osito" },
  biene: { name: "abeja", the: "la abeja" },
  frosch: { name: "rana", the: "la rana" },
  kuh: { name: "vaca", the: "la vaca" },
  pferd: { name: "caballo", the: "el caballo" },
  eichhoernchen: { name: "ardilla", the: "la ardilla" },
  pinguin: { name: "pingüino", the: "el pingüino" },
  fisch: { name: "pececito", the: "el pececito" },
  spinne: { name: "araña", the: "la araña" },
  ente: { name: "patito", the: "el patito" },
  fuchs: { name: "zorro", the: "el zorro" },
  schwein: { name: "cerdito", the: "el cerdito" },
  affe: { name: "mono", the: "el mono" },
  huhn: { name: "gallina", the: "la gallina" },
  panda: { name: "panda", the: "el panda" },
  schnecke: { name: "caracol", the: "el caracol" },
  loewe: { name: "león", the: "el león" },
  giraffe: { name: "jirafa", the: "la jirafa" },
};

/** A food in Spanish. */
export interface SpanishFood {
  /** Lower case, without article, shown under the plate: "zanahoria". */
  name: string;
  /** With article, for "le gustan las zanahorias": the plural where one eats many. */
  likes: string;
  /** `likes` is plural, so the verb is "gustan". */
  many?: true;
}

/** Foods by their id; one without an entry is said in German. Words understood everywhere, Latin American where they differ (papa). */
export const SPANISH_FOODS: Record<string, SpanishFood> = {
  moehre: { name: "zanahoria", likes: "las zanahorias", many: true },
  knochen: { name: "hueso", likes: "los huesos", many: true },
  fisch: { name: "pescado", likes: "el pescado" },
  kaese: { name: "queso", likes: "el queso" },
  wurm: { name: "gusano", likes: "los gusanos", many: true },
  honig: { name: "miel", likes: "la miel" },
  blume: { name: "flor", likes: "las flores", many: true },
  fliege: { name: "mosca", likes: "las moscas", many: true },
  heu: { name: "heno", likes: "el heno" },
  apfel: { name: "manzana", likes: "las manzanas", many: true },
  nuss: { name: "nuez", likes: "las nueces", many: true },
  kartoffel: { name: "papa", likes: "las papas", many: true },
  banane: { name: "plátano", likes: "los plátanos", many: true },
  mais: { name: "maíz", likes: "el maíz" },
  bambus: { name: "bambú", likes: "el bambú" },
  salat: { name: "lechuga", likes: "la lechuga" },
  fleisch: { name: "carne", likes: "la carne" },
  blaetter: { name: "hojas", likes: "las hojas", many: true },
};

/** A home in Spanish. */
export interface SpanishHome {
  /** Lower case, without article, shown under the drawing: "caseta". */
  name: string;
  /** Where one lives, for "El perrito vive en la caseta.". */
  inPhrase: string;
}

/** Homes by their id; one without an entry is said in German. */
export const SPANISH_HOMES: Partial<Record<HomeId, SpanishHome>> = {
  huette: { name: "caseta", inPhrase: "en la caseta" },
  nest: { name: "nido", inPhrase: "en el nido" },
  aquarium: { name: "pecera", inPhrase: "en la pecera" },
  bienenstock: { name: "colmena", inPhrase: "en la colmena" },
  stall: { name: "establo", inPhrase: "en el establo" },
  hoehle: { name: "cueva", inPhrase: "en la cueva" },
  teich: { name: "estanque", inPhrase: "en el estanque" },
  bau: { name: "madriguera", inPhrase: "en la madriguera" },
  mauseloch: { name: "agujerito", inPhrase: "en el agujerito" },
  koerbchen: { name: "cestita", inPhrase: "en la cestita" },
  baum: { name: "árbol", inPhrase: "en el árbol" },
  netz: { name: "telaraña", inPhrase: "en la telaraña" },
  eis: { name: "hielo", inPhrase: "sobre el hielo" },
};

const capital = (text: string) => text.charAt(0).toLocaleUpperCase("es-ES") + text.slice(1);

/** "a" with the animal: "al conejito", "a la vaca". */
const toThe = (the: string) => (the.startsWith("el ") ? `al ${the.slice(3)}` : `a ${the}`);

/** The Spanish texts; what has no Spanish words yet is the whole German sentence. */
export function spanishTexts(german: AnimalTexts): AnimalTexts {
  const animal = (a: Animal) => SPANISH_ANIMALS[a.id];
  const food = (f: Food) => SPANISH_FOODS[f.id];
  const home = (h: Home) => SPANISH_HOMES[h.id];
  return {
    animal: (a) => (animal(a) ? capital(animal(a).name) : german.animal(a)),
    food: (f) => (food(f) ? capital(food(f).name) : german.food(f)),
    home: (h) => (home(h) ? capital(home(h)!.name) : german.home(h)),
    hungry: (a) => (animal(a) ? `¡${capital(animal(a).the)} tiene hambre!` : german.hungry(a)),
    yummy: (a, f) =>
      animal(a) && food(f)
        ? `¡Ñam, qué rico! ${capital(toThe(animal(a).the))} le ${food(f).many ? "gustan" : "gusta"} ${food(f).likes}. ¡Gracias!`
        : german.yummy(a, f),
    yuck: (a) => (animal(a) ? `¡Puaj! Eso no le gusta ${toThe(animal(a).the)}.` : german.yuck(a)),
    whereLives: (a) => (animal(a) ? `¿Dónde vive ${animal(a).the}?` : german.whereLives(a)),
    movedIn: (a, h) => (animal(a) && home(h) ? `¡Bien! ${capital(animal(a).the)} vive ${home(h)!.inPhrase}.` : german.movedIn(a, h)),
    livesHere: (resident) => (animal(resident) ? `¡No, aquí vive ${animal(resident).the}!` : german.livesHere(resident)),
    yuckBubble: "¡Puaj!",
    thanksBubble: "¡Gracias!",
    stars: (n) => `${n} hechos`,
  };
}

/** Spanish, for the table of languages in content.ts. */
export const SPANISH: AnimalTranslation = { words: { animals: SPANISH_ANIMALS, foods: SPANISH_FOODS, homes: SPANISH_HOMES }, texts: spanishTexts };
