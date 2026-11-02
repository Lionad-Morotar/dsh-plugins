import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // The DOM-facing suite mounts React, which needs the jsdom environment
    // declared per file; discovery still has to see those .tsx files.
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
  },
});
