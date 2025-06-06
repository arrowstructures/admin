"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Eye, Calendar, AlertTriangle } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockNews = {
  id: 1,
  title: "Arrow Structures Wins Industry Excellence Award",
  content: `Arrow Structures has been honored with the prestigious Industry Excellence Award for 2024, recognizing our commitment to innovative construction solutions and sustainable building practices.

This award acknowledges our team's dedication to pushing the boundaries of what's possible in modern construction. Over the past year, we have completed several groundbreaking projects that showcase our expertise in sustainable architecture and cutting-edge building technologies.

The award ceremony took place at the National Construction Conference, where industry leaders gathered to celebrate achievements in construction innovation. Our CEO expressed gratitude to the entire team for their hard work and dedication to excellence.

This recognition reinforces our position as a leader in the construction industry and motivates us to continue delivering exceptional results for our clients.`,
  summary:
    "Arrow Structures receives prestigious industry award for excellence in construction and sustainable building practices.",
  status: "Published",
  date: "2024-01-16",
  views: 3200,
  priority: "High",
  category: "Awards & Recognition",
  featured: true,
  featuredImage: "/placeholder.svg?height=300&width=600",
}

export default function ViewNewsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/news">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{mockNews.title}</h1>
          <p className="text-muted-foreground">View and manage news article details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/news/${params.id}/edit`}>
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
                  <CardTitle>{mockNews.title}</CardTitle>
                  <CardDescription>{mockNews.summary}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={mockNews.status === "Published" ? "default" : "secondary"}>{mockNews.status}</Badge>
                  <Badge variant={mockNews.priority === "High" ? "destructive" : "secondary"}>
                    {mockNews.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {mockNews.featuredImage && (
                <div className="mb-6">
                  <img
                    src={mockNews.featuredImage || "/placeholder.svg"}
                    alt={mockNews.title}
                    className="w-full h-64 object-cover rounded-md"
                  />
                </div>
              )}
              <div className="prose max-w-none">
                {mockNews.content.split("\n\n").map((paragraph, index) => (
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
              <CardTitle>News Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Published: {mockNews.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Views: {mockNews.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Priority: </span>
                <Badge variant={mockNews.priority === "High" ? "destructive" : "secondary"}>{mockNews.priority}</Badge>
              </div>
              <div>
                <span className="text-sm font-medium">Category: </span>
                <Badge variant="outline">{mockNews.category}</Badge>
              </div>
              <div>
                <span className="text-sm font-medium">Featured: </span>
                <Badge variant={mockNews.featured ? "default" : "secondary"}>{mockNews.featured ? "Yes" : "No"}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" asChild>
                <Link href={`/news/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit News
                </Link>
              </Button>
              <Button variant="outline" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Preview Live
              </Button>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete News
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
