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

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(BootstrapVue);
Vue.use(ModalPlugin);
Vue.use(ToastPlugin);
Vue.use(SidebarPlugin);

Vue.config.productionTip = false

window.OneSignal.push(["init", {
  appId: "378d5922-58f1-4bfd-9772-c08e705f7113" 
}]);

window.onload = function(){
  new Vue({
    el: '#app',
    store,
    router,
    render: createElement => createElement(App)
  });
};

