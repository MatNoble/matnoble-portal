<template>
  <div class="download-card">
    <h4><slot>课程讲义下载</slot></h4>
    <p class="description">
      <slot name="description">
        关注微信公众号「数学思维研究社」，回复验证码关键字，获取下载码。
      </slot>
    </p>

    <div v-if="!unlocked" class="verify-section">
      <input
        v-model="userInput"
        type="text"
        placeholder="请输入下载码"
        @keyup.enter="verifyCode"
      />
      <button @click="verifyCode">验证</button>
    </div>

    <div v-if="unlocked" class="download-section">
      <p class="success-message">验证成功！可以下载了。</p>
      <button @click="startDownload" class="download-button">立即下载</button>
    </div>
    
    <p v-if="error" class="error-message">{{ error }}</p>

    <!-- 微信二维码弹窗 -->
    <div v-if="isQROverlayVisible" class="qr-overlay" @click="hideQRCode">
      <div class="qr-modal" @click.stop>
        <img src="/qrcode_for_wechat.jpg" alt="微信公众号二维码" />
        <p>微信扫一扫，关注「MatNoble」</p>
        <button @click="hideQRCode" class="close-button">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  // 正确的下载码
  code: {
    type: String,
    required: true,
  },
  // 文件相对于 public 目录的路径
  fileUrl: {
    type: String,
    required: true,
  },
});

const userInput = ref('');
const unlocked = ref(false);
const error = ref('');
const isQROverlayVisible = ref(false);

const verifyCode = () => {
  if (userInput.value.trim().toLowerCase() === props.code.toLowerCase()) {
    unlocked.value = true;
    error.value = '';
  } else {
    error.value = '验证码错误，请重新输入。';
    unlocked.value = false;
  }
};

const startDownload = () => {
  window.open(props.fileUrl, '_blank');
};

const showQRCode = () => {
  isQROverlayVisible.value = true;
};

const hideQRCode = () => {
  isQROverlayVisible.value = false;
};
</script>

<style scoped>
.download-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
  transition: border-color 0.25s, background-color 0.25s;
}
.download-card:hover {
  border-color: var(--vp-c-brand);
}

.download-card h4 {
  margin-top: 0;
  font-size: 1.2rem;
  font-weight: 600;
  border-bottom: none; /* Override theme styles */
}

.description {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin: 0.5rem 0 1rem;
}

.wechat-link {
  color: var(--vp-c-brand);
  cursor: pointer;
  text-decoration: underline;
}

.verify-section, .download-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.verify-section input {
  flex-grow: 1;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
}

.verify-section button, .download-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background-color: var(--vp-c-brand);
  color: white;
  cursor: pointer;
  transition: background-color 0.25s;
}
.verify-section button:hover, .download-button:hover {
  background-color: var(--vp-c-brand-dark);
}

.download-button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
}

.success-message {
  color: var(--vp-c-green);
  margin: 1rem 0;
}

.error-message {
  color: var(--vp-c-red);
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

/* QR Code Modal Styles */
.qr-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.qr-modal {
  background-color: var(--vp-c-bg);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}

.qr-modal img {
  max-width: 200px;
  display: block;
  margin: 0 auto 1rem;
}

.qr-modal .close-button {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background-color: transparent;
  cursor: pointer;
}
</style>
