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
      <span aria-hidden>📴</span> {t({ de: "Funktioniert auch ohne Internet.", ru: "Работает и без интернета." })}
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
          <span aria-hidden>📲</span> {t({ de: "Als App installieren", ru: "Установить как приложение" })}
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
