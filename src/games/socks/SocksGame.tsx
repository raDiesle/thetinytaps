import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { type Localized, useT } from "@/lib/language";
import { SocksPlay } from "./SocksPlay";
import { DEFAULT_SOCKS_SETTINGS, SOCKS_SETTINGS_KEY } from "./settings";
import "./socks.css";

/** The game's name, on its start screen and in the browser tab. */
export const SOCKS_TITLE: Localized = {
  de: "Socken-Paare",
  en: "Sock Pairs",
  zh: "袜子配对",
  hi: "मोज़ों के जोड़े",
  es: "Pares de calcetines",
  ar: "أزواج الجوارب",
  ru: "Пары носочков",
};

export function SocksGame() {
  const t = useT();
  const [settings] = useGameSettings(SOCKS_SETTINGS_KEY, DEFAULT_SOCKS_SETTINGS);
  const device = useDevice();

  return (
    <GameShell
      title={t(SOCKS_TITLE)}
      emoji="🧦"
      // Nothing to choose: the game finds the right difficulty by itself, so its card plays at once; after ✕ the
      // start screen has only „Los geht’s!“ and the info.
      startMode="play"
      info={
        <>
          <p>
            {t({
              de: "Die Waschmaschine wäscht von selbst, dann purzeln die Socken auf den Boden. Eine Socke antippen hebt sie hoch und lässt ihren Ton klingen; ihre Partnerin dazu, und beide hüpfen an die Wäscheleine. Eine andere Socke ist nie falsch: Die erste geht einfach zurück. Hängen alle, wird die Leine aus dem Bild gezogen, und die nächsten Socken purzeln heraus.",
              en: "The washing machine washes by itself, then the socks tumble onto the floor. Tapping a sock lifts it and plays its note; tap its partner too, and both hop onto the clothesline. Another sock is never wrong: the first one simply goes back. Once all of them hang, the line is pulled out of the picture and the next socks tumble out.",
              zh: "洗衣机自己洗，洗完袜子就滚到地上。点一只袜子，它会被拿起来，发出自己的声音；再点和它配对的那只，两只就一起跳上晾衣绳。点到别的袜子从来不算错：第一只只是放回去。全部挂好后，晾衣绳被拉出画面，下一批袜子又滚出来。",
              hi: "वॉशिंग मशीन अपने आप धोती है, फिर मोज़े ज़मीन पर लुढ़क आते हैं। किसी मोज़े को छूने से वह ऊपर उठता है और उसकी धुन बजती है; फिर उसकी जोड़ी वाले मोज़े को छूने पर दोनों उछलकर कपड़े सुखाने की रस्सी पर चले जाते हैं। कोई दूसरा मोज़ा कभी ग़लत नहीं होता: पहला बस वापस चला जाता है। जब सब टँग जाते हैं, तो रस्सी तस्वीर से बाहर खींच ली जाती है और अगले मोज़े लुढ़क आते हैं।",
              es: "La lavadora lava sola y luego los calcetines caen rodando al suelo. Al tocar un calcetín, se levanta y suena su nota; al tocar también su pareja, los dos saltan al tendedero. Otro calcetín nunca está mal: el primero simplemente vuelve a su sitio. Cuando cuelgan todos, la cuerda sale de la imagen y caen los siguientes calcetines.",
              ar: "تغسل الغسالة وحدها، ثم تتدحرج الجوارب على الأرض. لمس جورب يرفعه وتُسمع نغمته؛ ثم لمس شريكه، فيقفز الاثنان إلى حبل الغسيل. لا يكون جورب آخر خطأً أبدًا: يعود الأول ببساطة إلى مكانه. وعندما تُعلَّق كلها، يُسحب الحبل خارج الصورة وتتدحرج الجوارب التالية.",
              ru: "Стиральная машина стирает сама, потом носки высыпаются на пол. Нажатие на носок поднимает его, и звучит его нота; затем его пара – и оба прыгают на бельевую верёвку. Другой носок никогда не ошибка: первый просто возвращается обратно. Когда все висят, верёвка уезжает из картинки, и высыпаются следующие носки.",
            })}
          </p>
          <p>
            {t({
              de: "Das Spiel fängt leicht an, mit zwei Paaren in zwei Farben. Findet Ihr Kind die Paare sicher, kommen mehr Paare, dann Muster statt Farben, dann Muster in derselben Farbe – und Wäschekörbe, die sich wie bei Memory über erst eine, dann mehrere Socken stülpen; ein Tipp auf den Korb hebt ihn an. Geht vieles daneben, wird es wieder leichter. Schneller muss niemand werden: Es gibt keine Uhr. Paare hintereinander ohne Danebengreifen lassen die Töne höher klettern.",
              en: "The game starts easy, with two pairs in two colors. When your child finds the pairs confidently, more pairs come, then patterns instead of colors, then patterns in the same color – and laundry baskets that cover first one, then several socks, like in a memory game; a tap on a basket lifts it. When many taps miss, it gets easier again. Nobody has to get faster: there is no clock. Pairs in a row without a miss make the notes climb higher.",
              zh: "游戏一开始很简单：两双袜子，两种颜色。孩子能稳稳地找到配对后，袜子会变多，然后用图案代替颜色，再然后是同一种颜色的不同图案——还有洗衣篮，像记忆翻牌一样先盖住一只袜子，再盖住好几只；点一下篮子就能掀起来。点错得多了，游戏又会变简单。不需要变快：没有计时。连续配对不点错，音调会越来越高。",
              hi: "खेल आसान शुरू होता है, दो रंगों में दो जोड़ियों के साथ। जब जोड़ियाँ आसानी से मिलने लगें, तो और जोड़ियाँ आती हैं, फिर रंगों की जगह डिज़ाइन, फिर एक ही रंग में अलग डिज़ाइन – और कपड़ों की टोकरियाँ, जो मेमोरी खेल की तरह पहले एक, फिर कई मोज़ों को ढक देती हैं; टोकरी को छूने से वह उठ जाती है। अगर बहुत बार चूक होती है, तो खेल फिर आसान हो जाता है। किसी को तेज़ नहीं होना है: कोई घड़ी नहीं है। बिना चूके लगातार जोड़ियाँ मिलने पर धुनें ऊँची होती जाती हैं।",
              es: "El juego empieza fácil, con dos pares en dos colores. Cuando su peque encuentra los pares con seguridad, llegan más pares, luego dibujos en vez de colores, luego dibujos del mismo color, y cestos de ropa que tapan primero uno y luego varios calcetines, como en un memory; un toque en el cesto lo levanta. Si fallan muchos toques, vuelve a ser más fácil. Nadie tiene que ir más rápido: no hay reloj. Los pares seguidos sin fallar hacen que las notas suban cada vez más.",
              ar: "تبدأ اللعبة سهلة، بزوجين بلونين. عندما يجد طفلكم الأزواج بثقة، تأتي أزواج أكثر، ثم نقوش بدل الألوان، ثم نقوش باللون نفسه – وسلال غسيل تغطي جوربًا واحدًا أولًا ثم عدة جوارب، كما في لعبة الذاكرة؛ ولمسة على السلة ترفعها. وإذا كثرت اللمسات الخاطئة، تصبح اللعبة أسهل من جديد. لا أحد مضطر إلى الإسراع: لا توجد ساعة. والأزواج المتتالية بلا خطأ تجعل النغمات تعلو أكثر فأكثر.",
              ru: "Игра начинается легко: две пары двух цветов. Когда ребёнок уверенно находит пары, их становится больше, потом вместо цветов – узоры, потом узоры одного цвета – и корзины для белья, которые, как в игре на память, накрывают сначала один, потом несколько носков; нажатие на корзину приподнимает её. Если много промахов, снова становится легче. Быстрее никому не нужно: часов нет. Пары подряд без промахов заставляют ноты подниматься всё выше.",
            })}
          </p>
          {!device.touchOnly && (
            <p>
              {t({
                de: "Mit der Tastatur: Pfeiltasten wählen eine Socke, Leertaste oder Enter nimmt sie, 1–9 direkt.",
                en: "With a keyboard: the arrow keys pick a sock, Space or Enter takes it, 1–9 directly.",
                zh: "用键盘：用方向键选袜子，空格键或回车键拿起它，1–9 直接选。",
                hi: "कीबोर्ड से: तीर वाली कुंजियाँ मोज़ा चुनती हैं, स्पेस या एंटर उसे उठाता है, 1–9 सीधे।",
                es: "Con teclado: las flechas eligen un calcetín, la barra espaciadora o Enter lo toma, 1–9 directamente.",
                ar: "بلوحة المفاتيح: تختار الأسهم جوربًا، ومفتاح المسافة أو Enter يأخذه، و1–9 مباشرة.",
                ru: "С клавиатуры: стрелки выбирают носочек, пробел или Enter берёт его, 1–9 сразу.",
              })}
            </p>
          )}
        </>
      }
    >
      <SocksPlay settings={settings} />
    </GameShell>
  );
}
