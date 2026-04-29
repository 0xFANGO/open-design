import { spawn } from "node:child_process";
import { mkdir, open, type FileHandle } from "node:fs/promises";
import path from "node:path";

import { cac } from "cac";

import {
  APP_KEYS,
  createRuntimeToken,
  createStampedLaunchEnv,
  createStampedProcessArgs,
  inspectDesktopRuntime,
  inspectNextjsRuntime,
  matchesStampedProcess,
  requestJsonIpc,
  waitForDesktopRuntime,
  waitForNextjsRuntime,
  type DesktopClickResult,
  type DesktopConsoleResult,
  type DesktopEvalResult,
  type DesktopScreenshotResult,
  type DesktopStatusSnapshot,
  type NextjsStatusSnapshot,
} from "@open-design/sidecar";
import {
  collectProcessTreePids,
  createPackageManagerInvocation,
  listProcessSnapshots,
  readLogTail,
  spawnBackgroundProcess,
  stopProcesses,
  type StopProcessesResult,
} from "@open-design/platform";

import {
  DEFAULT_START_APPS,
  DEFAULT_STOP_APPS,
  parsePortOption,
  resolveTargetApps,
  resolveToolDevConfig,
  type ToolDevAppName,
  type ToolDevConfig,
  type ToolDevOptions,
} from "./config.js";

type CliOptions = ToolDevOptions & {
  expr?: string;
  path?: string;
  selector?: string;
  timeout?: string;
};

const APP_PROCESS_ROLE: Record<ToolDevAppName, string> = {
  desktop: "desktop-sidecar",
  nextjs: "nextjs-sidecar",
};

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function exitWithError(error: unknown): never {
  process.stderr.write(`${formatError(error)}\n`);
  process.exit(1);
}

process.on("uncaughtException", exitWithError);
process.on("unhandledRejection", exitWithError);

function printJson(payload: unknown): void {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

function output(payload: unknown, options: CliOptions = {}): void {
  if (typeof payload === "string" && options.json !== true) {
    process.stdout.write(`${payload}\n`);
    return;
  }
  printJson(payload);
}

function runtimeLookup(config: ToolDevConfig) {
  return { base: config.toolsDevRoot, namespace: config.namespace };
}

function appConfig(config: ToolDevConfig, appName: ToolDevAppName) {
  return config.apps[appName];
}

async function openAppLog(config: ToolDevConfig, appName: ToolDevAppName): Promise<FileHandle> {
  const logPath = appConfig(config, appName).latestLogPath;
  await mkdir(path.dirname(logPath), { recursive: true });
  return await open(logPath, "a");
}

async function runLoggedCommand(request: {
  args: string[];
  command: string;
  cwd: string;
  env?: NodeJS.ProcessEnv;
  logFd: number;
}): Promise<void> {
  const child = spawn(request.command, request.args, {
    cwd: request.cwd,
    env: request.env,
    stdio: ["ignore", request.logFd, request.logFd],
    windowsHide: process.platform === "win32",
  });

  await new Promise<void>((resolveRun, rejectRun) => {
    child.once("error", rejectRun);
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolveRun();
        return;
      }
      rejectRun(new Error(`command failed: ${request.command} ${request.args.join(" ")} (${signal ?? code})`));
    });
  });
}

function createAppStamp(config: ToolDevConfig, appName: ToolDevAppName) {
  const runtimeToken = createRuntimeToken();
  const currentAppConfig = appConfig(config, appName);
  const stamp = {
    appKey: appName,
    controllerIpcPath: currentAppConfig.ipcPath,
    mode: "dev" as const,
    namespace: config.namespace,
    runtimeToken,
  };

  return {
    args: createStampedProcessArgs({
      origin: {
        namespace: config.namespace,
        role: APP_PROCESS_ROLE[appName],
        source: "tools-dev",
      },
      stamp,
    }),
    env: createStampedLaunchEnv({
      controllerIpcPath: currentAppConfig.ipcPath,
      namespace: config.namespace,
      runtimeToken,
      sidecarBase: config.toolsDevRoot,
    }),
    runtimeToken,
  };
}

