import type { Localized } from "@/lib/language";
import { RITUALS } from "./rituals";

// What grown-ups pick from when they make a board: tasks, rewards, the mark that
// goes into a field, colours and ready-made boards. Each has an emoji, and a picture
// made from its prompt in bilder/prompts.ts that shows in its place (pictures.tsx,
// checked in rewards.test.ts).

/** A game whose own end puts a star on the board by itself. */
export type LinkedGame = "teeth" | "potty";

/** What a grown-up makes on the page: a reward chart (stars) or a picture schedule (the steps of a day). */
export type ChartType = "board" | "plan";

/** The two kinds of chart, the first choice of the wizard. */
export const CHART_TYPES: { id: ChartType; emoji: string; label: Localized }[] = [
  {
    id: "board",
    emoji: "🌟",
    label: { de: "Belohnungstafel", en: "Reward chart", zh: "奖励表", hi: "इनाम चार्ट", es: "Tabla de premios", ar: "لوحة المكافآت", ru: "Таблица наград" },
  },
  {
    id: "plan",
    emoji: "🗓️",
    label: { de: "Zeitplan", en: "Schedule", zh: "时间表", hi: "समय-सारणी", es: "Horario", ar: "الجدول الزمني", ru: "Расписание" },
  },
];

/** A time of day a task can have its own field for: brushing teeth in the morning and in the evening. */
export type Slot = "morning" | "noon" | "evening";

/** The times of day in the order of the day, with the picture that marks their field. */
export const SLOTS: { id: Slot; emoji: string; label: Localized }[] = [
  { id: "morning", emoji: "☀️", label: { de: "Morgens", en: "Morning", zh: "早上", hi: "सुबह", es: "Por la mañana", ar: "صباحًا", ru: "Утром" } },
  { id: "noon", emoji: "🌤️", label: { de: "Mittags", en: "Midday", zh: "中午", hi: "दोपहर", es: "Al mediodía", ar: "ظهرًا", ru: "Днём" } },
  { id: "evening", emoji: "🌙", label: { de: "Abends", en: "Evening", zh: "晚上", hi: "शाम", es: "Por la noche", ar: "مساءً", ru: "Вечером" } },
];

export const SLOT_BY_ID = new Map(SLOTS.map((s) => [s.id, s]));

/**
 * Short weekday names, Monday first, for the editors' chips and a week's columns: each language's own short form
 * (Arabic has none, so its full names).
 */
export const DAY_NAMES: Localized<string[]> = {
  de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  zh: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  hi: ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"],
  es: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"],
  ar: ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"],
  ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
};

/** A habit a board can ask for. */
export interface CatalogTask {
  id: string;
  emoji: string;
  label: Localized;
  /** The game that gives this task its star by itself (Zähne putzen, Aufs Töpfchen). */
  linked?: LinkedGame;
  /** A field for each of these times of day instead of one a day, when the task is picked. */
  slots?: Slot[];
}

/** Tasks for two- and three-year-olds, the most asked for first. */
export const TASKS: CatalogTask[] = [
  {
    id: "zaehne",
    emoji: "🪥",
    label: { de: "Zähne putzen", en: "Brush teeth", zh: "刷牙", hi: "दाँत साफ़ करना", es: "Lavarse los dientes", ar: "تنظيف الأسنان", ru: "Чистить зубы" },
    linked: "teeth",
    slots: ["morning", "evening"],
  },
  {
    id: "toepfchen",
    emoji: "🚽",
    label: { de: "Aufs Töpfchen", en: "Potty", zh: "坐便盆", hi: "पॉटी पर जाना", es: "Al orinal", ar: "إلى النونية", ru: "На горшок" },
    linked: "potty",
  },
  {
    id: "anziehen",
    emoji: "👕",
    label: { de: "Anziehen", en: "Get dressed", zh: "穿衣服", hi: "कपड़े पहनना", es: "Vestirse", ar: "ارتداء الملابس", ru: "Одеваться" },
  },
  {
    id: "bett",
    emoji: "🛏️",
    label: {
      de: "Im eigenen Bett schlafen",
      en: "Sleep in my own bed",
      zh: "睡自己的床",
      hi: "अपने बिस्तर पर सोना",
      es: "Dormir en mi cama",
      ar: "النوم في سريري",
      ru: "Спать в своей кровати",
    },
  },
  {
    id: "haende",
    emoji: "🧼",
    label: { de: "Hände waschen", en: "Wash hands", zh: "洗手", hi: "हाथ धोना", es: "Lavarse las manos", ar: "غسل اليدين", ru: "Мыть руки" },
  },
  {
    id: "aufraeumen",
    emoji: "🧸",
    label: { de: "Aufräumen", en: "Tidy up", zh: "收拾玩具", hi: "सामान समेटना", es: "Recoger", ar: "ترتيب الألعاب", ru: "Убирать игрушки" },
  },
  {
    id: "schuhe",
    emoji: "👟",
    label: { de: "Schuhe anziehen", en: "Put on shoes", zh: "穿鞋", hi: "जूते पहनना", es: "Ponerse los zapatos", ar: "لبس الحذاء", ru: "Надевать обувь" },
  },
  {
    id: "jacke",
    emoji: "🧥",
    label: { de: "Jacke anziehen", en: "Put on a jacket", zh: "穿外套", hi: "जैकेट पहनना", es: "Ponerse la chaqueta", ar: "لبس السترة", ru: "Надевать куртку" },
  },
  {
    id: "probieren",
    emoji: "🥦",
    label: {
      de: "Etwas Neues probieren",
      en: "Try something new",
      zh: "尝尝新东西",
      hi: "कुछ नया चखना",
      es: "Probar algo nuevo",
      ar: "تذوّق شيء جديد",
      ru: "Пробовать новое",
    },
  },
  {
    id: "essen",
    emoji: "🥄",
    label: {
      de: "Allein essen",
      en: "Eat by myself",
      zh: "自己吃饭",
      hi: "खुद खाना खाना",
      es: "Comer sin ayuda",
      ar: "الأكل دون مساعدة",
      ru: "Есть самостоятельно",
    },
  },
  {
    id: "tisch",
    emoji: "🍽️",
    label: {
      de: "Tisch decken helfen",
      en: "Help set the table",
      zh: "帮忙摆餐桌",
      hi: "मेज़ लगाने में मदद",
      es: "Ayudar a poner la mesa",
      ar: "المساعدة في تجهيز المائدة",
      ru: "Помогать накрывать на стол",
    },
  },
  { id: "baden", emoji: "🛁", label: { de: "Baden", en: "Bath", zh: "洗澡", hi: "नहाना", es: "Bañarse", ar: "الاستحمام", ru: "Купаться" } },
  {
    id: "haare",
    emoji: "🚿",
    label: { de: "Haare waschen", en: "Wash hair", zh: "洗头", hi: "बाल धोना", es: "Lavarse el pelo", ar: "غسل الشعر", ru: "Мыть голову" },
  },
  {
    id: "nase",
    emoji: "🤧",
    label: { de: "Nase putzen", en: "Blow nose", zh: "擤鼻涕", hi: "नाक साफ़ करना", es: "Sonarse la nariz", ar: "تنظيف الأنف", ru: "Сморкаться" },
  },
  {
    id: "eincremen",
    emoji: "🧴",
    label: { de: "Eincremen", en: "Put on cream", zh: "擦润肤霜", hi: "क्रीम लगाना", es: "Ponerse crema", ar: "وضع الكريم", ru: "Мазаться кремом" },
  },
  {
    id: "anschnallen",
    emoji: "🚗",
    label: { de: "Anschnallen", en: "Buckle up", zh: "系安全带", hi: "बेल्ट लगाना", es: "Abrocharse el cinturón", ar: "ربط حزام الأمان", ru: "Пристёгиваться" },
  },
  {
    id: "hand",
    emoji: "✋",
    label: { de: "An der Hand gehen", en: "Hold hands", zh: "牵着手走", hi: "हाथ पकड़कर चलना", es: "Ir de la mano", ar: "المشي يدًا بيد", ru: "Идти за руку" },
  },
  {
    id: "abschied",
    emoji: "👋",
    label: {
      de: "Tschüss sagen in der Kita",
      en: "Say bye at daycare",
      zh: "在幼儿园说再见",
      hi: "प्लेस्कूल में बाय-बाय कहना",
      es: "Decir adiós en la guarde",
      ar: "قول وداعًا في الحضانة",
      ru: "Прощаться в садике",
    },
  },
  { id: "helfen", emoji: "🤝", label: { de: "Helfen", en: "Help out", zh: "帮忙", hi: "मदद करना", es: "Ayudar", ar: "المساعدة", ru: "Помогать" } },
];

