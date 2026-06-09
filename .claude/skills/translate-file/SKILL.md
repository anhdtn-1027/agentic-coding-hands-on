---
name: tkm:translate-file
description: "Translate files (PDF/DOCX/XLSX/EPUB) into any language using a parallel sub-agent pipeline — convert → chunk → glossary → translate → merge. For documents, spreadsheets, books, and manuals."
argument-hint: "<file-path> [--target <lang>] [--concurrency <n>] [--keep-intermediates]"
metadata:
  author: takumi-agent-kit
  version: "1.1.0"
  openclaw:
    requires:
      bins: ["python3", "pandoc", "ebook-convert"]
---
# File Translation

A document that spans hundreds of pages cannot be translated in a single pass.
The pipeline divides, translates in parallel, and reassembles — each piece handled with care.

You are a file translation assistant. You translate documents from one language to another by orchestrating a multi-step pipeline.

## Workflow

### 0. Check and Auto-Install Dependencies

Load `references/setup.md` for full install instructions. Verify both `pandoc` and `ebook-convert` are available. If either is missing, follow the auto-install steps there **without asking the user**. **Do NOT proceed if calibre is still missing after the auto-install attempt** — output must always match the input file type (PDF→PDF, DOCX→DOCX), so there is no fallback. Tell the user which tool failed and ask them to install it manually, then re-run.

### 1. Collect Parameters

Determine the following from the user's message:

- **file_path**: Path to the input file (PDF, DOCX, XLSX, or EPUB) — REQUIRED
- **target_lang**: Target language code (default: `vi`) — e.g. vi, en, zh, ja, ko, fr, de, es
- **concurrency**: Number of parallel sub-agents per batch (default: `8`)
- **temp_root**: Optional directory under which `{filename}_temp/` should be created
- **export_name**: Optional filename stem for user-facing output aliases
- **custom_instructions**: Any additional translation instructions from the user (optional)

If the file path is not provided, ask the user.

### 2. Preprocess — Convert to Markdown Chunks

Run the conversion script to produce chunks:

```bash
{baseDir}/../.venv/bin/python3 {baseDir}/scripts/convert.py "<file_path>" --olang "<target_lang>"
```

If the user provided `temp_root`, add `--temp-root "<temp_root>"`. The temp
directory leaf name remains `{filename}_temp/`; only the parent directory
changes.

**Format-preserving pipelines (auto-selected by file type):**

- **DOCX input** → automatically uses `docx_native` mode (python-docx in-place extraction). Preserves exact fonts, sizes, colors, spacing, tables, images, and embedded objects. Also extracts section headers/footers and footnotes/endnotes for translation. Falls back to Calibre/Markdown on failure.
- **PDF input** → automatically tries `pdf_docx_bridge` mode (pdf2docx converts PDF→DOCX, then python-docx extraction). Preserves layout far better than the Calibre HTMLZ path. Falls back to Calibre/Markdown on failure.
- **XLSX input** → automatically uses `xlsx_native` mode (openpyxl). Extracts text cells only (skips formulas, numbers, empty cells). Preserves all formulas, formatting, and structure.
- **EPUB input** → always uses Calibre/Markdown (no native mode).

In DOCX/PDF native mode, chunks contain `[P:N]` paragraph markers — see rule 14 in the translation prompt.
In XLSX native mode, chunks contain `[CELL:SheetName!A1]` cell address markers — preserve these exactly when translating.

To force legacy Calibre/Markdown behavior for any format, add `--mode markdown`.

This creates a `{filename}_temp/` directory containing:

- `input.html`, `input.md` — intermediate files (Calibre/Markdown mode only)
- `chunk0001.md`, `chunk0002.md`, ... — source chunks for translation
- `manifest.json` — chunk manifest for tracking and validation
- `config.txt` — pipeline configuration with metadata (`conversion_method` field)
- `docx_structure.json` — per-paragraph format metadata (native mode only)

### 3. Discover Source Chunks

Use Glob to find all source chunks:

```
Glob: {filename}_temp/chunk*.md
```

Exclude `output_chunk*.md` from the source list. The selective re-translation
plan below decides which chunks actually need work.

### 3.5. Build Glossary (term consistency)

A separate sub-agent translates each chunk with a fresh context. Without shared state, the same proper noun can drift across multiple translations. The glossary makes every sub-agent see the same canonical translation for the terms that appear in its chunk.

If `<temp_dir>/glossary.json` already exists, skip the rebuild — re-running the skill must not overwrite a hand-edited glossary. To force a rebuild, delete the file.

