// The days of „Alltagssituationen“ in Spanish (Latin American): the pages of the story of days.ts, by day id, one per
// scene in the same order, and how each day ends. Names as in kita.es.ts: Osito, Zorrito, el oso grande, la abuela
// Osa, la guardería.

import type { DayText } from "./days";

/** The days' pages of the story in Spanish. */
export const DAYS_ES: Partial<Record<string, DayText>> = {
  "tag-1": {
    pages: [
      "¡Buenos días! La abuela Osa está de visita. Hoy regresa a su casa.",
      "Luego el oso grande lleva a Osito a la guardería. Osito tiene ganas de ver a Zorrito.",
      "Después todos corren al pasto y juegan a las atrapadas.",
      "En la tarde, el oso grande recoge a Osito. Zorrito puede ir con ellos a cenar.",
      "Después de cenar, vienen por Zorrito. Para Osito es hora de dormir.",
    ],
    end: "Osito duerme profundamente. ¡Buenas noches! El día se terminó.",
  },
  "tag-2": {
    pages: [
      "¡Buenos días! Hoy hay guardería. Osito quiere vestirse sin ayuda.",
      "Luego el oso grande y Osito caminan juntos a la guardería.",
      "En el salón de juegos, Zorrito ya lo está esperando.",
      "Más tarde, todos salen al arenero.",
      "En la tarde, Osito juega en el parque de juegos. Entonces llega el oso grande a recogerlo.",
      "En casa, Osito está lleno de arena. ¡A la tina!",
    ],
    end: "Limpio y cansado, Osito se acurruca en la cama. ¡Buenas noches! El día se terminó.",
  },
  "tag-3": {
    pages: [
      "¡Buenos días! Osito acaba de despertarse. Camina despacito a la sala.",
      "Después de la nieve, Zorrito viene a calentarse. Hay galletas.",
      "Luego los dos pueden ver un programa.",
      "En la noche, Zorrito se va a su casa. Osito se duerme muy rápido.",
    ],
    end: "Osito duerme profundamente hasta la mañana. ¡Buenas noches! El día se terminó.",
  },
  "tag-4": {
    pages: [
      "Hoy llueve todo el día. Zorrito está de visita.",
      "En la tarde, Zorrito se va a su casa. Osito juega solo en el pasillo.",
      "La visita ya se fue. Entonces se despierta el bebé oso.",
      "Ahora todos tienen hambre. El oso grande hace panqueques.",
      "Después de comer, afuera oscurece. La lluvia es cada vez más fuerte.",
    ],
    end: "La tormenta ya pasó. Osito se duerme. ¡Buenas noches! El día se terminó.",
  },
  "tag-5": {
    pages: [
      "¡Buenos días! Hoy el oso grande ordena la casa.",
      "Después van al pediatra. Osito quiere ponerse la chaqueta sin ayuda.",
      "En el consultorio, ya les toca.",
      "Después del doctor, van de compras.",
      "De regreso a casa, pasan por el parque.",
      "En casa, Osito está cansado del día tan largo.",
    ],
    end: "En la noche, Osito se acurruca en la cama. ¡Buenas noches! El día se terminó.",
  },
  "tag-6": {
    pages: [
      "¡Buenos días! Hoy es el cumpleaños de Osito.",
      "Luego Osito lleva globos a la guardería. Uno para él y uno para Zorrito.",
      "Al mediodía, toda la guardería hace una fiesta.",
      "En la tarde, Zorrito viene a su casa. Hay pastel de cumpleaños.",
      "Hoy Zorrito puede quedarse a dormir. Los dos se ponen la pijama.",
    ],
    end: "¡Qué cumpleaños tan bonito! ¡Buenas noches! El día se terminó.",
  },
  "tag-7": {
    pages: [
      "¡Buenos días! En la guardería, Osito va por los bloques.",
      "Después Osito sigue jugando en el salón de juegos.",
      "Después de comer, todos van al parque de juegos.",
      "Luego Osito y Zorrito juegan en el pasto.",
    ],
    end: "En la tarde, el oso grande lo recoge. En casa, Osito se duerme rápido. ¡Buenas noches! El día se terminó.",
  },
  "tag-8": {
    pages: [
      "¡Buenos días! Hoy en la guardería todos juegan afuera.",
      "Luego Osito corre al pasto grande donde está el árbol.",
      "Debajo del árbol, Osito y Zorrito descansan.",
      "En la tarde llega el oso grande. Para terminar, todos suben una vez más al juego para trepar.",
    ],
    end: "En casa, Osito cuenta qué tan alto subió. Luego se duerme. ¡Buenas noches! El día se terminó.",
  },
};
