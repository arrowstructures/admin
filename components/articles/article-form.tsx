"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CATEGORIES, STATUSES } from "@/lib/constants"
import { useArticles, generateSlug } from "@/hooks/use-articles"
import { toast } from "sonner"
import type { ArticleClient } from "@/types/article"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/ui/image-upload"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { ArticlePreview } from "@/components/articles/article-preview"
import { Eye } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/providers/supabase-auth-provider"

interface ArticleFormProps {
  article?: ArticleClient
}

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter()
  const { addArticle, updateArticle } = useArticles()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    category: "",
    status: "draft" as "published" | "draft" | "scheduled",
    isBreaking: false,
    thumbnailPath: null as string | null,
  })

  // Track if slug has been manually edited
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  // Store the original thumbnail path for cleanup
  const [originalThumbnailPath, setOriginalThumbnailPath] = useState<string | null>(null)

  // If article is provided, populate the form
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        slug: article.slug,
        content: article.content || "",
        category: article.category,
        status: article.status,
        isBreaking: article.isBreaking,
        thumbnailPath: article.thumbnailPath,
      })
      setOriginalThumbnailPath(article.thumbnailPath)
      // Reset the slug manually edited flag when a new article is loaded
      setSlugManuallyEdited(false)
    }
  }, [article]) // Only re-run if the article changes

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // If title changes and slug hasn't been manually edited, update slug
    if (field === "title" && !slugManuallyEdited) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value as string) }))
    }

    // If slug is being edited directly, mark it as manually edited
    if (field === "slug") {
      setSlugManuallyEdited(true)
    }
  }

  const handleContentChange = (html: string) => {
    setFormData((prev) => ({ ...prev, content: html }))
  }

  const handleThumbnailPathChange = (path: string | null) => {
    setFormData((prev) => ({ ...prev, thumbnailPath: path }))

    // If the path is null and there was an error, show a toast with instructions
    if (path === null && !originalThumbnailPath) {
      toast.error("Storage issue", {
        description: "Make sure the 'articles' storage bucket exists in your Supabase project.",
      })
    }
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.slug || !formData.category) {
      toast.error("Validation Error", {
        description: "Please fill in all required fields",
      })
      return
    }

    if (!user) {
      toast.error("Authentication Error", {
        description: "You must be logged in to save an article",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Use the user's email as the author
      const authorData = {
        ...formData,
        author: user.email || "Unknown Author",
      }

      if (article) {
        // Update existing article
        await updateArticle(article.id, authorData, originalThumbnailPath)
        toast.success("Article updated", {
          description: "The article has been successfully updated.",
        })
      } else {
        // Add new article
        await addArticle(authorData)
        toast.success("Article created", {
          description: "The article has been successfully created.",
        })
      }

      // Redirect to articles list
      router.push("/articles")
    } catch (error) {
      console.error("Error saving article:", error)
      toast.error("Failed to save article", {
        description: "Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Find the category label for the selected category
  const getCategoryLabel = (categoryValue: string) => {
    const category = CATEGORIES.find((c) => c.value === categoryValue)
    return category ? category.label : categoryValue
  }

  // Create a preview article object with current form data
  const previewArticle: Partial<ArticleClient> = {
    ...formData,
    author: user?.email || "Unknown Author",
    categoryLabel: formData.category ? getCategoryLabel(formData.category) : "",
    thumbnail: formData.thumbnailPath
      ? supabase.storage.from("articles").getPublicUrl(formData.thumbnailPath).data.publicUrl
      : null,
    createdAt: new Date(),
    views: article?.views || 0,
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">{article ? "Edit Article" : "Create New Article"}</h2>
        <ArticlePreview
          article={previewArticle}
          trigger={
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="h-4 w-4" /> Preview
            </Button>
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input id="title" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">
          Slug <span className="text-red-500">*</span>
        </Label>
        <Input id="slug" value={formData.slug} onChange={(e) => handleChange("slug", e.target.value)} required />
        <p className="text-sm text-muted-foreground">
          The slug is used in the URL of your article. It should be unique and contain only lowercase letters, numbers,
          and hyphens.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail">Thumbnail Image</Label>
        <ImageUpload
          value={previewArticle.thumbnail}
          onChange={() => {}} // This is handled by onPathChange
          onPathChange={handleThumbnailPathChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <RichTextEditor value={formData.content} onChange={handleContentChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange("status", value as "published" | "draft" | "scheduled")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="block mb-2">Options</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="breaking"
            checked={formData.isBreaking}
            onCheckedChange={(checked) => handleChange("isBreaking", checked as boolean)}
          />
          <Label htmlFor="breaking">Mark as breaking news</Label>
        </div>
      </div>

      <div className="pt-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={() => router.push("/articles")}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : article ? "Update Article" : "Create Article"}
        </Button>
      </div>
    </div>
  )
}
