import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../pages/LoginView.vue'
import ArticlesView from '../pages/ArticlesView.vue'
import DashboardView from '@/pages/DashboardView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/RegisterView.vue')
  },
  {
    path: '/articles',
    component: DashboardView,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Articles',
        component: ArticlesView,
        props: { pageId: 1 },
        // meta: { requiresAuth: true }
      },
      {
        path: 'page/:pageId',
        name: 'ArticlesPaginated',
        component: ArticlesView,
        props: true,
        // meta: { requiresAuth: true }
      },
      {
        path: 'create',
        name: 'Create',
        component: () => import('../pages/ArticleCreateView.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
