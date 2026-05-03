/**
 * Build a showcase HTML page from a DESIGN.md so the user can see what each
 * design system looks like *before* generating anything. We don't try to
 * render a unique product mockup — we extract the palette, typography, and
 * a couple of component conventions, then drop them into one fixed
 * template. The full DESIGN.md is rendered below as prose for reference.
 *
 * Parsing is deliberately permissive: imported systems vary in section
 * naming and bullet style, so we use loose regexes and fall back to sane
 * defaults when a token isn't found.
 */

type ColorToken = { name: string; value: string };
type FontHints = { display?: string; heading?: string; body?: string; mono?: string };
type ListTag = 'ul' | 'ol';
type TableAlign = 'left' | 'center' | 'right' | null;

export function renderDesignSystemPreview(id: string, raw: string): string {
  if (id === 'banana-lab') return renderBananaLabPreview(id, raw);
  if (id === 'listenhub') return renderListenHubPreview(id, raw);

  const titleMatch = /^#\s+(.+?)\s*$/m.exec(raw);
  const title = cleanTitle(titleMatch?.[1] ?? id);
  const subtitle = extractSubtitle(raw);
  const colors = extractColors(raw);
  const fonts = extractFonts(raw);

  const bg =
    pickColor(colors, ['page background', 'background', 'canvas', 'paper', 'bg ', 'page bg'])
    ?? pickColor(colors, ['white'])
    ?? '#ffffff';
  const fg =
    pickColor(colors, ['heading', 'foreground', 'ink', 'fg', 'text', 'navy', 'graphite'])
    ?? '#111111';
  // Accent: brand/primary names first, then fall back to the first color
  // that doesn't look like a neutral white/black/grey so we always show
  // something punchy in the showcase header.
  const accent =
    pickColor(colors, ['primary brand', 'brand primary', 'primary', 'brand', 'accent'])
    ?? firstNonNeutral(colors)
    ?? '#2f6feb';
  const muted = pickColor(colors, ['muted', 'secondary', 'neutral', 'subtle', 'caption']) ?? '#777777';
  const border = pickColor(colors, ['border', 'divider', 'rule', 'stroke']) ?? '#e5e5e5';
  const surface =
    pickColor(colors, ['surface', 'card', 'background-secondary', 'panel', 'elevated'])
    ?? '#ffffff';

  const display = fonts.display
    ?? fonts.heading
    ?? "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  const body = fonts.body ?? display;
  const mono = fonts.mono ?? "ui-monospace, 'JetBrains Mono', monospace";

  const renderedMarkdown = renderMarkdownLite(raw);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} — design system preview</title>
  <style>
    :root {
      --bg: ${bg};
      --fg: ${fg};
      --accent: ${accent};
      --muted: ${muted};
      --border: ${border};
      --surface: ${surface};
      --display: ${display};
      --body: ${body};
      --mono: ${mono};
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--fg);
      font-family: var(--body);
      line-height: 1.55;
      font-size: 16px;
    }
    .wrap { max-width: 960px; margin: 0 auto; padding: 56px 32px 96px; }
    .badge {
      display: inline-block;
      font-family: var(--mono);
      font-size: 11px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 999px;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--muted);
      margin-bottom: 24px;
    }
    h1 {
      font-family: var(--display);
      font-size: clamp(40px, 6vw, 72px);
      line-height: 1.05;
      letter-spacing: -0.02em;
      margin: 0 0 16px;
    }
    .lede {
      max-width: 60ch;
      font-size: 18px;
      color: var(--muted);
      margin: 0 0 56px;
    }
    section { margin-bottom: 72px; }
    .section-title {
      font-family: var(--display);
      font-size: 22px;
      font-weight: 600;
      margin: 0 0 16px;
      letter-spacing: -0.01em;
    }
    .palette {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 16px;
    }
    .swatch {
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      background: var(--surface);
    }
    .swatch .chip {
      height: 96px;
    }
    .swatch .meta {
      padding: 10px 12px 12px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .swatch .name { font-size: 13px; font-weight: 500; }
    .swatch .hex { font-family: var(--mono); font-size: 11px; color: var(--muted); }
    .typo-row {
      display: grid;
      grid-template-columns: 88px 1fr;
      gap: 24px;
      padding: 18px 0;
      border-top: 1px solid var(--border);
    }
    .typo-row:first-child { border-top: none; padding-top: 0; }
    .typo-row .label {
      font-family: var(--mono);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted);
      padding-top: 4px;
    }
    .typo-display { font-family: var(--display); font-size: 40px; line-height: 1.1; letter-spacing: -0.02em; }
    .typo-body { font-family: var(--body); font-size: 16px; }
    .typo-mono { font-family: var(--mono); font-size: 14px; color: var(--muted); }
    .components {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    @media (max-width: 640px) { .components { grid-template-columns: 1fr; } }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
    }
    .card .eyebrow {
      font-family: var(--mono);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--accent);
      margin-bottom: 8px;
    }
    .card h3 {
      font-family: var(--display);
      font-size: 20px;
      margin: 0 0 8px;
      letter-spacing: -0.01em;
    }
    .card p { margin: 0; color: var(--muted); }
    .btn-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
    button {
      font: inherit;
      cursor: pointer;
      border-radius: 8px;
      padding: 10px 18px;
    }
    .btn-primary {
      background: var(--accent);
      color: ${pickReadableForeground(accent)};
      border: 1px solid var(--accent);
    }
    .btn-secondary {
      background: transparent;
      color: var(--fg);
      border: 1px solid var(--border);
    }
    .btn-link {
      background: transparent;
      border: none;
      color: var(--accent);
      padding: 10px 0;
      font-weight: 500;
    }
    .prose {
      border-top: 1px solid var(--border);
      padding-top: 32px;
      color: var(--fg);
    }
    .prose h1, .prose h2, .prose h3 { font-family: var(--display); letter-spacing: -0.01em; }
    .prose h1 { font-size: 28px; margin-top: 0; }
    .prose h2 { font-size: 20px; margin-top: 32px; }
    .prose h3 { font-size: 16px; margin-top: 24px; }
    .prose p, .prose ul, .prose ol { margin: 12px 0; }
    .prose code { font-family: var(--mono); background: var(--surface); border: 1px solid var(--border); padding: 1px 5px; border-radius: 4px; font-size: 0.92em; }
    .prose blockquote { margin: 16px 0; padding: 8px 16px; border-left: 3px solid var(--accent); color: var(--muted); }
    .prose ul, .prose ol { padding-left: 22px; }
    .prose pre { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; overflow: auto; font-family: var(--mono); font-size: 12.5px; line-height: 1.55; }
    .prose pre code { background: transparent; border: none; padding: 0; font-size: inherit; }
    .prose hr { border: none; border-top: 1px solid var(--border); margin: 28px 0; }
    .prose a { color: var(--accent); text-decoration: none; border-bottom: 1px solid transparent; }
    .prose a:hover { border-bottom-color: var(--accent); }
    .prose img { max-width: 100%; height: auto; border-radius: 6px; }
    .prose .table-wrap { overflow-x: auto; margin: 18px 0; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); }
    .prose table { width: 100%; border-collapse: collapse; font-size: 13.5px; line-height: 1.5; }
    .prose th, .prose td { padding: 9px 14px; text-align: left; vertical-align: top; border-bottom: 1px solid var(--border); }
    .prose th { background: var(--bg); font-weight: 600; font-size: 12px; letter-spacing: 0.02em; text-transform: uppercase; color: var(--muted); }
    .prose tr:last-child td { border-bottom: none; }
    .prose td code, .prose th code { white-space: nowrap; }
    .prose td[align="right"], .prose th[align="right"] { text-align: right; }
    .prose td[align="center"], .prose th[align="center"] { text-align: center; }
  </style>
