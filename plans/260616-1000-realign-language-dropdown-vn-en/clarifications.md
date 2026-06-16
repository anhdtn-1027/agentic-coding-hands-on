# Clarifications — Re-align Language Dropdown to Design (VN/EN only)

Screen: Dropdown-ngôn ngữ (hUyaaugye2, fileKey=9ypp4enmFmdK3YAFJLIu6C)

## Session 2026-06-16

- Q: Feature already implemented/committed (commit 0f196f2) — how to proceed? → A: Re-align to design exactly (VN/EN only), reversing prior "add JP" decision
- Q: How deep should JP removal go? → A: Remove ja everywhere — dropdown UI + i18n routing + auth proxy /ja allowance + delete messages/ja.json
- Note: This supersedes prior decision in plans/260609-1554-login-screen-saa/clarifications.md (line 9: "Add JP now")