Otherwise:

1. **Sample chunks**: read `chunk0001.md`, the last chunk, and 3 evenly-spaced middle chunks. If `chunk_count < 5`, sample all of them.
2. **Extract terms**: from the samples, identify proper nouns and recurring domain terms that need consistent translation across the document — typically people, places, organizations, technical concepts. Translate each into the target language. Skip generic vocabulary that any translator would render the same way.
3. **Write `glossary.json`** in the temp dir, matching this v2 schema:

   ```json
   {
     "version": 2,
     "terms": [
       {"id": "Manhattan", "source": "Manhattan", "target": "マンハッタン",
        "category": "place", "aliases": [], "gender": "unknown",
        "confidence": "medium", "frequency": 0,
        "evidence_refs": [], "notes": ""}
     ],
     "high_frequency_top_n": 20,
     "applied_meta_hashes": {}
   }
   ```

   Existing v1 `glossary.json` files are auto-upgraded to v2 on first load. v2 forbids the same surface form (source or alias) appearing in two different terms; if a v1 file has polysemous duplicate sources, the upgrade aborts with a disambiguation message.
4. **Count frequencies** by running:

   ```bash
   {baseDir}/../.venv/bin/python3 {baseDir}/scripts/glossary.py count-frequencies "<temp_dir>"
   ```

   This scans every `chunk*.md` (excluding `output_chunk*.md`), updates each term's `frequency` field, and writes back atomically.

The glossary is hand-editable. If the user edits a `target`, `aliases`, or
`category` field after a partial run, the run-state planner in the next step
will re-translate only chunks whose recorded term set or term hashes are
affected.

### 3.7. Plan Selective Re-translation

Run:

```bash
{baseDir}/../.venv/bin/python3 {baseDir}/scripts/run_state.py plan "<temp_dir>"
```

If the user explicitly asks to apply glossary edits to outputs produced before
`run_state.json` existed, add `--retranslate-untracked`; otherwise keep the
default so old temp dirs remain resumable without mass re-translation.

Capture stdout JSON:

- `translation_chunk_ids` — chunks to translate in this run.
- `record_only_chunk_ids` — existing valid outputs that need `run_state.json`
  records but do not need translation.
- `unchanged_chunk_ids` — existing outputs already consistent with the current
  source chunks and glossary.

If `record_only_chunk_ids` is non-empty, record them before launching
sub-agents:

```bash
{baseDir}/../.venv/bin/python3 {baseDir}/scripts/run_state.py record "<temp_dir>" chunk0001 chunk0002 ...
```

Use `translation_chunk_ids` as the work queue for Step 4. If it is empty, skip
to Step 5.

### 4. Parallel Translation with Sub-Agents

**Check conversion mode first**: read `config.txt` from the temp directory.
- If `conversion_method` is `docx_native` or `pdf_docx_bridge`: chunks contain `[P:N]` paragraph markers — rule 14 MUST be added to each sub-agent's translation prompt.
- If `conversion_method` is `xlsx_native`: chunks contain `[CELL:SheetName!A1]` markers. Each line is one cell. Sub-agents must preserve the `[CELL:...]` prefix exactly and translate only the text after it. Rule 14 does **not** apply (no `[P:N]` markers). Heading rules (8–11) also do not apply.

**Each chunk gets its own independent sub-agent** (1 chunk = 1 sub-agent = 1 fresh context). This prevents context accumulation and output truncation.

Launch chunks in batches to respect API rate limits:

- Each batch: up to `concurrency` sub-agents in parallel (default: 8)
- Wait for the current batch to complete before launching the next

**Spawn each sub-agent with the following task.** Use whatever sub-agent/background-agent mechanism your runtime provides (e.g. the Agent tool, sessions_spawn, or equivalent).

The output file is `output_` prefixed to the source filename: `chunk0001.md` → `output_chunk0001.md`.

> Translate the file `<temp_dir>/chunk<NNNN>.md` to {TARGET_LANGUAGE} and write the result to `<temp_dir>/output_chunk<NNNN>.md`. Follow the translation rules below. Output only the translated content — no commentary.

Each sub-agent receives:

- The single chunk file it is responsible for
- The temp directory path
- The target language
- The translation prompt (see below)
- A per-chunk term table (see "Term table assembly" below)
- Read-only neighboring chunk excerpts (see "Neighbor context assembly" below)
- Any custom instructions

**Term table assembly** — before spawning a sub-agent, run:

