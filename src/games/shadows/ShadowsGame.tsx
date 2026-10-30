import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { type Localized, useT } from "@/lib/language";
import { ShadowsPlay } from "./ShadowsPlay";
import { DEFAULT_SHADOWS_SETTINGS, SHADOWS_SETTINGS_KEY } from "./settings";
import "./shadows.css";

/** The game's name, on its start screen and in the browser tab. */
export const SHADOWS_TITLE: Localized = {
  de: "Schatten finden",
  ru: "Найди тень",
  en: "Find the Shadow",
  zh: "找影子",
  hi: "परछाईं ढूँढो",
  es: "Busca la sombra",
  ar: "أين الظل؟",
};

export function ShadowsGame() {
  const t = useT();
  const [settings] = useGameSettings(SHADOWS_SETTINGS_KEY, DEFAULT_SHADOWS_SETTINGS);
  const device = useDevice();

  return (
    <GameShell
      title={t(SHADOWS_TITLE)}
      emoji="👤"
      // Nothing to choose: the game finds the right difficulty by itself and the pictures are picked while playing, so
      // its card plays at once; after ✕ the start screen has only „Los geht’s!“ and the info.
      startMode="play"
      info={
        <>
          <p>
            {t({
              de: "Ein Bild sucht seinen Schatten unter mehreren schwarzen. Das Kind tippt auf den passenden Schatten oder zieht das Bild darauf. Ein anderer Schatten zeigt kurz seine Farben und ist nie falsch. Ist der Schatten gefunden, kommt gleich das nächste Bild.",
              en: "A picture looks for its shadow among several black ones. The child taps the matching shadow or drags the picture onto it. Another shadow briefly shows its colors and is never wrong. Once the shadow is found, the next picture comes right away.",
              zh: "一张图片要在几个黑影中找到自己的影子。孩子点对应的影子，或者把图片拖到影子上。点到别的影子，它会短暂显出颜色，从来不算错。找到影子后，下一张图片马上就来。",
              hi: "एक तस्वीर कई काली परछाइयों में अपनी परछाईं ढूँढती है। सही परछाईं को छूकर या तस्वीर को उस पर खींचकर चुना जाता है। कोई दूसरी परछाईं थोड़ी देर अपने रंग दिखाती है और कभी ग़लत नहीं होती। परछाईं मिलते ही अगली तस्वीर आ जाती है।",
              es: "Un dibujo busca su sombra entre varias sombras negras. Se toca la sombra que corresponde o se arrastra el dibujo encima. Otra sombra muestra un momento sus colores y nunca está mal. En cuanto se encuentra la sombra, llega el siguiente dibujo.",
              ar: "تبحث صورة عن ظلها بين عدة ظلال سوداء. يلمس الطفل الظل المناسب أو يسحب الصورة إليه. والظل الآخر يُظهر ألوانه لحظة ولا يكون خطأً أبدًا. وحين يُعثر على الظل، تأتي الصورة التالية فورًا.",
              ru: "Картинка ищет свою тень среди нескольких чёрных. Ребёнок нажимает на подходящую тень или перетаскивает на неё картинку. Другая тень ненадолго показывает свои цвета и никогда не ошибка. Как только тень найдена, сразу появляется следующая картинка.",
            })}
          </p>
          <p>
            {t({
              de: "Das Spiel fängt leicht an, mit zwei Schatten von ganz verschiedenen Dingen. Findet Ihr Kind die Schatten sicher, kommen mehr dazu (bis zu sechs) und dann ähnliche, etwa nur Tiere; geht vieles daneben, wird es wieder leichter. Es gibt keine Uhr: Wie lange es dauert, zählt nicht.",
              en: "The game starts easy, with two shadows of very different things. When your child finds the shadows confidently, more come (up to six) and then similar ones, say only animals; when many taps miss, it gets easier again. There is no clock: how long it takes doesn't count.",
              zh: "游戏一开始很简单：两个完全不同东西的影子。孩子能稳稳找到影子后，影子会变多（最多六个），然后是相似的，比如全是动物；点错得多了，又会变简单。没有计时：用多长时间都没关系。",
              hi: "खेल आसान शुरू होता है, बिल्कुल अलग चीज़ों की दो परछाइयों के साथ। जब परछाइयाँ आसानी से मिलने लगें, तो और आती हैं (छह तक) और फिर मिलती-जुलती, जैसे सिर्फ़ जानवर; अगर बहुत बार चूक होती है, तो खेल फिर आसान हो जाता है। कोई घड़ी नहीं है: कितना समय लगता है, इससे कोई फ़र्क नहीं पड़ता।",
              es: "El juego empieza fácil, con dos sombras de cosas muy distintas. Cuando su peque encuentra las sombras con seguridad, llegan más (hasta seis) y luego parecidas, por ejemplo solo animales; si fallan muchos toques, vuelve a ser más fácil. No hay reloj: el tiempo que tarde no cuenta.",
              ar: "تبدأ اللعبة سهلة، بظلين لشيئين مختلفين تمامًا. عندما يجد طفلكم الظلال بثقة، تأتي ظلال أكثر (حتى ستة) ثم ظلال متشابهة، مثل الحيوانات فقط؛ وإذا كثرت اللمسات الخاطئة، تصبح أسهل من جديد. لا توجد ساعة: لا يهم كم يستغرق الأمر.",
              ru: "Игра начинается легко: две тени совсем разных вещей. Когда ребёнок уверенно находит тени, их становится больше (до шести), а потом похожие, например только звери; если много промахов, снова становится легче. Часов нет: сколько времени уходит, не важно.",
            })}
          </p>
          <p>
            {t({
              de: "Am Anfang sind die Bilder gemischt. Der Knopf oben links öffnet die Auswahl: nur Tiere, Fahrzeuge, Essen oder Dinge, oder wieder gemischt.",
              en: "At first the pictures are mixed. The button in the top left corner opens the choice: only animals, vehicles, food or things, or mixed again.",
              zh: "一开始图片是混合的。左上角的按钮可以打开选择：只要动物、交通工具、食物或物品，或者再换回混合。",
              hi: "शुरू में तस्वीरें मिली-जुली होती हैं। ऊपर बाईं ओर का बटन चुनाव खोलता है: सिर्फ़ जानवर, गाड़ियाँ, खाना या चीज़ें, या फिर से मिली-जुली।",
              es: "Al principio los dibujos están mezclados. El botón de arriba a la izquierda abre la elección: solo animales, vehículos, comida o cosas, o mezclados otra vez.",
              ar: "في البداية تكون الصور مختلطة. الزر في الزاوية العلوية اليسرى يفتح الاختيار: حيوانات فقط، أو مركبات، أو طعام، أو أشياء، أو مختلطة من جديد.",
              ru: "Сначала картинки вперемешку. Кнопка в левом верхнем углу открывает выбор: только звери, транспорт, еда или вещи – или снова вперемешку.",
            })}
          </p>
          {!device.touchOnly && (
            <p>
              {t({
                de: "Mit der Tastatur: Pfeiltasten wählen ein Bild, Leertaste oder Enter nimmt es, 1–6 direkt.",
                ru: "С клавиатуры: стрелки выбирают картинку, пробел или Enter берёт её, 1–6 – сразу.",
                en: "With the keyboard: the arrow keys pick a picture, Space or Enter takes it, 1–6 directly.",
                zh: "用键盘：方向键选图，空格或回车键确定，也可以直接按 1–6。",
                hi: "कीबोर्ड से: तीर वाली कुंजियाँ तस्वीर चुनती हैं, स्पेस या एंटर उसे लेता है, 1–6 सीधे।",
                es: "Con el teclado: las flechas eligen una imagen, Espacio o Intro la toma, 1–6 directamente.",
                ar: "بلوحة المفاتيح: تختار مفاتيح الأسهم صورة، ومفتاح المسافة أو الإدخال يأخذها، و1–6 مباشرة.",
              })}
            </p>
          )}
        </>
      }
    >
      <ShadowsPlay settings={settings} />
    </GameShell>
  );
}
