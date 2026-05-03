# ListenHub Source Replica Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine `design-systems/listenhub/DESIGN.md` into a source-derived replica of `~/coding/marswave/listenhub-website-fe`, including an asset/source manifest.

**Architecture:** This is a documentation-token refinement only. The design-system registry already scans `design-systems/*/DESIGN.md`, so implementation updates the existing markdown without changing registry or renderer code. The document keeps the canonical 9-section shape and adds source mapping inside section 9.

**Tech Stack:** Markdown `DESIGN.md`, source references from Next.js/Tailwind CSS files in `listenhub-website-fe`, shell validation.

---

### Task 1: Rewrite ListenHub Design System

**Files:**
- Modify: `design-systems/listenhub/DESIGN.md`

- [ ] **Step 1: Replace the current summary with source-derived rules**

Update the existing 9 sections to include:
- Mars CSS variables from `src/assets/styles/mars-design-system.css`
- Tailwind theme and shadow variables from `src/assets/styles/tailwind.css` and `src/assets/styles/--shadow.css`
- Landing, app home, sidebar v2, gallery, TTS, player, pricing, popup, referral, embed, Storybook, and Zhihu Radio component rules
- Asset manifest for logos, fonts, icons, pricing images, Zhihu images, landing images, and home avatars
- Source mapping table that points each rule family to the relevant source files

- [ ] **Step 2: Validate canonical section shape**

Run:

```bash
node --experimental-strip-types -e "const fs=require('node:fs'); const p='design-systems/listenhub/DESIGN.md'; const s=fs.readFileSync(p,'utf8'); for(let i=1;i<=9;i++){ if(!s.includes('## '+i+'. ')) { console.error('missing section', i); process.exit(i); } } if(!s.includes('### Source Mapping') || !s.includes('### Asset Manifest')) { console.error('missing manifest/source mapping'); process.exit(10); } console.log('ok')"
```

Expected: `ok`

- [ ] **Step 3: Inspect diff**

Run:

```bash
git diff -- design-systems/listenhub/DESIGN.md docs/superpowers/plans/2026-05-03-listenhub-source-replica.md
```

Expected: diff only contains the ListenHub design-system refinement and this plan.
