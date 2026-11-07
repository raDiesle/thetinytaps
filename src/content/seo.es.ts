import type { PageText, SeoTranslation } from "./seo";

// The search engine texts in Spanish, for the pages under /es/ (see seo.ts), by German address. Written in a neutral
// Spanish understood in Spain and Latin America, for what parents search: "juegos para niños pequeños", "gratis",
// "sin anuncios", "sin conexión". Imported only by texts-es.ts and tools/build.ts. No `@/` imports: the build reads it.

const scene = (title: string, things: string): PageText => ({
  title: `${title}: lámina viva para niños pequeños`,
  description: `${title}, una lámina para tocar: ${things} se mueven y suenan. Para niños pequeños, gratis y sin anuncios.`,
  text: `Una lámina para buscar y encontrar que cobra vida: ${things}. Cada toque despierta algo, con sonido y movimiento. Además: buscar, colorear y explorar libremente.`,
});

/** The Spanish texts of every page. */
export const SEO_ES: SeoTranslation = {
  locale: "es_ES",
  promise:
    "Gratis, sin anuncios, sin registro, funciona sin conexión y en siete idiomas. Con pantalla táctil o teclado, mejor en compañía de una persona adulta.",
  imageAlt: "Una familia de zorros y una familia de osos leen juntas un libro ilustrado sobre una manta de pícnic.",
  pages: {
    "/": {
      title: "Juegos para niños pequeños y ayudas diarias – gratis",
      description:
        "Juegos educativos y ayudantes del día a día para niños pequeños: láminas, emociones, letras, temporizador, dientes, orinal, premios. Sin anuncios.",
      text: "Fun for Both es una estantería llena de libros ilustrados para jugar, para grandes y pequeños juntos: cada toque y cada tecla hace algo enseguida, nada está mal y no hay nada que leer. En los libros esperan láminas para buscar y encontrar, aventuras en movimiento, reacciones en cadena y pequeñas aventuras, emociones, letras y números, emparejar y reconocer. Y como el día con un niño pequeño tiene sus propios pequeños obstáculos, justo al lado están nuestros ayudantes del día a día: un temporizador que muestra el tiempo con imágenes, lavarse los dientes con canción, el juego del orinal, una tabla de recompensas, una rutina diaria con pictogramas y una cuenta atrás «¿Cuántas noches faltan?», en la tablet o para imprimir.",
    },
    "/spiele/lebendige-welten/": {
      title: "Láminas vivas e historias para niños pequeños",
      description:
        "Láminas vivas para buscar, juegos de movimiento, reacciones en cadena y pequeñas aventuras que responden a cada toque. Para niños pequeños, sin anuncios.",
      text: "Imágenes e historias que responden a cada toque: más de veinte «Imágenes vivas», «Aventuras en movimiento» para moverse junto al zorro Tapsi, la «Reacción en cadena» con veinte máquinas y circuitos de canicas, y «Pequeñas aventuras» en el ascensor, por caminos y en pequeñas películas: con los bomberos, en la panadería o con una carta para la abuela.",
    },
    "/spiele/gefuehle/": {
      title: "Juegos de emociones para niños pequeños",
      description: "Situaciones cotidianas con el osito, ¿Cómo estás? y ¿Qué necesito?: el niño muestra su emoción, con qué fuerza la siente y qué le ayuda.",
      text: "Un libro ilustrado sobre las emociones con tres juegos: en «Situaciones cotidianas» el osito vive día a día lo que los niños conocen –enojo, tristeza, miedo y alegría– y el niño elige qué le ayuda. En «¿Cómo estás?» el niño muestra su propia emoción y con qué fuerza la siente, y en «¿Qué necesito?», lo que le sienta bien ahora.",
    },
    "/spiele/buchstaben-zahlen/": {
      title: "Aprender letras y números – juegos de teclado",
      description:
        "Teclear libre, contar, todos juntos y escribir palabras: cada tecla muestra su letra con imagen y voz, y los números llegan para contar y saltar.",
      text: "Cuatro juegos en el teclado o en la pantalla: «Teclear libre» con letra, imagen y palabra; «Contar» con números y cosas; «Todos juntos», donde un zorrito o un osito salta, aplaude o zapatea cada número; y «Escribir palabras» con primeras palabras, colores, verbos de acción y «¿Dónde está la B?».",
    },
    "/spiele/zuordnen/": {
      title: "Juegos de emparejar para niños pequeños",
      description:
        "¿Qué necesita el animal, qué va junto, qué sombra encaja, qué calcetines son iguales? Primeros juegos de emparejar para niños pequeños, sin anuncios.",
      text: "Cuatro primeros juegos de emparejar: en «¿Qué necesita el animal?» el animal recibe su comida y su casa; en «¿Qué va junto?» se encuentran el cepillo y la pasta de dientes, o los bomberos y su manguera; en «Reconocer» el niño busca sombras y animales en el arbusto; y en «Pares de calcetines» los calcetines iguales van al tendedero. Tocar o arrastrar, sin errores, y cada juego se vuelve solo más fácil o más difícil.",
    },
    "/bilder/": {
      title: "Láminas vivas para tocar – buscar y encontrar",
      description:
        "Más de 20 láminas para buscar y encontrar: obra, granja, zoo, estación de bomberos y más. Todo se mueve y suena. Para niños pequeños, sin anuncios.",
      text: "Láminas para buscar y encontrar que cobran vida: las excavadoras excavan, las vacas mugen, el camión de bomberos sale. Con buscar, colorear, dibujar calles y explorar, para niños pequeños.",
    },
    "/abenteuer/": {
      title: "Juegos de movimiento en casa para niños pequeños",
      description:
        "Aventuras en movimiento para hacer juntos: el zorro Tapsi enseña a saltar, estirarse y andar de puntillas, y el niño lo imita frente a la pantalla.",
      text: "Una historia de movimiento para casa: Tapsi salta, se agacha y se estira, el niño se mueve con él y el mundo responde. Sin leer: Tapsi lo dice todo.",
    },
    "/gefuehle/": {
      title: "Emociones para niños pequeños: situaciones cotidianas",
      description:
        "Enojo, tristeza, miedo, alegría: el osito vive situaciones cotidianas en casa y en la guardería, y el niño elige qué le ayuda. Sin anuncios.",
      text: "Pequeñas historias del oso, contadas como días de la mañana a la noche: siente enojo, tristeza, miedo o alegría, y el niño elige entre dos ideas qué le ayuda. Las escenas también vienen ordenadas por emociones. Quien prefiera contar la historia con sus propias palabras apaga la voz con un toque y abre el texto completo para leerlo en voz alta. Para hablar de emociones con niños pequeños.",
    },
    "/wie-gehts-dir/": {
      title: "¿Cómo estás? Mostrar emociones para niños pequeños",
      description: "Alegría, orgullo, cansancio o enojo: el niño toca la imagen que va con su emoción y muestra con qué fuerza la siente ahora. Sin anuncios.",
      text: "Ocho emociones en dos grupos, las agradables y las desagradables, cada una con el osito en un momento que los niños conocen. El niño toca su emoción, luego tres imágenes muestran la misma emoción un poco, bastante y muchísimo, y el niño elige con qué fuerza la siente ahora. Desde ahí se sigue a «¿Qué necesito?». Un comienzo para hablar de emociones.",
    },
    "/was-brauche-ich/": {
      title: "¿Qué necesito? Necesidades para niños pequeños",
      description:
        "Un abrazo, estar a solas, correr, soplar, beber algo o descansar: el niño muestra con una imagen lo que le sienta bien ahora. Sin anuncios.",
      text: "Cuando una emoción es grande, ayuda saber qué se necesita. El niño toca una imagen –un abrazo, estar a solas, correr y saltar, zapatear y soplar, beber, comer algo, descansar o una canción– y los padres ven qué le sienta bien ahora.",
    },
    "/kettenreaktion/": {
      title: "Reacción en cadena y circuito de canicas",
      description:
        "Una canica echa a rodar y pone en marcha una máquina: circuitos de canicas y reacciones en cadena para tocar y asombrarse. Para niños pequeños.",
      text: "Veinte circuitos y máquinas: las canicas ruedan sobre madera, nieve, toboganes de agua y cintas transportadoras, las fichas de dominó y las cosas de casa caen, una empuja a la siguiente. Un toque pone en marcha la reacción en cadena, y en un punto la máquina espera hasta que el niño la deja seguir con otro toque: para asombrarse y volver a empezar.",
    },
    "/kleine-abenteuer/": {
      title: "Pequeñas aventuras: historias para niños pequeños",
      description:
        "Aventuras cortas con imágenes: subir en ascensor, recorrer caminos y ver pequeñas películas como en la panadería. Cada toque hace avanzar la historia.",
      text: "Aventuras de pocos minutos: subir en ascensor y descubrir algo en cada piso, recorrer un camino –detrás de la pelota, la cometa o el trenecito– y celebrar al final, o vivir una pequeña película: salir con los bomberos, llevar una carta a la abuela u hornear panecillos, un pretzel o un pastel en la panadería. Por el camino, el niño también decide.",
    },
    "/tiere/": {
      title: "Alimentar a los animales – juego para niños pequeños",
      description:
        "¿Qué va con cada animal? ¿Qué come, qué nos da, dónde vive y en qué se convierte la oruga? Con sonidos de animales, para niños pequeños, sin anuncios.",
      text: "El conejo quiere una zanahoria, el elefante cacahuetes, la vaca nos da leche, el castor busca su madriguera, la oruga se convierte en mariposa y la semilla en girasol: basta tocar la comida, la leche, el huevo o la casa, y el animal se alegra y hace su sonido. Muchos animales de la granja, del bosque, del zoo y del mar. El juego se vuelve solo más fácil o más difícil.",
    },
    "/zusammen/": {
      title: "¿Qué va junto? – emparejar para niños pequeños",
      description:
        "Cepillo y pasta de dientes, llave y puerta, los bomberos y su manguera: los niños pequeños encuentran qué va junto y lo ven funcionar. Sin anuncios.",
      text: "Arriba está el cepillo de dientes, abajo la pasta, una llave y una tapa: el niño toca lo que va con él, y los dos se ponen en marcha: la pasta deja un poquito sobre el cepillo, la llave gira y la puerta se abre. Entre medias, ayudantes dibujados como zorro y oso necesitan su herramienta: los bomberos apagan el fuego con la manguera, la doctora escucha con el estetoscopio, la peluquera corta con las tijeras. Casi 200 parejas en más de veinte temas, del baño y la guardería a la granja. El juego se vuelve solo más fácil o más difícil.",
    },
    "/schatten/": {
      title: "Reconocer – sombras y animales para niños",
      description: "¿Qué sombra es la de la jirafa? ¿Quién se asoma por el arbusto? Primeros juegos de reconocer para niños pequeños, gratis y sin anuncios.",
      text: "Una imagen busca su sombra entre dos y seis –animales, vehículos, comida y cosas–; después un animal se asoma por un arbusto o un estanque, y el niño toca quién es. Tocar o arrastrar; una sombra equivocada muestra un momento de quién es. Primero pocas imágenes muy distintas, luego más y más parecidas a medida que gana seguridad, más tarde sombras giradas y reflejadas y algunas bajo solapas de papel para recordar.",
    },
    "/socken/": {
      title: "Pares de calcetines – juego para niños pequeños",
      description:
        "La lavadora ha terminado: encontrar pares de calcetines y colgarlos en el tendedero. Un primer juego de parejas para niños pequeños, sin anuncios.",
      text: "Los calcetines salen dando tumbos de la lavadora. Los calcetines iguales suenan igual; cada par salta al tendedero. Primero pocos pares de colores vivos, luego más, con estampados y bajo cestos de ropa como en el memory, a medida que gana seguridad. Después llegan manoplas, botas de agua y zapatillas de oso, siempre una izquierda y una derecha.",
    },
    "/buchstaben/": {
      title: "Teclear libre – aprender letras con el teclado",
      description:
        "Cada tecla muestra su letra con imagen y voz: la O de oso. Los números llegan con cosas para contar. Un juego de teclado gratis y sin anuncios.",
      text: "Teclear libre en el teclado o en la pantalla: cada letra llega con imagen y palabra, cada número con cosas para contar. Si se desea, mayúsculas y minúsculas, repasar con el dedo e imágenes de un mismo tema.",
    },
    "/zaehlen/": {
      title: "Aprender a contar: números para niños pequeños",
      description:
        "Cada tecla trae un número con tantas cosas para contar: todas a la vez, contadas en voz alta, paso a paso o contadas por el niño. Sin anuncios.",
      text: "Un juego de números en el teclado o en la pantalla: cada cifra aparece con tantas cosas como indica, y cualquier otra tecla trae un número del 1 al 9. Las cosas llegan todas a la vez, se cuentan en voz alta, llegan paso a paso, o el niño toca cada una y cuenta.",
    },
    "/mitmachen/": {
      title: "Todos juntos: saltar, aplaudir y zapatear números",
      description: "Con cada número, un zorrito o un osito salta, aplaude o zapatea esas mismas veces y cuenta en voz alta, y el niño lo imita. Sin anuncios.",
      text: "Un juego de números para moverse: vale cada cifra del teclado o de la pantalla, y cualquier otra tecla trae un número del 1 al 9. Un zorrito o un osito invita –«¡Salta conmigo!»– y salta, aplaude o zapatea tantas veces como dice el número, con su adulto al lado. Cada vez se cuenta en voz alta, con una pequeña pausa para que el niño pueda unirse. Así el número se convierte en una cantidad en el propio cuerpo.",
    },
    "/woerter/": {
      title: "Escribir palabras: primeras palabras para niños",
      description:
        "Escribir primeras palabras letra a letra: oso, pelota, colores y verbos. O «¿Dónde está la B?»: encontrar la tecla de una letra. Sin anuncios.",
      text: "Una imagen y su palabra: el niño la escribe letra a letra en el teclado o en la pantalla. Palabras con imagen, colores, verbos de acción o todo mezclado, en tres longitudes. O solo la primera letra: «¿Dónde está la B?», y a buscar su tecla.",
    },
    "/zaehne/": {
      title: "Cepillarse los dientes: canción y temporizador",
      description:
        "Lavarse los dientes con canción: paso a paso desaparecen los monstruos del azúcar, y una estrella por la mañana y por la noche. Temporizador para peques.",
      text: "Un compañero de cepillado que dura lo que su canción, unos dos minutos: primero un cuento corto muestra de dónde vienen los monstruos del azúcar, luego siete pasos (superficies de masticar, por fuera, por dentro) guían el cepillado y los monstruos desaparecen. Por la mañana sale el sol, por la noche la luna, y una tabla semanal reúne las estrellas. La canción del cepillado se canta en el idioma de la app: español, inglés, alemán, ruso, chino, hindi o árabe.",
    },
    "/toepfchen/": {
      title: "Control de esfínteres jugando: el juego del orinal",
      description:
        "Tapsi tiene pipí o caca: llamar a mamá y papá, bajarse el pantalón, sentarse, tirar de la cadena, lavarse las manos. Un toque por paso y una estrella si sale.",
      text: "Un juego del orinal para niños pequeños con imágenes en movimiento: el zorro Tapsi come y bebe, nota que tiene ganas, llama a mamá y papá y va al orinal paso a paso. Mientras está sentado, mamá y papá hacen tonterías, riegan las flores o aprietan la pasta de dientes, hasta que una marca verde dice «listo»: la persona adulta toca si salió pipí, caca o las dos cosas. Al final, una tabla semanal celebra los logros de verdad con una estrella.",
    },
    "/belohnungstafel/": {
      title: "Tabla de recompensas para niños – crear e imprimir",
      description:
        "Cree una tabla de recompensas para niños pequeños: día, semana, mes o camino de estrellas, con imágenes y premio. En la tablet o impresa, también para colorear.",
      text: "Una tabla de recompensas para niños pequeños, a su medida: tabla semanal con tareas y días, tabla mensual como calendario, tabla diaria para la mañana o la noche, o reunir estrellas, cada tarea en su propio camino hacia su premio. Tareas en imágenes (lavarse los dientes, orinal, vestirse, dormir en su propia cama…), el nombre del niño y un premio, mejor aún tiempo juntos. Un asistente guía paso a paso hasta la propia tabla y muestra cada opción con una imagen. En la tablet, una persona adulta mantiene pulsada una casilla y el niño toca para poner la estrella; para imprimir en A4 apaisado o vertical, con casillas para colorear y estrellas para recortar. Se imprime en color o en blanco y negro, y el blanco y negro es más que una copia gris: cada imagen de la tabla está dibujada de nuevo como dibujo para colorear, con líneas claras y gruesas. Eso ahorra tinta, y el niño colorea su propia tabla. Sin castigos, no se quita nada. En la misma página: una rutina diaria con pictogramas y la cuenta atrás «¿Cuántas noches faltan?».",
    },
    "/timer/": {
      title: "Temporizador visual para niños – disco y reloj de arena",
      description:
        "Un temporizador sin números para niños pequeños: el disco rojo se encoge, cae la arena, arden velas, un tren llega a la estación. De 10 segundos a 3 horas.",
      text: "Un temporizador visual para niños que aún no saben leer el reloj, uno de nuestros ayudantes del día a día. Una persona adulta elige 10 o 30 segundos o de 1 a 10 minutos, cualquier otro tiempo de hasta tres horas o una hora del reloj hasta la que dura, y el niño ve pasar el tiempo: el disco rojo que los niños conocen de la guardería se hace más pequeño, la arena cae por un gran reloj de arena, las velas se consumen, un manzano crece, florece y da manzanas, una pizza se come porción a porción, un despertador infantil cuenta hacia atrás, un tren rueda hacia la estación, una oruga se come su hoja, una flor crece y florece, o sale el sol. Cuando el niño toca la imagen, se ilumina un momento lo que queda, y en pequeño, en la esquina, aparece el tiempo restante para nosotros, los mayores. Para turnarse entre hermanos, el reloj de arena está entre dos cojines: una lámpara muestra a quién le toca, el juguete se queda ahí hasta que pasa la arena, luego salta al otro lado y el reloj de arena se da la vuelta solo. Al final suenan una ovación y una melodía alegre. Para «cinco minutos más de juego», esperar la comida o recoger; mientras tanto la pantalla sigue encendida, y el temporizador funciona aunque haya terminado el tiempo de juego.",
    },
    "/tagesplan/": {
      title: "Rutina diaria con pictogramas – día y semana",
      description:
        "Rutina diaria, de mañana y de noche o plan semanal en imágenes para niños pequeños: el niño marca lo hecho. Tarjetas para imprimir y colorear.",
      text: "Una rutina diaria con imágenes (un horario visual) para niños pequeños: los pasos del día como grandes tarjetas con pictogramas; lo que toca ahora se ilumina, el niño lo marca cuando está hecho y se ilumina la siguiente tarjeta. Plantillas para la rutina de la mañana, la rutina de la noche, un día con guardería y un tablero de «primero-después»; un plan semanal muestra qué pasa cada día, con una luna por cada noche que falta. Además, tarjetas con palabras para nosotros, los padres –frases de ánimo por la mañana, contar el día después de la guardería, frases de buenas noches–, y la tarjeta del cepillado empieza enseguida a lavarse los dientes con su canción. Un asistente guía con imágenes hasta el propio plan, y para imprimir hay hojas A4 con todas las imágenes como tarjetas para recortar para un tablero de velcro, en color o en blanco y negro, donde cada tarjeta está dibujada como dibujo para colorear con líneas claras, para que el niño coloree su propio plan. En la misma página: una tabla de recompensas para reunir estrellas y la cuenta atrás «¿Cuántas noches faltan?».",
    },
    "/wie-lange-warten/": {
      title: "Cuenta atrás para niños – ¿cuántas noches faltan?",
      description:
        "Hasta el cumpleaños, las vacaciones o la visita de la abuela: una casilla con el zorrito o el osito durmiendo por cada noche, y cada mañana entra una estrella.",
      text: "Los niños pequeños aún no entienden «dentro de cinco días», pero «cinco noches más» sí, y por eso esta cuenta atrás cuenta en noches. Por cada noche hasta el gran día hay una casilla con una imagen, el zorrito o el osito durmiendo en su cama, y debajo un círculo como en la tabla de recompensas. Al lado espera la imagen del día mismo: cumpleaños, vacaciones, los abuelos, el primer día de guardería. Cada mañana se ilumina la casilla de la noche que acaba de pasar, el niño la toca, el gallo canta y una estrella cae en el círculo. Así las estrellas aumentan y las noches hasta el gran día disminuyen, hasta que su imagen aparece en grande. Nosotros elegimos el día y la imagen, tocamos ＋ para una noche más y la papelera para una menos, y quien quiera imprime las noches, en color o para colorear, y pega cada mañana una pegatina en el círculo. En el mismo estante: la tabla de recompensas y la rutina diaria con pictogramas.",
    },
    "/schnullerfee/": {
      title: "El hada del chupete – despedirse del chupete",
      description:
        "El hada del chupete viene: juntar los chupetes en una cajita o atarlos a un globo, apagar la luz y por la mañana hay un regalo. Para dejar el chupete.",
      text: "Un cuento para dejar el chupete, para jugar la noche anterior: el zorro Tapsi junta sus chupetes y los pone en una cajita en el alféizar de la ventana, o los ata a un globo que sale volando por la ventana. Luego se apaga la luz, mamá da un beso de buenas noches, y por la noche llega el hada del chupete por la ventana, brilla y cambia los chupetes por un regalo. Por la mañana, el niño despierta a Tapsi, y el regalo espera en el alféizar. Los padres eligen qué regalo es y si es la cajita o el globo, para que el cuento encaje con la despedida de verdad.",
    },
    "/abstillen/": {
      title: "Cuento para el destete – adiós, leche de mamá",
      description:
        "Un cuento ilustrado para el destete de niños pequeños: el zorro Tapsi dice adiós a la leche de mamá, se pone triste, se abraza a mamá y se duerme sin mamar.",
      text: "Un cuento ilustrado para leer en voz alta cuando la lactancia llega a su fin: el zorro Tapsi era un bebé y tomaba el pecho de mamá; ahora Tapsi es mayor, come una manzana y bebe de un vaso. Mamá le cuenta que su leche pronto se acabará, y Tapsi le dice adiós con la mano. Por la noche Tapsi quiere mamar de todos modos y se pone triste: mamá está muy cerca, abraza a Tapsi, le lee un libro y le canta una nana hasta que Tapsi se duerme. Por la mañana, mamá y papá están orgullosos. Cada toque pasa una página, y la frase de cada página aparece en pequeño debajo de la imagen para leerla en voz alta. Para un destete suave de niños pequeños, sin presión ni regaños.",
    },
    "/bilder/baustelle/": scene("Obra", "excavadora, grúa y hormigonera"),
    "/bilder/stadt/": scene("Ciudad", "autobús, semáforo y coche de policía"),
    "/bilder/bauernhof/": scene("Granja", "vaca, cerdo y tractor"),
    "/bilder/hof/": scene("Granja del estanque", "pato, gallina y molino de viento"),
    "/bilder/zoo/": scene("Zoo", "león, jirafa, elefante y mono"),
    "/bilder/unterwasser/": scene("Fondo del mar", "ballena, delfín, pulpo y tortuga"),
    "/bilder/badezimmer/": scene("Baño", "bañera, ducha y cepillo de dientes"),
    "/bilder/wald/": scene("Bosque", "zorro, corzo, erizo y búho"),
    "/bilder/feuerwache/": scene("Estación de bomberos", "camión de bomberos, sirena y cascos"),
    "/bilder/weltall/": scene("Espacio", "cohete, astronauta y vehículo lunar"),
    "/bilder/spielplatz/": scene("Parque infantil", "tobogán, columpio y camión de helados"),
    "/bilder/kueche/": scene("Cocina", "tostadora, hervidor y nevera"),
    "/bilder/supermarkt/": scene("Supermercado", "carrito, caja y panadera"),
    "/bilder/flughafen/": scene("Aeropuerto y estación", "avión, tren y cinta de equipaje"),
    "/bilder/winterbaustelle/": scene("Obra en invierno", "quitanieves, excavadora y caseta de obra"),
    "/bilder/kita/": scene("Guardería", "perchero, cochecito de muñecas y tren de cumpleaños"),
    "/bilder/kinderarzt/": scene("Pediatra", "estetoscopio, báscula y tirita"),
    "/bilder/strand/": scene("Playa", "castillo de arena, faro, gaviota y velero"),
    "/bilder/dinotal/": scene("Valle de dinosaurios", "T. rex, braquiosaurio y volcán"),
    "/bilder/gutenacht/": scene("Buenas noches", "luna, estrellas, osito de peluche y caja de música"),
    "/bilder/winter/": scene("Invierno", "muñeco de nieve, trineo y ardilla"),
    "/bilder/herbst/": scene("Otoño", "erizo, castañas, cometa y tractor"),
    "/bilder/ostern/": scene("Pascua", "conejo de Pascua, corderito y cerezo"),
  },
};
