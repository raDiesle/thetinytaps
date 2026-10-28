import { useT } from "@/lib/language";
import { install, isIos, isStandalone, usePwa } from "@/lib/pwa";

/**
 * Small note for parents under the home page menu: install as an app, and
 * whether the games already work without internet.
 */
export function InstallHint() {
  const t = useT();
  const { offlineReady, installPrompt, installed } = usePwa();
  const app = installed || isStandalone();
  const offline = offlineReady && (
    <span>
      <span aria-hidden>📴</span>{" "}
      {t({
        de: "Funktioniert auch ohne Internet.",
        ru: "Работает и без интернета.",
        en: "Works without internet too.",
        zh: "没有网络也能玩。",
        hi: "इंटरनेट के बिना भी चलता है।",
        es: "Funciona también sin internet.",
        ar: "يعمل أيضًا دون إنترنت.",
      })}
    </span>
  );

  if (app)
    return offline ? (
      <p className="install-hint" data-below-fold>
        {offline}
      </p>
    ) : null;
  if (installPrompt) {
    return (
      <p className="install-hint" data-below-fold>
        <button type="button" className="install-button" onClick={() => void install()}>
          <span aria-hidden>📲</span>{" "}
          {t({
            de: "Als App installieren",
            ru: "Установить как приложение",
            en: "Install as an app",
            zh: "安装为应用",
            hi: "ऐप के रूप में इंस्टॉल करें",
            es: "Instalar como app",
            ar: "التثبيت كتطبيق",
          })}
        </button>
        {offline}
      </p>
    );
  }
  if (isIos()) {
    return (
      <p className="install-hint" data-below-fold>
        <span>
          <span aria-hidden>📲</span>{" "}
          {t({
            de: (
              <>
                Als App: in Safari auf <b>Teilen</b> tippen, dann <b>„Zum Home-Bildschirm“</b>.
              </>
            ),
            ru: (
              <>
                Как приложение: в Safari нажмите <b>«Поделиться»</b>, затем <b>«На экран „Домой“»</b>.
              </>
            ),
            en: (
              <>
                As an app: in Safari tap <b>Share</b>, then <b>“Add to Home Screen”</b>.
              </>
            ),
            zh: (
              <>
                作为应用：在 Safari 中点按<b>“分享”</b>，再点<b>“添加到主屏幕”</b>。
              </>
            ),
            hi: (
              <>
                ऐप की तरह: Safari में <b>शेयर</b> पर टैप करें, फिर <b>“होम स्क्रीन में जोड़ें”</b>।
              </>
            ),
            es: (
              <>
                Como app: en Safari toque <b>Compartir</b> y luego <b>«Añadir a pantalla de inicio»</b>.
              </>
            ),
            ar: (
              <>
                كتطبيق: في Safari اضغطوا على <b>مشاركة</b>، ثم <b>«إضافة إلى الشاشة الرئيسية»</b>.
              </>
            ),
          })}
        </span>
        {offline}
      </p>
    );
  }
  return offline ? (
    <p className="install-hint" data-below-fold>
      {offline}
    </p>
  ) : null;
}
