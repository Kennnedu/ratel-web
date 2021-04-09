import Vue from 'vue'
import App from './App.vue'
import store from './store.js'
import router from './router.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { SidebarPlugin, ToastPlugin, BootstrapVue, ModalPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './registerServiceWorker'
import './assets/main.css'

// VUE setup
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(BootstrapVue);
Vue.use(ModalPlugin);
Vue.use(ToastPlugin);
Vue.use(SidebarPlugin);
Vue.config.productionTip = false
window.onload = function(){
  new Vue({
    el: '#app',
    store,
    router,
    render: createElement => createElement(App)
  });
}

