#!/usr/bin/env node
/**
 * beforeShellExecution hook：拦截危险命令。
 * Cursor 通过 stdin 传入 JSON（含待执行命令），脚本输出 JSON 决策：
 *   { "permission": "allow" }            放行
 *   { "permission": "deny", "reason" }   拦截并说明原因
 * 这是文件级项目策略边界（进仓库、对所有人生效），非按次开关。
 */
'use strict';

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (data += c));
    process.stdin.on('end', () => resolve(data));
    // 无 stdin 时兜底
    setTimeout(() => resolve(data), 200);
  });
}

// 危险命令模式：误删原生工程 / 强制 push / 递归删除 / 清空 git
const DANGEROUS = [
  { re: /rm\s+-rf?\s+(\/|~|\.|\*|ios|android|node_modules)/, why: '递归删除关键目录' },
  { re: /git\s+push\s+.*--force(-with-lease)?\b/, why: 'force push（可能覆盖远端历史）' },
  { re: /git\s+reset\s+--hard/, why: 'hard reset（丢弃未提交改动）' },
  { re: /git\s+clean\s+-[a-z]*f/, why: 'git clean -f（删除未跟踪文件）' },
  { re: /(^|\s)(ios|android)\/.*rm\b/, why: '删除原生工程文件' },
];

(async () => {
  const raw = await readStdin();
  let command = '';
  try {
    const parsed = JSON.parse(raw || '{}');
    command = parsed.command || parsed.shell_command || parsed.input || '';
  } catch {
    command = raw || '';
  }

  for (const { re, why } of DANGEROUS) {
    if (re.test(command)) {
      process.stdout.write(
        JSON.stringify({ permission: 'deny', reason: `已被项目 hook 拦截：${why}。如确需执行请人工手动运行。` }),
      );
      process.exit(0);
    }
  }
  process.stdout.write(JSON.stringify({ permission: 'allow' }));
  process.exit(0);
})();
