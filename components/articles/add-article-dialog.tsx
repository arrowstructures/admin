"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CATEGORIES, STATUSES } from "@/lib/constants"
import { useArticles } from "@/hooks/use-articles"
import { toast } from "@/components/ui/use-toast"

interface AddArticleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddArticleDialog({ open, onOpenChange }: AddArticleDialogProps) {
  const { addArticle } = useArticles()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    categoryLabel: "",
    author: "",
    status: "draft" as "published" | "draft" | "scheduled",
    isBreaking: false,
    thumbnail: "/placeholder-k3nht.png", // Default thumbnail
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // If category changes, update categoryLabel
    if (field === "category") {
      const category = CATEGORIES.find((c) => c.value === value)
      if (category) {
        setFormData((prev) => ({ ...prev, categoryLabel: category.label }))
      }
    }
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.category || !formData.author) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await addArticle(formData)
      toast({
        title: "Success",
        description: "Article added successfully",
      })
      onOpenChange(false)
      // Reset form
      setFormData({
        title: "",
        content: "",
        category: "",
        categoryLabel: "",
        author: "",
        status: "draft",
        isBreaking: false,
        thumbnail: "/placeholder-k3nht.png",
      })
    } catch (error) {
      console.error("Error adding article:", error)
      toast({
        title: "Error",
        description: "Failed to add article",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Article</DialogTitle>
          <DialogDescription>Create a new article to publish on your newsletter.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              className="col-span-3"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Content
            </Label>
            <Textarea
              id="content"
              className="col-span-3"
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger className="col-span-3">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right">
              Author <span className="text-red-500">*</span>
            </Label>
            <Input
              id="author"
              className="col-span-3"
              value={formData.author}
              onChange={(e) => handleChange("author", e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value as "published" | "draft" | "scheduled")}
            >
              <SelectTrigger className="col-span-3">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-right">
              <Label htmlFor="breaking">Breaking</Label>
            </div>
            <div className="flex items-center space-x-2 col-span-3">
              <Checkbox
                id="breaking"
                checked={formData.isBreaking}
                onCheckedChange={(checked) => handleChange("isBreaking", checked as boolean)}
              />
              <Label htmlFor="breaking">Mark as breaking news</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Article"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
