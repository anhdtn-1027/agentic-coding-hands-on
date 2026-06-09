import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { meta } from '../../propose-improvements.js';

// The workflow runtime only tolerates a single top-level `export` (the `meta` block),
// so the orchestration helpers are plain (un-exported) declarations in propose-improvements.js.
// To unit-test them without re-introducing exports that break the loader, load the
// same source and re-export the helpers through an in-memory module — keeping
// propose-improvements.js the single source of truth.
const src = readFileSync(new URL('../../propose-improvements.js', import.meta.url), 'utf8');
const shim =
  src +
  '\nexport { parseProposalArgs, activeTracks, BUSINESS_DISCOVERY, TECHNICAL_DISCOVERY, BUSINESS_IMPROVEMENT, TECHNICAL_IMPROVEMENT };';
const {
  parseProposalArgs,
  activeTracks,
  BUSINESS_DISCOVERY,
  TECHNICAL_DISCOVERY,
  BUSINESS_IMPROVEMENT,
  TECHNICAL_IMPROVEMENT,
} = await import('data:text/javascript,' + encodeURIComponent(shim));

test('meta registers as /propose-improvements', () => {
  assert.strictEqual(meta.name, 'propose-improvements');
  assert.ok(Array.isArray(meta.phases) && meta.phases.length === 10);
});

test('item enumerations mirror the skill counts', () => {
  assert.strictEqual(BUSINESS_DISCOVERY.length, 9);
  assert.strictEqual(TECHNICAL_DISCOVERY.length, 8);
  assert.strictEqual(BUSINESS_IMPROVEMENT.length, 11);
  assert.strictEqual(TECHNICAL_IMPROVEMENT.length, 14);
});

test('bare invocation → both tracks, no flags', () => {
  const f = parseProposalArgs('');
  assert.deepStrictEqual(f.errors, []);
  assert.strictEqual(f.track, 'both');
  assert.strictEqual(f.force, false);
  assert.strictEqual(f.high, false);
  assert.strictEqual(f.specFolder, null);
  assert.strictEqual(f.focus, '');
});

test('focus area preserved, flag order independent', () => {
  const a = parseProposalArgs('--force --technical-only focus on observability');
  const b = parseProposalArgs('focus on observability --force --technical-only');
  assert.strictEqual(a.focus, 'focus on observability');
  assert.strictEqual(b.focus, 'focus on observability');
  assert.strictEqual(a.force, true);
  assert.strictEqual(a.track, 'technical');
  assert.deepStrictEqual(a, b);
});

test('--high + --spec-folder parse and strip', () => {
  const f = parseProposalArgs('--high --spec-folder docs/specs prioritize auth');
  assert.strictEqual(f.high, true);
  assert.strictEqual(f.specFolder, 'docs/specs');
  assert.strictEqual(f.focus, 'prioritize auth');
  assert.deepStrictEqual(f.errors, []);
});

test('--spec-folder without arg → BLOCKED', () => {
  const f = parseProposalArgs('--spec-folder');
  assert.ok(f.errors.some((e) => e.includes('--spec-folder requires a path')));
});

test('mutually exclusive --technical-only + --business-only → BLOCKED', () => {
  const f = parseProposalArgs('--technical-only --business-only');
  assert.ok(f.errors.some((e) => e.includes('mutually exclusive')));
});

test('--debug unsupported in workflow → BLOCKED with skill pointer', () => {
  const f = parseProposalArgs('--debug use-context');
  assert.ok(f.errors.some((e) => e.includes('--debug is not supported')));
  assert.strictEqual(f.focus, ''); // module arg consumed
});

test('activeTracks resolves by flag + isSDD', () => {
  assert.deepStrictEqual(activeTracks({ track: 'technical' }, true), ['technical']);
  assert.deepStrictEqual(activeTracks({ track: 'technical' }, false), ['technical']);
  assert.deepStrictEqual(activeTracks({ track: 'business' }, true), ['business']);
  assert.deepStrictEqual(activeTracks({ track: 'business' }, false), []); // → caller BLOCKs
  assert.deepStrictEqual(activeTracks({ track: 'both' }, true), ['technical', 'business']);
  assert.deepStrictEqual(activeTracks({ track: 'both' }, false), ['technical']);
});
