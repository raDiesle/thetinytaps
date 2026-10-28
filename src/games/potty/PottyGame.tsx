import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { type Localized, useT } from "@/lib/language";
import { PottyPlay } from "./PottyPlay";
import { DEFAULT_POTTY_SETTINGS, POTTY_SETTINGS_KEY } from "./settings";
import "./potty.css";

/** The game's name, on its start screen and in the browser tab. */
export const POTTY_TITLE: Localized = {
  de: "Aufs Töpfchen",
  en: "Potty Time",
  zh: "上小马桶",
  hi: "पॉटी का समय",
  es: "Al orinal",
  ar: "إلى النونية",
  ru: "На горшок",
};

export function PottyGame() {
  const t = useT();
  const [settings] = useGameSettings(POTTY_SETTINGS_KEY, DEFAULT_POTTY_SETTINGS);
  const { touchOnly } = useDevice();

  return (
    <GameShell
      title={t(POTTY_TITLE)}
      emoji="🚽"
      // Opened when the child has to go: the story starts at once, with no modes to pick (the star is its last step);
      // after ✕ the start screen has only „Los geht’s!“ and the info.
      startMode="story"
      info={
        <>
          <p>
            {t({
              de: "Tapsi der Fuchs isst und trinkt abwechselnd, gleich vom Start an – dann drückt die Blase oder der Bauch brummelt. Wenn Tapsi Mama und Papa ruft, tippen Sie unten rechts, was Ihr Kind gesagt hat: 💧 Pipi, 💩 Kaka oder 💧💩 beides (auch, wenn Sie es nicht wissen). Dann gehen alle zusammen ins Bad: Hose runter, aufs Töpfchen, abwischen, Hose hoch, ausleeren und abziehen, Hände waschen – dann wird gefeiert, und zum Schluss zeigt eine Wochentafel die Sterne. Jedes Tippen ist ein Schritt; unten zeigt eine Reihe Bilder, welcher dran ist – tippen Sie dort auf ein Bild, springt die Geschichte sofort zu diesem Schritt.",
              en: "Tapsi the fox eats and drinks by turns, right from the start – then the bladder presses or the tummy rumbles. When Tapsi calls Mommy and Daddy, tap at the bottom right what your child said: 💧 pee, 💩 poop or 💧💩 both (also if you don't know). Then everyone goes to the bathroom together: pants down, onto the potty, wipe, pants up, empty and flush, wash hands – then there is a party, and at the end a week chart shows the stars. Every tap is one step; a row of pictures at the bottom shows which one is next – tap a picture there and the story jumps straight to that step.",
              zh: "小狐狸塔普西从一开始就轮流吃东西、喝水——然后小肚子胀了，或者肚子咕噜咕噜响。当塔普西喊妈妈和爸爸时，请在右下角点您的孩子说了什么：💧 尿尿、💩 便便，或 💧💩 都要（不知道时也选它）。然后大家一起去卫生间：脱裤子、坐上小马桶、擦干净、穿裤子、倒掉冲水、洗手——接着庆祝，最后一张周表显示星星。每点一下就是一步；下方一排图片显示现在是哪一步——点那里的图片，故事会立刻跳到那一步。",
              hi: "लोमड़ी का बच्चा टैप्सी शुरुआत से ही बारी-बारी से खाता और पीता है – फिर सू-सू लगती है या पेट गुड़गुड़ करता है। जब टैप्सी मम्मी और पापा को बुलाता है, तो नीचे दाईं ओर टैप करें कि आपके बच्चे ने क्या कहा: 💧 सू-सू, 💩 पॉटी या 💧💩 दोनों (तब भी, जब आपको पता न हो)। फिर सब साथ में बाथरूम जाते हैं: पैंट नीचे, पॉटी-सीट पर, पोंछना, पैंट ऊपर, खाली करना और फ़्लश करना, हाथ धोना – फिर जश्न, और आख़िर में हफ़्ते का चार्ट तारे दिखाता है। हर टैप एक चरण है; नीचे तस्वीरों की एक पंक्ति दिखाती है कि अभी कौन-सा चरण है – वहाँ किसी तस्वीर पर टैप करें, तो कहानी सीधे उसी चरण पर पहुँच जाती है।",
              es: "El zorrito Tapsi come y bebe por turnos desde el principio; luego le aprieta la vejiga o le hace ruido la barriga. Cuando Tapsi llama a mamá y papá, toque abajo a la derecha lo que dijo su peque: 💧 pipí, 💩 popó o 💧💩 las dos cosas (también si no lo sabe). Después todos van juntos al baño: pantalón abajo, al orinal, limpiarse, pantalón arriba, vaciar y tirar de la cadena, lavarse las manos; luego hay fiesta y al final una tabla semanal muestra las estrellas. Cada toque es un paso; abajo, una fila de imágenes muestra cuál toca; si toca allí una imagen, la historia salta directamente a ese paso.",
              ar: "الثعلب الصغير تابسي يأكل ويشرب بالتناوب منذ البداية – ثم تضغط المثانة أو يقرقر البطن. عندما ينادي تابسي ماما وبابا، المسوا في الأسفل يمينًا ما قاله طفلكم: 💧 بيبي، 💩 كاكا أو 💧💩 الاثنين (وكذلك إن لم تعرفوا). ثم يذهب الجميع معًا إلى الحمّام: إنزال البنطال، الجلوس على النونية، المسح، رفع البنطال، الإفراغ وشدّ السيفون، غسل اليدين – ثم الاحتفال، وفي النهاية تعرض لوحة الأسبوع النجوم. كل لمسة خطوة؛ في الأسفل صفّ من الصور يُبيّن أي خطوة الآن – المسوا صورة هناك فتقفز القصة فورًا إلى تلك الخطوة.",
              ru: "Лисёнок Тапси ест и пьёт по очереди, прямо с самого начала, – потом пи-пи просится наружу или в животике бурчит. Когда Тапси зовёт маму и папу, нажмите справа внизу, что сказал ваш ребёнок: 💧 пи-пи, 💩 ка-ка или 💧💩 и то и другое (и если вы не знаете). Потом все вместе идут в ванную: штанишки вниз, на горшок, вытереть, штанишки вверх, вылить и смыть, помыть руки – потом праздник, а в конце доска недели показывает звёздочки. Каждое нажатие – это шаг; внизу ряд картинок показывает, какой шаг сейчас, – нажмите там на картинку, и история сразу перейдёт к этому шагу.",
            })}
          </p>
          <p>
            {t({
              de: "Auf dem Töpfchen darf man sich Zeit lassen: Solange Tapsi sitzt, denkt es in einer Blase an etwas, das hilft – bei Pipi plätschert Wasser (Gießkanne, Brunnen, Regen), bei Kaka wird gedrückt (Ketchup, Luftballon aufpusten, Knete), bei beidem im Wechsel; bei jedem Tippen kommt das nächste. Dazu spielt ein Warte-Lied. Erst einer der beiden großen grünen Haken unten rechts sagt „fertig“ – so kann Ihr Kind auf dem echten Töpfchen mit Tapsi zusammen sitzen, und Sie tippen den Haken mit dem Tropfen 💧, wenn Pipi kam, oder den mit dem Kaka 💩 (bei beidem einen davon). Kam nichts, tippen Sie „nichts“: Dann wäscht Tapsi die Hände und spielt.",
              en: "On the potty there's no hurry: while Tapsi sits, it thinks in a bubble of something that helps – for pee, water splashes (watering can, fountain, rain), for poop, something gets squeezed (ketchup, blowing up a balloon, play dough), for both they take turns; every tap brings the next one. A waiting song plays along. Only one of the two big green checkmarks at the bottom right says “done” – so your child can sit on the real potty together with Tapsi, and you tap the checkmark with the drop 💧 when pee came, or the one with the poop 💩 (for both, either one). If nothing came, tap “nothing”: then Tapsi washes its hands and plays.",
              zh: "坐在小马桶上不用着急：塔普西坐着的时候，会在思考泡泡里想一些有帮助的事——尿尿时是哗哗的水（浇水壶、喷泉、下雨），便便时是挤东西（番茄酱、吹气球、彩泥），两样都要时轮流出现；每点一下就换下一个。同时还会播放一首等待的歌。只有右下角两个绿色大勾之一才表示“好了”——这样您的孩子可以和塔普西一起坐在真正的小马桶上，尿了就点带水滴 💧 的勾，便便了就点带便便 💩 的勾（两样都有就点任意一个）。如果什么都没有，就点“没有”：塔普西会洗手，然后去玩。",
              hi: "पॉटी-सीट पर जल्दी की ज़रूरत नहीं: जब तक टैप्सी बैठा है, वह एक बुलबुले में किसी मददगार चीज़ के बारे में सोचता है – सू-सू के लिए बहता पानी (फुहारा, फ़व्वारा, बारिश), पॉटी के लिए कुछ दबाया जाता है (केचप, गुब्बारा फुलाना, क्ले), दोनों के लिए बारी-बारी से; हर टैप पर अगला आता है। साथ में इंतज़ार का एक गाना बजता है। नीचे दाईं ओर के दो बड़े हरे सही के निशानों में से कोई एक ही “हो गया” कहता है – ताकि आपका बच्चा असली पॉटी-सीट पर टैप्सी के साथ बैठ सके, और सू-सू आए तो आप बूँद 💧 वाला निशान टैप करें, पॉटी आए तो पॉटी 💩 वाला (दोनों आएँ तो कोई भी एक)। कुछ न आए तो “कुछ नहीं” टैप करें: तब टैप्सी हाथ धोकर खेलता है।",
              es: "En el orinal no hay prisa: mientras Tapsi está sentado, piensa en una burbuja en algo que ayuda: para el pipí corre el agua (regadera, fuente, lluvia), para el popó se aprieta algo (kétchup, inflar un globo, plastilina), para las dos cosas, por turnos; cada toque trae lo siguiente. Además suena una canción para esperar. Solo una de las dos grandes marcas verdes de abajo a la derecha dice «listo»: así su peque puede sentarse en el orinal de verdad junto con Tapsi, y usted toca la marca con la gota 💧 si salió pipí, o la del popó 💩 (si salieron los dos, cualquiera). Si no salió nada, toque «nada»: entonces Tapsi se lava las manos y juega.",
              ar: "لا داعي للعجلة على النونية: ما دام تابسي جالسًا يفكّر في فقاعة بشيء يساعد – للبيبي يجري الماء (إبريق الري، النافورة، المطر)، وللكاكا يُضغط شيء (الكاتشب، نفخ بالون، الصلصال)، وللاثنين بالتناوب؛ مع كل لمسة يأتي التالي. وترافق ذلك أغنية للانتظار. علامة واحدة فقط من العلامتين الخضراوين الكبيرتين في الأسفل يمينًا تقول «انتهينا» – هكذا يستطيع طفلكم الجلوس على النونية الحقيقية مع تابسي، وتلمسون العلامة ذات القطرة 💧 إذا جاء البيبي، أو ذات الكاكا 💩 (وللاثنين أيًّا منهما). إذا لم يأتِ شيء، المسوا «لا شيء»: عندها يغسل تابسي يديه ويلعب.",
              ru: "На горшке можно не торопиться: пока Тапси сидит, он думает в облачке о том, что помогает, – при пи-пи журчит вода (лейка, фонтан, дождь), при ка-ка что-то выдавливается (кетчуп, надуть шарик, пластилин), при том и другом – по очереди; при каждом нажатии появляется следующее. А ещё играет песенка для ожидания. Только одна из двух больших зелёных галочек справа внизу говорит «готово» – так ваш ребёнок может сидеть на настоящем горшке вместе с Тапси, а вы нажимаете галочку с капелькой 💧, если было пи-пи, или с ка-ка 💩 (если и то и другое – любую из них). Если ничего не было, нажмите «ничего»: тогда Тапси моет руки и играет.",
            })}
          </p>
          <p>
            {t({
              de: "Der Stern ist für echte Erfolge: Haben Sie beim Sitzen einen grünen Haken getippt, kommt am Ende ein Stern für heute auf die Wochentafel – einer pro Runde. Ohne Haken zeigt die Tafel nur die Sterne, die schon da sind. Nichts geht verloren, und es gibt keine leeren Felder als „nicht geschafft“.",
              en: "The star is for real successes: if you tapped a green checkmark while Tapsi sat, a star for today goes onto the week chart at the end – one per round. Without a checkmark the chart only shows the stars that are already there. Nothing gets lost, and there are no empty boxes for “didn't work”.",
              zh: "星星只奖励真正的成功：如果坐着时您点了绿色的勾，最后周表上会多一颗今天的星星——每轮一颗。没点勾，周表只显示已有的星星。什么都不会丢，也没有表示“没成功”的空格。",
              hi: "तारा असली कामयाबी के लिए है: अगर टैप्सी के बैठे रहते आपने हरा निशान टैप किया, तो आख़िर में हफ़्ते के चार्ट पर आज का एक तारा आता है – हर राउंड में एक। निशान के बिना चार्ट सिर्फ़ पहले से मौजूद तारे दिखाता है। कुछ भी खोता नहीं, और “नहीं हुआ” वाले खाली खाने नहीं होते।",
              es: "La estrella es para los éxitos de verdad: si tocó una marca verde mientras Tapsi estaba sentado, al final aparece en la tabla semanal una estrella de hoy, una por ronda. Sin marca, la tabla solo muestra las estrellas que ya hay. No se pierde nada y no hay casillas vacías de «no salió».",
              ar: "النجمة للنجاحات الحقيقية: إذا لمستم علامة خضراء أثناء جلوس تابسي، تظهر في النهاية نجمة لليوم على لوحة الأسبوع – نجمة لكل جولة. ومن دون علامة تعرض اللوحة النجوم الموجودة فقط. لا يضيع شيء، ولا توجد خانات فارغة تعني «لم ينجح».",
              ru: "Звёздочка – для настоящих успехов: если вы нажали зелёную галочку, пока Тапси сидел, в конце на доске недели появляется звёздочка за сегодня – одна за раунд. Без галочки доска показывает только те звёздочки, что уже есть. Ничего не пропадает, и пустых клеток «не получилось» нет.",
            })}
          </p>
          <p>
            {t({
              de: "Das Spiel startet sofort, wenn Sie es öffnen – hierher kommen Sie, wenn Sie ✕ gedrückt halten. Töpfchentraining beginnt meist zwischen 2 und 3 Jahren, wenn das Kind merkt, dass es muss. Druck hilft nicht; Mitfreuen und feste Zeiten (nach dem Aufwachen, nach dem Essen) schon.",
              en: "The game starts right away when you open it – you get here by holding ✕. Potty training usually begins between 2 and 3 years, when the child notices it needs to go. Pressure doesn't help; sharing the joy and fixed times (after waking up, after meals) do.",
              zh: "打开游戏就会立刻开始——按住 ✕ 才会来到这里。如厕训练通常在2到3岁之间开始，那时孩子能感觉到自己要上厕所了。施加压力没有用；一起开心、固定的时间（睡醒后、饭后）才有帮助。",
              hi: "खेल खोलते ही तुरंत शुरू हो जाता है – यहाँ आप ✕ दबाए रखकर आते हैं। पॉटी ट्रेनिंग आम तौर पर 2 से 3 साल के बीच शुरू होती है, जब बच्चे को महसूस होने लगता है कि उसे जाना है। दबाव से मदद नहीं मिलती; साथ में ख़ुश होना और तय समय (सोकर उठने के बाद, खाने के बाद) मदद करते हैं।",
              es: "El juego empieza enseguida al abrirlo; aquí se llega manteniendo pulsada ✕. El control de esfínteres suele empezar entre los 2 y los 3 años, cuando el niño o la niña nota que tiene ganas. La presión no ayuda; alegrarse juntos y los horarios fijos (al despertar, después de comer), sí.",
              ar: "تبدأ اللعبة فورًا عند فتحها – وتصلون إلى هنا بالضغط المطوّل على ✕. يبدأ التدريب على النونية عادةً بين السنتين والثلاث، حين يلاحظ الطفل أنه بحاجة إلى الذهاب. الضغط لا يساعد؛ أما الفرح معًا والأوقات الثابتة (بعد الاستيقاظ، بعد الأكل) فتساعد.",
              ru: "Игра сразу начинается, когда вы её открываете, – сюда вы попадёте, если удержите ✕. Приучение к горшку обычно начинается между 2 и 3 годами, когда ребёнок замечает, что ему надо. Давление не помогает, а радоваться вместе и постоянное время (после сна, после еды) – помогают.",
            })}
            {!touchOnly && (
              <>
                {" "}
                {t({
                  de: "Mit der Tastatur: jede Taste ist ein Tippen, beim Sitzen ist Enter der Haken für das, was Ihr Kind gesagt hat (sonst Pipi); die anderen tippen Sie mit der Maus an.",
                  en: "With a keyboard: every key is a tap; while sitting, Enter is the checkmark for what your child said (otherwise pee); tap the others with the mouse.",
                  zh: "用键盘：每个键都相当于点一下；坐着时，回车键是孩子所说那一项的勾（否则是尿尿）；其他的请用鼠标点。",
                  hi: "कीबोर्ड से: हर कुंजी एक टैप है; बैठे रहते Enter उस चीज़ का निशान है जो आपके बच्चे ने कही थी (वरना सू-सू); बाक़ी माउस से टैप करें।",
                  es: "Con teclado: cada tecla es un toque; en el orinal, Enter es la marca de lo que dijo su peque (si no, pipí); las demás tóquelas con el ratón.",
                  ar: "بلوحة المفاتيح: كل مفتاح لمسة؛ وأثناء الجلوس يكون Enter علامة ما قاله طفلكم (وإلا البيبي)؛ والبقية المسوها بالفأرة.",
                  ru: "С клавиатуры: каждая клавиша – это нажатие, на горшке Enter – галочка для того, что сказал ваш ребёнок (иначе пи-пи); остальные нажимайте мышкой.",
                })}
              </>
            )}
          </p>
        </>
      }
    >
      <PottyPlay settings={settings} />
    </GameShell>
  );
}
