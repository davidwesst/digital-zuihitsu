import { marked } from 'marked'
import { getAllDungeonlogs } from './data'

class DungeonlogList extends HTMLElement {
  connectedCallback(): void {
    this.render()
  }

  private render(): void {
    const entries = getAllDungeonlogs()
    this.innerHTML = ''

    if (entries.length === 0) {
      this.innerHTML = '<p>No dungeon logs found.</p>'
      return
    }

    const list = document.createElement('div')
    list.className = 'dungeonlog-list'

    entries.forEach((entry) => {
      const article = document.createElement('article')
      article.className = 'dungeonlog-entry'

      const header = document.createElement('header')
      const title = document.createElement('h2')
      title.textContent = entry.title
      header.append(title)

      if (entry.date) {
        const parsedDate = new Date(entry.date)
        const isValidDate = !Number.isNaN(parsedDate.getTime())
        const dateElement = document.createElement('p')
        dateElement.innerText = isValidDate
          ? parsedDate.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : entry.date
        header.append(dateElement)
      }

      const { content, titleImage } = normalizeContent(entry.content, entry.slug, entry.titleImage)
      const parsed = marked.parse(content)
      const html = typeof parsed === 'string' ? parsed : ''

      const body = document.createElement('div')
      body.className = 'dungeonlog-content'
      body.innerHTML = html

      article.append(header)

      if (titleImage) {
        const image = document.createElement('img')
        image.className = 'dungeonlog-title-image'
        image.src = buildAssetUrl(entry.slug, titleImage)
        image.alt = `${entry.title} image`
        article.append(image)
      }

      article.append(body)

      list.append(article)
    })

    this.append(list)
  }
}

if (!customElements.get('dungeonlog-list')) {
  customElements.define('dungeonlog-list', DungeonlogList)
}

function normalizeContent(content: string, slug: string, titleImage?: string): { content: string; titleImage?: string } {
  let updated = content

  if (titleImage) {
    updated = stripTitleImage(updated, titleImage)
  }

  updated = rewriteRelativeImagePaths(updated, slug)
  return { content: updated, titleImage }
}

function stripTitleImage(content: string, titleImage: string): string {
  const cleaned = titleImage.replace(/^\.\//, '')
  const escaped = escapeRegExp(cleaned)
  const imagePattern = new RegExp(`!\\[[^\\]]*\\]\\((?:\\./)?${escaped}(?:\\s+[^)]*)?\\)\\s*`, 'gi')
  const updated = content.replace(imagePattern, '').trim()
  return updated
}

function rewriteRelativeImagePaths(content: string, slug: string): string {
  return content.replace(/!\[([^\]]*?)\]\(([^)]+)\)/g, (match, altText, rawUrl) => {
    const trimmed = rawUrl.trim()
    if (isExternalUrl(trimmed) || trimmed.startsWith('/')) {
      return match
    }

    const [urlPart, ...rest] = trimmed.split(/\s+/)
    const cleaned = urlPart.replace(/^\.\//, '')
    const rebuiltUrl = buildAssetUrl(slug, cleaned)
    const titlePart = rest.length > 0 ? ` ${rest.join(' ')}` : ''
    return `![${altText}](${rebuiltUrl}${titlePart})`
  })
}

function buildAssetUrl(slug: string, assetPath: string): string {
  if (isExternalUrl(assetPath) || assetPath.startsWith('/')) {
    return assetPath
  }
  const cleaned = assetPath.replace(/^\.\//, '')
  return `/blog/dungeonlog/${slug}/${cleaned}`
}

function isExternalUrl(value: string): boolean {
  return /^(?:[a-z]+:)?\/\//i.test(value) || value.startsWith('data:')
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
