import { useState } from "react";
import { useAppLanguage, useT } from "@/lib/language";
import { type ChartKind, ChartEditor, type Draft, defaultDraft, draftOfKind } from "./ChartEditor";
import { Editor } from "./Editor";
import { counting } from "./plan";
import { PlanEditor } from "./PlanEditor";

export type { Draft } from "./ChartEditor";

/** Where the wizard starts: on one of the three kinds (a Countdown where „Wie lange warten?“ has none, a kind the editor's quick choice asked for). */
export type WizardStart = { kind: ChartKind };

/** Whether a draft can be made as it is: a board needs a task (a collecting board none), a plan a card. */
const ready = (draft: Draft) =>
  draft.type === "board" ? draft.board.tasks.length > 0 || draft.board.kind === "collect" : draft.plan.days.some((day) => day.length > 0);

/**
 * „＋ Neu“, for a Belohnungstafel and a Zeitplan alike: the very chart that will be made, changed right on it with the
 * same `ChartEditor` as „Gestalten“ on the page (user decision, November 2026), so the wizard and the page look and work
 * the same. It starts on „Mein Tag“ – its cards in one line, a star a card and no reward (`defaultDraft`) –
 * and its Zeitraum makes it a week, a month, an Erst – Dann or a path to collect on, the quick choice on top a Zeitplan,
 * a Belohnungstafel or a Countdown. „✓ Anlegen“ makes it. Opened on a kind it starts on that kind's first chart.
 * Without `onCancel` (nothing made yet) it can't be closed: the page has nothing else to show.
 */
export function Wizard({ start, onDone, onCancel }: { start?: WizardStart; onDone: (draft: Draft) => void; onCancel?: () => void }) {
  const t = useT();
  const { id: language } = useAppLanguage();
  const [draft, setDraft] = useState<Draft>(() => (start ? draftOfKind(start.kind, defaultDraft(language), language) : defaultDraft(language)));
  const reward = draft.type === "board" || counting(draft.plan);
  const done = reward
    ? t({ de: "Tafel anlegen", en: "Create chart", zh: "创建奖励表", hi: "चार्ट बनाएँ", es: "Crear tabla", ar: "إنشاء اللوحة", ru: "Создать таблицу" })
    : t({ de: "Plan anlegen", en: "Create plan", zh: "创建日程表", hi: "योजना बनाएँ", es: "Crear plan", ar: "إنشاء الخطة", ru: "Создать план" });
  return (
    <section
      className="rw-wizard"
      aria-label={t({ de: "Neu anlegen", en: "Create new", zh: "新建", hi: "नया बनाएँ", es: "Crear nuevo", ar: "إنشاء جديد", ru: "Создать" })}
    >
      {/* On top and in sight while the page scrolls (user feedback, November 2026): the one button that makes it, on the left, and printing. */}
      <header className="rw-wizard-head">
        <span className="rw-wizard-actions">
          {ready(draft) && (
            <button type="button" className="rw-wizard-done" onClick={() => onDone(draft)}>
              <span aria-hidden>✓</span> {done}
            </button>
          )}
          {onCancel && (
            <button type="button" className="rw-wizard-back" onClick={onCancel}>
              {t({ de: "Abbrechen", en: "Cancel", zh: "取消", hi: "रद्द करें", es: "Cancelar", ar: "إلغاء", ru: "Отмена" })}
            </button>
          )}
        </span>
        <PrintBadge />
      </header>
      <ChartEditor
        draft={draft}
        onChange={setDraft}
        making
        more={
          draft.type === "board" ? (
            <Editor board={draft.board} onChange={(patch) => setDraft({ type: "board", board: { ...draft.board, ...patch } })} />
          ) : draft.plan.view === "countdown" ? undefined : (
            <PlanEditor plan={draft.plan} day={new Date()} onChange={(plan) => setDraft({ type: "plan", plan })} />
          )
        }
      />
    </section>
  );
}

/**
 * That the chart prints, said on the first page a visitor sees (user feedback, November 2026): on A4, as photo prints
 * for a Velcro board, or used right here on the screen. A stamp, not a button – there is nothing to print before it is made.
 * The black-and-white print is named on every screen, phones too: every picture has a twin drawn for colouring in, which
 * few other charts offer (user feedback, November 2026).
 */
function PrintBadge() {
  const t = useT();
  return (
    <p className="rw-print-badge">
      <span className="rw-print-badge-pic" aria-hidden>
        🖨️
      </span>
      <span>
        <strong>{t({ de: "Zum Ausdrucken", en: "To print", zh: "可打印", hi: "प्रिंट के लिए", es: "Para imprimir", ar: "للطباعة", ru: "Для печати" })}</strong>{" "}
        <span className="rw-print-badge-more">
          {t({
            de: "auf A4, als Fotoabzug oder als Fotoposter – oder hier am Bildschirm abhaken",
            en: "on A4, as a photo print or as a photo poster – or tick it off here on screen",
            zh: "打印在纸上、冲印成照片或做成照片海报——也可以直接在屏幕上打勾",
            hi: "कागज़ पर, फ़ोटो प्रिंट या फ़ोटो पोस्टर के रूप में – या यहीं स्क्रीन पर निशान लगाएँ",
            es: "en A4, como copia fotográfica o como póster fotográfico, o márquela aquí en la pantalla",
            ar: "على الورق أو كصورة مطبوعة أو كملصق صور – أو ضعوا العلامات هنا على الشاشة",
            ru: "на A4, фотоотпечатком или фотопостером – или отмечайте прямо на экране",
          })}
        </span>{" "}
        <span className="rw-print-badge-ink">
          {t({
            de: "🖍️ auch schwarz-weiß, jedes Bild zum Ausmalen",
            en: "🖍️ also in black and white, every picture to color in",
            zh: "🖍️ 也可黑白打印，每张图都能涂色",
            hi: "🖍️ काला-सफ़ेद भी, हर चित्र में रंग भरें",
            es: "🖍️ también en blanco y negro, cada imagen para colorear",
            ar: "🖍️ وبالأبيض والأسود أيضًا، كل صورة للتلوين",
            ru: "🖍️ и чёрно-белая, каждую картинку можно раскрасить",
          })}
        </span>
      </span>
    </p>
  );
}
