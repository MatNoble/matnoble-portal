import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: string
  description: string
  frontmatter: Record<string, any>
}

declare const data: Post[]
export { data }

const excludedPrefixes = ['/agents/', '/audits/', '/public/', '/superpowers/']

export default createContentLoader('**/*.md', {
  transform(raw): Post[] {
    return raw
      .filter(({ url }) =>
        url !== '/' &&
        !url.includes('404') &&
        !excludedPrefixes.some(prefix => url.startsWith(prefix))
      )
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title,
        url,
        description: frontmatter.description,
        date: frontmatter.date,
        frontmatter
      }))
      .sort((a, b) => {
        return +new Date(b.date || 0) - +new Date(a.date || 0)
      })
  }
})
