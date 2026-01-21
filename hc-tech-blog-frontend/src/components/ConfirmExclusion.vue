<script setup lang="ts">
interface Props {
  isOpen: boolean
  title?: string
  message?: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

withDefaults(defineProps<Props>(), {
  title: 'Confirmar exclusão',
  message: 'Tem certeza que deseja excluir este item?',
})

const emit = defineEmits<Emits>()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        @click.self="handleCancel"
      >
        <div class="bg-white rounded-xl max-w-md w-full p-4 transform transition-all" @click.stop>
          <h2 class="text-2xl font-semibold mb-4">{{ title }}</h2>
          <p class="text-gray-600 mb-4">{{ message }}</p>

          <div class="flex justify-end gap-2">
            <button
              @click="handleCancel"
              class="px-4 py-2 rounded-xl bg-gray-200 font-semibold text-sm cursor-pointer shadow-lg hover:opacity-80 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="handleConfirm"
              class="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold text-sm cursor-pointer shadow-lg hover:opacity-80 transition-colors"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.2s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>
