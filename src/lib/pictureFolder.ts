/** The lookups a game needs for a folder of pictures it imported with `?glob` (the glob itself stays in the game's file). */
export type PictureFolder = {
  /** The picture called `name` (file name without ".webp"), if there is one. */
  image(name: string): string | undefined;
  /** All frames of the picture `name`, first one first; empty while it is not made yet. */
  frames(name: string): string[];
  /** Starts loading these pictures with all their frames, so they don't pop in empty. */
  preload(names: string[]): void;
};

/**
 * Wraps the result of `import files from "./bilder/*.webp?glob"` (file name to url). `frameSuffixes` are the endings
 * a picture's extra frames carry ("" is the first frame, "-b" the second), which differ from game to game.
 */
export function pictureFolder(files: Record<string, string>, frameSuffixes: readonly string[] = [""]): PictureFolder {
  const images = new Map(Object.entries(files).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));
  const frames = (name: string) => frameSuffixes.flatMap((suffix) => images.get(name + suffix) ?? []);
  return {
    image: (name) => images.get(name),
    frames,
    preload(names) {
      for (const name of names) for (const src of frames(name)) new Image().src = src;
    },
  };
}

/** Resolves once every one of these picture files is loaded and decoded; a picture that fails to load never blocks it. */
export function decodePictures(urls: string[]): Promise<unknown> {
  return Promise.all(
    urls.map((src) => {
      const img = new Image();
      img.src = src;
      return img.decode().catch(() => undefined);
    }),
  );
}
