import { onRequest as r2Handler } from "../lib/r2-handler";

export async function onRequest(context) {
  // 自动为 /p/ 路由补充 "images" 目录前缀，避免链接中出现重复的 /p/images/
  const originalPath = context.params.path;
  const newPath = Array.isArray(originalPath) 
    ? ["images", ...originalPath] 
    : ["images", originalPath].filter(Boolean);

  return r2Handler({
    ...context,
    params: {
      ...context.params,
      path: newPath,
    },
  });
}
