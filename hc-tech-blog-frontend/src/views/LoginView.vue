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

const showPassword = ref<boolean>(false)

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

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
    <div class="relative mb-2">
      <input
        id="password"
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        class="bg-input-color rounded-xl px-4 py-4 text-button-color w-full pr-12"
        placeholder="Senha"
        :disabled="authStore.loading"
        @keyup.enter="handleLogin"
      />
      <button
        type="button"
        class="absolute right-4 top-1/2 -translate-y-1/2 p-1 focus:outline-none"
        @click="toggleShowPassword"
        tabindex="-1"
        aria-label="Mostrar ou ocultar senha"
      >
        <svg
          v-if="!showPassword"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-eye-icon lucide-eye text-button-color cursor-pointer"
        >
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-eye-off-icon lucide-eye-off text-button-color cursor-pointer"
        >
          <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/>
          <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
          <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/>
          <path d="m2 2 20 20"/></svg>
      </button>
    </div>

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
