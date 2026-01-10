import { getAllGamelogs } from './data'

class GamelogList extends HTMLElement {
  connectedCallback(): void {
    this.render()
  }

  private render(): void {
    const logs = getAllGamelogs()
    this.innerHTML = ''

    if (logs.length === 0) {
      this.innerHTML = '<p>No gamelogs found.</p>'
      return
    }

    let currentYear: string | null = null
    let currentList: HTMLUListElement | null = null

    logs.forEach((log) => {
      const year = log.date ? String(new Date(log.date).getFullYear()) : 'Unknown'

      if (year !== currentYear) {
        const heading = document.createElement('h2')
        heading.className = 'gamelog-year'
        heading.textContent = year
        this.append(heading)

        currentList = document.createElement('ul')
        this.append(currentList)
        currentYear = year
      }

      const listItem = document.createElement('li')
      const link = document.createElement('a')

      link.href = `/blog/gamelog/entry.html?slug=${encodeURIComponent(log.slug)}`
      link.textContent = log.title

      if (log.date) {
        const date = new Date(log.date)
        const dateElement = document.createElement('small')
        dateElement.textContent = date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
        listItem.append(link, document.createTextNode(' — '), dateElement)
      } else {
        listItem.append(link)
      }

      currentList?.append(listItem)
    })
  }
}

if (!customElements.get('gamelog-list')) {
  customElements.define('gamelog-list', GamelogList)
}
