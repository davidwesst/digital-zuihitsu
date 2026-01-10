import { getAllDungeonlogs } from './data'

class DungeonlogNav extends HTMLElement {
  connectedCallback(): void {
    this.render()
  }

  private render(): void {
    const entries = getAllDungeonlogs()
    this.innerHTML = ''

    if (entries.length === 0) {
      return
    }

    const container = document.createElement('section')
    container.className = 'widget dungeonlog-nav'

    const header = document.createElement('header')
    header.textContent = 'Dungeonlog Entries'
    container.append(header)

    const list = document.createElement('ul')
    list.className = 'dungeonlog-nav__list'

    entries.forEach((entry) => {
      const item = document.createElement('li')
      const link = document.createElement('a')
      link.href = `#dungeonlog-${entry.slug}`

      const title = document.createElement('span')
      title.className = 'dungeonlog-nav__title'
      title.textContent = entry.title
      link.append(title)

      if (entry.date) {
        const formattedDate = formatDungeonlogDate(entry.date)
        if (formattedDate) {
          const date = document.createElement('span')
          date.className = 'dungeonlog-nav__date'
          date.textContent = formattedDate
          link.append(date)
        }
      }

      item.append(link)
      list.append(item)
    })

    container.append(list)
    this.append(container)
  }
}

if (!customElements.get('dungeonlog-nav')) {
  customElements.define('dungeonlog-nav', DungeonlogNav)
}

function formatDungeonlogDate(dateValue: string): string | undefined {
  const parsedDate = new Date(dateValue)
  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue
  }

  return parsedDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