/** Something to look forward to: time together first, as parents' guides advise, sweets last. */
export interface CatalogReward {
  id: string;
  emoji: string;
  label: Localized;
}

export const REWARDS: CatalogReward[] = [
  {
    id: "spielplatz",
    emoji: "🛝",
    label: { de: "Spielplatz", en: "Playground", zh: "游乐场", hi: "पार्क", es: "Parque", ar: "حديقة الألعاب", ru: "Детская площадка" },
  },
  {
    id: "buch",
    emoji: "📖",
    label: {
      de: "Lieblingsbuch lesen",
      en: "Read a favourite book",
      zh: "读最爱的书",
      hi: "पसंदीदा किताब पढ़ना",
      es: "Leer el cuento favorito",
      ar: "قراءة الكتاب المفضّل",
      ru: "Читать любимую книжку",
    },
  },
  {
    id: "backen",
    emoji: "🧁",
    label: { de: "Zusammen backen", en: "Bake together", zh: "一起烤点心", hi: "साथ में केक बनाना", es: "Hornear en familia", ar: "الخَبز معًا", ru: "Печь вместе" },
  },
  {
    id: "kuscheln",
    emoji: "🤗",
    label: { de: "Extra kuscheln", en: "Extra cuddles", zh: "多抱抱", hi: "ढेर सारी झप्पी", es: "Mimos extra", ar: "أحضان إضافية", ru: "Обнимашки" },
  },
  {
    id: "hoehle",
    emoji: "🏕️",
    label: { de: "Höhle bauen", en: "Build a den", zh: "搭小帐篷", hi: "तकियों का घर बनाना", es: "Hacer una cabaña", ar: "بناء خيمة", ru: "Строить шалаш" },
  },
  {
    id: "seifenblasen",
    emoji: "🫧",
    label: { de: "Seifenblasen", en: "Soap bubbles", zh: "吹泡泡", hi: "बुलबुले उड़ाना", es: "Pompas de jabón", ar: "فقاعات الصابون", ru: "Мыльные пузыри" },
  },
  {
    id: "tanzen",
    emoji: "💃",
    label: { de: "Tanzparty", en: "Dance party", zh: "跳舞派对", hi: "डांस पार्टी", es: "Fiesta de baile", ar: "حفلة رقص", ru: "Танцы" },
  },
  {
    id: "malen",
    emoji: "🎨",
    label: {
      de: "Zusammen malen",
      en: "Draw together",
      zh: "一起画画",
      hi: "साथ में चित्र बनाना",
      es: "Pintar en familia",
      ar: "الرسم معًا",
      ru: "Рисовать вместе",
    },
  },
  { id: "picknick", emoji: "🧺", label: { de: "Picknick", en: "Picnic", zh: "野餐", hi: "पिकनिक", es: "Pícnic", ar: "نزهة", ru: "Пикник" } },
  {
    id: "laufrad",
    emoji: "🚲",
    label: {
      de: "Laufrad fahren",
      en: "Balance bike ride",
      zh: "骑平衡车",
      hi: "साइकिल चलाना",
      es: "Paseo en bici",
      ar: "ركوب الدراجة",
      ru: "Кататься на беговеле",
    },
  },
  {
    id: "freunde",
    emoji: "👫",
    label: {
      de: "Freunde treffen",
      en: "Meet friends",
      zh: "和朋友玩",
      hi: "दोस्तों से मिलना",
      es: "Ver a los amigos",
      ar: "لقاء الأصدقاء",
      ru: "Встреча с друзьями",
    },
  },
  {
    id: "zoo",
    emoji: "🦒",
    label: { de: "In den Zoo", en: "Trip to the zoo", zh: "去动物园", hi: "चिड़ियाघर जाना", es: "Ir al zoo", ar: "زيارة حديقة الحيوانات", ru: "В зоопарк" },
  },
  {
    id: "schwimmen",
    emoji: "🏊",
    label: { de: "Schwimmbad", en: "Swimming pool", zh: "去游泳池", hi: "स्विमिंग पूल", es: "Piscina", ar: "المسبح", ru: "Бассейн" },
  },
  {
    id: "eis",
    emoji: "🍦",
    label: { de: "Ein Eis", en: "An ice cream", zh: "一个冰淇淋", hi: "एक आइसक्रीम", es: "Un helado", ar: "آيس كريم", ru: "Мороженое" },
  },
];

/** What fills a field: an emoji on screen and on colour prints, an outline to colour in where there is one. */
export interface CatalogMark {
  id: string;
  emoji: string;
  label: Localized;
  /** An outline in a 100×100 box, printed to colour in; without one the emoji is printed pale instead. */
  outline?: string;
}

