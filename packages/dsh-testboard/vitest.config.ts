import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // Both extensions: the read model and the generator are plain TS, the board's
    // rendered behaviour is TSX.
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
    // The view suite drives jsdom and fake polling. It passes in a few seconds
    // on its own, but the same suite also runs as one project of a full monorepo
    // run, where the event loop is shared with every other package; 15s keeps a
    // loaded machine from turning scheduling noise into a red board.
    testTimeout: 15_000,
  },
});
