import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The host half is a pure fold over durable events; nothing here touches the
    // DOM, so the node environment keeps the plugin's own realm boundary visible.
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
