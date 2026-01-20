<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleWithComments, createComment as createCommentApi, deleteComment as deleteCommentApi } from '@/services/api'
import type { ArticleWithComments } from '@/types/article'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const content = ref<string>('')
const replyingToCommentId = ref<string | null>(null)
const replyContent = ref<string>('')
const expandedComments = ref<Set<string>>(new Set())

const route = useRoute()
const loading = ref(false)
const error = ref<string | null>(null)
const article = ref<ArticleWithComments | null>(null)

const topLevelComments = computed(() => {
  const filtered = article.value?.comments.filter(comment => !comment.parentComment) || []
  return filtered
})

const getChildComments = (parentCommentId: string) => {
  const children = article.value?.comments.filter(comment => comment.parentComment?.id === parentCommentId) || []

  // Ordenar do mais antigo para o mais novo
  const sortedChildren = [...children].sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  // Se expandido ou tem 2 ou menos, mostrar todos
  if (expandedComments.value.has(parentCommentId) || sortedChildren.length <= 2) {
    return sortedChildren
  }

  // Caso contrário, mostrar apenas as 2 mais recentes
  return sortedChildren.slice(-2)
}

const hasHiddenReplies = (parentCommentId: string) => {
  const children = article.value?.comments.filter(comment => comment.parentComment?.id === parentCommentId) || []
  return children.length > 2 && !expandedComments.value.has(parentCommentId)
}

const showAllReplies = (parentCommentId: string) => {
  expandedComments.value.add(parentCommentId)
}

