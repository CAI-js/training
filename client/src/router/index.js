import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { getToken, getRefreshToken } from '../api/jwt'

Vue.use(VueRouter)
function requireLogin(to, from, next) {
  const tokenExists = !!getToken() && !!getRefreshToken()
  if (tokenExists) {
    return next()
  }
  return next({name: 'Login'})
}
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: requireLogin,
  },
  {
    path: '/:id/',
    name: 'Agent',
    component: Home,
    redirect: '/:id/domains',
    children: [
      {
        path: '/:id/domains',
        name: 'Domains',
        component: () => import(/* webpackChunkName: "agent" */ '../views/Domains.vue'),
        beforeEnter: requireLogin,
      },
      {
        path: '/:id/intents',
        name: 'Intents',
        component: () => import(/* webpackChunkName: "agent" */ '../views/Intents.vue'),
        beforeEnter: requireLogin,
      },
    ]
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
