import '../styles/style.css'

import './components/siteNav/siteNav'
import './components/localTime/localTime'
import './components/gamelog/gamelogList'
import './components/gamelog/gamelogArticle'
import './components/dungeonlog/dungeonlogList'
import './components/dungeonlog/dungeonlogNav'
import './components/siteHeader/siteHeader'
import './components/imageViewer/imageViewer'

console.log('Well, aren\'t you a curious one? 😉')

window.addEventListener('DOMContentLoaded', () => {
  setupMobileSidebars()
})

window.addEventListener('load', () => {
  document.body?.setAttribute('data-page-ready', 'true')
})

function setupMobileSidebars(): void {
  const body = document.body
  if (!body || document.querySelector('.mobile-sidebar-controls')) {
    return
  }

  const leftSidebar = document.querySelector<HTMLElement>('.sidebar-left')
  const rightSidebar = document.querySelector<HTMLElement>('.sidebar-right')

  const rightHasContent = rightSidebar ? Boolean(rightSidebar.querySelector(':not(hr)')) : false

  if (!leftSidebar && !rightSidebar) {
    return
  }

  if (leftSidebar && !leftSidebar.id) {
    leftSidebar.id = 'sidebar-left'
  }

  if (rightSidebar && !rightSidebar.id) {
    rightSidebar.id = 'sidebar-right'
  }

  const controls = document.createElement('div')
  controls.className = 'mobile-sidebar-controls'

  const overlay = document.createElement('div')
  overlay.className = 'sidebar-overlay'

  const buttons: HTMLButtonElement[] = []

  if (leftSidebar) {
    const leftButton = buildSidebarToggle('Menu', leftSidebar.id)
    leftButton.addEventListener('click', () => toggleSidebar('left', leftButton))
    controls.append(leftButton)
    buttons.push(leftButton)
  }

  if (rightSidebar && rightHasContent) {
    const label = rightSidebar.querySelector('.dungeonlog-nav') ? 'Entries' : 'More'
    const rightButton = buildSidebarToggle(label, rightSidebar.id)
    rightButton.addEventListener('click', () => toggleSidebar('right', rightButton))
    controls.append(rightButton)
    buttons.push(rightButton)
  }

  if (buttons.length === 0) {
    return
  }

  overlay.addEventListener('click', closeSidebars)
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSidebars()
    }
  })

  updateControlsOffset()
  window.addEventListener('resize', updateControlsOffset)
  setupScrollVisibility()

  body.append(overlay, controls)

  function toggleSidebar(side: 'left' | 'right', button: HTMLButtonElement): void {
    const openClass = side === 'left' ? 'sidebar-left-open' : 'sidebar-right-open'
    const closeClass = side === 'left' ? 'sidebar-right-open' : 'sidebar-left-open'

    const isOpen = body.classList.toggle(openClass)
    body.classList.remove(closeClass)
    body.classList.toggle('sidebar-open', isOpen)

    buttons.forEach((btn) => {
      btn.setAttribute('aria-expanded', btn === button && isOpen ? 'true' : 'false')
    })

    if (!isOpen) {
      body.classList.remove('sidebar-open')
    }
  }

  function closeSidebars(): void {
    body.classList.remove('sidebar-left-open', 'sidebar-right-open', 'sidebar-open')
    buttons.forEach((btn) => btn.setAttribute('aria-expanded', 'false'))
  }

  function updateControlsOffset(): void {
    const header = document.querySelector<HTMLElement>('site-header')
    const headerHeight = header?.getBoundingClientRect().height ?? 0
    body.style.setProperty(
      '--mobile-controls-top',
      `calc(${headerHeight}px + var(--default-spacing) * 2)`
    )
  }

  function setupScrollVisibility(): void {
    let lastScrollY = window.scrollY

    const onScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY

      if (Math.abs(delta) < 4) {
        return
      }

      if (currentScrollY > lastScrollY && currentScrollY > 20) {
        body.classList.add('mobile-controls-hidden')
      } else {
        body.classList.remove('mobile-controls-hidden')
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
  }
}

function buildSidebarToggle(label: string, controlsId: string): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'mobile-sidebar-toggle'
  button.textContent = label
  button.setAttribute('aria-controls', controlsId)
  button.setAttribute('aria-expanded', 'false')
  return button
}
