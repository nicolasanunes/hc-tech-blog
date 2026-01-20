<script setup lang="ts">
import { getTags, createTag, getArticle, updateArticle } from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import type { Tag } from '@/types/tag';
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ApiMessage from '@/components/ApiMessage.vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const loading = ref(false)
const errorMessage = ref<string>('')
const successMessage = ref<string>('')

const tagsArray = ref<Tag[]>([])

const title = ref<string>('')
const articlePicture = ref<string>('')
const content = ref<string>('')

const selectedTagIds = ref<number[]>([])

const isCreatingNewTag = ref(false)
const newTagName = ref('')
const pendingTags = ref<string[]>([])

const isFormValid = computed(() => {
  return (
    title.value.trim() !== '' &&
    content.value.trim() !== '' &&
    (selectedTagIds.value.length > 0 || pendingTags.value.length > 0)
  )
})

const editArticle = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  loading.value = true

  try {
    // Primeiro, cria todas as tags pendentes
    const createdTagIds: number[] = []
    for (const tagName of pendingTags.value) {
      try {
        const createdTag = await createTag(tagName)
        createdTagIds.push(createdTag.id)
      } catch (err: any) {
        errorMessage.value = err.response?.data?.message || `Erro ao criar tag "${tagName}"`
        console.error('Erro ao criar tag:', err)
        loading.value = false
        return
      }
    }

    // Combina tags selecionadas com tags recém criadas
    const allTagIds = [...selectedTagIds.value, ...createdTagIds]

    const articleData: { title: string; content: string; tagIds: number[]; articlePicture?: string } = {
      title: title.value.trim(),
      content: content.value.trim(),
      tagIds: allTagIds,
    }

    if (articlePicture.value.trim()) {
      articleData.articlePicture = articlePicture.value.trim()
    }

    const articleId = route.params.id as string
    await updateArticle(articleId, articleData)

    successMessage.value = 'Artigo editado com sucesso!'

    // Aguarda um pouco para mostrar a mensagem antes de redirecionar
    setTimeout(() => {
      router.push('/articles')
    }, 1000)
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Erro ao editar artigo'
    console.error('Erro ao editar artigo:', err)
  } finally {
    loading.value = false
  }
}

const fetchTags = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    tagsArray.value = await getTags()
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Erro ao carregar tags'
    console.error('Erro ao buscar tags:', err)
  } finally {
    loading.value = false
  }
}

const fetchArticle = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const articleId = route.params.id as string
    const article = await getArticle(articleId)

    // Preenche os campos com os dados do artigo
    title.value = article.title
    content.value = article.content
    articlePicture.value = article.articlePicture || ''

    // Seleciona as tags atuais do artigo
    selectedTagIds.value = article.tags.map(tag => tag.id)
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Erro ao carregar artigo'
    console.error('Erro ao buscar artigo:', err)
  } finally {
    loading.value = false
  }
}

const toggleTag = (tagId: number) => {
  const idx = selectedTagIds.value.indexOf(tagId)
  if (idx === -1) {
    selectedTagIds.value.push(tagId)
  } else {
    selectedTagIds.value.splice(idx, 1)
  }
}

const startCreatingTag = () => {
  isCreatingNewTag.value = true
}

const cancelCreatingTag = () => {
  isCreatingNewTag.value = false
  newTagName.value = ''
}

const saveNewTag = async () => {
  if (!newTagName.value.trim()) {
    cancelCreatingTag()
    return
  }

  // Converte para minúsculas
  const tagNameLowerCase = newTagName.value.trim().toLowerCase()

  // Verifica se a tag já existe nas tags pendentes
  if (pendingTags.value.includes(tagNameLowerCase)) {
    errorMessage.value = 'Esta tag já está na fila de criação'
    cancelCreatingTag()
    return
  }

  // Adiciona à fila de tags pendentes
  pendingTags.value.push(tagNameLowerCase)
  isCreatingNewTag.value = false
  newTagName.value = ''
}

const removePendingTag = (tagName: string) => {
  const idx = pendingTags.value.indexOf(tagName)
  if (idx !== -1) {
    pendingTags.value.splice(idx, 1)
  }
}

onMounted(() => {
  fetchArticle()
  fetchTags()
})
</script>

<template>
  <div class="flex flex-col gap-2 lg:relative">
    <ApiMessage
      :error-message="errorMessage"
      :loading-message="authStore.loading ? 'Editando...' : undefined"
      :success-message="successMessage"
    />
    <p class="text-4xl font-semibold mb-2">
      Editar artigo
    </p>
    <p class="font-semibold">Título do artigo *</p>
    <input
      id="title"
      v-model="title"
      type="text"
      class="bg-input-color rounded-xl px-4 py-2 text-button-color mb-2"
      placeholder="Título"
      :disabled="authStore.loading"
      @keyup.enter="editArticle"
    >
    <p class="font-semibold">Imagem do artigo</p>
    <input
      id="articlePicture"
      v-model="articlePicture"
      type="text"
      class="bg-input-color rounded-xl px-4 py-2 text-button-color mb-2"
      placeholder="URL da imagem"
      :disabled="authStore.loading"
      @keyup.enter="editArticle"
    >
    <p class="font-semibold">Tags *</p>
    <div class="flex flex-wrap gap-2 mb-2">
      <div
        v-for="tag in tagsArray"
        :key="tag.id"
        @click="toggleTag(tag.id)"
        :class="[
          'bg-input-color text-black px-3 py-1 rounded-full text-sm select-none',
          selectedTagIds.includes(tag.id) ? 'border border-button-color' : '',
        ]"
      >
        {{ tag.name }}
      </div>
      <div
        v-for="(tagName, index) in pendingTags"
        :key="'pending-' + index"
        @click="removePendingTag(tagName)"
        class="bg-red-100 border border-red-600 text-black px-3 py-1 rounded-full text-sm select-none flex items-center gap-1"
      >
        <span class="font-bold text-red-600">×</span>
        {{ tagName }}
      </div>
      <div
        v-if="!isCreatingNewTag"
        @click="startCreatingTag"
        class="text-black px-3 py-1 rounded-full text-sm select-none border bg-button-color text-white"
      >
        + adicionar
      </div>
      <input
        v-else
        v-model="newTagName"
        type="text"
        :style="{ width: (newTagName.length > 0 ? (newTagName.length + 3 + 'ch') : 6 + 'ch')}"
        class="bg-input-color px-3 py-1 rounded-full text-sm outline-none"
        placeholder="tag"
        @blur="saveNewTag"
        @keyup.enter="saveNewTag"
        @keyup.esc="cancelCreatingTag"
        autofocus
      />
    </div>

    <p class="font-semibold">Conteúdo *</p>
    <textarea
      id="content"
      v-model="content"
      rows="3"
      class="bg-input-color rounded-xl px-4 py-2 text-button-color mb-2 resize-y"
      placeholder="Escreva aqui seu artigo..."
      :disabled="authStore.loading"
    ></textarea>
    <div class="flex flex-col lg:flex-row lg:justify-end lg:items-center lg:gap-2 lg:absolute lg:top-0 lg:right-0">
      <p v-if="!isFormValid" class="text-red-500 text-xs lg:order-1">Preencha todas as informações obrigatórias *</p>
      <button class="bg-button-color rounded-xl px-4 py-2 text-white text-sm font-semibold disabled:opacity-50 lg:order-2" @click="editArticle" :disabled="!isFormValid || authStore.loading || loading">Salvar</button>
    </div>
  </div>
</template>

<style></style>
