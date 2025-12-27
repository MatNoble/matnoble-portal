import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import Logo from "./components/Logo.vue";
import Comment from "./components/Comment.vue";
import DownloadCard from "./components/DownloadCard.vue"; // Import the new component
import Share from "./components/Share.vue";
import ReadingProgressBar from "./components/ReadingProgressBar.vue";
import ArticleHero from "./components/ArticleHero.vue";
import "./custom.css";
import { inject } from "@vercel/analytics";

import type { EnhanceAppContext } from "vitepress";
import CheatSheetFooter from "./components/CheatSheetFooter.vue";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 使用 nav-bar-title-before 插槽插入自定义 Logo
      "nav-bar-title-before": () => h(Logo),
      // 在文档内容之后插入分享组件和评论组件
      "doc-after": () => [h(Share), h(Comment)],
      "layout-top": () => h(ReadingProgressBar),
    });
  },
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx);
    const { app } = ctx;
    app.component("DownloadCard", DownloadCard);
    app.component("CheatSheetFooter", CheatSheetFooter);
    app.component("ArticleHero", ArticleHero);
    if (typeof window !== "undefined") {
      inject();
    }
  },
};
