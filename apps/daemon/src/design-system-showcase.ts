/**
 * Build a fully-formed product webpage that demonstrates a design system in
 * action — not just a list of tokens, but a real-feeling marketing /
 * product page (nav, hero, social proof, feature grid, dashboard preview,
 * pricing, testimonials, FAQ, CTA, footer) styled entirely from the
 * tokens we extract from the system's DESIGN.md.
 *
 * Same parsing utilities as design-system-preview.js — kept inline rather
 * than imported so the two views can evolve independently.
 */

type ColorToken = { name: string; value: string; role: string };
type FontHints = { display?: string; heading?: string; body?: string; mono?: string };
type RowStatus = 'up' | '';

export function renderDesignSystemShowcase(id: string, raw: string): string {
  if (id === 'banana-lab') return renderBananaLabShowcase(id, raw);
  if (id === 'listenhub') return renderListenHubShowcase(id, raw);

  const titleMatch = /^#\s+(.+?)\s*$/m.exec(raw);
  const rawTitle = titleMatch?.[1] ?? id;
  const title = cleanTitle(rawTitle);
  const subtitle = extractSubtitle(raw) || 'A design system rendered as a real product surface.';
  const colors = extractColors(raw);
  const fonts = extractFonts(raw);

  // Hints are matched against each color's role description (the prose that
  // follows the name in DESIGN.md, e.g. "Primary background.") first, then
  // against the color name. We use word-boundary matching so descriptive
  // names like "Cardinal Red" don't accidentally satisfy a "card" hint and
  // "Gem Pink" doesn't satisfy "ink".
  // Hint ordering matters: more specific phrases come first so a system
  // with both "Primary background" and "Page background in light mode" (e.g.
  // Linear's marketing black + light-mode escape hatch) lands on the
  // dominant role rather than the light-mode subtitle. We drop 'page
  // background' from the bg hints entirely because in practice it almost
  // always belongs to a secondary, light-mode-only entry.
  const bg =
    pickColor(colors, ['primary background', 'background', 'canvas', 'paper'])
    ?? firstLightish(colors)
    ?? '#ffffff';
  // Exclude `bg` so a token whose hex matches the page background (for
  // example Warp's "Warm Parchment" doubling as primary text *and* the
  // firstLightish bg fallback) doesn't make body copy invisible.
  const fg =
    pickColor(
      colors,
      [
        'primary text',
        'body text',
        'foreground',
        'ink primary',
        'heading',
        'ink',
        'graphite',
        'navy',
      ],
      [bg],
    )
    ?? pickReadableForeground(bg)
    ?? '#0a0a0a';
  const accent =
    pickColor(colors, [
      'brand primary',
      'primary brand',
      'primary cta',
      'gradient origin',
      'brand mark',
      'brand color',
    ])
    ?? firstNonNeutral(colors, [bg, fg])
    ?? '#2f6feb';
  const accent2 =
    pickColor(colors, [
      'brand secondary',
      'secondary brand',
      'gradient terminus',
      'tertiary brand',
      'tertiary',
      'highlight',
    ])
    ?? secondNonNeutral(colors, [accent, bg, fg])
    ?? accent;
  const muted =
    pickColor(colors, ['secondary text', 'caption', 'metadata', 'placeholder', 'muted', 'subtle'])
    ?? '#666666';
  const border =
    pickColor(colors, ['border', 'divider', 'hairline', 'rule', 'stroke'])
    ?? '#e6e6e6';
  const surface =
    pickColor(colors, [
      'secondary surface',
      'section break',
      'sidebar',
      'surface subtle',
      'surface',
      'panel',
      'elevated',
      'card surface',
    ])
    ?? mixSurface(bg);

  const display = fonts.display ?? fonts.heading ?? "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  const body = fonts.body ?? display;
  const mono = fonts.mono ?? "ui-monospace, 'JetBrains Mono', monospace";

  const accentFg = pickReadableForeground(accent);
  const accent2Fg = pickReadableForeground(accent2);

  const productName = title;
  const tagline = oneLine(subtitle).slice(0, 120);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(productName)} — showcase</title>
  <style>
    :root {
      --bg: ${bg};
      --fg: ${fg};
      --accent: ${accent};
      --accent-fg: ${accentFg};
      --accent-2: ${accent2};
      --accent-2-fg: ${accent2Fg};
      --muted: ${muted};
      --border: ${border};
      --surface: ${surface};
      --display: ${display};
      --body: ${body};
      --mono: ${mono};
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--fg);
      font-family: var(--body);
      line-height: 1.6;
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
    }
    a { color: inherit; text-decoration: none; }
    img { max-width: 100%; display: block; }
    .container { max-width: 1180px; margin: 0 auto; padding: 0 28px; }

    /* Nav */
    .nav {
      position: sticky; top: 0; z-index: 30;
      background: rgba(255,255,255,0.7);
      backdrop-filter: saturate(180%) blur(14px);
      border-bottom: 1px solid var(--border);
    }
    .nav-row {
      display: flex; align-items: center; gap: 32px;
      height: 64px;
    }
    .brand { display: flex; align-items: center; gap: 10px; font-family: var(--display); font-weight: 700; font-size: 17px; letter-spacing: -0.01em; }
    .brand-mark {
      width: 26px; height: 26px; border-radius: 7px;
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
    }
    .nav-links { display: flex; gap: 22px; font-size: 14px; color: var(--muted); }
    .nav-links a:hover { color: var(--fg); }
    .nav-spacer { flex: 1; }
    .nav-cta {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--fg); color: var(--bg);
      padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 500;
    }
    .nav-link-cta { color: var(--fg); font-weight: 500; font-size: 14px; }

    /* Hero */
    .hero { padding: 96px 0 72px; }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: var(--mono); font-size: 12px; color: var(--muted);
      text-transform: uppercase; letter-spacing: 0.08em;
      padding: 6px 12px; border: 1px solid var(--border); border-radius: 999px;
      background: var(--surface);
      margin-bottom: 24px;
    }
    .hero-eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
    .hero h1 {
      font-family: var(--display);
      font-size: clamp(44px, 6.6vw, 84px);
      line-height: 1.02;
      letter-spacing: -0.025em;
      margin: 0 0 22px;
      max-width: 18ch;
      font-weight: 700;
    }
    .hero h1 em { font-style: normal; background: linear-gradient(120deg, var(--accent), var(--accent-2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .hero p.lede {
      font-size: 19px; color: var(--muted);
      max-width: 56ch; margin: 0 0 36px;
    }
    .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
    .btn {
      font: inherit; cursor: pointer; border-radius: 10px;
      padding: 13px 22px; font-size: 14.5px; font-weight: 500;
      border: 1px solid transparent; display: inline-flex; align-items: center; gap: 8px;
    }
    .btn-primary { background: var(--accent); color: var(--accent-fg); border-color: var(--accent); }
    .btn-primary:hover { filter: brightness(1.06); }
    .btn-ghost { background: transparent; color: var(--fg); border-color: var(--border); }
    .btn-ghost:hover { background: var(--surface); }
    .hero-meta { display: flex; gap: 24px; margin-top: 44px; color: var(--muted); font-size: 13px; }
    .hero-meta span strong { color: var(--fg); font-weight: 600; }

    /* Logo strip */
    .logos { padding: 36px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
    .logos-label { font-size: 12px; color: var(--muted); text-align: center; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 18px; }
    .logos-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 44px; align-items: center; opacity: 0.85; }
    .logo-pill { font-family: var(--display); font-weight: 700; font-size: 17px; letter-spacing: -0.01em; color: var(--muted); }

    /* Features grid */
    .section { padding: 96px 0; }
    .section-eyebrow { font-family: var(--mono); text-transform: uppercase; letter-spacing: 0.1em; font-size: 12px; color: var(--accent); margin-bottom: 12px; }
    .section-title { font-family: var(--display); font-size: clamp(32px, 4.2vw, 48px); letter-spacing: -0.02em; line-height: 1.1; margin: 0 0 18px; max-width: 22ch; font-weight: 700; }
    .section-lede { color: var(--muted); font-size: 17px; max-width: 56ch; margin: 0 0 48px; }
    .features {
      display: grid; gap: 18px;
      grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 920px) { .features { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 600px) { .features { grid-template-columns: 1fr; } }
    .feature {
      background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
      padding: 26px; display: flex; flex-direction: column; gap: 12px;
    }
    .feature-icon {
      width: 36px; height: 36px; border-radius: 8px;
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      color: var(--accent-fg);
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 700;
    }
    .feature h3 { font-family: var(--display); font-size: 18px; margin: 0; letter-spacing: -0.01em; }
    .feature p { color: var(--muted); margin: 0; font-size: 14.5px; line-height: 1.55; }

    /* Product preview / dashboard mock */
    .preview-wrap { padding-top: 24px; padding-bottom: 96px; }
    .preview-frame {
      background: var(--surface); border: 1px solid var(--border); border-radius: 18px;
      padding: 14px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.06), 0 12px 30px rgba(0,0,0,0.04);
    }
    .preview-titlebar { display: flex; gap: 6px; padding: 4px 8px 12px; }
    .preview-titlebar span { width: 10px; height: 10px; border-radius: 50%; background: var(--border); }
    .preview-app {
      background: var(--bg); border: 1px solid var(--border); border-radius: 12px;
      display: grid; grid-template-columns: 220px 1fr; min-height: 440px; overflow: hidden;
    }
    .preview-side { background: var(--surface); border-right: 1px solid var(--border); padding: 18px 14px; display: flex; flex-direction: column; gap: 4px; }
    .side-link { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; font-size: 13.5px; color: var(--muted); }
    .side-link.active { background: var(--bg); color: var(--fg); font-weight: 500; box-shadow: inset 0 0 0 1px var(--border); }
    .side-link .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
    .side-section { font-family: var(--mono); text-transform: uppercase; font-size: 10px; letter-spacing: 0.08em; color: var(--muted); padding: 14px 10px 6px; }
    .preview-main { padding: 22px 24px; display: flex; flex-direction: column; gap: 22px; }
    .preview-head { display: flex; align-items: center; justify-content: space-between; }
    .preview-head h4 { font-family: var(--display); font-size: 22px; margin: 0; letter-spacing: -0.01em; }
    .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
    .kpi { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; }
    .kpi .label { font-size: 11.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; }
    .kpi .value { font-family: var(--display); font-size: 24px; font-weight: 700; margin-top: 4px; letter-spacing: -0.01em; }
    .kpi .delta { font-family: var(--mono); font-size: 11.5px; margin-top: 2px; color: var(--accent); }
    .chart-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 18px; }
    .chart-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
    .chart-head .title { font-weight: 600; font-size: 14px; }
    .chart-head .meta { font-family: var(--mono); font-size: 11px; color: var(--muted); }
    .chart svg { width: 100%; height: 160px; display: block; }
    .preview-row-2 { display: grid; grid-template-columns: 1.6fr 1fr; gap: 14px; }
    .list-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; }
    .list-row { display: grid; grid-template-columns: 1fr auto auto; gap: 12px; padding: 12px 16px; border-top: 1px solid var(--border); align-items: center; }
    .list-row:first-of-type { border-top: none; }
    .list-row .name { font-weight: 500; font-size: 13.5px; }
    .list-row .meta { font-family: var(--mono); font-size: 11.5px; color: var(--muted); }
    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 500; background: var(--bg); border: 1px solid var(--border); color: var(--muted); }
    .badge.up { color: var(--accent); border-color: color-mix(in srgb, var(--accent) 30%, transparent); }
    .list-card .head { display: flex; justify-content: space-between; align-items: baseline; padding: 14px 16px; border-bottom: 1px solid var(--border); }
    .list-card .head h5 { margin: 0; font-size: 14px; }

    /* Pricing */
    .pricing { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
    @media (max-width: 920px) { .pricing { grid-template-columns: 1fr; } }
    .price-card {
      background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
      padding: 28px; display: flex; flex-direction: column; gap: 18px;
    }
    .price-card.featured {
      background: var(--fg); color: var(--bg); border-color: var(--fg);
    }
    .price-card.featured .muted, .price-card.featured h3, .price-card.featured .price { color: var(--bg); }
    .price-card .tier-name { font-family: var(--display); font-size: 14px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--muted); }
    .price-card .price { font-family: var(--display); font-size: 44px; font-weight: 700; letter-spacing: -0.02em; line-height: 1; }
    .price-card .price small { font-size: 14px; color: var(--muted); font-weight: 400; }
    .price-card ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-size: 14.5px; }
    .price-card li::before { content: "✓"; color: var(--accent); margin-right: 8px; font-weight: 700; }
    .price-card.featured li::before { color: var(--accent-2); }

    /* Testimonials */
    .quotes { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    @media (max-width: 760px) { .quotes { grid-template-columns: 1fr; } }
    .quote { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 26px; display: flex; flex-direction: column; gap: 18px; }
    .quote p { font-size: 17px; line-height: 1.55; margin: 0; font-family: var(--display); letter-spacing: -0.01em; }
    .quote-author { display: flex; align-items: center; gap: 12px; }
    .quote-author .avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent-2)); }
    .quote-author .name { font-weight: 600; font-size: 13.5px; }
    .quote-author .role { font-size: 12.5px; color: var(--muted); }

    /* FAQ */
    .faq { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 32px; }
    @media (max-width: 760px) { .faq { grid-template-columns: 1fr; } }
    .faq-item { padding: 18px 0; border-top: 1px solid var(--border); }
    .faq-item h4 { margin: 0 0 6px; font-family: var(--display); font-size: 17px; letter-spacing: -0.01em; }
    .faq-item p { margin: 0; color: var(--muted); font-size: 14.5px; }

    /* CTA */
    .cta {
      margin: 48px 0 96px;
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      color: var(--accent-fg);
      border-radius: 24px;
      padding: 64px 56px;
      display: grid;
      grid-template-columns: 1.4fr auto;
      gap: 32px;
      align-items: center;
    }
    @media (max-width: 760px) { .cta { grid-template-columns: 1fr; padding: 36px; } }
    .cta h2 { font-family: var(--display); font-size: clamp(28px, 4vw, 40px); letter-spacing: -0.02em; margin: 0 0 10px; line-height: 1.1; max-width: 22ch; }
    .cta p { margin: 0; opacity: 0.92; font-size: 16px; max-width: 50ch; }
    .cta .btn { background: var(--accent-fg); color: var(--accent); border: none; }
    .cta .btn-secondary { background: transparent; color: var(--accent-fg); border: 1px solid color-mix(in srgb, var(--accent-fg) 35%, transparent); }

    /* Footer */
    footer { border-top: 1px solid var(--border); padding: 36px 0 56px; color: var(--muted); font-size: 13.5px; }
    .footer-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 32px; margin-bottom: 32px; }
    @media (max-width: 760px) { .footer-row { grid-template-columns: 1fr 1fr; } }
    .footer-col h6 { color: var(--fg); font-family: var(--display); font-size: 13.5px; margin: 0 0 12px; font-weight: 600; }
    .footer-col a { display: block; padding: 4px 0; }
    .footer-col a:hover { color: var(--fg); }
    .footer-bottom { display: flex; justify-content: space-between; padding-top: 24px; border-top: 1px solid var(--border); }
  </style>
