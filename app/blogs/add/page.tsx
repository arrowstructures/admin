"use client"

import React, { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient" // Import supabase client

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { RichTextEditor } from "@/components/rich-text-editor"
import { ImageUpload } from "@/components/image-upload"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function AddBlogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "", // store category id here
    tag: "",
    image: "",
    featured_post: false,
    publish_immediately: false,
  })

  useEffect(() => {
    // Fetch categories from Supabase table 'categories'
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("blogs_category")
        .select("id, name")
        .order("name", { ascending: true })

      if (error) {
        console.error("Error fetching categories:", error)
      } else {
        setCategories(data ?? [])
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  const { data, error } = await supabase
    .from("blogs")
    .insert([
      {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        tag: formData.tag,
        image: formData.image,
        featured_post: formData.featured_post,
        publish_immediately: formData.publish_immediately,
      },
    ])

  if (error) {
    console.error("Error saving blog:", error)
    toast.error("Failed to save blog. Please try again.")
  } else {
    console.log("Blog saved:", data)
    router.push("/blogs") // Redirect to blogs list after saving
    toast.success("Blog saved successfully!")
    // Optionally reset form here
  }

  setIsLoading(false)
}

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/blogs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Blog</h1>
          <p className="text-muted-foreground">Create a new blog post for your website</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Content</CardTitle>
                <CardDescription>Enter the main content for your blog post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter blog title..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief description of the blog post..."
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Content</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="Write your blog content here..."
                    rows={15}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
                <CardDescription>Upload a featured image for your blog post</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.image}
                  onChange={(featuredImage) => setFormData({ ...formData, image: featuredImage })}
                  placeholder="Upload blog featured image"
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Settings</CardTitle>
                <CardDescription>Configure blog post settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                    <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <SelectItem value="loading" disabled>
                          Loading categories...
                        </SelectItem>
                      ) : (
                        categories.map((category) => (
                          // Make sure value is not empty
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tag">Tags</Label>
                  <Input
                    id="tag"
                    placeholder="Enter tags separated by commas"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="featured_post">Featured Post</Label>
                  <Switch
                    id="featured_post"
                    checked={formData.featured_post}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured_post: checked })}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="publish_immediately">Publish Immediately</Label>
                  <Switch
                    id="publish_immediately"
                    checked={formData.publish_immediately}
                    onCheckedChange={(checked) => setFormData({ ...formData, publish_immediately: checked })}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Blog
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" className="w-full" disabled={isLoading}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
