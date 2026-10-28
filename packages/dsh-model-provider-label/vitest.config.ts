import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The module under test is a pure function over the slot's owner props; the
    // bundle case evaluates the real client file, so no DOM is needed either way.
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
