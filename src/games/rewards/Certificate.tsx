import { type CSSProperties, useState } from "react";
import { createPortal } from "react-dom";
import { SettingsGroup } from "@/components/SettingControls";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { type Board, type BoardTask, longerGoal, oncePerDay, taskSlots } from "./board";
import { useTaskLabel } from "./BoardSheet";
import { MARK_BY_ID, MARKS, THEME_BY_ID, THEMES } from "./catalog";
import { CHILD_NAME, NAME_EXAMPLE, Pick } from "./pageParts";
import { ItemPic, MarkPic } from "./pictures";
import { A4, Preview } from "./PrintPanel";
import { TO_CHART } from "./Review";

/** „🏅 Urkunde“: the button on top and the heading of the panel. */
export const CERTIFICATE: Localized = { de: "Urkunde", en: "Certificate", zh: "奖状", hi: "प्रमाण-पत्र", es: "Diploma", ar: "شهادة", ru: "Грамота" };

/** „für Lena“ on the certificate; without a name „für“ and a line to write it on. */
const FOR: Localized<(name: string) => string> = {
  de: (name) => `für ${name}`.trim(),
  en: (name) => `for ${name}`.trim(),
  zh: (name) => `授予${name}`,
  hi: (name) => (name ? `${name} के लिए` : "नाम:"),
  es: (name) => `para ${name}`.trim(),
  ar: (name) => `إلى ${name}`.trim(),
  ru: (name) => `Вручается: ${name}`.trim(),
};

/** How many marks of the board stand in a row under the task on the certificate. */
const MARKS_ON_PAGE = 5;

/**
 * „🏅 Urkunde“ (T-15): when something works by itself, the round ends with a certificate to print – the task's
 * picture big, its name, the child's name and „Das kann ich jetzt ganz allein!“ – and beside it the ways to wind the
 * board down, as parents' guides advise: announce it, make the way to the reward longer, then let the task go and
 * pick a new one. Shown in place of the board; it prints on its own A4 page, in colour or grey as the board prints.
 */
