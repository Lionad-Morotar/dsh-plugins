import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The bundle contract is plain Node; the component case opts into jsdom
    // through its file directive.
    environment: "node",
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
  },
});
