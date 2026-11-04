// @vitest-environment jsdom
/**
 * The relations pane: the floating card's DOM contract.
 *
 * jsdom has no layout, so `offsetWidth`/`offsetHeight` are zero and the flip
 * logic sees a zero-sized card. The assertions therefore cover what the pane
 * guarantees regardless of measurement: the two group headings, the endpoint
 * capsules, the optional meta lines, the three dismissal paths, and that a
 * closed pane is absent from the DOM rather than merely hidden.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mountArchRelationsPane, type RelationsPanePayload } from "../src/client/relations.tsx";
import type { ArchRelationGroups } from "../src/client/relations-data.ts";

const groups: ArchRelationGroups = {
  direct: [
    {
      id: "r1",
      title: "使用与维护",
      technology: null,
      description: null,
      source: { id: "user", short: "user", full: "user" },
      target: { id: "dshPlugins", short: "dshPlugins", full: "dshPlugins" },
    },
  ],
  nested: [
    {
      id: "r2",
      title: "boot(require) 安装加载器",
      technology: "TypeScript",
      description: "加载器入口",
      source: { id: "dshPlugins.skin.entry", short: "entry", full: "dshPlugins.skin.entry" },
      target: { id: "dshHost", short: "dshHost", full: "dshHost" },
    },
  ],
};

function payload(overrides: Partial<RelationsPanePayload> = {}): RelationsPanePayload {
  return {
    title: "使用与维护",
    subtitle: "user → dshPlugins",
    groups,
    anchor: { x: 40, y: 60, width: 80, height: 18 },
    host: { width: 1200, height: 800 },
    ...overrides,
  };
}

let host: HTMLElement;

beforeEach(() => {
  document.body.replaceChildren();
  host = document.createElement("div");
  host.style.position = "relative";
  document.body.append(host);
});

describe("relations pane", () => {
  it("stays out of the DOM until something is rendered", () => {
    const pane = mountArchRelationsPane(host, { onClose: vi.fn() });
    expect(pane.isOpen()).toBe(false);
    expect(host.querySelector("[data-arch-relations]")).toBeNull();
  });

  it("renders both group headings with their rows", () => {
    const pane = mountArchRelationsPane(host, { onClose: vi.fn() });
    pane.render(payload());
    expect(pane.isOpen()).toBe(true);

    const headings = [...host.querySelectorAll("[data-arch-relations-group]")].map(
      node => node.textContent,
    );
    expect(headings).toEqual(["DIRECT", "RESOLVED FROM NESTED"]);

    const rows = [...host.querySelectorAll("[data-arch-relation-row]")];
    expect(rows).toHaveLength(2);
    expect(rows.map(row => row.getAttribute("data-relation-id"))).toEqual(["r1", "r2"]);
  });

  it("shows the endpoint capsules with short names and full names on hover", () => {
    const pane = mountArchRelationsPane(host, { onClose: vi.fn() });
    pane.render(payload());
    const nested = host.querySelector('[data-relation-id="r2"]') as HTMLElement;
    // The nested row's source is a child element, so its capsule shows the
    // trailing segment while the title attribute keeps the full path.
    const capsules = [...nested.querySelectorAll("span")].filter(span => span.title !== "");
    const entry = capsules.find(span => span.textContent === "entry");
    expect(entry).toBeDefined();
    expect(entry?.getAttribute("title")).toBe("dshPlugins.skin.entry");
  });

  it("renders technology and description only when the record carried them", () => {
    const pane = mountArchRelationsPane(host, { onClose: vi.fn() });
    pane.render(payload());
    const direct = host.querySelector('[data-relation-id="r1"]')?.textContent ?? "";
    const nested = host.querySelector('[data-relation-id="r2"]')?.textContent ?? "";
    expect(direct).not.toContain("technology:");
    expect(nested).toContain("technology: TypeScript");
    expect(nested).toContain("加载器入口");
  });

  it("omits a group whose rows are all nested, and says so when both are empty", () => {
    const pane = mountArchRelationsPane(host, { onClose: vi.fn() });
    pane.render(payload({ groups: { direct: [], nested: groups.nested } }));
    const headings = [...host.querySelectorAll("[data-arch-relations-group]")].map(node => node.textContent);
    expect(headings).toEqual(["RESOLVED FROM NESTED"]);

    pane.render(payload({ groups: { direct: [], nested: [] } }));
    expect(host.querySelectorAll("[data-arch-relations-group]")).toHaveLength(0);
    expect(host.querySelector("[data-arch-relations]")?.textContent).toContain("no relationships recorded");
  });

  it("removes itself from the DOM when closed with null", () => {
    const pane = mountArchRelationsPane(host, { onClose: vi.fn() });
    pane.render(payload());
    expect(host.querySelector("[data-arch-relations]")).not.toBeNull();
    pane.render(null);
    expect(pane.isOpen()).toBe(false);
    expect(host.querySelector("[data-arch-relations]")).toBeNull();
  });

  it("closes through the × button", () => {
    const onClose = vi.fn();
    const pane = mountArchRelationsPane(host, { onClose });
    pane.render(payload());
    (host.querySelector("[data-arch-relations-close]") as HTMLElement).click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("reports a picked row and never lets a press reach the canvas", () => {
    const onPick = vi.fn();
    const onClose = vi.fn();
    const pane = mountArchRelationsPane(host, { onClose, onPick });
    pane.render(payload());
    const row = host.querySelector('[data-relation-id="r1"]') as HTMLElement;
    row.click();
    expect(onPick).toHaveBeenCalledTimes(1);
    expect((onPick.mock.calls[0] as [{ id: string }])[0].id).toBe("r1");
    // A press inside the pane must not bubble to the canvas behind it, which
    // would close the pane on the same click.
    const bubbled = vi.fn();
    host.addEventListener("pointerdown", bubbled);
    (host.querySelector("[data-arch-relations]") as HTMLElement).dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true }),
    );
    expect(bubbled).not.toHaveBeenCalled();
  });

  it("positions itself from the anchor it was given", () => {
    const pane = mountArchRelationsPane(host, { onClose: vi.fn() });
    pane.render(payload());
    const element = host.querySelector("[data-arch-relations]") as HTMLElement;
    // Below-right of the anchor by default.
    expect(element.style.left).toBe("40px");
    expect(element.style.top).toBe("86px");
  });

  it("flips above and to the left when the anchor sits near the far corner", () => {
    const pane = mountArchRelationsPane(host, { onClose: vi.fn() });
    pane.render(
      payload({
        anchor: { x: 1150, y: 780, width: 40, height: 18 },
        host: { width: 1200, height: 800 },
      }),
    );
    const element = host.querySelector("[data-arch-relations]") as HTMLElement;
    // jsdom reports zero height, so the vertical flip resolves to the anchor's
    // own top edge minus the offset; the horizontal flip pulls the card inside.
    const left = Number.parseFloat(element.style.left);
    const top = Number.parseFloat(element.style.top);
    expect(left).toBeLessThanOrEqual(1200);
    expect(left).toBeGreaterThanOrEqual(0);
    expect(top).toBeGreaterThanOrEqual(0);
    expect(top).toBeLessThanOrEqual(800);
  });
});
