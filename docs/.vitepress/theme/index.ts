import { h, onMounted, watch, nextTick, defineAsyncComponent } from "vue";
import { useRoute } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Logo from "./components/Logo.vue";
import Comment from "./components/Comment.vue";
import Share from "./components/Share.vue";
import RelatedPosts from "./components/RelatedPosts.vue";
import ReadingProgressBar from "./components/ReadingProgressBar.vue";
import BrownianBackground from "./components/BrownianBackground.vue";
import "./custom.css";
import mediumZoom from "medium-zoom";

import type { EnhanceAppContext } from "vitepress";
const ManimVideo = defineAsyncComponent(() => import("./components/ManimVideo.vue"));
const PageViews = defineAsyncComponent(() => import("./components/PageViews.vue"));

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 使用 nav-bar-title-before 插槽插入自定义 Logo
      "nav-bar-title-before": () => h(Logo),
      // 在正文之后依次插入浏览量、推荐、分享和评论。
      "doc-after": () => [h(PageViews), h(RelatedPosts), h(Share), h(Comment)],
      "layout-top": () => h(ReadingProgressBar),
      "layout-bottom": () => [h(BrownianBackground)],
    });
  },
  setup() {
    const route = useRoute();
    const isLocalHost = () =>
      ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

    const loadExternalScript = (id: string, src: string, timeoutMs = 8000) => {
      if (document.getElementById(id)) return;

      const script = document.createElement("script");
      const timeout = window.setTimeout(() => script.remove(), timeoutMs);
      script.id = id;
      script.async = true;
      script.src = src;
      script.onload = () => window.clearTimeout(timeout);
      script.onerror = () => {
        window.clearTimeout(timeout);
        script.remove();
      };
      document.head.appendChild(script);
    };

    const initZoom = () => {
      // mediumZoom('[data-zoomable]')
      mediumZoom(".main img", { background: "var(--vp-c-bg)" });
    };

    const initAds = () => {
      if (typeof window === "undefined" || isLocalHost()) return;
      loadExternalScript(
        "google-adsense-tag",
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4221480300398103"
      );
    };

    const initClarity = (projectId: string) => {
      if (typeof window === "undefined" || isLocalHost() || (window as any).clarity) return;
      (function(c: any, l: any, a: any, r: any, i: any, t?: any, y?: any){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", projectId);
    };

    onMounted(() => {
      initZoom();
      initClarity("um97n882rl");
      // 延迟 4 秒加载外部辅助脚本（GA4 统计已托管至 Cloudflare Zaraz 统一边缘注入）
      setTimeout(() => {
        initAds();
      }, 4000);

      // WebMCP tool registration for agent discovery
      if (typeof navigator !== 'undefined' && (navigator as any).modelContext && typeof (navigator as any).modelContext.provideContext === 'function') {
        try {
          (navigator as any).modelContext.provideContext({
            tools: [
              {
                name: "search-courses",
                description: "Search for mathematics and computer science courses available on the teaching platform.",
                inputSchema: {
                  type: "object",
                  properties: {
                    query: { type: "string", description: "Search query or course name (e.g. Advanced Math, Discrete Mathematics)" }
                  },
                  required: ["query"]
                },
                execute: async ({ query }: { query: string }) => {
                  window.location.href = `https://teach.matnoble.top/courses/?q=${encodeURIComponent(query)}`;
                  return { success: true, message: `Navigating to teaching platform search for: ${query}` };
                }
              }
            ]
          });
        } catch (e) {
          console.error("Failed to register WebMCP tools:", e);
        }
      }
    });

    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  },
  enhanceApp(ctx: EnhanceAppContext) {
    const { app } = ctx;
    app.component("ManimVideo", ManimVideo);
    if (typeof window !== "undefined") {
      // Browser-only enhancements are initialized from setup().
    }
  },
};