```bash
{baseDir}/../.venv/bin/python3 {baseDir}/scripts/glossary.py print-terms-for-chunk "<temp_dir>" "chunk<NNNN>.md"
```

Capture stdout. The CLI emits a 3-column markdown table (`原文 | 別名 | 訳文`) of every term that either appears in this chunk (by source OR any alias) OR is in the top-N most-frequent terms document-wide. Inject the table as `{TERM_TABLE}` in rule #13 of the translation prompt. **If stdout is empty (no glossary, or no relevant terms), omit rule #13 from this chunk's prompt entirely** — do not leave a dangling `{TERM_TABLE}` placeholder.

**Neighbor context assembly** — before spawning a sub-agent, run:

```bash
{baseDir}/../.venv/bin/python3 {baseDir}/scripts/chunk_context.py "<temp_dir>" "chunk<NNNN>.md"
```

Capture stdout. The CLI emits prompt-ready read-only excerpts: the last ~300
characters of the previous chunk and the first ~300 characters of the next
chunk when those files exist. Inject this block as `{NEIGHBOR_CONTEXT}`. If
stdout is empty, omit the neighbor-context block entirely. The sub-agent must
not translate neighboring excerpts or copy them into the output; they are only
for pronoun, gender, and entity-resolution context.

**Each sub-agent's task**:

1. Read the source chunk file (e.g. `chunk0001.md`)
2. Translate the content following the translation rules below
3. Write the translated content to `output_chunk0001.md`
4. Write observations to `output_chunk0001.meta.json` matching the schema below. **Non-blocking** — leave fields empty if unsure; do not invent entities. Always emit the file (even if all arrays are empty), because its presence + content hash is how the main agent tracks whether feedback was already merged.

**Sub-agent meta schema** (`output_chunk<NNNN>.meta.json`):

```json
{
  "schema_version": 1,
  "new_entities": [
    {"source": "Taig", "target_proposal": "テイグ", "category": "person",
     "evidence": "<≤200-char quote from the chunk>"}
  ],
  "alias_hypotheses": [
    {"variant": "Taig", "may_be_alias_of_source": "Tai",
     "evidence": "<≤200-char quote>"}
  ],
  "attribute_hypotheses": [
    {"entity_source": "Tai", "attribute": "gender", "value": "male",
     "confidence": "high", "evidence": "<≤200-char quote>"}
  ],
  "used_term_sources": ["Tai", "Manhattan"],
  "conflicts": [
    {"entity_source": "Tai", "field": "target", "injected": "タイ",
     "observed_better": "太一", "evidence": "<≤200-char quote>"}
  ]
}
```

**Do NOT include a `chunk_id` field** — chunk identity is derived from the filename. Putting it in the payload creates a hallucination hole and validation will reject the file.

The meta file is read by the main agent later and merged into `glossary.json` (see `merge_meta.py`). Sub-agents should fill the schema honestly: cite real quotes from the chunk, never invent entities to "look productive". An empty meta is a perfectly valid output.

**IMPORTANT**: Each sub-agent translates exactly ONE chunk and writes the result directly to the output file. No START/END markers needed.

#### Translation Prompt for Sub-Agents

Include this translation prompt in each sub-agent's instructions (replace `{TARGET_LANGUAGE}` with the actual language name, e.g. "Vietnamese"):

---

このMarkdownファイルを{TARGET_LANGUAGE}に翻訳してください。
IMPORTANT REQUIREMENTS:

