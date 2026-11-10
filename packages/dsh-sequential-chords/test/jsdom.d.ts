/**
 * jsdom 的最小类型声明。
 *
 * 本包没有 `@types/jsdom`（它只装在 dsh-better-keybindings 自己的 node_modules
 * 里，软链的根 node_modules 看不到），而安装态不许跑 pnpm，所以这里只声明
 * bundle 测试真正用到的那几个成员。用到的形状在 test/bundle.test.ts 里被断言，
 * 声明错了那里会先炸。
 */
declare module "jsdom" {
  export interface JSDOMOptions {
    url?: string;
    runScripts?: "dangerously" | "outside-only";
  }

  export class JSDOM {
    constructor(html?: string, options?: JSDOMOptions);
    readonly window: Window & typeof globalThis;
  }
}
