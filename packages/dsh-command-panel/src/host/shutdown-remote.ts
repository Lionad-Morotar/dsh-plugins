/**
 * Host half of the quit row: one Remote endpoint that asks the host to exit.
 *
 * The panel used to probe `appExit` through the client context, which lives in
 * the browser and never sees the host process's Cordis tree — the probe always
 * answered false and the row could never appear. This service is the fix: the
 * same cross-process channel as the path explorer (`TypertRemoteService` plus
 * a `@Remote` endpoint, consumed as `remote.hostShutdown`), with the soft
 * `appExit` probe running host-side where the name actually resolves.
 *
 * No host service is declared: `appExit` is legitimately optional (older
 * hosts, non-DSH embeds), and a declared inject that never arrives would keep
 * this whole plugin pending forever. The probe stays soft inside
 * `requestShutdown`, so a host without `appExit` answers `unavailable` instead
 * of failing the plugin.
 */
import type { Context } from "@deepseek-ai/cordis";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";

import { SHUTDOWN_SERVICE, type ShutdownRequestResult } from "../shared.ts";
import { requestShutdown } from "./shutdown.ts";

export class HostShutdownService extends TypertRemoteService {
  static inject: string[] = [];

  readonly #ctx: Context;

  constructor(ctx: Context) {
    super(ctx, SHUTDOWN_SERVICE);
    this.#ctx = ctx;
  }

  /**
   * Relay one confirmed quit request to the host's `appExit`.
   *
   * Wire shape: no business parameters — the caller has already confirmed, and
   * the answer is only ever `"requested"` or `"unavailable"`, never a throw.
   */
  @Remote("request")
  async request(): Promise<ShutdownRequestResult> {
    return requestShutdown(this.#ctx);
  }
}

export default HostShutdownService;
