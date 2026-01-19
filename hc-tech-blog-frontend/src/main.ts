import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Para garantir que a store do Pinia inicialize com os dados do localStorage
const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')
