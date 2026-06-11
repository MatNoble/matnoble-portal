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
const ArticleHero = defineAsyncComponent(() => import("./components/ArticleHero.vue"));
const CheatSheetFooter = defineAsyncComponent(() => import("./components/CheatSheetFooter.vue"));
const ChapterNavigation = defineAsyncComponent(() => import("./components/ChapterNavigation.vue"));
const DISolver = defineAsyncComponent(() => import("./components/DIMethod/DISolver.vue"));
const DownloadCard = defineAsyncComponent(() => import("./components/DownloadCard.vue"));
import FloatingTimerIcon from "./components/FloatingTimerIcon.vue";
const ManimVideo = defineAsyncComponent(() => import("./components/ManimVideo.vue"));
const ComparisonGrid = defineAsyncComponent(() => import("./components/ComparisonGrid.vue"));
const ContactCta = defineAsyncComponent(() => import("./components/ContactCta.vue"));
const CramerRuleVisualizer = defineAsyncComponent(() => import("../../components/math/CramerRuleVisualizer.vue"));
const HighFidelityHero = defineAsyncComponent(() => import("./components/HighFidelityHero.vue"));
const KnowledgeGraph = defineAsyncComponent(() => import("./components/KnowledgeGraph.vue"));
const LearningPathHeader = defineAsyncComponent(() => import("./components/LearningPathHeader.vue"));
const MatCountdown = defineAsyncComponent(() => import("./components/MatCountdown.vue"));
const FollowSection = defineAsyncComponent(() => import("./components/FollowSection.vue"));
const RoleGrid = defineAsyncComponent(() => import("./components/RoleGrid.vue"));
const ScholarMap = defineAsyncComponent(() => import("./components/ScholarMap.vue"));
const ScholarlyFeatures = defineAsyncComponent(() => import("./components/ScholarlyFeatures.vue"));
const ScrollTelling = defineAsyncComponent(() => import("./components/ScrollTelling.vue"));
const ThreeOneQuote = defineAsyncComponent(() => import("./components/ThreeOneQuote.vue"));
const TrustLogos = defineAsyncComponent(() => import("./components/TrustLogos.vue"));

import BackToGraph from "./components/BackToGraph.vue";
import CourseList from "./components/CourseList.vue";
import { useData } from "vitepress";

export default {
  extends: DefaultTheme,
  Layout: () => {
    const { page } = useData();
    const showBackLink = () => {
      const relativePath = page.value.relativePath;
      return (
        relativePath.startsWith("courses/") ||
        relativePath.startsWith("teaching/") ||
        relativePath.startsWith("tools/")
      );
    };
    return h(DefaultTheme.Layout, null, {
      // 只在课程、教学与工具内容页插入返回入口，避免隐私政策等普通页面出现错位导航。
      "doc-before": () => showBackLink() ? h(BackToGraph) : null,
      // 使用 nav-bar-title-before 插槽插入自定义 Logo
      "nav-bar-title-before": () => h(Logo),
      // 在文档内容之后插入分享组件和评论组件
      "doc-after": () => [h(RelatedPosts), h(Share), h(Comment)],
      "layout-top": () => h(ReadingProgressBar),
      "layout-bottom": () => [h(BrownianBackground), h(FloatingTimerIcon)],
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

    const initAnalytics = () => {
      if (typeof window === "undefined") return;
      if (isLocalHost()) return;

      // 动态延迟加载 Google Analytics
      if (!document.getElementById('google-analytics-tag')) {
        loadExternalScript(
          "google-analytics-tag",
          "https://www.googletagmanager.com/gtag/js?id=G-491EPRZ1LY"
        );

        const script2 = document.createElement('script');
        script2.id = 'google-analytics';
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-491EPRZ1LY');
        `;
        document.head.appendChild(script2);
      }
    };

    const initAds = () => {
      if (typeof window === "undefined" || isLocalHost()) return;
      loadExternalScript(
        "google-adsense-tag",
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4221480300398103"
      );
    };

    onMounted(() => {
      initZoom();
      // 延迟 4 秒，确保首屏网络与 CPU 闲置后加载分析统计
      setTimeout(() => {
        initAnalytics();
        initAds();
      }, 4000);

      // WebMCP tool registration for agent discovery
      if (typeof navigator !== 'undefined' && (navigator as any).modelContext && typeof (navigator as any).modelContext.provideContext === 'function') {
        try {
          (navigator as any).modelContext.provideContext({
            tools: [
              {
                name: "search-courses",
                description: "Search for mathematics and computer science courses available on the portal.",
                inputSchema: {
                  type: "object",
                  properties: {
                    query: { type: "string", description: "Search query or course name (e.g. Advanced Math, Discrete Mathematics)" }
                  },
                  required: ["query"]
                },
                execute: async ({ query }: { query: string }) => {
                  window.location.href = `/courses/?q=${encodeURIComponent(query)}`;
                  return { success: true, message: `Navigating to search for: ${query}` };
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
    app.component("DownloadCard", DownloadCard);
    app.component("CheatSheetFooter", CheatSheetFooter);
    app.component("ArticleHero", ArticleHero);
    app.component("DISolver", DISolver);
    app.component("ScrollTelling", ScrollTelling);
    app.component("MatCountdown", MatCountdown);
    app.component("FloatingTimerIcon", FloatingTimerIcon);
    app.component("HighFidelityHero", HighFidelityHero);
    app.component("ScholarlyFeatures", ScholarlyFeatures);
    app.component("RoleGrid", RoleGrid);
    app.component("TrustLogos", TrustLogos);
    app.component("ContactCta", ContactCta);
    app.component("ScholarMap", ScholarMap);
    app.component("ChapterNavigation", ChapterNavigation);
    app.component("LearningPathHeader", LearningPathHeader);
    app.component("KnowledgeGraph", KnowledgeGraph);
    app.component("ManimVideo", ManimVideo);
    app.component("ComparisonGrid", ComparisonGrid);
    app.component("FollowSection", FollowSection);
    app.component("ThreeOneQuote", ThreeOneQuote);
    app.component("CramerRuleVisualizer", CramerRuleVisualizer);
    app.component("CourseList", CourseList);
    if (typeof window !== "undefined") {
      // Browser-only enhancements are initialized from setup().
    }
  },
};
