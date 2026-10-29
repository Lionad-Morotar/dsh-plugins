import { describe, expect, it } from "vitest";

import {
  ARCHIVE_USAGE,
  UNARCHIVE_USAGE,
  parseArchiveInput,
  parseUnarchiveInput,
} from "../src/archive.ts";

describe("/archive grammar", () => {
  it("accepts an empty invocation as a plain archive", () => {
    expect(parseArchiveInput("")).toEqual({ ok: true, stopActivity: false });
  });

  it("accepts whitespace-only input as a plain archive", () => {
    expect(parseArchiveInput("   \n\t ")).toEqual({ ok: true, stopActivity: false });
  });

  it("reads --stop as stop-then-archive", () => {
    expect(parseArchiveInput("--stop")).toEqual({ ok: true, stopActivity: true });
  });

  it("reads --stop surrounded by whitespace", () => {
    expect(parseArchiveInput("  --stop  ")).toEqual({ ok: true, stopActivity: true });
  });

  it("rejects a repeated --stop, because the grammar has no defined winner", () => {
    expect(parseArchiveInput("--stop --stop")).toEqual({ ok: false, message: ARCHIVE_USAGE });
  });

  it("matches --stop exactly and does not case-fold the destructive flag", () => {
    // A flag that stops running work earns no spelling leniency: "--STOP" is a
    // typo to refuse, not an accent to forgive.
    expect(parseArchiveInput("--STOP")).toEqual({ ok: false, message: ARCHIVE_USAGE });
  });

  it("rejects any other token with the usage line", () => {
    expect(parseArchiveInput("session-42")).toEqual({ ok: false, message: ARCHIVE_USAGE });
    expect(parseArchiveInput("--stop extra")).toEqual({ ok: false, message: ARCHIVE_USAGE });
  });
});

describe("/unarchive grammar", () => {
  it("accepts an empty invocation", () => {
    expect(parseUnarchiveInput("")).toEqual({ ok: true });
  });

  it("accepts whitespace-only input", () => {
    expect(parseUnarchiveInput(" \n ")).toEqual({ ok: true });
  });

  it("rejects any argument: unarchive targets the current session only", () => {
    // Picking another archived session would need its title, which the client
    // never loads for archived rows; the sidebar's archived filter owns that
    // surface, so this command stays a one-target restore.
    expect(parseUnarchiveInput("session-42")).toEqual({ ok: false, message: UNARCHIVE_USAGE });
    expect(parseUnarchiveInput("--anything")).toEqual({ ok: false, message: UNARCHIVE_USAGE });
  });
});
