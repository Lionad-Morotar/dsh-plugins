import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // The build produces this module from the pdfjs-dist worker; a test run has
      // no build, so it resolves to a stub. See test/support/pdf-worker-stub.ts
      // for why the stub is empty rather than the real payload.
      "virtual:pdf-worker": fileURLToPath(new URL("./test/support/pdf-worker-stub.ts", import.meta.url)),
    },
  },
  test: {
    // The engines and the mount lifecycle are exercised as pure modules: suffix
    // matching, address parsing, TIFF decoding and error mapping need no DOM. The
    // surfaces themselves are covered by the real GUI check, not a jsdom
    // stand-in; the exceptions are the 3MF test, which borrows jsdom's DOMParser
    // because that format is XML inside a zip, and the pdf surface, which parses
    // a real document and needs a canvas to hand pdf.js.
    environment: "node",
    include: ["test/**/*.test.ts"],
    // pdf.js touches browser globals while its module body evaluates, which is
    // earlier than any test file can install them.
    setupFiles: ["./test/support/pdf-globals.ts"],
  },
});
