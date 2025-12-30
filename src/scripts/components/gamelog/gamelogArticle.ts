import { marked } from 'marked'
import { getGamelog } from './data'
import type { PlayData, Rating } from './data'

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

    const heading = this.buildHeader(entry.title, entry.date, entry.playData, entry.rating)

    const article = document.createElement('article')
    const parsed = marked.parse(entry.content)
    const html = typeof parsed === 'string' ? parsed : ''

    article.innerHTML = html

    this.append(heading, article)
  }

  private buildHeader(title: string, date?: string, playData?: PlayData, rating?: Rating): HTMLElement {
    const heading = document.createElement('header')
    heading.className = 'gamelog-header'

    const titleElement = document.createElement('h1')
    titleElement.textContent = title
    heading.append(titleElement)

    if (date) {
      const parsedDate = new Date(date)
      const isValidDate = !Number.isNaN(parsedDate.getTime())
      const dateElement = document.createElement('p')
      dateElement.innerText = isValidDate
        ? parsedDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : date
      heading.append(dateElement)
    }

    const meta = document.createElement('div')
    meta.className = 'gamelog-meta'

    const playDataSection = this.buildPlayData(playData)
    if (playDataSection) {
      meta.append(playDataSection)
    }

    const ratingSection = this.buildRating(rating)
    if (ratingSection) {
      meta.append(ratingSection)
    }

    if (meta.childElementCount > 0) {
      heading.append(meta)
    }

    return heading
  }

  private buildPlayData(playData?: PlayData): HTMLElement | null {
    if (!playData) return null

    const list = document.createElement('ul')
    buildMetaItem(list, 'Started', playData.started_on)
    buildMetaItem(list, 'Completed', playData.completed_on)
    buildMetaItem(list, 'Platform', playData.platform)

    if (list.childElementCount === 0) {
      return null
    }

    const section = document.createElement('section')
    section.className = 'gamelog-play-data'

    const heading = document.createElement('h2')
    heading.textContent = 'Play Data'

    section.append(heading, list)
    return section
  }

  private buildRating(rating?: Rating): HTMLElement | null {
    if (!rating) return null

    const list = document.createElement('ul')
    buildRating(list, 'Overall', rating.overall)
    buildRating(list, 'Gameplay', rating.gameplay)
    buildRating(list, 'Narrative', rating.narrative)
    buildRating(list, 'Style', rating.style)
    buildRating(list, 'Sound', rating.sound)

    if (list.childElementCount === 0) {
      return null
    }

    const section = document.createElement('section')
    section.className = 'gamelog-rating'

    const heading = document.createElement('h2')
    heading.textContent = 'Ratings'

    section.append(heading, list)
    return section
  }
}

if (!customElements.get('gamelog-article')) {
  customElements.define('gamelog-article', GamelogArticle)
}

function buildMetaItem(list: HTMLUListElement, label: string, detail?: string): void {
  if (!detail) return
  const li = document.createElement('li')
  const labelSpan = document.createElement('span')
  labelSpan.className = 'meta-label'
  labelSpan.textContent = `${label}: `
  li.append(labelSpan, detail)
  list.append(li)
}

function buildRating(list: HTMLUListElement, label: string, value?: number): void {
  if (value === undefined) return
  const li = document.createElement('li')
  const labelSpan = document.createElement('span')
  labelSpan.className = 'meta-label'
  labelSpan.textContent = `${label}: `
  li.append(labelSpan, `${value}/3`)
  list.append(li)
}
