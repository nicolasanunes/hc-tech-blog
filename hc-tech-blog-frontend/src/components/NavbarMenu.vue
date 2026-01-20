<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="flex justify-between items-center p-4 border-b border-gray-300">
    <RouterLink :to="authStore.isAuthenticated ? '/articles' : '/'" class="font-bold text-xl">TechBlog</RouterLink>

    <button
      v-if="authStore.isAuthenticated && route.path !== '/login' && route.path !== '/'"
      @click="handleLogout"
      class="bg-input-color rounded-xl p-2 text-sm"
      title="Sair"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    </button>

    <RouterLink
      v-else-if="route.path !== '/login'"
      :to="authStore.isAuthenticated ? '/articles' : '/login'"
      class="font-semibold text-button-color text-sm"
    >
      Entrar
    </RouterLink>
  </div>
</template>

<style></style>
