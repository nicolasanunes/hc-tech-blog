import axios, { type AxiosInstance } from 'axios'
import type { Tag } from '@/types/tag'
import type {
  Article,
  ArticleWithComments,
  PaginatedArticles,
  SearchArticlesParams,
} from '@/types/article'

// Cria instância do axios com configuração base
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Envia cookies automaticamente
  paramsSerializer: {
    indexes: null, // Para arrays: ?tagIds=1&tagIds=2 ao invés de ?tagIds[0]=1&tagIds[1]=2
  },
})

// Flag para prevenir múltiplas tentativas de refresh simultâneas
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })

  failedQueue = []
}

// Interceptor de resposta: se erro 401, tenta dar refresh no token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Se erro 401 em rota autenticada
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth')
    ) {
      if (isRefreshing) {
        // Se já está fazendo refresh, adiciona requisição à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Tenta fazer refresh do token (o refresh token está no cookie HttpOnly)
        await api.post('/auth/refresh-token')

        // Processa fila de requisições pendentes
        processQueue(null)

        isRefreshing = false

        // Retenta a requisição original
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh falhou, faz logout
        processQueue(refreshError as Error)
        isRefreshing = false

        window.location.href = '/login'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// API de listar as tags
export const getTags = async (): Promise<Tag[]> => {
  const response = await api.get<Tag[]>('/tags')
  return response.data
}

// API de criar uma nova ta
export const createTag = async (name: string): Promise<Tag> => {
  const response = await api.post<Tag>('/tags', { name })
  return response.data
}

// API de listar artigos
export const searchArticles = async (params?: SearchArticlesParams): Promise<PaginatedArticles> => {
  const response = await api.get<PaginatedArticles>('/articles/search', { params })
  return response.data
}

// API de criar artigo
export const createArticle = async (params: {
  title: string
  content: string
  tagIds: number[]
  articlePicture?: string
}): Promise<Article> => {
  const response = await api.post<Article>('/articles', params)
  return response.data
}

// API de buscar artigo
export const getArticle = async (id: string | number): Promise<Article> => {
  const response = await api.get<Article>(`/articles/${id}`)
  return response.data
}

// API de buscar artigo com comentários
export const getArticleWithComments = async (id: string): Promise<ArticleWithComments> => {
  const response = await api.get<ArticleWithComments>(`/articles/${id}/article-with-comments`)
  return response.data
}

// API de editar artigo
export const updateArticle = async (
  id: string | number,
  params: { title?: string; content?: string; tagIds?: number[]; articlePicture?: string },
): Promise<Article> => {
  const response = await api.patch<Article>(`/articles/${id}`, params)
  return response.data
}

// API de criar comentário
export const createComment = async (params: {
  articleId: number
  content: string
  parentCommentId?: number
}): Promise<void> => {
  await api.post('/comments/create-comment-on-article', params)
}

// API de deletar comentário
export const deleteComment = async (commentId: number): Promise<void> => {
  await api.delete(`/comments/delete-comment/${commentId}`)
}

export default api