async function findAppProcessTree(config: ToolDevConfig, appName: ToolDevAppName) {
  const processes = await listProcessSnapshots();
  const rootPids = processes
    .filter((processInfo) =>
      matchesStampedProcess(processInfo, {
        appKey: appName,
        namespace: config.namespace,
        source: "tools-dev",
      }),
    )
    .map((processInfo) => processInfo.pid);
  const pids = collectProcessTreePids(processes, rootPids);

  return { pids, rootPids };
}

async function waitForAppProcessExit(config: ToolDevConfig, appName: ToolDevAppName, timeoutMs = 5000): Promise<number[]> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const current = await findAppProcessTree(config, appName);
    if (current.pids.length === 0) return [];
    await new Promise((resolveWait) => setTimeout(resolveWait, 120));
  }
  return (await findAppProcessTree(config, appName)).pids;
}

async function assertNoStaleActiveProcess(config: ToolDevConfig, appName: ToolDevAppName): Promise<void> {
  const active = await findAppProcessTree(config, appName);
  if (active.pids.length > 0) {
    throw new Error(
      `${appName} has active stamped processes but no reachable IPC status; run tools-dev stop ${appName} first`,
    );
  }
}

async function spawnNextjsRuntime(config: ToolDevConfig, options: CliOptions): Promise<{ pid: number; runtimeToken: string }> {
  const { args: stampArgs, env, runtimeToken } = createAppStamp(config, APP_KEYS.NEXTJS);
  const nextjsPort = parsePortOption(options.nextjsPort ?? process.env.OD_NEXTJS_PORT, "--nextjs-port");
  const logHandle = await openAppLog(config, APP_KEYS.NEXTJS);

  try {
    const spawned = await spawnBackgroundProcess({
      args: [config.tsxCliPath, config.apps.nextjs.sidecarEntryPath, ...stampArgs],
      command: process.execPath,
      cwd: config.workspaceRoot,
      detached: true,
      env: {
        ...process.env,
        ...env,
        ...(nextjsPort == null ? {} : { OD_NEXTJS_PORT: String(nextjsPort) }),
      },
      logFd: logHandle.fd,
    });
    return { pid: spawned.pid, runtimeToken };
  } finally {
    await logHandle.close();
  }
}

async function buildDesktop(config: ToolDevConfig, logHandle: FileHandle): Promise<void> {
  await logHandle.write(`\n[tools-dev] building @open-design/desktop at ${new Date().toISOString()}\n`);
  const invocation = createPackageManagerInvocation(["--filter", "@open-design/desktop", "build"], process.env);
  await runLoggedCommand({
    args: invocation.args,
    command: invocation.command,
    cwd: config.workspaceRoot,
    env: process.env,
    logFd: logHandle.fd,
  });
}

async function spawnDesktopRuntime(config: ToolDevConfig): Promise<{ pid: number; runtimeToken: string }> {
  const { args: stampArgs, env, runtimeToken } = createAppStamp(config, APP_KEYS.DESKTOP);
  const logHandle = await openAppLog(config, APP_KEYS.DESKTOP);

  try {
    await buildDesktop(config, logHandle);
    await logHandle.write(`[tools-dev] launching desktop at ${new Date().toISOString()}\n`);
    const spawned = await spawnBackgroundProcess({
      args: [config.apps.desktop.mainEntryPath, ...stampArgs],
      command: config.apps.desktop.electronBinaryPath,
      cwd: config.workspaceRoot,
      detached: true,
      env: {
        ...process.env,
        ...env,
      },
      logFd: logHandle.fd,
    });
    return { pid: spawned.pid, runtimeToken };
  } finally {
    await logHandle.close();
  }
}

