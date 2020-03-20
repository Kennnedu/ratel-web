// import 'purecss'
// import './assets/styles/index.css'
import Vue from 'vue'
import store from './store.js'
import App from './App.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { BootstrapVue, ModalPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(BootstrapVue);
Vue.use(ModalPlugin);

Vue.config.productionTip = false

window.onload = function(){
  new Vue({
    el: '#app',
    store,
    render: createElement => createElement(App)
  });
}