export const MARKS: CatalogMark[] = [
  {
    id: "stern",
    emoji: "⭐",
    label: { de: "Stern", en: "Star", zh: "星星", hi: "सितारा", es: "Estrella", ar: "نجمة", ru: "Звезда" },
    outline: "M50 5 L61 38 L96 38 L68 59 L79 93 L50 72 L21 93 L32 59 L4 38 L39 38 Z",
  },
  {
    id: "herz",
    emoji: "❤️",
    label: { de: "Herz", en: "Heart", zh: "爱心", hi: "दिल", es: "Corazón", ar: "قلب", ru: "Сердце" },
    outline: "M50 88 C20 65 5 48 5 30 C5 15 17 5 30 5 C40 5 47 11 50 18 C53 11 60 5 70 5 C83 5 95 15 95 30 C95 48 80 65 50 88 Z",
  },
  {
    id: "blume",
    emoji: "🌸",
    label: { de: "Blume", en: "Flower", zh: "花朵", hi: "फूल", es: "Flor", ar: "زهرة", ru: "Цветок" },
    outline:
      "M50 38 A12 12 0 1 1 50 62 A12 12 0 1 1 50 38 Z M50 36 C38 10 62 10 50 36 Z M64 46 C90 34 90 58 64 54 Z M58 64 C70 90 46 94 46 66 Z M42 64 C30 90 6 76 34 58 Z M36 46 C10 34 18 10 44 38 Z",
  },
  {
    id: "sonne",
    emoji: "☀️",
    label: { de: "Sonne", en: "Sun", zh: "太阳", hi: "सूरज", es: "Sol", ar: "شمس", ru: "Солнце" },
    outline:
      "M50 28 A22 22 0 1 1 50 72 A22 22 0 1 1 50 28 Z M50 4 L50 18 M50 82 L50 96 M4 50 L18 50 M82 50 L96 50 M17 17 L27 27 M73 73 L83 83 M17 83 L27 73 M73 27 L83 17",
  },
  { id: "kaefer", emoji: "🐞", label: { de: "Marienkäfer", en: "Ladybird", zh: "瓢虫", hi: "लेडीबर्ड", es: "Mariquita", ar: "دعسوقة", ru: "Божья коровка" } },
  { id: "schmetterling", emoji: "🦋", label: { de: "Schmetterling", en: "Butterfly", zh: "蝴蝶", hi: "तितली", es: "Mariposa", ar: "فراشة", ru: "Бабочка" } },
  { id: "pfote", emoji: "🐾", label: { de: "Pfote", en: "Paw", zh: "爪印", hi: "पंजा", es: "Huella", ar: "أثر قدم", ru: "Лапка" } },
  { id: "smiley", emoji: "😊", label: { de: "Lachgesicht", en: "Smiley face", zh: "笑脸", hi: "मुस्कान", es: "Carita feliz", ar: "وجه ضاحك", ru: "Улыбка" } },
];

/** Colours of a board, on screen and in colour prints. */
export interface Theme {
  id: string;
  label: Localized;
  /** The page behind the board. */
  paper: string;
  /** Fields, headings, the goal. */
  main: string;
  /** Lines and text on `main`. */
  ink: string;
}

export const THEMES: Theme[] = [
  {
    id: "sonne",
    label: { de: "☀️ Sonne", en: "☀️ Sun", zh: "☀️ 太阳", hi: "☀️ सूरज", es: "☀️ Sol", ar: "☀️ شمس", ru: "☀️ Солнце" },
    paper: "#fff8e1",
    main: "#ffd23f",
    ink: "#7a4b00",
  },
  {
    id: "meer",
    label: { de: "🌊 Meer", en: "🌊 Sea", zh: "🌊 大海", hi: "🌊 समुद्र", es: "🌊 Mar", ar: "🌊 بحر", ru: "🌊 Море" },
    paper: "#e8f6ff",
    main: "#7cc8f2",
    ink: "#0f4c81",
  },
  {
    id: "wiese",
    label: { de: "🌿 Wiese", en: "🌿 Meadow", zh: "🌿 草地", hi: "🌿 घास का मैदान", es: "🌿 Prado", ar: "🌿 مرج", ru: "🌿 Луг" },
    paper: "#eefbe6",
    main: "#9bd77a",
    ink: "#2f6b1f",
  },
  {
    id: "beere",
    label: { de: "🍓 Beere", en: "🍓 Berry", zh: "🍓 莓果", hi: "🍓 स्ट्रॉबेरी", es: "🍓 Frutos rojos", ar: "🍓 توت", ru: "🍓 Ягода" },
    paper: "#fff0f6",
    main: "#ffa8cc",
    ink: "#8c1b4f",
  },
  {
    id: "nacht",
    label: { de: "🌙 Nacht", en: "🌙 Night", zh: "🌙 夜晚", hi: "🌙 रात", es: "🌙 Noche", ar: "🌙 ليل", ru: "🌙 Ночь" },
    paper: "#f1efff",
    main: "#b3a8ff",
    ink: "#3d2f8f",
  },
];

/** The kinds of board, which are also the views of one board: day, week and month share its stars. */
export type BoardKind = "day" | "week" | "month" | "collect";

/** A kind of board with what it is for, in one line for grown-ups. */
export interface KindInfo {
  id: BoardKind;
  emoji: string;
  label: Localized;
  hint: Localized;
}

/**
 * In the order of the switch above the board: day, week and month are the main views (the same stars, seen
 * for a shorter or longer time), collecting comes last and apart – it counts stars, not days.
 */
export const KINDS: KindInfo[] = [
  {
    id: "day",
    emoji: "☀️",
    label: { de: "Tag", en: "Day", zh: "日", hi: "दिन", es: "Día", ar: "يوم", ru: "День" },
    hint: {
      de: "Heute: die Aufgaben als große Bilder",
      en: "Today: the tasks as big pictures",
      zh: "今天：任务以大图显示",
      hi: "आज: काम बड़ी तस्वीरों में",
      es: "Hoy: las tareas en imágenes grandes",
      ar: "اليوم: المهام بصور كبيرة",
      ru: "Сегодня: задания крупными картинками",
    },
  },
  {
    id: "week",
    emoji: "📅",
    label: { de: "Woche", en: "Week", zh: "周", hi: "हफ़्ता", es: "Semana", ar: "أسبوع", ru: "Неделя" },
    hint: {
      de: "Aufgaben und Wochentage, Montag bis Sonntag",
      en: "Tasks and weekdays, Monday to Sunday",
      zh: "任务和星期，周一到周日",
      hi: "काम और हफ़्ते के दिन, सोमवार से रविवार",
      es: "Tareas y días de la semana, de lunes a domingo",
      ar: "المهام وأيام الأسبوع، من الاثنين إلى الأحد",
      ru: "Задания и дни недели, с понедельника по воскресенье",
    },
  },
  {
    id: "month",
    emoji: "🗓️",
    label: { de: "Monat", en: "Month", zh: "月", hi: "महीना", es: "Mes", ar: "شهر", ru: "Месяц" },
    hint: {
      de: "Ein Kalender für den ganzen Monat",
      en: "A calendar for the whole month",
      zh: "整个月的日历",
      hi: "पूरे महीने का कैलेंडर",
      es: "Un calendario para todo el mes",
      ar: "تقويم للشهر كله",
      ru: "Календарь на весь месяц",
    },
  },
  {
    id: "collect",
    emoji: "🐾",
    label: { de: "Sammeln", en: "Collect", zh: "收集", hi: "जमा करना", es: "Juntar", ar: "جمع", ru: "Копилка" },
    hint: {
      de: "Ein Weg mit 3 bis 30 Sternen bis zur Belohnung",
      en: "A path of 3 to 30 stars to the reward",
      zh: "通往奖励的路，3到30颗星星",
      hi: "इनाम तक 3 से 30 सितारों का रास्ता",
      es: "Un camino de 3 a 30 estrellas hasta el premio",
      ar: "طريق من 3 إلى 30 نجمة حتى المكافأة",
      ru: "Дорожка из 3–30 звёзд до награды",
    },
  },
];

