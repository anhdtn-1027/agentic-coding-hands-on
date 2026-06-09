import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

// Same single-source-of-truth shim pattern as proposal-flags.test.js: load
// propose-improvements.js and re-export the (un-exported) idempotency helpers.
const src = readFileSync(new URL('../../propose-improvements.js', import.meta.url), 'utf8');
const shim = src + '\nexport { normalizeArtifactSet, skipResult };';
const { normalizeArtifactSet, skipResult } = await import(
  'data:text/javascript,' + encodeURIComponent(shim)
);

test('normalizeArtifactSet canonicalizes paths for set.has() gating', () => {
  const set = normalizeArtifactSet([
    'plans/improvement-proposal/scout-report.md',
    './plans/improvement-proposal/use-context.json',          // leading ./
    'plans\\improvement-proposal\\technical\\01-discovery\\01-repository-identity.md', // backslashes
    '  plans/improvement-proposal/combined-initial.md  ',     // surrounding whitespace
    'plans/improvement-proposal/validation/',                 // trailing slash
    '',                                                       // empty → dropped
    null,                                                     // nullish → dropped
  ]);
  assert.ok(set.has('plans/improvement-proposal/scout-report.md'));
  assert.ok(set.has('plans/improvement-proposal/use-context.json'));
  assert.ok(set.has('plans/improvement-proposal/technical/01-discovery/01-repository-identity.md'));
  assert.ok(set.has('plans/improvement-proposal/combined-initial.md'));
  assert.ok(set.has('plans/improvement-proposal/validation')); // trailing slash stripped
  assert.strictEqual(set.size, 5); // empty + null dropped
});

test('normalizeArtifactSet tolerates non-array input', () => {
  assert.strictEqual(normalizeArtifactSet(undefined).size, 0);
  assert.strictEqual(normalizeArtifactSet(null).size, 0);
  assert.strictEqual(normalizeArtifactSet('not-an-array').size, 0);
});

test('skipResult is shaped like a STATUS_SCHEMA agent return', () => {
  const r = skipResult('plans/improvement-proposal/scout-report.md');
  assert.strictEqual(r.status, 'SKIP');
  assert.deepStrictEqual(r.logLines, [
    'skip: plans/improvement-proposal/scout-report.md (artifact exists)',
  ]);
});
