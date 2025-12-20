import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Logo from './components/Logo.vue'
import Comment from './components/Comment.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 使用 nav-bar-title-before 插槽插入自定义 Logo
      'nav-bar-title-before': () => h(Logo),
      // 在文档内容之后插入评论组件
      'doc-after': () => h(Comment)
    })
  }
}