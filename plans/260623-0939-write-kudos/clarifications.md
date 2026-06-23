# Clarifications — Viết Kudo (Write Kudos) modal

Screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
fileKey: 9ypp4enmFmdK3YAFJLIu6C | screenId: ihQ26W78P2

## Session 2026-06-23

- Q: 'Danh hiệu' (award title) field is in the design (required) but missing from specs/test cases and Kudos type → A: Required field; add awardTitle to Kudos model and validate (design is authoritative)
- Q: No backend exists (mock-only) — what happens on valid 'Gửi'? → A: Optimistic add — validate, brief loading, prepend new kudos to All Kudos feed via client state, close modal
- Q: How functional should the rich-text editor (B/I/S/list/link/quote) be? → A: Lightweight custom contentEditable with execCommand-style formatting + working @mention; no heavy 3rd-party lib
- Q: How are hashtags added for the required Hashtag field? → A: Pick-or-type — picker seeded from mockHashtags + free-text new tags; min 1, max 5, chips with remove
- Q: Where is the modal triggered from? → A: From the existing KudosInputRow "ghi nhận" pen pill on the Live Board (default, not asked)
- Q: i18n approach for modal copy? → A: Add sunKudos.writeModal keys in both en.json + vi.json; VI matches design verbatim (default, not asked)
- Q: Content max length / char counter? → A: 500 chars with live counter under textarea (default, not asked)
- Q: Anonymous name field behavior? → A: When 'ẩn danh' checked, reveal optional name input; if empty, sender shows as "Ẩn danh" (default, not asked)
- Q: Image upload handling (no backend)? → A: Client-side preview via object URLs; accept jpg/png only, reject others with error; max 5 (default, not asked)
