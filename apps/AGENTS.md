# apps/AGENTS.md

先遵守 root `AGENTS.md`。本文件只记录 `apps/` 层的模块级边界。

## 活跃 apps

- `apps/web`：Next.js 16 App Router + React 18 web runtime。入口是 `apps/web/app/`，主 client shell 是 `apps/web/src/App.tsx`。本地 `tools-dev` web run 中，`apps/web/next.config.ts` 将 `/api/*`、`/artifacts/*`、`/frames/*` rewrite 到 `OD_PORT`。
- `apps/daemon`：Express + SQLite local daemon 与 `od` bin。它拥有 REST/SSE API、agent CLI spawning、skills、design systems、artifact persistence、static serving、local data under `.od/`。
- `apps/desktop`：Electron shell。desktop 不猜测 web 端口；它通过 sidecar IPC 读取 runtime status 并打开 web URL。

## daemon layout

- `apps/daemon/src/` 只放 daemon app 本体源码。
- `apps/daemon/tests/` 放 daemon tests。
- `apps/daemon/sidecar/` 放 daemon sidecar entry。
- CLI/agent 参数或 stdout parser 变化属于 `apps/daemon/src/agents.ts` 及对应 parser tests。

## sidecar awareness

- App 业务层不得 import sidecar packages，也不要分支判断 `runtime.mode`、`namespace`、`ipc`、`source`。
- sidecar awareness 只能位于 `apps/<app>/sidecar` 或 desktop sidecar entry wrapper。

## 非活跃 app 目录

- `apps/nextjs` 已移除；不要恢复。
- `apps/packaged` 是未来 packaged app assembly 的最小占位。本轮不要添加 package manifest、runtime code 或 lifecycle script。

## 常用 app 命令

```bash
pnpm --filter @open-design/web typecheck
pnpm --filter @open-design/web test
pnpm --filter @open-design/daemon typecheck
pnpm --filter @open-design/daemon test
pnpm --filter @open-design/daemon build
pnpm --filter @open-design/desktop typecheck
pnpm --filter @open-design/desktop build
```
