import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Home', requiresAuth: false },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Login', requiresAuth: false },
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('../views/ArticlesView.vue'),
    meta: { title: 'Artigos', requiresAuth: true },
  },
  {
    path: '/articles/:id',
    name: 'article',
    component: () => import('../views/ArticleView.vue'),
    meta: { title: 'Artigo', requiresAuth: true },
  },
  {
    path: '/create-article',
    name: 'create-article',
    component: () => import('../views/CreateArticleView.vue'),
    meta: { title: 'Criar Artigo', requiresAuth: true },
  },
  {
    path: '/edit-article/:id',
    name: 'edit-article',
    component: () => import('../views/EditArticleView.vue'),
    meta: { title: 'Editar Artigo', requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Protege rotas que precisam de autenticação
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Se não está autenticado, tenta restaurar a sessão do cookie
  if (!authStore.isAuthenticated) {
    await authStore.checkAuth()
  }

  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next({ path: '/' })
  } else {
    next()
  }
})

router.afterEach((to) => {
  const baseTitle = 'TechBlog'
  const pageTitle = to.meta.title as string
  document.title = pageTitle ? `${baseTitle} | ${pageTitle}` : baseTitle
})

export default router
