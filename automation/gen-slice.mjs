// 项目5：编排 —— 本地 Agent + 自定义工具 + 子代理，让 Agent 按本项目 add-feature-slice
// 技能生成一个功能纵切，并委派 layer-guardian 子代理做架构自审。
// 用法：CURSOR_API_KEY=... node gen-slice.mjs "Comment 评论功能：列表 + 新增"
import { Agent } from "@cursor/sdk";
import { readFileSync } from "node:fs";
import { pickModel, requireApiKey } from "./_model.mjs";

const apiKey = requireApiKey();
const cwd = new URL("..", import.meta.url).pathname;
const feature = process.argv.slice(2).join(" ") || "示例功能";

await using agent = await Agent.create({
  apiKey,
  model: await pickModel(),
  local: {
    cwd,
    // 无人值守护栏：写限工作目录 + 分类器拦截危险调用（详见 guardrails.md）
    sandboxOptions: { enabled: true },
    autoReview: true,
    // 本地自定义工具：把"读某层现有样板文件"暴露给 Agent，保证风格一致
    customTools: {
      read_layer_sample: {
        description: "读取某一层的现有样板文件内容作为风格参考",
        inputSchema: {
          type: "object",
          properties: {
            layer: { type: "string", enum: ["service", "domain", "thunk", "slice", "selector"] },
          },
          required: ["layer"],
        },
        async execute({ layer }) {
          const map = {
            service: "src/service/todosService.ts",
            domain: "src/domain/todosUseCase.ts",
            thunk: "src/state/store/todos/todosThunks.ts",
            slice: "src/state/store/todos/todosSlice.ts",
            selector: "src/state/store/todos/todosSelectors.ts",
          };
          try {
            return readFileSync(new URL(`../${map[layer]}`, import.meta.url), "utf8");
          } catch (e) {
            return `读取失败：${e.message}`;
          }
        },
      },
    },
  },
  // 子代理：架构守卫（与 .cursor/agents/layer-guardian.md 同名同职责）
  agents: {
    "layer-guardian": {
      description: "只读架构守卫，检查四层单向依赖与单一职责",
      prompt:
        "依据 AGENTS.md 与 .cursor/rules/00-architecture-layers.mdc，检查改动是否存在展示层 import service/domain、领域层依赖 react/redux、服务层混业务规则等违规。只报告不改代码。",
      model: "inherit",
    },
  },
});

const run = await agent.send(
  `使用 add-feature-slice 技能的工作流，为「${feature}」生成一个完整纵切。` +
    `先用 read_layer_sample 参考各层现有写法，再按 service→domain(可选)→state→presentation 顺序生成，` +
    `遵守 .cursor/rules 全部约束。完成后让 layer-guardian 子代理审查并附上结论。`,
);

const result = await run.wait();
console.log("status:", result.status);
console.log(result.result);