/** A ready-made board to start from; the grown-up changes what they like afterwards. */
export interface Template {
  id: string;
  emoji: string;
  label: Localized;
  kind: BoardKind;
  /** Catalogue task ids. */
  tasks: string[];
  /** Stars until the reward (fields of a collecting board). */
  goal: number;
  reward: string | null;
  mark: string;
  theme: string;
  title?: Localized;
  /** Times of day of a task, where they differ from the catalogue's (Mein Morgen brushes only in the morning). */
  slots?: Record<string, Slot[]>;
  /** One line for grown-ups under its picture in the gallery and the wizard. */
  hint: Localized;
}

/** Shown in the gallery of Vorlagen and the wizard, in the order of KINDS; the first is the board a new visitor sees. */
export const TEMPLATES: Template[] = [
  {
    id: "zaehne-woche",
    emoji: "🪥",
    label: { de: "Zähne-Woche", en: "Teeth week", zh: "刷牙周", hi: "दाँतों का हफ़्ता", es: "Semana de dientes", ar: "أسبوع الأسنان", ru: "Неделя зубов" },
    kind: "week",
    tasks: ["zaehne"],
    goal: 10,
    reward: "buch",
    mark: "stern",
    theme: "meer",
    hint: {
      de: "Morgens und abends ein Stern – nach „Zähne putzen“ kommt er von selbst",
      en: "A star morning and evening – after “Brushing Teeth” it comes by itself",
      zh: "早晚各一颗星——玩完“刷牙”会自动出现",
      hi: "सुबह और शाम एक सितारा – “दाँत साफ़ करना” के बाद अपने-आप आता है",
      es: "Una estrella por la mañana y otra por la noche: después de «Lavarse los dientes» llega sola",
      ar: "نجمة صباحًا ومساءً – بعد «تنظيف الأسنان» تأتي وحدها",
      ru: "Звезда утром и вечером – после «Чистим зубы» она появляется сама",
    },
  },
  {
    // Morning and evening on one board: nobody wants the one without the other (user feedback, October 2026).
    id: "mein-tag",
    emoji: "🌞",
    label: { de: "Mein Tag", en: "My day", zh: "我的一天", hi: "मेरा दिन", es: "Mi día", ar: "يومي", ru: "Мой день" },
    kind: "day",
    tasks: ["anziehen", "zaehne", "baden"],
    slots: { anziehen: ["morning"], zaehne: ["morning", "evening"], baden: ["evening"] },
    goal: 3,
    reward: null,
    mark: "sonne",
    theme: "sonne",
    title: { de: "Mein Tag", en: "My day", zh: "我的一天", hi: "मेरा दिन", es: "Mi día", ar: "يومي", ru: "Мой день" },
    hint: {
      de: "Morgens anziehen, abends baden, Zähne putzen bei beidem – auf einer Seite",
      en: "Get dressed in the morning, bath in the evening, brush teeth at both – on one page",
      zh: "早上穿衣，晚上洗澡，早晚都刷牙——都在一页上",
      hi: "सुबह कपड़े पहनना, शाम को नहाना, दोनों बार दाँत साफ़ करना – एक ही पेज पर",
      es: "Vestirse por la mañana, bañarse por la noche y lavarse los dientes en ambos momentos, en una sola página",
      ar: "ارتداء الملابس صباحًا، والاستحمام مساءً، وتنظيف الأسنان في الوقتين – في صفحة واحدة",
      ru: "Утром одеться, вечером искупаться, зубы чистить и утром, и вечером – на одной странице",
    },
  },
  {
    id: "toepfchen",
    emoji: "🚽",
    label: { de: "Töpfchen-Woche", en: "Potty week", zh: "便盆周", hi: "पॉटी का हफ़्ता", es: "Semana del orinal", ar: "أسبوع النونية", ru: "Неделя горшка" },
    kind: "week",
    tasks: ["toepfchen"],
    goal: 5,
    reward: "seifenblasen",
    mark: "stern",
    theme: "wiese",
    hint: {
      de: "Ein Stern an jedem Tag mit Töpfchen",
      en: "A star for every day with the potty",
      zh: "每天用便盆就得一颗星",
      hi: "पॉटी वाले हर दिन एक सितारा",
      es: "Una estrella cada día con orinal",
      ar: "نجمة في كل يوم مع النونية",
      ru: "Звезда за каждый день с горшком",
    },
  },
  {
    id: "woche",
    emoji: "📅",
    label: {
      de: "Woche mit drei Aufgaben",
      en: "Week with three tasks",
      zh: "三项任务的一周",
      hi: "तीन कामों वाला हफ़्ता",
      es: "Semana con tres tareas",
      ar: "أسبوع بثلاث مهام",
      ru: "Неделя с тремя заданиями",
    },
    kind: "week",
    tasks: ["zaehne", "anziehen", "aufraeumen"],
    goal: 15,
    reward: "zoo",
    mark: "stern",
    theme: "sonne",
    hint: {
      de: "Zähne morgens und abends, Anziehen, Aufräumen",
      en: "Teeth morning and evening, getting dressed, tidying up",
      zh: "早晚刷牙、穿衣、收拾",
      hi: "सुबह-शाम दाँत, कपड़े पहनना, सामान समेटना",
      es: "Dientes mañana y noche, vestirse, recoger",
      ar: "الأسنان صباحًا ومساءً، ارتداء الملابس، الترتيب",
      ru: "Зубы утром и вечером, одеваться, убирать игрушки",
    },
  },
  {
    id: "zaehne-monat",
    emoji: "🗓️",
    label: { de: "Zähne-Monat", en: "Teeth month", zh: "刷牙月", hi: "दाँतों का महीना", es: "Mes de dientes", ar: "شهر الأسنان", ru: "Месяц зубов" },
    kind: "month",
    tasks: ["zaehne"],
    goal: 40,
    reward: "zoo",
    mark: "stern",
    theme: "meer",
    hint: {
      de: "Ein ganzer Monat Zähneputzen, morgens und abends",
      en: "A whole month of brushing, morning and evening",
      zh: "整整一个月，早晚刷牙",
      hi: "पूरे महीने दाँत साफ़ करना, सुबह और शाम",
      es: "Un mes entero de cepillado, mañana y noche",
      ar: "شهر كامل من تنظيف الأسنان، صباحًا ومساءً",
      ru: "Целый месяц чистки зубов, утром и вечером",
    },
  },
  {
    id: "monat",
    emoji: "📆",
    label: {
      de: "Monat mit zwei Aufgaben",
      en: "Month with two tasks",
      zh: "两项任务的一个月",
      hi: "दो कामों वाला महीना",
      es: "Mes con dos tareas",
      ar: "شهر بمهمتين",
      ru: "Месяц с двумя заданиями",
    },
    kind: "month",
    tasks: ["toepfchen", "bett"],
    goal: 30,
    reward: "schwimmen",
    mark: "herz",
    theme: "beere",
    hint: {
      de: "Töpfchen und eigenes Bett, für größere Ziele",
      en: "Potty and own bed, for bigger goals",
      zh: "便盆和自己睡，适合更大的目标",
      hi: "पॉटी और अपना बिस्तर, बड़े लक्ष्यों के लिए",
      es: "Orinal y cama propia, para metas más grandes",
      ar: "النونية والسرير الخاص، لأهداف أكبر",
      ru: "Горшок и своя кровать – для целей побольше",
    },
  },
  {
    id: "fuenf",
    emoji: "⭐",
    label: {
      de: "5 Sterne bis zum Spielplatz",
      en: "5 stars to the playground",
      zh: "5颗星去游乐场",
      hi: "पार्क तक 5 सितारे",
      es: "5 estrellas hasta el parque",
      ar: "5 نجوم حتى حديقة الألعاب",
      ru: "5 звёзд до площадки",
    },
    kind: "collect",
    tasks: ["anziehen"],
    goal: 5,
    reward: "spielplatz",
    mark: "stern",
    theme: "sonne",
    hint: {
      de: "Kurz und bald: für die Kleinsten",
      en: "Short and soon: for the littlest",
      zh: "短而快：给最小的孩子",
      hi: "छोटा और जल्दी: सबसे छोटों के लिए",
      es: "Corto y pronto: para los más peques",
      ar: "قصير وقريب: للأصغر سنًّا",
      ru: "Коротко и скоро: для самых маленьких",
    },
  },
  {
    id: "bett",
    emoji: "🛏️",
    label: {
      de: "7 Nächte im eigenen Bett",
      en: "7 nights in own bed",
      zh: "在自己床上睡7晚",
      hi: "अपने बिस्तर में 7 रातें",
      es: "7 noches en la cama propia",
      ar: "7 ليالٍ في السرير الخاص",
      ru: "7 ночей в своей кровати",
    },
    kind: "collect",
    tasks: ["bett"],
    goal: 7,
    reward: "backen",
    mark: "herz",
    theme: "nacht",
    hint: {
      de: "Jede Nacht im eigenen Bett ein Herz",
      en: "A heart for every night in own bed",
      zh: "每在自己床上睡一晚，就得一颗爱心",
      hi: "अपने बिस्तर में हर रात एक दिल",
      es: "Un corazón por cada noche en la cama propia",
      ar: "قلب عن كل ليلة في السرير الخاص",
      ru: "Сердечко за каждую ночь в своей кровати",
    },
  },
];

