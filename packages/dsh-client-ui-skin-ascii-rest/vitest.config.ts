import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // The bundle test drives jsdom by hand so it can play the module loader's
    // role; vitest's own jsdom environment would install a second `window` and
    // the bundle's IIFE would see the wrong one.
    include: ["test/**/*.test.ts"],
  },
});
