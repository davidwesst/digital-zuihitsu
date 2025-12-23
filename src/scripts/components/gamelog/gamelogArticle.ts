import { marked } from 'marked'
import { getGamelog } from './data'

class GamelogArticle extends HTMLElement {
  connectedCallback(): void {
    this.render()
  }

  private render(): void {
    const params = new URLSearchParams(window.location.search)
    const slug = params.get('slug')

    this.innerHTML = ''

    if (!slug) {
      this.innerHTML = '<p>No gamelog selected.</p>'
      return
    }

    const entry = getGamelog(slug)

    if (!entry) {
      this.innerHTML = `<p>Could not find a gamelog for "${slug}".</p>`
      return
    }

    const heading = document.createElement('header')
    heading.innerHTML = `<h1>${entry.title}</h1>`

    if (entry.date) {
      const date = new Date(entry.date)
      const dateElement = document.createElement('p')
      dateElement.innerText = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      heading.append(dateElement)
    }

    const article = document.createElement('article')
    const parsed = marked.parse(entry.content)
    const html = typeof parsed === 'string' ? parsed : ''

    article.innerHTML = html

    this.append(heading, article)
  }
}

if (!customElements.get('gamelog-article')) {
  customElements.define('gamelog-article', GamelogArticle)
}
