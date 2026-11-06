/**
 * The mobile check in front of the picker's search focus.
 *
 * The shell stopped auto-focusing its popup search on phones and tablets in
 * 0.2.2, because that focus raises the on-screen keyboard over the list the user
 * just opened. This surface draws its own picker, so it has to make the same
 * call without importing the host's helper. The shapes below are the three that
 * matter: an ordinary desktop browser, a phone, and an iPad reporting a desktop
 * user agent (the case a plain UA regex misses).
 */
import { describe, expect, it } from "vitest";

import { isMobileDevice } from "../src/client/overlay.tsx";

/**
 * A navigator carrying only the three fields the check reads.
 * @param fields - overrides for the fields under test.
 * @returns the navigator double.
 */
function navigatorLike(fields: {
  userAgent?: string;
  platform?: string;
  maxTouchPoints?: number;
}): Navigator {
  return {
    userAgent: "",
    platform: "",
    maxTouchPoints: 0,
    ...fields,
  } as unknown as Navigator;
}

describe("isMobileDevice", () => {
  it("leaves desktop browsers on the automatic-focus path", () => {
    expect(isMobileDevice(navigatorLike({
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140.0 Safari/537.36",
      platform: "MacIntel",
    }))).toBe(false);
  });

  it("recognises phones and Android tablets", () => {
    expect(isMobileDevice(navigatorLike({
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148",
      platform: "iPhone",
    }))).toBe(true);
    expect(isMobileDevice(navigatorLike({
      userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel Tablet) AppleWebKit/537.36 Chrome/140.0 Safari/537.36",
      platform: "Linux armv8l",
    }))).toBe(true);
  });

  it("recognises a desktop-mode iPad by its touch points", () => {
    // iPadOS reports a Mac user agent and platform; only the touch count gives
    // it away, which is exactly why the shell's test includes it.
    expect(isMobileDevice(navigatorLike({
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15",
      platform: "MacIntel",
      maxTouchPoints: 5,
    }))).toBe(true);
  });

  it("does not mistake a touchscreen laptop for a tablet", () => {
    expect(isMobileDevice(navigatorLike({
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140.0 Safari/537.36",
      platform: "MacIntel",
      maxTouchPoints: 1,
    }))).toBe(false);
  });

  it("focuses normally when there is no browser navigator at all", () => {
    // Static renders and tests have no window; focus is then the caller's own
    // no-op rather than a reason to skip.
    expect(isMobileDevice(undefined)).toBe(false);
  });
});
