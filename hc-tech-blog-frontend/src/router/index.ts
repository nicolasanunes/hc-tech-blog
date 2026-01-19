import path from 'path'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
      path: '/',
      component: () => import('../views/HomeView.vue'),
      meta: { title: 'Home' },
  },
  {
    path: '/login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Login' },
  },
  {
    path: '/articles',
    component: () => import('../views/ArticlesView.vue'),
    meta: { title: 'Articles' },
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  const baseTitle = 'TechBlog'
  const pageTitle = to.meta.title as string
  document.title = pageTitle ? `${baseTitle} | ${pageTitle}` : baseTitle
})

export default router
