import { ref, computed, nextTick, type Ref } from "vue";
import { useData, useRoute } from "vitepress";
import QRCode from "qrcode";

export interface UseShareReturn {
  currentUrl: Ref<string>;
  title: Ref<string>;
  xShareUrl: Ref<string>;
  fbShareUrl: Ref<string>;
  linkedinShareUrl: Ref<string>;
  showCopied: Ref<boolean>;
  copyLink: () => Promise<void>;
  showWeChat: Ref<boolean>;
  qrCanvas: Ref<HTMLCanvasElement | null>;
  toggleWeChat: () => Promise<void>;
  closeWeChat: () => void;
}

/**
 * 封装页面社交分享与当前 URL 计算逻辑。
 * 显式绑定 route.path 确保在 VitePress 单页应用（SPA）软路由跳转时，
 * URL 与标题能够精准响应式更新，杜绝组件复用导致的状态被冻结问题。
 */
export function useShare(): UseShareReturn {
  const { site, page, frontmatter } = useData();
  const route = useRoute();

  const currentUrl = computed(() => {
    // 建立对 route.path 的响应式订阅
    const path = route.path;
    if (typeof window !== "undefined") {
      try {
        const locPath = window.location.pathname.replace(/\/$/, "") || "/";
        const routeNorm = path.replace(/\/$/, "") || "/";
        if (locPath === routeNorm) {
          return window.location.href;
        }
        return new URL(path, window.location.origin).href;
      } catch {
        return window.location.href;
      }
    }
    return "";
  });

  const title = computed(
    () => frontmatter.value.title || page.value.title || site.value.title || "MatNoble"
  );

  const xShareUrl = computed(() => {
    const url = encodeURIComponent(currentUrl.value);
    const text = encodeURIComponent(title.value);
    return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
  });

  const fbShareUrl = computed(() => {
    const url = encodeURIComponent(currentUrl.value);
    return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  });

  const linkedinShareUrl = computed(() => {
    const url = encodeURIComponent(currentUrl.value);
    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  });

  const showCopied = ref(false);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl.value);
      showCopied.value = true;
      setTimeout(() => {
        showCopied.value = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

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
            if (error) console.error("Failed to generate WeChat QR:", error);
          }
        );
      }
    }
  };

  const closeWeChat = () => {
    showWeChat.value = false;
  };

  return {
    currentUrl,
    title,
    xShareUrl,
    fbShareUrl,
    linkedinShareUrl,
    showCopied,
    copyLink,
    showWeChat,
    qrCanvas,
    toggleWeChat,
    closeWeChat,
  };
}
