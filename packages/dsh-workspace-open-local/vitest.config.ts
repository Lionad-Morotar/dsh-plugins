import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The entry reads `localStorage`; jsdom supplies it. Nothing here touches
    // the host menu's DOM any more, the contribution is plain data.
    environment: "jsdom",
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
  },
});
