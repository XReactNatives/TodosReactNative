// 共享：按最佳实践发现模型而非硬编码，取不到目标就回退 { id: "auto" }。
// 依据：Cursor 方法论「按任务选模型」+「SDK 里别硬编码模型 id」。
import { Cursor } from "@cursor/sdk";

export async function pickModel(prefer = "composer") {
  try {
    const models = await Cursor.models.list();
    const hit = models.find((m) => m.id?.includes(prefer));
    return hit ? { id: hit.id } : { id: "auto" };
  } catch {
    return { id: "auto" };
  }
}

export function requireApiKey() {
  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) {
    console.error("缺少 CURSOR_API_KEY，请先 export（见 .env.example）。");
    process.exit(1);
  }
  return apiKey;
}
