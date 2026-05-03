import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { renderDesignSystemPreview } from '../src/design-system-preview.js';
import { renderDesignSystemShowcase } from '../src/design-system-showcase.js';

const repoRoot = join(__dirname, '..', '..', '..');
const bananaLabDesign = readFileSync(
  join(repoRoot, 'design-systems', 'banana-lab', 'DESIGN.md'),
  'utf8',
);
const listenHubDesign = readFileSync(
  join(repoRoot, 'design-systems', 'listenhub', 'DESIGN.md'),
  'utf8',
);

describe('design system renderers', () => {
  it('renders a Labnana-specific token preview', () => {
    const html = renderDesignSystemPreview('banana-lab', bananaLabDesign);

    expect(html).toContain('<span class="lab">Lab</span><span class="nana">nana</span>');
    expect(html).toContain('Powered by Google Nano Banana');
    expect(html).toContain('Nano Banana');
    expect(html).toContain('Premium Benefit');
    expect(html).toContain('#6366f1');
  });

  it('renders a Labnana-specific showcase instead of the generic SaaS page', () => {
    const html = renderDesignSystemShowcase('banana-lab', bananaLabDesign);

    expect(html).toContain('Generated image gallery');
    expect(html).toContain('✦ Generate');
    expect(html).toContain('Premium Benefit');
    expect(html).toContain('Popular');
    expect(html).not.toContain('Trusted by teams shipping serious work');
  });

  it('renders a ListenHub-specific token preview', () => {
    const html = renderDesignSystemPreview('listenhub', listenHubDesign);

    expect(html).toContain('ListenHub');
    expect(html).toContain('AI Podcast');
    expect(html).toContain('#ff58b4');
    expect(html).toContain('Mars typography');
    expect(html).toContain('Zhihu Radio');
  });

  it('renders a ListenHub-specific showcase instead of the generic SaaS page', () => {
    const html = renderDesignSystemShowcase('listenhub', listenHubDesign);

    expect(html).toContain('Create anything with');
    expect(html).toContain('AI Podcast');
    expect(html).toContain('FlowSpeech');
    expect(html).toContain('订阅 Pro');
    expect(html).toContain('24H Radio');
    expect(html).not.toContain('Trusted by teams shipping serious work');
  });
});
