"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { formatTimeAgo } from "@/lib/utils"
import type { ArticleClient } from "@/types/article"

interface ArticlePreviewProps {
  article: Partial<ArticleClient>
  trigger?: React.ReactNode
}

export function ArticlePreview({ article, trigger }: ArticlePreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Use current date for preview if not provided
  const createdAt = article.createdAt || new Date()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-4 w-4" /> Preview
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Article Preview</DialogTitle>
        </DialogHeader>
        <div className="article-preview mt-4">
          {/* Article Header */}
          <div className="mb-6">
            {article.isBreaking && <Badge className="bg-red-500 hover:bg-red-600 mb-3">Breaking News</Badge>}
            <h1 className="text-3xl font-bold mb-2">{article.title || "Untitled Article"}</h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>By {article.author || "Unknown Author"}</span>
              <span className="mx-2">•</span>
              <span>{formatTimeAgo(createdAt)}</span>
              {article.category && (
                <>
                  <span className="mx-2">•</span>
                  <span>{article.categoryLabel || article.category}</span>
                </>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {article.thumbnail && (
            <div className="relative w-full h-[300px] mb-6 rounded-lg overflow-hidden">
              <Image
                src={article.thumbnail || "/placeholder.svg"}
                alt={article.title || "Article thumbnail"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content || "<p>No content</p>" }}
          />

          {/* Article Footer */}
          <div className="mt-8 pt-4 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Status: <Badge variant="outline">{article.status || "Draft"}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">Views: {article.views || 0}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
