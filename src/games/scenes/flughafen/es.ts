import type { SceneTranslation } from "../types";

// The Spanish words of the Flughafen & Bahnhof picture: names (without article, with gender for el/la,
// `plural` for „luces“ and „palomas“), what each item says and the chain sentences. Tickets are
// „boletos“, understood in Spain and Latin America alike. Neutral Spanish for Spain and Latin America.

/** „Flughafen & Bahnhof“ in Spanish. */
export const ES: SceneTranslation = {
  title: "Aeropuerto y estación",
  description: "Avión, tren y cinta de equipaje en el aeropuerto y la estación.",
  items: {
    sonne: { name: "sol", gender: "m", sentences: ["¡El sol brilla!", "El sol sonríe."] },
    wolke: { name: "nube", gender: "f", sentences: ["La nube trae lluvia. ¡Plic, plac!", "La nube es blanca y suave."] },
    hubschrauber: {
      name: "helicóptero",
      gender: "m",
      sentences: ["¡Fup, fup, fup! El helicóptero vuela.", "El helicóptero es amarillo.", "El piloto te saluda."],
    },
    luftschiff: { name: "dirigible", gender: "m", sentences: ["El dirigible flota muy despacio.", "La gente de la cabina saluda."] },
    tower: {
      name: "torre de control",
      gender: "f",
      sentences: ["En la torre de control está la controladora.", "Ella dice a los aviones cuándo pueden despegar.", "El radar gira."],
    },
    lichter: { name: "luces", gender: "f", plural: true, sentences: ["Las luces muestran el camino a los aviones.", "¡Una, dos, tres, cuatro, cinco!"] },
    flugzeug: {
      name: "avión",
      gender: "m",
      sentences: ["¡El avión despega! ¡Fiuuu!", "Arriba al cielo y otra vez abajo.", "La gente mira por la ventanilla."],
    },
    windsack: { name: "manga de viento", gender: "f", sentences: ["La manga de viento muestra de dónde sopla el viento.", "¡Fuuu, sopla el viento!"] },
    hangar: { name: "hangar", gender: "m", sentences: ["En el hangar duermen los aviones.", "La puerta se abre. ¡Hola, avioncito!"] },
    hase: { name: "conejo", gender: "m", sentences: ["El conejo vive en el prado del aeropuerto.", "¡Hop, hop! El conejo salta."] },
    signal: { name: "señal", gender: "f", sentences: ["Rojo quiere decir: ¡alto!", "Ahora la señal está verde. El tren puede salir."] },
    speisewagen: { name: "vagón restaurante", gender: "m", sentences: ["En el vagón restaurante hay comida.", "El cocinero hace tortitas. ¡Qué rico!"] },
    wagen: { name: "vagón", gender: "m", sentences: ["La puerta se abre. ¿Quién baja?", "En el vagón hay mucha gente."] },
    lok: { name: "tren", gender: "m", sentences: ["¡Chu, chu! El tren llega.", "La locomotora es roja.", "¡Tuuuut! Ya está aquí el tren."] },
    uhr: { name: "reloj de la estación", gender: "m", sentences: ["¡Tic, tac! El reloj dice qué hora es.", "El tren llega puntual."] },
    spatz: { name: "gorrión", gender: "m", sentences: ["¡Pío! El gorrión está en el reloj.", "El gorrión canta una canción."] },
    schaffner: {
      name: "jefe de estación",
      gender: "m",
      sentences: ["¡Priiip! El jefe de estación toca el silbato.", "¡Todos al tren, por favor!", "La paleta verde quiere decir: ¡salida!"],
    },
    tafel: { name: "panel de salidas", gender: "m", sentences: ["¡Din, don! El tren sale enseguida.", "En el panel pone adónde van los trenes."] },
    reisende: { name: "viajera", gender: "f", sentences: ["¡Hola! La señora se va de vacaciones.", "Su maleta rueda detrás."] },
    automat: { name: "máquina de boletos", gender: "f", sentences: ["¡Pi, pi! Aquí hay boletos.", "¡Ahí sale el boleto!"] },
    treppenwagen: { name: "escalera", gender: "f", sentences: ["Por la escalera la gente sube al avión.", "¡Arriba la escalera!"] },
    tankwagen: { name: "camión cisterna", gender: "m", sentences: ["El camión cisterna trae combustible para el avión.", "La manguera se desenrolla."] },
    followme: { name: "coche guía", gender: "m", sentences: ["«Follow me» quiere decir: ¡sígueme!", "El coche le enseña el camino al avión."] },
    bus: { name: "autobús", gender: "m", sentences: ["El autobús lleva a la gente al aeropuerto.", "Las puertas se abren. ¡Todos arriba!", "¡Pi, pi!"] },
    huetchen: { name: "cono", gender: "m", sentences: ["El cono es naranja.", "¡Uy, el cono se tambalea!"] },
    einweiser: { name: "señalero", gender: "m", sentences: ["El señalero mueve sus paletas.", "¡Por aquí, avión! ¡Despacio, despacio!"] },
    taxi: { name: "taxi", gender: "m", sentences: ["¡Taxi! El taxi te lleva a casa.", "¡Pi, pi! El taxi es amarillo."] },
    gepaeckzug: { name: "tren de equipaje", gender: "m", sentences: ["El tren de equipaje lleva las maletas al avión.", "¡Traca, traca! Las maletas saltan."] },
    gepaeckband: { name: "cinta de equipaje", gender: "f", sentences: ["En la cinta las maletas suben.", "¡Arriba, arriba, arriba!"] },
    kind: { name: "niño", gender: "m", sentences: ["El niño juega a los aviones. ¡Brum!", "El niño pronto vuela de vacaciones."] },
    tauben: { name: "palomas", gender: "f", plural: true, sentences: ["¡Cu, cu! Las palomas picotean migas.", "¡Flap, flap!"] },
    kofferkuli: { name: "carrito de equipaje", gender: "m", sentences: ["En el carrito de equipaje van las maletas.", "¡Rueda, rueda, carrito!"] },
    katze: { name: "gato", gender: "m", sentences: ["¡Miau! El gato viaja en su caja.", "El gato se asoma."] },
    hund: { name: "perro", gender: "m", sentences: ["¡Guau, guau! El perro también vuela de vacaciones.", "El perro mueve la cola."] },
    pilotin: { name: "piloto", gender: "f", sentences: ["La piloto pilota el avión.", "¡Hola! La piloto saluda."] },
  },
  chains: [
    ["¡Verde! Chu, chu, el tren llega.", "El jefe de estación toca el silbato: ¡todos al tren!", "La puerta se abre y se cierra."],
    ["El señalero mueve las paletas.", "El avión puede despegar. ¡Fiuuu!"],
    ["¡Las palomas salen volando!", "El gato de la caja se asusta: ¡miau!"],
  ],
};