export function Certificate({
  board,
  color,
  onChange,
  onEdit,
  onClose,
}: {
  board: Board;
  /** In colour, or grey to save ink: the board's print option. */
  color: boolean;
  onChange: (patch: Partial<Board>) => void;
  /** Opens „Gestalten“, to pick the task that comes next. */
  onEdit: () => void;
  onClose: () => void;
}) {
  const t = useT();
  const taskLabel = useTaskLabel();
  const [picked, setPicked] = useState(board.tasks[0]?.id);
  const task = board.tasks.find((own) => own.id === picked) ?? board.tasks[0];
  const goal = longerGoal(board, new Date());
  const page = task && <CertificatePage board={board} task={task} color={color} />;

  const setTask = (patch: Partial<BoardTask>) => onChange({ tasks: board.tasks.map((own) => (own.id === task?.id ? { ...own, ...patch } : own)) });
  // The task goes from the board; Gestalten opens to pick the next one.
  const letGo = () => {
    if (!task) return;
    onChange({ tasks: board.tasks.filter((own) => own.id !== task.id) });
    onEdit();
  };

  return (
    <section className="rw-review rw-cert" aria-label={t(CERTIFICATE)}>
      <header className="rw-review-head">
        <h2 className="rw-panel-title">{t(CERTIFICATE)}</h2>
        <span className="rw-review-now" />
        <button type="button" className="rw-review-close" onClick={onClose}>
          ✕ {t(TO_CHART)}
        </button>
      </header>
      {task ? (
        <div className="rw-cert-body">
          <div className="settings rw-cert-options">
            <p className="setting-note">
              {t({
                de: "Klappt etwas schon von selbst? Dann ist es Zeit für eine Urkunde: ausdrucken, feierlich überreichen und zusammen aufhängen.",
                en: "Does something already work by itself? Then it’s time for a certificate: print it, hand it over with ceremony and hang it up together.",
                zh: "有什么事已经能自己做好了吗？那就该发一张奖状了：打印出来，郑重地颁发，再一起挂起来。",
                hi: "क्या कोई काम अब अपने-आप होने लगा है? तो प्रमाण-पत्र का समय है: प्रिंट करें, धूमधाम से दें और साथ मिलकर टाँगें।",
                es: "¿Algo ya sale solo? Entonces es hora de un diploma: imprímalo, entréguelo con solemnidad y cuélguenlo juntos.",
                ar: "هل صار شيء ما يتمّ من تلقاء نفسه؟ إذن حان وقت الشهادة: اطبعوها، وقدّموها باحتفال، وعلّقوها معًا.",
                ru: "Что-то уже получается само? Тогда пора вручить грамоту: распечатайте её, торжественно вручите и повесьте вместе.",
              })}
            </p>
            {board.tasks.length > 1 && (
              <SettingsGroup
                title={t({ de: "Wofür?", en: "What for?", zh: "为哪件事？", hi: "किस काम के लिए?", es: "¿Para qué tarea?", ar: "لأيّ مهمة؟", ru: "За что?" })}
              >
                <div className="rw-picks rw-cert-tasks">
                  {board.tasks.map((own) => (
                    <Pick key={own.id} selected={own.id === task.id} onClick={() => setPicked(own.id)} emoji={<ItemPic item={own} />} label={taskLabel(own)} />
                  ))}
                </div>
              </SettingsGroup>
            )}
            <label className="rw-input">
              <span>{t(CHILD_NAME)}</span>
              <input
                type="text"
                value={board.childName}
                maxLength={24}
                placeholder={t(NAME_EXAMPLE)}
                onChange={(e) => onChange({ childName: e.target.value })}
              />
            </label>
            <button type="button" className="rw-print-button" onClick={() => window.print()}>
              🖨️{" "}
              {t({
                de: "Urkunde drucken",
                en: "Print certificate",
                zh: "打印奖状",
                hi: "प्रमाण-पत्र प्रिंट करें",
                es: "Imprimir diploma",
                ar: "طباعة الشهادة",
                ru: "Распечатать грамоту",
              })}
            </button>

            <SettingsGroup
              title={t({
                de: "Wie geht es weiter?",
                en: "What comes next?",
                zh: "接下来怎么做？",
                hi: "आगे क्या?",
                es: "¿Y ahora qué?",
                ar: "ماذا بعد؟",
                ru: "Что дальше?",
              })}
            >
              <p className="setting-note">
                {t({
                  de: "Was von selbst klappt, braucht bald keine Sterne mehr. Sagen Sie es Ihrem Kind ein paar Tage vorher, etwa: „Noch diese Woche Sterne – dann kannst du das ganz allein.“ Und dann lassen Sie die Tafel langsam ausklingen:",
                  en: "What works by itself soon needs no more stars. Tell your child a few days before, for example: “Stars for this week – then you can do it all by yourself.” And then let the chart fade out slowly:",
                  zh: "已经能自己做好的事，很快就不再需要星星了。提前几天告诉孩子，比如：“这周还有星星——之后你就能完全自己做啦。”然后让奖励表慢慢结束：",
                  hi: "जो अपने-आप होने लगे, उसके लिए जल्द ही सितारों की ज़रूरत नहीं रहती। अपने बच्चे को कुछ दिन पहले बता दें, जैसे: “इस हफ़्ते और सितारे – फिर तुम्हें यह खुद करना आ जाएगा।” और फिर चार्ट को धीरे-धीरे खत्म होने दें:",
                  es: "Lo que ya sale solo pronto no necesita estrellas. Dígaselo a su peque unos días antes, por ejemplo: «Esta semana todavía hay estrellas; luego ya puedes hacerlo sin ayuda». Y luego deje que la tabla termine poco a poco:",
                  ar: "ما يتمّ من تلقاء نفسه لن يحتاج قريبًا إلى نجوم. أخبروا طفلكم قبل بضعة أيام، مثلًا: «هذا الأسبوع نجوم بعد – ثم نفعلها بلا نجوم». ثم دعوا اللوحة تنتهي بهدوء:",
                  ru: "То, что получается само, скоро обойдётся без звёзд. Скажите ребёнку за несколько дней, например: «Ещё на этой неделе звёзды – а потом ты справишься без помощи». А потом дайте таблице постепенно сойти на нет:",
                })}
              </p>
              <div className="rw-cert-steps">
                {goal !== null && (
                  <button type="button" onClick={() => onChange({ goal })}>
                    ⭐{" "}
                    {t({
                      de: (n: number, was: number) => `Mehr Sterne bis zur Belohnung: ${n} statt ${was}`,
                      en: (n: number, was: number) => `More stars to the reward: ${n} instead of ${was}`,
                      zh: (n: number, was: number) => `得到奖励要更多星星：${n} 颗，而不是 ${was} 颗`,
                      hi: (n: number, was: number) => `इनाम तक ज़्यादा सितारे: ${was} की जगह ${n}`,
                      es: (n: number, was: number) => `Más estrellas hasta el premio: ${n} en vez de ${was}`,
                      ar: (n: number, was: number) => `نجوم أكثر حتى المكافأة: ${n} بدلًا من ${was}`,
                      ru: (n: number, was: number) => `Больше звёзд до награды: ${n} вместо ${was}`,
                    })(goal, board.goal)}
                  </button>
                )}
                {taskSlots(task).length > 1 && (
                  <button type="button" onClick={() => setTask({ slots: oncePerDay(task).slots })}>
                    🌙{" "}
                    {t({
                      de: (label: string) => `„${label}“ nur noch einmal am Tag`,
                      en: (label: string) => `“${label}” only once a day`,
                      zh: (label: string) => `“${label}”每天只要一次`,
                      hi: (label: string) => `“${label}” अब दिन में सिर्फ़ एक बार`,
                      es: (label: string) => `«${label}» solo una vez al día`,
                      ar: (label: string) => `«${label}» مرة واحدة فقط في اليوم`,
                      ru: (label: string) => `«${label}» только раз в день`,
                    })(taskLabel(task))}
                  </button>
                )}
                <button type="button" onClick={letGo}>
                  👋{" "}
                  {t({
                    de: (label: string) => `„${label}“ ablösen und eine neue Aufgabe wählen`,
                    en: (label: string) => `Let “${label}” go and choose a new task`,
                    zh: (label: string) => `结束“${label}”，选一个新任务`,
                    hi: (label: string) => `“${label}” हटाएँ और नया काम चुनें`,
                    es: (label: string) => `Despedir «${label}» y elegir una tarea nueva`,
                    ar: (label: string) => `إنهاء «${label}» واختيار مهمة جديدة`,
                    ru: (label: string) => `Отпустить «${label}» и выбрать новое задание`,
                  })(taskLabel(task))}
                </button>
              </div>
            </SettingsGroup>
          </div>
          <Preview orientation="portrait">{page}</Preview>
        </div>
      ) : (
        <p className="rw-review-empty">
          {t({
            de: "Die Tafel hat noch keine Aufgabe – unter „Gestalten“ kommt eine dazu.",
            en: "The chart has no task yet – add one under “Design”.",
            zh: "奖励表还没有任务——在“设计”里添加一个。",
            hi: "चार्ट में अभी कोई काम नहीं है – “डिज़ाइन” में एक जोड़ें।",
            es: "La tabla aún no tiene ninguna tarea: añada una en «Diseñar».",
            ar: "لا توجد في اللوحة أي مهمة بعد – أضيفوا واحدة في «تصميم».",
            ru: "В таблице ещё нет заданий – добавьте одно в разделе «Оформление».",
          })}
        </p>
      )}
      {/* @page can only be set by a stylesheet; this one comes and goes with the panel. */}
      {page && createPortal(<div className="rw-print-root">{page}</div>, document.body)}
      {page && <style>{"@page { size: A4 portrait; margin: 0; }"}</style>}
    </section>
  );
}