async function startNextjs(config: ToolDevConfig, options: CliOptions) {
  const existing = await inspectNextjsRuntime(runtimeLookup(config));
  if (existing?.url != null) {
    return { app: APP_KEYS.NEXTJS, created: false, logPath: config.apps.nextjs.latestLogPath, status: existing };
  }
  await assertNoStaleActiveProcess(config, APP_KEYS.NEXTJS);

  const spawned = await spawnNextjsRuntime(config, options);
  try {
    const status = await waitForNextjsRuntime(runtimeLookup(config));
    return {
      app: APP_KEYS.NEXTJS,
      created: true,
      logPath: config.apps.nextjs.latestLogPath,
      pid: spawned.pid,
      runtimeToken: spawned.runtimeToken,
      status,
    };
  } catch (error) {
    await stopApp(config, APP_KEYS.NEXTJS).catch(() => undefined);
    throw error;
  }
}

async function startDesktop(config: ToolDevConfig) {
  const existing = await inspectDesktopRuntime(runtimeLookup(config));
  if (existing != null) {
    return { app: APP_KEYS.DESKTOP, created: false, logPath: config.apps.desktop.latestLogPath, status: existing };
  }
  await assertNoStaleActiveProcess(config, APP_KEYS.DESKTOP);

  const spawned = await spawnDesktopRuntime(config);
  try {
    const status = await waitForDesktopRuntime(runtimeLookup(config));
    return {
      app: APP_KEYS.DESKTOP,
      created: true,
      logPath: config.apps.desktop.latestLogPath,
      pid: spawned.pid,
      runtimeToken: spawned.runtimeToken,
      status,
    };
  } catch (error) {
    await stopApp(config, APP_KEYS.DESKTOP).catch(() => undefined);
    throw error;
  }
}

async function startApp(config: ToolDevConfig, appName: ToolDevAppName, options: CliOptions) {
  return appName === APP_KEYS.NEXTJS ? await startNextjs(config, options) : await startDesktop(config);
}

async function requestAppShutdown(config: ToolDevConfig, appName: ToolDevAppName): Promise<boolean> {
  try {
    await requestJsonIpc(appConfig(config, appName).ipcPath, { type: "shutdown" }, { timeoutMs: 1500 });
    return true;
  } catch {
    return false;
  }
}

function stoppedByGracefulResult(matchedPids: number[]): StopProcessesResult {
  return {
    alreadyStopped: matchedPids.length === 0,
    forcedPids: [],
    matchedPids,
    remainingPids: [],
    stoppedPids: matchedPids,
  };
}

async function stopApp(config: ToolDevConfig, appName: ToolDevAppName) {
  const before = await findAppProcessTree(config, appName);
  const gracefulRequested = await requestAppShutdown(config, appName);
  const remainingAfterGraceful = gracefulRequested
    ? await waitForAppProcessExit(config, appName)
    : before.pids;

  if (remainingAfterGraceful.length === 0) {
    return {
      app: appName,
      status: before.pids.length === 0 ? "not-running" : "stopped",
      stop: stoppedByGracefulResult(before.pids),
      via: gracefulRequested ? "ipc" : "process-scan",
    };
  }

  const stop = await stopProcesses(remainingAfterGraceful);
  return {
    app: appName,
    status: stop.remainingPids.length === 0 ? "stopped" : "partial",
    stop,
    via: gracefulRequested ? "ipc+fallback" : "fallback",
  };
}

async function inspectAppStatus(config: ToolDevConfig, appName: ToolDevAppName) {
  if (appName === APP_KEYS.NEXTJS) {
    const status = await inspectNextjsRuntime(runtimeLookup(config));
    if (status != null) return status;
    const active = await findAppProcessTree(config, appName);
    return { pid: active.rootPids[0] ?? null, state: active.pids.length > 0 ? "starting" : "idle", url: null };
  }

  const status = await inspectDesktopRuntime(runtimeLookup(config));
  if (status != null) return status;
  const active = await findAppProcessTree(config, appName);
  return { pid: active.rootPids[0] ?? null, state: active.pids.length > 0 ? "unknown" : "idle", url: null };
}

function summarizeStatus(apps: Record<ToolDevAppName, any>): string {
  const states = Object.values(apps).map((entry) => entry?.state);
  if (states.every((state) => state === "idle")) return "not-running";
  if (states.every((state) => state === "running")) return "running";
  return "partial";
}

