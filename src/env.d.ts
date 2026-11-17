/** `import files from "./musik/*.mp3?glob"`: each matching file's bundled URL (a JSON file: its content), by its path below the pattern's folder (tools/appPlugin.ts). */
declare module "*?glob" {
  const files: Readonly<Record<string, string>>;
  export default files;
}

/**
 * `import byLanguage from "./stimme/**\/*.mp3?glob-by-language"`: the same map split by language (a file's language
 * folder, German outside one), each part loaded when asked for, as a chunk of its own (tools/appPlugin.ts).
 */
declare module "*?glob-by-language" {
  const parts: Readonly<Record<string, () => Promise<{ default: Readonly<Record<string, string>> }>>>;
  export default parts;
}

/** `import "./socks.css"`: the stylesheet comes with the importing chunk (tools/appPlugin.ts). */
declare module "*.css";