</head>
<body>
  <header class="nav">
    <div class="container nav-row">
      <a class="brand" href="#"><span class="brand-mark"></span>${escapeHtml(productName)}</a>
      <nav class="nav-links">
        <a href="#features">Product</a>
        <a href="#preview">Workspace</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">Docs</a>
        <a href="#faq">Customers</a>
      </nav>
      <div class="nav-spacer"></div>
      <a class="nav-link-cta" href="#">Sign in</a>
      <a class="nav-cta" href="#">Get started →</a>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="container">
        <div class="hero-eyebrow"><span class="dot"></span>${escapeHtml(productName)} · live preview</div>
        <h1>The system that makes <em>${escapeHtml(productName)}</em> feel like ${escapeHtml(productName)}.</h1>
        <p class="lede">${escapeHtml(tagline)}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#">Start a free trial →</a>
          <a class="btn btn-ghost" href="#preview">See it in action</a>
        </div>
        <div class="hero-meta">
          <span><strong>4.9</strong> · App Store rating</span>
          <span><strong>SOC 2</strong> · Type II compliant</span>
          <span><strong>120k+</strong> active teams</span>
        </div>
      </div>
    </section>

    <section class="logos">
      <div class="container">
        <div class="logos-label">Trusted by teams shipping serious work</div>
        <div class="logos-row">
          <span class="logo-pill">Northwind</span>
          <span class="logo-pill">Pioneer</span>
          <span class="logo-pill">Lattice</span>
          <span class="logo-pill">Atlas Co.</span>
          <span class="logo-pill">Voltage</span>
          <span class="logo-pill">Foundry</span>
        </div>
      </div>
    </section>

    <section class="section" id="features">
      <div class="container">
        <div class="section-eyebrow">What it does</div>
        <h2 class="section-title">Every primitive a fast team needs.</h2>
        <p class="section-lede">A system styled entirely from the tokens of ${escapeHtml(productName)} — palette, typography, surfaces, and motion. Drop it into any product and it stays in character.</p>
        <div class="features">
          ${featureCard('★', 'Tokens that compose', 'Color, type, spacing, and elevation defined once and reused across every surface — from a marketing hero to a row in a table.')}
          ${featureCard('◐', 'Light & dark in lockstep', 'Every component ships with both modes. The accent reads as confident in either context, and contrast meets WCAG AA out of the box.')}
          ${featureCard('⌘', 'Desktop-first, but mobile-honest', 'Layouts collapse from a 12-column desktop grid to a focused single column without losing density or rhythm.')}
          ${featureCard('▣', 'Production-grade primitives', '40+ components — from the obvious (button, input) to the load-bearing (data table, command bar, empty states).')}
          ${featureCard('↗', 'Designed for handoff', 'Every spec carries a Figma frame, a code snippet, and a "do/don’t" pair so engineers don’t have to guess.')}
          ${featureCard('∞', 'Built to evolve', 'Tokens version semver-style. A palette refresh ships through one file — no component code touches.')}
        </div>
      </div>
    </section>

    <section class="preview-wrap" id="preview">
      <div class="container">
        <div class="section-eyebrow">In production</div>
        <h2 class="section-title">A workspace, fully styled.</h2>
        <p class="section-lede">This is the same component library you'd use in your app — rendered with ${escapeHtml(productName)} tokens.</p>
        <div class="preview-frame">
          <div class="preview-titlebar"><span></span><span></span><span></span></div>
          <div class="preview-app">
            <aside class="preview-side">
              <div class="brand" style="margin-bottom: 14px;"><span class="brand-mark"></span>${escapeHtml(productName)}</div>
              <a class="side-link active"><span class="dot"></span>Overview</a>
              <a class="side-link">Customers</a>
              <a class="side-link">Pipeline</a>
              <a class="side-link">Reports</a>
              <a class="side-link">Automations</a>
              <div class="side-section">Workspaces</div>
              <a class="side-link">Growth</a>
              <a class="side-link">Lifecycle</a>
              <a class="side-link">Finance</a>
            </aside>
            <div class="preview-main">
              <div class="preview-head">
                <h4>Overview</h4>
                <span class="badge up">↑ 12.4% this week</span>
              </div>
              <div class="kpi-row">
                ${kpi('MRR', '$184,210', '+8.2%')}
                ${kpi('Active orgs', '2,914', '+121')}
                ${kpi('Conversion', '4.6%', '+0.4 pp')}
                ${kpi('Net retention', '113%', '+2 pp')}
              </div>
              <div class="chart-card">
                <div class="chart-head">
                  <span class="title">Revenue · last 12 weeks</span>
                  <span class="meta">USD · weekly</span>
                </div>
                <div class="chart">
                  ${inlineLineChart()}
                </div>
              </div>
              <div class="preview-row-2">
                <div class="list-card">
                  <div class="head">
                    <h5>Top accounts</h5>
                    <span class="badge">View all</span>
                  </div>
                  ${listRow('Northwind Trading', 'Annual · NA', '$48,200', 'up')}
                  ${listRow('Pioneer Robotics', 'Quarterly · EMEA', '$31,890', 'up')}
                  ${listRow('Atlas Cooperative', 'Annual · APAC', '$22,400', '')}
                  ${listRow('Foundry Group', 'Monthly · NA', '$14,750', 'up')}
                </div>
                <div class="list-card">
                  <div class="head">
                    <h5>Activity</h5>
                    <span class="badge">Live</span>
                  </div>
                  ${activityRow('Renewal closed', 'Lattice · 11m ago')}
                  ${activityRow('Trial started', 'Voltage · 22m ago')}
                  ${activityRow('Plan upgraded', 'Pioneer · 1h ago')}
                  ${activityRow('Invoice paid', 'Atlas · 2h ago')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="pricing" style="padding-top: 24px;">
      <div class="container">
        <div class="section-eyebrow">Pricing</div>
        <h2 class="section-title">Built for teams of one to one thousand.</h2>
        <p class="section-lede">Pick the plan that matches the way your team ships. Every tier ships the full token system.</p>
        <div class="pricing">
          ${priceCard('Starter', '$0', 'Free forever', ['Single user', 'All core tokens', 'Up to 3 projects', 'Community support'])}
          ${priceCard('Team', '$24', 'per seat / month', ['Unlimited projects', 'Real-time co-edit', 'Brand themes', 'Priority email support'], true)}
          ${priceCard('Enterprise', 'Custom', 'volume pricing', ['SSO + SCIM', 'Audit logs', 'Custom token schemas', 'Dedicated success manager'])}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-eyebrow">Customers</div>
        <h2 class="section-title">Loved by teams who care about craft.</h2>
        <div class="quotes">
          ${quote('"Our marketing site, our app, and our internal dashboards finally feel like the same product. The token system is doing all the work."', 'Mira Okafor', 'Head of Design · Pioneer')}
          ${quote('"We swapped our entire design language in an afternoon. Nothing broke. That’s the line, and we crossed it."', 'Caleb Renner', 'Engineering Lead · Northwind')}
        </div>
      </div>
    </section>

    <section class="section" id="faq" style="padding-top: 24px;">
      <div class="container">
        <div class="section-eyebrow">FAQ</div>
        <h2 class="section-title">Questions, answered.</h2>
        <div class="faq">
          ${faq('Is this a Figma library, a code library, or both?', 'Both. Tokens flow from one source of truth into Figma styles and into the codegen pipeline at the same time.')}
          ${faq('Can we ship our own brand theme?', 'Yes — fork the token file, change the palette and type stack, and every component reskins automatically.')}
          ${faq('What about accessibility?', 'Color contrast meets WCAG AA on every surface. Components ship with focus rings, ARIA roles, and keyboard handling.')}
          ${faq('How do you handle dark mode?', 'Every token has a paired dark value. The system flips at the document level — no per-component overrides needed.')}
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="cta">
          <div>
            <h2>Ship a product that finally feels finished.</h2>
            <p>Drop the system into your app today. The first project is on us.</p>
          </div>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <a class="btn btn-primary" href="#">Start free trial</a>
            <a class="btn btn-secondary" href="#">Talk to sales</a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <div class="footer-row">
        <div class="footer-col">
          <div class="brand" style="margin-bottom: 12px;"><span class="brand-mark"></span>${escapeHtml(productName)}</div>
          <p style="margin: 0; max-width: 38ch;">${escapeHtml(tagline)}</p>
        </div>
        <div class="footer-col"><h6>Product</h6><a href="#">Features</a><a href="#">Pricing</a><a href="#">Changelog</a><a href="#">Roadmap</a></div>
        <div class="footer-col"><h6>Company</h6><a href="#">About</a><a href="#">Customers</a><a href="#">Careers</a><a href="#">Press</a></div>
        <div class="footer-col"><h6>Resources</h6><a href="#">Docs</a><a href="#">Status</a><a href="#">Brand</a><a href="#">Contact</a></div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${escapeHtml(productName)}. All rights reserved.</span>
        <span>Showcase rendered from <code style="font-family: var(--mono);">design-systems/${escapeHtml(id)}/DESIGN.md</code></span>
      </div>
    </div>
  </footer>
</body>
</html>`;
}

function featureCard(icon: string, title: string, body: string): string {
  return `<div class="feature">
    <div class="feature-icon">${escapeHtml(icon)}</div>
    <h3>${escapeHtml(title)}</h3>
    <p>${escapeHtml(body)}</p>
  </div>`;
}

function renderBananaLabShowcase(id: string, raw: string): string {
  const titleMatch = /^#\s+(.+?)\s*$/m.exec(raw);
  const productName = cleanTitle(titleMatch?.[1] ?? id);
  const subtitle = extractSubtitle(raw) || 'AI 图片生成平台。暗黑宇宙底色，金黄主交互，品牌光谱和 AI 能力彩色光斑。';
  const capabilityBadges = [
    ['4K', 'Monitor', 'linear-gradient(90deg,#fbbf24,#f97316)'],
    ['Nano Banana', 'CPU', 'linear-gradient(90deg,#fde047,#a3e635)'],
    ['Highly Detailed', 'Scan', 'linear-gradient(90deg,#38bdf8,#67e8f9)'],
    ['Anime', 'Sparkles', 'linear-gradient(90deg,#f472b6,#d946ef)'],
    ['UHD', 'Image', 'linear-gradient(90deg,#818cf8,#3b82f6)'],
    ['Lossless', 'Infinity', 'linear-gradient(90deg,#34d399,#14b8a6)'],
    ['Portrait', 'User', 'linear-gradient(90deg,#fb7185,#fb923c)'],
    ['Concept Art', 'Palette', 'linear-gradient(90deg,#e2e8f0,#38bdf8)'],
  ];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(productName)} — showcase</title>
  <style>
    :root {
      --bg: #020617;
      --fg: #f8f8f8;
      --muted: #9a9ea8;
      --border: rgba(255,255,255,.1);
      --card: #1a1b2e;
      --primary: #d4a017;
      --primary-fg: #3d2a08;
      --amber: #f59e0b;
      --cyan: #00bbd0;
      --pink: #fb64b6;
      --sans: Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      color: var(--fg);
      font-family: var(--sans);
      line-height: 1.55;
      background:
        radial-gradient(1200px 600px at 50% -200px, oklch(0.35 0.08 300 / 0.35), transparent 70%),
        radial-gradient(900px 500px at 50% 120%, oklch(0.62 0.16 40 / 0.16), transparent 70%),
        radial-gradient(700px 360px at 0% 10%, oklch(0.45 0.08 250 / 0.1), transparent 60%),
        linear-gradient(180deg, oklch(0.16 0.02 285), oklch(0.11 0.02 285));
      -webkit-font-smoothing: antialiased;
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      opacity: .34;
      background-image:
        radial-gradient(circle at 10% 20%, rgba(255,255,255,.8) 0 1px, transparent 1.4px),
        radial-gradient(circle at 75% 10%, rgba(255,255,255,.7) 0 1px, transparent 1.5px),
        radial-gradient(circle at 50% 55%, rgba(255,255,255,.45) 0 1px, transparent 1.4px),
        radial-gradient(circle at 30% 80%, rgba(255,255,255,.6) 0 1px, transparent 1.5px);
      background-size: 180px 180px, 260px 260px, 220px 220px, 300px 300px;
    }
    body::after {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background: radial-gradient(120% 120% at 50% 35%, transparent 55%, rgba(0,0,0,.22) 80%, rgba(0,0,0,.46) 100%);
    }
    a { color: inherit; text-decoration: none; }
    .shell { position: relative; z-index: 1; display: grid; grid-template-columns: 256px minmax(0, 1fr); min-height: 100vh; }
    @media (max-width: 880px) { .shell { grid-template-columns: 1fr; } .sidebar { display: none; } }
    .sidebar {
      position: sticky;
      top: 0;
      height: 100vh;
      border-right: 1px solid #1e2336;
      background: color-mix(in oklab, var(--bg) 75%, oklch(0.08 0 0) 25%);
      box-shadow: 0 26px 70px rgba(0,0,0,.85);
      backdrop-filter: blur(22px);
      padding: 22px 14px;
    }
    .compact-logo { display: flex; align-items: center; gap: 8px; justify-content: center; margin-bottom: 28px; }
    .logo-mark {
      width: 32px;
      height: 32px;
      border-radius: 9px;
      background:
        radial-gradient(circle at 65% 35%, #ffe27a 0 18%, transparent 19%),
        linear-gradient(135deg, #facc15, #f97316);
      box-shadow: 0 0 28px rgba(250,204,21,.24);
    }
    .compact-logo span { font-size: 24px; font-weight: 600; line-height: 1.1; }
    .lab-compact { color: var(--cyan); }
    .nana-compact { color: var(--pink); }
    .nav-group { display: flex; flex-direction: column; gap: 6px; }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      border-radius: 10px;
      padding: 10px 12px;
      color: #e5e7eb;
      font-size: 14px;
    }
    .nav-item.active { background: var(--primary); color: var(--primary-fg); font-weight: 650; }
    .sidebar-footer { position: absolute; left: 14px; right: 14px; bottom: 18px; display: flex; flex-direction: column; gap: 10px; }
    .subscribe {
      border: 1px solid rgba(245,158,11,.5);
      border-radius: 10px;
      background: rgba(245,158,11,.1);
      color: var(--amber);
      padding: 10px 12px;
      text-align: center;
      font-size: 13px;
      font-weight: 650;
    }
    .benefit {
      position: relative;
      overflow: hidden;
      border: 2px solid transparent;
      border-radius: 14px;
      background:
        linear-gradient(135deg,#0a0e1a,#0f1629,#0a0e1a) padding-box,
        linear-gradient(90deg,#00bbd0,#fb64b6,#00bbd0) border-box;
      padding: 12px;
      color: #fff;
      box-shadow: 0 0 28px rgba(0,187,208,.18), 0 0 34px rgba(251,100,182,.14);
    }
    .benefit strong {
      background: linear-gradient(90deg,#00bbd0,#fb64b6,#00bbd0);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .main { min-width: 0; }
    .topbar {
      display: none;
      position: sticky;
      top: 0;
      z-index: 10;
      border-bottom: 1px solid var(--border);
      background: rgba(2,6,23,.8);
      backdrop-filter: blur(14px);
      padding: 12px 18px;
    }
    @media (max-width: 880px) { .topbar { display: flex; justify-content: space-between; align-items: center; } }
    .content { max-width: 1400px; margin: 0 auto; padding: 46px 24px 82px; }
    .hero { max-width: 920px; margin: 0 auto 34px; text-align: center; }
    .hero h1 { margin: 0 0 14px; font-size: clamp(62px, 10vw, 104px); line-height: .96; letter-spacing: 0; font-weight: 800; }
    .lab {
      background: linear-gradient(90deg,#22d3ee,#60a5fa,#a78bfa);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .nana { color: #f472b6; }
    .powered {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      margin: 4px 0 24px;
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 999px;
      background: rgba(255,255,255,.05);
      padding: 8px 14px;
      color: var(--muted);
      font-size: 13px;
      backdrop-filter: blur(12px);
    }
    .lede { max-width: 70ch; margin: 0 auto 24px; color: #cbd5e1; font-size: 17px; }
    .badge-cloud { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
    .capability { position: relative; display: inline-flex; }
    .capability::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 999px;
      background: var(--glow);
      opacity: .55;
      filter: blur(12px);
      transition: opacity .25s ease;
    }
    .capability:hover::before { opacity: .82; }
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
      font-weight: 600;
      box-shadow: 0 12px 24px rgba(0,0,0,.26);
      backdrop-filter: blur(10px);
    }
    .capability i {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 999px;
      background: var(--glow);
      color: #020617;
      font-size: 9px;
      font-style: normal;
      font-weight: 800;
    }
    .generator {
      position: sticky;
      top: 18px;
      z-index: 5;
      max-width: 860px;
      margin: 34px auto 42px;
      overflow: hidden;
      border: 1px solid rgba(148,163,184,.38);
      border-radius: 24px;
      background: color-mix(in oklab, var(--card) 75%, oklch(0.08 0 0) 25%);
      box-shadow: 0 22px 60px rgba(0,0,0,.7);
      backdrop-filter: blur(16px);
      padding: 14px;
    }
    .generator::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(160% 200% at 50% 0, rgba(255,255,255,.16), transparent 55%),
        linear-gradient(135deg, rgba(251,113,133,.2), transparent 28%, transparent 72%, rgba(56,189,248,.18));
      mix-blend-mode: screen;
    }
    .generator > * { position: relative; }
    .prompt {
      min-height: 104px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 14px;
      background: rgba(2,6,23,.45);
      padding: 16px;
      color: #e5e7eb;
      text-align: left;
    }
    .toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 12px; }
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
      border: none;
      border-radius: 9px;
      background: var(--primary);
      color: var(--primary-fg);
      padding: 9px 14px;
      font-weight: 800;
      font-size: 13px;
      box-shadow: 0 10px 26px rgba(212,160,23,.2);
    }
    .gallery { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
    @media (max-width: 1080px) { .gallery { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 720px) { .gallery { grid-template-columns: repeat(2, 1fr); } }
    .image-card {
      min-height: 270px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(0,0,0,.7);
      position: relative;
    }
    .image-card::before {
      content: "";
      position: absolute;
      inset: 0;
      background: var(--art);
      opacity: .9;
    }
    .image-card::after {
      content: "";
      position: absolute;
      inset: auto 0 0;
      height: 44%;
      background: linear-gradient(to top, #000, rgba(0,0,0,.72), transparent);
    }
    .image-meta {
      position: absolute;
      z-index: 1;
      left: 12px;
      right: 12px;
      bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      color: #fff;
      font-size: 12px;
    }
    .avatar { width: 26px; height: 26px; border-radius: 999px; border: 1px solid rgba(255,255,255,.2); background: rgba(255,255,255,.18); }
    .favorite { color: #facc15; font-size: 16px; }
    .pricing { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 56px; }
    @media (max-width: 920px) { .pricing { grid-template-columns: 1fr; } }
    .plan {
      border: 1px solid #333;
      border-radius: 24px;
      background: transparent;
      padding: 24px;
    }
    .plan.standard { border-color: #747fae; background: linear-gradient(180deg,#111527,#333950); }
    .plan.pro { border-color: #c1a37a; background: linear-gradient(180deg,#241b0e,#45351e); }
    .popular {
      display: inline-flex;
      border-radius: 12px;
      background: #6f522a;
      color: #efb100;
      padding: 3px 10px;
      font-size: 12px;
      font-weight: 700;
    }
    .plan h3 { margin: 8px 0 14px; font-size: 22px; }
    .price { font-size: 38px; font-weight: 800; }
    .plan p, .plan li { color: #cbd5e1; font-size: 14px; }
    .plan ul { padding-left: 18px; }
    .plan .choose {
      display: block;
      margin-top: 18px;
      border-radius: 12px;
      background: #fff;
      color: #020617;
      padding: 12px;
      text-align: center;
      font-weight: 700;
    }
    .plan.pro .choose { background: var(--primary); color: var(--primary-fg); }
    .section-title { margin: 0 0 8px; font-size: 28px; }
    .section-lede { margin: 0; color: var(--muted); }
  </style>
</head>
<body>
  <div class="shell">
    <aside class="sidebar">
      <div class="compact-logo"><span class="logo-mark"></span><span><span class="lab-compact">Lab</span><span class="nana-compact">nana</span></span></div>
      <nav class="nav-group">
        <a class="nav-item active">⌂ Home</a>
        <a class="nav-item">▧ Library</a>
        <a class="nav-item">★ Favorites</a>
        <a class="nav-item">◉ Explore</a>
      </nav>
      <div class="sidebar-footer">
        <div class="benefit"><strong>Premium Benefit</strong><br /><span style="font-size:12px;color:#cbd5e1;">cyan/pink neon card</span></div>
        <a class="subscribe">⚡ Subscribe</a>
      </div>
    </aside>
    <main class="main">
      <header class="topbar">
        <div class="compact-logo" style="margin:0;"><span class="logo-mark"></span><span><span class="lab-compact">Lab</span><span class="nana-compact">nana</span></span></div>
        <a class="subscribe" style="padding:7px 10px;">Subscribe</a>
      </header>
      <div class="content">
        <section class="hero">
          <h1><span class="lab">Lab</span><span class="nana">nana</span></h1>
          <div class="powered">🍌 Powered by Google Nano Banana</div>
          <p class="lede">${escapeHtml(subtitle)}</p>
          <div class="badge-cloud">
            ${capabilityBadges.map(([label, icon, gradient]) => `<span class="capability" style="--glow:${gradient};"><span><i>${escapeHtml(icon.slice(0, 1))}</i>${escapeHtml(label)}</span></span>`).join('')}
          </div>
        </section>

        <section class="generator">
          <div class="prompt">A glassy AI image lab in deep space, golden generation controls, colorful model capability lights, premium neon accents.</div>
          <div class="toolbar">
            <span class="tool">✨ GPT-Image-2 <span style="color:#34d399;">Free</span></span>
            <span class="tool">🍌 Nano Banana</span>
            <span class="tool">4K <span style="color:#f59e0b;">VIP</span></span>
            <span class="tool">1:1</span>
            <button class="generate">✦ Generate</button>
          </div>
        </section>

        <section>
          <h2 class="section-title">Generated image gallery</h2>
          <p class="section-lede">Image cards stay quiet and black so the generated artwork becomes the color field.</p>
          <div class="gallery" style="margin-top:18px;">
            ${galleryCard('linear-gradient(135deg,#fbbf24,transparent 34%),linear-gradient(315deg,#60a5fa,transparent 36%),linear-gradient(180deg,#111827,#020617)')}
            ${galleryCard('radial-gradient(circle at 30% 18%,#f472b6,transparent 28%),linear-gradient(135deg,#0f172a,#020617)')}
            ${galleryCard('linear-gradient(135deg,#34d399,transparent 30%),linear-gradient(315deg,#a78bfa,transparent 34%),#020617')}
            ${galleryCard('radial-gradient(circle at 70% 24%,#facc15,transparent 24%),linear-gradient(145deg,#1f2937,#020617)')}
          </div>
        </section>

        <section class="pricing">
          ${bananaPlan('Free', '$0', 'Transparent base card', ['Basic generation', 'Community gallery', 'Limited credits'], '')}
          ${bananaPlan('Standard', '$12', 'Blue-gray deep card', ['More credits', 'Private images', '2K options'], 'standard')}
          ${bananaPlan('Pro', '$29', 'Gold recommended card', ['4K generation', 'Batch images', 'Priority models'], 'pro')}
        </section>
      </div>
    </main>
  </div>
</body>
</html>`;
}

