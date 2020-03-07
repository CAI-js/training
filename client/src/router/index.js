import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import {lsGet} from '@/localStorage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      const tokenExists = !!lsGet('access_token') && !!lsGet('refresh_token')
      if (tokenExists) {
        next()
        return;
      }
      next({name: 'Login'})
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
