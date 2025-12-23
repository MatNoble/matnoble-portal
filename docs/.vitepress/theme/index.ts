import { h, watch, onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import Logo from './components/Logo.vue'
import Comment from './components/Comment.vue'
import DownloadCard from './components/DownloadCard.vue' // Import the new component
import './custom.css'
import { pageview } from '@vercel/analytics'

export default {
  extends: DefaultTheme,
  Layout: () => {
    const route = useRoute()
    onMounted(() => {
      pageview()
    })
    watch(
      () => route.path,
      () => {
        pageview()
      }
    )
    return h(DefaultTheme.Layout, null, {
      // 使用 nav-bar-title-before 插槽插入自定义 Logo
      'nav-bar-title-before': () => h(Logo),
      // 在文档内容之后插入评论组件
      'doc-after': () => h(Comment)
    })
  },
  enhanceApp({ app }) {
    app.component('DownloadCard', DownloadCard) // Register DownloadCard globally
  }
}