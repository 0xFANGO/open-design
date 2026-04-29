import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  APP_KEYS,
  resolveAppIpcPath,
  resolveLogFilePath,
  resolveNamespace,
  resolveNamespaceRoot,
  resolveToolsDevBase,
} from "@open-design/sidecar";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENTRY_DIR_NAME = path.basename(__dirname);

export const WORKSPACE_ROOT = path.resolve(__dirname, ENTRY_DIR_NAME === "dist" ? "../../.." : "../../..");

export const ALL_APPS = [APP_KEYS.NEXTJS, APP_KEYS.DESKTOP] as const;
export const DEFAULT_START_APPS = [APP_KEYS.NEXTJS, APP_KEYS.DESKTOP] as const;
export const DEFAULT_STOP_APPS = [APP_KEYS.DESKTOP, APP_KEYS.NEXTJS] as const;

export type ToolDevAppName = (typeof ALL_APPS)[number];

export type ToolDevOptions = {
  json?: boolean;
  namespace?: string;
  nextjsPort?: number | string | null;
  toolsDevRoot?: string;
};

export type ToolDevAppConfig = {
  appKey: ToolDevAppName;
  ipcPath: string;
  latestLogPath: string;
  logDir: string;
};

export type ToolDevConfig = {
  apps: {
    desktop: ToolDevAppConfig & {
      electronBinaryPath: string;
      mainEntryPath: string;
      packageJsonPath: string;
    };
    nextjs: ToolDevAppConfig & {
      sidecarEntryPath: string;
    };
  };
  namespace: string;
  namespaceRoot: string;
  toolsDevRoot: string;
  tsxCliPath: string;
  workspaceRoot: string;
};

function resolveTsxCliPath(): string {
  const require = createRequire(import.meta.url);
  return require.resolve("tsx/cli");
}

function resolveElectronBinaryPath(workspaceRoot: string): string {
  const packageJsonPath = path.join(workspaceRoot, "apps/desktop/package.json");
  const require = createRequire(packageJsonPath);
  const electron = require("electron") as unknown;
  if (typeof electron === "string" && electron.length > 0) return electron;
  return require.resolve("electron/cli.js");
}

function resolveAppConfig(options: {
  appKey: ToolDevAppName;
  namespace: string;
  namespaceRoot: string;
  toolsDevRoot: string;
}): ToolDevAppConfig {
  return {
    appKey: options.appKey,
    ipcPath: resolveAppIpcPath({
      appKey: options.appKey,
      base: options.toolsDevRoot,
      namespace: options.namespace,
    }),
    latestLogPath: resolveLogFilePath({ runtimeRoot: options.namespaceRoot, appKey: options.appKey }),
    logDir: path.dirname(resolveLogFilePath({ runtimeRoot: options.namespaceRoot, appKey: options.appKey })),
  };
}

export function isToolDevAppName(value: string): value is ToolDevAppName {
  return ALL_APPS.includes(value as ToolDevAppName);
}

export function resolveTargetApps(appName: string | undefined, defaults: readonly ToolDevAppName[]): ToolDevAppName[] {
  if (appName == null) return [...defaults];
  if (!isToolDevAppName(appName)) throw new Error(`unsupported tools-dev app: ${appName}`);
  return [appName];
}

export function parsePortOption(value: number | string | null | undefined, optionName: string): number | null {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    throw new Error(`${optionName} must be an integer between 1 and 65535`);
  }
  return parsed;
}

export function resolveToolDevConfig(options: ToolDevOptions = {}): ToolDevConfig {
  const namespace = resolveNamespace({ namespace: options.namespace, env: process.env });
  const toolsDevRoot = resolveToolsDevBase({ base: options.toolsDevRoot, env: process.env });
  const namespaceRoot = resolveNamespaceRoot({ base: toolsDevRoot, namespace });
  const nextjs = resolveAppConfig({ appKey: APP_KEYS.NEXTJS, namespace, namespaceRoot, toolsDevRoot });
  const desktop = resolveAppConfig({ appKey: APP_KEYS.DESKTOP, namespace, namespaceRoot, toolsDevRoot });
  const desktopPackageJsonPath = path.join(WORKSPACE_ROOT, "apps/desktop/package.json");

  return {
    apps: {
      desktop: {
        ...desktop,
        electronBinaryPath: resolveElectronBinaryPath(WORKSPACE_ROOT),
        mainEntryPath: path.join(WORKSPACE_ROOT, "apps/desktop/dist/main/index.js"),
        packageJsonPath: desktopPackageJsonPath,
      },
      nextjs: {
        ...nextjs,
        sidecarEntryPath: path.join(WORKSPACE_ROOT, "apps/nextjs/sidecar/index.ts"),
      },
    },
    namespace,
    namespaceRoot,
    toolsDevRoot,
    tsxCliPath: resolveTsxCliPath(),
    workspaceRoot: WORKSPACE_ROOT,
  };
}
