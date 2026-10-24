import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // jsdom has no layout engine and its Selection lacks `modify`, so the DOM
    // tests build the window they need explicitly and inject the browser-only
    // caret primitive; a node environment keeps that window the only one in
    // the room.
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