</head>
<body>
  <main class="wrap">
    <span class="badge">Design system preview · ${escapeHtml(id)}</span>
    <h1>${escapeHtml(title)}</h1>
    ${subtitle ? `<p class="lede">${escapeHtml(subtitle)}</p>` : ''}

    <section>
      <h2 class="section-title">Palette</h2>
      <div class="palette">
        ${colors
          .slice(0, 12)
          .map(
            (c) => `<div class="swatch">
              <div class="chip" style="background:${c.value};"></div>
              <div class="meta">
                <span class="name">${escapeHtml(c.name)}</span>
                <span class="hex">${escapeHtml(c.value)}</span>
              </div>
            </div>`,
          )
          .join('')}
      </div>
    </section>

    <section>
      <h2 class="section-title">Typography</h2>
      <div class="typo-row">
        <span class="label">Display</span>
        <div class="typo-display">The grid carries weight; the line carries pace.</div>
      </div>
      <div class="typo-row">
        <span class="label">Body</span>
        <div class="typo-body">Body copy reads at sixteen pixels with a 1.55 leading. Restraint and rhythm matter more than novelty — pick a stack that earns the page.</div>
      </div>
      <div class="typo-row">
        <span class="label">Mono</span>
        <div class="typo-mono">/* monospace · ${escapeHtml(mono.split(',')[0]?.replace(/['"]/g, '').trim() ?? 'mono')} */</div>
      </div>
    </section>

    <section>
      <h2 class="section-title">Components</h2>
      <div class="components">
        <div class="card">
          <div class="eyebrow">Card</div>
          <h3>Production-quality artifact</h3>
          <p>Sample card showing how surfaces, borders, and accent text behave in this system.</p>
        </div>
        <div class="card">
          <div class="eyebrow">Buttons</div>
          <h3>Three weights, one accent</h3>
          <div class="btn-row" style="margin-top: 12px;">
            <button class="btn-primary">Primary</button>
            <button class="btn-secondary">Secondary</button>
            <button class="btn-link">Link →</button>
          </div>
        </div>
      </div>
    </section>

    <section class="prose">
      ${renderedMarkdown}
    </section>
  </main>
