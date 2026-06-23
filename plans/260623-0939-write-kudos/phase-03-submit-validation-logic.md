# Phase 03 — Submit, validation, rich-text & field logic (Track B)

## Overview
Priority: High · Status: completed
Implement the behavior layer that drives the (presentational) modal from Track A.

## Requirements

### Validation (per specs A–H + test cases ID-7..56)
- Required: `receiver`, `awardTitle`, `content` (non-empty text), `hashtags` (≥1).
- `hashtags` max 5; block & message on 6th (ID-16/17/53).
- `images` optional, max 5; hide "+ Image" at 5; accept jpg/png only, reject others with error (ID-21..24, 55).
- "Gửi" disabled until all required valid (ID-48/49); on empty submit show per-field errors (ID-56).
- Recipient empty → red border + error (ID-7/50); content empty → "Không được để trống" (ID-11/51);
  hashtag empty → error (ID-14/52).

### Rich-text editor (lightweight, no heavy dep)
- contentEditable region; toolbar buttons apply Bold/Italic/Strikethrough/ordered-list/link/quote
  via `document.execCommand` (or Selection API) — ID-27..32.
- `@` + name → mention dropdown from `mockUsers`, click to insert mention (ID-12/13/33).
- Live char counter under textarea; max 500.

### Hashtag picker
- "+ Hashtag" opens dropdown seeded from `mockHashtags`; allow typing a new tag (ID-34); chips with `x` remove (ID-36); min1/max5.

### Image uploader
- File picker jpg/png; client object URLs for thumbnails; `x` removes (ID-39/40); max 5.

### Anonymous
- Checkbox toggles (ID-41/42); when checked reveal optional name input (ID-43/44).

### Submit
- On valid "Gửi": brief loading → `addKudos({...})` → `closeModal()` (ID-46/47). "Hủy" closes & discards (ID-45).

## Related code files
- Edit modal sub-components from Track A (editor, hashtag, image, footer) to wire handlers/state.
- May add `components/sun-kudos/use-write-kudos-form.ts` (form state + validation hook, < 200 lines).

## Todo
- [x] Form state hook with validation + isValid
- [x] Lightweight rich-text editor + toolbar actions
- [x] @mention dropdown from mockUsers
- [x] Hashtag pick-or-type + chips
- [x] Image picker (jpg/png, max5, object URLs)
- [x] Anonymous toggle + name field
- [x] Submit → addKudos → close; Cancel → discard
- [x] tsc passes

## Success criteria
- All FUNCTION/abnormal test cases satisfiable; type-checks clean.

## Completion notes
- contentEditable rich-text editor with toolbar (Bold, Italic, Strikethrough, Lists, Link, Quote)
- @mention dropdown from mockUsers, click to insert
- Live character counter; max 500 characters
- Hashtag picker: dropdown from mockHashtags + allow custom input; max 5 chips
- Image uploader: jpg/png only, max 5; file type validation + error message
- Anonymous toggle + optional name input field
- Submit with loading state → addKudos → close modal
- Cancel discards all changes
- Full validation per spec: receiver, awardTitle, content non-empty, hashtags min 1
- tsc passes, no errors
