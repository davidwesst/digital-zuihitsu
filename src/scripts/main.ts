import '../styles/style.css'

import './components/siteNav/siteNav'
import './components/localTime/localTime'

console.log('Well, aren\'t you a curious one? 😉')

window.addEventListener('load', () => {
  document.body?.setAttribute('data-page-ready', 'true')
})
