# tools/AGENTS.md

先遵守 root `AGENTS.md`。本文件只记录 `tools/` 层的模块级边界。

## 活跃工具

- `tools/dev` 提供 `@open-design/tools-dev` 与 `tools-dev` bin，是唯一当前可用的本地开发生命周期控制面。
- `pnpm tools-dev` 管理 daemon -> web -> desktop。
- `pnpm tools-dev run web` 是 foreground daemon + web，供 Playwright webServer 使用。
- `pnpm tools-dev inspect desktop ...` 通过 sidecar IPC 检查 desktop runtime。

## 占位工具

- `tools/pack` 是未来 `tools-pack` workstream 的最小占位。
- 本轮不要在 `tools/pack` 中加入 package manifest、root script、packaging command、release/signing 逻辑。
- root `pnpm build` 的 package/build 边界暂不在本轮调整，后续交给 `tools-pack` 任务治理。

## Orchestration 边界

- orchestration 层必须消费 `@open-design/sidecar-proto`、`@open-design/sidecar`、`@open-design/platform` primitives。
- 不要在 `tools/dev`、未来 `tools/pack` 或 packaged launcher 中手写 `--od-stamp-*` args、process-scan regex、runtime token、process role 或重复 namespace/source args。
- 端口 flags 是权威输入：`--daemon-port`、`--web-port`。内部 env 是 `OD_PORT` 与 `OD_WEB_PORT`，不要引入 `NEXT_PORT`。

## 常用 tools 命令

```bash
pnpm --filter @open-design/tools-dev typecheck
pnpm --filter @open-design/tools-dev build
pnpm tools-dev status --json
pnpm tools-dev logs --json
pnpm tools-dev check
```
