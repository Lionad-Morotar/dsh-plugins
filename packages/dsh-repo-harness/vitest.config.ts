import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The host half only touches Node built-ins and injected seams; no DOM.
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
