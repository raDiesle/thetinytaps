// Illustrations for the cards and stories. Drop a file into ./bilder/ with the
// right name (see bilder/README.md) and it shows instead of the drawing; until
// then the drawn picture stays.

const files = import.meta.webpackContext("./bilder", { regExp: /\.(webp|png|jpe?g)$/ });

const IMAGES = new Map<string, string>();
for (const key of files.keys()) {
  const module = files(key) as string | { default: string };
  const name = key.replace(/^\.\//, "").replace(/\.\w+$/, "");
  IMAGES.set(name, typeof module === "string" ? module : module.default);
}

/** The illustration called `name` ("push-1", "baer-hug"), if there is one. */
export function imageFor(name: string): string | undefined {
  return IMAGES.get(name);
}

/** Starts loading these illustrations, so the cards don't pop in empty. */
export function preloadImages(names: string[]) {
  for (const name of names) {
    const src = IMAGES.get(name);
    if (src) new Image().src = src;
  }
}

/** Names of the illustrations for one kindergarten story. */
export const storyImages = {
  /** What happened, shown at the top while the child chooses. */
  problem: (id: string) => `${id}-passiert`,
  /** The n-th good step, counted from 0. */
  step: (id: string, i: number) => `${id}-${i + 1}`,
  /** The not-so-good idea. */
  instead: (id: string) => `${id}-nein`,
};

/** Names of the illustrations for comforting the bear. */
export const bearImages = {
  /** How the bear feels at the start. */
  feeling: (id: string) => `baer-${id}`,
  comfort: (id: string) => `trost-${id}`,
};
