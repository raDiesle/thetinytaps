// Spanish language pack (Spain, es-ES): the 27 letters of the alphabet with Ñ, words a toddler knows, and
// "¡Be de barco!" as children's alphabet books say it. Words are written with a capital like labels and small
// inside a sentence. The Ñ key sits where Spanish keyboards have it (right of L), on every keyboard.

import { de } from "./de";
import { relabel } from "./translate";
import type { Countable, KeyPress, LanguagePack, LetterEntry, ThemeId, WordEntry } from "./types";

const w = (word: string, emoji: string, image?: string): WordEntry => ({ word, emoji, image });
const themed =
  (theme: ThemeId) =>
  (word: string, emoji: string, image?: string): WordEntry => ({ word, emoji, image, theme });
const animal = themed("animals");
const vehiculo = themed("vehicles");
const comida = themed("food");
const cuerpo = themed("body");
const ropa = themed("clothes");
const familia = themed("family");
const musica = themed("music");
const naturaleza = themed("nature");
const fiesta = themed("holidays");

const letter = (upper: string, spoken: string, words: WordEntry[]): LetterEntry => ({
  upper,
  lower: upper.toLocaleLowerCase("es-ES"),
  spoken,
  words,
});

// The first sound matches the letter where Spanish allows it (no "Cebra" for C, no "Gigante" for G).
// "Rosa" and "Naranja" are colours here, so they don't stand under R and N as well.
const letters: LetterEntry[] = [
  letter("A", "a", [
    animal("Abeja", "🐝"),
    naturaleza("Árbol", "🌳"),
    vehiculo("Avión", "✈️"),
    naturaleza("Agua", "💧"),
    animal("Araña", "🕷️"),
    familia("Abuela", "👵"),
    familia("Abuelo", "👴"),
    animal("Ardilla", "🐿️"),
    naturaleza("Arcoíris", "🌈"),
    musica("Acordeón", "🪗"),
  ]),
  letter("B", "be", [
    vehiculo("Barco", "🚢"),
    animal("Ballena", "🐳"),
    animal("Burro", "🫏"),
    animal("Búho", "🦉"),
    familia("Bebé", "👶"),
    vehiculo("Bicicleta", "🚲"),
    ropa("Botas", "👢"),
    w("Balón", "⚽"),
    ropa("Bufanda", "🧣"),
    musica("Banjo", "🪕"),
  ]),
  letter("C", "ce", [
    w("Casa", "🏠"),
    vehiculo("Coche", "🚗"),
    animal("Caballo", "🐴"),
    animal("Cerdo", "🐷"),
    animal("Conejo", "🐰"),
    animal("Cocodrilo", "🐊"),
    vehiculo("Camión", "🚚"),
    musica("Campana", "🔔"),
    vehiculo("Cohete", "🚀"),
    w("Corona", "👑"),
    animal("Caracol", "🐌"),
    animal("Cangrejo", "🦀"),
    ropa("Calcetín", "🧦"),
    ropa("Camiseta", "👕"),
  ]),
  letter("D", "de", [
    animal("Dinosaurio", "🦕"),
    animal("Delfín", "🐬"),
    animal("Dragón", "🐉"),
    cuerpo("Dedo", "☝️"),
    cuerpo("Diente", "🦷"),
    comida("Donut", "🍩"),
  ]),
  letter("E", "e", [animal("Elefante", "🐘"), naturaleza("Estrella", "⭐"), animal("Erizo", "🦔"), w("Escoba", "🧹"), w("Escalera", "🪜")]),
  letter("F", "efe", [
    naturaleza("Flor", "🌸"),
    animal("Foca", "🦭"),
    comida("Fresa", "🍓"),
    naturaleza("Fuego", "🔥"),
    animal("Flamenco", "🦩"),
    musica("Flauta", "🪈"),
  ]),
  letter("G", "ge", [
    animal("Gato", "🐱"),
    animal("Gallina", "🐔"),
    animal("Gallo", "🐓"),
    w("Gafas", "👓"),
    fiesta("Globo", "🎈"),
    musica("Guitarra", "🎸"),
    animal("Gorila", "🦍"),
    ropa("Gorra", "🧢"),
    comida("Galleta", "🍪"),
    animal("Gusano", "🐛"),
  ]),
  letter("H", "hache", [
    comida("Helado", "🍦"),
    animal("Hipopótamo", "🦛"),
    animal("Hormiga", "🐜"),
    comida("Huevo", "🥚"),
    naturaleza("Hoja", "🍃"),
    comida("Hamburguesa", "🍔"),
    vehiculo("Helicóptero", "🚁"),
    familia("Hermano", "👦"),
    familia("Hermana", "👧"),
  ]),
  letter("I", "i", [naturaleza("Isla", "🏝️"), animal("Iguana", "🦎"), w("Imán", "🧲")]),
  letter("J", "jota", [animal("Jirafa", "🦒"), w("Jabón", "🧼"), animal("Jaguar", "🐆")]),
  letter("K", "ka", [animal("Koala", "🐨"), comida("Kiwi", "🥝"), vehiculo("Kayak", "🛶")]),
  letter("L", "ele", [
    animal("León", "🦁"),
    naturaleza("Luna", "🌙"),
    comida("Leche", "🥛"),
    comida("Limón", "🍋"),
    w("Lápiz", "✏️"),
    w("Libro", "📖"),
    animal("Lobo", "🐺"),
    animal("Loro", "🦜"),
    naturaleza("Lluvia", "🌧️"),
    comida("Lechuga", "🥬"),
  ]),
  letter("M", "eme", [
    familia("Mamá", "👩"),
    animal("Mono", "🐒"),
    comida("Manzana", "🍎"),
    animal("Mariposa", "🦋"),
    cuerpo("Mano", "✋"),
    vehiculo("Moto", "🏍️"),
    naturaleza("Mar", "🌊"),
    musica("Maracas", "🪇"),
    comida("Melón", "🍈"),
    w("Mochila", "🎒"),
  ]),
  letter("N", "ene", [cuerpo("Nariz", "👃"), naturaleza("Nube", "☁️"), naturaleza("Nido", "🪺"), naturaleza("Nieve", "❄️"), musica("Notas", "🎵")]),
  letter("Ñ", "eñe", [animal("Ñu", "🦬")]),
  letter("O", "o", [animal("Oso", "🐻"), animal("Oveja", "🐑"), cuerpo("Ojo", "👁️"), cuerpo("Oreja", "👂"), naturaleza("Ola", "🌊"), animal("Oca", "🪿")]),
  letter("P", "pe", [
    familia("Papá", "👨"),
    animal("Perro", "🐶"),
    animal("Pato", "🦆"),
    animal("Pez", "🐟"),
    animal("Pollito", "🐥"),
    animal("Pingüino", "🐧"),
    animal("Pájaro", "🐦"),
    w("Pelota", "🏐"),
    comida("Pan", "🍞"),
    comida("Pera", "🍐"),
    comida("Piña", "🍍"),
    comida("Pizza", "🍕"),
    comida("Plátano", "🍌"),
    animal("Pulpo", "🐙"),
    musica("Piano", "🎹"),
    cuerpo("Pie", "🦶"),
    fiesta("Pastel", "🎂"),
    w("Payaso", "🤡"),
    w("Paraguas", "☂️"),
  ]),
  letter("Q", "cu", [comida("Queso", "🧀")]),
  letter("R", "erre", [
    animal("Ratón", "🐭"),
    animal("Rana", "🐸"),
    w("Reloj", "⏰"),
    fiesta("Regalo", "🎁"),
    w("Robot", "🤖"),
    animal("Rinoceronte", "🦏"),
    w("Reina", "👸"),
    vehiculo("Rueda", "🛞"),
  ]),
  letter("S", "ese", [
    naturaleza("Sol", "☀️"),
    animal("Serpiente", "🐍"),
    comida("Sandía", "🍉"),
    ropa("Sombrero", "👒"),
    naturaleza("Seta", "🍄"),
    w("Silla", "🪑"),
    comida("Sopa", "🍲"),
    w("Sirena", "🧜"),
    animal("Saltamontes", "🦗"),
  ]),
  letter("T", "te", [
    vehiculo("Tren", "🚂"),
    animal("Tigre", "🐯"),
    animal("Tortuga", "🐢"),
    comida("Tomate", "🍅"),
    w("Taza", "☕"),
    musica("Tambor", "🥁"),
    musica("Trompeta", "🎺"),
    vehiculo("Tractor", "🚜"),
    vehiculo("Taxi", "🚕"),
    animal("Tiburón", "🦈"),
    w("Teléfono", "📱"),
    w("Tijeras", "✂️"),
  ]),
  letter("U", "u", [comida("Uva", "🍇"), animal("Unicornio", "🦄"), cuerpo("Uña", "💅")]),
  letter("V", "uve", [
    animal("Vaca", "🐮"),
    fiesta("Vela", "🕯️"),
    musica("Violín", "🎻"),
    naturaleza("Volcán", "🌋"),
    ropa("Vestido", "👗"),
    w("Vaso", "🥛"),
    vehiculo("Velero", "⛵"),
  ]),
  letter("W", "uve doble", [comida("Wafle", "🧇")]),
  letter("X", "equis", [musica("Xilófono", "🎶", "images/xylophon.svg")]),
  letter("Y", "ye", [vehiculo("Yate", "🛥️"), w("Yoyó", "🪀"), comida("Yogur", "🥣")]),
  letter("Z", "zeta", [ropa("Zapato", "👞"), comida("Zanahoria", "🥕"), animal("Zorro", "🦊"), comida("Zumo", "🧃"), ropa("Zapatilla", "👟")]),
];

