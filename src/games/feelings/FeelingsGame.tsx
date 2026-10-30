import { GameShell, type GameMode } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useAppLanguage, useT } from "@/lib/language";
import { FeelingsPlay } from "./FeelingsPlay";
import { storyIn } from "./localized";
import { MOOD_ID } from "./mood";
import { DEFAULT_FEELINGS_SETTINGS, FEELINGS_SETTINGS_KEY } from "./settings";
import { STORIES } from "./stories";
import "./feelings.css";

/** The start screen: one card per story – the bear's feelings at home and the kindergarten stories side by side; „Weiter“ goes on with the next. */
export function FeelingsGame() {
  const [settings, update] = useGameSettings(FEELINGS_SETTINGS_KEY, DEFAULT_FEELINGS_SETTINGS);
  const t = useT();
  const { id: language } = useAppLanguage();

  const modes: GameMode[] = [
    // Asks for the child's weather first, then the bear's story with that feeling.
    {
      id: MOOD_ID,
      emoji: "🌦️",
      title: t({ de: "Wie geht's dir?", ru: "Как дела?", en: "How are you?", zh: "心情怎么样？", hi: "कैसा लग रहा है?", es: "¿Cómo estás?", ar: "كيف حالك؟" }),
    },
    ...STORIES.map((story) => {
      const { id, emoji, title } = storyIn(story, language);
      return { id, emoji, title };
    }),
  ];

  return (
    <GameShell
      title={t({ de: "Gefühle", ru: "Чувства", en: "Feelings", zh: "情绪", hi: "भावनाएँ", es: "Emociones", ar: "المشاعر" })}
      emoji="🐻"
      modes={modes}
      mode={settings.story}
      onMode={(story) => update({ story })}
      info={
        <>
          <p>
            {t({
              de: "Zu Hause ist der kleine Bär traurig, wütend, müde oder hat Angst. In drei Runden zeigt das große Bild, wie es ihm geht, daneben zwei Karten: eine nicht so gute Idee und eine, die ihm hilft – umarmen, Hand halten, stampfen, Licht an … Nach drei guten Ideen ist er wieder froh. Und an seinem Geburtstag freut er sich, und das Kind feiert mit: tanzen, Luftschlangen, umarmen.",
              ru: "Дома Мишке грустно, он злится, хочет спать или боится. В трёх раундах большая картинка показывает, как он себя чувствует, а рядом две карточки: не очень хорошая идея и та, что ему помогает, – обнять, держать за лапку, потопать, включить свет … После трёх хороших идей он снова весёлый. А в свой день рождения он радуется, и ребёнок празднует вместе с ним: танцы, серпантин, обнимашки.",
              en: "At home, Little Bear is sad, angry, tired or scared. In three rounds the big picture shows how he feels, and next to it are two cards: an idea that isn't so good and one that helps him – a hug, holding his paw, stomping, turning on the light … After three good ideas he is happy again. And on his birthday he is happy already, and the child celebrates with him: dancing, streamers, a hug.",
              zh: "在家里，小熊难过、生气、困了或者害怕。一共三轮，大图显示它的心情，旁边有两张卡片：一个不太好的主意，和一个能帮它的主意——拥抱、牵爪子、跺跺脚、开灯……三个好主意之后，它又开心了。过生日那天它本来就很开心，孩子和它一起庆祝：跳舞、撒彩带、拥抱。",
              hi: "घर पर भालू उदास है, गुस्से में है, थका हुआ है या डरा हुआ है। तीन राउंड में बड़ी तस्वीर दिखाती है कि उसे कैसा लग रहा है, और पास में दो कार्ड होते हैं: एक कम अच्छा विचार और एक जो उसकी मदद करता है – गले लगाना, पंजा पकड़ना, पैर पटकना, बत्ती जलाना … तीन अच्छे विचारों के बाद वह फिर से खुश हो जाता है। और अपने जन्मदिन पर वह पहले से खुश है, और बच्चा उसके साथ जश्न मनाता है: नाचना, रंगीन फीते, गले लगाना।",
              es: "En casa, Osito está triste, enojado, cansado o tiene miedo. En tres rondas, la imagen grande muestra cómo se siente y, al lado, hay dos tarjetas: una idea no tan buena y otra que le ayuda: abrazarlo, darle la pata, patalear, encender la luz… Después de tres buenas ideas vuelve a estar contento. Y en su cumpleaños ya está contento, y su peque lo celebra con él: bailar, serpentinas, un abrazo.",
              ar: "في البيت يكون الدبدوب حزينا أو غاضبا أو متعبا أو خائفا. في ثلاث جولات تعرض الصورة الكبيرة كيف يشعر، وبجانبها بطاقتان: فكرة ليست جيدة جدا، وفكرة تساعده – العناق، إمساك يده، الدق بالقدمين، إشعال الضوء … بعد ثلاث أفكار جيدة يعود سعيدا. وفي عيد ميلاده يكون سعيدا من البداية، ويحتفل الطفل معه: الرقص، الأشرطة الملونة، العناق.",
            })}
          </p>
          <p>
            {t({
              de: "„Wie geht's dir?“ zeigt zuerst vier Wetterbilder: Sonne, Wolke, Regen, Gewitter. Das Kind tippt, was zu ihm passt – so erfahren Erwachsene nebenbei, wie es ihm geht. Der Bär sagt „Das kenne ich auch!“, und dann kommt seine Geschichte mit diesem Gefühl.",
              ru: "«Как дела?» сначала показывает четыре картинки с погодой: солнце, облако, дождь, гроза. Ребёнок нажимает ту, что ему подходит, – так взрослые заодно узнают, как он себя чувствует. Мишка говорит «Мне тоже так бывает!», и дальше идёт его история с этим чувством.",
              en: "“How are you?” first shows four weather pictures: sun, cloud, rain, storm. The child taps the one that fits – so grown-ups find out along the way how the child is feeling. Little Bear says “I know that feeling too!”, and then comes his story with that feeling.",
              zh: "“心情怎么样？”先显示四张天气图：太阳、云、雨、打雷。孩子点一下适合自己的那张——大人顺便就知道了孩子的心情。小熊说“我也有过这种感觉！”，然后是它带着这种心情的故事。",
              hi: "“कैसा लग रहा है?” पहले मौसम की चार तस्वीरें दिखाता है: धूप, बादल, बारिश, तूफ़ान। बच्चा वह तस्वीर छूता है जो उसके मन से मेल खाती है – इस तरह बड़ों को साथ-साथ पता चल जाता है कि बच्चे का मन कैसा है। भालू कहता है “मुझे भी ऐसा लगता है!”, और फिर इसी भावना वाली उसकी कहानी आती है।",
              es: "«¿Cómo estás?» muestra primero cuatro imágenes del tiempo: sol, nube, lluvia, tormenta. Su peque toca la que le va, y así los adultos saben de paso cómo se siente. Osito dice «¡A mí también me pasa!» y luego viene su historia con ese sentimiento.",
              ar: "«كيف حالك؟» يعرض أولا أربع صور للطقس: شمس، غيمة، مطر، عاصفة. يلمس الطفل الصورة التي تناسبه – وهكذا يعرف الكبار بالمناسبة كيف يشعر. يقول الدبدوب «أنا أيضا أعرف هذا الشعور!»، ثم تأتي قصته مع هذا الشعور.",
            })}
          </p>
          <p>
            {t({
              de: "Im Kindergarten: Jemand schubst, tritt oder nimmt etwas weg, die Rutsche ist voll, ein anderes Kind hat das tolle Spielzeug – oder der kleine Bär ist selbst wütend. Dazu Abschied an der Tür, jemand Neues in der Gruppe, hingefallen, und jemand hört nicht auf, obwohl der Bär nicht mehr will. Bei jedem Schritt tippt das Kind, was der Bär tun kann: laut „Stopp! Nein!“ sagen, weggehen, Hilfe holen, fragen, warten, tauschen.",
              ru: "В детском саду: кто-то толкается, пинается или отбирает игрушку, на горке очередь, у другого малыша классная игрушка – или Мишка сам злится. А ещё прощание у двери, новенький в группе, упал, и кто-то не перестаёт, хотя Мишка уже не хочет. На каждом шаге ребёнок выбирает, что может сделать Мишка: громко сказать «Стоп! Нет!», отойти, позвать взрослого, спросить, подождать, поменяться.",
              en: "At kindergarten: someone pushes, kicks or takes something away, the slide is full, another child has the great toy – or Little Bear is angry himself. Also saying goodbye at the door, someone new in the group, falling down, and someone who won't stop although Little Bear doesn't want to anymore. At each step the child taps what Little Bear can do: say “Stop! No!” loudly, walk away, get help, ask, wait, swap.",
              zh: "在幼儿园：有人推人、踢人或者抢东西，滑梯前排满了人，别的小朋友有很棒的玩具——或者小熊自己生气了。还有在门口告别、班里来了新朋友、摔倒了，以及有人不停手，虽然小熊已经不想玩了。每一步，孩子点选小熊可以怎么做：大声说“停！不要！”、走开、找人帮忙、问一问、等一等、交换。",
              hi: "प्ले स्कूल में: कोई धक्का देता है, लात मारता है या कुछ छीन लेता है, फिसलपट्टी पर भीड़ है, किसी और बच्चे के पास बढ़िया खिलौना है – या भालू खुद गुस्से में है। साथ ही दरवाज़े पर विदा, समूह में कोई नया, गिर जाना, और कोई रुकता नहीं, जबकि भालू अब और नहीं चाहता। हर कदम पर बच्चा छूकर चुनता है कि भालू क्या कर सकता है: ज़ोर से “रुको! नहीं!” कहना, दूर जाना, मदद बुलाना, पूछना, इंतज़ार करना, अदला-बदली करना।",
              es: "En la guardería: alguien empuja, da patadas o quita algo, el tobogán está lleno, otro peque tiene el juguete genial, o Osito mismo está enojado. Además, la despedida en la puerta, alguien nuevo en el grupo, una caída, y alguien que no para aunque Osito ya no quiere. En cada paso, su peque toca lo que Osito puede hacer: decir fuerte «¡Alto! ¡No!», alejarse, pedir ayuda, preguntar, esperar, cambiar.",
              ar: "في الروضة: أحد يدفع أو يركل أو يأخذ شيئا، الزحليقة مزدحمة، طفل آخر معه لعبة رائعة – أو الدبدوب نفسه غاضب. وأيضا الوداع عند الباب، شخص جديد في المجموعة، السقوط، وشخص لا يتوقف مع أن الدبدوب لم يعد يريد. في كل خطوة يلمس الطفل ما يستطيع الدبدوب أن يفعله: أن يقول بصوت عال «توقف! لا!»، أن يبتعد، أن يطلب المساعدة، أن يسأل، أن ينتظر، أن يتبادل.",
            })}
          </p>
          <p>
            {t({
              de: "Vor jeder Wahl zeigt das große Bild wieder, was passiert ist, daneben genau zwei Karten: zuerst (oben oder links) eine nicht so gute Idee (z. B. zurückschubsen, Licht aus), dann die gute. Tippt das Kind auf die nicht so gute, erscheint sie groß mit rotem Kreuz und es wird erklärt, warum. Die gute Idee bekommt einen grünen Haken.",
              ru: "Перед каждым выбором большая картинка снова показывает, что случилось, а рядом ровно две карточки: сначала (сверху или слева) не очень хорошая идея (например, толкнуть в ответ, выключить свет), потом хорошая. Если ребёнок нажимает не очень хорошую, она становится большой с красным крестиком, и объясняется, почему. Хорошая идея получает зелёную галочку.",
              en: "Before each choice the big picture shows again what happened, and next to it are exactly two cards: first (on top or on the left) an idea that isn't so good (e.g. pushing back, light off), then the good one. If the child taps the not-so-good one, it appears big with a red cross and the game explains why. The good idea gets a green check mark.",
              zh: "每次选择前，大图会再次显示发生了什么，旁边正好有两张卡片：先是（上面或左边）一个不太好的主意（比如推回去、关灯），然后是好主意。孩子点了不太好的那张，它会变大并打上红叉，同时说明原因。好主意会得到一个绿色的勾。",
              hi: "हर चुनाव से पहले बड़ी तस्वीर फिर से दिखाती है कि क्या हुआ, और पास में ठीक दो कार्ड: पहले (ऊपर या बाईं ओर) एक कम अच्छा विचार (जैसे वापस धक्का देना, बत्ती बुझाना), फिर अच्छा वाला। अगर बच्चा कम अच्छे वाले को छूता है, तो वह लाल क्रॉस के साथ बड़ा दिखता है और बताया जाता है कि क्यों। अच्छे विचार पर हरा टिक लगता है।",
              es: "Antes de cada elección, la imagen grande vuelve a mostrar lo que ha pasado y, al lado, hay exactamente dos tarjetas: primero (arriba o a la izquierda) una idea no tan buena (p. ej., devolver el empujón, apagar la luz) y luego la buena. Si su peque toca la no tan buena, aparece grande con una cruz roja y se explica por qué. La buena idea recibe una marca verde.",
              ar: "قبل كل اختيار تعرض الصورة الكبيرة مرة أخرى ما حدث، وبجانبها بطاقتان بالضبط: أولا (في الأعلى أو على اليسار) فكرة ليست جيدة جدا (مثل الدفع بالمقابل أو إطفاء الضوء)، ثم الفكرة الجيدة. إذا لمس الطفل الفكرة غير الجيدة، تظهر كبيرة مع علامة خطأ حمراء ويأتي شرح السبب. وتحصل الفكرة الجيدة على علامة صح خضراء.",
            })}
          </p>
          <p>
            {t({
              de: "Unter jedem Bild steht klein, was es zeigt – zum Mitlesen und Erzählen für Erwachsene. Kinder wählen nur nach dem Bild.",
              ru: "Под каждой картинкой мелко написано, что на ней, – чтобы взрослым было удобно читать и рассказывать. Дети выбирают только по картинке.",
              en: "Under each picture, small letters say what it shows – for grown-ups to read along and tell the story. Children choose by the picture alone.",
              zh: "每张图下面有一行小字，说明图上是什么——方便大人一起读、一起讲。孩子只看图来选。",
              hi: "हर तस्वीर के नीचे छोटे अक्षरों में लिखा है कि उसमें क्या है – ताकि बड़े साथ पढ़ सकें और कहानी सुना सकें। बच्चे सिर्फ़ तस्वीर देखकर चुनते हैं।",
              es: "Debajo de cada imagen pone en letra pequeña lo que muestra, para que los adultos puedan leerlo y contarlo. Los peques eligen solo por la imagen.",
              ar: "تحت كل صورة مكتوب بخط صغير ما تعرضه – ليقرأه الكبار ويحكوا القصة. الأطفال يختارون من الصورة فقط.",
            })}
          </p>
          <p>
            {t({
              de: "Erwachsene erzählen die Geschichte anhand der Bilder.",
              en: "Grown-ups tell the story using the pictures.",
              zh: "大人看着图片讲故事。",
              hi: "बड़े तस्वीरों को देखकर कहानी सुनाते हैं।",
              es: "Los adultos cuentan la historia con ayuda de las imágenes.",
              ar: "يروي الكبار القصة بالاستعانة بالصور.",
              ru: "Взрослые рассказывают историю по картинкам.",
            })}
          </p>
        </>
      }
    >
      <FeelingsPlay settings={settings} />
    </GameShell>
  );
}