/**
 * What a day is made of, for the Tagesplan: meals, Kita, sleep, outings. Not habits to reward but steps of a day; a
 * plan takes these and the tasks above (Zähne putzen, Anziehen …). Ids differ from the tasks' (one map holds both).
 */
export const ACTIVITIES: CatalogTask[] = [
  { id: "aufstehen", emoji: "🌅", label: { de: "Aufstehen", en: "Get up", zh: "起床", hi: "उठना", es: "Levantarse", ar: "الاستيقاظ", ru: "Подъём" } },
  { id: "fruehstueck", emoji: "🥣", label: { de: "Frühstück", en: "Breakfast", zh: "早餐", hi: "नाश्ता", es: "Desayuno", ar: "الفطور", ru: "Завтрак" } },
  { id: "kita", emoji: "🏫", label: { de: "Kita", en: "Daycare", zh: "幼儿园", hi: "प्लेस्कूल", es: "Guardería", ar: "الحضانة", ru: "Садик" } },
  { id: "mittagessen", emoji: "🍲", label: { de: "Mittagessen", en: "Lunch", zh: "午饭", hi: "दोपहर का खाना", es: "Comida", ar: "الغداء", ru: "Обед" } },
  {
    id: "mittagsschlaf",
    emoji: "💤",
    label: { de: "Mittagsschlaf", en: "Nap", zh: "午睡", hi: "दोपहर की झपकी", es: "Siesta", ar: "القيلولة", ru: "Тихий час" },
  },
  {
    id: "draussen",
    emoji: "🌳",
    label: { de: "Draußen spielen", en: "Play outside", zh: "在外面玩", hi: "बाहर खेलना", es: "Jugar fuera", ar: "اللعب في الخارج", ru: "Гулять" },
  },
  {
    id: "spielplatz",
    emoji: "🛝",
    label: { de: "Spielplatz", en: "Playground", zh: "游乐场", hi: "पार्क", es: "Parque", ar: "حديقة الألعاب", ru: "Детская площадка" },
  },
  { id: "spielen", emoji: "🧱", label: { de: "Spielen", en: "Play", zh: "玩耍", hi: "खेलना", es: "Jugar", ar: "اللعب", ru: "Играть" } },
  { id: "malen", emoji: "🎨", label: { de: "Malen", en: "Drawing", zh: "画画", hi: "चित्र बनाना", es: "Pintar", ar: "الرسم", ru: "Рисовать" } },
  { id: "abendessen", emoji: "🍝", label: { de: "Abendessen", en: "Dinner", zh: "晚饭", hi: "रात का खाना", es: "Cena", ar: "العشاء", ru: "Ужин" } },
  {
    id: "vorlesen",
    emoji: "📖",
    label: { de: "Buch lesen", en: "Read a book", zh: "看书", hi: "किताब पढ़ना", es: "Leer un cuento", ar: "قراءة كتاب", ru: "Читать книжку" },
  },
  { id: "schlafen", emoji: "😴", label: { de: "Schlafen", en: "Sleep", zh: "睡觉", hi: "सोना", es: "Dormir", ar: "النوم", ru: "Спать" } },
  {
    id: "oma",
    emoji: "👵",
    label: { de: "Oma und Opa", en: "Grandma and Grandpa", zh: "爷爷奶奶", hi: "दादा-दादी", es: "Los abuelos", ar: "الجدّة والجدّ", ru: "Бабушка и дедушка" },
  },
  { id: "freunde", emoji: "👫", label: { de: "Freunde", en: "Friends", zh: "朋友", hi: "दोस्त", es: "Amigos", ar: "الأصدقاء", ru: "Друзья" } },
  { id: "einkaufen", emoji: "🛒", label: { de: "Einkaufen", en: "Shopping", zh: "买东西", hi: "खरीदारी", es: "Ir de compras", ar: "التسوّق", ru: "Магазин" } },
  { id: "ausflug", emoji: "🎒", label: { de: "Ausflug", en: "Day trip", zh: "出游", hi: "सैर", es: "Excursión", ar: "رحلة", ru: "Поездка" } },
  { id: "schwimmen", emoji: "🏊", label: { de: "Schwimmen", en: "Swimming", zh: "游泳", hi: "तैरना", es: "Nadar", ar: "السباحة", ru: "Плавать" } },
  { id: "turnen", emoji: "🤸", label: { de: "Turnen", en: "Gymnastics", zh: "体操", hi: "कसरत", es: "Gimnasia", ar: "الجمباز", ru: "Гимнастика" } },
  { id: "musik", emoji: "🎵", label: { de: "Musik", en: "Music", zh: "音乐", hi: "संगीत", es: "Música", ar: "الموسيقى", ru: "Музыка" } },
  { id: "arzt", emoji: "🩺", label: { de: "Zum Arzt", en: "Doctor", zh: "看医生", hi: "डॉक्टर के पास", es: "Al médico", ar: "إلى الطبيب", ru: "К врачу" } },
  // The big days a Countdown waits for (H-41); Oma and Opa's visit is the card above.
  {
    id: "geburtstag",
    emoji: "🎂",
    label: { de: "Geburtstag", en: "Birthday", zh: "生日", hi: "जन्मदिन", es: "Cumpleaños", ar: "عيد الميلاد", ru: "День рождения" },
  },
  { id: "urlaub", emoji: "🏖️", label: { de: "Urlaub", en: "Holiday", zh: "度假", hi: "छुट्टियाँ", es: "Vacaciones", ar: "العطلة", ru: "Отпуск" } },
];

