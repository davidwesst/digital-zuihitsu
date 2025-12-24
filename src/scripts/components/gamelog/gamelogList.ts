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

    const list = document.createElement('ul')

    logs.forEach((log) => {
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

      list.append(listItem)
    })

    this.append(list)
  }
}

if (!customElements.get('gamelog-list')) {
  customElements.define('gamelog-list', GamelogList)
}
