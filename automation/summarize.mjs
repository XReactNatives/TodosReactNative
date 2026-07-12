// 项目0：本地流式 Agent —— 验证 SDK 打通，读到流事件与 token 用量。
// 用法：CURSOR_API_KEY=... node summarize.mjs
import { Agent } from "@cursor/sdk";
import { pickModel, requireApiKey } from "./_model.mjs";

const apiKey = requireApiKey();
const cwd = new URL("..", import.meta.url).pathname;

await using agent = await Agent.create({
  apiKey,
  model: await pickModel(),
  local: { cwd },
});

const run = await agent.send(
  "阅读 AGENTS.md 与 architecture.md，用中文总结本仓库的四层单向依赖架构与各层职责，控制在 200 字内。",
);

for await (const event of run.stream()) {
  if (event.type === "assistant") {
    for (const block of event.message.content) {
      if (block.type === "text") process.stdout.write(block.text);
    }
  } else if (event.type === "tool_call") {
    console.log(`\n[tool] ${event.name}: ${event.status}`);
  }
}

const result = await run.wait();
console.log("\n\n--- 完成 ---");
console.log("status:", result.status);
console.log("token:", result.usage?.totalTokens);
