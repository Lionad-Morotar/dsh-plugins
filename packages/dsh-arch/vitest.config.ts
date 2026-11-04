import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    // Node 26 exposes a `localStorage` global that is undefined without
    // --localstorage-file, and vitest keeps it over the jsdom window's own
    // Storage. The shim re-points the global at jsdom's instance.
    setupFiles: ["test/setup.ts"],
  },
});
