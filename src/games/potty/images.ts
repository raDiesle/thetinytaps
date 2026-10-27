// The pictures of the potty story, all in ./bilder/ (see bilder/README.md), named
// "<animal>-<picture>": "fox-essen", "fox-warten-giesskanne". A second frame "-b"
// fades in and out with the first, so the animals move a little (as in „Gefühle“).

const files = import.meta.webpackContext("./bilder", { regExp: /\.webp$/ });

const IMAGES = new Map<string, string>();
for (const key of files.keys()) {
  const module = files(key) as string | { default: string };
  IMAGES.set(key.replace(/^\.\//, "").replace(/\.webp$/, ""), typeof module === "string" ? module : module.default);
}

/** All frames of the picture `name`, first one first; empty if there is none. */
export function framesFor(name: string): string[] {
  return ["", "-b"].flatMap((suffix) => IMAGES.get(name + suffix) ?? []);
}

/** Starts loading these pictures with all their frames, so they don't pop in empty. */
export function preloadImages(names: string[]) {
  for (const name of names) for (const src of framesFor(name)) new Image().src = src;
}
