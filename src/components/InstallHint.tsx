import { install, isIos, isStandalone, usePwa } from "@/lib/pwa";

/**
 * Small note for parents under the home page menu: install as an app, and
 * whether the games already work without internet.
 */
export function InstallHint() {
  const { offlineReady, installPrompt, installed } = usePwa();
  const app = installed || isStandalone();
  const offline = offlineReady && (
    <span>
      <span aria-hidden>📴</span> Funktioniert auch ohne Internet.
    </span>
  );

  if (app) return offline ? <p className="install-hint">{offline}</p> : null;
  if (installPrompt) {
    return (
      <p className="install-hint">
        <button type="button" className="install-button" onClick={() => void install()}>
          <span aria-hidden>📲</span> Als App installieren
        </button>
        {offline}
      </p>
    );
  }
  if (isIos()) {
    return (
      <p className="install-hint">
        <span>
          <span aria-hidden>📲</span> Als App: in Safari auf <b>Teilen</b> tippen, dann <b>„Zum Home-Bildschirm“</b>.
        </span>
        {offline}
      </p>
    );
  }
  return offline ? <p className="install-hint">{offline}</p> : null;
}
