import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The engines and the mount lifecycle are exercised as pure modules: suffix
    // matching, address parsing, TIFF decoding and error mapping need no DOM. The
    // surfaces themselves are covered by the real GUI check, not a jsdom
    // stand-in; the one exception is the 3MF test, which borrows jsdom's
    // DOMParser because that format is XML inside a zip.
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
