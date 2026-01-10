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

window.addEventListener('load', () => {
  document.body?.setAttribute('data-page-ready', 'true')
})
