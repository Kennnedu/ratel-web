import Vue from 'vue'
import App from './App.vue'
import store from './store.js'
import router from './router.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { BootstrapVue, ModalPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/styles/index.css'
import MobileDetect from 'mobile-detect'

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(BootstrapVue);
Vue.use(ModalPlugin);

Vue.config.productionTip = false

const mb = new MobileDetect(window.navigator.userAgent);

if(mb.mobile()) {
  window.location.href="https://peaceful-forest-90310.herokuapp.com/"
} else {
  window.onload = function(){
    new Vue({
      el: '#app',
      store,
      router,
      render: createElement => createElement(App)
    });
  }
}
