<template>
  <div class="share-container">
    <div class="share-label">分享至：</div>
    <div class="share-buttons">
      <a
        :href="xShareUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="share-btn x"
        title="分享至 X (Twitter)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
          <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          ></path>
        </svg>
      </a>
      <a
        :href="fbShareUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="share-btn facebook"
        title="分享至 Facebook"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
        </svg>
      </a>
      <a
        :href="linkedinShareUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="share-btn linkedin"
        title="分享至 LinkedIn"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
          <path
            d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"
          ></path>
        </svg>
      </a>
      <button class="share-btn wechat" @click="toggleWeChat" title="分享至微信">
        <svg viewBox="0 0 16 16" aria-hidden="true" class="icon">
          <path
            d="M11.176 14.429c-2.665 0-4.826-1.8-4.826-4.018 0-2.22 2.159-4.02 4.824-4.02S16 8.191 16 10.411c0 1.21-.65 2.301-1.666 3.036a.32.32 0 0 0-.12.366l.218.81a.6.6 0 0 1 .029.117.166.166 0 0 1-.162.162.2.2 0 0 1-.092-.03l-1.057-.61a.5.5 0 0 0-.256-.074.5.5 0 0 0-.142.021 5.7 5.7 0 0 1-1.576.22M9.064 9.542a.647.647 0 1 0 .557-1 .645.645 0 0 0-.646.647.6.6 0 0 0 .09.353Zm3.232.001a.646.646 0 1 0 .546-1 .645.645 0 0 0-.644.644.63.63 0 0 0 .098.356"
          />
          <path
            d="M0 6.826c0 1.455.781 2.765 2.001 3.656a.385.385 0 0 1 .143.439l-.161.6-.1.373a.5.5 0 0 0-.032.14.19.19 0 0 0 .193.193q.06 0 .111-.029l1.268-.733a.6.6 0 0 1 .308-.088q.088 0 .171.025a6.8 6.8 0 0 0 1.625.26 4.5 4.5 0 0 1-.177-1.251c0-2.936 2.785-5.02 5.824-5.02l.15.002C10.587 3.429 8.392 2 5.796 2 2.596 2 0 4.16 0 6.826m4.632-1.555a.77.77 0 1 1-1.54 0 .77.77 0 0 1 1.54 0m3.875 0a.77.77 0 1 1-1.54 0 .77.77 0 0 1 1.54 0"
          />
        </svg>
      </button>
      <button class="share-btn copy" @click="copyLink" :title="showCopied ? '已复制！' : '复制链接'">
        <svg v-if="!showCopied" viewBox="0 0 24 24" aria-hidden="true" class="icon">
           <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true" class="icon success">
           <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </button>
    </div>

    <!-- WeChat QR Code Modal -->
    <div v-if="showWeChat" class="modal-overlay" @click="closeWeChat">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>分享到微信</h3>
          <button class="close-btn" @click="closeWeChat">&times;</button>
        </div>
        <div class="modal-body">
          <canvas ref="qrCanvas"></canvas>
          <p>打开微信，点击右上角“+”，使用“扫一扫”即可分享。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useData } from "vitepress";
import QRCode from "qrcode";

const { page, frontmatter } = useData();

// Get current URL (runs only on client side)
const currentUrl = computed(() => {
  if (typeof window !== "undefined") {
    return window.location.href;
  }
  return "";
});

const title = computed(
  () => frontmatter.value.title || page.value.title || "MatNoble Portal"
);

// X (Twitter) Share URL
const xShareUrl = computed(() => {
  const url = encodeURIComponent(currentUrl.value);
  const text = encodeURIComponent(title.value);
  return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
});

// Facebook Share URL
const fbShareUrl = computed(() => {
  const url = encodeURIComponent(currentUrl.value);
  return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
});

// LinkedIn Share URL
const linkedinShareUrl = computed(() => {
  const url = encodeURIComponent(currentUrl.value);
  return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
});

// Copy Link Logic
const showCopied = ref(false);
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(currentUrl.value);
    showCopied.value = true;
    setTimeout(() => {
      showCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

// WeChat QR Code Logic
const showWeChat = ref(false);
const qrCanvas = ref<HTMLCanvasElement | null>(null);

const toggleWeChat = async () => {
  showWeChat.value = !showWeChat.value;
  if (showWeChat.value) {
    await nextTick();
    if (qrCanvas.value) {
      QRCode.toCanvas(
        qrCanvas.value,
        currentUrl.value,
        { width: 200, margin: 2 },
        (error) => {
          if (error) console.error(error);
        }
      );
    }
  }
};

const closeWeChat = () => {
  showWeChat.value = false;
};
</script>

<style scoped>
.share-container {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.share-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.share-buttons {
  display: flex;
  gap: 0.8rem;
}

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  padding: 0;
}

.share-btn:hover {
  background-color: var(--vp-c-brand);
  color: white;
  transform: translateY(-2px);
}

.share-btn.x:hover {
  background-color: #000;
}

.share-btn.facebook:hover {
  background-color: #1877f2;
}

.share-btn.linkedin:hover {
  background-color: #0077b5;
}

.share-btn.copy:hover {
  background-color: var(--vp-c-brand);
}

.share-btn.wechat:hover {
  background-color: #07c160;
}

.icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.icon.success {
  color: #10b981;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal-content {
  background-color: var(--vp-c-bg);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 300px;
  width: 90%;
  text-align: center;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--vp-c-text-2);
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: var(--vp-c-text-1);
}

.modal-body p {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

canvas {
  display: block;
  margin: 0 auto;
  border-radius: 8px;
}
</style>
