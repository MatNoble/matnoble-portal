import { h, onMounted, watch, nextTick } from "vue";
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
import "./custom.css";
import { inject } from "@vercel/analytics";
import mediumZoom from "medium-zoom";

import type { EnhanceAppContext } from "vitepress";
import CheatSheetFooter from "./components/CheatSheetFooter.vue";
import DISolver from "./components/DIMethod/DISolver.vue";
import ScrollTelling from "./components/ScrollTelling.vue";
import MatCountdown from "./components/MatCountdown.vue";
import FloatingTimerIcon from "./components/FloatingTimerIcon.vue";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 使用 nav-bar-title-before 插槽插入自定义 Logo
      "nav-bar-title-before": () => h(Logo),
      // 在文档内容之后插入分享组件和评论组件
      "doc-after": () => [h(RelatedPosts), h(Share), h(Comment)],
      "layout-top": () => h(ReadingProgressBar),
      "layout-bottom": () => [h(BrownianBackground), h(PwaPrompt), h(FloatingTimerIcon)],
    });
  },
  setup() {
    const route = useRoute();
    const initZoom = () => {
      // mediumZoom('[data-zoomable]')
      mediumZoom(".main img", { background: "var(--vp-c-bg)" });
    };
    onMounted(() => {
      initZoom();
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
    if (typeof window !== "undefined") {
      inject();
    }
  },
};
