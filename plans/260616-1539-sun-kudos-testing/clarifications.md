# Clarifications — Sun* Kudos Live Board Testing

MoMorph refs:
- Sun* Kudos - Live board: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ
- Spec source for assertions: 64 specs + 41 test cases (fetched prior session 260616-1326).

## Session 2026-06-16

- Q: Unit-test coverage depth → A: All ~16 untested components (render + spec content/props/structure) + pure spotlight-scatter util. Asserts UI matches spec at unit level.
- Q: E2E "UI matches spec" approach → A: Structural + text/role assertions mapped to the 41 MoMorph test cases. No visual screenshot baselines.
- Q: E2E locales → A: Both vi (default, unprefixed) + en (verify translated chrome + same structure, i18n split).
