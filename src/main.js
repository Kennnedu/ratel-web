import 'purecss'
import './assets/styles/index.css'
import Vue from 'vue'
import store from './store.js'
import App from './App.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

window.onload = function(){
  new Vue({
    el: '#app',
    store,
    render: createElement => createElement(App)
  });
}
