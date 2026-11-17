import { type ComponentType, createElement, lazy } from "react";

/** How long `page()` waits before it asks once more for a page's code that didn't come (a network's short hiccup). */
export const RETRY_WAIT_MS = 600;

/** Loads with `load`, and when that fails tries exactly once more after `waitMs` – never a loop. */
export function loadOnceMore<T>(load: () => Promise<T>, waitMs = RETRY_WAIT_MS): Promise<T> {
  return load().catch(() => new Promise<T>((resolve, reject) => setTimeout(() => load().then(resolve, reject), waitMs)));
}

/** Pages whose code failed to load, each with the way to make its loader new, for „Nochmal“ (`retryFailedPages`). */
const failed = new Set<() => void>();

/**
 * Makes every page whose code failed to load ask for it again when it is drawn next. React's `lazy` keeps a failed
 * load failed for good, so the error page's „Nochmal“ (`PageErrorBoundary`) would only show the error again without this.
 */
export function retryFailedPages() {
  for (const renew of failed) renew();
  failed.clear();
}

/**
 * A page loaded only when it is opened: `name` from the module `load` brings. A load that fails is tried once more
 * (`loadOnceMore`); failing again it throws to the error boundary, and `retryFailedPages` makes it load anew.
 */
export function lazyPage<K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K): ComponentType {
  const make = () =>
    lazy<ComponentType>(() =>
      loadOnceMore(load).then(
        (module) => ({ default: module[name] as ComponentType }),
        (error: unknown) => {
          failed.add(renew);
          throw error;
        },
      ),
    );
  const entry = { lazy: make() };
  const renew = () => {
    entry.lazy = make();
  };
  return lazyPages.bind(null, entry) as ComponentType;
}

/** What `lazyPage` returns, bound to its page: whichever loader is its newest (`retryFailedPages` makes a new one). */
function lazyPages(entry: { lazy: ComponentType }) {
  return createElement(entry.lazy);
}
