import { existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

import { describe, expect, it } from "vitest"

const here = dirname(fileURLToPath(import.meta.url))
const bundle = join(here, "..", "lib", "index.js")

describe("shipped bundle", () => {
  it("is the plugin object the Loader receives", async () => {
    expect(existsSync(bundle)).toBe(true)
    const module = (await import(pathToFileURL(bundle).href)) as {
      name?: unknown
      inject?: unknown
      apply?: unknown
      deliver?: unknown
    }
    expect(module.name).toBe("wakeup")
    expect(module.inject).toEqual([])
    expect(typeof module.apply).toBe("function")
    expect(typeof module.deliver).toBe("function")
  })
})
