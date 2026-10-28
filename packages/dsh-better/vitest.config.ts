import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The view tests build their own React element tree and never need a DOM:
    // what they assert is which rows were chosen and which callback fired, so a
    // real document would add a layout engine to reason about for nothing.
    environment: "node",
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
  },
});
