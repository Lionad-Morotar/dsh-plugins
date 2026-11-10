/**
 * 两段式快捷键的判定契约。
 *
 * 这里只打公开缝：createState / lintSequences / step。状态对象是不透明的，
 * 「状态被清空」一律用后续 step 的 effect 反证，不去读内部字段。
 *
 * 时间全部由 nowMs 显式喂进来，窗口是 2000ms，所以截止时刻的边界（等于与
 * 超出 1ms）可以写成字面量断言，不依赖真实时钟。
 */
import { describe, expect, it } from "vitest";

import {
  createState,
  lintSequences,
  step,
  type Chord,
  type KeyEvent,
  type Sequence,
} from "../src/engine.ts";

const WINDOW_MS = 2000;

function key(
  code: string,
  modifiers: KeyEvent["modifiers"] = [],
  extra: Partial<KeyEvent> = {},
): KeyEvent {
  return { code, modifiers, repeat: false, composing: false, ...extra };
}

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

describe("step", () => {
  it("第一击命中第一段时进入等待", () => {
    const result = step(createState(), key("KeyK", ["control"]), [saveAll], 1000);

    expect(result.effect).toBe("await");
  });

  it("没有匹配的序列时忽略", () => {
    const result = step(createState(), key("KeyZ", ["control"]), [saveAll], 1000);

    expect(result.effect).toBe("ignore");
  });

  it("截止前第二击一致时触发并带上序列 id", () => {
    const first = step(createState(), key("KeyK", ["control"]), [saveAll], 1000);
    const result = step(first.state, key("KeyS", ["control"]), [saveAll], 1500);

    expect(result.effect).toBe("fire");
    expect(result.id).toBe("save-all");
  });

  it("第二段修饰键顺序不同也算一致", () => {
    const both: Sequence = {
      id: "both",
      first: chord("KeyK", ["control", "shift"]),
      second: chord("KeyS", ["control", "shift"]),
    };

    const first = step(createState(), key("KeyK", ["shift", "control"]), [both], 0);
    expect(first.effect).toBe("await");

    const result = step(first.state, key("KeyS", ["shift", "control"]), [both], 500);
    expect(result.effect).toBe("fire");
    expect(result.id).toBe("both");
  });

  it("第二击 code 相同但没有修饰键是 miss", () => {
    const first = step(createState(), key("KeyK", ["control"]), [saveAll], 0);
    const result = step(first.state, key("KeyS", []), [saveAll], 500);

    expect(result.effect).toBe("miss");
  });

  it("第二击只有 shift 是 miss", () => {
    const first = step(createState(), key("KeyK", ["control"]), [saveAll], 0);
    const result = step(first.state, key("KeyS", ["shift"]), [saveAll], 500);

    expect(result.effect).toBe("miss");
  });

  it("miss 之后等待被清掉", () => {
    const first = step(createState(), key("KeyK", ["control"]), [saveAll], 0);
    const miss = step(first.state, key("KeyS", []), [saveAll], 500);
    const after = step(miss.state, key("KeyS", ["control"]), [saveAll], 600);

    expect(after.effect).toBe("ignore");
  });

  it("nowMs 等于截止时刻仍然触发", () => {
    const first = step(createState(), key("KeyK", ["control"]), [saveAll], 1000);
    const result = step(first.state, key("KeyS", ["control"]), [saveAll], 1000 + WINDOW_MS);

    expect(result.effect).toBe("fire");
    expect(result.id).toBe("save-all");
  });

  it("超过截止时刻 1ms 时第二击不再触发", () => {
    const first = step(createState(), key("KeyK", ["control"]), [saveAll], 1000);
    const result = step(first.state, key("KeyS", ["control"]), [saveAll], 1000 + WINDOW_MS + 1);

    expect(result.effect).toBe("ignore");
  });

  it("超过截止时刻后第一击重新开始等待", () => {
    const first = step(createState(), key("KeyK", ["control"]), [saveAll], 1000);
    const result = step(first.state, key("KeyK", ["control"]), [saveAll], 1000 + WINDOW_MS + 1);

    expect(result.effect).toBe("await");
  });

  it("repeat 不触发也不改变截止时刻", () => {
    const first = step(createState(), key("KeyK", ["control"]), [saveAll], 0);
    const repeated = step(
      first.state,
      key("KeyS", ["control"], { repeat: true }),
      [saveAll],
      1000,
    );
    expect(repeated.effect).toBe("ignore");

    const fire = step(repeated.state, key("KeyS", ["control"]), [saveAll], 1500);
    expect(fire.effect).toBe("fire");
  });

  it("repeat 不刷新截止时刻", () => {
    // 第一击在 0，窗口到 2000。1000 处的 repeat 若刷新了截止时刻，2100 就会
    // 落进新窗口并触发；期望是 ignore，说明截止时刻仍是第一击算出来的那个。
    const first = step(createState(), key("KeyK", ["control"]), [saveAll], 0);
    const repeated = step(
      first.state,
      key("KeyK", ["control"], { repeat: true }),
      [saveAll],
      1000,
    );
    const result = step(repeated.state, key("KeyS", ["control"]), [saveAll], 2100);

    expect(result.effect).toBe("ignore");
  });

  it("repeat 的第一击不进入等待", () => {
    const result = step(
      createState(),
      key("KeyK", ["control"], { repeat: true }),
      [saveAll],
      0,
    );

    expect(result.effect).toBe("ignore");
  });

  it("composing 清掉等待且不触发", () => {
    const first = step(createState(), key("KeyK", ["control"]), [saveAll], 0);
    const result = step(
      first.state,
      key("KeyS", ["control"], { composing: true }),
      [saveAll],
      500,
    );
    expect(result.effect).toBe("ignore");

    const after = step(result.state, key("KeyS", ["control"]), [saveAll], 600);
    expect(after.effect).toBe("ignore");
  });

  it("等待中按下另一条序列的第一段是 miss", () => {
    const first = step(createState(), key("KeyK", ["control"]), [saveAll, closeAll], 0);
    const result = step(first.state, key("KeyW", ["control"]), [saveAll, closeAll], 500);

    expect(result.effect).toBe("miss");
  });

  it("Insert 然后 R 与 Insert 然后 Y 各自触发", () => {
    const insertR: Sequence = {
      id: "insert-r",
      first: chord("Insert", []),
      second: chord("KeyR", []),
    };
    const insertY: Sequence = {
      id: "insert-y",
      first: chord("Insert", []),
      second: chord("KeyY", []),
    };
    const sequences = [insertR, insertY];

    const waiting = step(createState(), key("Insert"), sequences, 0);
    expect(waiting.effect).toBe("await");

    const firedR = step(waiting.state, key("KeyR"), sequences, 200);
    expect(firedR.effect).toBe("fire");
    expect(firedR.id).toBe("insert-r");

    const again = step(createState(), key("Insert"), sequences, 0);
    const firedY = step(again.state, key("KeyY"), sequences, 200);
    expect(firedY.effect).toBe("fire");
    expect(firedY.id).toBe("insert-y");
  });

  it("一次 step 只完成一段，触发后状态清空", () => {
    const first = step(createState(), key("KeyK", ["control"]), [saveAll], 0);
    const fire = step(first.state, key("KeyS", ["control"]), [saveAll], 100);
    expect(fire.effect).toBe("fire");

    const again = step(fire.state, key("KeyS", ["control"]), [saveAll], 200);
    expect(again.effect).toBe("ignore");
  });
});

