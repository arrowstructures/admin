"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Search, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"

type News = {
  id: string;
  headline: string;
  summary: string;
  content: string;
  image: string;
}
export default function NewsPage() {
    const [news, setNews] = useState<News[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch news from Supabase
  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase.from("news").select("*")

      if (error) {
        console.error("Error fetching news:", error.message)
      } else {
        setNews(data as News[])
      }
    }

    fetchNews()
  }, [])

    const handleDelete = async (id: string) => {
    const { error } = await supabase.from("news").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete news.");
      console.error("Delete error:", error);
    } else {
      toast.success("News deleted successfully!");
      setNews((prev) => prev.filter((project) => project.id !== id)); // client-side update
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News</h1>
          <p className="text-muted-foreground">Manage company news and announcements</p>
        </div>
        <Button asChild>
          <Link href="/news/add">
            <Plus className="mr-2 h-4 w-4" />
            Add News
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All News Articles</CardTitle>
          <CardDescription>A list of all news articles and announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>HeadLine</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>Content</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news.map((news) => (
                <TableRow key={news.id}>
                  <TableCell className="font-medium">{news.headline}</TableCell>
                  <TableCell>{news.summary.toLocaleString()}</TableCell>
                  <TableCell>{news.content}</TableCell>
                  <TableCell>
                  <TableCell></TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/news/${news.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/news/edit/${news.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(news.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
