import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { entries, sectionGroups, SECTION_META } from "../src/content/book.ts";
import { catalog } from "../src/content/nav.ts";

const NOTE_MARKS = /[①②③④⑤⑥⑦⑧⑨]/g;

test("三十六计按顺序排齐", () => {
  assert.equal(entries.length, 36);
  assert.deepEqual(
    entries.map((entry) => entry.n),
    Array.from({ length: 36 }, (_, index) => index + 1),
  );
  assert.deepEqual(
    catalog.map((entry) => entry.n),
    entries.map((entry) => entry.n),
  );
  assert.equal(entries[0].title, "瞒天过海");
  assert.equal(entries[35].title, "走为上计");
});

test("六套各六计", () => {
  assert.deepEqual(
    sectionGroups().map((group) => [group.name, group.entries.length, group.from, group.to]),
    [
      ["胜战计", 6, 1, 6],
      ["敌战计", 6, 7, 12],
      ["攻战计", 6, 13, 18],
      ["混战计", 6, 19, 24],
      ["并战计", 6, 25, 30],
      ["败战计", 6, 31, 36],
    ],
  );
  assert.equal(
    SECTION_META.reduce((sum, section) => sum + (section.to - section.from + 1), 0),
    36,
  );
});

test("每一计保留原文、注释、译文，注释标号与原文一一对应", () => {
  for (const entry of entries) {
    assert.ok(entry.original.length >= 10, String(entry.n));
    assert.ok(entry.translation.length >= 20, String(entry.n));
    assert.ok(!entry.translation.includes("\n"), String(entry.n));
    assert.ok(entry.notes.length >= 1, String(entry.n));
    assert.deepEqual(
      entry.notes.map((note) => note[0]),
      entry.original.match(NOTE_MARKS),
      String(entry.n),
    );
  }
});

test("每一计都有完整的五步", () => {
  const cores = new Set();
  for (const entry of entries) {
    assert.ok(entry.understand.length > 24, String(entry.n));
    assert.equal(entry.core.split("。").length, 2, `${entry.n} ${entry.core}`);
    assert.ok(entry.core.endsWith("。"), entry.core);
    assert.ok(entry.logic.length >= 3, String(entry.n));
    assert.ok(entry.plain.length > 60, String(entry.n));
    assert.equal(entry.checks.length, 2, String(entry.n));
    for (const check of entry.checks) {
      assert.ok(check.question.endsWith("？"), check.question);
      assert.ok(check.answer.length > 20, check.question);
    }
    assert.ok(!cores.has(entry.core), entry.core);
    cores.add(entry.core);
  }
});

test("页面依次放原文、注释、译文，再按五步解析", () => {
  const entry = readFileSync(new URL("../src/components/entry-view.tsx", import.meta.url), "utf8");
  const order = ['id="original"', 'id="notes"', 'id="translation"', "<FiveSteps"].map((mark) =>
    entry.indexOf(mark),
  );
  assert.ok(order[0] > 0, "original");
  assert.deepEqual([...order].sort((a, b) => a - b), order);

  const steps = readFileSync(new URL("../src/components/steps.tsx", import.meta.url), "utf8");
  const labels = ["先理解", "找出核心观点", "重建逻辑", "用简单语言表达", "检查你是否能快速理解"];
  let cursor = 0;
  for (const label of labels) {
    const at = steps.indexOf(label, cursor);
    assert.ok(at > cursor, label);
    cursor = at;
  }
});