async function status(config: ToolDevConfig, appName: string | undefined) {
  const targets = resolveTargetApps(appName, DEFAULT_START_APPS);
  if (targets.length === 1) return await inspectAppStatus(config, targets[0]);

  const apps = Object.fromEntries(
    await Promise.all(targets.map(async (target) => [target, await inspectAppStatus(config, target)] as const)),
  ) as Record<ToolDevAppName, unknown>;
  return { apps, namespace: config.namespace, status: summarizeStatus(apps) };
}

async function restartApp(config: ToolDevConfig, appName: ToolDevAppName, options: CliOptions) {
  const stopped = await stopApp(config, appName);
  const started = await startApp(config, appName, options);
  return { app: appName, started, stopped };
}

async function readLogs(config: ToolDevConfig, appName: ToolDevAppName) {
  const logPath = appConfig(config, appName).latestLogPath;
  return { app: appName, lines: await readLogTail(logPath, 200), logPath };
}

type LogResult = Awaited<ReturnType<typeof readLogs>>;

function isLogResult(value: LogResult | Record<string, LogResult>): value is LogResult {
  return Array.isArray((value as LogResult).lines);
}

function printLogs(result: LogResult | Record<string, LogResult>, options: CliOptions) {
  if (options.json === true) {
    printJson(result);
    return;
  }

  const entries: Array<[string, LogResult]> = isLogResult(result) ? [[result.app, result]] : Object.entries(result);
  for (const [appName, entry] of entries) {
    process.stdout.write(`[${appName}] ${entry.logPath}\n`);
    process.stdout.write(entry.lines.length > 0 ? `${entry.lines.join("\n")}\n` : "(no log lines)\n");
  }
}

function parseTimeoutMs(value: string | undefined): number | undefined {
  if (value == null) return undefined;
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) throw new Error("--timeout must be a positive number of seconds");
  return seconds * 1000;
}

async function inspectDesktop(config: ToolDevConfig, target: string | undefined, options: CliOptions) {
  const operation = target ?? "status";
  const timeoutMs = parseTimeoutMs(options.timeout) ?? 30000;

  switch (operation) {
    case "status":
      return (await inspectDesktopRuntime(runtimeLookup(config), 1000)) ?? ({ state: "idle" } satisfies DesktopStatusSnapshot);
    case "eval":
      if (options.expr == null) throw new Error("--expr is required for desktop eval");
      return await requestJsonIpc<DesktopEvalResult>(
        config.apps.desktop.ipcPath,
        { input: { expression: options.expr }, type: "eval" },
        { timeoutMs },
      );
    case "screenshot":
      if (options.path == null) throw new Error("--path is required for desktop screenshot");
      return await requestJsonIpc<DesktopScreenshotResult>(
        config.apps.desktop.ipcPath,
        { input: { path: options.path }, type: "screenshot" },
        { timeoutMs },
      );
    case "console":
      return await requestJsonIpc<DesktopConsoleResult>(config.apps.desktop.ipcPath, { type: "console" }, { timeoutMs });
    case "click":
      if (options.selector == null) throw new Error("--selector is required for desktop click");
      return await requestJsonIpc<DesktopClickResult>(
        config.apps.desktop.ipcPath,
        { input: { selector: options.selector }, type: "click" },
        { timeoutMs },
      );
    default:
      throw new Error(`unsupported desktop inspect target: ${operation}`);
  }
}

async function inspect(config: ToolDevConfig, appName: string, target: string | undefined, options: CliOptions) {
  if (appName === APP_KEYS.NEXTJS) {
    if (target != null && target !== "status") throw new Error(`unsupported nextjs inspect target: ${target}`);
    return (await inspectNextjsRuntime(runtimeLookup(config), 1000)) ?? ({ state: "idle", url: null } satisfies NextjsStatusSnapshot);
  }
  if (appName !== APP_KEYS.DESKTOP) throw new Error(`unsupported tools-dev app: ${appName}`);
  return await inspectDesktop(config, target, options);
}

