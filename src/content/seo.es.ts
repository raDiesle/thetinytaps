import type { PageText, SeoTranslation } from "./seo";

// The search engine texts in Spanish, for the pages under /es/ (see seo.ts), by German address. Written in a neutral
// Spanish understood in Spain and Latin America, for what parents search: "juegos para niños pequeños", "gratis",
// "sin anuncios", "sin conexión". Imported only by texts-es.ts and tools/build.ts. No `@/` imports: the build reads it.

const scene = (title: string, things: string, more: string): PageText => ({
  title: `${title}: lámina viva para niños pequeños`,
  description: `${title}, una lámina para tocar: ${things} se mueven y suenan. Para niños pequeños, gratis y sin anuncios.`,
  text: `Una lámina para buscar y encontrar que cobra vida: ${things}. Cada toque despierta algo, con sonido y movimiento. ${more} Además de explorar libremente, la lámina se puede colorear, recorrer buscando cosas, explorar con preguntas o descubrir a oscuras con la linterna, o se dibujan caminos por los que pasan un coche, un tractor o un tren de vapor.`,
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
        "Juegos educativos y ayudas diarias para niños pequeños: láminas, emociones, letras, temporizador, dientes, orinal, premios, destete, lavar el pelo.",
      text: "Fun for Both es una estantería llena de libros ilustrados para jugar, para grandes y pequeños juntos: cada toque y cada tecla hace algo enseguida, nada está mal y no hay nada que leer. En los libros esperan láminas para buscar y encontrar, aventuras en movimiento, reacciones en cadena y pequeñas aventuras, emociones, letras y números, emparejar y reconocer. Y como el día con un niño pequeño tiene sus propios pequeños obstáculos, justo al lado están nuestros ayudantes del día a día: un temporizador que muestra el tiempo con imágenes, lavarse los dientes con canción, el juego del orinal, una tabla de recompensas, una rutina diaria con pictogramas y una cuenta atrás «¿Cuántas noches faltan?», en la tablet o para imprimir, y cuentos por capítulos para el destete, para despedirse del chupete con el hada del chupete, para empezar la guardería y para lavar el pelo. Quien juega un juego o un cuento hasta el final recibe su propio trofeo pequeño, y todos los trofeos esperan sobre pedestales en una pequeña sala de trofeos junto a la estantería.",
    },
    "/spiele/lebendige-welten/": {
      title: "Láminas vivas e historias para niños pequeños",
      description:
        "Láminas vivas para buscar, juegos de movimiento, reacciones en cadena y pequeñas aventuras que responden a cada toque. Para niños pequeños, sin anuncios.",
      text: "Imágenes e historias que responden a cada toque: más de veinte «Imágenes vivas», «Aventuras en movimiento» para moverse junto al zorro Tapsi, la «Reacción en cadena» con veinte máquinas y circuitos de canicas, y «Pequeñas aventuras» en el ascensor, por caminos y en pequeñas películas: con los bomberos, en la panadería, con una carta para la abuela o en nuestro huerto.",
    },
    "/spiele/gefuehle/": {
      title: "Juegos de emociones para niños pequeños",
      description:
        "Situaciones cotidianas con el osito, ¿Cómo estás? y ¿Qué pasó?: el niño muestra su emoción, con qué fuerza la siente, qué le ayuda y por qué.",
      text: "Un libro ilustrado sobre las emociones con tres juegos: en «Situaciones cotidianas» el osito vive día a día lo que los niños conocen –enojo, tristeza, miedo y alegría– y el niño elige qué le ayuda. En «¿Cómo estás?» el niño muestra su propia emoción y con qué fuerza la siente, y en «¿Qué necesito?», lo que le sienta bien ahora. En «¿Qué pasó?» el osito llora, ríe o se asusta, y el niño toca, entre dos imágenes, lo que pasó.",
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
      text: "Historias de movimiento para casa, en la isla del tesoro o de viaje en una nubecita: Tapsi salta, se agacha y se estira, el niño se mueve con él y el mundo responde. Sin leer: Tapsi lo dice todo.",
    },
    "/gefuehle/": {
      title: "Emociones para niños pequeños: situaciones cotidianas",
      description:
        "Enojo, tristeza, miedo, alegría: el osito vive situaciones cotidianas en casa y en la guardería, y el niño elige qué le ayuda. Sin anuncios.",
      text: "Pequeñas historias del oso, contadas como días de la mañana a la noche: siente enojo, tristeza, miedo o alegría, y el niño elige entre dos ideas qué le ayuda. Las escenas también vienen ordenadas por emociones. Bajo las imágenes está el texto completo: quien prefiera contar la historia con sus propias palabras o leerla en voz alta apaga la voz con un toque. Para hablar de emociones con niños pequeños.",
    },
    "/wie-gehts-dir/": {
      title: "¿Cómo estás? Mostrar emociones para niños pequeños",
      description: "Alegría, orgullo, cansancio o enojo: el niño toca la imagen que va con su emoción y muestra con qué fuerza la siente ahora. Sin anuncios.",
      text: "Ocho emociones en dos grupos, las agradables y las desagradables, cada una con el osito en un momento que los niños conocen. El niño toca su emoción, luego tres imágenes muestran la misma emoción un poco, bastante y muchísimo, y el niño elige con qué fuerza la siente ahora. Desde ahí se sigue a «¿Qué necesito?». Un comienzo para hablar de emociones.",
    },
    "/was-ist-passiert/": {
      title: "¿Qué pasó? Entender las emociones para niños pequeños",
      description: "El osito llora, ríe o se asusta, y el niño toca lo que pasó: el globo se va volando, llega la abuela. Sin anuncios.",
      text: "Treinta pequeñas escenas con el osito: está triste, enojado, tiene miedo, está feliz, orgulloso o algo le da asco. Dos imágenes muestran lo que pudo pasar justo antes –se le cae el helado, el mapache le quita la pala, papá le hace cosquillas– y el niño toca la que encaja. Debajo, los adultos leen qué preguntarle y por qué el osito se siente así. Así se ve que las emociones tienen un motivo: un comienzo para hablar con los pequeños sobre el porqué.",
    },
    "/kettenreaktion/": {
      title: "Reacción en cadena y circuito de canicas",
      description:
        "Una canica echa a rodar y pone en marcha una máquina: circuitos de canicas y reacciones en cadena para tocar y asombrarse. Para niños pequeños.",
      text: "Veintiún circuitos y máquinas: las canicas ruedan sobre madera, nieve, toboganes de agua y cintas transportadoras, las fichas de dominó y las cosas de casa caen, una empuja a la siguiente. En el circuito de colores el niño elige rojo, amarillo o azul para cada canica, y abajo cae en el tubo de su color y se cuenta. Un toque pone en marcha la reacción en cadena, y en un punto la máquina espera hasta que el niño la deja seguir con otro toque: para asombrarse y volver a empezar.",
    },
    "/kleine-abenteuer/": {
      title: "Pequeñas aventuras: historias para niños pequeños",
      description:
        "Aventuras cortas con imágenes: subir en ascensor, recorrer caminos y ver pequeñas películas como en la panadería. Cada toque hace avanzar la historia.",
      text: "Aventuras de pocos minutos: subir en ascensor y descubrir algo en cada piso, recorrer un camino –detrás de la pelota, la cometa o el trenecito– y celebrar al final, o vivir una pequeña película: salir con los bomberos, llevar una carta a la abuela, hornear panecillos, un pretzel o un pastel en la panadería, o sembrar en el huerto un girasol, zanahorias o fresas, regarlos y verlos crecer. Por el camino, el niño también decide.",
    },
    "/tiere/": {
      title: "Alimentar a los animales – juego para niños pequeños",
      description:
        "¿Qué va con cada animal? ¿Qué come, qué nos da, dónde vive y en qué se convierte la oruga? Con sonidos de animales, para niños pequeños, sin anuncios.",
      text: "El conejo quiere una zanahoria, el elefante cacahuetes, la vaca nos da leche, el castor busca su madriguera, la oruga se convierte en mariposa y la semilla en girasol: basta tocar la comida, la leche, el huevo o la casa, y el animal se alegra y hace su sonido. Muchos animales de la granja, del bosque, del zoo y del mar. Y detrás de una pequeña cortina algo muge, ladra o ruge: ¿quién fue? El juego se vuelve solo más fácil o más difícil.",
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
    "/gross-klein/": {
      title: "¿Dónde está la b pequeña? – Mayúsculas y minúsculas",
      description: "Una letra grande con ojos busca a su pequeña: de tres minúsculas solo una es la suya, que camina hasta ella y le da la mano.",
      text: "Un juego de letras sobre mayúsculas y minúsculas: una letra grande con ojos busca a su pequeña. Abajo hay tres minúsculas y solo una es la suya. Al tocarla, camina hasta la grande y se dan la mano; una equivocada niega con la cabeza. Primero las tres son muy distintas, después parecidas, como b, d y p.",
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
      text: "Un temporizador visual para niños que aún no saben leer el reloj, uno de nuestros ayudantes del día a día. Una persona adulta elige 10 o 30 segundos o de 1 a 10 minutos, cualquier otro tiempo de hasta tres horas o una hora del reloj hasta la que dura, y el niño ve pasar el tiempo: el disco rojo que los niños conocen de la guardería se hace más pequeño, la arena cae por un gran reloj de arena, las velas se consumen, un manzano crece, florece y da manzanas, una pizza se come porción a porción, un despertador infantil cuenta hacia atrás, un tren rueda hacia la estación, una oruga se come su hoja, una flor crece y florece, o sale el sol. Cuando el niño toca la imagen, se ilumina un momento lo que queda, y en pequeño, en la esquina, aparece el tiempo restante para nosotros, los mayores. Para turnarse entre hermanos, el reloj de arena está entre dos cojines: una lámpara muestra a quién le toca, el juguete se queda ahí hasta que pasa la arena, luego salta al otro lado y el reloj de arena se da la vuelta solo. O dos niños juegan al tenis: la pelota está en la raqueta de quien tiene el turno, su mitad de la pista está iluminada, y al cambiar la pelota vuela despacio por encima de la red. Al final suenan una ovación y una melodía alegre. Para «cinco minutos más de juego», esperar la comida o recoger; mientras tanto la pantalla sigue encendida, y el temporizador funciona aunque haya terminado el tiempo de juego.",
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
      title: "Hada del chupete – un cuento para dejar el chupete",
      description:
        "Un cuento por capítulos para leer en voz alta: Tapsi el zorro reúne sus tres chupetes y de noche el hada del chupete los cambia por un regalo.",
      text: "Un cuento para leer en voz alta, capítulo a capítulo, cuando el chupete tiene que irse. Tapsi el zorro tiene tres chupetes, uno rojo, uno azul y uno amarillo, y con el chupete en la boca mamá solo oye «mmm-mmm». Mamá y papá le hablan del hada del chupete, que lleva los chupetes a los bebés. Primero el chupete se queda en la cama y solo sirve para dormirse. Después Tapsi dice que el hada puede venir, papá pega tres estrellas en la ventana y cada mañana Tapsi quita una. El gran día Tapsi busca todos los chupetes, los mete en una caja, da a cada uno un beso de despedida y los deja en el alféizar con un dibujo. La primera noche cuesta, Tapsi llora, y mamá y papá se quedan cerca, consuelan y cantan. De noche entra el hada volando, se lleva la caja y deja un regalo: un conejito de peluche que ahora ayuda a dormirse. Tapsi puede echar de menos el chupete y estar triste, y mamá y papá quieren a Tapsi, con chupete y sin él. El libro empieza por su índice, bajo cada imagen está la frase para leer y cada toque pasa la página.",
    },
    "/kita/": {
      title: "Empezar la guardería – un cuento para la adaptación",
      description:
        "Un cuento por capítulos para leer en voz alta sobre la adaptación a la guardería y la despedida por la mañana: Tapsi empieza, y mamá siempre vuelve.",
      text: "Un cuento para leer en voz alta, capítulo a capítulo, cuando empieza la guardería o la despedida de la mañana cuesta. Mamá y papá le cuentan al zorrito Tapsi qué es la guardería, papá y Tapsi la miran desde fuera y juntos preparan la mochila con las zapatillas y el conejito de peluche. Los primeros días mamá se queda en la guardería, en una sillita, mientras Tapsi conoce a Mia, la educadora, y juega con Bruno. Luego mamá sale un ratito por primera vez y antes dice que volverá; Tapsi llora, Mia consuela y mamá vuelve enseguida. Mia ayuda en el desayuno y sopla en la rodilla, y cada día mamá se queda fuera un poco más. Un capítulo es el ritual de despedida que se puede leer cada mañana: la chaqueta en el gancho de la estrella, un abrazo fuerte, un beso en la nariz, «Te recojo después de la siesta» y decir adiós con la mano en la ventana; mamá nunca se va a escondidas. Después, el día de Tapsi: la asamblea, una torre de bloques, el arenero, la comida y la siesta, y justo después mamá está en la puerta. El libro empieza con su índice, bajo cada dibujo está la frase para leer en voz alta y cada toque pasa la página. Según el modelo de adaptación de Berlín.",
    },
    "/haare-waschen/": {
      title: "Lavar el pelo sin lágrimas – un cuento por capítulos",
      description:
        "Un cuento por capítulos para leer en voz alta a la hora de lavar el pelo: Tapsi sujeta la toallita, dice «¡Ya!» y lleva una corona de espuma.",
      text: "Un cuento para leer en voz alta, capítulo a capítulo, cuando lavar el pelo trae lágrimas o miedo. El zorrito Tapsi tiene papilla y arena en el pelo, y mamá le cuenta antes lo que va a pasar: primero agua, luego espuma, luego agua otra vez, y después la toalla calentita – no todas las noches, solo hoy. A Tapsi no le gusta el agua en los ojos, y mamá escucha. Primero Tapsi le lava el pelo al conejito de peluche con un vaso vacío, y luego a mamá, con agua de verdad. Tapsi elige el vaso rojo y el champú de manzana, toca el agua para ver si está tibia y se sujeta la toallita sobre los ojos sin ayuda. En la bañera la cabeza va hacia atrás, los ojos miran al sol del techo, mamá hace una corona de espuma para el espejito, y cuando Tapsi dice «¡Ya!», mamá cuenta hasta tres y aclara por detrás. Una noche, aun así, una gota entra en un ojo: mamá para enseguida, le seca la cara y le consuela, y Tapsi decide cómo seguir. Luego la toalla calentita, papá le seca el pelo y le dice lo que hizo sin ayuda. El libro empieza con su índice, debajo de cada imagen está la frase para leer en voz alta y cada toque pasa la página.",
    },
    "/abstillen/": {
      title: "Cuento para el destete – la cadena de leche de Tapsi",
      description:
        "Un cuento por capítulos del zorro Tapsi para un destete suave: primero se va la leche del día, luego la de la tarde, la de la noche y al final la de la mañana.",
      text: "Un cuento largo para leer en voz alta, capítulo a capítulo, cuando la lactancia va a terminar poco a poco. El zorro Tapsi tomaba el pecho de mamá de bebé y ahora es mayor. Mamá explica por qué la leche puede irse: su pecho ha hecho leche durante mucho tiempo y quiere descansar. Sobre la cama de Tapsi cuelga una cadena con una gota de leche por cada toma, y en cada capítulo se va una: primero la del día, cuando ayudan el juego, la comida y el vaso; luego la de la tarde, cuando Tapsi se duerme con un libro y una canción; luego la de la noche, cuando papá consuela; y al final la de la mañana, con una despedida. Tapsi puede enfadarse y estar triste, y mamá y papá están cerca. Bajo cada imagen está la frase para leer. El libro se abre por su índice: desde ahí se abre directamente cada uno de los once capítulos, y a la noche siguiente se sigue donde se dejó. Cada toque pasa una página. Para un destete suave de niños pequeños, sin presión ni regaños.",
    },
    "/bilder/baustelle/": scene(
      "Obra",
      "excavadora, grúa y hormigonera",
      "La excavadora cava, la grúa sube los ladrillos, la apisonadora alisa la calle y en la caseta de obra hay cacao. Entre las máquinas asoman un erizo, un topo y un caracol, y el camión volquete puede irse a la lámina de la ciudad.",
    ),
    "/bilder/stadt/": scene(
      "Ciudad",
      "autobús, semáforo y coche de policía",
      "El semáforo pasa de rojo a verde, el autobús, el coche de policía y el camión de la basura recorren las calles, y entre la panadería, la iglesia y la fuente pasean la abuela, los patos y las palomas. El camión de bomberos puede irse al parque de bomberos y el autobús al zoo.",
    ),
    "/bilder/bauernhof/": scene(
      "Granja",
      "vaca, cerdo y tractor",
      "La vaca, el cerdo, el caballo, la oveja y la cabra hacen sus sonidos, el gallo canta y el tractor y la cosechadora están en el campo. Alrededor del granjero corren una oca, una gallina, pollitos y un cerdito, y el tractor puede irse a la lámina del bosque.",
    ),
    "/bilder/hof/": scene(
      "Granja del estanque",
      "pato, gallina y molino de viento",
      "Junto al estanque croa la rana y nada el pato, en el gallinero canta el gallo y el molino gira. Un corderito, cerditos, pollitos y las abejas de la colmena esperan a que los encuentren, y junto al espantapájaros hay una calabaza.",
    ),
    "/bilder/zoo/": scene(
      "Zoo",
      "león, jirafa, elefante y mono",
      "El león con su cachorro, el elefante con su cría, la jirafa, la cebra y los pingüinos con su polluelo esperan a que los toquen. Además, un panda, un koala, un canguro, un rinoceronte, un hipopótamo, un flamenco, una foca y un trenecito, y a veces viene de visita el autobús de la ciudad.",
    ),
    "/bilder/unterwasser/": scene(
      "Fondo del mar",
      "ballena, delfín, pulpo y tortuga",
      "Bajo el mar nadan una ballena, un delfín, un tiburón, una raya, un pulpo, un caballito de mar y un pez payaso, y por ahí andan una sirena, un buzo y un submarino. En el fondo hay un cofre del tesoro, un mensaje en una botella y un ancla, y arriba brilla el faro.",
    ),
    "/bilder/badezimmer/": scene(
      "Baño",
      "bañera, ducha y cepillo de dientes",
      "En la bañera crece una montaña de espuma, el patito de goma nada, el váter tira de la cadena y el cepillo y la pasta de dientes están listos. Además, una lavadora, un secador, un orinal, unas zapatillas y juguetes de baño como un cocodrilo, una ballena y una rana: una lámina que va bien con el baño de la noche.",
    ),
    "/bilder/wald/": scene(
      "Bosque",
      "zorro, corzo, erizo y búho",
      "En el claro junto al arroyo viven un zorro, una corza con su cervatillo, un ciervo, un tejón, un castor y un jabalí con sus rayones; el pájaro carpintero golpea y el búho ulula. Un puente lleva al poste indicador, en el bosque crecen setas y helechos, y a veces pasa el tractor de la granja.",
    ),
    "/bilder/feuerwache/": scene(
      "Estación de bomberos",
      "camión de bomberos, sirena y cascos",
      "Suena la sirena y el camión de bomberos sale, con la bombera, el bombero y el perro bombero. Alrededor del parque hay una barra para bajar, una torre de mangueras, una boca de incendios, una ambulancia y un muñeco de prácticas por descubrir, y el camión de bomberos de la ciudad puede venir de visita.",
    ),
    "/bilder/weltall/": scene(
      "Espacio",
      "cohete, astronauta y vehículo lunar",
      "En la Luna esperan un vehículo lunar, una excavadora lunar, un módulo de aterrizaje y un perro robot, y por encima pasan la Tierra, Marte y Saturno, una estrella fugaz y un cometa. Un astronauta, la estación espacial y un pequeño extraterrestre con su bebé esperan a que los descubran, y en el invernadero crece una flor espacial.",
    ),
    "/bilder/spielplatz/": scene(
      "Parque infantil",
      "tobogán, columpio y camión de helados",
      "El columpio, el tobogán, el balancín y la torre de escalada se ponen en marcha; en el arenero hay un castillo de arena, un cubo, moldes y una excavadora de juguete, y ha llegado el camión de los helados. El abuelo, mamá con el cochecito, una cometa y un globo también están: una lámina como el parque de la esquina.",
    ),
    "/bilder/kueche/": scene(
      "Cocina",
      "tostadora, hervidor y nevera",
      "La olla burbujea, la tostadora salta, el hervidor hierve y en el horno sube el bizcocho. Mamá, papá y el bebé están en la cocina, y también el gato y el perro, y el temporizador, el rodillo, la báscula y la batidora esperan a que los prueben.",
    ),
    "/bilder/supermarkt/": scene(
      "Supermercado",
      "carrito, caja y panadera",
      "La caja pita, el carrito rueda y la fruta se pesa en la báscula. En el mostrador del pan está la panadera, en la nevera hay leche y queso, y la máquina de chicles, la máquina de botellas y la torre de latas esperan a que las toquen: casi como ir a la compra juntos.",
    ),
    "/bilder/flughafen/": scene(
      "Aeropuerto y estación",
      "avión, tren y cinta de equipaje",
      "En la pista, el señalero guía al avión, las maletas viajan por la cinta y el camión cisterna, el coche guía, el autobús y el taxi van y vienen. En la estación de al lado está el tren con su vagón restaurante, el reloj de la estación hace tictac y el revisor, los viajeros y la piloto esperan su viaje.",
    ),
    "/bilder/winterbaustelle/": scene(
      "Obra en invierno",
      "quitanieves, excavadora y caseta de obra",
      "La obra en la nieve: la excavadora, la grúa, el volquete y la carretilla elevadora siguen trabajando mientras unos niños hacen un muñeco de nieve y van en trineo. Junto al bidón de fuego hace calor, en el comedero hay un herrerillo y un petirrojo, y también hay un iglú y huellas en la nieve por descubrir.",
    ),
    "/bilder/kita/": scene(
      "Guardería",
      "perchero, cochecito de muñecas y tren de cumpleaños",
      "Un día en la guardería: las chaquetas en los ganchos, jugar en el rincón de construcciones, leer un libro de imágenes, comer fideos y pudin y después la siesta. El tren de cumpleaños, el hámster, el tambor, el xilófono y la caja de música esperan a que los toquen: ideal para contarlo antes del primer día de guardería.",
    ),
    "/bilder/kinderarzt/": scene(
      "Pediatra",
      "estetoscopio, báscula y tirita",
      "En el pediatra se mide y se pesa, se escucha con el estetoscopio y se mira el oído con la linterna, y al final hay una pegatina. En la sala de espera están papá, un cochecito, un circuito de canicas, un caballito balancín y un acuario: así la próxima visita de verdad resulta un poco más familiar.",
    ),
    "/bilder/strand/": scene(
      "Playa",
      "castillo de arena, faro, gaviota y velero",
      "Las olas llegan, la gaviota llama y el castillo de arena crece con el cubo y la pala. En el mar navegan una barca y un barco y salta un delfín, en la playa hay un cangrejo, una estrella de mar y una almeja, y también patatas fritas, crema solar, una tienda de playa y la torre del socorrista.",
    ),
    "/bilder/dinotal/": scene(
      "Valle de dinosaurios",
      "T. rex, braquiosaurio y volcán",
      "El tiranosaurio tiene que estornudar, el braquiosaurio estira su largo cuello y en el nido hay huevos de dinosaurio. Además, una cría de triceratops, un anquilosaurio, una cría de pterosaurio, un plesiosaurio en el agua, una cueva, un trozo de ámbar y helechos gigantes: la prehistoria para tocar.",
    ),
    "/bilder/gutenacht/": scene(
      "Buenas noches",
      "luna, estrellas, osito de peluche y caja de música",
      "La lámina para la noche: todo lo que se toca se duerme –el osito, el caballito balancín, el pez de colores, el robot y los juguetes– y cuando todos duermen, la habitación se queda a oscuras. La luna, las estrellas, las luciérnagas, la caja de música y el cuento de buenas noches lo hacen todo tranquilo y acogedor.",
    ),
    "/bilder/winter/": scene(
      "Invierno",
      "muñeco de nieve, trineo y ardilla",
      "En la nieve, unos niños hacen un muñeco de nieve y un ángel de nieve, un patinador da vueltas sobre el hielo y pasa el trineo tirado por un caballo. Junto a la cabaña están el abuelo, mamá con chocolate caliente, un corzo, un conejo y una ardilla, y en la casita de pájaros hay un herrerillo y un petirrojo.",
    ),
    "/bilder/herbst/": scene(
      "Otoño",
      "erizo, castañas, cometa y tractor",
      "El viento arremolina las hojas de colores, la cometa sube y los gansos salvajes cruzan la lámina. La abuela, el abuelo, un niño y el granjero están fuera, y entre castañas, setas, un charco y una cesta de manzanas viven un erizo, una ardilla, un mirlo y una lombriz; incluso hay un muñequito de castañas.",
    ),
    "/bilder/ostern/": scene(
      "Pascua",
      "conejo de Pascua, corderito y cerezo",
      "El conejo de Pascua ha escondido huevos de colores en el jardín: uno rojo, uno amarillo, uno verde y uno azul esperan a que los encuentren. En la mesa de pintar se pintan huevos, hay un corderito, un pollito y una gallina, y entre tulipanes, narcisos y dientes de león zumba el abejorro.",
    ),
  },
};
