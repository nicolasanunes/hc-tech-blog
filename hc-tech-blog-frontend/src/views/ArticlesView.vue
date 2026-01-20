<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getTags, searchArticles } from '@/services/api'
import type { Tag } from '@/types/tag'
import type { PaginatedArticles } from '@/types/article'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const tagsArray = ref<Tag[]>([])
const articlesArray = ref<PaginatedArticles | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const searchTitle = ref('')
const selectedTagIds = ref<number[]>([])
let searchTimeout: ReturnType<typeof setTimeout> | null = null
let tagTimeout: ReturnType<typeof setTimeout> | null = null

const fetchTags = async () => {
  loading.value = true
  error.value = null

  try {
    tagsArray.value = await getTags()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao carregar tags'
    console.error('Erro ao buscar tags:', err)
  } finally {
    loading.value = false
  }
}

const fetchArticles = async () => {
  loading.value = true
  error.value = null

  try {
    const searchParams: { page: number; title?: string; tagIds?: number[] } = {
      page: currentPage.value,
    }

    // Adiciona title se houver
    if (searchTitle.value.trim()) {
      searchParams.title = searchTitle.value.trim()
    }

    // Adiciona tagIds se houver tags selecionadas
    if (selectedTagIds.value.length > 0) {
      searchParams.tagIds = [...selectedTagIds.value]
    }

    articlesArray.value = await searchArticles(searchParams)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao carregar artigos'
    console.error('Erro ao buscar artigos:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTags()
  fetchArticles()
})

watch(searchTitle, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchArticles()
  }, 1000)
})
watch(
  selectedTagIds,
  () => {
    if (tagTimeout) clearTimeout(tagTimeout)
    tagTimeout = setTimeout(() => {
      currentPage.value = 1
      fetchArticles()
    }, 1000)
  },
  { deep: true },
)

const changePage = (pageNum: number) => {
  currentPage.value = pageNum
  fetchArticles()
}

const isCurrentPage = (pageNum: number) => {
  return currentPage.value === pageNum
}

const toggleTag = (tagId: number) => {
  const idx = selectedTagIds.value.indexOf(tagId)
  if (idx === -1) {
    selectedTagIds.value.push(tagId)
  } else {
    selectedTagIds.value.splice(idx, 1)
  }
}
</script>

<template>
  <div class="flex flex-col">
    <input
      type="text"
      v-model="searchTitle"
      class="bg-input-color rounded-xl px-4 py-2 text-button-color mb-2"
      placeholder="Pesquisar"
    />
    <div class="flex flex-wrap gap-2 mb-4">
      <div
        v-for="tag in tagsArray"
        :key="tag.id"
        @click="toggleTag(tag.id)"
        :class="[
          'bg-input-color text-black px-3 py-1 rounded-full text-sm cursor-pointer select-none',
          selectedTagIds.includes(tag.id) ? 'border border-button-color' : '',
        ]"
      >
        {{ tag.name }}
      </div>
    </div>

    <RouterLink to="/create-article" class="rounded-xl bg-button-color text-white text-sm font-semibold self-start px-4 py-2 mb-4">
      Criar artigo
    </RouterLink>

    <div class="grid grid-cols-1 gap-4">
      <div v-for="article in articlesArray?.data" :key="article.id">
        <div class="flex flex-row" @click="$router.push(`/articles/${article.id}`)">
          <div class="flex-shrink-0 mr-4">
            <img
              v-if="article.articlePicture"
              :src="article.articlePicture"
              :alt="article.title"
              class="w-22 h-22 object-cover rounded-xl"
            />
            <img
              v-else
              src="https://plus.unsplash.com/premium_vector-1718631069909-d1a5091a56ae?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              :alt="article.title"
              class="w-22 h-22 object-cover rounded-xl"
            />
          </div>
          <div>
            <div class="mr-4">
              <p class="inline font-bold">{{ article.title }}</p>
              <span
                v-for="tag in article.tags"
                :key="tag.id"
                class="inline-block bg-input-color text-xs px-1 rounded-xl ml-1"
              >
                {{ tag.name }}
              </span>
              <p class="text-gray-600 text-sm line-clamp-2">
                {{ article.content }}
              </p>
            </div>
          </div>
          <div v-if="authStore.user?.id === article.author.id" class="ml-auto">
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
              class="text-gray-600"
            >
              <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
            </svg>
          </div>
        </div>
      </div>
      <div v-if="articlesArray?.total === 0" class="text-center text-gray-600 flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-frown-icon lucide-frown mb-2"
          >
          <circle cx="12" cy="12" r="10"/>
          <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
          <line x1="9" x2="9.01" y1="9" y2="9"/>
          <line x1="15" x2="15.01" y1="9" y2="9"/>
        </svg>
        Nenhum artigo encontrado
      </div>
    </div>
    <nav v-if="articlesArray" class="flex justify-center items-center gap-2 mt-4">
      <span v-for="pageNum in articlesArray.totalPages" :key="pageNum">
        <button
          @click="changePage(pageNum)"
          :class="[
            'px-3 py-1 rounded-full',
            isCurrentPage(pageNum) ? 'bg-input-color font-bold' : '',
          ]"
        >
          {{ pageNum }}
        </button>
      </span>
    </nav>
  </div>
</template>

<style></style>
