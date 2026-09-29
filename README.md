# 三十六计

《三十六计》的独立导读。在线阅读：

**https://brianbai1123.github.io/36/**

每一计先放原文、注释、译文，再按五步讲开：先理解，找出核心观点，重建逻辑，用简单的话说一遍，最后用两个问题检查能不能自己讲出来。

目录按六套来排：胜战计、敌战计、攻战计、混战计、并战计、败战计，每套六计。

原文、注释、译文照录太极书馆《三十六计》，未作改动。本站的五步解析是自己写的，不替代原书。

## 本地预览

```bash
npm install
npm run dev
```

打开 http://127.0.0.1:43141 。

本地模拟 GitHub Pages 子路径：

```bash
npm run build:gh
npx serve out
```

## 检查

```bash
npm test
npm run lint
npm run build
```

## 部署

推送到 `main` 后，GitHub Actions 会静态导出并发布到 Pages。仓库名需要是 `36`，Pages 源是 **GitHub Actions**，站点路径才是 `/36/`。

## 技术栈

Next.js 16（`output: 'export'`）+ React 19 + TypeScript + Tailwind CSS v4。无后端、无数据库。原文、注释、译文在 `src/content/originals.json`，解析在 `src/content/readings.json`。
