import { defineConfig } from "vitest/config";

export default defineConfig({
  // The acceptance command runs from the repo root with this config, so the
  // package directory has to be the root or `include` resolves against the
  // monorepo instead of this package.
  root: import.meta.dirname,
  test: {
    // The engine is pure: no DOM, no host, no timers. A node environment keeps
    // the suite honest about that, since nothing here should need a window.
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
