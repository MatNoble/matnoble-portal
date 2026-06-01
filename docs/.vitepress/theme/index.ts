import { h, onMounted, watch, nextTick, defineAsyncComponent } from "vue";
import { useRoute } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Logo from "./components/Logo.vue";
import Comment from "./components/Comment.vue";
import DownloadCard from "./components/DownloadCard.vue"; // Import the new component
import Share from "./components/Share.vue";
import RelatedPosts from "./components/RelatedPosts.vue";
import ReadingProgressBar from "./components/ReadingProgressBar.vue";
import ArticleHero from "./components/ArticleHero.vue";
import BrownianBackground from "./components/BrownianBackground.vue";
import PwaPrompt from "./components/PwaPrompt.vue";
import HighFidelityHero from "./components/HighFidelityHero.vue";
import ScholarlyFeatures from "./components/ScholarlyFeatures.vue";
import RoleGrid from "./components/RoleGrid.vue";
import TrustLogos from "./components/TrustLogos.vue";
import ContactCta from "./components/ContactCta.vue";
import ScholarMap from "./components/ScholarMap.vue";
import ChapterNavigation from "./components/ChapterNavigation.vue";
import LearningPathHeader from "./components/LearningPathHeader.vue";
import KnowledgeGraph from "./components/KnowledgeGraph.vue";
import "./custom.css";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import mediumZoom from "medium-zoom";

import type { EnhanceAppContext } from "vitepress";
import CheatSheetFooter from "./components/CheatSheetFooter.vue";
const DISolver = defineAsyncComponent(() => import("./components/DIMethod/DISolver.vue"));
import ScrollTelling from "./components/ScrollTelling.vue";
import MatCountdown from "./components/MatCountdown.vue";
import FloatingTimerIcon from "./components/FloatingTimerIcon.vue";
const ManimVideo = defineAsyncComponent(() => import("./components/ManimVideo.vue"));
import ComparisonGrid from "./components/ComparisonGrid.vue";
import FollowSection from "./components/FollowSection.vue";
import ThreeOneQuote from "./components/ThreeOneQuote.vue";

import BackToGraph from "./components/BackToGraph.vue";
import CourseList from "./components/CourseList.vue";
import { useData } from "vitepress";

export default {
  extends: DefaultTheme,
  Layout: () => {
    const { page } = useData();
    return h(DefaultTheme.Layout, null, {
      // 在文档内容之前插入返回图谱按钮（首页除外）
      "doc-before": () => page.value.relativePath !== 'index.md' ? h(BackToGraph) : null,
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
    const initZoom = () => {
      // mediumZoom('[data-zoomable]')
      mediumZoom(".main img", { background: "var(--vp-c-bg)" });
    };

    const initAnalytics = () => {
      if (typeof window === "undefined") return;

      // 1. 动态延迟加载 Vercel Analytics 和 Speed Insights
      inject();
      injectSpeedInsights();

      // 2. 动态延迟加载 Google Analytics
      if (!document.getElementById('google-analytics-tag')) {
        const script1 = document.createElement('script');
        script1.id = 'google-analytics-tag';
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-491EPRZ1LY';
        document.head.appendChild(script1);

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

    onMounted(() => {
      initZoom();
      // 延迟 4 秒，确保首屏网络与 CPU 闲置后加载分析统计
      setTimeout(() => {
        initAnalytics();
      }, 4000);
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
    app.component("CourseList", CourseList);
    if (typeof window !== "undefined") {
      // Vercel 静态注入已移至 setup() 延迟初始化
    }
  },
};