async function runSequential<T>(targets: readonly ToolDevAppName[], operation: (target: ToolDevAppName) => Promise<T>) {
  const result: Partial<Record<ToolDevAppName, T>> = {};
  for (const target of targets) result[target] = await operation(target);
  return result;
}

const cli = cac("tools-dev");

function addSharedOptions(command: ReturnType<typeof cli.command>) {
  return command
    .option("--namespace <name>", "runtime namespace (default: default)")
    .option("--tools-dev-root <path>", "tools-dev runtime root")
    .option("--json", "print JSON");
}

addSharedOptions(cli.command("start [app]", "Start nextjs, desktop, or both when app is omitted"))
  .option("--nextjs-port <port>", "force Next.js port; conflict quick-fails")
  .action(async (appName: string | undefined, options: CliOptions) => {
    const config = resolveToolDevConfig(options);
    const targets = resolveTargetApps(appName, DEFAULT_START_APPS);
    const result = targets.length === 1
      ? await startApp(config, targets[0], options)
      : await runSequential(targets, (target) => startApp(config, target, options));
    output(result, options);
  });

addSharedOptions(cli.command("status [app]", "Show app status for nextjs, desktop, or both")).action(
  async (appName: string | undefined, options: CliOptions) => {
    output(await status(resolveToolDevConfig(options), appName), options);
  },
);

addSharedOptions(cli.command("stop [app]", "Stop desktop, nextjs, or both when app is omitted")).action(
  async (appName: string | undefined, options: CliOptions) => {
    const config = resolveToolDevConfig(options);
    const targets = resolveTargetApps(appName, DEFAULT_STOP_APPS);
    const result = targets.length === 1
      ? await stopApp(config, targets[0])
      : await runSequential(targets, (target) => stopApp(config, target));
    output(result, options);
  },
);

addSharedOptions(cli.command("restart [app]", "Restart nextjs, desktop, or both when app is omitted"))
  .option("--nextjs-port <port>", "force Next.js port; conflict quick-fails")
  .action(async (appName: string | undefined, options: CliOptions) => {
    const config = resolveToolDevConfig(options);
    const targets = resolveTargetApps(appName, DEFAULT_STOP_APPS);
    const result = targets.length === 1
      ? await restartApp(config, targets[0], options)
      : {
          stop: await runSequential(DEFAULT_STOP_APPS, (target) => stopApp(config, target)),
          start: await runSequential(DEFAULT_START_APPS, (target) => startApp(config, target, options)),
        };
    output(result, options);
  });

addSharedOptions(cli.command("logs [app]", "Show log tail for nextjs, desktop, or both")).action(
  async (appName: string | undefined, options: CliOptions) => {
    const config = resolveToolDevConfig(options);
    const targets = resolveTargetApps(appName, DEFAULT_START_APPS);
    const result = targets.length === 1
      ? await readLogs(config, targets[0])
      : Object.fromEntries(await Promise.all(targets.map(async (target) => [target, await readLogs(config, target)] as const)));
    printLogs(result, options);
  },
);

addSharedOptions(
  cli.command("inspect <app> [target]", "Inspect nextjs status or desktop status/eval/screenshot/console/click"),
)
  .option("--expr <js>", "JavaScript expression for desktop eval")
  .option("--path <file>", "Output path for desktop screenshot")
  .option("--selector <css>", "CSS selector for desktop click")
  .option("--timeout <seconds>", "Desktop inspect timeout in seconds")
  .action(async (appName: string, target: string | undefined, options: CliOptions) => {
    output(await inspect(resolveToolDevConfig(options), appName, target, options), options);
  });

cli.help();

const rawCliArgs = process.argv.slice(2);
const cliArgs = rawCliArgs[0] === "--" ? rawCliArgs.slice(1) : rawCliArgs;
process.argv.splice(2, process.argv.length - 2, ...cliArgs);

if (cliArgs.length === 0 || (cliArgs[0]?.startsWith("-") && cliArgs[0] !== "--help" && cliArgs[0] !== "-h")) {
  process.argv.splice(2, 0, "start");
}

cli.parse();
