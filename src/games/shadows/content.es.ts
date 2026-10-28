import type { ShadowItem, ShadowTexts, ShadowTranslation } from "./content";

// Spanish texts for "Schatten finden" and "Wer schaut da raus?", by the ids of the pictures in content.ts. Each
// picture carries its article ("el elefante", "la jirafa"); "de" + "el" becomes "del" ("la sombra del elefante"),
// and a plural word ("las tijeras") takes the plural verb ("buscan", "están").

/** A picture's name in Spanish. */
export interface SpanishName {
  /** Lower case, without article: "elefante". Shown capitalized under the picture. */
  name: string;
  /** With its article: "el elefante". */
  the: string;
  /** The word is plural ("las tijeras"), so the verb is too: "buscan". */
  many?: true;
}

/** Pictures of content.ts by their id; one without an entry is said in German. */
export const SPANISH_NAMES: Record<string, SpanishName> = {
  elefant: { name: "elefante", the: "el elefante" },
  giraffe: { name: "jirafa", the: "la jirafa" },
  schildkroete: { name: "tortuga", the: "la tortuga" },
  schnecke: { name: "caracol", the: "el caracol" },
  schmetterling: { name: "mariposa", the: "la mariposa" },
  fisch: { name: "pececito", the: "el pececito" },
  hahn: { name: "gallo", the: "el gallo" },
  ente: { name: "patito", the: "el patito" },
  hase: { name: "conejito", the: "el conejito" },
  katze: { name: "gatito", the: "el gatito" },
  hund: { name: "perrito", the: "el perrito" },
  pferd: { name: "caballo", the: "el caballo" },
  kuh: { name: "vaca", the: "la vaca" },
  schwein: { name: "cerdito", the: "el cerdito" },
  schaf: { name: "ovejita", the: "la ovejita" },
  igel: { name: "erizo", the: "el erizo" },
  krebs: { name: "cangrejo", the: "el cangrejo" },
  tintenfisch: { name: "pulpo", the: "el pulpo" },
  dino: { name: "dinosaurio", the: "el dinosaurio" },
  krokodil: { name: "cocodrilo", the: "el cocodrilo" },
  eichhoernchen: { name: "ardilla", the: "la ardilla" },
  eule: { name: "búho", the: "el búho" },
  biene: { name: "abeja", the: "la abeja" },
  wal: { name: "ballena", the: "la ballena" },
  flamingo: { name: "flamenco", the: "el flamenco" },
  pinguin: { name: "pingüino", the: "el pingüino" },
  maus: { name: "ratoncito", the: "el ratoncito" },

  auto: { name: "auto", the: "el auto" },
  fahrrad: { name: "bici", the: "la bici" },
  lok: { name: "tren", the: "el tren" },
  flugzeug: { name: "avión", the: "el avión" },
  hubschrauber: { name: "helicóptero", the: "el helicóptero" },
  segelboot: { name: "velero", the: "el velero" },
  rakete: { name: "cohete", the: "el cohete" },
  traktor: { name: "tractor", the: "el tractor" },
  roller: { name: "monopatín", the: "el monopatín" },
  feuerwehr: { name: "camión de bomberos", the: "el camión de bomberos" },
  motorrad: { name: "moto", the: "la moto" },

  banane: { name: "plátano", the: "el plátano" },
  apfel: { name: "manzana", the: "la manzana" },
  birne: { name: "pera", the: "la pera" },
  moehre: { name: "zanahoria", the: "la zanahoria" },
  erdbeere: { name: "fresa", the: "la fresa" },
  melone: { name: "sandía", the: "la sandía" },
  kaese: { name: "queso", the: "el queso" },
  brezel: { name: "pretzel", the: "el pretzel" },
  eis: { name: "helado", the: "el helado" },
  pilz: { name: "hongo", the: "el hongo" },
  mais: { name: "mazorca", the: "la mazorca" },
  brokkoli: { name: "brócoli", the: "el brócoli" },
  pizza: { name: "pizza", the: "la pizza" },

  stern: { name: "estrella", the: "la estrella" },
  schirm: { name: "paraguas", the: "el paraguas" },
  schluessel: { name: "llave", the: "la llave" },
  ballon: { name: "globo", the: "el globo" },
  mond: { name: "luna", the: "la luna" },
  baum: { name: "árbol", the: "el árbol" },
  haus: { name: "casa", the: "la casa" },
  schere: { name: "tijeras", the: "las tijeras", many: true },
  gitarre: { name: "guitarra", the: "la guitarra" },
  schuh: { name: "zapato", the: "el zapato" },
  teddy: { name: "osito de peluche", the: "el osito de peluche" },
  drachen: { name: "cometa", the: "la cometa" },
  glocke: { name: "campana", the: "la campana" },
  herz: { name: "corazón", the: "el corazón" },
};

const capital = (text: string) => text.charAt(0).toLocaleUpperCase("es-ES") + text.slice(1);

/** "de" with the picture: "del elefante", "de la jirafa". */
const ofThe = (the: string) => (the.startsWith("el ") ? `del ${the.slice(3)}` : `de ${the}`);

/** The Spanish texts; a picture without its Spanish name gets the whole German sentence. */
export function spanishTexts(german: ShadowTexts): ShadowTexts {
  const about =
    (sentence: (es: SpanishName) => string, fallback: (item: ShadowItem) => string) =>
    (item: ShadowItem): string => {
      const es = SPANISH_NAMES[item.id];
      return es ? sentence(es) : fallback(item);
    };
  return {
    name: about((es) => capital(es.name), german.name),
    search: about((es) => `${capital(es.the)} ${es.many ? "buscan" : "busca"} su sombra.`, german.search),
    found: about((es) => `¡Bien! ¡Ahí está la sombra ${ofThe(es.the)}!`, german.found),
    thatIs: about((es) => `${es.many ? "Son" : "Es"} ${es.the}.`, german.thatIs),
    peek: "¿Quién se asoma?",
    there: about((es) => `¡Ahí ${es.many ? "están" : "está"} ${es.the}!`, german.there),
    shadow: (n) => `Sombra ${n}`,
    stars: (n) => `${n} hechos`,
  };
}

/** Spanish, for the table of languages in content.ts. */
export const SPANISH: ShadowTranslation = { names: SPANISH_NAMES, texts: spanishTexts };
