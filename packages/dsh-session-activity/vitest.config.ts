import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The fold is a pure reduction over durable events and the browser half is
    // not under test here, so nothing in this suite needs a DOM.
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
