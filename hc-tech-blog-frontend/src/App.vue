<script setup lang="ts">
import NavbarMenu from './components/NavbarMenu.vue';

</script>

<template>
  <div class="flex flex-col h-screen">
    <header>
      <NavbarMenu />
    </header>
    <main class="flex-1 px-6 py-6">
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
