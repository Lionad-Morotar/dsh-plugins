import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The bundle contract and the pure choice are plain Node; the entry case
    // opts into jsdom through its file directive.
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
