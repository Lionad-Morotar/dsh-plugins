/**
 * 监听决策的契约：这一击按键落在哪，要不要吃掉它，文档怎么解析。
 *
 * 这一层仍然不挂监听器，只回答「如果挂了，该不该 preventDefault」。所以测试
 * 全部打在 handle / parseDocument / regionOf 上，不构造真实 DOM 事件。
 *
 * consume 的口径只有一条：effect 不是 ignore 就吃掉。落空（miss）也吃，因为
 * 第一击已经被认领，第二击放行会让浏览器执行一个用户没打算做的动作。
 */
import { describe, expect, it } from "vitest";

import { createState, type Chord, type Sequence } from "../src/engine.ts";
import {
  STORAGE_KEY,
  handle,
  parseDocument,
  regionOf,
  type ListenInput,
} from "../src/listen.ts";

function chord(code: string, modifiers: Chord["modifiers"]): Chord {
  return { code, modifiers };
}

const saveAll: Sequence = {
  id: "save-all",
  first: chord("KeyK", ["control"]),
  second: chord("KeyS", ["control"]),
};

const closeAll: Sequence = {
  id: "close-all",
  first: chord("KeyW", ["control"]),
  second: chord("KeyQ", ["control"]),
};

function input(
  code: string,
  modifiers: Chord["modifiers"] = [],
  extra: Partial<ListenInput> = {},
): ListenInput {
  return {
    code,
    modifiers,
    repeat: false,
    composing: false,
    region: "page",
    ...extra,
  };
}

/** 只实现 regionOf 需要的那个方法，不引入真实 DOM。 */
function target(closestResult: unknown): { closest(selector: string): unknown } {
  return { closest: () => closestResult };
}

describe("handle", () => {
  it("page 上第一击命中时进入等待并吃掉该键", () => {
    const result = handle(createState(), input("KeyK", ["control"]), [saveAll], 1000);

    expect(result.effect).toBe("await");
    expect(result.consume).toBe(true);
  });

  it("page 上窗口内第二击一致时触发并带上 id", () => {
    const first = handle(createState(), input("KeyK", ["control"]), [saveAll], 1000);
    const result = handle(first.state, input("KeyS", ["control"]), [saveAll], 1500);

    expect(result.effect).toBe("fire");
    expect(result.consume).toBe(true);
    expect(result.id).toBe("save-all");
  });

  it("page 上第二击没有修饰键时落空，但仍然吃掉该键", () => {
    const first = handle(createState(), input("KeyK", ["control"]), [saveAll], 1000);
    const result = handle(first.state, input("KeyS", []), [saveAll], 1500);

    expect(result.effect).toBe("miss");
    expect(result.consume).toBe(true);
  });

  it("没有等待时落在终端不吃键也不进等待", () => {
    const result = handle(
      createState(),
      input("KeyK", ["control"], { region: "terminal" }),
      [saveAll],
      1000,
    );

    expect(result.effect).toBe("ignore");
    expect(result.consume).toBe(false);
  });

  it("终端放行之后 page 上按第一段仍能进入等待", () => {
    const inTerminal = handle(
      createState(),
      input("KeyK", ["control"], { region: "terminal" }),
      [saveAll],
      1000,
    );
    const onPage = handle(inTerminal.state, input("KeyK", ["control"]), [saveAll], 1100);

    expect(onPage.effect).toBe("await");
    expect(onPage.consume).toBe(true);
  });

  it("已在等待时落在终端会清掉等待且不吃键", () => {
    const first = handle(createState(), input("KeyK", ["control"]), [saveAll], 1000);
    const result = handle(
      first.state,
      input("KeyS", ["control"], { region: "terminal" }),
      [saveAll],
      1500,
    );

    expect(result.effect).toBe("ignore");
    expect(result.consume).toBe(false);
  });

  it("等待被终端清掉之后同一组合再按不会触发", () => {
    const first = handle(createState(), input("KeyK", ["control"]), [saveAll], 1000);
    const inTerminal = handle(
      first.state,
      input("KeyS", ["control"], { region: "terminal" }),
      [saveAll],
      1500,
    );
    const result = handle(inTerminal.state, input("KeyS", ["control"]), [saveAll], 1600);

    expect(result.effect).toBe("ignore");
    expect(result.consume).toBe(false);
  });

  it("未命中且没有等待时不吃键", () => {
    const result = handle(createState(), input("KeyZ", ["control"]), [saveAll], 1000);

    expect(result.effect).toBe("ignore");
    expect(result.consume).toBe(false);
  });

  it("repeat 不吃键也不清掉已有等待", () => {
    const first = handle(createState(), input("KeyK", ["control"]), [saveAll], 1000);
    const repeated = handle(
      first.state,
      input("KeyS", ["control"], { repeat: true }),
      [saveAll],
      1500,
    );

    expect(repeated.effect).toBe("ignore");
    expect(repeated.consume).toBe(false);

    // 等待还在，所以紧接着一次正常第二击仍然触发。
    const fire = handle(repeated.state, input("KeyS", ["control"]), [saveAll], 1600);
    expect(fire.effect).toBe("fire");
    expect(fire.id).toBe("save-all");
  });
});

describe("regionOf", () => {
  it("落在终端里认成 terminal", () => {
    expect(regionOf(target({}))).toBe("terminal");
  });

  it("closest 返回空认成 page", () => {
    expect(regionOf(target(null))).toBe("page");
  });

  it("目标为 null 时认成 page", () => {
    expect(regionOf(null)).toBe("page");
  });
});

describe("parseDocument", () => {
  const valid = JSON.stringify({ version: 1, sequences: [saveAll, closeAll] });

  it("读入两条合法序列得到两条", () => {
    const sequences = parseDocument(valid);

    expect(sequences).toHaveLength(2);
    expect(sequences.map((sequence) => sequence.id)).toEqual(["save-all", "close-all"]);
  });

  it("两段都相同的文档得到空数组", () => {
    const dup = { ...saveAll, id: "dup" };

    expect(parseDocument(JSON.stringify({ version: 1, sequences: [saveAll, dup] }))).toEqual([]);
  });

  it("坏 JSON 得到空数组且不抛错", () => {
    expect(parseDocument("{")).toEqual([]);
  });

  it("null 得到空数组", () => {
    expect(parseDocument(null)).toEqual([]);
  });

  it("版本不是 1 得到空数组", () => {
    expect(parseDocument(JSON.stringify({ version: 2, sequences: [saveAll] }))).toEqual([]);
  });

  it("sequences 不是数组得到空数组", () => {
    expect(parseDocument(JSON.stringify({ version: 1, sequences: {} }))).toEqual([]);
  });

  it("缺 second 的条目得到空数组", () => {
    const broken = { version: 1, sequences: [{ id: "half", first: chord("KeyK", ["control"]) }] };

    expect(parseDocument(JSON.stringify(broken))).toEqual([]);
  });
});

describe("STORAGE_KEY", () => {
  it("钉住存储键的名字", () => {
    expect(STORAGE_KEY).toBe("dsh-sequential-chords.v1");
  });
});