/** The certificate itself, one A4 page standing: the same on screen (made small) and on paper. */
function CertificatePage({ board, task, color }: { board: Board; task: BoardTask; color: boolean }) {
  const t = useT();
  const { speechLang } = useAppLanguage();
  const label = useTaskLabel()(task);
  const theme = THEME_BY_ID.get(board.theme) ?? THEMES[0];
  const mark = MARK_BY_ID.get(board.mark) ?? MARKS[0];
  const name = board.childName.trim();
  const style = { width: `${A4.short}mm`, height: `${A4.long}mm`, ...(color ? { "--rw-main": theme.main, "--rw-paper": theme.paper } : {}) } as CSSProperties;
  return (
    <div className={`rw-page rw-cert-page${color ? "" : " rw-grey"}`} style={style}>
      <div className="rw-cert-frame">
        <Rosette />
        <h1 className="rw-cert-title">{t(CERTIFICATE)}</h1>
        <p className="rw-cert-name">
          {t(FOR)(name)}
          {!name && <span className="rw-cert-blank" />}
        </p>
        <div className="rw-cert-picture" aria-hidden>
          <ItemPic item={task} lines={!color} />
        </div>
        <p className="rw-cert-task">{label}</p>
        <p className="rw-cert-says">
          {t({
            de: "Das kann ich jetzt ganz allein!",
            en: "I can do it all by myself now!",
            zh: "我现在能自己做到啦！",
            hi: "अब मुझे यह खुद करना आता है!",
            es: "¡Ya puedo hacerlo sin ayuda!",
            ar: "أستطيع الآن أن أفعلها وحدي!",
            ru: "Теперь я умею это без помощи!",
          })}
        </p>
        <div className="rw-cert-marks" aria-hidden>
          {Array.from({ length: MARKS_ON_PAGE }, (_, i) => (
            <MarkPic key={i} mark={mark} />
          ))}
        </div>
        <div className="rw-cert-sign">
          <span>
            <span className="rw-cert-date">{new Intl.DateTimeFormat(speechLang, { day: "numeric", month: "long", year: "numeric" }).format(new Date())}</span>
            {t({ de: "Datum", en: "Date", zh: "日期", hi: "तारीख़", es: "Fecha", ar: "التاريخ", ru: "Дата" })}
          </span>
          <span>
            <span className="rw-cert-blank" />
            {t({ de: "Unterschrift", en: "Signature", zh: "签名", hi: "हस्ताक्षर", es: "Firma", ar: "التوقيع", ru: "Подпись" })}
          </span>
        </div>
      </div>
    </div>
  );
}

/** A rosette with two ribbons on top of the certificate, in gold (grey on a grey print). */
function Rosette() {
  const petals = 16;
  return (
    <svg className="rw-cert-rosette" viewBox="-50 -50 100 120" aria-hidden>
      <path d="M-18 20 L-30 68 L-18 60 L-10 72 L-2 26 Z" className="rw-cert-ribbon" />
      <path d="M18 20 L30 68 L18 60 L10 72 L2 26 Z" className="rw-cert-ribbon" />
      {Array.from({ length: petals }, (_, i) => (
        <circle key={i} cx={Math.cos((i / petals) * 2 * Math.PI) * 34} cy={Math.sin((i / petals) * 2 * Math.PI) * 34} r={11} className="rw-cert-petal" />
      ))}
      <circle r={34} className="rw-cert-petal" />
      <circle r={25} className="rw-cert-medal" />
      <path d="M0 -15 L4.4 -5.5 L14.3 -4.6 L6.8 2 L9 11.8 L0 6.6 L-9 11.8 L-6.8 2 L-14.3 -4.6 L-4.4 -5.5 Z" className="rw-cert-star" />
    </svg>
  );
}