describe("lintSequences", () => {
  it("合法序列通过", () => {
    expect(lintSequences([saveAll, closeAll])).toEqual({ ok: true });
  });

  it("第一段相同、第二段不同的两条序列可以共存", () => {
    const other: Sequence = {
      id: "other",
      first: chord("KeyK", ["control"]),
      second: chord("KeyJ", ["control"]),
    };

    expect(lintSequences([saveAll, other])).toEqual({ ok: true });
  });

  it("两段都相同才报 prefix，修饰键顺序不同也算同一条", () => {
    const again: Sequence = {
      id: "again",
      first: chord("KeyK", ["shift", "control"]),
      second: chord("KeyS", ["control"]),
    };
    const first: Sequence = {
      id: "first",
      first: chord("KeyK", ["control", "shift"]),
      second: chord("KeyS", ["control"]),
    };

    expect(lintSequences([first, again])).toEqual({ ok: false, reason: "prefix" });
  });

  it("Insert 后面可以接不同的裸字母", () => {
    const insertR: Sequence = {
      id: "insert-r",
      first: chord("Insert", []),
      second: chord("KeyR", []),
    };
    const insertY: Sequence = {
      id: "insert-y",
      first: chord("Insert", []),
      second: chord("KeyY", []),
    };

    expect(lintSequences([insertR, insertY])).toEqual({ ok: true });
  });

  it("普通键当第一段、裸字母当第二段，仍然拒绝", () => {
    const bad: Sequence = {
      id: "bad",
      first: chord("KeyK", ["control"]),
      second: chord("KeyR", []),
    };

    expect(lintSequences([bad])).toEqual({ ok: false, reason: "modifier" });
  });

  it("第一段没有修饰键报 modifier", () => {
    const bad: Sequence = {
      id: "bad",
      first: chord("KeyK", []),
      second: chord("KeyS", ["control"]),
    };

    expect(lintSequences([bad])).toEqual({ ok: false, reason: "modifier" });
  });

  it("第二段只有 shift 报 modifier", () => {
    const bad: Sequence = {
      id: "bad",
      first: chord("KeyK", ["control"]),
      second: chord("KeyS", ["shift"]),
    };

    expect(lintSequences([bad])).toEqual({ ok: false, reason: "modifier" });
  });
});
