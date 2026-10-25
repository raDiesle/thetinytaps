import { pluginReact } from "@rsbuild/plugin-react";
import { defineConfig } from "@rstest/core";

// Unit tests (`yarn test`): data and logic checks in Node, no browser.
// The `@/` alias comes from tsconfig.json; the React plugin lets a test render a drawing to markup.
export default defineConfig({
  plugins: [pluginReact()],
  include: ["src/**/*.test.{ts,tsx}"],
});