/**
 * The views of a plan, each its own way of showing the same cards: Jetzt – Dann (the day's steps in their order on one
 * sheet, a marker on the one to do now – or, as a variant, that card in a „Jetzt“ field of its own), Erst – Dann
 * (pairs of two, up to four on a page), the week, and the Countdown (a moon for every night until a big day, H-41).
 */
export type PlanView = "day" | "first-then" | "week" | "countdown";

/** A view of a plan with what it shows, in one line for grown-ups. */
export interface PlanViewInfo {
  id: PlanView;
  emoji: string;
  label: Localized;
  hint: Localized;
}

export const PLAN_VIEWS: PlanViewInfo[] = [
  {
    id: "day",
    emoji: "👉",
    label: { de: "Jetzt – Dann", en: "Now – Next", zh: "现在 – 然后", hi: "अभी – फिर", es: "Ahora – Después", ar: "الآن – ثم", ru: "Сейчас – потом" },
    hint: {
      de: "Alle Schritte des Tages der Reihe nach auf einem Blatt – ein Pfeil zeigt, was jetzt dran ist",
      en: "All the day’s steps in order on one sheet – an arrow shows what’s next",
      zh: "一天的所有步骤按顺序排在一张纸上——箭头指出现在该做什么",
      hi: "दिन के सारे कदम क्रम से एक ही पन्ने पर – एक तीर दिखाता है कि अभी क्या करना है",
      es: "Todos los pasos del día en orden en una hoja: una flecha muestra lo que toca ahora",
      ar: "كل خطوات اليوم بالترتيب على ورقة واحدة – سهم يُظهر ما حان دوره الآن",
      ru: "Все шаги дня по порядку на одном листе – стрелка показывает, что сейчас",
    },
  },
  {
    id: "first-then",
    emoji: "➡️",
    label: { de: "Erst – Dann", en: "First – Then", zh: "先 – 然后", hi: "पहले – फिर", es: "Primero – Después", ar: "أولًا – ثم", ru: "Сначала – потом" },
    hint: {
      de: "Paare aus zwei Karten: erst das eine, dann das Schöne – bis zu vier auf einer Seite",
      en: "Pairs of two cards: first one thing, then the nice one – up to four on a page",
      zh: "两张卡片一组：先做一件事，再做喜欢的事——一页最多四组",
      hi: "दो कार्ड की जोड़ियाँ: पहले एक काम, फिर मज़े वाला – एक पेज पर चार तक",
      es: "Parejas de dos tarjetas: primero una cosa y luego la bonita, hasta cuatro por página",
      ar: "أزواج من بطاقتين: أولًا شيء، ثم الشيء الممتع – حتى أربعة في الصفحة",
      ru: "Пары из двух карточек: сначала одно, потом приятное – до четырёх на странице",
    },
  },
  {
    id: "week",
    emoji: "📅",
    label: { de: "Woche", en: "Week", zh: "周", hi: "हफ़्ता", es: "Semana", ar: "أسبوع", ru: "Неделя" },
    hint: {
      de: "Was an welchem Tag ist – und wie oft noch schlafen",
      en: "What happens on which day – and how many sleeps to go",
      zh: "哪天做什么——还要睡几觉",
      hi: "किस दिन क्या है – और कितनी बार सोना बाकी है",
      es: "Qué hay cada día y cuántas noches faltan",
      ar: "ماذا في كل يوم – وكم نومة باقية",
      ru: "Что в какой день – и сколько раз ещё спать",
    },
  },
  {
    id: "countdown",
    emoji: "🌙",
    label: { de: "Countdown", en: "Countdown", zh: "倒数", hi: "उलटी गिनती", es: "Cuenta atrás", ar: "العدّ التنازلي", ru: "Обратный отсчёт" },
    hint: {
      de: "Wie oft noch schlafen bis zum großen Tag – ein Mond für jede Nacht",
      en: "How many sleeps until the big day – a moon for every night",
      zh: "离大日子还要睡几觉——每晚一个月亮",
      hi: "बड़े दिन तक और कितनी बार सोना है – हर रात के लिए एक चाँद",
      es: "Cuántas noches faltan para el gran día: una luna por cada noche",
      ar: "كم نومة باقية حتى اليوم الكبير – قمر لكل ليلة",
      ru: "Сколько ещё спать до большого дня – по луне на каждую ночь",
    },
  },
];

