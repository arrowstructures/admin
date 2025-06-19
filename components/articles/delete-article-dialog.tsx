"use client"

import { useState } from "react"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { useArticles } from "@/hooks/use-articles"
import { toast } from "sonner"
import type { ArticleClient } from "@/types/article"

interface DeleteArticleDialogProps {
  article: ArticleClient
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
}

export function DeleteArticleDialog({ article, open, onOpenChange, onDeleted }: DeleteArticleDialogProps) {
  const { deleteArticle } = useArticles()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteArticle(article.id)
      toast.success("Article deleted", {
        description: "The article has been successfully deleted.",
      })
      onOpenChange(false)
      if (onDeleted) {
        onDeleted()
      }
    } catch (error) {
      console.error("Error deleting article:", error)
      toast.error("Failed to delete article", {
        description: "Please try again.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Article"
      description={`Are you sure you want to delete "${article.title}"? This action cannot be undone.`}
      onConfirm={handleDelete}
      confirmText="Delete"
      cancelText="Cancel"
      variant="danger"
      isLoading={isDeleting}
    />
  )
}
