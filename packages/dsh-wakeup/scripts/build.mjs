import { build } from "esbuild"
import { readFileSync, writeFileSync } from "node:fs"

await build({
  entryPoints: ["src/index.ts"],
  outfile: "lib/index.js",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  external: ["node:*"],
  logLevel: "info",
})
console.log("built lib/index.js")
