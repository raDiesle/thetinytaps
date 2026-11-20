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
  "tag-9": {
    pages: [
      "¡Buenos días! Afuera ya está aclarando. Osito se despierta. Hoy hay guardería.",
      "Después Osito camina despacito a la cocina. El oso grande pone la mesa.",
      "Luego el oso grande lleva a Osito a la guardería. Allí Zorrito ya está pintando en la mesa.",
      "Después de pintar, Zorrito construye una torre alta en el salón de juegos.",
      "Después de comer, todos se acuestan a dormir la siesta. Zorrito y Erizo se duermen rápido.",
      "Después de la siesta, todos juegan en el salón de juegos. Pronto llegan los grandes a recogerlos.",
    ],
    end: "En casa, Osito cuenta cómo le fue en la guardería. Luego se duerme. ¡Buenas noches! El día se terminó.",
  },
  "tag-10": {
    pages: [
      "¡Buenos días! Osito y el oso grande desayunan juntos.",
      "Después del desayuno, ¡en marcha! En la mesa de dibujo ya están sentados Conejito y el mapache.",
      "Más tarde, todos juegan afuera en el arenero.",
      "En la tarde, el oso grande lo recoge. Fue un día largo.",
      "Después de cenar, es hora de lavarse los dientes. ¡Al baño!",
    ],
    end: "Con los dientes limpios, Osito se acurruca en la cama. ¡Buenas noches! El día se terminó.",
  },
  "tag-11": {
    pages: [
      "¡Buenos días! Osito tiene el pelo muy largo. Por eso hoy van a la peluquería.",
      "Después van de compras. Osito lleva su conejo de peluche.",
      "En la tarde, Osito anda en su monopatín afuera. Entonces llega Zorrito.",
      "Después Osito tiene mucha hambre. El oso grande abre el refrigerador.",
      "En la noche, Osito juega en pijama con su tren.",
    ],
    end: "Después del cuento, Osito se duerme. ¡Buenas noches! El día se terminó.",
  },
  "tag-12": {
    pages: [
      "¡Buenos días! Hoy Zorrito viene a jugar al jardín.",
      "Después Osito y Zorrito riegan las flores.",
      "En la tarde suena el timbre. Es el papá de Zorrito.",
      "Después Osito hace su maleta. ¡Mañana van al mar!",
    ],
    end: "Por fin Osito se duerme. Mañana van al mar. ¡Buenas noches! El día se terminó.",
  },
  "tag-13": {
    pages: [
      "¡Buenos días! Hoy todos van a casa de la abuela Osa. Ella vive junto al mar.",
      "En casa de la abuela Osa brilla el sol. Osito y el oso grande hacen un pícnic en el pasto.",
      "En la tarde, el oso grande regresa a casa con el bebé. Hoy Osito duerme por primera vez en casa de la abuela.",
    ],
    end: "La abuela Osa lo arropa bien. Mañana van a hacer castillos de arena en la playa. ¡Buenas noches! El día se terminó.",
  },
  "tag-14": {
    pages: [
      "¡Buenos días! Osito tiene un resfriado. Hoy se queda en casa.",
      "En la mañana ya se siente mejor. Hace un dibujo para el oso grande.",
      "Después de comer, Osito saca su rompecabezas de animales de la granja.",
      "Después Osito juega con su carrito rojo. El bebé gatea hacia él.",
      "En la tarde, Osito pinta en la mesa. El bebé también quiere pintar.",
    ],
    end: "El resfriado ya casi se quitó. Osito duerme profundamente. ¡Buenas noches! El día se terminó.",
  },
  "tag-15": {
    pages: [
      "¡Buenos días! Llovió toda la noche. Osito y Zorrito salen a pasear.",
      "De regreso a casa, Osito pasa por el parque. Entonces llega la señora Zorro con un perrito.",
      "En la tarde, Zorrito viene de visita. Los dos están muy sucios por la lluvia. ¡A la tina!",
    ],
    end: "Después vienen por Zorrito. Recién bañado, Osito se duerme. ¡Buenas noches! El día se terminó.",
  },
};
