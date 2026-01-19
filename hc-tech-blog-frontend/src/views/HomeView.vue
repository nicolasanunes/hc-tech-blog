<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="flex flex-col h-full justify-center text-center items-center gap-4">
    <p class="text-5xl font-bold">Insights & Learning</p>
    <p>
      Exporando tendências Tech, <br />
      um post por vez
    </p>
    <RouterLink
      :to="authStore.isAuthenticated ? '/articles' : '/login'"
      class="bg-button-color rounded-xl px-4 py-2 text-white text-sm font-semibold"
    >
      Começar a ler
    </RouterLink>
  </div>
</template>

<style></style>
