#!/usr/bin/env node
/**
 * afterFileEdit hook：对刚编辑的 src 下 TS/TSX 文件自动跑 ESLint --fix + Prettier。
 * Cursor 通过 stdin 传入 JSON（含被编辑文件路径）。仅处理 src/**、*.ts/*.tsx。
 * 对齐项目的 .eslintrc.js(@react-native) 与 .prettierrc.js。
 */
'use strict';

const { execFileSync } = require('child_process');

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (data += c));
    process.stdin.on('end', () => resolve(data));
    setTimeout(() => resolve(data), 200);
  });
}

function collectPaths(obj, acc) {
  if (!obj || typeof obj !== 'object') return;
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string' && /\.(ts|tsx)$/.test(v) && /(^|\/)src\//.test(v)) acc.add(v);
    else if (typeof v === 'object') collectPaths(v, acc);
    else if (k.toLowerCase().includes('path') && typeof v === 'string') {
      if (/\.(ts|tsx)$/.test(v) && /(^|\/)src\//.test(v)) acc.add(v);
    }
  }
}

(async () => {
  const raw = await readStdin();
  const files = new Set();
  try {
    collectPaths(JSON.parse(raw || '{}'), files);
  } catch {
    /* ignore */
  }
  if (files.size === 0) {
    process.exit(0);
  }
  const list = [...files];
  try {
    execFileSync('npx', ['prettier', '--write', ...list], { stdio: 'ignore' });
  } catch {
    /* prettier 失败不阻塞编辑 */
  }
  try {
    execFileSync('npx', ['eslint', '--fix', ...list], { stdio: 'ignore' });
  } catch {
    /* lint 失败不阻塞编辑，交由 /verify 或 CI 兜底 */
  }
  process.exit(0);
})();
