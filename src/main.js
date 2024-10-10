import { createApp } from 'vue'
import mitt from 'mitt'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserSecret, faCheckSquare, faPlusCircle, faSquare, faCopy, faMinusCircle, faBan } from '@fortawesome/free-solid-svg-icons'
import "./assets/plannel.css";


library.add(faUserSecret, faCheckSquare, faPlusCircle, faSquare, faCopy, faMinusCircle, faBan )

const emitter = mitt()
const app = createApp(App)

app.config.globalProperties.emitter = emitter
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
