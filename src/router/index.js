import { createRouter, createWebHistory } from 'vue-router'
import store  from '@/store';
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
      },
      {
        path: 'page/:pageId',
        name: 'ArticlesPaginated',
        component: ArticlesView,
        props: true,
      },
      {
        path: 'create',
        name: 'Create',
        component: () => import('../pages/ArticleCreateView.vue'),
        props: {
          isEditing: false
        }
      },
      {
        path: 'edit/:slug',
        name: 'Edit',
        component: () => import('../pages/ArticleCreateView.vue'),
        props: (route) => ({
          isEditing: true,
          slug: route.params.slug
        })
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

router.beforeEach((to,from,next)=>{
  const token = store.getters.token;
  if (to.meta.requiresAuth && !token){
    next('/login');
  } else {
    next();
  }
})

export default router