const fetchArticleWithComments = async () => {
  loading.value = true
  error.value = null

  try {
    const id = route.params.id as string
    article.value = await getArticleWithComments(id)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao carregar artigo'
    console.error('Erro ao buscar artigo:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticleWithComments()
})

const getDaysAgo = (dateString: string): string => {
  const createdDate = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - createdDate.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  // Se o tempo da publicação for negativo ou zero, mostrar "Hoje"
  if (diffInDays <= 0) {
    return 'Hoje'
  }

  return `${diffInDays}d`
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const createComment = async () => {
  if (!content.value.trim() || !article.value) return

  try {
    await createCommentApi({
      articleId: Number(article.value.article.id),
      content: content.value.trim(),
    })

    content.value = ''
    await fetchArticleWithComments()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao criar comentário'
    console.error('Erro ao criar comentário:', err)
  }
}

const startReply = (commentId: string, authorName: string) => {
  replyingToCommentId.value = commentId
  replyContent.value = `@${authorName} `
}

const cancelReply = () => {
  replyingToCommentId.value = null
  replyContent.value = ''
}

const sendReply = async (parentCommentId: string) => {
  if (!replyContent.value.trim() || !article.value) return

  try {
    await createCommentApi({
      articleId: Number(article.value.article.id),
      content: replyContent.value.trim(),
      parentCommentId: Number(parentCommentId),
    })

    cancelReply()
    await fetchArticleWithComments()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao criar comentário'
    console.error('Erro ao criar comentário:', err)
  }
}

const deleteComment = async (commentId: string) => {
  if (!confirm('Tem certeza que deseja deletar este comentário?')) {
    return
  }

  try {
    await deleteCommentApi(Number(commentId))
    await fetchArticleWithComments()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao deletar comentário'
    console.error('Erro ao deletar comentário:', err)
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Mobile: título sozinho -->
    <p class="text-4xl font-semibold mb-2 lg:hidden">{{ article?.article.title }}</p>

    <!-- Desktop: título e tags na mesma linha -->
    <div class="hidden lg:flex lg:flex-row lg:items-center lg:flex-wrap lg:gap-2 lg:mb-2">
      <p class="text-4xl font-semibold">{{ article?.article.title }}</p>
      <div v-for="tag in article?.article.tags" :key="tag.id" class="bg-input-color border border-button-color text-black px-3 py-1 rounded-full text-sm select-none">{{ tag.name }}</div>
    </div>

    <p class="text-gray-600">Publicado por {{ article?.article.author.name }} · {{ article?.article.createdAt ? formatDate(article.article.createdAt) : '' }}</p>

    <!-- Mobile: tags abaixo da data -->
    <div class="flex flex-wrap gap-2 mb-2 lg:hidden">
      <div v-for="tag in article?.article.tags" :key="tag.id" class="bg-input-color border border-button-color text-black px-3 py-1 rounded-full text-sm select-none">{{ tag.name }}</div>
    </div>

    <p class="mb-2">{{ article?.article.content }}</p>
    <p class="font-semibold">Comentários</p>
    <textarea
      id="content"
      v-model="content"
      rows="3"
      class="bg-input-color rounded-xl px-4 py-2 text-button-color mb-2 resize-y"
      placeholder="Escreva um comentário..."
      :disabled="authStore.loading"
    ></textarea>
    <button class="bg-button-color rounded-xl px-4 py-2 text-white text-sm font-semibold self-start disabled:opacity-50 mb-2" @click="createComment" :disabled="authStore.loading">Comentar</button>
    <div class="grid grid-cols-1 gap-4">
      <div class="mb-2" v-for="comment in topLevelComments" :key="comment.id">
        <div class="flex flex-row">
          <div class="flex-shrink-0 mr-4">
            <img
              v-if="comment.author.profilePicture"
              :src="comment.author.profilePicture"
              :alt="comment.author.name"
              class="w-10 h-10 object-cover rounded-full"
            />
            <img
              v-else
              src="https://plus.unsplash.com/premium_vector-1727956885330-0b80b9df0fc7?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              :alt="comment.author.name"
              class="w-10 h-10 object-cover rounded-full"
            />
          </div>
          <div>
            <div class="mr-4">
              <p class="inline font-bold mr-2">{{ comment.author.name }}</p>
              <p class="inline-block text-gray-400 text-sm">{{ getDaysAgo(comment.createdAt) }}</p>
              <p>
                {{ comment.content }}
              </p>
              <div>
                <svg
                  @click="startReply(comment.id, comment.author.name)"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-reply-icon lucide-reply text-gray-600 cursor-pointer"
                >
                <path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
                <path d="m9 17-5-5 5-5"/>
              </svg>
              </div>
            </div>
          </div>
          <div v-if="authStore.user?.id === comment.author.id" class="ml-auto">
            <svg
              @click="deleteComment(comment.id)"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-trash2-icon lucide-trash-2 text-gray-600 cursor-pointer"
            >
            <path d="M10 11v6"/>
            <path d="M14 11v6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
            <path d="M3 6h18"/>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          </div>
        </div>

        <!-- Campo de resposta do artigo -->
        <div v-if="replyingToCommentId === comment.id" class="ml-12 mt-2 flex">
          <textarea
            v-model="replyContent"
            rows="2"
            class="bg-input-color rounded-l-xl px-4 py-2 text-button-color resize-y flex-1"
            placeholder="Escreva sua resposta..."
            :disabled="authStore.loading"
          ></textarea>
          <div class="flex flex-col">
            <button
              @click="cancelReply"
              class="bg-red-500 text-white rounded-tr-xl px-2 py-2"
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
                class="lucide lucide-circle-x-icon lucide-circle-x"
              >
              <circle cx="12" cy="12" r="10"/>
              <path d="m15 9-6 6"/>
              <path d="m9 9 6 6"/>
            </svg>
            </button>
            <button
              @click="sendReply(comment.id)"
              class="bg-button-color rounded-br-xl px-2 py-2 text-white disabled:opacity-50"
              :disabled="authStore.loading || !replyContent.trim()"
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
                class="lucide lucide-send-icon lucide-send"
              >
              <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>
              <path d="m21.854 2.147-10.94 10.939"/>
            </svg>
            </button>
          </div>
        </div>

        <!-- Comentários filhos (respostas de comentários) -->
        <div v-if="getChildComments(comment.id).length > 0 || hasHiddenReplies(comment.id)" class="ml-12 mt-2">
          <div v-for="childComment in getChildComments(comment.id)" :key="childComment.id" class="mt-2">
          <div class="flex flex-row">
            <div class="flex-shrink-0 mr-4">
              <img
                v-if="childComment.author.profilePicture"
                :src="childComment.author.profilePicture"
                :alt="childComment.author.name"
                class="w-10 h-10 object-cover rounded-full"
              />
              <img
                v-else
                src="https://plus.unsplash.com/premium_vector-1727956885330-0b80b9df0fc7?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                :alt="childComment.author.name"
                class="w-10 h-10 object-cover rounded-full"
              />
            </div>
            <div>
              <div class="mr-4">
                <p class="inline font-bold mr-2">{{ childComment.author.name }}</p>
                <p class="inline-block text-gray-400 text-sm">{{ getDaysAgo(childComment.createdAt) }}</p>
                <p>
                  {{ childComment.content }}
                </p>
              </div>
            </div>
            <div v-if="authStore.user?.id === childComment.author.id" class="ml-auto">
              <svg
                @click="deleteComment(childComment.id)"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-trash2-icon lucide-trash-2 text-gray-600 cursor-pointer"
              >
              <path d="M10 11v6"/>
              <path d="M14 11v6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
              <path d="M3 6h18"/>
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            </div>
          </div>
          </div>

          <!-- Botão "Ver mais comentários" -->
          <button
            v-if="hasHiddenReplies(comment.id)"
            @click="showAllReplies(comment.id)"
            class="text-button-color text-sm font-semibold mt-2 hover:underline"
          >
            Ver mais comentários
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
