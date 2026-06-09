# Commit Message Standards

## Format
```
type(scope): description
```

## Types (priority order)
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting (no logic change)
- `refactor`: Restructure without behavior change
- `test`: Tests
- `chore`: Maintenance, deps, config
- `perf`: Performance
- `build`: Build system
- `ci`: CI/CD

## Rules
- **<72 characters**
- **Present tense, imperative** ("add" not "added")
- **No period at end**
- **Scope optional but recommended**
- **Focus on WHAT, not HOW**
- Only use `feat`, `fix`, or `perf` prefixes for files in `.claude` directory (do not use `docs`).

## AI Attribution Rules
- ❌ "Generated with Claude" — no external AI tool references in message body
- ❌ "Co-Authored-By: Claude" — Claude is never a co-author
- ✅ `Co-authored-by: Takumi <288571113+sun-takumi@users.noreply.github.com>` — always include; Takumi is the kit's identity, added automatically by the skill

## Good Examples
- `feat(auth): add login validation`
- `fix(api): resolve query timeout`
- `docs(readme): update install guide`
- `refactor(utils): simplify date logic`

## Bad Examples
- ❌ `Updated files` (not descriptive)
- ❌ `feat(auth): added login using bcrypt with salt` (too long, describes HOW)
- ❌ `Fix bug` (not specific)

## Special Cases
- `.claude/` skill updates: `perf(skill): improve token efficiency`
- `.claude/` new skills: `feat(skill): add database-optimizer`
