"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Eye, Calendar } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockBlog = {
  id: 1,
  title: "Modern Construction Techniques in 2024",
  content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
  excerpt: "Exploring the latest construction techniques and technologies that are shaping the industry in 2024.",
  status: "Published",
  date: "2024-01-15",
  views: 1250,
  category: "Construction",
  tags: ["construction", "technology", "innovation", "2024"],
  featured: true,
  featuredImage: "/placeholder.svg?height=300&width=600",
}

export default function ViewBlogPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/blogs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{mockBlog.title}</h1>
          <p className="text-muted-foreground">View and manage blog post details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/blogs/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{mockBlog.title}</CardTitle>
                  <CardDescription>{mockBlog.excerpt}</CardDescription>
                </div>
                <Badge variant={mockBlog.status === "Published" ? "default" : "secondary"}>{mockBlog.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {mockBlog.featuredImage && (
                <div className="mb-6">
                  <img
                    src={mockBlog.featuredImage || "/placeholder.svg"}
                    alt={mockBlog.title}
                    className="w-full h-64 object-cover rounded-md"
                  />
                </div>
              )}
              <div className="prose max-w-none">
                {mockBlog.content.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 text-sm leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Published: {mockBlog.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Views: {mockBlog.views.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Category: </span>
                <Badge variant="outline">{mockBlog.category}</Badge>
              </div>
              <div>
                <span className="text-sm font-medium">Featured: </span>
                <Badge variant={mockBlog.featured ? "default" : "secondary"}>{mockBlog.featured ? "Yes" : "No"}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockBlog.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" asChild>
                <Link href={`/blogs/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Blog
                </Link>
              </Button>
              <Button variant="outline" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Preview Live
              </Button>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Blog
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
