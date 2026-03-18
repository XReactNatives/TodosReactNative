#!/usr/bin/env node
const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../../');
const outputDir = path.join(projectRoot, 'bundle-output');
const platform = process.argv[2] || 'android';
const metroDir = path.join(projectRoot, '.metro');

function run(cmd) {
  execSync(cmd, {stdio: 'inherit', cwd: projectRoot, shell: true});
}

console.log(`\n=== Bundle split (${platform}) ===\n`);

if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, {recursive: true});
}
fs.mkdirSync(outputDir, {recursive: true});

if (fs.existsSync(metroDir)) {
  fs.rmSync(metroDir, {recursive: true});
}

const ext = platform === 'ios' ? 'ios' : 'android';

console.log('[1/3] core bundle...');
run(
  [
    'npx react-native bundle',
    `--platform ${platform}`,
    '--dev false',
    '--minify false',
    '--entry-file src/common.ts',
    `--bundle-output ${path.join(outputDir, `core.${ext}.bundle`)}`,
    `--assets-dest ${path.join(outputDir, 'res')}`,
    `--sourcemap-output ${path.join(outputDir, `core.${ext}.bundle.map`)}`,
    '--config scripts/bundle/metro.config.common.js',
    '--reset-cache',
  ].join(' '),
);

console.log('\n[2/3] business bundle...');
run(
  [
    'npx react-native bundle',
    `--platform ${platform}`,
    '--dev false',
    '--minify false',
    '--entry-file index.ts',
    `--bundle-output ${path.join(outputDir, `business.${ext}.bundle`)}`,
    `--assets-dest ${path.join(outputDir, 'res')}`,
    `--sourcemap-output ${path.join(outputDir, `business.${ext}.bundle.map`)}`,
    '--config scripts/bundle/metro.config.business.js',
  ].join(' '),
);

const bizPath = path.join(outputDir, `business.${ext}.bundle`);
console.log('\n[3/3] removePolyfill...');
run(`node scripts/bundle/removePolyfill.js "${bizPath}"`);

const corePath = path.join(outputDir, `core.${ext}.bundle`);
const coreSize = fs.statSync(corePath).size;
const bizSize = fs.statSync(bizPath).size;
console.log('\n=== Done ===');
console.log(`core.${ext}.bundle:     ${(coreSize / 1024).toFixed(1)} KB`);
console.log(`business.${ext}.bundle: ${(bizSize / 1024).toFixed(1)} KB`);
console.log(`Output: ${outputDir}\n`);