</body>
</html>`;
}

function renderBananaLabPreview(id: string, raw: string): string {
  const titleMatch = /^#\s+(.+?)\s*$/m.exec(raw);
  const title = cleanTitle(titleMatch?.[1] ?? id);
  const subtitle = extractSubtitle(raw);
  const renderedMarkdown = renderMarkdownLite(raw);

  const swatches = [
    ['Deep Space', '#020617'],
    ['Primary Gold', '#d4a017'],
    ['Yellow Active', '#facc15'],
    ['Amber VIP', '#f59e0b'],
    ['Lab Cyan', '#22d3ee'],
    ['Lab Blue', '#60a5fa'],
    ['Lab Violet', '#a78bfa'],
    ['Nana Pink', '#f472b6'],
    ['Emerald Reward', '#34d399'],
    ['Campaign Indigo', '#6366f1'],
    ['Sale Red', '#e63f3f'],
    ['Check-in Blue', '#0080ff'],
  ];

  const badgeGradients = [
    ['4K', 'linear-gradient(90deg,#fbbf24,#f97316)'],
    ['Nano Banana', 'linear-gradient(90deg,#fde047,#a3e635)'],
    ['Detail', 'linear-gradient(90deg,#38bdf8,#67e8f9)'],
    ['Anime', 'linear-gradient(90deg,#f472b6,#d946ef)'],
    ['UHD', 'linear-gradient(90deg,#818cf8,#3b82f6)'],
    ['Lossless', 'linear-gradient(90deg,#34d399,#14b8a6)'],
    ['Portrait', 'linear-gradient(90deg,#fb7185,#fb923c)'],
    ['Concept', 'linear-gradient(90deg,#e2e8f0,#38bdf8)'],
  ];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} — design system preview</title>
  <style>
    :root {
      --bg: #020617;
      --fg: #f8f8f8;
      --muted: #9a9ea8;
      --border: rgba(255,255,255,0.1);
      --surface: #1a1b2e;
      --gold: #d4a017;
      --gold-fg: #3d2a08;
      --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      --sans: Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      color: var(--fg);
      font-family: var(--sans);
      line-height: 1.55;
      background:
        radial-gradient(1200px 600px at 50% -200px, oklch(0.35 0.08 300 / 0.35), transparent 70%),
        radial-gradient(900px 500px at 50% 120%, oklch(0.62 0.16 40 / 0.16), transparent 70%),
        radial-gradient(700px 360px at 0% 10%, oklch(0.45 0.08 250 / 0.1), transparent 60%),
        linear-gradient(180deg, oklch(0.16 0.02 285), oklch(0.11 0.02 285));
    }
    body::after {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background: radial-gradient(120% 120% at 50% 35%, transparent 55%, rgba(0,0,0,.22) 80%, rgba(0,0,0,.46) 100%);
    }
    .wrap { position: relative; z-index: 1; max-width: 1120px; margin: 0 auto; padding: 54px 28px 96px; }
    .system-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 26px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 999px;
      background: rgba(255,255,255,.05);
      padding: 7px 13px;
      color: #cbd5e1;
      font-family: var(--mono);
      font-size: 11px;
      letter-spacing: .06em;
      text-transform: uppercase;
      backdrop-filter: blur(12px);
    }
    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(320px, .95fr);
      gap: 30px;
      align-items: center;
      margin-bottom: 64px;
    }
    @media (max-width: 860px) { .hero { grid-template-columns: 1fr; } }
    h1 {
      margin: 0 0 12px;
      font-size: clamp(56px, 8vw, 88px);
      line-height: 1;
      letter-spacing: 0;
      font-weight: 800;
    }
    .lab {
      background: linear-gradient(90deg,#22d3ee,#60a5fa,#a78bfa);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .nana { color: #f472b6; }
    .lede { max-width: 58ch; margin: 0 0 26px; color: #cbd5e1; font-size: 17px; }
    .powered {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 999px;
      background: rgba(255,255,255,.05);
      padding: 8px 14px;
      color: var(--muted);
      font-size: 13px;
      backdrop-filter: blur(12px);
    }
    .badge-cloud { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
    .capability { position: relative; display: inline-flex; }
    .capability::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 999px;
      background: var(--glow);
      opacity: .55;
      filter: blur(12px);
    }
    .capability span {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 1px solid rgba(255,255,255,.2);
      border-radius: 999px;
      background: rgba(0,0,0,.8);
      padding: 7px 11px;
      color: #f8fafc;
      font-size: 12px;
      box-shadow: 0 12px 24px rgba(0,0,0,.26);
      backdrop-filter: blur(10px);
    }
    .capability i {
      width: 16px;
      height: 16px;
      border-radius: 999px;
      background: var(--glow);
      box-shadow: 0 0 18px currentColor;
    }
    .glass {
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(148,163,184,.38);
      border-radius: 24px;
      background: color-mix(in oklab, var(--surface) 75%, oklch(0.08 0 0) 25%);
      padding: 22px;
      box-shadow: 0 22px 60px rgba(0,0,0,.7);
      backdrop-filter: blur(16px);
    }
    .glass::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(160% 200% at 50% 0, rgba(255,255,255,.16), transparent 55%),
        linear-gradient(135deg, rgba(251,113,133,.2), transparent 28%, transparent 72%, rgba(56,189,248,.18));
      mix-blend-mode: screen;
    }
    .glass > * { position: relative; }
    .prompt {
      min-height: 96px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 12px;
      background: rgba(2,6,23,.44);
      padding: 14px;
      color: #dbeafe;
    }
    .toolbar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 14px; }
    .tool {
      border: 1px solid rgba(255,255,255,.14);
      border-radius: 8px;
      background: rgba(255,255,255,.04);
      padding: 7px 10px;
      color: #f8fafc;
      font-size: 12px;
    }
    .generate {
      margin-left: auto;
      border-radius: 8px;
      background: var(--gold);
      color: var(--gold-fg);
      padding: 8px 13px;
      font-weight: 700;
      font-size: 13px;
    }
    section { margin-bottom: 62px; }
    .section-title { margin: 0 0 18px; font-size: 22px; font-weight: 650; }
    .palette { display: grid; grid-template-columns: repeat(auto-fill, minmax(145px, 1fr)); gap: 14px; }
    .swatch { overflow: hidden; border: 1px solid rgba(255,255,255,.12); border-radius: 12px; background: rgba(255,255,255,.04); }
    .chip { height: 82px; }
    .meta { padding: 9px 11px 11px; }
    .name { display: block; font-size: 13px; font-weight: 600; }
    .hex { display: block; color: var(--muted); font-family: var(--mono); font-size: 11px; }
    .components { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    @media (max-width: 860px) { .components { grid-template-columns: 1fr; } }
    .component-card {
      min-height: 190px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 16px;
      background: rgba(255,255,255,.04);
      padding: 18px;
    }
    .image-card {
      height: 132px;
      border: 1px solid rgba(255,255,255,.12);
      background:
        linear-gradient(135deg, rgba(251,113,133,.28), transparent 35%),
        linear-gradient(315deg, rgba(56,189,248,.24), transparent 35%),
        rgba(0,0,0,.7);
    }
    .premium {
      border: 2px solid transparent;
      background:
        linear-gradient(#0a0e1a,#0a0e1a) padding-box,
        linear-gradient(90deg,#00bbd0,#fb64b6,#00bbd0) border-box;
      box-shadow: 0 0 34px rgba(0,187,208,.2), 0 0 40px rgba(251,100,182,.16);
    }
    .premium strong {
      background: linear-gradient(90deg,#00bbd0,#fb64b6,#00bbd0);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .prose {
      border-top: 1px solid rgba(255,255,255,.12);
      padding-top: 32px;
      color: #e5e7eb;
    }
    .prose h1, .prose h2, .prose h3 { color: #fff; }
    .prose h1 { font-size: 28px; }
    .prose h2 { margin-top: 32px; font-size: 20px; }
    .prose h3 { margin-top: 24px; font-size: 16px; }
    .prose p, .prose li { color: #d1d5db; }
    .prose code { font-family: var(--mono); background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); padding: 1px 5px; border-radius: 4px; }
    .prose pre { overflow: auto; border: 1px solid rgba(255,255,255,.12); border-radius: 8px; background: rgba(0,0,0,.36); padding: 12px 14px; }
    .prose .table-wrap { overflow-x: auto; margin: 18px 0; border: 1px solid rgba(255,255,255,.12); border-radius: 8px; background: rgba(255,255,255,.04); }
    .prose table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .prose th, .prose td { padding: 9px 12px; border-bottom: 1px solid rgba(255,255,255,.1); text-align: left; vertical-align: top; }
    .prose th { color: #cbd5e1; background: rgba(0,0,0,.22); }
  </style>
</head>
<body>
  <main class="wrap">
    <span class="system-badge">Design system preview · ${escapeHtml(id)}</span>
    <section class="hero">
      <div>
        <h1><span class="lab">Lab</span><span class="nana">nana</span></h1>
        ${subtitle ? `<p class="lede">${escapeHtml(subtitle)}</p>` : ''}
        <div class="powered">🍌 Powered by Google Nano Banana</div>
        <div class="badge-cloud">
          ${badgeGradients.map(([label, gradient]) => `<span class="capability" style="--glow:${gradient};"><span><i></i>${escapeHtml(label)}</span></span>`).join('')}
        </div>
      </div>
      <div class="glass">
        <div class="prompt">Create a cinematic banana lab floating in deep space, glass panels, golden controls, colorful AI capability lights.</div>
        <div class="toolbar">
          <span class="tool">✨ GPT-Image-2</span>
          <span class="tool">4K <span style="color:#f59e0b;">VIP</span></span>
          <span class="tool">1:1</span>
          <span class="tool" style="color:#34d399;">Free quota</span>
          <span class="generate">Sparkles Generate</span>
        </div>
      </div>
    </section>

    <section>
      <h2 class="section-title">Palette</h2>
      <div class="palette">
        ${swatches.map(([name, value]) => `<div class="swatch"><div class="chip" style="background:${value};"></div><div class="meta"><span class="name">${escapeHtml(name)}</span><span class="hex">${escapeHtml(value)}</span></div></div>`).join('')}
      </div>
    </section>

    <section>
      <h2 class="section-title">Components</h2>
      <div class="components">
        <div class="component-card">
          <div class="image-card"></div>
          <h3>Image card</h3>
          <p style="color:var(--muted);">Black/70 frame so the generated image stays the focus.</p>
        </div>
        <div class="component-card premium">
          <strong>Premium Benefit</strong>
          <p style="color:#cbd5e1;">Cyan/pink neon border, particles, and gradient text for membership moments.</p>
        </div>
        <div class="component-card">
          <h3 style="margin-top:0;">Status colors</h3>
          <p><span style="color:#34d399;">Emerald reward</span><br /><span style="color:#6366f1;">Campaign indigo</span><br /><span style="color:#e63f3f;">Sale red</span><br /><span style="color:#0080ff;">Check-in blue glow</span></p>
        </div>
      </div>
    </section>

    <section class="prose">
      ${renderedMarkdown}
    </section>
  </main>
</body>
</html>`;
}

