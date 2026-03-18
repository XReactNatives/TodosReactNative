/**
 * Strip prelude/polyfill lines from business bundle; keep only __d / __r definitions.
 * Run after core bundle is loaded in the same JS context.
 */
const fs = require('fs');
const readline = require('readline');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node removePolyfill.js <bundle-file-path>');
  process.exit(1);
}

const readStream = fs.createReadStream(filePath);
const rl = readline.createInterface({input: readStream});
const kept = [];

rl.on('line', line => {
  const t = line.trimStart();
  if (t.startsWith('__d(') || t.startsWith('__r(')) {
    kept.push(line);
  }
});

rl.on('close', () => {
  fs.writeFileSync(filePath, kept.join('\n'));
  console.log(`[removePolyfill] Kept ${kept.length} lines.`);
});
