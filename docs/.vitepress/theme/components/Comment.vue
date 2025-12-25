<template>
  <div class="comment-container">
    <!-- 微信导流卡片 -->
    <div class="wechat-promo">
      <div class="wechat-content">
        <div class="wechat-icon">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="#07C160">
            <path
              d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z"
              fill="#fff"
            />
            <path
              d="M17.5 9c0 2.21-2.239 4-5 4s-5-1.79-5-4c0-2.21 2.239-4 5-4s5 1.79 5 4zm-3.5 1.5c.276 0 .5-.224.5-.5s-.224-.5-.5-.5-.5.224-.5.5.224.5.5.5zm-3 0c.276 0 .5-.224.5-.5s-.224-.5-.5-.5-.5.224-.5.5.224.5.5.5zM7.2 16.5c-3.3 0-6-2.2-6-4.9 0-1.4.7-2.7 1.9-3.6-.1-.5-.4-1.6-.4-1.7 0-.1 0-.1.1-.1.1 0 .2 0 .5.1 1 .5 1.9.9 2.1 1 5.9-2.3 9.4 4.5 5.5 8-.8.8-2.1 1.2-3.7 1.2z"
              fill="#07C160"
            />
          </svg>
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
import { init } from "@waline/client";
import "@waline/client/style";

const { isDark } = useData();

let walineInstance = null;

onMounted(() => {
  const serverURL = "https://matnoble-comment.vercel.app";

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
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
    { rootMargin: "200px" } // 提前 200px 开始加载，提升用户体验
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
