# Labnana Token Refinement Design

## Goal

Refine `design-systems/banana-lab/DESIGN.md` so it captures Labnana's full visual identity, not only its gold primary color.

## Confirmed Direction

Keep the existing foundation: deep-space dark background, gold primary interactions, glass panels, image-first gallery cards, and compact Mars typography.

Add the missing identity layer from the real `~/coding/marswave/banana-lab` app:

- Brand spectrum: `Lab` uses a cyan to blue to violet gradient, while `nana` uses pink.
- Premium neon: cyan and pink are allowed for premium/benefit decoration, not ordinary controls.
- Hero capability spectrum: the eight homepage badges use controlled gradients across amber, lime, cyan, pink, indigo, emerald, rose, and slate-sky.
- Functional status colors: emerald for free/reward states, amber for VIP, red for sale/error emphasis, indigo for GPT-Image-2 campaign badges, and blue glows only for the check-in dialog.

## Scope

Only the design-system markdown is refined. No runtime app code or design-system loader changes are required.

## Validation

Check that the markdown remains a readable 9-section `DESIGN.md`, that the registry can still parse the title/category/colors, and that no unrelated runtime files are changed.
