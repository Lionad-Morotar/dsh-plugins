import { describe, expect, it } from "vitest";

import { describeTerminal } from "../src/client/status.ts";

const t = (key: string): string => key;

describe("terminal status", () => {
  it("reports the host terminal limit as an error", () => {
    const status = describeTerminal({ phase: "failed", issue: "terminalLimit" }, t);
    expect(status.label).toBe("dock.limitReached");
    expect(status.tone).toBe("error");
    expect(status.ended).toBe(false);
  });

  it("disables input and says so while the view is read-only", () => {
    const status = describeTerminal(
      { phase: "connected", writable: false, info: { cols: 80, rows: 24, state: "running" } },
      t,
    );
    expect(status.readOnly).toBe(true);
    expect(status.label).toBe("dock.readOnly");
    expect(status.tone).toBe("warn");
  });

  it("treats a writable connected view as silent", () => {
    const status = describeTerminal(
      { phase: "connected", writable: true, info: { cols: 80, rows: 24, state: "running" } },
      t,
    );
    expect(status).toEqual({ tone: "info", readOnly: false, ended: false });
  });

  it("marks an exited shell as ended and keeps its code", () => {
    const status = describeTerminal({ phase: "connected", info: { cols: 80, rows: 24, state: "exited", exitCode: 130 } }, t);
    expect(status.ended).toBe(true);
    expect(status.label).toBe("dock.exited (130)");
  });

  it("reports a missing process rather than a generic failure", () => {
    const status = describeTerminal({ phase: "failed", issue: "missingTerminal" }, t);
    expect(status.label).toBe("dock.missing");
    expect(status.tone).toBe("error");
  });
});
