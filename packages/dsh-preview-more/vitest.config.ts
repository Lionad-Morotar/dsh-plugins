import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The preview plumbing is exercised as pure modules: suffix matching, file
    // address parsing and error mapping need no DOM. The viewport itself is
    // covered by the real GUI check, not a jsdom stand-in.
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
