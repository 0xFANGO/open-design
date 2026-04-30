# 目录规范

本文件是 agent 进入仓库后的唯一入口真相源。先读本文件；进入 `apps/`、`packages/`、`tools/` 后，再读该层的 `AGENTS.md` 获取模块级细节。不要把模块细节复制回 root，root 只保留跨仓库边界、流程和命令。

## 核心文档索引

- 产品与上手：`README.md`、`README.zh-CN.md`、`QUICKSTART.md`。
- 贡献与环境：`CONTRIBUTING.md`、`CONTRIBUTING.zh-CN.md`。
- 架构与协议：`docs/spec.md`、`docs/architecture.md`、`docs/skills-protocol.md`、`docs/agent-adapters.md`、`docs/modes.md`。
- 路线与参考：`docs/roadmap.md`、`docs/references.md`、`specs/current/maintainability-roadmap.md`。
- 目录级 agent 说明：`apps/AGENTS.md`、`packages/AGENTS.md`、`tools/AGENTS.md`。

## Workspace 目录

- Workspace 包来自 `pnpm-workspace.yaml`：`apps/*`、`packages/*`、`tools/*`、`e2e`。
- `apps/web` 是 Next.js 16 App Router + React 18 web runtime；不要恢复 `apps/nextjs`。
- `apps/daemon` 是本地 privileged daemon 和 `od` bin，拥有 `/api/*`、agent spawning、skills、design systems、artifacts、static serving。
- `apps/desktop` 是 Electron shell，通过 sidecar IPC 发现 web URL。
- `packages/contracts` 是纯 TypeScript 的 web/daemon app contract 层。
- `packages/sidecar-proto` 是 Open Design sidecar 业务 protocol；`packages/sidecar` 是 generic sidecar runtime；`packages/platform` 是 generic OS process primitives。
- `tools/dev` 是唯一当前可用的本地开发生命周期控制面。
- `e2e` 包含 Playwright UI specs 与 Vitest/jsdom integration tests。

## 非活跃或占位目录

- `apps/nextjs` 与 `packages/shared` 已移除；不要重建或引用。
- `apps/packaged` 仅是未来 packaged app assembly 占位；本轮不放活跃代码。
- `tools/pack` 仅是未来 `tools-pack` 占位；本轮不新增命令或 packaging 逻辑。
- `.od/`、`.tmp/`、`e2e/.od-data`、Playwright reports、agent scratch dirs 是本地运行数据，必须留在 git 外。

# 开发流程指导

## 基础环境

- 运行目标是 Node `~24` 与 `pnpm@10.33.2`；使用 Corepack 选择 `package.json` 固定的 pnpm 版本。
- 新增项目自有 entrypoint、module、script、test、reporter、config 默认使用 TypeScript。
- Residual JavaScript 仅限生成产物、vendored dependency、明确记录的兼容构建产物，以及 `scripts/check-residual-js.ts` allowlist。

## 本地生命周期

- 只使用 `pnpm tools-dev` 作为本地开发生命周期入口。
- 不要新增或恢复 root lifecycle alias：`pnpm dev`、`pnpm dev:all`、`pnpm daemon`、`pnpm preview`、`pnpm start`。
- 端口以 `tools-dev` flags 为权威：`--daemon-port`、`--web-port`。
- `tools-dev` 内部导出 `OD_PORT` 给 web proxy 目标，导出 `OD_WEB_PORT` 给 web listener；不要使用 `NEXT_PORT`。

## 边界约束

- App 业务逻辑不得感知 sidecar/control-plane 概念；sidecar awareness 只能放在 `apps/<app>/sidecar` 或 desktop sidecar entry wrapper。
- Shared web/daemon app contracts 放在 `packages/contracts`；该包不得依赖 Next.js、Express、Node filesystem/process、browser APIs、SQLite、daemon internals 或 sidecar control-plane protocol。
- Sidecar process stamp 只能有五个字段：`app`、`mode`、`namespace`、`ipc`、`source`。
- Orchestration 层（`tools-dev`、未来 `tools-pack`、packaged launcher）必须调用 package primitives；不要手写 `--od-stamp-*` args 或 process-scan regex。
- 默认 runtime files 写到 `<project-root>/.tmp/<source>/<namespace>/...`；POSIX IPC sockets 固定为 `/tmp/open-design/ipc/<namespace>/<app>.sock`。

## 验证策略

- package、workspace 或命令入口变化后运行 `pnpm install`，确保 workspace links 与 generated dist entries 新鲜。
- 常规 ready 前至少运行 `pnpm typecheck` 与 `pnpm test`；涉及构建边界时再运行 `pnpm build`。
- web/e2e loop 优先使用 `pnpm tools-dev run web --daemon-port <port> --web-port <port>`。
- GUI-capable machine 上验证 desktop：运行 `pnpm tools-dev`，再用 `pnpm tools-dev inspect desktop status`。
- stamp/namespace 变化必须验证两个并发 namespace，并分别执行 desktop `inspect eval` 与 `inspect screenshot`。
- path/log 变化必须执行 `pnpm tools-dev logs --namespace <name> --json`，确认 log path 位于 `.tmp/tools-dev/<namespace>/...`。

# 常用命令

```bash
pnpm install
pnpm tools-dev
pnpm tools-dev start web
pnpm tools-dev run web --daemon-port 17456 --web-port 17573
pnpm tools-dev status --json
pnpm tools-dev logs --json
pnpm tools-dev inspect desktop status --json
pnpm tools-dev inspect desktop screenshot --path /tmp/open-design.png
pnpm tools-dev stop
pnpm tools-dev check
```

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm test:ui
pnpm test:ui:headed
pnpm test:e2e:live
pnpm check:residual-js
```

```bash
pnpm --filter @open-design/web typecheck
pnpm --filter @open-design/daemon test
pnpm --filter @open-design/desktop build
pnpm --filter @open-design/tools-dev build
pnpm -r --if-present run typecheck
pnpm -r --if-present run test
```

# FAQ

## 为什么没有 root `pnpm dev` / `pnpm start`？

为了避免 daemon、web、desktop 被多个入口以不一致的 env、ports、namespace 或 logs 方式启动。所有本地 lifecycle 都必须走 `pnpm tools-dev`。

## 为什么不要恢复 `apps/nextjs`？

当前 web runtime 是 `apps/web`。历史 `apps/nextjs` 已从活跃布局移除；恢复它会重新引入重复 app 边界和过期脚本。

## desktop 如何发现 web URL？

desktop 通过 sidecar IPC 查询 runtime status。web URL 来自 `tools-dev` 启动状态，不由 desktop 业务层猜测端口或读取 web internals。

## sidecar-proto、sidecar、platform 如何分工？

`@open-design/sidecar-proto` 拥有 Open Design 的 app/mode/source constants、namespace validation、stamp fields/flags、IPC message schema、status shapes 与 error semantics。`@open-design/sidecar` 只提供 generic bootstrap、IPC transport、path/runtime resolver、launch env、JSON runtime files。`@open-design/platform` 只提供 generic OS process stamp serialization、command parsing、process matching/search primitives，并消费 proto descriptor。

## 数据写在哪里？

daemon 默认写 `.od/`：SQLite 在 `.od/app.sqlite`，agent CWD 在 `.od/projects/<id>/`，saved renders 在 `.od/artifacts/`。`OD_DATA_DIR` 可相对 repo root 重定位数据；Playwright 用它隔离测试数据。

## 什么时候需要跑 `pnpm install`？

只要改了 package manifest、workspace 布局、命令入口、bin/link 相关内容，或删除/新增 workspace package，就先跑 `pnpm install`。
