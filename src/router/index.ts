import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Services from '../views/Services.vue'
import Appointments from '../views/Appointments.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/services', component: Services },
    { path: '/appointments', component: Appointments },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
