import '../styles/style.css'

import './components/siteNav'

import { initializeLocalTime } from './widgets/localTime'

document.addEventListener('DOMContentLoaded', () => {
    initializeLocalTime();
})

console.log('Well, aren\'t you a curious one? 😉')
