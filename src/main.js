import Vue from 'vue'
import App from './App.vue'
import store from './store.js'
import router from './router.js'
import Clipboard from 'v-clipboard'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { SidebarPlugin, ToastPlugin, BootstrapVue, ModalPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './registerServiceWorker'
import './assets/main.css'
import './assets/componets/work-space.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import './assets/multiselect.css'

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(BootstrapVue);
Vue.use(ModalPlugin);
Vue.use(ToastPlugin);
Vue.use(SidebarPlugin);
Vue.use(Clipboard);

Vue.config.productionTip = false

window.onload = function(){
  new Vue({
    el: '#app',
    store,
    router,
    render: createElement => createElement(App)
  });
};

window.OneSignal = window.OneSignal || [];
window.OneSignal.push(function() {
  window.OneSignal.init({
    appId: process.env.VUE_APP_ONESIGNAL_APP_ID,
  });
});

