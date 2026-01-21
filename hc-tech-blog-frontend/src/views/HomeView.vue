<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="flex flex-col h-full justify-center text-center items-center gap-4">
    <p class="text-5xl font-bold lg:text-8xl">Insights & Learning</p>
    <p class="lg:text-3xl">
      Exporando tendências Tech, <br class="md:hidden" />
      um post por vez
    </p>
    <RouterLink
      :to="authStore.isAuthenticated ? '/articles' : '/login'"
      class="bg-button-color rounded-xl px-4 py-2 text-white text-sm font-semibold shadow-lg hover:opacity-80 transition-colors"
    >
      Começar a ler
    </RouterLink>
  </div>
</template>

<style></style>
