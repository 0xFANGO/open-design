# Labnana Token Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the Labnana design system so generated artifacts include its deep-space, gold, and multicolor AI identity.

**Architecture:** This is a documentation-token refinement only. The daemon already discovers `design-systems/*/DESIGN.md`, so the implementation updates the existing markdown without changing registry code.

**Tech Stack:** Markdown design-system files, Node/TypeScript registry validation.

---

## File Structure

- Modify `design-systems/banana-lab/DESIGN.md`: revise color roles, component guidance, depth rules, do/don't rules, and prompt guide.
- Modify `.gitignore`: keep `.superpowers/` local brainstorm output out of git.
- Add `docs/superpowers/specs/2026-05-02-labnana-token-refinement-design.md`: record the approved direction.

### Task 1: Refine The Token Language

**Files:**
- Modify: `design-systems/banana-lab/DESIGN.md`

- [ ] **Step 1: Preserve the main brand foundation**

Keep the deep-space background, gold primary interaction role, glass-card treatment, image-card treatment, and Mars typography rules already in the file.

- [ ] **Step 2: Add the missing multicolor identity layer**

Document these real app tokens in section 2 and reference them in relevant component sections:

```text
brand-lab-gradient: cyan-400 -> blue-400 -> violet-400
brand-nana-pink: pink-400
hero-capability-gradients: amber/orange, yellow/lime, sky/cyan, pink/fuchsia, indigo/blue, emerald/teal, rose/orange, slate/sky
premium-neon-loop: #00BBD0 -> #FB64B6 -> #00BBD0
free-reward: emerald
campaign-indigo: #6366F1
sale-red: #E63F3F / #FF224C
checkin-blue-glow: #0080FF, #3E73E2, #334C80
```

- [ ] **Step 3: Tighten usage rules**

Make clear that gold is for controls and active states, the multicolor gradients are for brand/hero/premium/status moments, and image cards stay visually quiet so generated images remain the focus.

- [ ] **Step 4: Validate**

Run:

```bash
pnpm --filter @open-design/daemon test -- design-systems
```

If no targeted test exists, run a lightweight registry read:

```bash
node --experimental-strip-types -e "const fs=require('node:fs'); const p='design-systems/banana-lab/DESIGN.md'; const s=fs.readFileSync(p,'utf8'); if(!s.includes('# Labnana')||!s.includes('## 9. Agent Prompt Guide')) process.exit(1); console.log('ok')"
```
