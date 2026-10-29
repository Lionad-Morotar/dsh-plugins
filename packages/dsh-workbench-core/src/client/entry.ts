/**
 * Browser-half entry.
 *
 * Installs the `workbench` service and one settings section. The three feature
 * packages declare `inject: ["workbench"]`; the service is the only thing they
 * share with this bundle, so no feature package has to require another
 * package's client module.
 *
 * The service is provided before the section is registered: registration reads
 * the adapter snapshot, and a section that renders before the service exists
 * would report every adapter as missing.
 */
import { EN, ZH } from "./copy.ts";
import { LOCALE_NAMESPACE, SECTION_ID, SECTION_ORDER, SECTION_SLOT } from "./registration.ts";
import { createWorkbenchSection } from "./section.tsx";
import { createWorkbenchService } from "./service.ts";
import { WORKBENCH_SERVICE } from "../shared.ts";

/** The slice of the client context this entry uses. */
export interface ClientContextLike {
  readonly slots: {
    inject(slot: string, factory: () => () => void): unknown;
    register(options: Record<string, unknown>, component: unknown): () => void;
  };
  readonly locale: {
    register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void;
    bind(namespace: string): (key: string) => string;
  };
  /** Cordis service registration; present on every supported client host. */
  provide?(name: string, value: unknown): () => void;
  readonly logger?: { warn?(message: string): void };
}

/** Services this plugin waits for before applying. */
export const inject = ["slots", "locale"];

/** Mount the workbench service and its settings section. */
export function apply(ctx: ClientContextLike): () => void {
  const service = createWorkbenchService(ctx);
  const offService = ctx.provide?.(WORKBENCH_SERVICE, service);
  if (offService === undefined) {
    // Without the service the three feature packages stay pending, which is a
    // visible "row installed but no tabs" state; a warning is the only report
    // this half can make.
    ctx.logger?.warn?.(`${LOCALE_NAMESPACE}: ctx.provide unavailable, workbench service not registered`);
  }

  const t = ctx.locale.bind(LOCALE_NAMESPACE);
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
  const Section = createWorkbenchSection({ service, t });

  ctx.slots.inject(SECTION_SLOT, () =>
    ctx.slots.register(
      {
        name: SECTION_SLOT,
        id: SECTION_ID,
        order: SECTION_ORDER,
        label: () => t("section.title"),
        locale: LOCALE_NAMESPACE,
      },
      Section,
    ),
  );

  return () => {
    offLocale();
    offService?.();
  };
}

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-workbench-core", inject, apply };

export default clientPlugin;
