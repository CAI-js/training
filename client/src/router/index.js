import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { getToken, getRefreshToken } from '../api/jwt'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      const tokenExists = !!getToken() && !!getRefreshToken()
      if (tokenExists) {
        return next()
      }
      return next({name: 'Login'})
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