/** Spanish counts with "un" or "una" for one, so a countable knows its gender. */
interface SpanishCountable extends Countable {
  gender: "m" | "f";
}

const thing = (emoji: string, gender: SpanishCountable["gender"], singular: string, plural: string, theme?: ThemeId): SpanishCountable => ({
  emoji,
  gender,
  singular,
  plural,
  theme,
});

// No children or girls and boys: "un niño" / "una niña" would choose.
const countables: SpanishCountable[] = [
  thing("🦆", "m", "pato", "patos", "animals"),
  thing("🐞", "f", "mariquita", "mariquitas", "animals"),
  thing("🐟", "m", "pez", "peces", "animals"),
  thing("🐥", "m", "pollito", "pollitos", "animals"),
  thing("🐝", "f", "abeja", "abejas", "animals"),
  thing("🐸", "f", "rana", "ranas", "animals"),
  thing("🚗", "m", "coche", "coches", "vehicles"),
  thing("🚌", "m", "autobús", "autobuses", "vehicles"),
  thing("🚜", "m", "tractor", "tractores", "vehicles"),
  thing("🚲", "f", "bicicleta", "bicicletas", "vehicles"),
  thing("✈️", "m", "avión", "aviones", "vehicles"),
  thing("🍎", "f", "manzana", "manzanas", "food"),
  thing("🍓", "f", "fresa", "fresas", "food"),
  thing("🍌", "m", "plátano", "plátanos", "food"),
  thing("🥕", "f", "zanahoria", "zanahorias", "food"),
  thing("🍪", "f", "galleta", "galletas", "food"),
  thing("🦷", "m", "diente", "dientes", "body"),
  thing("👂", "f", "oreja", "orejas", "body"),
  thing("🦶", "m", "pie", "pies", "body"),
  thing("🦴", "m", "hueso", "huesos", "body"),
  thing("🧦", "m", "calcetín", "calcetines", "clothes"),
  thing("🧢", "f", "gorra", "gorras", "clothes"),
  thing("👕", "f", "camiseta", "camisetas", "clothes"),
  thing("🧤", "m", "guante", "guantes", "clothes"),
  thing("👶", "m", "bebé", "bebés", "family"),
  thing("🎵", "f", "nota", "notas", "music"),
  thing("🎸", "f", "guitarra", "guitarras", "music"),
  thing("🔔", "f", "campana", "campanas", "music"),
  thing("🎺", "f", "trompeta", "trompetas", "music"),
  thing("🌳", "m", "árbol", "árboles", "nature"),
  thing("🍄", "f", "seta", "setas", "nature"),
  thing("🌷", "m", "tulipán", "tulipanes", "nature"),
  thing("🌼", "f", "flor", "flores", "nature"),
  thing("🎈", "m", "globo", "globos", "holidays"),
  thing("🎁", "m", "regalo", "regalos", "holidays"),
  thing("🕯️", "f", "vela", "velas", "holidays"),
  thing("🥚", "m", "huevo de Pascua", "huevos de Pascua", "holidays"),
  thing("⭐", "f", "estrella", "estrellas"),
];

