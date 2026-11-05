import type { Localized } from "@/lib/language";
import type { CatalogTask } from "./catalog";

// Rituals for the Tagesplan (H-58): fixed moments of the day a parent shares with the child – brave sentences in the
// morning, telling about the day after Kita or school, good-night sentences in bed. Each is a card on the plan like
// any other step; tapped when it is the one to do, it opens its words for the grown-up to say or ask (`RitualCard`) –
// or its game, „Wie geht's dir?“ (C-33) –
// and the plan prints them as cards to keep at the mirror or the bed. Where the words come from: research „rituale“ in
// src/content/research.ts.

/** Who speaks a group of lines: the grown-up asks, the grown-up says, or the child says it after them. */
export interface RitualPart {
  /** For the grown-up, over the lines: „Sie fragen:“. */
  who: Localized;
  /** What is said, each with a small sign a child can point at. */
  lines: { emoji: string; text: Localized }[];
}

/** A card of the plan that is a ritual: its picture and name like any step, and the words that go with it. */
export interface Ritual extends CatalogTask {
  /** When it belongs, for the grown-up: „Am Morgen, vor dem Spiegel“. */
  when: Localized;
  /** What is said, in the order it is said. */
  parts: RitualPart[];
  /** How it goes best, in two or three sentences for the grown-up. */
  how: Localized;
  /**
   * The game the card opens instead of its words, like the teeth card opens Zähne putzen: the child answers there, and
   * the card is ticked when it comes back (`gameOf`). Its words are still printed.
   */
  game?: string;
}

/** „Ich bin gut so, wie ich bin.“ – the child says it after the grown-up in the morning and at night. */
const GOOD_AS_I_AM: Localized = {
  de: "Ich bin gut so, wie ich bin.",
  en: "I am good just the way I am.",
  zh: "我就是我，这样就很好。",
  hi: "मैं जैसे भी हूँ, ठीक हूँ।",
  es: "Estoy bien tal como soy.",
  ar: "أنا بخير كما أنا.",
  ru: "Я – это я, и это хорошо.",
};

/** „Sie fragen:“, over what the grown-up asks. */
const YOU_ASK: Localized = { de: "Sie fragen:", en: "You ask:", zh: "您问：", hi: "आप पूछें:", es: "Usted pregunta:", ar: "اسألوا:", ru: "Вы спрашиваете:" };

