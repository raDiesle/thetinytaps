import { useMemo } from "react";
import { GameShell } from "@/components/GameShell";
import { type TargetLanguageId, targetLanguageFor } from "@/content/targetLanguages";
import { useCommonSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { useAppLanguage, useT } from "@/lib/language";
import { useStoredSettings } from "@/lib/storage";
import { AdventurePlay } from "./AdventurePlay";
import { ADVENTURE_SETTINGS_KEY, type AdventureStoryId, DEFAULT_ADVENTURE_SETTINGS } from "./settings";
import { CLOUD_TRIP } from "./stories/cloudTrip";
import { type Story, storyIn, storyTitle } from "./stories/story";
import { TREASURE_ISLAND } from "./stories/treasureIsland";

/** The stories on the start screen, each a card. */
const STORIES: { id: AdventureStoryId; emoji: string; story: Story }[] = [
  { id: "schatzinsel", emoji: "🏝️", story: TREASURE_ISLAND },
  { id: "wolkenreise", emoji: "☁️", story: CLOUD_TRIP },
];

/** The start screen: no options of its own, read aloud, sounds, music and Tapsi's language come from the home page. */
export function AdventureGame() {
  const [settings, update] = useStoredSettings(ADVENTURE_SETTINGS_KEY, DEFAULT_ADVENTURE_SETTINGS);
  const [common] = useCommonSettings();
  const { touchOnly } = useDevice();
  const t = useT();
  const app = useAppLanguage();
  const at = Math.max(
    0,
    STORIES.findIndex((s) => s.id === settings.story),
  );
  const chosen = STORIES[at].story;
  // „Weiter“ at the end: the next story on the start screen, after the last the first.
  const next = STORIES[(at + 1) % STORIES.length];
  // The app language, like every game. A story not told in it yet is said in English,
  // or else German – never German words with a Russian voice.
  const told = (id: string) => id === "de" || Boolean(chosen.translations?.[id as TargetLanguageId]);
  const language = targetLanguageFor(told(app.id) ? app.id : told("en") ? "en" : "de");
  // Built once per story and language: the game starts anew when the story changes.
  const story = useMemo(() => storyIn(chosen, language.id), [chosen, language.id]);

  return (
    <GameShell
      title={t({
        de: "Bewegungsabenteuer",
        en: "Movement Adventures",
        zh: "运动大冒险",
        hi: "हलचल वाले रोमांच",
        es: "Aventuras en movimiento",
        ar: "مغامرات الحركة",
        ru: "Приключения в движении",
      })}
      emoji="🏝️"
      modes={STORIES.map((s) => ({ id: s.id, emoji: s.emoji, title: storyTitle(s.story, app.id) }))}
      mode={settings.story}
      onMode={(id) => update({ story: id as AdventureStoryId })}
      info={
        <>
          <p>
            {t({
              de: "Der kleine Fuchs Tapsi zeigt jede Bewegung vor, und das Kind macht sie vor dem Bildschirm mit. Die Welt reagiert von selbst im Takt der Bewegung – es gibt keine Kamera und kein „falsch“.",
              en: "Tapsi the little fox shows every movement, and the child does it along in front of the screen. The world answers by itself in time with the movement – there is no camera and no “wrong”.",
              zh: "小狐狸塔普西示范每个动作，孩子在屏幕前跟着做。世界会随着动作的节奏自己做出反应——没有摄像头，也没有“做错”。",
              hi: "छोटा लोमड़ी टैप्सी हर हरकत करके दिखाता है, और बच्चा स्क्रीन के सामने साथ-साथ करता है। दुनिया अपने आप हरकत की लय में जवाब देती है – कोई कैमरा नहीं है और कुछ भी “ग़लत” नहीं होता।",
              es: "El zorrito Tapsi muestra cada movimiento y el niño o la niña lo hace delante de la pantalla. El mundo responde solo al ritmo del movimiento: no hay cámara ni nada «mal hecho».",
              ar: "الثعلب الصغير تابسي يُري كل حركة، والطفل يقوم بها معه أمام الشاشة. والعالم يستجيب وحده على إيقاع الحركة – لا توجد كاميرا، ولا يوجد «خطأ».",
              ru: "Маленький лисёнок Тапси показывает каждое движение, а ребёнок повторяет его перед экраном. Мир сам отвечает в такт движению – камеры нет, и «неправильно» не бывает.",
            })}
          </p>
          <p>
            {t({
              de: "🏝️ Die Schatzinsel: angeln, paddeln, über eine kleine Brücke hüpfen und mit dem Kopf an Sternkisten stoßen, sich unter einem schaukelnden Baumstamm ducken, trommeln, Kokosnüssen ausweichen, Spinnweben wegwedeln, die Truhe am Seil heranziehen und zum Schluss das Gold hochwerfen.",
              en: "🏝️ Treasure Island: fishing, paddling, hopping over a little bridge and bumping star boxes with the head, ducking under a swinging log, drumming, dodging coconuts, waving away cobwebs, pulling the chest in by the rope and at the end tossing the gold up high.",
              zh: "🏝️ 金银岛：钓鱼、划桨、跳过小桥并用头顶星星箱、在摆动的树干下弯腰、打鼓、躲椰子、拨开蜘蛛网、用绳子把宝箱拉过来，最后把金币高高抛起。",
              hi: "🏝️ ख़ज़ाने का द्वीप: मछली पकड़ना, चप्पू चलाना, छोटे पुल पर कूदना और सिर से तारों वाले बक्सों को छूना, झूलते लट्ठे के नीचे झुकना, ढोल बजाना, नारियलों से बचना, जाले हटाना, रस्सी से संदूक खींचना और आख़िर में सोना ऊपर उछालना।",
              es: "🏝️ La isla del tesoro: pescar, remar, saltar por un puentecito y dar con la cabeza a cajas de estrellas, agacharse bajo un tronco que se balancea, tocar el tambor, esquivar cocos, apartar telarañas, tirar del cofre con la cuerda y al final lanzar el oro al aire.",
              ar: "🏝️ جزيرة الكنز: صيد السمك، التجديف، القفز فوق جسر صغير ونطح صناديق النجوم بالرأس، الانحناء تحت جذع يتأرجح، قرع الطبول، تفادي جوز الهند، إزاحة خيوط العنكبوت، سحب الصندوق بالحبل، وفي النهاية رمي الذهب عاليًا.",
              ru: "🏝️ Остров сокровищ: ловить рыбу, грести, прыгать по мостику и стукаться головой о звёздные ящики, пригибаться под качающимся бревном, барабанить, уворачиваться от кокосов, смахивать паутину, подтягивать сундук за верёвку, а в конце подбрасывать золото.",
            })}
          </p>
          <p>
            {t({
              de: "☁️ Die Wolkenreise: Tapsi fliegt auf der kleinen Wolke Wolle in den Himmel – flattern wie ein Vogel, sich unter Spielzeugflugzeugen ducken, Luftballons antippen, im Sitzen in die Kurven lehnen und Sterne holen, die Regenwolke hochdrücken, bis die Sonne lacht, und mit den Armen einen Regenbogen malen.",
              en: "☁️ The Cloud Trip: Tapsi flies into the sky on the little cloud Woolly – flapping like a bird, ducking under toy planes, tapping balloons, leaning into the curves while sitting to catch stars, pushing the rain cloud up until the sun smiles, and painting a rainbow with the arms.",
              zh: "☁️ 云朵之旅：塔普西坐着小云朵棉棉飞上天空——像小鸟一样扇动翅膀、在玩具飞机下弯腰、碰气球、坐着顺着弯道倾斜去拿星星、把雨云往上推直到太阳露出笑脸，再用手臂画一道彩虹。",
              hi: "☁️ बादलों की सैर: टैप्सी छोटे बादल रुई पर बैठकर आसमान में उड़ता है – चिड़िया की तरह हाथ फड़फड़ाना, खिलौना हवाई जहाज़ों के नीचे झुकना, गुब्बारों को छूना, बैठे-बैठे मोड़ों पर झुककर तारे पकड़ना, बारिश के बादल को ऊपर धकेलना जब तक सूरज मुस्कुराए नहीं, और बाँहों से इंद्रधनुष बनाना।",
              es: "☁️ El viaje en nube: Tapsi vuela al cielo sobre la nubecita Pelusa: aletear como un pájaro, agacharse bajo aviones de juguete, tocar globos, inclinarse sentado en las curvas para atrapar estrellas, empujar la nube de lluvia hacia arriba hasta que sonríe el sol y pintar un arcoíris con los brazos.",
              ar: "☁️ رحلة الغيمة: يطير تابسي إلى السماء على الغيمة الصغيرة قطنة – الرفرفة مثل العصفور، الانحناء تحت طائرات الألعاب، لمس البالونات، الميل في المنعطفات جلوسًا لالتقاط النجوم، دفع غيمة المطر إلى الأعلى حتى تبتسم الشمس، ورسم قوس قزح بالذراعين.",
              ru: "☁️ Полёт на облачке: Тапси летит в небо на маленьком облачке Пушинке – махать руками, как птичка, пригибаться под игрушечными самолётиками, трогать воздушные шарики, сидя наклоняться в повороты и собирать звёзды, толкать дождевую тучу вверх, пока не засмеётся солнышко, и рисовать руками радугу.",
            })}
          </p>
          <p>
            {t({
              de: "Am Fuchs leuchtet, worauf es bei der Bewegung ankommt (z. B. nur die Arme an der Kurbel), und eine dunkle Figur mit leuchtendem Rand macht jede Bewegung groß mit.",
              en: "What matters in a movement glows on the fox (for example only the arms at the crank), and a dark figure with a glowing outline does every movement along, big.",
              zh: "狐狸身上会发光的是这个动作的关键部位（比如摇把手时只有手臂发光），一个带发光轮廓的深色人影也会大大地跟着做每个动作。",
              hi: "लोमड़ी पर वही हिस्सा चमकता है जो हरकत में ज़रूरी है (जैसे हैंडल घुमाते समय सिर्फ़ बाँहें), और चमकती किनारी वाली एक गहरी आकृति हर हरकत बड़े आकार में साथ करती है।",
              es: "En el zorro brilla lo que importa en cada movimiento (por ejemplo, solo los brazos en la manivela), y una figura oscura con borde luminoso hace cada movimiento en grande.",
              ar: "يتوهّج على الثعلب ما هو مهم في الحركة (مثلًا الذراعان فقط عند المِقبض)، وشخصية داكنة ذات حافة مضيئة تؤدّي كل حركة بحجم كبير.",
              ru: "У лисёнка светится то, что важно в движении (например, только руки, когда он крутит ручку), а тёмная фигура со светящимся контуром крупно повторяет каждое движение.",
            })}
          </p>
          <p>
            {t({
              de: "Am besten auf einem großen Bildschirm, mit etwas Platz um das Kind herum (Arme ausbreiten, ein Schritt zur Seite). Niemand muss tippen.",
              en: "Best on a big screen, with a little room around the child (to spread the arms, to step aside). Nobody has to tap.",
              zh: "最好在大屏幕上玩，孩子周围留一点空间（能张开双臂、往旁边迈一步）。不需要点任何东西。",
              hi: "बड़ी स्क्रीन पर सबसे अच्छा, बच्चे के आसपास थोड़ी जगह के साथ (बाँहें फैलाने, एक क़दम बगल में रखने के लिए)। किसी को टैप नहीं करना है।",
              es: "Mejor en una pantalla grande y con algo de espacio alrededor del niño o la niña (para abrir los brazos o dar un paso al lado). Nadie tiene que tocar nada.",
              ar: "الأفضل على شاشة كبيرة، مع بعض المساحة حول الطفل (لفتح الذراعين، وللخطو جانبًا). لا حاجة للمس أي شيء.",
              ru: "Лучше всего на большом экране и чтобы вокруг ребёнка было немного места (развести руки, шагнуть в сторону). Нажимать ничего не нужно.",
            })}
          </p>
          <p>
            {t({
              de: "Ob Tapsi spricht, Töne und Musik stellt ⚙️ auf der Startseite für alle Spiele ein, die Sprache 🌐.",
              en: "Whether Tapsi talks, sounds and music are set with ⚙️ on the home page for all games, the language with 🌐.",
              zh: "塔普西是否说话、声音和音乐，都在首页的 ⚙️ 里为所有游戏统一设置，语言用 🌐。",
              hi: "टैप्सी बोले या नहीं, आवाज़ें और संगीत मुख्य पेज पर ⚙️ से सभी खेलों के लिए तय होते हैं, भाषा 🌐 से।",
              es: "Si Tapsi habla, los sonidos y la música se ajustan con ⚙️ en la página de inicio para todos los juegos; el idioma, con 🌐.",
              ar: "هل يتكلم تابسي، والأصوات والموسيقى، كلها تُضبط من ⚙️ في الصفحة الرئيسية لجميع الألعاب، واللغة من 🌐.",
              ru: "Говорит ли Тапси, звуки и музыку настраивает ⚙️ на главной странице для всех игр, язык – 🌐.",
            })}
            {language.id !== app.id &&
              t({
                de: ` „${storyTitle(chosen, "de")}“ gibt es noch nicht auf ${app.label.split(" ")[1]}, Tapsi spricht dort ${language.label.split(" ")[1]}.`,
                en: ` “${storyTitle(chosen, "en")}” isn't in this language yet (${app.label.split(" ")[0]}), Tapsi speaks ${language.id === "en" ? "English" : "German"}.`,
                zh: ` “${storyTitle(chosen, "zh")}”还没有这种语言的版本（${app.label.split(" ")[0]}），塔普西说${language.id === "en" ? "英语" : "德语"}。`,
                hi: ` “${storyTitle(chosen, "hi")}” अभी इस भाषा (${app.label.split(" ")[0]}) में नहीं है, टैप्सी ${language.id === "en" ? "अंग्रेज़ी" : "जर्मन"} बोलता है।`,
                es: ` «${storyTitle(chosen, "es")}» todavía no está en este idioma (${app.label.split(" ")[0]}); Tapsi habla ${language.id === "en" ? "inglés" : "alemán"}.`,
                ar: ` «${storyTitle(chosen, "ar")}» غير متوفرة بهذه اللغة بعد (${app.label.split(" ")[0]})، ويتكلم تابسي ${language.id === "en" ? "الإنجليزية" : "الألمانية"}.`,
                // The language only by its flag, so its name needs no declining.
                ru: ` Для истории «${storyTitle(chosen, "ru")}» ещё нет перевода на этот язык (${app.label.split(" ")[0]}), Тапси говорит ${language.id === "en" ? "по-английски" : "по-немецки"}.`,
              })}
          </p>
          {!touchOnly && (
            <p>
              {t({
                de: "Oben links: pausieren und zur vorigen oder nächsten Bewegung springen; ein Bild unten springt zu dieser Bewegung. Mit Tastatur: ",
                en: "Top left: pause and jump to the previous or next movement; a picture at the bottom jumps to that movement. With a keyboard: ",
                zh: "左上角：暂停，或跳到上一个、下一个动作；点下方的图片会跳到那个动作。用键盘：",
                hi: "ऊपर बाईं ओर: रोकें और पिछली या अगली हरकत पर जाएँ; नीचे की कोई तस्वीर उसी हरकत पर ले जाती है। कीबोर्ड से: ",
                es: "Arriba a la izquierda: pausa y salto al movimiento anterior o siguiente; una imagen de abajo salta a ese movimiento. Con teclado: ",
                ar: "في الأعلى يسارًا: إيقاف مؤقت والانتقال إلى الحركة السابقة أو التالية؛ والصورة في الأسفل تنقل إلى تلك الحركة. بلوحة المفاتيح: ",
                ru: "Слева вверху: пауза и переход к предыдущему или следующему движению; картинка внизу переходит к этому движению. С клавиатуры: ",
              })}
              <kbd>←</kbd> <kbd>→</kbd> {t({ de: "und die", en: "and", zh: "和", hi: "और", es: "y la tecla", ar: "و", ru: "и" })}{" "}
              <kbd>{t({ de: "Leertaste", en: "Space", zh: "空格键", hi: "स्पेस", es: "Espacio", ar: "مسافة", ru: "Пробел" })}</kbd>.
            </p>
          )}
        </>
      }
    >
      {/* Its own music, which plays while music is on for all games. */}
      <AdventurePlay
        key={story.sequence.title}
        story={story}
        language={language}
        settings={common}
        next={{ emoji: next.emoji, name: storyTitle(next.story, app.id), onNext: () => update({ story: next.id }) }}
      />
    </GameShell>
  );
}
