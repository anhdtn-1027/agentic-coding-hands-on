# Phase 01 — Viết Kudo modal UI (Track A)

**Status: completed · Track A · background `implementer` · momorph-implement-design skill**

## Screen
- Viết Kudo: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
- fileKey: 9ypp4enmFmdK3YAFJLIu6C · screenId: ihQ26W78P2
- Clarifications: ./clarifications.md

## Goal
Pixel-faithful presentational modal `components/sun-kudos/write-kudos-modal.tsx` (+ sub-components),
controlled via props, mock data from Figma, visual-validation passed.

## Out of scope (Track B owns)
- Real submit / persistence / optimistic board add
- Validation rules & error wiring
- Rich-text formatting behavior + @mention logic (Track B upgrades the editor)
- Mounting into the page / trigger wiring

## Integration contract (expected output)
Component tree + prop interfaces (values, change handlers, error props, recipients list,
hashtag options, onSubmit, onCancel, disabled state) + i18n keys added under `sunKudos.writeModal`.

## Todo
- [x] Build write-kudos-modal.tsx + sub-components (editor, hashtag-picker, image-picker, footer, etc.)
- [x] Mock data from Figma design
- [x] Pixel-faithful presentational components
- [x] Prop interfaces: recipients, hashtag options, handlers, error states
- [x] i18n keys added (sunKudos.writeModal)
- [x] Visual validation loop completed

## Completion notes
- `components/sun-kudos/write-kudos-modal.tsx` built with 8 sub-components
- All props wired for integration
- Visual design validated
- i18n keys integrated into en.json + vi.json