function renderListenHubPreview(id: string, raw: string): string {
  const titleMatch = /^#\s+(.+?)\s*$/m.exec(raw);
  const title = cleanTitle(titleMatch?.[1] ?? id);
  const subtitle = extractSubtitle(raw);
  const renderedMarkdown = renderMarkdownLite(raw);

  const swatches = [
    ['mars-basic-white', '#ffffff'],
    ['mars-basic-bk07', '#f6f6f6'],
    ['mars-basic-bk06', '#eaeaea'],
    ['mars-basic-bk05', '#999999'],
    ['mars-basic-bk04', '#808080'],
    ['mars-basic-bk03', '#666666'],
    ['mars-basic-bk02', '#333333'],
    ['mars-basic-bk01', '#101010'],
    ['mars-basic-black', '#000000'],
    ['mars-branding', '#6648ff'],
    ['mars-color-error', '#e63f3f'],
    ['mars-color-blue-100', '#b8d2ff'],
    ['mars-color-blue-900', '#3574e3'],
    ['mars-color-pink-100', '#ffd3e8'],
    ['mars-color-pink-900', '#ea378c'],
    ['mars-color-purple-100', '#e2ddff'],
    ['mars-color-purple-900', '#6f61c3'],
    ['mars-color-green-100', '#92e5ba'],
    ['mars-color-green-900', '#38BC78'],
    ['mars-story-book', '#593605'],
    ['mars-story-book-muted', '#bead92'],
    ['Gradient Orange', '#ff8e43'],
    ['Gradient Pink', '#ff58b4'],
    ['Gradient Sky', '#3aadff'],
    ['Soft Orange', '#fca76f'],
    ['Soft Pink', '#ed8fe5'],
    ['Soft Blue', '#7ebdea'],
  ];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} — design system preview</title>
  <style>
    :root {
      --bg: #ffffff;
      --fg: #101010;
      --primary: #000000;
      --primary-fg: #ffffff;
      --muted: #666666;
      --subtle: #999999;
      --border: #eaeaea;
      --surface: #f6f6f6;
      --brand-purple: #6648ff;
      --orange: #ff8e43;
      --pink: #ff58b4;
      --sky: #3aadff;
      --soft-orange: #fca76f;
      --soft-pink: #ed8fe5;
      --soft-blue: #7ebdea;
      --radio-red: #c91133;
      --radio-gold: #e2a76f;
      --sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      --ddin: D-DIN-Bold, "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--fg);
      font-family: var(--sans);
      line-height: 1.55;
      font-size: 15px;
      -webkit-font-smoothing: antialiased;
    }
    .wrap { max-width: 1160px; margin: 0 auto; padding: 54px 28px 96px; }
    .system-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 26px;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: rgba(255,255,255,.72);
      padding: 7px 13px;
      color: var(--muted);
      font-family: var(--mono);
      font-size: 11px;
      letter-spacing: .06em;
      text-transform: uppercase;
      box-shadow: 0 4px 16px rgba(0,0,0,.04);
      backdrop-filter: blur(12px);
    }
    .hero {
      display: grid;
      grid-template-columns: minmax(0, .98fr) minmax(360px, 1.02fr);
      gap: 28px;
      align-items: center;
      margin-bottom: 64px;
    }
    @media (max-width: 880px) { .hero { grid-template-columns: 1fr; } }
    h1 { margin: 0 0 14px; font-size: clamp(50px, 8vw, 78px); line-height: 1.02; letter-spacing: 0; font-weight: 800; }
    .brand-gradient {
      background: linear-gradient(90deg,#ff8e43,#ff58b4,#3aadff);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .lede { max-width: 62ch; margin: 0 0 24px; color: var(--muted); font-size: 17px; }
    .gradient-strip {
      width: min(430px, 100%);
      height: 14px;
      border-radius: 999px;
      background: linear-gradient(90.03deg,#fca76f .03%,#ed8fe5 36.59%,#7ebdea 86.28%);
    }
    .input-card {
      border: 1px solid var(--border);
      border-radius: 20px;
      background: #fff;
      padding: 16px;
      box-shadow: 0 4px 30px rgba(0,0,0,.08);
    }
    .textarea {
      min-height: 82px;
      color: var(--muted);
      font-size: 15px;
      line-height: 22px;
    }
    .action-row { display: flex; justify-content: flex-end; align-items: center; gap: 8px; margin-top: 10px; }
    .chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: var(--surface);
      color: var(--muted);
      padding: 7px 10px;
      font-size: 12px;
    }
    .submit {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: #000;
      color: #fff;
      font-weight: 800;
    }
    section { margin-bottom: 62px; }
    .section-title { margin: 0 0 18px; font-size: 22px; line-height: 30px; font-weight: 650; }
    .palette { display: grid; grid-template-columns: repeat(auto-fill, minmax(138px, 1fr)); gap: 14px; }
    .swatch { overflow: hidden; border: 1px solid var(--border); border-radius: 12px; background: #fff; box-shadow: 0 0 16px rgba(0,0,0,.04); }
    .swatch .sample { height: 76px; }
    .meta { padding: 9px 11px 11px; }
    .name { display: block; font-size: 13px; font-weight: 600; }
    .hex { display: block; color: var(--subtle); font-family: var(--mono); font-size: 11px; }
    .typo-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
    @media (max-width: 820px) { .typo-grid { grid-template-columns: 1fr; } }
    .typo-card, .component-card {
      border: 1px solid var(--border);
      border-radius: 16px;
      background: #fff;
      padding: 18px;
      box-shadow: 0 0 16px rgba(0,0,0,.04);
    }
    .typo-label { color: var(--subtle); font-family: var(--mono); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; }
    .mars-title { margin-top: 8px; font-size: 22px; line-height: 30px; font-weight: 500; }
    .mars-body { margin-top: 8px; color: var(--muted); font-size: 15px; line-height: 22px; }
    .ddin { margin-top: 8px; font-family: var(--ddin); font-size: 38px; line-height: 1; }
    .components { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
    @media (max-width: 920px) { .components { grid-template-columns: 1fr; } }
    .product-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-top: 16px; }
    @media (max-width: 480px) { .product-grid { grid-template-columns: repeat(2,1fr); } }
    .product-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      border: 1px solid var(--border);
      border-radius: 16px;
      background: #fff;
      padding: 12px;
      font-size: 13px;
      font-weight: 600;
    }
    .product-btn:hover { background: var(--surface); }
    .product-icon { width: 40px; height: 40px; border-radius: 6px; display: grid; place-items: center; font-weight: 800; font-size: 14px; flex-shrink: 0; }
    .product-desc { color: var(--muted); font-size: 12px; font-weight: 400; margin-top: 2px; }
    .player {
      margin-top: 14px;
      border-top: 1px solid var(--border);
      background: #fff;
      padding-top: 14px;
      display: grid;
      grid-template-columns: 40px 1fr 36px;
      gap: 10px;
      align-items: center;
    }
    .cover { width: 40px; height: 40px; border-radius: 8px; background: linear-gradient(135deg,#999,#333); }
    .bar { height: 4px; border-radius: 999px; background: #eaeaea; overflow: hidden; margin-top: 7px; }
    .bar span { display: block; width: 58%; height: 100%; background: #000; }
    .play { width: 36px; height: 36px; border-radius: 999px; background: #000; color: #fff; display: grid; place-items: center; }
    .pricing-mini {
      border: 2px solid transparent;
      border-radius: 26px;
      background:
        linear-gradient(154.3deg,#fffaf6 2.06%,#fff5fe 50.52%,#f5fbff 98.18%) padding-box,
        linear-gradient(151.66deg,#fca76f 1.24%,#ed8fe5 48.81%,#7ebdea 96.1%) border-box;
      padding: 18px;
    }
    .popular { display:inline-flex; border-radius:999px; background:#000; color:#fff; padding:3px 10px; font-size:12px; font-weight:500; }
    .radio {
      border: 3px solid var(--radio-red);
      border-radius: 16px;
      background: linear-gradient(180deg,#fff,#f5f5f5);
      box-shadow: 0 10px 22px rgba(0,0,0,.1), inset 0 -5px 7px #fff, inset 0 5px 0 rgba(255,255,255,.99);
      padding: 16px;
    }
    .onair { display:inline-flex; border:2px solid #000; border-radius:33px; background:#ffecd2; color:#f63155; padding:5px 14px; font-weight:800; box-shadow: inset 0 3px 5.3px #fff6ef, inset 0 0 16px rgba(255,98,0,.3); }
    .radio-row { margin-top: 12px; height: 34px; border-bottom: 1px solid var(--radio-red); background: #fff4e3; display:flex; align-items:center; justify-content:space-between; padding:0 8px; color:#333; font-size:13px; }
    .prose {
      border-top: 1px solid var(--border);
      padding-top: 32px;
      color: var(--fg);
    }
    .prose h1, .prose h2, .prose h3 { color: var(--fg); }
    .prose h1 { font-size: 28px; }
    .prose h2 { margin-top: 32px; font-size: 20px; }
    .prose h3 { margin-top: 24px; font-size: 16px; }
    .prose p, .prose li { color: #333; }
    .prose code { font-family: var(--mono); background: var(--surface); border: 1px solid var(--border); padding: 1px 5px; border-radius: 4px; }
    .prose pre { overflow: auto; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); padding: 12px 14px; }
    .prose .table-wrap { overflow-x: auto; margin: 18px 0; border: 1px solid var(--border); border-radius: 8px; background: #fff; }
    .prose table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .prose th, .prose td { padding: 9px 12px; border-bottom: 1px solid var(--border); text-align: left; vertical-align: top; }
    .prose th { color: var(--muted); background: var(--surface); }
  </style>
</head>
<body>
  <main class="wrap">
    <span class="system-badge">Design system preview · ${escapeHtml(id)}</span>
    <section class="hero">
      <div>
        <h1>${escapeHtml(title)}</h1>
        ${subtitle ? `<p class="lede">${escapeHtml(subtitle)}</p>` : ''}
        <div class="gradient-strip" aria-label="#ff8e43 to #ff58b4 to #3aadff"></div>
      </div>
      <div class="input-card">
        <div class="textarea">Paste a source, upload a file, or describe what you want to create.</div>
        <div class="action-row">
          <span class="chip">AI Podcast</span>
          <span class="chip">FlowSpeech</span>
          <span class="chip">Slides</span>
          <span class="submit">→</span>
        </div>
      </div>
    </section>

    <section>
      <h2 class="section-title">Palette</h2>
      <div class="palette">
        ${swatches.map(([name, value]) => `<div class="swatch"><div class="sample" style="background:${value};"></div><div class="meta"><span class="name">${escapeHtml(name)}</span><span class="hex">${escapeHtml(value)}</span></div></div>`).join('')}
      </div>
    </section>

    <section>
      <h2 class="section-title">Mars typography</h2>
      <div class="typo-grid">
        <div class="typo-card"><div class="typo-label">mars-text-title-22</div><div class="mars-title">Create professional audio stories</div></div>
        <div class="typo-card"><div class="typo-label">mars-text-body-15</div><div class="mars-body">A compact body scale keeps controls, metadata, and descriptions calm inside dense creation workflows.</div></div>
        <div class="typo-card"><div class="typo-label">D-DIN price</div><div class="ddin">$29</div></div>
      </div>
    </section>

    <section>
      <h2 class="section-title">Components</h2>
      <div class="components">
        <div class="component-card">
          <strong>Product buttons (Home v2)</strong>
          <div class="product-grid">
            <div class="product-btn"><span class="product-icon" style="background:rgba(255,211,232,.8);color:#ea378c;">▶</span><div>Explainer Video<div class="product-desc">Video from text</div></div></div>
            <div class="product-btn"><span class="product-icon" style="background:rgba(255,211,232,.8);color:#ea378c;">▤</span><div>Slides<div class="product-desc">AI presentation</div></div></div>
            <div class="product-btn"><span class="product-icon" style="background:rgba(226,221,255,.8);color:#6f61c3;">◉</span><div>AI Podcast<div class="product-desc">Multi-speaker</div></div></div>
            <div class="product-btn"><span class="product-icon" style="background:rgba(226,221,255,.8);color:#6f61c3;">♪</span><div>Text To Speech<div class="product-desc">Narration</div></div></div>
            <div class="product-btn"><span class="product-icon" style="background:rgba(146,229,186,.8);color:#38BC78;">◻</span><div>AI Image<div class="product-desc">Generate images</div></div></div>
            <div class="product-btn"><span class="product-icon" style="background:rgba(146,229,186,.8);color:#38BC78;">⎗</span><div>Voice Cloning<div class="product-desc">Clone voice</div></div></div>
          </div>
        </div>
        <div class="component-card">
          <strong>Audio player</strong>
          <div class="player"><span class="cover"></span><span><b>Daily product brief</b><div class="bar"><span></span></div></span><span class="play">▶</span></div>
        </div>
        <div class="component-card pricing-mini">
          <span class="popular">Popular</span>
          <h3 style="margin:10px 0 4px;">Pro gradient plan</h3>
          <div class="ddin">$29</div>
          <p style="color:var(--muted);">Gradient border, D-DIN price, black CTA.</p>
        </div>
        <div class="component-card radio">
          <span class="onair">ON AIR</span>
          <h3 style="margin:12px 0 4px;">Zhihu Radio</h3>
          <div class="radio-row"><span>24H Radio playlist</span><span style="color:var(--radio-gold);">Play</span></div>
        </div>
      </div>
    </section>

    <section class="prose">
      ${renderedMarkdown}
    </section>
  </main>
</body>
</html>`;
}

function extractSubtitle(raw: string): string {
  const lines = raw.split(/\r?\n/);
  const h1 = lines.findIndex((l) => /^#\s+/.test(l));
  if (h1 === -1) return '';
  const after = lines.slice(h1 + 1);
  const nextHeading = after.findIndex((l) => /^#{1,6}\s+/.test(l));
  const window = (nextHeading === -1 ? after : after.slice(0, nextHeading))
    .join('\n')
    .replace(/^>\s*Category:.*$/gim, '')
    .replace(/^>\s*/gm, '')
    .trim();
  return window.split(/\n\n/)[0]?.slice(0, 240) ?? '';
}

function extractColors(raw: string): ColorToken[] {
  const colors: ColorToken[] = [];
  const seen = new Set<string>();

  function push(name: string, value: string): void {
    const cleanName = name.replace(/[*_`]+/g, '').replace(/\s+/g, ' ').trim();
    if (!cleanName || cleanName.length > 60) return;
    const v = normalizeHex(value);
    const key = `${cleanName.toLowerCase()}|${v}`;
    if (seen.has(key)) return;
    seen.add(key);
    colors.push({ name: cleanName, value: v });
  }

  // Form A: "- **Background:** `#FAFAFA`" / "- Background: #FAFAFA"
  const reA = /^[\s>*-]*\**\s*([A-Za-z][A-Za-z0-9 /&()+_-]{1,40}?)\s*\**\s*[:：]\s*`?(#[0-9a-fA-F]{3,8})/gm;
  let m;
  while ((m = reA.exec(raw)) !== null) push(m[1] ?? '', m[2] ?? '');

  // Form B: "**Stripe Purple** (`#533afd`)" — common in awesome-design-md.
  // Token name is whatever's bolded; the hex follows in parens/backticks.
  const reB = /\*\*([A-Za-z][A-Za-z0-9 /&()+_-]{1,40}?)\*\*\s*\(?\s*`?(#[0-9a-fA-F]{3,8})/g;
  while ((m = reB.exec(raw)) !== null) push(m[1] ?? '', m[2] ?? '');

  return colors;
}

function extractFonts(raw: string): FontHints {
  const out: FontHints = {};
  // "- **Display / headings:** `'GT Sectra', ...`"
  // We want the backticked stack OR the rest of the line.
  const re = /^[\s>*-]*\**\s*([A-Za-z][A-Za-z /]{1,30}?)\s*\**\s*[:：]\s*`?([^`\n]+?)`?$/gm;
  let m;
  while ((m = re.exec(raw)) !== null) {
    const label = (m[1] ?? '').toLowerCase();
    const value = (m[2] ?? '').trim().replace(/[*_`]+$/g, '').trim();
    if (!/[a-zA-Z]/.test(value)) continue;
    if (value.startsWith('#')) continue;
    if (/display|heading|h1|title/.test(label) && !out.display) out.display = value;
    else if (/body|text|paragraph|copy/.test(label) && !out.body) out.body = value;
    else if (/mono|code/.test(label) && !out.mono) out.mono = value;
  }
  return out;
}

function pickColor(colors: ColorToken[], hints: string[]): string | null {
  for (const hint of hints) {
    const needle = hint.toLowerCase();
    const found = colors.find((c) => c.name.toLowerCase().includes(needle));
    if (found) return found.value;
  }
  return null;
}

function firstNonNeutral(colors: ColorToken[]): string | null {
  for (const c of colors) {
    const v = c.value.replace('#', '').toLowerCase();
    if (v.length !== 6) continue;
    const r = parseInt(v.slice(0, 2), 16);
    const g = parseInt(v.slice(2, 4), 16);
    const b = parseInt(v.slice(4, 6), 16);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    if (sat > 0.25) return c.value;
  }
  return null;
}

function pickReadableForeground(hex: string): string {
  const n = normalizeHex(hex);
  if (n.length !== 7) return '#ffffff';
  const r = parseInt(n.slice(1, 3), 16);
  const g = parseInt(n.slice(3, 5), 16);
  const b = parseInt(n.slice(5, 7), 16);
  // Standard luminance check.
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? '#0a0a0a' : '#ffffff';
}

function normalizeHex(hex: string): string {
  let h = hex.toLowerCase();
  if (h.length === 4) {
    h = '#' + h.slice(1).split('').map((c) => c + c).join('');
  }
  return h;
}

function cleanTitle(raw: string): string {
  return String(raw).replace(/^Design System (Inspired by|for)\s+/i, '').trim();
}

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) =>
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '"' ? '&quot;' : '&#39;',
  );
}

// Tiny markdown renderer — enough for our DESIGN.md prose: H1–H4, paragraphs,
// bullet/ordered lists, blockquotes, fenced code, GFM pipe tables, horizontal
// rules, inline `code` / **bold** / *italic* / [link](url). Not a full markdown
// implementation but covers everything the DESIGN.md files actually use.
function renderMarkdownLite(src: string): string {
  const lines = src.split(/\r?\n/);
  const out: string[] = [];
  let inList: ListTag | null = null;
  let inBlockquote = false;
  let inCode = false;
  let i = 0;

  function closeList() {
    if (inList) {
      out.push(`</${inList}>`);
      inList = null;
    }
  }
  function closeBlockquote() {
    if (inBlockquote) {
      out.push('</blockquote>');
      inBlockquote = false;
    }
  }

  while (i < lines.length) {
    const raw = lines[i] ?? '';
    const line = raw.trimEnd();

    if (line.startsWith('```')) {
      closeList();
      closeBlockquote();
      if (!inCode) {
        out.push('<pre><code>');
        inCode = true;
      } else {
        out.push('</code></pre>');
        inCode = false;
      }
      i++;
      continue;
    }
    if (inCode) {
      out.push(escapeHtml(raw));
      i++;
      continue;
    }
    if (!line.trim()) {
      closeList();
      closeBlockquote();
      i++;
      continue;
    }

    // GFM pipe table — at least a header row, a separator row of dashes,
    // and one body row. Look ahead from `i` so we can consume the whole
    // block in one step.
    if (looksLikeTableHeader(line) && i + 1 < lines.length && isTableSeparator(lines[i + 1] ?? '')) {
      closeList();
      closeBlockquote();
      const headerCells = splitTableRow(line);
      const aligns = parseAlignments(lines[i + 1] ?? '', headerCells.length);
      const bodyRows: string[][] = [];
      let j = i + 2;
      while (j < lines.length) {
        const next = (lines[j] ?? '').trimEnd();
        if (!next.trim() || !next.includes('|')) break;
        bodyRows.push(splitTableRow(next));
        j++;
      }
      out.push(renderTable(headerCells, bodyRows, aligns));
      i = j;
      continue;
    }

    // ATX headings #..####
    const h = /^(#{1,4})\s+(.+)$/.exec(line);
    if (h) {
      closeList();
      closeBlockquote();
      const level = h[1]?.length ?? 1;
      out.push(`<h${level}>${inline(h[2] ?? '')}</h${level}>`);
      i++;
      continue;
    }

    // Horizontal rule.
    if (/^([-*_])\1{2,}\s*$/.test(line)) {
      closeList();
      closeBlockquote();
      out.push('<hr />');
      i++;
      continue;
    }

    const bq = /^>\s?(.*)$/.exec(line);
    if (bq) {
      closeList();
      if (!inBlockquote) {
        out.push('<blockquote>');
        inBlockquote = true;
      }
      out.push(`<p>${inline(bq[1] || '')}</p>`);
      i++;
      continue;
    }

    closeBlockquote();
    const li = /^([-*])\s+(.+)$/.exec(line);
    if (li) {
      if (inList !== 'ul') {
        closeList();
        out.push('<ul>');
        inList = 'ul';
      }
      out.push(`<li>${inline(li[2] ?? '')}</li>`);
      i++;
      continue;
    }
    const oli = /^\d+\.\s+(.+)$/.exec(line);
    if (oli) {
      if (inList !== 'ol') {
        closeList();
        out.push('<ol>');
        inList = 'ol';
      }
      out.push(`<li>${inline(oli[1] ?? '')}</li>`);
      i++;
      continue;
    }
    closeList();
    out.push(`<p>${inline(line)}</p>`);
    i++;
  }
  closeList();
  closeBlockquote();
  if (inCode) out.push('</code></pre>');
  return out.join('\n');
}

function looksLikeTableHeader(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.includes('|')) return false;
  // At least one pipe between non-pipe content.
  return /\|/.test(trimmed.replace(/^\||\|$/g, ''));
}

function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.includes('|')) return false;
  // Each cell must be only dashes / colons / whitespace.
  return splitTableRow(trimmed).every((cell) => /^:?-{1,}:?$/.test(cell.trim()));
}

function splitTableRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split('|').map((c) => c.trim());
}

function parseAlignments(separatorLine: string, count: number): TableAlign[] {
  const cells = splitTableRow(separatorLine);
  const aligns: TableAlign[] = [];
  for (let k = 0; k < count; k++) {
    const cell = (cells[k] ?? '').trim();
    const left = cell.startsWith(':');
    const right = cell.endsWith(':');
    if (left && right) aligns.push('center');
    else if (right) aligns.push('right');
    else aligns.push(null);
  }
  return aligns;
}

function renderTable(header: string[], rows: string[][], aligns: TableAlign[]): string {
  const th = header
    .map((cell, k) => {
      const align = aligns[k];
      const attr = align ? ` align="${align}"` : '';
      return `<th${attr}>${inline(cell)}</th>`;
    })
    .join('');
  const body = rows
    .map((row) => {
      const tds = row
        .map((cell, k) => {
          const align = aligns[k];
          const attr = align ? ` align="${align}"` : '';
          return `<td${attr}>${inline(cell)}</td>`;
        })
        .join('');
      return `<tr>${tds}</tr>`;
    })
    .join('');
  return `<div class="table-wrap"><table><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function inline(s: string): string {
  // Process inline tokens. Order matters: code spans first so their content
  // isn't further parsed; then bold/italic; then links; finally bare URLs.
  const escaped = escapeHtml(s);
  return escaped
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
    .replace(/(^|[\s(])_([^_\n]+)_(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>');
}