/** How the child follows a Jetzt – Dann plan (`Plan.nowField`), chosen beside its picture on the wizard's first step. */
export interface NowWay {
  /** The card to do moves into a „Jetzt“ field, rather than a marker moving over cards that stay. */
  field: boolean;
  emoji: string;
  label: Localized;
  /** What it costs to print, in a few words inside its button in the wizard (`🖨️` or `✂️` before it). */
  print: Localized;
  /** What it means for the paper at home, in a line or two for grown-ups (under Gestalten). */
  note: Localized;
}

/** The marker first: one printed sheet and something to move is far less work than cards to cut out and move. */
export const NOW_WAYS: NowWay[] = [
  {
    field: false,
    emoji: "⬆️",
    label: {
      de: "Pfeil wandert",
      en: "Arrow moves",
      zh: "箭头移动",
      hi: "तीर आगे बढ़ता है",
      es: "Se mueve la flecha",
      ar: "السهم يتحرّك",
      ru: "Двигается стрелка",
    },
    print: {
      de: "Nur eine Seite drucken",
      en: "Print just one page",
      zh: "只打印一页",
      hi: "सिर्फ़ एक पेज प्रिंट करें",
      es: "Imprimir solo una página",
      ar: "طباعة صفحة واحدة فقط",
      ru: "Печать одной страницы",
    },
    note: {
      de: "Alle Karten stehen fest auf einem Blatt. Ein Pfeil aus Pappe, eine Wäscheklammer oder ein bunter Klebezettel zeigt, was gerade dran ist – Ihr Kind schiebt ihn weiter. Nichts zum Ausschneiden.",
      en: "All cards stay fixed on one sheet. A cardboard arrow, a clothes peg or a bright sticky note shows what’s next – your child moves it along. Nothing to cut out.",
      zh: "所有卡片都固定在一张纸上。用纸板箭头、晾衣夹或彩色便利贴指出现在该做什么——孩子自己把它往前移。不用剪任何东西。",
      hi: "सारे कार्ड एक ही पन्ने पर टिके रहते हैं। गत्ते का तीर, कपड़े की चिमटी या रंगीन चिपकने वाली पर्ची दिखाती है कि अभी क्या करना है – बच्चे उसे आगे खिसकाते हैं। कुछ भी काटना नहीं है।",
      es: "Todas las tarjetas quedan fijas en una hoja. Una flecha de cartón, una pinza de la ropa o una nota adhesiva de color muestra lo que toca ahora, y su peque la va moviendo. No hay nada que recortar.",
      ar: "تبقى كل البطاقات ثابتة على ورقة واحدة. سهم من الكرتون أو ملقط غسيل أو ورقة لاصقة ملونة يُظهر ما حان دوره – ويحرّكه طفلكم إلى الأمام. لا شيء للقص.",
      ru: "Все карточки закреплены на одном листе. Стрелка из картона, прищепка или яркий стикер показывает, что сейчас, – ребёнок передвигает её дальше. Ничего не нужно вырезать.",
    },
  },
  {
    field: true,
    emoji: "🃏",
    label: {
      de: "Karte wandert",
      en: "Card moves",
      zh: "卡片移动",
      hi: "कार्ड आगे बढ़ता है",
      es: "Se mueve la tarjeta",
      ar: "البطاقة تتحرّك",
      ru: "Двигается карточка",
    },
    print: {
      de: "Karten auch drucken und ausschneiden",
      en: "Also print and cut out cards",
      zh: "另外打印并剪下卡片",
      hi: "कार्ड भी प्रिंट करके काटें",
      es: "Imprimir y recortar también las tarjetas",
      ar: "طباعة البطاقات وقصّها أيضًا",
      ru: "Ещё напечатать и вырезать карточки",
    },
    note: {
      de: "Mehr Bastelarbeit: Die Karten werden extra gedruckt, ausgeschnitten und mit Klett aufgeklebt. Die Karte, die dran ist, kommt ins Jetzt-Feld, fertige in eine Tasche – dafür hat Ihr Kind sie selbst in der Hand.",
      en: "More crafting: the cards are printed separately, cut out and stuck on with Velcro. The card that’s up goes into the Now field, finished ones into a pocket – and your child holds them in their own hands.",
      zh: "手工更多：卡片要另外打印、剪下，再用魔术贴贴上。轮到的卡片放进“现在”格，做完的放进袋子里——这样孩子能亲手拿着它们。",
      hi: "ज़्यादा कारीगरी: कार्ड अलग से प्रिंट होते हैं, काटे जाते हैं और वेल्क्रो से चिपकाए जाते हैं। जिस कार्ड की बारी है वह “अभी” वाले खाने में जाता है, पूरे हुए एक जेब में – इसके बदले कार्ड बच्चे के अपने हाथ में होते हैं।",
      es: "Más manualidades: las tarjetas se imprimen aparte, se recortan y se pegan con velcro. La tarjeta que toca va al recuadro «Ahora», y las hechas, a una bolsita; a cambio, su peque las tiene en la mano.",
      ar: "عمل يدوي أكثر: تُطبع البطاقات منفصلة وتُقص وتُثبَّت بالفيلكرو. البطاقة التي حان دورها توضع في خانة «الآن»، والمنجزة في جيب – وفي المقابل يمسكها طفلكم بيده.",
      ru: "Больше рукоделия: карточки печатаются отдельно, вырезаются и крепятся на липучки. Текущая карточка идёт в поле «Сейчас», выполненные – в кармашек; зато ребёнок держит их в руках сам.",
    },
  },
];

/** A part of a plan's day, with its own row on the page: Mein Morgen and Mein Abend on one sheet. */
export interface PlanTemplatePart {
  /** The time of day of the part: its heading, and the brushing that ticks its teeth card. */
  slot: Slot;
  /** Catalogue ids in their order. */
  steps: string[];
}

/** A ready-made plan: catalogue ids per weekday (Monday first), one list for every day, or the parts of a day. */
export interface PlanTemplate {
  id: string;
  emoji: string;
  label: Localized;
  view: PlanView;
  /** One list for every day, or seven (Monday first); left out where the day comes in `parts`. */
  days?: string[] | string[][];
  /** The day in parts, the same every day: Morgen and Abend on one page, as nobody wants the one without the other. */
  parts?: PlanTemplatePart[];
  /** The time of day a linked step belongs to: a morning routine's brushing is the morning one. */
  slots?: Record<string, Slot>;
  theme: string;
  title?: Localized;
  /** One line for grown-ups under its picture. */
  hint: Localized;
}

/** The parts of the day that belong together on one page: the morning and the evening routine. */
const MORNING_AND_EVENING: PlanTemplatePart[] = [
  { slot: "morning", steps: ["anziehen", "fruehstueck", "zaehne"] },
  { slot: "evening", steps: ["zaehne", "vorlesen", "schlafen"] },
];