1. Markdownの形式（見出し・リンク・画像参照など）を厳密に保持すること
2. テキスト内容のみを翻訳し、すべてのMarkdown構文とファイル名はそのまま残すこと
3. 空リンク・不要な文字・行末の「\\」を削除すること。ページ番号はconvert.pyの上流処理で除去済み。独立した数字行は削除しないこと（1984年・章番号・引用番号など本文コンテンツの可能性がある）。
4. 形式と意味を正確に保ちながら、自然な文体で翻訳すること
5. 翻訳後の本文のみを出力し、説明・注記・コメントは一切含めないこと
6. 明確で簡潔な表現を使い、複雑な文型を避けること。必ず順番通りに翻訳し、内容を飛ばさないこと
7. すべての画像参照を保持すること（以下のルールに従う）：

   - `![alt](path)` 形式の画像参照はすべて完全に保持すること
   - 画像ファイル名とパスは変更しないこと（例: media/image-001.png）
   - 画像のalt文は翻訳可能だが、画像参照の構造は保持すること
   - 画像関連のコンテンツを削除・フィルタ・無視しないこと
   - 画像参照の例: `![Figure 1: Data Flow](media/image-001.png)` → `![図1：データフロー](media/image-001.png)`
   - **生のHTMLタグ（`<img alt="..." />`・`<a title="...">` など）は合法な状態を維持すること**：`alt`・`title` などの属性値内テキストを翻訳する際、以下の文字はHTML構造を破壊するため安全な形式に置換すること（**生のHTMLタグの属性値内にのみ適用**。通常のMarkdown本文・コードブロック・URLには積極的にエスケープしないこと）：

     | 文字  | 属性値内の危険                                               | 置換先                                                       |
     | ----- | ------------------------------------------------------------ | ------------------------------------------------------------ |
     | `"` | `attr="..."` を閉じる                                      | 対象言語に適した曲引用符（例: 日本語「 」）または `&quot;` |
     | `'` | `attr='...'` を閉じる                                      | 対象言語に適した曲引用符または `&#39;`                     |
     | `<` | 新しいタグとして解析される                                   | `&lt;`                                                     |
     | `>` | タグ終了として解析される                                     | `&gt;`                                                     |
     | `&` | エンティティ開始として解析される（`&xxx;` 形式でない場合） | `&amp;`                                                    |

     `src`・`href` などの構造的属性値は変更しないこと。翻訳するのは可視テキスト属性（`alt`・`title`）のみ。
8. 多レベルの見出しを適切に認識・処理し、以下のルールに従ってMarkdownマーカーを付与すること：

   - 主見出し（タイトル・章名など）は `#` を使用
   - 第1レベル見出し（大節）は `##` を使用
   - 第2レベル見出し（小節）は `###` を使用
   - 第3レベル見出し（サブ見出し）は `####` を使用
   - 第4レベル以下は `#####` を使用
9. 見出し認識ルール：

   - 独立した行にある比較的短いテキスト（通常50文字未満）
   - 要約的・概括的な内容を持つ文
   - ドキュメント構造において区切り・整理の役割を持つテキスト
   - 明らかにフォントサイズが異なるまたは特別なフォーマットのテキスト
   - 数字番号で始まる章節テキスト（例: 「1.1 概要」「第三章」など）
10. 見出しレベルの判断：

    - コンテキストと内容の重要度に基づいて見出しレベルを判断すること
    - 章・節の見出しは通常高レベル（`#` または `##`）
    - 小節・サブ節の見出しは順にレベルを下げる（`###` `####` `#####`）
    - 同一ドキュメント内で見出しレベルの一貫性を保つこと
11. 注意事項：

    - 見出しマーカーを過剰に付与しないこと。本当に見出しであるテキストにのみ適用すること
    - 本文段落には見出しマーカーを付けないこと
    - 原文にすでにMarkdown見出しマーカーがある場合は、そのレベル構造を維持すること
12. {CUSTOM_INSTRUCTIONS if provided}
13. 用語の一貫性：以下の用語は必ず指定された訳語を使用すること。「原文」列**または「別名」列**のいずれかの形式が本文に現れた場合は、必ず「訳文」列に対応する形式に翻訳すること。

{TERM_TABLE}

14. **[DOCXネイティブモード専用 — `conversion_method=docx_native` または `pdf_docx_bridge` のときのみ適用]** 段落マーカーの保持：各段落または各テーブルセルは `[P:N]` マーカーで始まる（N は整数）。これらのマーカーを**変更・削除・移動しないこと**。翻訳するのはマーカー後のテキストのみ。
    - 通常段落の例: `[P:5] こんにちは世界` → `[P:5] Xin chào thế giới`
    - 見出しの例: `[P:3] # 第1章` → `[P:3] # Chương 1`
    - テーブルセルの例: `| [P:12] 作業者名 | [P:13] 担当 |` → `| [P:12] Tên người thực hiện | [P:13] Phụ trách |`

隣接チャンクのコンテキスト（読み取り専用。翻訳・出力不可。代名詞・性別・別名・クロスチャンク参照の判断にのみ使用すること。空の場合は省略）:

{NEIGHBOR_CONTEXT}

Markdownファイル本文：

---

### 4.5. Merge Sub-Agent Meta Into Glossary (after each batch)

Each sub-agent emitted an `output_chunk<NNNN>.meta.json` alongside its translated chunk. After every batch completes, first record the completed chunk outputs in `run_state.json` while the glossary is still the one used for that batch, then merge observations into the canonical glossary so subsequent batches see an enriched glossary.

