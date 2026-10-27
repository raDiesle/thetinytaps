/** `import files from "./musik/*.mp3?glob"`: each matching file's bundled URL (a JSON file: its content), by its path below the pattern's folder (tools/appPlugin.ts). */
declare module "*?glob" {
  const files: Readonly<Record<string, string>>;
  export default files;
}

/** `import "./socks.css"`: the stylesheet comes with the importing chunk (tools/appPlugin.ts). */
declare module "*.css";