/** The gallery of the Zeitplan in the order of its views; the first is the plan whose pictures the wizard shows first. */
export const PLAN_TEMPLATES: PlanTemplate[] = [
  {
    id: "mein-tag",
    emoji: "🌅",
    label: { de: "Mein Tag", en: "My day", zh: "我的一天", hi: "मेरा दिन", es: "Mi día", ar: "يومي", ru: "Мой день" },
    view: "day",
    parts: MORNING_AND_EVENING,
    theme: "sonne",
    title: { de: "Mein Tag", en: "My day", zh: "我的一天", hi: "मेरा दिन", es: "Mi día", ar: "يومي", ru: "Мой день" },
    hint: {
      de: "Mein Morgen und mein Abend auf einer Seite",
      en: "My morning and my evening on one page",
      zh: "我的早上和晚上在一页上",
      hi: "मेरी सुबह और मेरी शाम एक ही पेज पर",
      es: "Mi mañana y mi noche en una página",
      ar: "صباحي ومسائي في صفحة واحدة",
      ru: "Моё утро и мой вечер на одной странице",
    },
  },
  {
    // H-58: the same day with its rituals – brave sentences in the morning, telling about the day after Kita or school,
    // good-night sentences in bed, „Wie geht's dir?“ in the morning and the evening (C-33); each card opens its words
    // for the grown-up, or its game (rituals.ts).
    id: "rituale",
    emoji: "💛",
    label: { de: "Mein Tag mit Ritualen" },
    view: "day",
    parts: [
      // At most MAX_STEPS in all: the rituals take the places of breakfast, the book and the bed (Gute-Nacht-Sätze are said in it).
      { slot: "morning", steps: ["anziehen", "zaehne", "wiegehts", "mutmachen"] },
      { slot: "evening", steps: ["erzaehlen", "zaehne", "wiegehts", "gutenacht"] },
    ],
    theme: "meer",
    title: { de: "Mein Tag" },
    hint: { de: "Mit Mutmach-Sätzen, „Wie geht's dir?“, Erzählen nach der Kita und Gute-Nacht-Sätzen – die Worte stehen auf der Karte" },
  },
  {
    id: "erst-dann",
    emoji: "➡️",
    label: { de: "Erst – Dann", en: "First – Then", zh: "先 – 然后", hi: "पहले – फिर", es: "Primero – Después", ar: "أولًا – ثم", ru: "Сначала – потом" },
    view: "first-then",
    days: ["schuhe", "spielplatz", "zaehne", "vorlesen", "anziehen", "draussen", "aufraeumen", "spielen"],
    theme: "wiese",
    title: { de: "Erst – Dann", en: "First – Then", zh: "先 – 然后", hi: "पहले – फिर", es: "Primero – Después", ar: "أولًا – ثم", ru: "Сначала – потом" },
    hint: {
      de: "Vier Paare auf einer Seite: erst das eine, dann das Schöne",
      en: "Four pairs on one page: first one thing, then the nice one",
      zh: "一页四组：先做一件事，再做喜欢的事",
      hi: "एक पेज पर चार जोड़ियाँ: पहले एक काम, फिर मज़े वाला",
      es: "Cuatro parejas en una página: primero una cosa y luego la bonita",
      ar: "أربعة أزواج في صفحة واحدة: أولًا شيء، ثم الشيء الممتع",
      ru: "Четыре пары на одной странице: сначала одно, потом приятное",
    },
  },
  {
    id: "wochenplan",
    emoji: "📅",
    label: { de: "Wochenplan", en: "Week plan", zh: "一周计划", hi: "हफ़्ते की योजना", es: "Plan semanal", ar: "خطة الأسبوع", ru: "План на неделю" },
    view: "week",
    days: [
      ["kita", "turnen"],
      ["kita", "oma"],
      ["kita", "schwimmen"],
      ["kita", "musik"],
      ["kita", "freunde"],
      ["einkaufen", "ausflug"],
      ["oma", "spielplatz"],
    ],
    theme: "beere",
    title: { de: "Meine Woche", en: "My week", zh: "我的一周", hi: "मेरा हफ़्ता", es: "Mi semana", ar: "أسبوعي", ru: "Моя неделя" },
    hint: {
      de: "Was ist wann? Kita, Oma, Schwimmen – und noch wie oft schlafen",
      en: "What’s when? Daycare, Grandma, swimming – and how many sleeps to go",
      zh: "什么时候做什么？幼儿园、奶奶、游泳——还要睡几觉",
      hi: "कब क्या है? प्लेस्कूल, दादी, तैराकी – और कितनी बार सोना बाकी",
      es: "¿Qué toca y cuándo? Guardería, abuela, natación… y cuántas noches faltan",
      ar: "ماذا ومتى؟ الحضانة، الجدّة، السباحة – وكم نومة باقية",
      ru: "Что когда? Садик, бабушка, бассейн – и сколько раз ещё спать",
    },
  },
  {
    id: "countdown",
    emoji: "🌙",
    label: {
      de: "Wie oft noch schlafen?",
      en: "How many more sleeps?",
      zh: "还要睡几觉？",
      hi: "और कितनी बार सोना है?",
      es: "¿Cuántas noches faltan?",
      ar: "كم نومة باقية؟",
      ru: "Сколько ещё спать?",
    },
    view: "countdown",
    days: ["geburtstag"],
    theme: "nacht",
    title: {
      de: "Wie oft noch schlafen?",
      en: "How many more sleeps?",
      zh: "还要睡几觉？",
      hi: "और कितनी बार सोना है?",
      es: "¿Cuántas noches faltan?",
      ar: "كم نومة باقية؟",
      ru: "Сколько ещё спать?",
    },
    hint: {
      de: "Ein Mond für jede Nacht bis zum Geburtstag, zum Urlaub oder bis Oma kommt",
      en: "A moon for every night until the birthday, the holiday or Grandma’s visit",
      zh: "每晚一个月亮，直到生日、度假或奶奶来",
      hi: "जन्मदिन, छुट्टियों या दादी के आने तक हर रात के लिए एक चाँद",
      es: "Una luna por cada noche hasta el cumpleaños, las vacaciones o la visita de la abuela",
      ar: "قمر لكل ليلة حتى عيد الميلاد أو العطلة أو قدوم الجدّة",
      ru: "По луне на каждую ночь до дня рождения, отпуска или приезда бабушки",
    },
  },
];

export const TASK_BY_ID = new Map(TASKS.map((t) => [t.id, t]));
/** Tasks, activities and rituals: everything a plan's step can come from. */
export const STEP_BY_ID = new Map([...ACTIVITIES, ...RITUALS, ...TASKS].map((t) => [t.id, t]));
export const REWARD_BY_ID = new Map(REWARDS.map((r) => [r.id, r]));
export const MARK_BY_ID = new Map(MARKS.map((m) => [m.id, m]));
export const THEME_BY_ID = new Map(THEMES.map((t) => [t.id, t]));
