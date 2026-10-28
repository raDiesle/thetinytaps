/** `import files from "./musik/*.mp3?glob"`: each matching file's bundled URL (a JSON file: its content), by its path below the pattern's folder (tools/appPlugin.ts). */
declare module "*?glob" {
  const files: Readonly<Record<string, string>>;
  export default files;
}

/** `import inline from "inline-texts:ru"`: the Russian texts written inline in the code, by key (tools/inlineTexts.ts). */
declare module "inline-texts:*" {
  const texts: Readonly<Record<string, string>>;
  export default texts;
}

/** `import "./socks.css"`: the stylesheet comes with the importing chunk (tools/appPlugin.ts). */
declare module "*.css";
