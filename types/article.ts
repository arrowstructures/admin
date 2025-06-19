export interface Article {
  id: string
  title: string
  slug: string
  content: string | null
  thumbnail_path: string | null
  category: string
  author: string
  views: number
  status: "published" | "draft" | "scheduled"
  is_breaking: boolean
  created_at: string
  user_id: string
}

// For client-side use (with camelCase properties)
export interface ArticleClient {
  id: string
  title: string
  slug: string
  content: string | null
  thumbnailPath: string | null
  thumbnail: string | null // Derived from thumbnailPath
  category: string
  categoryLabel: string // Derived from category
  author: string
  views: number
  status: "published" | "draft" | "scheduled"
  isBreaking: boolean
  createdAt: Date
  userId: string
}
