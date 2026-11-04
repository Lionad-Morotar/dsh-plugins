import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Later slices anchor a menu row in the page, so the suite runs in a DOM
    // even though this slice's host face is pure.
    environment: "jsdom",
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
  },
});
