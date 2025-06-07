"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { RichTextEditor } from "@/components/rich-text-editor"
import { ImageUpload } from "@/components/image-upload"
import { LoadingSpinner } from "@/components/loading-spinner"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"

export default function EditNewsPage() {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    headline: "",
    summary: "",
    content: "",
    image: "",
    featured_news: false,
    publish_immediately: false,
  })

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", params.id)
        .single()

      if (error) {
        console.error("Error fetching news:", error)
      } else {
        setFormData({
          headline: data.headline,
          summary: data.summary || "",
          content: data.content || "",
          image: data.image || "",
          featured_news: data.featured_news || false,
          publish_immediately: data.publish_immediately || false,
        })
      }
      setIsLoading(false)
    }

    fetchNews()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await supabase
      .from("news")
      .update({
        headline: formData.headline,
        summary: formData.summary,
        content: formData.content,
        image: formData.image,
        featured_news: formData.featured_news,
        publish_immediately: formData.publish_immediately,
      })
      .eq("id", params.id)

    if (error) {
      console.error("Update error:", error)
      toast.error("Failed to update news article")
    } else {
      router.push("/news")
      toast.success("News article updated successfully")
    }

    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this news article?")) {
      setIsLoading(true)
      const { error } = await supabase.from("news").delete().eq("id", params.id)
      if (!error) router.push("/news")
      else console.error("Delete error:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/news">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Edit News Article</h1>
          <p className="text-muted-foreground">Update your news article content and settings</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>News Content</CardTitle>
                <CardDescription>Update the main content for your news article</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    placeholder="Enter news headline..."
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    placeholder="Brief summary..."
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    rows={3}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Full Article</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="Write the complete article here..."
                    rows={15}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
                <CardDescription>Upload a featured image</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.image}
                  onChange={(image) => setFormData({ ...formData, image })}
                  placeholder="Upload image"
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>News Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured_news">Featured News</Label>
                  <Switch
                    id="featured_news"
                    checked={formData.featured_news}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured_news: checked })}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="publish_immediately">Published Immediately</Label>
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update News
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" className="w-full" disabled={isLoading}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button type="button" variant="outline" className="w-full" asChild>
                  <Link href={`/news/${params.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View News
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

// ✅ Required for static export of dynamic route [id]
export async function generateStaticParams() {
  const { data, error } = await supabase.from("news").select("id")

  if (error || !data) {
    console.error("Error fetching static params:", error)
    return []
  }

  return data.map((item) => ({
    id: item.id.toString(), // ensure ID is a string
  }))
}
