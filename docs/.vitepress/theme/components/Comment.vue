<template>
  <div class="comment-container">
    <!-- 微信导流卡片 -->
    <div class="wechat-promo">
      <div class="wechat-content">
        <div class="wechat-icon">
          <img
            src="/wechat-official-account.png"
            alt="数学思维探究社微信公众号图标"
            class="wechat-official-icon"
            width="48"
            height="48"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div class="wechat-text">
          <p class="wechat-title">不想公开提问？</p>
          <p class="wechat-desc">
            关注公众号
            <strong>数学思维探究社</strong
            >，后台发送“微积分+问题”，获取一对一解答。
          </p>
        </div>
        <div class="wechat-action">
          <img
            src="/qrcode_for_wechat.jpg"
            alt="数学思维探究社"
            class="wechat-qr"
            width="64"
            height="64"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>

    <!-- Waline 评论区 -->
    <div id="waline"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { useData } from "vitepress";
import "@waline/client/style";

const { isDark } = useData();

let walineInstance = null;

onMounted(() => {
  const serverURL = "https://matnoble-comment.vercel.app";

  const observer = new IntersectionObserver(
    async (entries) => {
      if (entries[0].isIntersecting) {
        // 动态导入 Waline 客户端核心库
        const { init } = await import("@waline/client");
        
        walineInstance = init({
          el: "#waline",
          serverURL: serverURL,
          dark: "html.dark", // 自动适配暗黑模式
          emoji: [
            "//unpkg.com/@waline/emojis@1.2.0/weibo",
            "//unpkg.com/@waline/emojis@1.2.0/bilibili",
          ],
          requiredMeta: ["nick"], // 必填项：昵称
          login: "disable", // 禁用登录，降低门槛
          locale: {
            placeholder:
              "支持 LaTeX 公式输入 (例如：$\\int x dx$)。留下昵称即可交流，无需登录。",
          },
        });
        // 初始化后停止观察
        observer.disconnect();
      }
    },
    { rootMargin: "80px" }
  );

  const el = document.querySelector("#waline");
  if (el) observer.observe(el);
});

onUnmounted(() => {
  if (walineInstance) {
    walineInstance.destroy();
  }
});
</script>

<style scoped>
.comment-container {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

/* 微信导流卡片样式 */
.wechat-promo {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid var(--vp-c-divider);
  display: flex;
  justify-content: center;
}

.wechat-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  max-width: 600px;
}

.wechat-text {
  flex: 1;
}

.wechat-official-icon {
  display: block;
  width: 48px;
  height: 48px;
}

.wechat-title {
  font-weight: bold;
  font-size: 1rem;
  margin: 0;
  color: var(--vp-c-text-1);
}

.wechat-desc {
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
  color: var(--vp-c-text-2);
}

.wechat-qr {
  width: 64px;
  height: 64px;
  border-radius: 4px;
  border: 1px solid #eee;
}

@media (max-width: 640px) {
  .wechat-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
</style>
