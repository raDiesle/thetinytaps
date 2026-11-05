import { useT } from "@/lib/language";

/**
 * For parents, a few words from us as parents (behind the shelf's carved „mehr …“ on the home page, RoomNotes): why no age is named (each family decides
 * when screens come in), that the real world comes first, then playing on a screen together, a learning game alone
 * later, and plain watching least – and that this book means to be that first step together.
 */
export function ParentsNote() {
  const t = useT();
  return (
    <section className="seo-text parents-note">
      <h2>
        {t({
          de: "Ein paar Worte von uns",
          ru: "Несколько слов от нас",
          en: "A few words from us",
          zh: "我们想说的几句话",
          hi: "हमारी ओर से कुछ शब्द",
          es: "Unas palabras nuestras",
          ar: "كلمات قليلة منّا",
        })}
      </h2>
      <p>
        {t({
          de: "Wir sind selbst Eltern und haben Fun for Both gemacht, weil wir uns immer wieder dieselbe Frage gestellt haben: Wie viel Bildschirm tut einem kleinen Kind eigentlich gut? Eine Altersangabe finden Sie hier deshalb nicht. Wann Ihr Kind die ersten Schritte ins Digitale macht, wissen Sie selbst am besten – jedes Kind ist anders, und jede Familie auch.",
          ru: "Мы сами родители и сделали Fun for Both, потому что снова и снова задавали себе один и тот же вопрос: сколько экрана на самом деле идёт на пользу маленькому ребёнку? Поэтому возраста вы здесь не найдёте. Когда вашему ребёнку пора сделать первые шаги в цифровой мир, вы знаете лучше всех – каждый ребёнок особенный, и каждая семья тоже.",
          en: "We are parents ourselves, and we made Fun for Both because we kept asking ourselves the same question: how much screen time is actually good for a small child? That is why you won’t find an age recommendation here. You know best when your child is ready for those first steps into the digital world – every child is different, and so is every family.",
          zh: "我们自己也是父母。之所以做 Fun for Both，是因为我们一次又一次地问自己同一个问题：屏幕对一个小小孩来说，到底多少才算好？所以在这里您找不到适用年龄。孩子什么时候迈出走进数字世界的第一步，您自己最清楚——每个孩子都不一样，每个家庭也是。",
          hi: "हम ख़ुद माता-पिता हैं, और हमने Fun for Both इसलिए बनाया क्योंकि हम बार-बार ख़ुद से एक ही सवाल पूछते थे: एक छोटे बच्चे के लिए आख़िर कितनी स्क्रीन ठीक है? इसीलिए यहाँ आपको कोई उम्र लिखी नहीं मिलेगी। आपका बच्चा डिजिटल दुनिया में पहला क़दम कब रखे, यह आप ख़ुद सबसे अच्छी तरह जानते हैं – हर बच्चा अलग होता है, और हर परिवार भी।",
          es: "Nosotros mismos somos padres, y creamos Fun for Both porque nos hacíamos una y otra vez la misma pregunta: ¿cuánta pantalla les hace bien de verdad a los más pequeños? Por eso aquí no encontrará ninguna edad recomendada. Usted sabe mejor que nadie cuándo es el momento de que su peque dé sus primeros pasos en el mundo digital: cada niño es distinto, y cada familia también.",
          ar: "نحن أنفسنا آباء وأمهات، وصنعنا Fun for Both لأننا كنا نسأل أنفسنا السؤال نفسه مرة بعد مرة: كم من الشاشة ينفع الطفل الصغير حقًا؟ لذلك لن تجدوا هنا أي عمر محدّد. أنتم أعلم من غيركم متى يخطو طفلكم خطواته الأولى في العالم الرقمي – فكل طفل مختلف، وكل عائلة كذلك.",
        })}
      </p>
      <p>
        {t({
          de: "Ehrlich gesagt ist das Schönste ohnehin nicht digital. In Pfützen springen, Türme bauen und wieder umwerfen, ein Bilderbuch so oft vorlesen, bis alle es auswendig können – die echte Welt bleibt der beste Spielplatz, und kein Bildschirm kommt da heran.",
          ru: "Честно говоря, самое прекрасное всё равно не на экране. Прыгать по лужам, строить башни и снова их ронять, читать вслух одну и ту же книжку с картинками, пока все не выучат её наизусть, – настоящий мир остаётся лучшей игровой площадкой, и никакой экран с ним не сравнится.",
          en: "To be honest, the loveliest things aren’t digital anyway. Jumping in puddles, building towers and knocking them over again, reading a picture book aloud so many times that everyone knows it by heart – the real world is still the best playground, and no screen comes close.",
          zh: "说实话，最美好的东西本来就不在屏幕里。踩水坑，搭高塔再把它推倒，一本图画书读了又读，直到全家都能背下来——真实的世界永远是最好的游乐场，没有哪块屏幕比得上。",
          hi: "सच कहें तो सबसे सुंदर चीज़ें वैसे भी डिजिटल नहीं होतीं। पानी के गड्ढों में कूदना, ऊँची मीनारें बनाना और फिर गिरा देना, एक ही चित्र-पुस्तक इतनी बार पढ़कर सुनाना कि सबको ज़बानी याद हो जाए – असली दुनिया ही सबसे अच्छा खेल का मैदान है, और कोई स्क्रीन उसकी बराबरी नहीं कर सकती।",
          es: "A decir verdad, lo más bonito no es digital. Saltar en los charcos, construir torres y volver a tirarlas, leer un cuento tantas veces que todos se lo saben de memoria: el mundo real sigue siendo el mejor patio de juegos, y ninguna pantalla se le acerca.",
          ar: "وبصراحة، أجمل الأشياء ليست رقمية أصلًا. القفز في برك الماء، وبناء الأبراج ثم إسقاطها من جديد، وقراءة كتاب مصوّر مرات كثيرة حتى يحفظه الجميع عن ظهر قلب – يبقى العالم الحقيقي أجمل ساحة للّعب، ولا تقترب منه أي شاشة.",
        })}
      </p>
      <p>
        {t({
          de: "Kommt der Bildschirm doch dazu, dann am liebsten zusammen: auf dem Schoß, ein kleiner Finger auf dem Bild, viel Staunen und Erzählen dazwischen. Später darf ein Kind auch mal allein ein kleines Lernspiel spielen. Am wenigsten halten wir vom bloßen Zuschauen, ein Video nach dem anderen, ohne selbst etwas zu tun.",
          ru: "А если экран всё же появляется, то лучше всего вместе: на коленях, маленький пальчик на картинке, и между делом – много удивления и разговоров. Позже ребёнок может иногда и сам поиграть в небольшую развивающую игру. Меньше всего нам по душе просто смотреть – одно видео за другим, ничего не делая самому.",
          en: "And when a screen does come into it, then ideally together: on a lap, a little finger on the picture, with lots of wonder and chatting along the way. Later on, a child may sometimes play a small learning game alone. What we like least is plain watching, one video after another, without doing anything yourself.",
          zh: "如果屏幕还是来到了身边，那最好是一起：坐在大人腿上，小手指点着画面，中间有许多惊喜，也有许多聊天。再大一些，孩子偶尔也可以自己玩一个小小的学习游戏。我们最不赞成的是光看不动手，一个视频接着一个视频。",
          hi: "और अगर स्क्रीन आ ही जाए, तो सबसे अच्छा साथ मिलकर: गोद में बैठकर, एक नन्ही उँगली तस्वीर पर, और बीच-बीच में ढेर सारी हैरानी और बातें। बाद में बच्चा कभी-कभी अकेले भी कोई छोटा-सा सीखने वाला खेल खेल सकता है। हमें सबसे कम पसंद है बस देखते रहना – एक के बाद एक वीडियो, ख़ुद कुछ किए बिना।",
          es: "Y si llega la pantalla, mejor juntos: en el regazo, un dedito sobre la imagen y, entre medias, mucho asombro y mucha conversación. Más adelante, su peque también puede jugar de vez en cuando a un pequeño juego para aprender. Lo que menos nos convence es mirar sin más, un vídeo tras otro, sin hacer nada.",
          ar: "وإن جاءت الشاشة رغم ذلك، فالأفضل أن تكون معًا: في الحضن، وإصبع صغير على الصورة، وبين هذا وذاك كثير من الدهشة والحكايات. وفيما بعد يمكن للطفل أن يلعب أحيانًا وحده لعبة تعليمية صغيرة. وأقلّ ما نحبّه هو المشاهدة وحدها، فيديو بعد فيديو، دون أن يفعل المرء شيئًا بنفسه.",
        })}
      </p>
      <p>
        {t({
          de: "Genau für diesen ersten gemeinsamen Schritt ist Fun for Both gedacht: ein Bilderbuch, das Sie zusammen aufschlagen, das auf jedes Antippen antwortet – und das sich genauso gut wieder zuklappen lässt, um draußen weiterzuspielen. Wir wünschen Ihnen und Ihrem Kind viele schöne Momente damit, auf dem Bildschirm und noch viel mehr daneben.",
          ru: "Именно для этого первого совместного шага и задуман Fun for Both: книжка с картинками, которую вы открываете вместе, которая отвечает на каждое касание – и которую так же легко закрыть, чтобы пойти играть на улицу. Желаем вам и вашему ребёнку много радостных минут – на экране и ещё больше рядом с ним.",
          en: "Fun for Both is made for exactly that first step together: a picture book you open side by side, one that answers every tap – and that closes just as easily, so you can carry on playing outside. We wish you and your child many happy moments with it, on the screen and even more beyond it.",
          zh: "Fun for Both 正是为这一起迈出的第一步而做的：一本您和孩子一起翻开的图画书，每一次轻点都有回应——也同样可以轻轻合上，到外面接着玩。祝您和孩子用它度过许多美好时光，在屏幕上，更在屏幕之外。",
          hi: "Fun for Both ठीक इसी पहले साझा क़दम के लिए है: एक चित्र-पुस्तक जिसे आप साथ मिलकर खोलते हैं, जो हर छूने पर जवाब देती है – और जिसे उतनी ही आसानी से बंद करके बाहर खेलने जाया जा सकता है। हम आपको और आपके बच्चे को इसके साथ ढेर सारे प्यारे पलों की शुभकामनाएँ देते हैं – स्क्रीन पर, और उससे भी ज़्यादा उसके बाहर।",
          es: "Fun for Both está pensado justo para ese primer paso juntos: un libro ilustrado que se abre en compañía, que responde a cada toque y que se cierra con la misma facilidad para seguir jugando fuera. Le deseamos a usted y a su peque muchos momentos bonitos con él, en la pantalla y muchos más lejos de ella.",
          ar: "ولهذه الخطوة الأولى المشتركة بالذات صُنع Fun for Both: كتاب مصوّر تفتحونه معًا، يستجيب لكل لمسة – ويمكن إغلاقه بالسهولة نفسها لمواصلة اللعب في الخارج. نتمنى لكم ولطفلكم لحظات جميلة كثيرة معه، على الشاشة، وأكثر منها بكثير بعيدًا عنها.",
        })}
      </p>
    </section>
  );
}
