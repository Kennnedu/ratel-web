import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './views/Login.vue'
import Records from './views/Records.vue'
import Sources from './views/Sources.vue'
import Tags from './views/Tags.vue'
import RecordNames from './views/RecordNames.vue'
import Settings from './views/Settings.vue'
import Reports from './views/Reports.vue'
import Dashboard from './views/Dashboard.vue'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    { name: 'login', path: '/login', component: Login },
    { name: 'records', path: '/', component: Records, alias: '/records' },
    { name: 'accounts', path: '/accounts', component: Sources },
    { name: 'tags', path: '/tags', component: Tags },
    { name: 'record_names', path: '/record_names', component: RecordNames },
    { name: 'settings', path: '/settings', component: Settings },
    { name: 'reports', path: '/reports', component: Reports },
    { name: 'dashboard', path: '/dashboard', component: Dashboard },
  ]
}) 
