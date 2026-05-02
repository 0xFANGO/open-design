import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import { ToolCard } from '../components/ToolCard';
import {
  clearToolRenderers,
  deriveToolStatus,
  getToolRenderer,
  registerToolRenderer,
  toRenderProps,
} from './tool-renderers';
import type { AgentEvent } from '../types';

type ToolUse = Extract<AgentEvent, { kind: 'tool_use' }>;
type ToolResult = Extract<AgentEvent, { kind: 'tool_result' }>;

function use(input: unknown, name = 'render_chart', id = 't1'): ToolUse {
  return { kind: 'tool_use', id, name, input };
}

function ok(content: string, id = 't1'): ToolResult {
  return { kind: 'tool_result', toolUseId: id, content, isError: false };
}

function err(content: string, id = 't1'): ToolResult {
  return { kind: 'tool_result', toolUseId: id, content, isError: true };
}

describe('deriveToolStatus', () => {
  const u = use({ x: 1 });

  it('returns "executing" while the run is streaming and no result has arrived', () => {
    expect(deriveToolStatus(u, undefined, true)).toBe('executing');
  });

  it('returns "inProgress" when the run died before the tool returned', () => {
    expect(deriveToolStatus(u, undefined, false)).toBe('inProgress');
  });

  it('returns "complete" on a clean tool result', () => {
    expect(deriveToolStatus(u, ok('ok'), true)).toBe('complete');
  });

  it('returns "error" when the tool result carries isError', () => {
    expect(deriveToolStatus(u, err('boom'), true)).toBe('error');
  });
});

describe('toRenderProps', () => {
  it('packs args / result / isError into the AG-UI render-prop shape', () => {
    const u = use({ city: 'SF' }, 'get_weather');
    const props = toRenderProps(u, ok('{"temp":61}'), true);
    expect(props).toEqual({
      status: 'complete',
      name: 'get_weather',
      args: { city: 'SF' },
      result: '{"temp":61}',
      isError: false,
    });
  });

  it('omits result while the tool is still running', () => {
    const u = use({ city: 'SF' }, 'get_weather');
    const props = toRenderProps(u, undefined, true);
    expect(props.status).toBe('executing');
    expect(props.result).toBeUndefined();
    expect(props.isError).toBe(false);
  });
});

describe('tool renderer registry', () => {
  afterEach(() => clearToolRenderers());

  it('registers, looks up, and unregisters renderers', () => {
    const r = () => null;
    expect(getToolRenderer('xyz')).toBeUndefined();
    const dispose = registerToolRenderer('xyz', r);
    expect(getToolRenderer('xyz')).toBe(r);
    dispose();
    expect(getToolRenderer('xyz')).toBeUndefined();
  });

  it('overwrites on re-registration (last writer wins)', () => {
    const a = () => null;
    const b = () => null;
    registerToolRenderer('xyz', a);
    registerToolRenderer('xyz', b);
    expect(getToolRenderer('xyz')).toBe(b);
  });

  it('does not unregister a renderer that has been overwritten', () => {
    const a = () => null;
    const b = () => null;
    const disposeA = registerToolRenderer('xyz', a);
    registerToolRenderer('xyz', b);
    disposeA();
    expect(getToolRenderer('xyz')).toBe(b);
  });
});

describe('ToolCard dispatch', () => {
  afterEach(() => clearToolRenderers());

  it('routes unknown tool names through the registry', () => {
    registerToolRenderer('render_chart', ({ status, args }) => (
      <div data-testid="custom-chart" data-status={status}>
        {(args as { label?: string }).label}
      </div>
    ));
    const markup = renderToStaticMarkup(
      <ToolCard use={use({ label: 'Q3 revenue' })} runStreaming={true} />,
    );
    expect(markup).toContain('data-testid="custom-chart"');
    expect(markup).toContain('data-status="executing"');
    expect(markup).toContain('Q3 revenue');
  });

  it('passes the result content through as the `result` prop on completion', () => {
    registerToolRenderer('render_chart', ({ status, result }) => (
      <span data-testid="custom-chart" data-status={status}>
        {result}
      </span>
    ));
    const markup = renderToStaticMarkup(
      <ToolCard use={use({})} result={ok('payload')} runStreaming={false} />,
    );
    expect(markup).toContain('data-status="complete"');
    expect(markup).toContain('payload');
  });

  it('falls back to the built-in card when the registered renderer returns null', () => {
    registerToolRenderer('Bash', () => null);
    const markup = renderToStaticMarkup(
      <ToolCard use={use({ command: 'ls' }, 'Bash')} runStreaming={true} />,
    );
    expect(markup).toContain('op-bash');
    expect(markup).toContain('ls');
  });

  it('lets a registered renderer override a built-in family card', () => {
    registerToolRenderer('Bash', ({ args }) => (
      <pre data-testid="custom-bash">{(args as { command?: string }).command}</pre>
    ));
    const markup = renderToStaticMarkup(
      <ToolCard use={use({ command: 'whoami' }, 'Bash')} runStreaming={true} />,
    );
    expect(markup).toContain('data-testid="custom-bash"');
    expect(markup).not.toContain('op-bash');
  });
});
