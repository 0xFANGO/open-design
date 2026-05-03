# ListenHub Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a high-fidelity ListenHub design system with an authoritative `DESIGN.md`, brand-specific preview/showcase renderers, and renderer tests.

**Architecture:** The design-system registry already scans `design-systems/*/DESIGN.md`; no registry schema change is needed. The daemon renderer files currently contain special handling for `banana-lab`; add parallel `listenhub` branches and renderer functions while preserving the generic fallback path.

**Tech Stack:** Markdown design-system files, TypeScript daemon renderer modules, Vitest.

---

## File Structure

- Create `design-systems/listenhub/DESIGN.md`: the canonical 9-section ListenHub design token document.
- Modify `apps/daemon/src/design-system-preview.ts`: add `id === 'listenhub'` dispatch and `renderListenHubPreview`.
- Modify `apps/daemon/src/design-system-showcase.ts`: add `id === 'listenhub'` dispatch and `renderListenHubShowcase`.
- Modify `apps/daemon/tests/design-system-renderers.test.ts`: add ListenHub fixture read and preview/showcase assertions.

### Task 1: Add ListenHub Token Document

**Files:**
- Create: `design-systems/listenhub/DESIGN.md`

- [ ] **Step 1: Write the 9-section token document**

Create a Markdown design system whose first lines are:

```markdown
# ListenHub

> Category: AI & LLM
> AI audio and content creation platform. Light Mars workspace, black primary controls, tri-color brand gradients, and content-first audio surfaces.
```

The document must include sections `## 1. Visual Theme & Atmosphere` through `## 9. Agent Prompt Guide`.

- [ ] **Step 2: Include real token markers**

Ensure the document includes these exact strings so registry summaries and tests can find the intended tokens:

```text
#ff8e43
#ff58b4
#3aadff
#fca76f
#ed8fe5
#7ebdea
Mars typography
Zhihu Radio
```

### Task 2: Add Preview Renderer

**Files:**
- Modify: `apps/daemon/src/design-system-preview.ts`

- [ ] **Step 1: Add dispatch branch**

Near the existing `banana-lab` branch, add:

```ts
if (id === 'listenhub') return renderListenHubPreview(id, raw);
```

- [ ] **Step 2: Implement `renderListenHubPreview`**

Add a function near `renderBananaLabPreview` that returns complete HTML and includes these semantic markers:

```text
ListenHub
AI Podcast
#ff58b4
Mars typography
Zhihu Radio
```

The page should show a light Mars canvas, palette swatches, typography examples, creation input, product chips, player, pricing, and radio activity treatment.

### Task 3: Add Showcase Renderer

**Files:**
- Modify: `apps/daemon/src/design-system-showcase.ts`

- [ ] **Step 1: Add dispatch branch**

Near the existing `banana-lab` branch, add:

```ts
if (id === 'listenhub') return renderListenHubShowcase(id, raw);
```

- [ ] **Step 2: Implement `renderListenHubShowcase`**

Add a function near `renderBananaLabShowcase` that returns complete HTML and includes these markers:

```text
Create anything from audio
AI Podcast
FlowSpeech
Pro gradient plan
24H Radio
```

The page must not include:

```text
Trusted by teams shipping serious work
```

### Task 4: Add Tests And Validate

**Files:**
- Modify: `apps/daemon/tests/design-system-renderers.test.ts`

- [ ] **Step 1: Add fixture read**

Read the new ListenHub design document:

```ts
const listenHubDesign = readFileSync(
  join(repoRoot, 'design-systems', 'listenhub', 'DESIGN.md'),
  'utf8',
);
```

- [ ] **Step 2: Add preview test**

Assert:

```ts
expect(html).toContain('ListenHub');
expect(html).toContain('AI Podcast');
expect(html).toContain('#ff58b4');
expect(html).toContain('Mars typography');
expect(html).toContain('Zhihu Radio');
```

- [ ] **Step 3: Add showcase test**

Assert:

```ts
expect(html).toContain('Create anything from audio');
expect(html).toContain('AI Podcast');
expect(html).toContain('FlowSpeech');
expect(html).toContain('Pro gradient plan');
expect(html).toContain('24H Radio');
expect(html).not.toContain('Trusted by teams shipping serious work');
```

- [ ] **Step 4: Run validation**

Run:

```bash
pnpm --filter @open-design/daemon test -- design-system-renderers
```

Also run a lightweight section check:

```bash
node --experimental-strip-types -e "const fs=require('node:fs'); const p='design-systems/listenhub/DESIGN.md'; const s=fs.readFileSync(p,'utf8'); for(let i=1;i<=9;i++){ if(!s.includes('## '+i+'. ')) process.exit(i); } console.log('ok')"
```
