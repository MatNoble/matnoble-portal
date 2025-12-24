import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Logo from './components/Logo.vue'
import Comment from './components/Comment.vue'
import DownloadCard from './components/DownloadCard.vue' // Import the new component
import './custom.css'
import { inject } from '@vercel/analytics'

import type { EnhanceAppContext } from 'vitepress'
import CheatSheetFooter from './components/CheatSheetFooter.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 使用 nav-bar-title-before 插槽插入自定义 Logo
      'nav-bar-title-before': () => h(Logo),
      // 在文档内容之后插入评论组件
      'doc-after': () => h(Comment)
    })
  },
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)
    const { app } = ctx
    app.component('DownloadCard', DownloadCard)
    app.component('CheatSheetFooter', CheatSheetFooter)
    if (typeof window !== 'undefined') {
      inject()
    }
  }
}