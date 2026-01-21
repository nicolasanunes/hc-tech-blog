<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ApiMessage from '@/components/ApiMessage.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor, preencha todos os campos'
    return
  }

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    })

    successMessage.value = 'Login realizado com sucesso!'

    // Aguarda 1 segundo para mostrar a mensagem antes de redirecionar
    setTimeout(() => {
      router.push('/articles')
    }, 1000)
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erro ao fazer login'
  }
}
</script>

<template>
  <div class="flex flex-col h-full justify-center gap-2 md:w-2/3 xl:w-2/4 md:mx-auto">
    <ApiMessage
      :error-message="errorMessage"
      :loading-message="authStore.loading ? 'Autenticando...' : undefined"
      :success-message="successMessage"
    />

    <p class="text-4xl font-semibold text-center pb-2">Bem-vindo de volta</p>

    <label for="email" class="font-semibold">Email</label>
    <input
      id="email"
      v-model="email"
      type="email"
      class="bg-input-color rounded-xl px-4 py-4 text-button-color mb-2"
      placeholder="Email"
      :disabled="authStore.loading"
      @keyup.enter="handleLogin"
    />

    <label for="password" class="font-semibold">Senha</label>
    <input
      id="password"
      v-model="password"
      type="password"
      class="bg-input-color rounded-xl px-4 py-4 text-button-color mb-2"
      placeholder="Senha"
      :disabled="authStore.loading"
      @keyup.enter="handleLogin"
    />

    <button
      class="bg-button-color rounded-xl px-4 py-2 text-white text-sm font-semibold disabled:opacity-50 cursor-pointer shadow-lg hover:opacity-80 transition-colors"
      :disabled="authStore.loading"
      @click="handleLogin"
    >
      {{ authStore.loading ? 'Entrando...' : 'Entrar' }}
    </button>
  </div>
</template>

<style></style>
