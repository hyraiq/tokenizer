// Post-build smoke test: verifies the built package in dist/ is actually
// consumable from a real Node resolver.
//
// vitest (and any bundler) resolves modules leniently, so it happily loads
// extensionless relative imports and an exports map with no CJS condition -
// neither of which Node or Tailwind's jiti-based config loader tolerate. This
// require() self-reference exercises the same path a downstream consumer hits:
//   - it resolves via the exports "default"/"require" condition, and
//   - it loads dist/index.js, which must use fully-specified relative imports.
// If either regresses, this fails before we can publish a broken package.
const assert = require('node:assert');
const { Tokenizer } = require('@hyraiq/tokenizer');

assert.strictEqual(
  typeof Tokenizer,
  'function',
  'Tokenizer must be exported from the built dist/',
);

// Sanity-check it actually works end to end.
const resolved = Tokenizer.with({ blue: { 600: '#002FFF' } }).handle({ brand: 'blue-600' });
assert.deepStrictEqual(resolved, { brand: '#002FFF' });

console.log('smoke: built dist/ is require()-able and resolves tokens ✓');
