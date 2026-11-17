import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { loadOnceMore } from "@/lib/lazyPage";
import { PageErrorView } from "./PageErrorBoundary";

// A page whose code didn't come (offline, a chunk gone after a deploy) blanked the whole app in fullscreen with no way
// back (code review, November 2026): now it is tried once more, then the error page shows a way to the shelf and
// „Nochmal“.

const source = (file: string) => readFileSync(join(import.meta.dir, "..", file), "utf8");

test("a page's code that didn't come is asked for exactly once more", async () => {
  let calls = 0;
  const flaky = () => (++calls === 1 ? Promise.reject(new Error("offline")) : Promise.resolve("page"));
  expect(await loadOnceMore(flaky, 1)).toBe("page");
  expect(calls).toBe(2);

  calls = 0;
  const gone = () => {
    calls++;
    return Promise.reject(new Error("gone"));
  };
  await expect(loadOnceMore(gone, 1)).rejects.toThrow("gone");
  expect(calls).toBe(2);
});

test("every page is loaded through lazyPage, under the error boundary", () => {
  const app = source("App.tsx");
  expect(app).toContain("return lazyPage(load, name);");
  expect(app).not.toMatch(/\blazy\(/);
  expect(app.indexOf("<PageErrorBoundary>")).toBeLessThan(app.indexOf("<Suspense"));
});

test("the error page shows the loading paper and two pictures, nothing to read", () => {
  const html = renderToStaticMarkup(<PageErrorView shelfLabel="Back to the bookshelf" againLabel="Again" onAgain={() => undefined} />);
  expect(html).toContain('class="boot page-error"');
  expect(html.match(/<button/g)?.length).toBe(2);
  expect(html).toContain("shelf-label-art");
  // Both are read out, and no word stands on the page.
  expect(html.match(/aria-label="[^"]+"/g)?.length).toBe(2);
  expect(html.replace(/<[^>]*>/g, "").trim()).toBe("");
});

test("the error page goes to the shelf by a real navigation and never reloads by itself", () => {
  const code = source("components/PageErrorBoundary.tsx");
  // Its labels are the shared ones, translated already (no new line waiting for its languages).
  expect(code).toContain("t(BACK_TO_SHELF)");
  expect(code).toContain("t(AGAIN)");
  expect(code).toContain("location.assign(routerBase())");
  expect(code).not.toMatch(/location\.reload|setTimeout|setInterval/);
  // „Nochmal“ loads a failed page anew: a lazy() that failed stays failed.
  expect(code).toContain("retryFailedPages()");
});
