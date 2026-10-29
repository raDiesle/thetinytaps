import type { SockTexts } from "./content";

// Spanish texts for "Socken-Paare". The praise says nothing about the child ("¡Qué listo!" would need a girl's form too).

/** The Spanish texts; a sentence added later without its Spanish is said in German (content.ts fills the gaps). */
export const SPANISH_TEXTS: Partial<SockTexts> = {
  start: "¡Busca dos calcetines iguales!",
  pair: ["¡Un par!", "¡Son iguales!", "¡Van juntos!", "¡Dos iguales!"],
  done: "¡Todos los calcetines están en el tendedero!",
  sock: (n) => `Calcetín ${n}`,
};