/** The rituals, in the order of the day. */
export const RITUALS: Ritual[] = [
  {
    id: "mutmachen",
    emoji: "💪",
    label: { de: "Mutmach-Sätze", en: "Brave words", zh: "鼓励的话", hi: "हिम्मत वाले वाक्य", es: "Frases de ánimo", ar: "عبارات تشجيع", ru: "Слова поддержки" },
    when: {
      de: "Am Morgen, vor dem Spiegel",
      en: "In the morning, at the mirror",
      zh: "早上，在镜子前",
      hi: "सुबह, आईने के सामने",
      es: "Por la mañana, frente al espejo",
      ar: "في الصباح، أمام المرآة",
      ru: "Утром, перед зеркалом",
    },
    parts: [
      {
        who: {
          de: "Sie sagen vor, Ihr Kind spricht nach:",
          en: "You say it first, your child repeats:",
          zh: "您先说，孩子跟着说：",
          hi: "आप पहले बोलें, बच्चा दोहराए:",
          es: "Usted lo dice primero y su peque lo repite:",
          ar: "قولوا الجملة أولًا، ويردّدها طفلكم:",
          ru: "Вы говорите, ребёнок повторяет за вами:",
        },
        lines: [
          { emoji: "🌟", text: GOOD_AS_I_AM },
          {
            emoji: "🦁",
            text: {
              de: "Ich bin mutig.",
              en: "I am brave.",
              zh: "我很勇敢。",
              hi: "मैं बहादुर हूँ।",
              es: "Tengo valor.",
              ar: "عندي شجاعة.",
              ru: "Во мне есть смелость.",
            },
          },
          {
            emoji: "💪",
            text: {
              de: "Ich schaffe das. Und wenn es schwer ist, hilft mir jemand.",
              en: "I can do it. And when it's hard, someone helps me.",
              zh: "我能做到。遇到困难时，会有人帮我。",
              hi: "यह मुझसे हो जाएगा। और मुश्किल हो, तो कोई मेरी मदद करता है।",
              es: "Puedo hacerlo. Y si es difícil, alguien me ayuda.",
              ar: "أستطيع ذلك. وإن كان صعبًا، يساعدني أحد.",
              ru: "Я справлюсь. А если трудно, мне помогут.",
            },
          },
          {
            emoji: "🌱",
            text: {
              de: "Ich darf Fehler machen. So lerne ich.",
              en: "I'm allowed to make mistakes. That's how I learn.",
              zh: "我可以犯错。我就是这样学习的。",
              hi: "मुझसे गलती हो सकती है। गलतियों से ही मुझे सीख मिलती है।",
              es: "Puedo equivocarme. Así aprendo.",
              ar: "يحقّ لي أن أخطئ. هكذا أتعلّم.",
              ru: "Мне можно ошибаться. Так я учусь.",
            },
          },
        ],
      },
    ],
    how: {
      de: "Stellen Sie sich zusammen vor den Spiegel, eine Hand aufs Herz. Ihr Kind spricht nach, wenn es mag – es muss nie. Jeden Morgen dieselben Sätze: Gerade die Wiederholung macht sie vertraut.",
      en: "Stand in front of the mirror together, one hand on your heart. Your child repeats the words if they like – they never have to. The same sentences every morning: it is the repetition that makes them familiar.",
      zh: "一起站在镜子前，一只手放在胸口。孩子愿意的话就跟着说——从不勉强。每天早上说同样的话：正是重复让它们变得熟悉。",
      hi: "साथ में आईने के सामने खड़े हों, एक हाथ दिल पर। बच्चा चाहे तो दोहराए – ज़रूरी कभी नहीं। हर सुबह वही वाक्य: दोहराने से ही वे अपने लगने लगते हैं।",
      es: "Colóquese con su peque frente al espejo, con una mano en el corazón. Su peque repite si quiere; nunca tiene que hacerlo. Cada mañana las mismas frases: es justo la repetición la que las hace familiares.",
      ar: "قفوا معًا أمام المرآة، ويدٌ على القلب. يردّد طفلكم الجمل إن أراد – ولا يُجبَر على ذلك أبدًا. الجمل نفسها كل صباح: فالتكرار هو ما يجعلها مألوفة.",
      ru: "Встаньте вместе перед зеркалом, положив руку на сердце. Ребёнок повторяет, если хочет, – но это никогда не обязательно. Каждое утро одни и те же слова: именно повторение делает их родными.",
    },
  },
  {
    id: "erzaehlen",
    emoji: "💬",
    label: { de: "Erzählen", en: "Sharing the day", zh: "聊聊今天", hi: "दिन की बातें", es: "Contar el día", ar: "نحكي عن اليوم", ru: "Рассказ о дне" },
    when: {
      de: "Nach Kita oder Schule",
      en: "After daycare or school",
      zh: "从幼儿园或学校回来后",
      hi: "प्लेस्कूल या स्कूल के बाद",
      es: "Después de la guardería o el colegio",
      ar: "بعد الحضانة أو المدرسة",
      ru: "После садика или школы",
    },
    parts: [
      {
        who: {
          de: "Sie fragen – und erzählen auch von Ihrem Tag:",
          en: "You ask – and tell about your own day too:",
          zh: "您来问——也讲讲您自己的一天：",
          hi: "आप पूछें – और अपने दिन के बारे में भी बताएँ:",
          es: "Usted pregunta, y también cuenta su día:",
          ar: "اسألوا – واحكوا أيضًا عن يومكم:",
          ru: "Вы спрашиваете – и рассказываете о своём дне:",
        },
        lines: [
          {
            emoji: "☀️",
            text: {
              de: "Was war heute schön?",
              en: "What was nice today?",
              zh: "今天有什么开心的事？",
              hi: "आज क्या अच्छा था?",
              es: "¿Qué fue bonito hoy?",
              ar: "ما الشيء الجميل اليوم؟",
              ru: "Что сегодня было хорошего?",
            },
          },
          {
            emoji: "🌧️",
            text: {
              de: "Was war heute blöd?",
              en: "What was rotten today?",
              zh: "今天有什么不开心的事？",
              hi: "आज क्या बुरा था?",
              es: "¿Qué fue feo hoy?",
              ar: "ما الشيء المزعج اليوم؟",
              ru: "Что сегодня было плохого?",
            },
          },
          {
            emoji: "🌱",
            text: {
              de: "Was war heute neu?",
              en: "What was new today?",
              zh: "今天有什么新鲜事？",
              hi: "आज क्या नया था?",
              es: "¿Qué hubo de nuevo hoy?",
              ar: "ما الجديد اليوم؟",
              ru: "Что сегодня было нового?",
            },
          },
        ],
      },
    ],
    how: {
      de: "Erst ankommen lassen – trinken, kuscheln, spielen –, dann fragen. Erzählen Sie zuerst von sich: So lernt Ihr Kind, wie Erzählen geht. Beim Blöden erst einmal nur zuhören, nicht gleich lösen. Den Kleinsten reicht ein Wort oder ein Zeigen.",
      en: "Let your child arrive first – a drink, a cuddle, some play – then ask. Tell about yourself first: that is how your child learns how telling works. When something was rotten, just listen at first, don't fix it straight away. For the littlest ones a word or pointing is enough.",
      zh: "先让孩子安顿下来——喝点水、抱一抱、玩一会儿——再问。您先讲讲自己：这样孩子就学会怎么讲述。遇到不开心的事，先只是倾听，不急着解决。最小的孩子说一个词或指一指就够了。",
      hi: "पहले बच्चे को सहज होने दें – कुछ पीना, गले लगना, खेलना – फिर पूछें। पहले अपने बारे में बताएँ: ऐसे बच्चा सीखता है कि बातें कैसे बताई जाती हैं। बुरी बात पर पहले सिर्फ़ सुनें, तुरंत हल न करें। सबसे छोटों के लिए एक शब्द या इशारा काफ़ी है।",
      es: "Primero deje que su peque llegue: beber algo, un abrazo, jugar un rato; después pregunte. Cuente usted primero: así su peque aprende cómo se cuenta algo. Ante lo feo, al principio solo escuche, sin resolverlo enseguida. A los más pequeños les basta una palabra o señalar.",
      ar: "دعوا الطفل يرتاح أولًا – يشرب، يحضن، يلعب – ثم اسألوا. احكوا عن أنفسكم أولًا: هكذا يتعلّم طفلكم كيف يحكي. عند الشيء المزعج استمعوا فقط في البداية، ولا تسارعوا إلى الحلّ. يكفي الصغارَ جدًا كلمةٌ أو إشارة.",
      ru: "Сначала дайте ребёнку прийти в себя – попить, обняться, поиграть, – потом спрашивайте. Сначала расскажите о себе: так ребёнок учится рассказывать. О плохом сначала просто слушайте, не спешите решать. Самым маленьким хватит одного слова или жеста.",
    },
  },
  {
    // C-33: once in the morning and once in the evening; in the evening the game shows the morning's weather beside.
    id: "wiegehts",
    emoji: "🌦️",
    // The same name as the game it opens (MOOD_TITLE in feelings/names.ts).
    label: { de: "Wie geht's dir?", en: "How are you?", zh: "心情怎么样？", hi: "कैसा लग रहा है?", es: "¿Cómo estás?", ar: "كيف حالك؟", ru: "Как дела?" },
    when: {
      de: "Am Morgen und am Abend",
      en: "In the morning and in the evening",
      zh: "早上和晚上",
      hi: "सुबह और शाम",
      es: "Por la mañana y por la noche",
      ar: "في الصباح والمساء",
      ru: "Утром и вечером",
    },
    game: "/wie-gehts-dir/",
    parts: [
      {
        who: YOU_ASK,
        lines: [
          {
            emoji: "🌤️",
            text: {
              de: "Wie geht's dir heute? Welches Wetter passt zu dir?",
              en: "How are you today? Which weather fits you?",
              zh: "你今天怎么样？哪种天气像你？",
              hi: "आज तुम्हें कैसा लग रहा है? कौन-सा मौसम तुम्हारे मन जैसा है?",
              es: "¿Cómo estás hoy? ¿Qué tiempo va contigo?",
              ar: "كيف حالك اليوم؟ أيّ طقس يشبهك؟",
              ru: "Как ты сегодня? Какая погода похожа на тебя?",
            },
          },
        ],
      },
      {
        who: { de: "Am Abend:", en: "In the evening:", zh: "晚上：", hi: "शाम को:", es: "Por la noche:", ar: "في المساء:", ru: "Вечером:" },
        lines: [
          {
            emoji: "🌦️",
            text: {
              de: "Heute früh war Regen – und jetzt? Was ist passiert?",
              en: "This morning it was rain – and now? What happened?",
              zh: "今天早上下着雨——现在呢？发生了什么？",
              hi: "सुबह बारिश थी – और अब? क्या हुआ?",
              es: "Esta mañana llovía, ¿y ahora? ¿Qué ha pasado?",
              ar: "في الصباح كان مطرًا – والآن؟ ماذا حدث؟",
              ru: "Утром был дождь – а сейчас? Что случилось?",
            },
          },
        ],
      },
    ],
    how: {
      de: "Ihr Kind tippt das Wetter an, das zu ihm passt. Am Abend zeigt das Spiel das Wetter vom Morgen daneben: So sieht es, dass Gefühle kommen und gehen. Jedes Wetter ist in Ordnung.",
      en: "Your child taps the weather that fits them. In the evening the game shows the morning's weather beside it: so your child sees that feelings come and go. Every weather is all right.",
      zh: "孩子点一下符合自己心情的天气。晚上，游戏会在旁边显示早上的天气：孩子由此看到，情绪来了又走。每种天气都没关系。",
      hi: "बच्चा वह मौसम छूता है जो उसके मन से मेल खाता है। शाम को खेल उसके पास सुबह का मौसम भी दिखाता है: ऐसे बच्चा देखता है कि भावनाएँ आती-जाती रहती हैं। हर मौसम ठीक है।",
      es: "Su peque toca el tiempo que le va. Por la noche, el juego muestra al lado el tiempo de la mañana: así ve que los sentimientos vienen y van. Cualquier tiempo está bien.",
      ar: "يلمس طفلكم الطقس الذي يناسبه. وفي المساء تعرض اللعبة طقس الصباح بجانبه: فيرى أن المشاعر تأتي وتذهب. كل طقس لا بأس به.",
      ru: "Ребёнок нажимает на погоду, которая ему подходит. Вечером игра показывает рядом утреннюю погоду: так ребёнок видит, что чувства приходят и уходят. Любая погода – это нормально.",
    },
  },
  {
    id: "gutenacht",
    emoji: "💛",
    label: {
      de: "Gute-Nacht-Sätze",
      en: "Good-night words",
      zh: "晚安的话",
      hi: "शुभ रात्रि वाक्य",
      es: "Frases de buenas noches",
      ar: "عبارات قبل النوم",
      ru: "Слова на ночь",
    },
    when: {
      de: "Vor dem Schlafen, im Bett",
      en: "Before sleep, in bed",
      zh: "睡觉前，在床上",
      hi: "सोने से पहले, बिस्तर में",
      es: "Antes de dormir, en la cama",
      ar: "قبل النوم، في السرير",
      ru: "Перед сном, в кровати",
    },
    parts: [
      {
        who: YOU_ASK,
        lines: [
          {
            emoji: "😊",
            text: {
              de: "Worüber hast du dich heute gefreut?",
              en: "What made you happy today?",
              zh: "今天什么让你开心？",
              hi: "आज तुम्हें किस बात से खुशी मिली?",
              es: "¿Qué te alegró hoy?",
              ar: "ما الذي أفرحك اليوم؟",
              ru: "Что тебя сегодня порадовало?",
            },
          },
        ],
      },
      {
        who: { de: "Sie sagen:", en: "You say:", zh: "您说：", hi: "आप कहें:", es: "Usted dice:", ar: "قولوا:", ru: "Вы говорите:" },
        lines: [
          {
            emoji: "🤗",
            text: {
              de: "Ich hab dich lieb, genau so, wie du bist.",
              en: "I love you, just the way you are.",
              zh: "我爱你，就爱你本来的样子。",
              hi: "तुम जैसे भी हो, मुझे तुमसे बहुत प्यार है।",
              es: "Te quiero tal como eres.",
              ar: "أحبّك كما أنت.",
              ru: "Я люблю тебя – просто потому, что ты есть.",
            },
          },
        ],
      },
      {
        who: {
          de: "Ihr Kind sagt nach:",
          en: "Your child repeats:",
          zh: "孩子跟着说：",
          hi: "बच्चा दोहराए:",
          es: "Su peque repite:",
          ar: "يردّد طفلكم:",
          ru: "Ребёнок повторяет:",
        },
        lines: [
          { emoji: "🌟", text: GOOD_AS_I_AM },
          {
            emoji: "💛",
            text: {
              de: "Ich bin geliebt.",
              en: "I am loved.",
              zh: "我被爱着。",
              hi: "मुझे सब प्यार करते हैं।",
              es: "Me quieren mucho.",
              ar: "الكلّ يحبّني.",
              ru: "Меня любят.",
            },
          },
          {
            emoji: "🌅",
            text: {
              de: "Morgen ist ein neuer Tag.",
              en: "Tomorrow is a new day.",
              zh: "明天又是新的一天。",
              hi: "कल एक नया दिन है।",
              es: "Mañana es un nuevo día.",
              ar: "غدًا يوم جديد.",
              ru: "Завтра новый день.",
            },
          },
        ],
      },
    ],
    how: {
      de: "Leise, beim Kuscheln, wenn das Licht schon aus ist. Jeden Abend gleich: Das gibt Halt und macht das Einschlafen leichter. Mag Ihr Kind nicht nachsprechen, sagen Sie die Sätze allein – sie kommen trotzdem an.",
      en: "Quietly, cuddling, when the light is already off. The same every evening: it gives security and makes falling asleep easier. If your child doesn't want to repeat them, say the sentences alone – they still reach your child.",
      zh: "轻声地，依偎着，在灯已经关了的时候。每晚都一样：这带来安全感，也让入睡更容易。孩子不想跟着说时，您就自己说——这些话依然会传到孩子心里。",
      hi: "धीरे से, गले लगाते हुए, जब बत्ती बुझ चुकी हो। हर शाम एक जैसा: इससे सहारा मिलता है और नींद आसानी से आती है। बच्चा दोहराना न चाहे, तो आप अकेले ही वाक्य कहें – वे फिर भी दिल तक पहुँचते हैं।",
      es: "En voz baja, abrazándose, con la luz ya apagada. Cada noche igual: eso da seguridad y facilita dormirse. Si su peque no quiere repetirlas, diga usted las frases: llegan igualmente.",
      ar: "بهدوء، أثناء العناق، والضوء مطفأ. كل مساء بالطريقة نفسها: هذا يمنح الأمان ويسهّل النوم. إن لم يرغب طفلكم في الترديد، فقولوا الجمل وحدكم – فهي تصل رغم ذلك.",
      ru: "Тихо, в обнимку, когда свет уже выключен. Каждый вечер одинаково: это даёт опору и помогает уснуть. Если ребёнок не хочет повторять, скажите слова сами – они всё равно дойдут.",
    },
  },
];

const RITUAL_BY_ID = new Map(RITUALS.map((ritual) => [ritual.id, ritual]));

/** The ritual a plan's card is, by the catalogue entry it came from – none for any other card. */
export const ritualOf = (step: { catalog?: string }): Ritual | undefined => (step.catalog ? RITUAL_BY_ID.get(step.catalog) : undefined);
