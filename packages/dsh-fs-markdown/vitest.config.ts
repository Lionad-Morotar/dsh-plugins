import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Node by default; the body tests opt into jsdom per file because only
    // they mount React.
    environment: "node",
    include: ["test/**/*.test.{ts,tsx}"],
  },
});