function renderListenHubShowcase(id: string, raw: string): string {
  const titleMatch = /^#\s+(.+?)\s*$/m.exec(raw);
  const productName = cleanTitle(titleMatch?.[1] ?? id);
  const subtitle = extractSubtitle(raw) || 'AI audio and content creation platform. Light Mars workspace, black primary controls, tri-color brand gradients, and content-first audio surfaces.';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(productName)} — showcase</title>
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
      --blue: #3574e3;
      --pink-100: #ffd3e8;
      --pink-900: #ea378c;
      --purple-100: #e2ddff;
      --purple-900: #6f61c3;
      --green-100: #92e5ba;
      --green-900: #38BC78;
      --blue-100: #b8d2ff;
      --radio-red: #c91133;
      --radio-gold: #e2a76f;
      --sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      --ddin: D-DIN-Bold, "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif;
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--fg); font-family: var(--sans); line-height: 1.5; -webkit-font-smoothing: antialiased; }
    a { color: inherit; text-decoration: none; }
    .shell { display: grid; grid-template-columns: 240px minmax(0, 1fr); min-height: 100vh; background: #fff; }
    @media (max-width: 900px) { .shell { grid-template-columns: 1fr; } .sidebar { display: none; } }
    .sidebar {
      position: sticky;
      top: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--border);
      background: var(--surface);
    }
    .side-head { height: 48px; display: flex; align-items: center; padding: 0 12px; border-bottom: 1px solid var(--border); }
    .logo { display: flex; align-items: center; gap: 8px; font-weight: 800; letter-spacing: 0; }
    .logo-mark { width: 22px; height: 22px; border-radius: 7px; background: #000; position: relative; }
    .logo-mark::after { content: ""; position: absolute; inset: 5px 4px; border-radius: 999px; background: linear-gradient(90deg,#fca76f,#ed8fe5,#7ebdea); }
    .nav { padding: 16px; display: flex; flex-direction: column; gap: 2px; }
    .nav-item { height: 40px; display: flex; align-items: center; gap: 9px; border-radius: 8px; padding: 0 12px; color: var(--muted); font-size: 15px; }
    .nav-item.active { background: #fff; color: #000; font-weight: 600; }
    .nav-dot { width: 18px; height: 18px; border-radius: 6px; background: currentColor; opacity: .58; }
    .side-footer { margin-top: auto; border-top: 1px solid var(--border); padding: 12px; display: flex; flex-direction: column; gap: 10px; }
    .refer { border: 1px solid var(--border); border-radius: 12px; background: #fff; padding: 12px; color: var(--muted); font-size: 13px; }
    .refer strong { display: block; color: #000; font-size: 14px; margin-bottom: 2px; }
    .main { min-width: 0; padding-bottom: 88px; }
    .mobile-bar { display: none; height: 52px; align-items: center; justify-content: space-between; padding: 0 16px; border-bottom: 1px solid var(--border); background: #fff; position: sticky; top: 0; z-index: 20; }
    @media (max-width: 900px) { .mobile-bar { display: flex; } }
    .container { max-width: 1180px; margin: 0 auto; padding: 42px 24px 90px; }
    .hero { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 24px 0 48px; text-align: center; }
    .welcome { display: inline-flex; gap: 8px; align-items: center; color: var(--muted); font-size: 13px; border: 1px solid var(--border); border-radius: 999px; padding: 6px 12px; background: #fff; box-shadow: 0 4px 16px rgba(0,0,0,.04); }
    h1 { margin: 0; max-width: 760px; font-size: clamp(34px, 6vw, 72px); line-height: 1.08; font-weight: 800; letter-spacing: 0; }
    .hero-welcome { font-size: 24px; line-height: 28px; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
    .hero-create { font-size: 30px; line-height: 36px; font-weight: 600; margin-bottom: 24px; }
    .subtitle { margin: 0; max-width: 620px; color: var(--muted); font-size: 17px; }
    .creator { width: min(720px, 100%); border: 1px solid var(--border); border-radius: 20px; background: #fff; padding: 16px; box-shadow: 0 4px 30px rgba(0,0,0,.08); text-align: left; }
    .creator-text { height: 72px; color: #808080; font-size: 15px; line-height: 22px; }
    .creator-actions { display: flex; justify-content: flex-end; align-items: center; gap: 8px; }
    .submit { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 8px; background: #000; color: #fff; font-weight: 800; }
    .product-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 16px; width: min(720px, 100%); }
    @media (max-width: 600px) { .product-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; } }
    .product-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      border: 1px solid var(--border);
      border-radius: 16px;
      background: #fff;
      padding: 14px;
      transition: background .15s ease;
    }
    .product-btn:hover { background: var(--surface); }
    .product-icon { width: 48px; height: 48px; border-radius: 6px; display: grid; place-items: center; font-weight: 800; font-size: 16px; flex-shrink: 0; }
    .product-title { font-size: 15px; font-weight: 600; }
    .product-desc { color: var(--muted); font-size: 13px; }
    .section-head { display: flex; justify-content: space-between; gap: 20px; align-items: end; margin-bottom: 18px; }
    .section-head h2 { margin: 0; font-size: 22px; line-height: 30px; font-weight: 650; }
    .section-head p { margin: 8px 0 0; color: var(--muted); max-width: 560px; font-size: 15px; }
    .try { display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; background: #000; color: #fff; padding: 11px 28px; font-size: 14px; font-weight: 650; white-space: nowrap; }
    .grid-podcast { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
    @media (max-width: 1020px) { .grid-podcast { grid-template-columns: repeat(2,1fr); } }
    @media (max-width: 560px) { .grid-podcast { grid-template-columns: 1fr; } }
    .podcast {
      position: relative;
      min-height: 260px;
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: 16px;
      background: var(--art);
      box-shadow: 0 0 16px rgba(0,0,0,.04);
      transition: transform .2s ease, box-shadow .2s ease;
    }
    .podcast:hover { transform: scale(1.05); box-shadow: 0 14px 30px rgba(0,0,0,.12); }
    .podcast::after { content: ""; position: absolute; inset: auto 0 0; height: 46%; background: linear-gradient(to top, rgba(0,0,0,.9), rgba(0,0,0,.36), transparent); backdrop-filter: blur(8px); }
    .podcast-meta { position: absolute; z-index: 1; left: 12px; right: 12px; bottom: 12px; color: #fff; }
    .podcast-title { display: flex; align-items: center; gap: 8px; font-size: 15px; line-height: 20px; font-weight: 650; }
    .play-mini { margin-left: auto; width: 28px; height: 28px; border-radius: 999px; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.5); }
    .podcast-sub { display: flex; gap: 7px; color: rgba(255,255,255,.8); font-size: 12px; margin-top: 10px; }
    .slides-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    @media (max-width: 760px) { .slides-grid { grid-template-columns: 1fr; } }
    .slide-card { position: relative; min-height: 250px; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: var(--art); transition: transform .2s ease, box-shadow .2s ease; }
    .slide-card:hover { transform: scale(1.03); box-shadow: 0 14px 30px rgba(0,0,0,.12); }
    .slide-play { position: absolute; right: 16px; bottom: 16px; width: 38px; height: 38px; border-radius: 999px; background: rgba(0,0,0,.3); color: #fff; display: grid; place-items: center; backdrop-filter: blur(10px); }
    .experience { margin-top: 64px; border: 1px solid #fff; border-radius: 16px; background: rgba(255,255,255,.4); padding: 24px; backdrop-filter: blur(4px); }
    .tabs { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; margin-bottom: 16px; }
    @media (max-width: 700px) { .tabs { grid-template-columns: repeat(2,1fr); } }
    .tab { height: 44px; border: 1px solid rgba(0,0,0,.1); border-radius: 8px; display:flex; align-items:center; justify-content:center; gap:8px; color:var(--muted); font-size:14px; }
    .tab.active { color:#000; background:#fff; }
    .demo-panel { border-radius: 12px; background: #fff; min-height: 250px; display:grid; place-items:center; padding:24px; }
    .wave { width: min(420px,100%); height: 64px; display:flex; gap:5px; align-items:center; justify-content:center; }
    .wave span { width: 6px; border-radius:999px; background: linear-gradient(180deg,#fca76f,#ed8fe5,#7ebdea); }
    .pricing { margin-top: 64px; }
    .pricing-header { text-align:center; margin-bottom:24px; }
    .pricing-header h2 { margin:0; font-size:28px; font-weight:700; }
    .pricing-header .gradient-title { font-size:34px; font-weight:700; background:linear-gradient(90deg,#ff8e43,#ff58b4,#3aadff); -webkit-background-clip:text; background-clip:text; color:transparent; }
    .pricing-header .powered { margin-top:8px; color:var(--muted); font-size:14px; }
    .pricing-header .powered strong { color:#000; font-weight:500; }
    .duration-tabs { display:flex; justify-content:center; gap:4px; margin:16px auto 24px; background:var(--surface); border-radius:999px; padding:4px; width:fit-content; }
    .duration-tab { padding:8px 20px; border-radius:999px; font-size:14px; font-weight:500; color:var(--muted); }
    .duration-tab.active { background:#fff; color:#000; outline:1px solid var(--border); box-shadow:0 4px 30px rgba(0,0,0,.08); }
    .duration-badge { display:inline-flex; margin-left:6px; border-radius:999px; background:#000; color:#fff; padding:2px 8px; font-size:12px; font-weight:500; }
    .plan-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
    @media (max-width: 900px) { .plan-grid { grid-template-columns: 1fr; } }
    .plan { border:1px solid rgba(153,153,153,.2); border-radius:26px; background:#fff; padding:24px; display:flex; flex-direction:column; }
    .plan-featured-wrap { border-radius:26px; padding:2px; background:linear-gradient(151.66deg,#fca76f 1.24%,#ed8fe5 48.81%,#7ebdea 96.1%); }
    .plan-featured-wrap .plan { border:none; background:linear-gradient(154.3deg,#fffaf6 2.06%,#fff5fe 50.52%,#f5fbff 98.18%); }
    .plan-head { display:flex; align-items:center; justify-content:space-between; }
    .plan h3 { margin:0; font-size:22px; line-height:30px; font-weight:500; }
    .plan-badge { display:inline-flex; align-items:center; height:24px; border-radius:999px; background:#000; color:#fff; padding:0 10px; font-size:12px; font-weight:500; }
    .plan-price { margin-top:16px; display:flex; align-items:baseline; gap:4px; }
    .plan-price .strikethrough { font-family:var(--ddin); font-size:17px; color:var(--subtle); text-decoration:line-through; opacity:.5; }
    .plan-price .amount { font-family:var(--ddin); font-size:38px; line-height:1; }
    .plan-price .dollar { font-size:17px; }
    .plan-price .period { color:var(--subtle); font-size:14px; margin-left:2px; }
    .plan-yearly { color:var(--subtle); font-size:13px; margin-top:4px; }
    .credits-box { margin-top:16px; height:58px; border:1px solid var(--border); border-radius:12px; padding:0 12px; display:flex; align-items:center; gap:8px; }
    .credits-box .credits-num { font-family:var(--ddin); font-size:16px; }
    .credits-box .credits-label { font-size:14px; }
    .credits-box .credits-detail { color:var(--subtle); font-size:12px; margin-left:auto; }
    .plan-cta { display:block; margin-top:16px; height:48px; border-radius:12px; background:#000; color:#fff; text-align:center; line-height:48px; font-size:15px; font-weight:500; }
    .plan-cta.outline { background:transparent; border:1px solid var(--border); color:#000; }
    .plan-rights-intro { margin-top:16px; color:var(--muted); font-size:14px; }
    .plan-rights { margin-top:10px; display:flex; flex-direction:column; gap:10px; list-style:none; padding:0; }
    .plan-rights li { display:flex; align-items:flex-start; gap:6px; font-size:14px; line-height:20px; }
    .plan-rights li::before { content:"✓"; flex-shrink:0; font-size:14px; color:#333; }
    .promise-badges { display:flex; justify-content:center; gap:16px; margin-top:20px; color:var(--subtle); font-size:14px; }
    .promise-badges span { display:flex; align-items:center; gap:4px; }
    .enterprise-bar { margin-top:16px; display:flex; align-items:center; gap:12px; border:1px solid var(--border); border-radius:12px; padding:0 16px; height:60px; }
    .enterprise-bar .ent-icon { width:26px; height:26px; border-radius:6px; background:var(--surface); display:grid; place-items:center; font-size:14px; }
    .enterprise-bar .ent-info { flex:1; }
    .enterprise-bar .ent-title { font-size:15px; font-weight:600; }
    .enterprise-bar .ent-desc { color:var(--muted); font-size:13px; }
    .enterprise-bar .ent-btn { border:1px solid var(--border); border-radius:8px; padding:8px 16px; font-size:14px; font-weight:600; }
    .faq { margin-top:48px; max-width:800px; margin-left:auto; margin-right:auto; }
    .faq h2 { text-align:center; font-size:22px; font-weight:700; margin-bottom:16px; }
    .faq-item { border-bottom:1px solid var(--border); padding:16px 0; display:flex; justify-content:space-between; align-items:center; font-size:17px; font-weight:500; }
    .faq-item .chevron { color:var(--subtle); font-size:14px; }
    .radio-fragment { margin-top:64px; border-radius:24px; background: linear-gradient(180deg,#fff9ef,#feedd3); padding:28px; }
    .radio-card { max-width:760px; margin:0 auto; border:3px solid var(--radio-red); border-radius:16px; background:linear-gradient(180deg,#fff,#f5f5f5); padding:24px; box-shadow:0 10px 22px rgba(0,0,0,.1), inset 0 -5px 7px #fff, inset 0 5px 0 rgba(255,255,255,.99); }
    .radio-head { display:flex; justify-content:space-between; align-items:center; gap:14px; }
    .onair { display:inline-flex; border:2px solid #000; border-radius:33px; background:#ffecd2; color:#f63155; padding:6px 16px; font-weight:800; box-shadow: inset 0 3px 5.3px #fff6ef, inset 0 0 16px rgba(255,98,0,.3); }
    .radio-title { color:var(--radio-red); font-size:34px; font-weight:800; }
    .radio-list { margin-top:18px; border:1px solid rgba(245,160,80,.3); border-radius:8px; background:linear-gradient(180deg,#fff8ee,#fffdfa); overflow:hidden; }
    .radio-row { height:40px; display:flex; align-items:center; justify-content:space-between; padding:0 12px; color:#555; border-bottom:1px solid rgba(201,17,51,.18); }
    .radio-row.active { background:#fff4e3; color:#000; font-weight:650; border-bottom-color:var(--radio-red); }
    .radio-controls { display:flex; justify-content:center; align-items:center; gap:14px; margin-top:18px; }
    .radio-control { width:38px; height:38px; border-radius:999px; border:1px solid var(--radio-gold); color:var(--radio-gold); display:grid; place-items:center; }
    .radio-play { width:100px; height:38px; border-radius:24px; border:1px solid var(--radio-gold); background:var(--radio-red); color:#fff; display:grid; place-items:center; }
    .player {
      position: fixed;
      left: 240px;
      right: 0;
      bottom: 0;
      z-index: 30;
      height: 96px;
      border-top: 1px solid var(--border);
      background: #fff;
      display:flex;
      align-items:center;
      justify-content:center;
      gap:24px;
      box-shadow: 0 -4px 16px rgba(0,0,0,.04);
    }
    @media (max-width: 900px) { .player { left:0; height:56px; padding:0 12px; } .player .time { display:none; } }
    .player-cover { width:40px; height:40px; border-radius:8px; background:linear-gradient(135deg,#333,#999); }
    .player-meta { width:min(400px,40vw); }
    .player-title { font-size:12px; font-weight:650; text-align:center; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
    .seek { display:flex; align-items:center; gap:8px; margin-top:7px; }
    .time { width:32px; text-align:center; color:var(--subtle); font-size:12px; }
    .seekbar { flex:1; height:4px; border-radius:999px; background:#eaeaea; overflow:hidden; }
    .seekbar span { display:block; width:62%; height:100%; background:#000; }
    .player-button { width:36px; height:36px; border-radius:999px; background:#000; color:#fff; display:grid; place-items:center; }
  </style>
</head>
<body>
  <div class="shell">
    <aside class="sidebar">
      <div class="side-head"><div class="logo"><span class="logo-mark"></span>${escapeHtml(productName)}</div></div>
      <nav class="nav">
        <a class="nav-item active"><span class="nav-dot"></span>Home</a>
        <a class="nav-item"><span class="nav-dot"></span>Library</a>
        <a class="nav-item"><span class="nav-dot"></span>Explore</a>
        <a class="nav-item"><span class="nav-dot"></span>Voice Cloning</a>
        <a class="nav-item"><span class="nav-dot"></span>AI Image</a>
      </nav>
      <div class="side-footer">
        <div class="refer"><strong>Refer a friend</strong>Share credits for the next podcast episode.</div>
        <a class="nav-item" style="color:#6f61c3;font-size:13px;font-weight:600;height:36px;"><span class="nav-dot" style="background:#6f61c3;"></span>Upgrade to Pro</a>
      </div>
    </aside>
    <main class="main">
      <header class="mobile-bar"><div class="logo"><span class="logo-mark"></span>${escapeHtml(productName)}</div><span style="font-weight:800;">☰</span></header>
      <div class="container">
        <section class="hero">
          <div class="hero-welcome">Hi 👋</div>
          <div class="hero-create">Create anything with AI production tools</div>
          <div class="product-grid">
            <a class="product-btn"><span class="product-icon" style="background:rgba(255,211,232,.8);color:#ea378c;">▶</span><div><div class="product-title">Explainer Video</div><div class="product-desc">Video from text</div></div></a>
            <a class="product-btn"><span class="product-icon" style="background:rgba(255,211,232,.8);color:#ea378c;">▤</span><div><div class="product-title">Slides</div><div class="product-desc">AI presentation</div></div></a>
            <a class="product-btn"><span class="product-icon" style="background:rgba(226,221,255,.8);color:#6f61c3;">◉</span><div><div class="product-title">AI Podcast</div><div class="product-desc">Multi-speaker audio</div></div></a>
            <a class="product-btn"><span class="product-icon" style="background:rgba(226,221,255,.8);color:#6f61c3;">♪</span><div><div class="product-title">Text To Speech</div><div class="product-desc">Narration</div></div></a>
            <a class="product-btn"><span class="product-icon" style="background:rgba(146,229,186,.8);color:#38BC78;">◻</span><div><div class="product-title">AI Image</div><div class="product-desc">Generate images</div></div></a>
            <a class="product-btn"><span class="product-icon" style="background:rgba(146,229,186,.8);color:#38BC78;">⎗</span><div><div class="product-title">Voice Cloning</div><div class="product-desc">Clone voice</div></div></a>
          </div>
        </section>

        <section style="margin-top:32px;">
          <div class="section-head">
            <div><h2>Gallery</h2></div>
          </div>
          <div class="tabs" style="max-width:480px;">
            <div class="tab active">Explainer Video</div>
            <div class="tab">Slides</div>
            <div class="tab">Podcast</div>
            <div class="tab">AI Image</div>
          </div>

        <section>
          <div class="section-head">
            <div><h2>AI Podcast</h2><p>Content cards stay visual-first: full-bleed covers, progressive blur, and compact playback metadata.</p></div>
            <a class="try">Try it out</a>
          </div>
          <div class="grid-podcast">
            ${listenPodcastCard('linear-gradient(135deg,#101010,#666),radial-gradient(circle at 70% 20%,#fca76f,transparent 28%)', 'Morning product briefing')}
            ${listenPodcastCard('linear-gradient(135deg,#20304a,#0f172a),radial-gradient(circle at 30% 24%,#7ebdea,transparent 32%)', 'Research voices')}
            ${listenPodcastCard('linear-gradient(135deg,#3b1838,#111),radial-gradient(circle at 60% 26%,#ed8fe5,transparent 30%)', 'Founder interview')}
            ${listenPodcastCard('linear-gradient(135deg,#1f2937,#000),radial-gradient(circle at 24% 22%,#38bc78,transparent 28%)', 'Learning queue')}
          </div>
        </section>

        <section style="margin-top:64px;">
          <div class="section-head">
            <div><h2>Storybook and Slides</h2><p>Wide cards use quiet borders and translucent play controls so generated visuals carry the section.</p></div>
            <a class="try">Try it out</a>
          </div>
          <div class="slides-grid">
            ${listenSlideCard('linear-gradient(135deg,#f5fbff,#fff5fe),radial-gradient(circle at 18% 20%,#7ebdea,transparent 34%),radial-gradient(circle at 82% 70%,#ed8fe5,transparent 30%)')}
            ${listenSlideCard('linear-gradient(135deg,#fffaf6,#f5fbff),radial-gradient(circle at 28% 30%,#fca76f,transparent 34%),radial-gradient(circle at 82% 68%,#3aadff,transparent 30%)')}
          </div>
        </section>

        <section class="experience">
          <div class="tabs">
            <div class="tab active">AI Podcast</div>
            <div class="tab">FlowSpeech</div>
            <div class="tab">Storybook</div>
            <div class="tab">Voice Cloning</div>
          </div>
          <div class="demo-panel">
            <div>
              <h2 style="margin:0 0 14px;text-align:center;">FlowSpeech conversation demo</h2>
              <div class="wave">${[24,42,30,56,36,62,28,48,34,58,26,44,30,52,38,60].map((h) => `<span style="height:${h}px"></span>`).join('')}</div>
            </div>
          </div>
        </section>

        <section class="pricing">
          <div class="pricing-header">
            <h2>升级订阅方案</h2>
            <div class="gradient-title">创作效率提升 120 倍</div>
            <div class="powered">由业界顶尖模型驱动 &nbsp; <strong>Gemini 3.1</strong> &nbsp; <strong>Nano Banana 2</strong> &nbsp; <strong>ElevenLabs</strong></div>
          </div>
          <div class="duration-tabs">
            <span class="duration-tab">连续包月</span>
            <span class="duration-tab active">连续包年 <span class="duration-badge">立减 20%</span></span>
          </div>
          <div class="plan-grid">
            ${listenPlan('Free', null, '$0', null, '10', '2 分钟 · 0 个 · 0 张', ['每日签到：1 次专属模型免费生成', '部分功能可用', 'API & Agent Skills 使用权限'], false, true)}
            ${listenPlan('Basic', '$12', '$9', '$108/年', '1300', '5 小时 · 9 个 · 87 张', ['每日签到：15 通用积分 + 1 次专属模型免费生成', '支持 1 个音色克隆', '解锁 2K 高清生图', '脚本编辑', '导出音频、视频、PPT 等格式', '移除 ListenHub 品牌元素'], false, false)}
            ${listenPlan('Pro', '$24', '$19', '$228/年', '2700', '10 小时 · 18 个 · 180 张', ['每日签到：15 通用积分 + 1 次专属模型免费生成', '支持 4 个音色克隆', '解锁 4K 高清生图'], true, false)}
            ${listenPlan('Max', '$240', '$200', '$2400/年', '30000', '111 小时 · 200 个 · 2000 张', ['每日签到：15 通用积分 + 1 次专属模型免费生成', '支持 20 个音色克隆', '最大上传达 30MB', '专属优先生图通道，极速生成', '抢先体验新功能'], false, false)}
          </div>
          <div class="promise-badges"><span>⊛ 支付宝快捷支付</span><span>⊗ 随时取消</span></div>
          <div class="enterprise-bar">
            <span class="ent-icon">⊞</span>
            <div class="ent-info"><div class="ent-title">企业版</div><div class="ent-desc">为团队量身定制</div></div>
            <span class="ent-btn">了解更多</span>
          </div>
          <div class="faq">
            <h2>常见问题</h2>
            <div class="faq-item"><span>你们支持哪些支付方式？</span><span class="chevron">›</span></div>
            <div class="faq-item"><span>我可以克隆自己的声音吗？</span><span class="chevron">›</span></div>
            <div class="faq-item"><span>我可以取消订阅吗？</span><span class="chevron">›</span></div>
            <div class="faq-item"><span>ListenHub 支持哪些语言？</span><span class="chevron">›</span></div>
          </div>
        </section>

        <section class="radio-fragment">
          <div class="radio-card">
            <div class="radio-head"><span class="onair">ON AIR</span><span class="radio-title">24H Radio</span></div>
            <div class="radio-list">
              <div class="radio-row active"><span>01 · ListenHub × Zhihu opening track</span><span style="color:var(--radio-gold);">Link</span></div>
              <div class="radio-row"><span>02 · Creator story queue</span><span style="color:var(--radio-gold);">Link</span></div>
              <div class="radio-row"><span>03 · New year audio postcard</span><span style="color:var(--radio-gold);">Link</span></div>
            </div>
            <div class="radio-controls"><span class="radio-control">‹</span><span class="radio-play">▶</span><span class="radio-control">›</span></div>
          </div>
        </section>
      </div>
    </main>
  </div>
  <div class="player">
    <div class="player-cover"></div>
    <div class="player-meta">
      <div class="player-title">Morning product briefing</div>
      <div class="seek"><span class="time">02:14</span><span class="seekbar"><span></span></span><span class="time">08:32</span></div>
    </div>
    <div class="player-button">▶</div>
  </div>
</body>
</html>`;
}

function listenPodcastCard(art, title) {
  return `<div class="podcast" style="--art:${art};">
    <div class="podcast-meta">
      <div class="podcast-title"><span>${escapeHtml(title)}</span><span class="play-mini">▶</span></div>
      <div class="podcast-sub"><span>Podcast</span><span>·</span><span>2 speakers</span><span>·</span><span>12 mins</span></div>
    </div>
  </div>`;
}

function listenSlideCard(art) {
  return `<div class="slide-card" style="--art:${art};"><span class="slide-play">▶</span></div>`;
}

function listenPlan(name, originalPrice, price, yearlyTip, credits, creditsDetail, features, featured, isFree) {
  const rightsIntro = isFree ? '' : featured ? 'Basic 的所有权益，加上' : name === 'Max' ? 'Pro 的所有权益，加上' : name === 'Basic' ? 'Free 的所有权益，加上' : '';
  const inner = `<div class="plan">
    <div class="plan-head">
      <h3>${escapeHtml(name)}</h3>
      ${featured ? '<span class="plan-badge">最受欢迎</span>' : ''}
    </div>
    <div class="plan-price">
      ${originalPrice ? `<span class="strikethrough"><span class="dollar">$</span>${escapeHtml(originalPrice.replace('$', ''))}</span>` : ''}
      <span class="dollar">$</span><span class="amount">${escapeHtml(price.replace('$', ''))}</span><span class="period">/月</span>
    </div>
    ${yearlyTip ? `<div class="plan-yearly">按年付费，$${escapeHtml(yearlyTip.replace(/.*\$/, ''))}</div>` : '<div class="plan-yearly" style="opacity:0">—</div>'}
    <div class="credits-box">
      <span class="credits-num">${escapeHtml(credits)}</span>
      <span class="credits-label">积分 / 月</span>
      <span class="credits-detail">${escapeHtml(creditsDetail)}</span>
    </div>
    <a class="plan-cta${isFree ? ' outline' : ''}">${isFree ? '免费版' : `订阅 ${escapeHtml(name)}`}</a>
    ${rightsIntro ? `<div class="plan-rights-intro">${escapeHtml(rightsIntro)}</div>` : ''}
    <ul class="plan-rights">${features.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}</ul>
  </div>`;
  return featured ? `<div class="plan-featured-wrap">${inner}</div>` : inner;
}

function galleryCard(art) {
  return `<div class="image-card" style="--art:${art};">
    <div class="image-meta"><span style="display:flex;align-items:center;gap:8px;"><span class="avatar"></span>creator · 2m</span><span class="favorite">★</span></div>
  </div>`;
}

function bananaPlan(name, price, sub, features, variant) {
  return `<div class="plan ${escapeHtml(variant)}">
    ${variant === 'pro' ? '<span class="popular">Popular</span>' : ''}
    <h3>${escapeHtml(name)}</h3>
    <div class="price">${escapeHtml(price)} <span style="font-size:14px;color:#9a9ea8;">/mo</span></div>
    <p>${escapeHtml(sub)}</p>
    <ul>${features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}</ul>
    <a class="choose">Choose ${escapeHtml(name)}</a>
  </div>`;
}

function kpi(label: string, value: string, delta: string): string {
  return `<div class="kpi">
    <div class="label">${escapeHtml(label)}</div>
    <div class="value">${escapeHtml(value)}</div>
    <div class="delta">${escapeHtml(delta)}</div>
  </div>`;
}

function listRow(name: string, meta: string, value: string, status: RowStatus): string {
  const badge = status === 'up' ? '<span class="badge up">↑</span>' : '<span class="badge">·</span>';
  return `<div class="list-row">
    <div>
      <div class="name">${escapeHtml(name)}</div>
      <div class="meta">${escapeHtml(meta)}</div>
    </div>
    <div class="meta">${escapeHtml(value)}</div>
    ${badge}
  </div>`;
}

function activityRow(name: string, meta: string): string {
  return `<div class="list-row">
    <div>
      <div class="name">${escapeHtml(name)}</div>
      <div class="meta">${escapeHtml(meta)}</div>
    </div>
    <div></div>
    <span class="badge">●</span>
  </div>`;
}

function priceCard(name: string, price: string, sub: string, features: string[], featured = false): string {
  return `<div class="price-card${featured ? ' featured' : ''}">
    <div class="tier-name">${escapeHtml(name)}</div>
    <div class="price">${escapeHtml(price)} <small>${escapeHtml(sub)}</small></div>
    <ul>${features.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}</ul>
    <a class="btn ${featured ? 'btn-primary' : 'btn-ghost'}" href="#" style="${featured ? 'background: var(--accent); color: var(--accent-fg); border-color: var(--accent);' : ''}">Choose ${escapeHtml(name)}</a>
  </div>`;
}

function quote(text: string, name: string, role: string): string {
  return `<div class="quote">
    <p>${escapeHtml(text)}</p>
    <div class="quote-author">
      <div class="avatar"></div>
      <div>
        <div class="name">${escapeHtml(name)}</div>
        <div class="role">${escapeHtml(role)}</div>
      </div>
    </div>
  </div>`;
}

function faq(q: string, a: string): string {
  return `<div class="faq-item">
    <h4>${escapeHtml(q)}</h4>
    <p>${escapeHtml(a)}</p>
  </div>`;
}

function inlineLineChart(): string {
  // Deterministic numbers so the chart looks specific (12 weekly data points).
  const data = [38, 44, 41, 52, 49, 61, 58, 67, 71, 76, 82, 88];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 720;
  const h = 160;
  const padX = 8;
  const padY = 14;
  const stepX = (w - padX * 2) / (data.length - 1);
  const norm = (v: number) => padY + (h - padY * 2) * (1 - (v - min) / (max - min));
  const points = data.map((v, i) => `${padX + i * stepX},${norm(v).toFixed(1)}`).join(' ');
  const area = `${padX},${h} ${points} ${w - padX},${h}`;
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <defs>
      <linearGradient id="lg" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.32"/>
        <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <polygon points="${area}" fill="url(#lg)"/>
    <polyline points="${points}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${data.map((v, i) => `<circle cx="${padX + i * stepX}" cy="${norm(v).toFixed(1)}" r="${i === data.length - 1 ? 4 : 0}" fill="var(--accent)"/>`).join('')}
  </svg>`;
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

export function extractColors(raw: string): ColorToken[] {
  const colors: ColorToken[] = [];
  const seen = new Set<string>();
  function push(name: string, value: string, role: string): void {
    const cleanName = String(name).replace(/[*_`]+/g, '').replace(/\s+/g, ' ').trim();
    if (!cleanName || cleanName.length > 60) return;
    const v = normalizeHex(value);
    const key = `${cleanName.toLowerCase()}|${v}`;
    const cleanRole = String(role || '')
      .replace(/[`*_]+/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/[.;]+$/, '');
    if (seen.has(key)) {
      // Already recorded — but if this occurrence carries a richer role
      // description, upgrade the stored entry so role-based lookups don't
      // fall back to the bare name.
      if (cleanRole) {
        const existing = colors.find(
          (c) => c.name.toLowerCase() === cleanName.toLowerCase() && c.value === v,
        );
        if (existing && (!existing.role || cleanRole.length > existing.role.length)) {
          existing.role = cleanRole;
        }
      }
      return;
    }
    seen.add(key);
    colors.push({ name: cleanName, value: v, role: cleanRole });
  }

  // Process the file line-by-line so multi-hex entries like Linear's
  // `**Marketing Black** (\`#010102\` / \`#08090a\`): role` don't confuse a
  // single global regex. We extract three pieces from each candidate line:
  //   - the bold (or list-prefixed) name
  //   - the FIRST hex on the line
  //   - everything after the first `:` that follows the hex (the role)
  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    // Pattern A: **Name** … #hex … : role description
    const bold = /\*\*([A-Za-z][A-Za-z0-9 /&()+_'’-]{1,40}?)\*\*([^\n]+)/.exec(line);
    if (bold) {
      const rest = bold[2] ?? '';
      const hex = /#[0-9a-fA-F]{3,8}\b/.exec(rest);
      if (hex) {
        const after = rest.slice((hex.index ?? 0) + hex[0].length);
        const colonIdx = after.search(/[:：]/);
        const role = colonIdx >= 0 ? after.slice(colonIdx + 1).trim() : '';
        push(bold[1] ?? '', hex[0], role);
        continue;
      }
    }

    // Pattern B: list-prefixed spec lines like
    //   "- Background: `#7d2ae8`" inside a ### Buttons block.
    // Also handles the `- **Name:** \`#hex\`` shape (colon inside the bold
    // wrapper) used by agentic/warm-editorial: the optional `\*{0,2}` slots
    // before the name and after the colon let us absorb the surrounding
    // `**` markers without needing a third pattern.
    // Use the name itself as the role so lookups can still see "Background"
    // and "Text" labels.
    const spec = /^[\s>*-]*\*{0,2}([A-Za-z][^:*\n]{1,40}?)\*{0,2}\s*[:：]\s*\*{0,2}\s*`?(#[0-9a-fA-F]{3,8})/.exec(line);
    if (spec) {
      push(spec[1] ?? '', spec[2] ?? '', spec[1] ?? '');
    }
  }

  return colors;
}

function extractFonts(raw: string): FontHints {
  const out: FontHints = {};
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

function escapeRegex(s: string): string {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Match a hint as a whole word inside `text` (case-insensitive). We use word
// boundaries so descriptive color names like "Cardinal Red" don't satisfy a
// "card" hint, and "Gem Pink" doesn't satisfy "ink" — both real bugs the
// substring-based version produced for the Duolingo and Canva showcases.
function matchesHint(text: string, hint: string): boolean {
  if (!text) return false;
  const needle = hint.toLowerCase().trim();
  if (!needle) return false;
  const re = new RegExp(`\\b${escapeRegex(needle)}\\b`, 'i');
  return re.test(text);
}

function pickColor(colors: ColorToken[], hints: string[], exclude: string[] = []): string | null {
  // Two-pass lookup: each hint is first checked against every color's role
  // description (the prose authors use to explain how the color is used)
  // and only then against the bare name. This ensures a `**Snow** … Primary
  // background.` line is recognised as the page background even though the
  // name "Snow" doesn't contain the word "background".
  // `exclude` skips colors whose hex equals an already-chosen role (e.g.
  // pass `[bg]` when picking `fg`) so two roles can't collapse to the same
  // hex and erase contrast.
  const blocked = new Set(
    exclude
      .map((v) => (v == null ? '' : String(v).toLowerCase()))
      .filter((v) => v.length > 0),
  );
  const isAllowed = (c: ColorToken) => !blocked.has(c.value.toLowerCase());
  for (const hint of hints) {
    const byRole = colors.find((c) => isAllowed(c) && matchesHint(c.role, hint));
    if (byRole) return byRole.value;
    const byName = colors.find((c) => isAllowed(c) && matchesHint(c.name, hint));
    if (byName) return byName.value;
  }
  return null;
}

function colorSaturation(hex: string): number {
  const v = String(hex).replace('#', '').toLowerCase();
  if (v.length !== 6) return 0;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}

function colorLuminance(hex: string): number {
  const v = String(hex).replace('#', '').toLowerCase();
  if (v.length !== 6) return 0.5;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function firstLightish(colors: ColorToken[]): string | null {
  for (const c of colors) {
    if (colorSaturation(c.value) > 0.15) continue;
    if (colorLuminance(c.value) >= 0.92) return c.value;
  }
  return null;
}

function firstNonNeutral(colors: ColorToken[], exclude: string[] = []): string | null {
  const set = new Set(exclude.map((v) => String(v || '').toLowerCase()));
  for (const c of colors) {
    if (set.has(c.value.toLowerCase())) continue;
    if (colorSaturation(c.value) > 0.25) return c.value;
  }
  return null;
}

function secondNonNeutral(colors: ColorToken[], exclude: string[] = []): string | null {
  const set = new Set(exclude.map((v) => String(v || '').toLowerCase()));
  for (const c of colors) {
    if (set.has(c.value.toLowerCase())) continue;
    if (colorSaturation(c.value) > 0.25) return c.value;
  }
  return null;
}

function pickReadableForeground(hex: string): string {
  const n = normalizeHex(hex);
  if (n.length !== 7) return '#ffffff';
  const r = parseInt(n.slice(1, 3), 16);
  const g = parseInt(n.slice(3, 5), 16);
  const b = parseInt(n.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? '#0a0a0a' : '#ffffff';
}

function mixSurface(bg: string): string {
  const n = normalizeHex(bg);
  if (n.length !== 7) return '#fafafa';
  const r = parseInt(n.slice(1, 3), 16);
  const g = parseInt(n.slice(3, 5), 16);
  const b = parseInt(n.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  // Lift dark backgrounds; tint light backgrounds slightly cooler.
  const adjust = lum < 0.4 ? 16 : -8;
  const fix = (v: number) => Math.max(0, Math.min(255, v + adjust)).toString(16).padStart(2, '0');
  return `#${fix(r)}${fix(g)}${fix(b)}`;
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

function oneLine(s: string): string {
  return String(s).replace(/\s+/g, ' ').trim();
}

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) =>
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '"' ? '&quot;' : '&#39;',
  );
}
