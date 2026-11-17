import { Component, type ReactNode } from "react";
import { useLocation } from "react-router";
import { ShelfLabelArt } from "@/components/PageCornerArt";
import { useT } from "@/lib/language";
import { retryFailedPages } from "@/lib/lazyPage";
import { routerBase } from "@/lib/pageAddress";
import { AGAIN, BACK_TO_SHELF } from "@/lib/sharedTexts";
import "./pageError.css";

/**
 * The app's one error boundary (App.tsx), round every page: a page whose code didn't come (offline, a game never
 * played, or an old chunk gone after a deploy – `lazyPage` already tried once more) or that broke while drawing. An
 * empty screen in fullscreen had no way back, so instead it shows the loading paper (`PageLoading`'s `.boot`) with two
 * big pictures and nothing to read: the ribbon's shelf label goes to the shelf by a real navigation, so the app starts
 * afresh with its newest code, and a round arrow tries the page again. Nothing reloads by itself, so no loop.
 * A new address (the phone's back button) also tries again.
 */
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return <Boundary path={pathname}>{children}</Boundary>;
}

type BoundaryProps = { path: string; children: ReactNode };

class Boundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidUpdate(before: BoundaryProps) {
    if (this.state.failed && before.path !== this.props.path) this.again();
  }

  again = () => {
    retryFailedPages();
    this.setState({ failed: false });
  };

  render() {
    return this.state.failed ? <PageError onAgain={this.again} /> : this.props.children;
  }
}

/** What the boundary shows: the loading paper, the way back onto the shelf and „Nochmal“, both pictures read out. */
function PageError({ onAgain }: { onAgain: () => void }) {
  const t = useT();
  return <PageErrorView shelfLabel={t(BACK_TO_SHELF)} againLabel={t(AGAIN)} onAgain={onAgain} />;
}

/** `PageError` drawn with its labels given. */
export function PageErrorView({ shelfLabel, againLabel, onAgain }: { shelfLabel: string; againLabel: string; onAgain: () => void }) {
  return (
    <div className="boot page-error" role="alert">
      <div className="page-error-buttons">
        <button type="button" className="page-error-button" aria-label={shelfLabel} onClick={() => location.assign(routerBase())}>
          <ShelfLabelArt />
        </button>
        <button type="button" className="page-error-button" aria-label={againLabel} onClick={onAgain}>
          <svg className="page-error-again" viewBox="0 0 48 48" aria-hidden>
            {/* The app's yellow round arrow: most of a circle, its head at the top. */}
            <path d="M38 24A14 14 0 1 1 30 11.3" />
            <path d="M24 6l8 6-8 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
