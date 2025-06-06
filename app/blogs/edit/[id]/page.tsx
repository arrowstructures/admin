"use client"

import React, { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

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
import { useParams, useRouter, useSearchParams } from "next/navigation"

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const blogId = params.id // Assuming URL like /blogs/edit?id=123

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
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

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
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

  // Fetch blog data by id on mount
  useEffect(() => {
    if (!blogId) return

    async function fetchBlog() {
      setIsFetching(true)
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", blogId)
        .single()

      if (error) {
        console.error("Error fetching blog:", error)
        toast.error("Failed to load blog data.")
      } else if (data) {
        setFormData({
          title: data.title || "",
          content: data.content || "",
          excerpt: data.excerpt || "",
          category: data.category || "",
          tag: data.tag || "",
          image: data.image || "",
          featured_post: data.featured_post || false,
          publish_immediately: data.publish_immediately || false,
        })
      }
      setIsFetching(false)
    }

    fetchBlog()
  }, [blogId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!blogId) {
      toast.error("Invalid blog ID.")
      return
    }
    setIsLoading(true)

    const { data, error } = await supabase
      .from("blogs")
      .update({
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        tag: formData.tag,
        image: formData.image,
        featured_post: formData.featured_post,
        publish_immediately: formData.publish_immediately,
      })
      .eq("id", blogId)

    if (error) {
      console.error("Error updating blog:", error)
      toast.error("Failed to update blog. Please try again.")
    } else {
      toast.success("Blog updated successfully!")
      router.push("/blogs")
    }

    setIsLoading(false)
  }

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
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
          <h1 className="text-3xl font-bold tracking-tight">Edit Blog</h1>
          <p className="text-muted-foreground">Update your blog post</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Content</CardTitle>
                <CardDescription>Update the main content for your blog post</CardDescription>
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
                <CardDescription>Update the featured image for your blog post</CardDescription>
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
                <CardTitle>Preview</CardTitle>
                <CardDescription>Preview your blog post before saving</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href={`/blogs/view/${blogId}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline underline-offset-4">
                  <Eye className="h-4 w-4" /> Preview Blog Post
                </Link>
              </CardContent>
            </Card>

            <Button type="submit" disabled={isLoading} className="w-full" size="lg" variant="default">
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
