const logoUrl = new URL('../../../assets/logo.png', import.meta.url).href

class SiteHeader extends HTMLElement {
  connectedCallback(): void {
    if (this.innerHTML.trim().length > 0) {
      return
    }

    const crumbs = buildBreadcrumbs(window.location.pathname)
    this.innerHTML = `
      <header class="site-header">
        <div class="site-header__brand">
          <a class="site-header__logo" href="/index.html" aria-label="Home">
            <img src="${logoUrl}" alt="DW Logo" />
          </a>
          <span class="site-header__title">david.wes.st</span>
        </div>
        <nav class="site-header__crumbs" aria-label="Breadcrumbs">
          <ol>
            ${crumbs
              .map((crumb, index) => {
                const isLast = index === crumbs.length - 1
                return isLast
                  ? `<li aria-current="page">${crumb.label}</li>`
                  : `<li><a href="${crumb.href}">${crumb.label}</a></li>`
              })
              .join('')}
          </ol>
        </nav>
      </header>
    `
  }
}

if (!customElements.get('site-header')) {
  customElements.define('site-header', SiteHeader)
}

type Crumb = {
  label: string
  href: string
}

function buildBreadcrumbs(pathname: string): Crumb[] {
  const normalized = pathname.replace(/\/+$/, '')
  const crumbs: Crumb[] = [{ label: 'Home', href: '/index.html' }]
  const routeMap: Array<[string, Crumb[]]> = [
    ['/blog.html', [{ label: 'Blog', href: '/blog.html' }]],
    [
      '/blog/dungeonlog.html',
      [
        { label: 'Blog', href: '/blog.html' },
        { label: 'Dungeonlog', href: '/blog/dungeonlog.html' },
      ],
    ],
    [
      '/blog/gamelog.html',
      [
        { label: 'Blog', href: '/blog.html' },
        { label: 'Gamelog', href: '/blog/gamelog.html' },
      ],
    ],
    [
      '/blog/gamelog/entry.html',
      [
        { label: 'Blog', href: '/blog.html' },
        { label: 'Gamelog', href: '/blog/gamelog.html' },
        { label: 'Entry', href: '/blog/gamelog/entry.html' },
      ],
    ],
  ]

  const matched = routeMap.find(([path]) => normalized.endsWith(path))

  if (matched) {
    crumbs.push(...matched[1])
    return crumbs
  }

  if (normalized) {
    const file = normalized.split('/').pop() ?? ''
    if (file && file !== 'index.html') {
      crumbs.push({ label: file.replace(/\.html$/, ''), href: normalized })
    }
  }

  return crumbs
}
