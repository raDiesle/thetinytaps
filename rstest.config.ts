import { defineConfig } from "@rstest/core";

// Unit tests (`yarn test`): data and logic checks in Node, no browser.
// The `@/` alias comes from tsconfig.json.
export default defineConfig({
  include: ["src/**/*.test.{ts,tsx}"],
});
