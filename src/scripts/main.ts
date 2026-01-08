import '../styles/style.css'

import './components/siteNav/siteNav'
import './components/localTime/localTime'
import './components/gamelog/gamelogList'
import './components/gamelog/gamelogArticle'
import './components/dungeonlog/dungeonlogList'

console.log('Well, aren\'t you a curious one? 😉')

window.addEventListener('load', () => {
  document.body?.setAttribute('data-page-ready', 'true')
})
