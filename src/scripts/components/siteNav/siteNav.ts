import navTemplate from './siteNav.html?raw';

class SiteNav extends HTMLElement {
  connectedCallback(): void {
    if (this.innerHTML.trim().length > 0) {
      return;
    }

    this.innerHTML = navTemplate;
  }
}

if (!customElements.get('site-nav')) {
  customElements.define('site-nav', SiteNav);
}
