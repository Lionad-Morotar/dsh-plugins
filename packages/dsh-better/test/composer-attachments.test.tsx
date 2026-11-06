/**
 * The shadowed attachment rail's one new obligation.
 *
 * 0.2.2's shipped rail resolves an application-internal drag through a reader
 * that its own registration injects from `fileDrag`. This package shadows that
 * registration, so the reader has to arrive through this wrapper's props and be
 * passed on unchanged — the shipped drop handler calls it unguarded on release,
 * and `undefined` there is a thrown `TypeError` instead of an attachment.
 *
 * Rendered to static markup: what is asserted is the props the child receives,
 * and no DOM is needed to answer that.
 */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  createComposerAttachments,
  pasteBusyNotice,
  type ComposerAttachmentsProps,
} from "../src/client/composer-attachments.tsx";

/**
 * Build the wrapper over a native stub that records the share it received.
 * @returns the component and the last props the shipped rail was rendered with.
 */
function mount() {
  let received: ComposerAttachmentsProps | undefined;
  const Native = (props: ComposerAttachmentsProps) => {
    received = props;
    return null;
  };
  const ComposerAttachments = createComposerAttachments({
    native: () => Native,
    pathOf: () => "",
    reader: () => undefined,
    translate: () => undefined,
  });
  return {
    render: (props: ComposerAttachmentsProps) => renderToStaticMarkup(createElement(ComposerAttachments, props)),
    received: () => received,
  };
}

describe("createComposerAttachments", () => {
  it("hands the shipped rail the drag reader the slot injected", () => {
    const file = { name: "shot.png" } as unknown as File;
    const readFileDrag = (): File | undefined => file;
    const { render, received } = mount();
    render({ readFileDrag, sessionId: "session-1" });
    expect(received()?.readFileDrag).toBe(readFileDrag);
    expect(received()?.sessionId).toBe("session-1");
  });

  it("renders the shipped rail rather than a replacement", () => {
    const { render, received } = mount();
    render({ sessionId: "session-1" });
    expect(received()).toBeDefined();
  });
});

describe("pasteBusyNotice", () => {
  const translate = (key: string): string => (key === "attach.pasteBusy" ? "消息正在发送，稍后再粘贴" : key);

  it("explains a paste the frozen composer cannot take", () => {
    // Before this the text was refused by `insertText` and nothing changed on
    // screen, which reads as "the clipboard was empty".
    expect(pasteBusyNotice("sending", translate)).toBe("消息正在发送，稍后再粘贴");
  });

  it("does not interfere with a paste the composer can take", () => {
    expect(pasteBusyNotice("plain", translate)).toBeUndefined();
    expect(pasteBusyNotice(undefined, translate)).toBeUndefined();
  });
});
