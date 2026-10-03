import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
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

function assertChain(chain, breaks, label) {
  assert.ok(chain.length >= 6, label);
  assert.equal(chain[0].via, undefined, label);
  for (const link of chain.slice(1)) {
    assert.ok(link.via, `${label} ${link.claim}`);
    assert.ok(!link.claim.startsWith(link.via), `${label} repeats via: ${link.claim}`);
  }
  for (const link of chain) assert.ok(link.detail.length >= 20, `${label} ${link.claim}`);
  assert.ok(chain.at(-1).claim.startsWith("结果"), label);
  assert.ok(breaks.length >= 2, label);
}

test("总览的五步同样用逻辑因果链", async () => {
  const { overviewPlain } = await import("../src/content/overview.ts");
  assert.equal(overviewPlain.logic, undefined);
  assertChain(overviewPlain.chain, overviewPlain.breaks, "overview");
});

test("每一计都有完整的五步", () => {
  const cores = new Set();
  for (const entry of entries) {
    assert.ok(entry.understand.length > 24, String(entry.n));
    assert.equal(entry.core.split("。").length, 2, `${entry.n} ${entry.core}`);
    assert.ok(entry.core.endsWith("。"), entry.core);
    assert.equal(entry.logic, undefined, String(entry.n));
    assertChain(entry.chain, entry.breaks, String(entry.n));
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
  const labels = ["先理解", "找出核心观点", "逻辑因果链", "用简单语言表达", "检查你是否能快速理解"];
  let cursor = 0;
  for (const label of labels) {
    const at = steps.indexOf(label, cursor);
    assert.ok(at > cursor, label);
    cursor = at;
  }
});

async function themeModule() {
  return import("../src/lib/theme.ts");
}

test("主题解析遵循合法 URL、已存主题、宣纸的优先级", async () => {
  const { resolveTheme } = await themeModule();

  assert.equal(resolveTheme("night", "paper"), "night");
  assert.equal(resolveTheme(null, "celadon"), "celadon");
  assert.equal(resolveTheme("invalid", "night"), "night");
  assert.equal(resolveTheme(null, "invalid"), "paper");
});

test("主题状态只使用三十六计自己的键和事件", async () => {
  const { THEME_BOOTSTRAP_SCRIPT, THEME_CHANGE_EVENT, THEME_KEY } = await themeModule();

  assert.equal(THEME_KEY, "36:theme");
  assert.equal(THEME_CHANGE_EVENT, "36-theme-change");
  assert.ok(!THEME_BOOTSTRAP_SCRIPT.includes("7habit:theme"));
  assert.ok(!THEME_BOOTSTRAP_SCRIPT.includes("principles:theme"));
});

function runBootstrap(script, { search = "", stored = null, storageThrows = false } = {}) {
  const writes = [];
  const root = {
    dataset: {},
    removeAttribute(name) {
      if (name === "data-theme") delete this.dataset.theme;
    },
    setAttribute(name, value) {
      if (name === "data-theme") this.dataset.theme = value;
    },
  };
  const localStorage = {
    getItem() {
      if (storageThrows) throw new Error("blocked");
      return stored;
    },
    setItem(key, value) {
      if (storageThrows) throw new Error("blocked");
      writes.push([key, value]);
    },
  };

  vm.runInNewContext(script, {
    URLSearchParams,
    document: { documentElement: root },
    localStorage,
    location: { search },
  });

  return { theme: root.dataset.theme ?? "paper", writes };
}

test("首屏脚本实际应用主题，并只把合法 URL 主题写回本站存储", async () => {
  const { THEME_BOOTSTRAP_SCRIPT } = await themeModule();

  assert.deepEqual(runBootstrap(THEME_BOOTSTRAP_SCRIPT, {
    search: "?theme=night",
    stored: "celadon",
  }), {
    theme: "night",
    writes: [["36:theme", "night"]],
  });
  assert.deepEqual(runBootstrap(THEME_BOOTSTRAP_SCRIPT, {
    search: "?theme=invalid",
    stored: "celadon",
  }), {
    theme: "celadon",
    writes: [],
  });
  assert.deepEqual(runBootstrap(THEME_BOOTSTRAP_SCRIPT, {
    search: "?theme=paper",
    stored: "night",
  }), {
    theme: "paper",
    writes: [["36:theme", "paper"]],
  });
  assert.deepEqual(runBootstrap(THEME_BOOTSTRAP_SCRIPT, {
    search: "?theme=night",
    storageThrows: true,
  }), {
    theme: "night",
    writes: [],
  });
});

test("layout 在 head 内且在 body 前同步执行主题 bootstrap", () => {
  const source = readFileSync(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
  const head = source.indexOf("<head>");
  const script = source.indexOf(
    '<script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />',
  );
  const headEnd = source.indexOf("</head>");
  const body = source.indexOf("<body");

  assert.match(source, /<html[^>]*suppressHydrationWarning/);
  assert.ok(head !== -1, "layout must define a head");
  assert.ok(head < script && script < headEnd, "bootstrap must be inside head");
  assert.ok(headEnd < body, "head bootstrap must precede body");
});

function cssVariables(source, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = source.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`));
  assert.ok(match, `missing ${selector}`);
  return Object.fromEntries(
    [...match[1].matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((item) => [item[1], item[2].trim()]),
  );
}

test("宣纸、青瓷、夜读三主题精确使用全站基准变量", () => {
  const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
  const expected = {
    ":root": {
      "--background": "#f3efe6",
      "--foreground": "#1c1916",
      "--pine": "#1c3d36",
      "--pine-soft": "#e5f0eb",
      "--clay": "#8a4b32",
      "--band": "#efe4d2",
      "--line": "#e0d5c4",
      "--muted": "#5c554c",
      "--paper": "#f7f3eb",
      "--ink": "#1c1916",
      "--on-pine": "#f7f3eb",
      "--selection": "#d7ebe3",
    },
    ':root[data-theme="celadon"]': {
      "--background": "#e5ede9",
      "--foreground": "#16201d",
      "--pine": "#1d4a5c",
      "--pine-soft": "#dcebf0",
      "--clay": "#9c5236",
      "--band": "#d6e4de",
      "--line": "#c3d4cc",
      "--muted": "#4c5b55",
      "--paper": "#f1f6f3",
      "--ink": "#14201c",
      "--on-pine": "#f1f6f3",
      "--selection": "#c7dfe8",
    },
    ':root[data-theme="night"]': {
      "--background": "#161412",
      "--foreground": "#e9e2d5",
      "--pine": "#8fc7b0",
      "--pine-soft": "#1f2e29",
      "--clay": "#e0a07c",
      "--band": "#2a251f",
      "--line": "#38322a",
      "--muted": "#a69d90",
      "--paper": "#1f1c18",
      "--ink": "#efe8db",
      "--on-pine": "#13201c",
      "--selection": "#2f4a40",
    },
  };

  for (const [selector, variables] of Object.entries(expected)) {
    const actual = cssVariables(css, selector);
    for (const [name, value] of Object.entries(variables)) assert.equal(actual[name], value);
  }
  assert.deepEqual(
    [...css.matchAll(/:root\[data-theme="([^"]+)"\]/g)].map((match) => match[1]).sort(),
    ["celadon", "night"],
  );
});

test("阅读站加载四种字体角色并在侧栏提供主题切换器", () => {
  const layout = readFileSync(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
  const shell = readFileSync(
    new URL("../src/components/reading-shell.tsx", import.meta.url),
    "utf8",
  );

  assert.match(layout, /Cormorant_Garamond/);
  assert.match(layout, /lxgw-wenkai-screen-web/);
  assert.match(css, /\.font-serif/);
  assert.match(css, /\.font-kai/);
  assert.match(css, /\.font-num/);
  assert.match(shell, /ThemeSwitcher/);
});

test("主题切换器运行时渲染恰好三个可识别 radio", async () => {
  const { ThemeSwitcher } = await import("../src/components/theme-switcher.tsx");
  const markup = renderToStaticMarkup(createElement(ThemeSwitcher));
  const radios = [...markup.matchAll(/<button\b[^>]*role="radio"[^>]*>/g)];

  assert.match(markup, /role="radiogroup"[^>]*aria-label="主题颜色"/);
  assert.equal(radios.length, 3);
  assert.deepEqual(
    [...markup.matchAll(/<button\b[^>]*role="radio"[^>]*>[\s\S]*?<\/button>/g)].map(
      (match) => match[0].match(/宣纸|青瓷|夜读/)?.[0],
    ),
    ["宣纸", "青瓷", "夜读"],
  );
  assert.equal((markup.match(/aria-checked="true"/g) ?? []).length, 1);
});
