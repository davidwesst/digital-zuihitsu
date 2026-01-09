const viewerState = {
  isOpen: false,
}

const VIEWER_CLASS = 'image-viewer'
const TRIGGER_CLASS = 'image-viewer-trigger'

function createViewer(): HTMLElement {
  const viewer = document.createElement('div')
  viewer.className = VIEWER_CLASS
  viewer.setAttribute('role', 'dialog')
  viewer.setAttribute('aria-modal', 'true')
  viewer.setAttribute('aria-hidden', 'true')

  const closeButton = document.createElement('button')
  closeButton.className = 'image-viewer__close'
  closeButton.type = 'button'
  closeButton.setAttribute('aria-label', 'Close image')
  closeButton.textContent = 'X'

  const figure = document.createElement('figure')
  figure.className = 'image-viewer__figure'

  const image = document.createElement('img')
  image.className = 'image-viewer__image'
  image.alt = ''

  const caption = document.createElement('figcaption')
  caption.className = 'image-viewer__caption'
  caption.hidden = true

  figure.append(image, caption)
  viewer.append(closeButton, figure)

  closeButton.addEventListener('click', () => closeViewer(viewer))
  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) {
      closeViewer(viewer)
    }
  })

  return viewer
}

function openViewer(viewer: HTMLElement, sourceImage: HTMLImageElement): void {
  const image = viewer.querySelector<HTMLImageElement>('.image-viewer__image')
  const caption = viewer.querySelector<HTMLElement>('.image-viewer__caption')
  const closeButton = viewer.querySelector<HTMLButtonElement>('.image-viewer__close')

  if (!image || !caption || !closeButton) return

  image.src = sourceImage.currentSrc || sourceImage.src
  image.alt = sourceImage.alt || ''

  if (sourceImage.alt) {
    caption.textContent = sourceImage.alt
    caption.hidden = false
  } else {
    caption.textContent = ''
    caption.hidden = true
  }

  viewer.classList.add('is-open')
  viewer.setAttribute('aria-hidden', 'false')
  document.body.classList.add('image-viewer-open')
  viewerState.isOpen = true
  closeButton.focus()
}

function closeViewer(viewer: HTMLElement): void {
  if (!viewerState.isOpen) return
  viewer.classList.remove('is-open')
  viewer.setAttribute('aria-hidden', 'true')
  document.body.classList.remove('image-viewer-open')
  viewerState.isOpen = false
}

function shouldOpenFromTarget(target: EventTarget | null): target is HTMLImageElement {
  if (!(target instanceof HTMLImageElement)) return false
  if (target.classList.contains('image-viewer__image')) return false
  if (!target.closest('main')) return false
  if (target.closest('a')) return false
  return true
}

function markViewerTargets(root: ParentNode | Element): void {
  if (root instanceof HTMLImageElement) {
    if (root.closest('main') && !root.classList.contains('image-viewer__image')) {
      root.classList.add(TRIGGER_CLASS)
    }
    return
  }

  root.querySelectorAll<HTMLImageElement>('main img').forEach((img) => {
    if (img.classList.contains('image-viewer__image')) return
    img.classList.add(TRIGGER_CLASS)
  })
}

function setupImageViewer(): void {
  const viewer = createViewer()
  document.body.append(viewer)
  markViewerTargets(document)

  document.addEventListener('click', (event) => {
    if (!shouldOpenFromTarget(event.target)) return
    openViewer(viewer, event.target)
  })

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    closeViewer(viewer)
  })

  const main = document.querySelector('main')
  if (!main) return

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return
        markViewerTargets(node)
      })
    })
  })

  observer.observe(main, { childList: true, subtree: true })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupImageViewer)
} else {
  setupImageViewer()
}
