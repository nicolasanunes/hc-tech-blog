import type { Tag } from './tag'

export interface Author {
  id: number
  name: string
  profilePicture?: string
}

export interface ParentComment {
  id: string
  content: string
  authorId: string
  articleId: string
  parentCommentId: string | null
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  content: string
  createdAt: string
  parentComment: ParentComment | null
  author: Author
}

export interface ArticleWithComments {
  article: Article
  comments: Comment[]
}

export interface Article {
  id: number
  title: string
  content: string
  articlePicture: string
  author: Author
  createdAt: string
  tags: Tag[]
}

export interface PaginatedArticles {
  data: Article[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SearchArticlesParams {
  title?: string
  tagIds?: number[]
  page?: number
  limit?: number
}

export interface CreateArticleParams {
  title: string
  content: string
  tagIds: number[]
  articlePicture?: string
}

export interface ListArticleByid {
  id: number
  title: string
  content: string
  articlePicture: string
  tags: Tag[]
}

export interface UpdateArticleParams {
  title?: string
  content?: string
  tagIds?: number[]
  articlePicture?: string
}
