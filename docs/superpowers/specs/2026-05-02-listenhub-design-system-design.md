# ListenHub Design System Design

## Goal

Add a high-fidelity ListenHub design system to Open Design with the same quality bar as the Labnana system: an authoritative 9-section `DESIGN.md`, plus brand-specific preview and showcase renderers.

The output should encode the real visual language from `~/coding/marswave/listenhub-website-fe`, not a generic SaaS approximation.

## Confirmed Direction

Use the full implementation scope:

- Add `design-systems/listenhub/DESIGN.md`.
- Add a ListenHub-specific preview renderer in `apps/daemon/src/design-system-preview.ts`.
- Add a ListenHub-specific showcase renderer in `apps/daemon/src/design-system-showcase.ts`.
- Extend `apps/daemon/tests/design-system-renderers.test.ts` with ListenHub coverage.
- Do not modify `listenhub-website-fe`, web UI behavior, contracts, or design-system registry schema.

## Token Content

The `DESIGN.md` will follow the canonical 9-section format used by the existing systems:

1. Visual Theme & Atmosphere
2. Color Palette & Roles
3. Typography Rules
4. Component Stylings
5. Layout Principles
6. Depth & Elevation
7. Do's and Don'ts
8. Responsive Behavior
9. Agent Prompt Guide

The content will capture these real ListenHub patterns:

- A light audio-creation workspace: white canvas, soft gray panels, thin borders, compact controls, and content-first cards.
- Primary interaction language: black CTA buttons and black active controls on light surfaces.
- Brand accent language: controlled orange/pink/sky-blue gradients (`#ff8e43 -> #ff58b4 -> #3aadff` and `#fca76f -> #ed8fe5 -> #7ebdea`) for brand emphasis, Pro highlights, and shine borders.
- Mars design system tokens: reversible black/white naming, `bk01` through `bk07` grayscale, `#6648ff` branding, status colors, radius tokens, and Mars text utilities.
- Typography: Inter as the main sans stack, Mars title/body scale, and D-DIN Bold for pricing and numeric emphasis.
- Core components: default/outline/emphasis buttons, home creation input, product chips, app sidebar, podcast cards, slide cards, audio player, pricing cards, upgrade popup, and special activity banners.
- Special campaign layer: Zhihu Radio's red/gold warm event treatment is documented as a constrained activity surface, not as the global product theme.

## Preview Renderer

`renderDesignSystemPreview('listenhub', raw)` should produce a token overview page with:

- Light Mars canvas and black foreground.
- ListenHub title/lockup treatment.
- Brand gradient strip and shine-border usage.
- Palette swatches for neutrals, brand gradients, functional colors, and Zhihu Radio red/gold.
- Mars typography samples.
- Small component previews for the creation input, product chips, audio player, pricing/pro gradient, and radio activity colors.
- Full rendered Markdown below the visual summary.

## Showcase Renderer

`renderDesignSystemShowcase('listenhub', raw)` should render a real-feeling ListenHub product surface instead of the generic SaaS showcase:

- App sidebar with logo, Home/Library/Explore/Voice Cloning items, active white cell, and gray rail.
- Home hero with product welcome, 720px creation input, black arrow submit button, and four product chips.
- Content sections with Podcast and Slides cards.
- Bottom audio player with cover, title, seek bar, and black playback controls.
- Pricing highlight with Pro gradient border/surface and D-DIN price styling.
- Zhihu Radio campaign fragment with warm cream background, red border, gold controls, and `24H Radio` marker.

The showcase must avoid generic template markers such as broad SaaS trust-copy. It should read as ListenHub immediately.

## Validation

The implementation should validate:

- `DESIGN.md` exists and includes all 9 sections.
- Preview output includes ListenHub-specific markers such as `ListenHub`, `AI Podcast`, `#ff58b4`, `Mars typography`, and `Zhihu Radio`.
- Showcase output includes markers such as `Create anything from audio`, `AI Podcast`, `FlowSpeech`, `Pro gradient plan`, and `24H Radio`.
- Showcase output does not include generic renderer copy like `Trusted by teams shipping serious work`.
- The daemon renderer test file passes.

## Out of Scope

- No runtime changes to `listenhub-website-fe`.
- No changes to Open Design's design-system registry schema.
- No new web UI affordances beyond the existing preview/showcase endpoints.
- No generated image assets or external brand asset downloads.
