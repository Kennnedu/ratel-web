import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './views/Login.vue'
import Records from './views/Records.vue'
import Sources from './views/Sources.vue'
import Tags from './views/Tags.vue'
import RecordNames from './views/RecordNames.vue'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    { name: 'login', path: '/login', component: Login },
    { name: 'records', path: '/', component: Records, alias: '/records' },
    { name: 'sources', path: '/sources', component: Sources },
    { name: 'tags', path: '/tags', component: Tags },
    { name: 'record_names', path: '/record_names', component: RecordNames },
  ]
}) 