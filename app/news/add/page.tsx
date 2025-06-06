"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { RichTextEditor } from "@/components/rich-text-editor"
import { ImageUpload } from "@/components/image-upload"
import { LoadingSpinner } from "@/components/loading-spinner"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function AddNewsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    headline: "",
    summary: "",
    content: "",
    image: "",
    featured_news: false,
    publish_immediately: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  const { data, error } = await supabase.from("news").insert([formData])

  if (error) {
    console.error("Error inserting news:", error)
    toast.error("Failed to save news. Please try again.")
  } else {
    router.push("/news");
    toast.success("News saved successfully!")
    // Optional: Reset form
    setFormData({
      headline: "",
      summary: "",
      content: "",
      image: "",
      featured_news: false,
      publish_immediately: false,
    })
  }

  setIsLoading(false)
}

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/news">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add News Article</h1>
          <p className="text-muted-foreground">Create a new news article or announcement</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>News Content</CardTitle>
                <CardDescription>Enter the main content for your news article</CardDescription>
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
                    placeholder="Brief summary of the news..."
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
                    placeholder="Write the complete news article here..."
                    rows={15}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
                <CardDescription>Upload a featured image for your news article</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.image}
                  onChange={(img) => setFormData({ ...formData, image: img })}
                  placeholder="Upload news featured image"
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>News Settings</CardTitle>
                <CardDescription>Configure news article settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured_news">Featured Article</Label>
                  <Switch
                    id="featured_news"
                    checked={formData.featured_news}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured_news: checked })}
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
                      Save News
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
