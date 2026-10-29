import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The pure modules are DOM-free; the few DOM tests build their own JSDOM
    // instance so a single global window never leaks between suites.
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
