// 项目4：CI 失败自动修复 + 开 PR（云端 Agent，隔离 VM，autoCreatePR）。
// 用法（CI 中）：CURSOR_API_KEY=... REPO_URL=... FAILURE_LOG=... node auto-fix.mjs
import { Agent, IntegrationNotConnectedError } from "@cursor/sdk";
import { pickModel, requireApiKey } from "./_model.mjs";

const apiKey = requireApiKey(); // 团队自动化用 Service Account key，计费归团队
const repoUrl = process.env.REPO_URL;
const failureLog = process.env.FAILURE_LOG || "(未提供失败日志)";

if (!repoUrl) {
  console.error("缺少 REPO_URL");
  process.exit(1);
}

async function autoFix() {
  try {
    await using agent = await Agent.create({
      apiKey,
      model: await pickModel(),
      cloud: {
        repos: [{ url: repoUrl, startingRef: "main" }],
        autoCreatePR: true,
        envVars: { CI_CONTEXT: "todos-rn-auto-fix" }, // 加密、随 agent 删除
      },
    });

    const run = await agent.send(
      `本仓库 CI 失败。请遵守 AGENTS.md 的四层架构与 .cursor/rules 约束，定位根因、修复并保证 ` +
        `eslint / tsc --noEmit / jest 全部通过。失败日志：\n${failureLog}`,
    );

    const result = await run.wait();
    const pr = result.git?.branches?.[0]?.prUrl;
    console.log(`requestId=${result.requestId} status=${result.status} PR=${pr ?? "(无)"}`);
    return pr;
  } catch (err) {
    if (err instanceof IntegrationNotConnectedError) {
      console.error(`需先连接 ${err.provider}：`, err.helpUrl);
    }
    // 依据 isRetryable 决定是否重试（此处仅抛出，交由 CI 重试策略）
    throw err;
  }
}

autoFix().catch((e) => {
  console.error(e);
  process.exit(1);
});