1. Record successfully translated chunks from this batch before mutating the glossary:

   ```bash
   {baseDir}/../.venv/bin/python3 {baseDir}/scripts/run_state.py record "<temp_dir>" chunk0001 chunk0002 ...
   ```

   If this fails, fix the missing/empty output or state error before continuing.
2. Run prepare-merge:

   ```bash
   {baseDir}/../.venv/bin/python3 {baseDir}/scripts/merge_meta.py prepare-merge "<temp_dir>"
   ```

   Capture stdout JSON. It contains four arrays:

   - `auto_apply` — new entities with no glossary collision and unanimous (target, category) across all proposing chunks.
   - `decisions_needed` — items requiring main-agent judgment. Each has `id`, `kind`, an `options` array, and the data needed to pick. Kinds:
     - `alias` — `{variant, candidate_source, evidence}`. Choices: `yes_alias` / `no_separate_entity` / `skip`.
     - `conflict` — `{entity_source, field, current, proposed, evidence}`. Choices: `keep_current` / `accept_proposed` / `record_in_notes`.
     - `new_entity_existing_alias` — sub-agents propose `proposed_source` as a new entity, but it's already someone's alias. `{proposed_source, currently_alias_of, promoted_variants: [{target_proposal, category, evidence, evidence_chunks}, ...]}`. Choices: one `use_variant_N` per distinct (target, category) promotion variant (promote `proposed_source` to standalone with that target+category, removing it from the host's aliases) / `keep_as_alias` / `skip`.
     - `existing_entity_conflict` — sub-agents proposed a (target, category) for `entity_source` that differs from the canonical. Multiple distinct differing proposals all get exposed. `{entity_source, current_target, current_category, proposed_variants: [{target_proposal, category, evidence, evidence_chunks}, ...]}`. Choices: `keep_current` / one `use_variant_N` per competing proposal (overwrites both target AND category, stamps the prior values into notes) / `record_in_notes` (canonical unchanged; every proposed variant gets logged to notes).
     - `alias_or_new_entity` — `variant` has multiple competing options that can't all coexist under v2's surface-form uniqueness rule. Triggered when (a) `variant` was proposed both as a new standalone entity AND as an alias of one or more candidates, OR (b) `variant` was proposed as an alias of two or more different candidates with no standalone competitor. `{variant, alias_candidates: [{candidate_source, evidence, evidence_chunks}, ...], standalone_variants: [{target_proposal, category, evidence, evidence_chunks}, ...]}`. Choices: one `use_alias_N` per candidate (attach as alias of that candidate), one `use_standalone_N` per competing standalone proposal (add as standalone with that target+category), or `skip`.
     - `conflicting_new_entity_proposals` — `{source, variants: [{target_proposal, category, evidence, evidence_chunks}, ...]}`. Choices: `use_variant_0`, `use_variant_1`, ..., `skip`.
   - `consumed_chunk_ids` — every meta file scanned this round (regardless of whether it produced a finding). These hashes get recorded in `applied_meta_hashes` on apply.
   - `malformed_meta_chunk_ids` — meta files that failed validation. Quarantined: not consumed, not crashing the run. Surface them in your batch progress.
3. **If `consumed_chunk_ids` is empty** → nothing was scanned; skip to Step 5.
4. **If `consumed_chunk_ids` is non-empty but both `auto_apply` and `decisions_needed` are empty** → still pipe `{"auto_apply": [], "decisions": [], "consumed_chunk_ids": [...]}` into `apply-merge` so the hashes get recorded. **Skipping this is the bug** — no-op metas would re-scan forever otherwise.
5. **Otherwise, resolve each decision**:

   - Read its evidence quotes inline.
   - Pick one option from its `options` array.
   - Build a `decisions` entry that round-trips the original decision plus your choice. The entry MUST include the original `kind` and (for `conflicting_new_entity_proposals`) the `variants` array, so apply-merge can validate and act:

     ```json
     {"id": "d1", "kind": "alias", "variant": "Taig", "candidate_source": "Tai", "choice": "yes_alias"}
     ```
6. Pipe the decisions JSON into apply-merge:

   ```bash
   echo '{"auto_apply": [...], "decisions": [...], "consumed_chunk_ids": [...]}' \
     | {baseDir}/../.venv/bin/python3 {baseDir}/scripts/merge_meta.py apply-merge "<temp_dir>"
   ```

   Surface the summary JSON (`auto_applied`, `decisions_resolved`, `consumed_chunks`, `errors`) in your batch progress message.

   **apply-merge is transactional.** If any decision is malformed (wrong choice for kind, missing fields, references a non-existent entity), the entire batch aborts with a non-zero exit and stderr details — no glossary mutation, no hashes recorded. On non-zero exit, fix the offending decision and re-pipe; `prepare-merge` will surface the same proposals because nothing was consumed.

   **Decision order in the input list is not significant.** `apply-merge` internally dispatches entity-creating decisions before alias-attaching ones, so `yes_alias` decisions whose candidate is created by another decision in the same batch (a `use_standalone_N`, `use_variant_N`, or `promote_to_separate_entity`) succeed regardless of the order you pass them in. Alias chains (e.g. `Taighi → Taig` where `Taig → Tai` is also a pending alias decision) resolve via a fixed-point loop within the alias-attacher pass — you don't need to topo-sort or sequence chained aliases manually.

On a fresh run after a previous interrupted batch, `prepare-merge` will pick up any meta files left behind. Don't manually delete them.

### 5. Verify Completeness and Retry

After all batches complete, use Glob to check that every source chunk has a corresponding output file.

If any are missing, retry them — each missing chunk as its own sub-agent. Maximum 2 attempts per chunk (initial + 1 retry).

Also read `manifest.json` and verify:

- Every chunk id has a corresponding output file
- No output file is empty (0 bytes)

Then run the meta-merge observability snapshot:

```bash
{baseDir}/../.venv/bin/python3 {baseDir}/scripts/merge_meta.py status "<temp_dir>"
```

Also run the selective re-translation state snapshot:

```bash
{baseDir}/../.venv/bin/python3 {baseDir}/scripts/run_state.py status "<temp_dir>"
```

Surface a one-line summary in the verification report:

> Translated chunks: 50 • Meta files: 48 found / 47 consumed • Malformed: 1 (chunk0099 — see stderr) • Chunks missing meta: chunk0017, chunk0042

Severity rules (none of these fail the run — meta is non-blocking):

- `unmerged_meta_files > 0` after Step 4.5 ran → bug, flag prominently. Resume should have caught this.
- `malformed_meta_files > 0` → sub-agent emitted invalid meta; print chunk_ids and a "fix the file by hand and re-run if you want this chunk's feedback merged" note.
- `meta_files_found < translated_chunks` → sub-agent-compliance issue (some chunks didn't emit meta at all). Print missing chunk_ids.

Report any chunks that failed translation after retry.

### 6. Translate Document Title

Read `config.txt` from the temp directory to get the `original_title` field.

Translate the title to the target language. For Vietnamese, wrap in dấu ngoặc kép: `"translated_title"`. For Japanese, wrap in 『』: `『translated_title』`.

### 7. Post-process — Merge and Build

Run the build script with the translated title:

```bash
{baseDir}/../.venv/bin/python3 {baseDir}/scripts/merge_and_build.py --temp-dir "<temp_dir>" --title "<translated_title>" --cleanup
```

If the user provided `export_name`, add `--export-name "<export_name>"`.

The `--cleanup` flag removes intermediate files (chunks, input.html, etc.) after a fully successful build. If the user asked to keep intermediates (`--keep-intermediates`), omit `--cleanup`.

The script reads `output_lang` from `config.txt` automatically. Optional overrides: `--lang`, `--author`.

**Output paths by conversion mode:**

- **`xlsx_native`**: `merge_and_build.py` calls `build_xlsx.py` to write translated text back into cells — full formula/formatting preservation. Only produces `output.xlsx`.
- **`docx_native` / `pdf_docx_bridge`**: `merge_and_build.py` calls `build_docx.py` to reconstruct `output.docx` directly from `docx_structure.json` + translated paragraphs — full font/size/color/table fidelity. PDF is still generated from HTML via Calibre.
- **`calibre_htmlz` (legacy)**: DOCX and PDF are both generated via Calibre from `output_doc.html`.

This produces in the temp directory:

- **XLSX mode only:** `output.xlsx` — translated spreadsheet with all formulas and formatting intact
- **Document modes:** `output.md`, `output_web.html`, `output_doc.html`, `output.docx`, `output.pdf`
- `xlsx_structure.json` — cell address metadata (xlsx_native mode only, kept for re-runs)
- `docx_structure.json` — paragraph format metadata (docx_native/pdf_docx_bridge only)

### 8. Report Results

Tell the user:

- Where the output files are located
- How many chunks were translated
- The translated document title
- List generated output files with sizes
- Any format generation failures

## References

- `references/setup.md` — Prerequisites and auto-install steps for pandoc and calibre
