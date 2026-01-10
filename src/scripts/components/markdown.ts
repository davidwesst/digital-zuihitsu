import { marked } from 'marked'

const renderer = new marked.Renderer()

renderer.link = (token) => {
  const text = token.text ?? ''
  const href = token.href ?? ''
  const title = token.title ? ` title="${token.title}"` : ''
  return `<a href="${href}"${title} target="_blank" rel="noopener noreferrer">${text}</a>`
}

marked.use({ renderer })

export function renderMarkdown(content: string): string {
  const parsed = marked.parse(content)
  return typeof parsed === 'string' ? parsed : ''
}
