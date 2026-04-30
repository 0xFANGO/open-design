# packages/AGENTS.md

先遵守 root `AGENTS.md`。本文件只记录 `packages/` 层的模块级边界。

## Package 职责

- `packages/contracts`：web/daemon app contract 层。保持纯 TypeScript；不得依赖 Next.js、Express、Node filesystem/process、browser APIs、SQLite、daemon internals 或 sidecar control-plane protocol。
- `packages/sidecar-proto`：Open Design sidecar 业务 protocol。拥有 app/mode/source constants、namespace validation、stamp descriptor/fields/flags、IPC message schema、status shapes、error semantics、默认 product path constants。
- `packages/sidecar`：generic sidecar runtime primitives。包含 bootstrap、IPC transport、path/runtime resolver、launch env、JSON runtime file helpers；不得 hard-code Open Design app keys 或 IPC business messages。
- `packages/platform`：generic OS process primitives。包含 stamp serialization、command parsing、process matching/search；必须消费 `sidecar-proto` descriptor，不得 hard-code `--od-stamp-*` 细节。

## 已移除目录

- `packages/shared` 已移除；不要恢复。
- 新共享类型优先判断边界：web/daemon app DTO 放 `contracts`；sidecar control-plane 放 `sidecar-proto`；generic runtime 放 `sidecar`；generic OS/process 放 `platform`。

## Boundary checklist

- 不要把 runtime validation/schema enforcement 提前塞进 `contracts`；当前 contracts 只定义 typed target shape。
- 不要让 app package 直接依赖 sidecar control-plane 细节。
- 不要在 `sidecar` 或 `platform` 中 hard-code Open Design app/source/mode 常量。
- stamp 字段保持五个：`app`、`mode`、`namespace`、`ipc`、`source`。

## 常用 package 命令

```bash
pnpm --filter @open-design/contracts typecheck
pnpm --filter @open-design/sidecar-proto typecheck
pnpm --filter @open-design/sidecar-proto test
pnpm --filter @open-design/sidecar typecheck
pnpm --filter @open-design/sidecar test
pnpm --filter @open-design/platform typecheck
pnpm --filter @open-design/platform test
```
