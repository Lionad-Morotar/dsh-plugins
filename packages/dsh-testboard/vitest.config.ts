import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // Both extensions: the read model and the generator are plain TS, the board's
    // rendered behaviour is TSX.
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
  },
});
