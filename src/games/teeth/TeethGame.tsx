import { useEffect } from "react";
import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { useAppLanguage, useT } from "@/lib/language";
import { preloadSong, SUNG_LANGUAGES } from "./music";
import { DEFAULT_TEETH_SETTINGS, type TeethSettings, TEETH_SETTINGS_KEY } from "./settings";
import { KAI } from "./steps";
import { sungLanguageFor } from "./sung";
import { TeethPlay } from "./TeethPlay";

/** What is shown before the brushing, as one choice: the sweets story, the sink, both or neither. */
type Before = "both" | "origin" | "prep" | "none";

const BEFORE: Record<Before, Pick<TeethSettings, "origin" | "prep">> = {
  both: { origin: true, prep: true },
  origin: { origin: true, prep: false },
  prep: { origin: false, prep: true },
  none: { origin: false, prep: false },
};

const beforeOf = ({ origin, prep }: TeethSettings): Before => (origin ? (prep ? "both" : "origin") : prep ? "prep" : "none");

export function TeethGame() {
  const [settings, update] = useGameSettings(TEETH_SETTINGS_KEY, DEFAULT_TEETH_SETTINGS);
  const { touchOnly } = useDevice();
  const t = useT();
  const language = useAppLanguage();
  // The song loads from the moment the game is chosen, while the grown-up looks at this screen and the story plays.
  useEffect(() => preloadSong(sungLanguageFor(language.id, SUNG_LANGUAGES)), [language.id]);

  return (
    <GameShell
      title={t({ de: "Zähne putzen", en: "Brushing Teeth", zh: "刷牙", hi: "दाँत साफ़ करना", es: "Lavarse los dientes", ar: "تنظيف الأسنان", ru: "Чистим зубы" })}
      emoji="🦷"
      info={
        <>
          <p>
            {t({
              de: `Gerät hinstellen und los: Niemand muss tippen. Geputzt wird in sieben Schritten nach KAI (${KAI.de}). Das Bild zeigt jedes Mal, ob der Mund weit auf ist oder die Zähne zusammen sind (Pfeile an den Lippen zeigen, wann er auf- oder zugeht) und welche Zähne gerade dran sind. Auf allen noch nicht geputzten Zähnen sitzen Zuckermonster, die beim Putzen nach und nach verschwinden. Der Bildschirm bleibt dabei an.`,
              en: `Set the device down and go: nobody has to tap. Brushing goes in seven steps in this order: ${t(KAI)}. Each time the picture shows whether the mouth is wide open or the teeth are together (arrows on the lips show when it opens or closes) and which teeth are next. Sugar monsters sit on every tooth not brushed yet and disappear one by one while brushing. The screen stays on the whole time.`,
              zh: `把设备放好就开始：不需要点任何东西。刷牙分七步，顺序是：${t(KAI)}。画面每次都会显示嘴巴是张大还是牙齿咬合（嘴唇上的箭头提示什么时候张嘴或合上），以及现在该刷哪些牙。还没刷的牙齿上都趴着糖怪兽，刷牙时它们会一个个消失。期间屏幕一直亮着。`,
              hi: `डिवाइस रख दीजिए और शुरू: किसी को टैप नहीं करना है। सात चरणों में इस क्रम से ब्रश होता है: ${t(KAI)}। तस्वीर हर बार दिखाती है कि मुँह पूरा खुला है या दाँत मिले हुए हैं (होंठों पर तीर दिखाते हैं कि मुँह कब खोलना या बंद करना है) और अभी कौन-से दाँत साफ़ करने हैं। जो दाँत अभी साफ़ नहीं हुए, उन सब पर चीनी-मॉन्स्टर बैठे हैं, जो ब्रश करते-करते एक-एक करके ग़ायब हो जाते हैं। इस दौरान स्क्रीन चालू रहती है।`,
              es: `Coloque el dispositivo y listo: nadie tiene que tocar nada. Se cepilla en siete pasos en este orden: ${t(KAI)}. La imagen muestra cada vez si la boca está bien abierta o los dientes juntos (las flechas en los labios indican cuándo abrir o cerrar) y qué dientes tocan ahora. En todos los dientes aún sin cepillar hay monstruos de azúcar, que desaparecen uno a uno al cepillar. La pantalla se mantiene encendida.`,
              ar: `ضعوا الجهاز وابدؤوا: لا حاجة للمس أي شيء. يتم التنظيف في سبع خطوات بهذا الترتيب: ${t(KAI)}. تُظهر الصورة في كل مرة هل الفم مفتوح واسعًا أم الأسنان مُطبقة (الأسهم عند الشفتين تُبيّن متى يُفتح الفم أو يُغلق)، وأي الأسنان دورها الآن. على كل الأسنان التي لم تُنظَّف بعد تجلس وحوش السكر، وتختفي واحدًا تلو الآخر أثناء التنظيف. وتبقى الشاشة مضاءة طوال الوقت.`,
              ru: `Поставьте устройство — и вперёд: нажимать ничего не нужно. Чистим в семь шагов по порядку: ${t(KAI)}. Картинка каждый раз показывает, широко ли открыт рот или зубки сомкнуты (стрелки у губ показывают, когда открыть или закрыть рот), и какие зубы чистить сейчас. На всех ещё не почищенных зубах сидят сахарные монстры, они по очереди исчезают при чистке. Экран при этом не гаснет.`,
            })}
          </p>
          <p>
            {t({
              de: "Bis 14 Uhr ist morgens: Die Sonne geht auf und am Kinn kleben Frühstückskrümel. Danach ist abends: Der Mond scheint, der Ärmel ist ein Schlafanzug und zum Schluss heißt es „Gute Nacht“.",
              en: "Until 2 p.m. it is morning: the sun rises and breakfast crumbs stick to the chin. After that it is evening: the moon shines, the sleeve is a pajama, and at the end it says “Good night”.",
              zh: "下午两点前是早上：太阳升起，下巴上粘着早餐的碎屑。之后是晚上：月亮出来了，袖子是睡衣，最后会说“晚安”。",
              hi: "दोपहर 2 बजे तक सुबह है: सूरज उगता है और ठोड़ी पर नाश्ते के टुकड़े चिपके होते हैं। उसके बाद शाम है: चाँद चमकता है, आस्तीन पजामे की है और आख़िर में “शुभ रात्रि” कहा जाता है।",
              es: "Hasta las 14:00 es por la mañana: sale el sol y hay migas del desayuno en la barbilla. Después es por la noche: brilla la luna, la manga es de pijama y al final se dice «Buenas noches».",
              ar: "حتى الساعة 14:00 يكون الصباح: تشرق الشمس وتلتصق فتات الفطور بالذقن. بعد ذلك يكون المساء: يضيء القمر، والكُمّ كُمّ بيجامة، وفي النهاية يُقال «ليلة سعيدة».",
              ru: "До 14:00 — утро: встаёт солнышко, а на подбородке крошки от завтрака. Потом — вечер: светит луна, рукав — это пижама, а в конце звучит «Спокойной ночи».",
            })}
          </p>
          <p>
            {t({
              de: "Zahnärzte empfehlen: zweimal täglich Zahnpasta mit Fluorid (1000 ppm), unter 2 Jahren reiskorngroß, ab 2 Jahren erbsengroß. Danach ausspucken, nicht nachspülen. Bis ins Grundschulalter putzen Eltern nach.",
              en: "Dentists recommend: fluoride toothpaste (1000 ppm) twice a day, a rice-grain-sized smear under 2 years, pea-sized from 2 years. Then spit it out, don't rinse. Until primary school age, parents brush again afterwards.",
              zh: "牙医建议：每天两次使用含氟牙膏（1000 ppm），2岁以下米粒大小，2岁起豌豆大小。刷完吐掉，不要用水漱口。直到上小学，家长都要再帮孩子刷一遍。",
              hi: "दाँतों के डॉक्टर सलाह देते हैं: दिन में दो बार फ़्लोराइड वाला टूथपेस्ट (1000 ppm), 2 साल से कम उम्र में चावल के दाने जितना, 2 साल से मटर के दाने जितना। फिर थूक दें, पानी से कुल्ला न करें। प्राथमिक स्कूल की उम्र तक माता-पिता बाद में दोबारा ब्रश करें।",
              es: "Los dentistas recomiendan: pasta con flúor (1000 ppm) dos veces al día, del tamaño de un grano de arroz antes de los 2 años y de un guisante a partir de los 2. Después escupir, sin enjuagar. Hasta la edad escolar, los padres repasan el cepillado.",
              ar: "ينصح أطباء الأسنان: معجون بالفلورايد (1000 ppm) مرتين يوميًّا، بحجم حبة الأرز تحت سن السنتين، وبحجم حبة البازلاء من سن السنتين. ثم البصق دون المضمضة بالماء. وحتى سن المدرسة الابتدائية يعيد الأهل تنظيف أسنان الطفل بعده.",
              ru: "Стоматологи советуют: дважды в день паста со фтором (1000 ppm), до 2 лет — с рисовое зёрнышко, с 2 лет — с горошину. Потом сплюнуть, не полоскать. До младшей школы родители дочищают зубы за ребёнком.",
            })}
          </p>
          <p>
            {t({
              de: "Unten neben dem Fortschrittsbalken pausiert ⏸️ das Putzen. Tippen oder Ziehen auf dem Balken springt an diese Stelle.",
              en: "At the bottom, next to the progress bar, ⏸️ pauses the brushing. Tapping or dragging on the bar jumps to that point.",
              zh: "下方进度条旁的 ⏸️ 可暂停刷牙。点按或拖动进度条可跳到该位置。",
              hi: "नीचे प्रोग्रेस बार के पास ⏸️ ब्रश करना रोकता है। बार पर टैप करने या खींचने से उसी जगह पहुँच जाते हैं।",
              es: "Abajo, junto a la barra de progreso, ⏸️ pausa el cepillado. Tocar o arrastrar sobre la barra salta a ese punto.",
              ar: "في الأسفل بجانب شريط التقدّم يوقف ⏸️ التنظيف مؤقتًا. اللمس أو السحب على الشريط ينقل إلى ذلك الموضع.",
              ru: "Внизу рядом с полосой прогресса кнопка ⏸️ ставит чистку на паузу. Нажатие или перетаскивание по полосе переносит в это место.",
            })}
            {!touchOnly && (
              <>
                {" "}
                {t({
                  de: "Mit Tastatur:",
                  en: "With a keyboard:",
                  zh: "用键盘：",
                  hi: "कीबोर्ड से:",
                  es: "Con teclado:",
                  ar: "بلوحة المفاتيح:",
                  ru: "С клавиатуры:",
                })}{" "}
                <kbd>←</kbd> <kbd>→</kbd>{" "}
                {t({
                  de: "springen zum vorigen oder nächsten Schritt, die",
                  en: "jump to the previous or next step,",
                  zh: "跳到上一步或下一步，",
                  hi: "पिछले या अगले चरण पर जाते हैं,",
                  es: "saltan al paso anterior o siguiente,",
                  ar: "للانتقال إلى الخطوة السابقة أو التالية،",
                  ru: "— к предыдущему или следующему шагу,",
                })}{" "}
                <kbd>{t({ de: "Leertaste", en: "Space", zh: "空格键", hi: "स्पेस", es: "barra espaciadora", ar: "مفتاح المسافة", ru: "Пробел" })}</kbd>{" "}
                {t({ de: "pausiert.", en: "pauses.", zh: "暂停。", hi: "रोकता है।", es: "pausa.", ar: "للإيقاف المؤقت.", ru: "— пауза." })}
              </>
            )}
          </p>
        </>
      }
      settings={
        <SettingsGroup title={t({ de: "Putzen", en: "Brushing", zh: "刷牙", hi: "ब्रश करना", es: "Cepillado", ar: "التنظيف", ru: "Чистка" })}>
          <Choice<Before>
            label={t({ de: "Vorher zeigen", en: "Show first", zh: "先播放", hi: "पहले दिखाएँ", es: "Mostrar antes", ar: "اعرضوا أولًا", ru: "Сначала показать" })}
            value={beforeOf(settings)}
            options={[
              {
                value: "both",
                label: t({
                  de: "🍬 + 🪥 Beides",
                  en: "🍬 + 🪥 Both",
                  zh: "🍬 + 🪥 都要",
                  hi: "🍬 + 🪥 दोनों",
                  es: "🍬 + 🪥 Las dos cosas",
                  ar: "🍬 + 🪥 كلاهما",
                  ru: "🍬 + 🪥 Всё вместе",
                }),
              },
              {
                value: "origin",
                label: t({
                  de: "🍬 Zuckermonster",
                  en: "🍬 Sugar monsters",
                  zh: "🍬 糖怪兽",
                  hi: "🍬 चीनी-मॉन्स्टर",
                  es: "🍬 Monstruos de azúcar",
                  ar: "🍬 وحوش السكر",
                  ru: "🍬 Сахарные монстры",
                }),
              },
              {
                value: "prep",
                label: t({
                  de: "🪥 Zahnpasta",
                  en: "🪥 Toothpaste",
                  zh: "🪥 牙膏",
                  hi: "🪥 टूथपेस्ट",
                  es: "🪥 Pasta de dientes",
                  ar: "🪥 معجون الأسنان",
                  ru: "🪥 Зубная паста",
                }),
              },
              {
                value: "none",
                label: t({
                  de: "⏩ Gleich putzen",
                  en: "⏩ Brush right away",
                  zh: "⏩ 直接刷牙",
                  hi: "⏩ सीधे ब्रश करें",
                  es: "⏩ Cepillar enseguida",
                  ar: "⏩ التنظيف فورًا",
                  ru: "⏩ Сразу чистить",
                }),
              },
            ]}
            onChange={(before) => update(BEFORE[before])}
          />
          <p className="setting-note">
            {t({
              de: "🍬 Wie Süßes zu Zuckermonstern wird. 🪥 Zahnbürste holen, Zahnpasta drauf.",
              en: "🍬 How sweets turn into sugar monsters. 🪥 Get the toothbrush, put toothpaste on.",
              zh: "🍬 甜食怎样变成糖怪兽。🪥 拿牙刷，挤牙膏。",
              hi: "🍬 मीठा कैसे चीनी-मॉन्स्टर बन जाता है। 🪥 टूथब्रश लेना, उस पर टूथपेस्ट लगाना।",
              es: "🍬 Cómo los dulces se convierten en monstruos de azúcar. 🪥 Tomar el cepillo y ponerle pasta.",
              ar: "🍬 كيف تتحوّل الحلوى إلى وحوش السكر. 🪥 إحضار فرشاة الأسنان ووضع المعجون عليها.",
              ru: "🍬 Как сладкое превращается в сахарных монстров. 🪥 Достаём щётку, выдавливаем пасту.",
            })}
          </p>
          <Toggle
            label={t({
              de: "⭐ Wochenbild: ein Stern für jedes Putzen",
              en: "⭐ Week chart: a star for every brushing",
              zh: "⭐ 每周星星：每刷一次得一颗星",
              hi: "⭐ हफ़्ते का चार्ट: हर ब्रश पर एक तारा",
              es: "⭐ Semana: una estrella por cada cepillado",
              ar: "⭐ لوحة الأسبوع: نجمة لكل تنظيف",
              ru: "⭐ Неделя: звёздочка за каждую чистку",
            })}
            checked={settings.week}
            onChange={(week) => update({ week })}
          />
          <p className="setting-note">
            {t({
              de: "🎵 Das Zahnputzlied singt zu jedem Schritt, was dran ist, in der Sprache der App (🌐 auf der Startseite). Das Putzen dauert so lange wie das Lied, gut 2 Minuten. Es spielt immer, auch wenn die Musik aus ist.",
              en: "🎵 The toothbrushing song sings what comes next at every step, in the app's language (🌐 on the home page). Brushing lasts as long as the song, a little over 2 minutes. It always plays, even when music is off.",
              zh: "🎵 刷牙歌在每一步唱出该刷哪里，用的是应用的语言（首页的 🌐）。刷牙和歌一样长，两分多钟。即使关了音乐，它也会播放。",
              hi: "🎵 ब्रश वाला गाना हर चरण पर गाता है कि अब क्या करना है, ऐप की भाषा में (मुख्य पेज पर 🌐)। ब्रश उतनी देर चलता है जितना गाना, 2 मिनट से थोड़ा ज़्यादा। संगीत बंद होने पर भी यह हमेशा बजता है।",
              es: "🎵 La canción del cepillado canta en cada paso lo que toca, en el idioma de la app (🌐 en la página de inicio). El cepillado dura lo que la canción, algo más de 2 minutos. Suena siempre, aunque la música esté apagada.",
              ar: "🎵 أغنية تنظيف الأسنان تغنّي في كل خطوة ما هو دوره الآن، بلغة التطبيق (🌐 في الصفحة الرئيسية). يدوم التنظيف بقدر الأغنية، أكثر من دقيقتين بقليل. وتُعزف دائمًا، حتى عندما تكون الموسيقى مطفأة.",
              ru: "🎵 Песенка на каждом шаге поёт, что сейчас чистим, на языке приложения (🌐 на главной странице). Чистка длится столько же, сколько песенка, — чуть больше 2 минут. Она звучит всегда, даже когда музыка выключена.",
            })}
          </p>
        </SettingsGroup>
      }
    >
      <TeethPlay settings={settings} />
    </GameShell>
  );
}