const numberWords = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];

/** "Un pato", "una abeja", "tres patos" – with the first letter big, as a sentence starts. */
function countSentence(n: number, countable: Countable) {
  const item = countable as SpanishCountable;
  const text = n === 1 ? `${item.gender === "f" ? "una" : "un"} ${item.singular}` : `${numberWords[n]} ${item.plural}`;
  return `¡${text.charAt(0).toLocaleUpperCase("es-ES")}${text.slice(1)}!`;
}

/** Words are written with a capital like labels; inside a sentence they are small: "¡Be de barco!". */
const small = (word: WordEntry) => word.word.toLocaleLowerCase("es-ES");
const capital = (text: string) => text.charAt(0).toLocaleUpperCase("es-ES") + text.slice(1);

/** Spanish keyboards have Ñ right of L: that key types it on every keyboard (Ö on a German one). */
const spanishLetterOf = (e: KeyPress) => (e.code === "Semicolon" ? "Ñ" : undefined);

export const es: LanguagePack = {
  speechLang: "es-ES",
  themes: [
    { id: "animals", label: "Animales", emoji: "🐾" },
    { id: "vehicles", label: "Vehículos", emoji: "🚗" },
    { id: "food", label: "Comida", emoji: "🍎" },
    { id: "body", label: "Cuerpo", emoji: "🖐️" },
    { id: "clothes", label: "Ropa", emoji: "👕" },
    { id: "family", label: "Familia", emoji: "👪" },
    { id: "music", label: "Música", emoji: "🎵" },
    { id: "nature", label: "Naturaleza", emoji: "🌳" },
    { id: "holidays", label: "Fiestas", emoji: "🎄" },
  ],
  letters,
  numberWords,
  countables,
  zero: { emoji: "🪹", sentence: "¡El nido está vacío!" },
  letterSentence: (l, word) => `¡${capital(l.spoken)} de ${small(word)}!`,
  findPrompt: (l) => `¿Dónde está la ${l.spoken}?`,
  keyboardRows: ["1234567890", "QWERTYUIOP", "ASDFGHJKLÑ", "ZXCVBNM"],
  letterOfKey: spanishLetterOf,
  countSentence,
  praise: ["¡Muy bien!", "¡Bravo!", "¡Genial!", "¡Súper!", "¡Hurra!"],
  firstLetterPrompt: (word) => `¡${word.word}! ¿Con qué letra empieza ${small(word)}?`,
  colors: relabel(de.colors, {
    "🔴": "Rojo",
    "🔵": "Azul",
    "🟡": "Amarillo",
    "🟢": "Verde",
    "🟣": "Morado",
    "🩷": "Rosa",
    "🟠": "Naranja",
  }),
  actions: relabel(de.actions, {
    "🐸": "Salta",
    "🏃": "Corre",
    "😴": "Duerme",
    "💃": "Baila",
    "👋": "Saluda",
    "🐱": "Gira",
    "🐦": "Vuela",
    "🐟": "Nada",
    "👏": "Aplaude",
  }),
  joinIn: (word) => `¡${word.word} conmigo!`,
  whistle: "¡Chu, chu!",
};
