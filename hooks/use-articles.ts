"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { Article, ArticleClient } from "@/types/article"
import { deleteImage } from "@/lib/upload"
import { useAuth } from "@/providers/supabase-auth-provider"
import { CATEGORIES } from "@/lib/constants"

// Helper function to convert snake_case to camelCase and derive missing fields
const snakeToCamel = (article: Article): ArticleClient => {
  // Find the category label from the category value
  const categoryObj = CATEGORIES.find((c) => c.value === article.category)
  const categoryLabel = categoryObj ? categoryObj.label : article.category

  // Generate thumbnail URL from thumbnail_path
  const thumbnail = article.thumbnail_path
    ? supabase.storage.from("articles").getPublicUrl(article.thumbnail_path).data.publicUrl
    : null

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    content: article.content,
    thumbnailPath: article.thumbnail_path,
    thumbnail: thumbnail,
    category: article.category,
    categoryLabel: categoryLabel,
    author: article.author,
    views: article.views,
    status: article.status,
    isBreaking: article.is_breaking,
    createdAt: new Date(article.created_at),
    userId: article.user_id,
  }
}

// Helper function to convert camelCase to snake_case
const camelToSnake = (article: Partial<ArticleClient>): Partial<Article> => {
  const result: Partial<Article> = {}

  if (article.id !== undefined) result.id = article.id
  if (article.title !== undefined) result.title = article.title
  if (article.slug !== undefined) result.slug = article.slug
  if (article.content !== undefined) result.content = article.content
  if (article.thumbnailPath !== undefined) result.thumbnail_path = article.thumbnailPath
  if (article.category !== undefined) result.category = article.category
  if (article.author !== undefined) result.author = article.author
  if (article.views !== undefined) result.views = article.views
  if (article.status !== undefined) result.status = article.status
  if (article.isBreaking !== undefined) result.is_breaking = article.isBreaking
  if (article.createdAt !== undefined) result.created_at = article.createdAt.toISOString()
  if (article.userId !== undefined) result.user_id = article.userId

  return result
}

// Helper function to generate a slug from a title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function useArticles() {
  const [articles, setArticles] = useState<ArticleClient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()

  // Fetch articles from Supabase
  const fetchArticles = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("articles").select("*").order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      // Convert snake_case to camelCase and derive missing fields
      const formattedData = data.map(snakeToCamel)
      setArticles(formattedData)
    } catch (err) {
      console.error("Error fetching articles:", err)
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch a single article by slug
  const fetchArticleBySlug = useCallback(async (slug: string) => {
    try {
      const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).single()

      if (error) {
        throw error
      }

      return snakeToCamel(data)
    } catch (err) {
      console.error("Error fetching article:", err)
      throw err
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  // Add a new article
  const addArticle = useCallback(
    async (article: Omit<ArticleClient, "id" | "createdAt" | "userId">) => {
      if (!user) {
        throw new Error("User must be logged in to add an article")
      }

      try {
        // Convert camelCase to snake_case and add user_id
        const snakeCaseArticle = {
          ...camelToSnake(article),
          user_id: user.id,
        }

        const { data, error } = await supabase.from("articles").insert([snakeCaseArticle]).select()

        if (error) {
          throw error
        }

        if (data && data.length > 0) {
          // Add the new article to the state
          const newArticle = snakeToCamel(data[0])
          setArticles((prev) => [newArticle, ...prev])
          return newArticle
        }
      } catch (err) {
        console.error("Error adding article:", err)
        throw err
      }
    },
    [user],
  )

  // Update an existing article
  const updateArticle = useCallback(
    async (id: string, article: Partial<ArticleClient>, oldThumbnailPath?: string | null) => {
      if (!user) {
        throw new Error("User must be logged in to update an article")
      }

      try {
        // Convert camelCase to snake_case
        const snakeCaseArticle = camelToSnake(article)

        // Check if the article belongs to the current user
        const { data: existingArticle, error: fetchError } = await supabase
          .from("articles")
          .select("user_id")
          .eq("id", id)
          .single()

        if (fetchError) {
          throw fetchError
        }

        if (existingArticle.user_id !== user.id) {
          throw new Error("You don't have permission to update this article")
        }

        const { data, error } = await supabase.from("articles").update(snakeCaseArticle).eq("id", id).select()

        if (error) {
          throw error
        }

        // If thumbnail has changed and there was an old thumbnail, delete it
        if (oldThumbnailPath && article.thumbnailPath !== oldThumbnailPath) {
          try {
            await deleteImage(oldThumbnailPath)
          } catch (deleteError) {
            console.error("Error deleting old thumbnail:", deleteError)
            // Continue with the update even if image deletion fails
          }
        }

        if (data && data.length > 0) {
          // Update the article in the state
          const updatedArticle = snakeToCamel(data[0])
          setArticles((prev) => prev.map((a) => (a.id === id ? updatedArticle : a)))
          return updatedArticle
        }
      } catch (err) {
        console.error("Error updating article:", err)
        throw err
      }
    },
    [user],
  )

  // Delete an article
  const deleteArticle = useCallback(
    async (id: string) => {
      if (!user) {
        throw new Error("User must be logged in to delete an article")
      }

      try {
        // Check if the article belongs to the current user
        const { data: existingArticle, error: fetchError } = await supabase
          .from("articles")
          .select("user_id, thumbnail_path")
          .eq("id", id)
          .single()

        if (fetchError) {
          console.error("Error fetching article for deletion:", fetchError)
          throw fetchError
        }

        if (existingArticle.user_id !== user.id) {
          throw new Error("You don't have permission to delete this article")
        }

        // Delete the article
        const { error } = await supabase.from("articles").delete().eq("id", id)

        if (error) {
          throw error
        }

        // If the article had a thumbnail, delete it from storage
        if (existingArticle?.thumbnail_path) {
          try {
            await deleteImage(existingArticle.thumbnail_path)
          } catch (deleteError) {
            console.error("Error deleting thumbnail:", deleteError)
            // Continue with the deletion even if image deletion fails
          }
        }

        // Remove the article from the state
        setArticles((prev) => prev.filter((a) => a.id !== id))
        return true
      } catch (err) {
        console.error("Error deleting article:", err)
        throw err
      }
    },
    [user],
  )

  // Refresh articles
  const refreshArticles = useCallback(() => {
    return fetchArticles()
  }, [fetchArticles])

  return {
    articles,
    isLoading,
    error,
    addArticle,
    updateArticle,
    deleteArticle,
    refreshArticles,
    fetchArticleBySlug,
  }
}
