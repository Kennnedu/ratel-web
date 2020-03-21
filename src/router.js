import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './views/Login.vue'
import Records from './views/Records.vue'
import Sources from './views/Sources.vue'
import Tags from './views/Tags.vue'
import Expences from './views/Expences.vue'
import Replenishments from './views/Replenishments.vue'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    { path: '/login', component: Login },
    { name: 'records', path: '/', component: Records, alias: '/records' },
    { name: 'sources', path: '/sources', component: Sources },
    { name: 'tags', path: '/tags', component: Tags },
    { name: 'expences', path: '/expences', component: Expences },
    { name: 'replenishments', path: '/replenishments', component: Replenishments }
  ]
}) 