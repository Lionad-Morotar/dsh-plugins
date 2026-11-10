import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // Both extensions: the wiring contract is plain TS, the view it mounts is
    // TSX. The tests inject a fake context rather than a DOM, so no jsdom here.
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
  },
});
