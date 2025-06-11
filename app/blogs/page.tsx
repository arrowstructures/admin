"use client"

import { useState, useEffect } from "react"
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

type Blog = {
  id: string
  title: string
  excerpt: string
  category: string
  tag: string
}

type Category = {
  id: number
  name: string
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      // Fetch blogs
      const { data: blogData, error: blogError } = await supabase
        .from("blogs")
        .select("id, title, excerpt, category, tag")
        .order("id", { ascending: false })

      console.log("Fetched blogs:", blogData)

      // Fetch categories
      const { data: categoryData, error: categoryError } = await supabase.from("blogs_category").select("id, name")

      if (blogError) {
        console.error("Error fetching blogs:", blogError.message)
      } else if (blogData) {
        setBlogs(blogData as Blog[])
      }

      if (categoryError) {
        console.error("Error fetching categories:", categoryError.message)
      } else if (categoryData) {
        setCategories(categoryData as Category[])
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("blogs").delete().eq("id", id) // Changed from "projects" to "blogs"

    if (error) {
      toast.error("Failed to delete blog.")
      console.error("Delete error:", error)
    } else {
      toast.success("Blog deleted successfully!")
      setBlogs((prev) => prev.filter((blog) => blog.id !== id))
    }
  }

  // Helper function to get category name by category_id
  // function getCategoryName(ca: number) {
  //   return categories.find((cat) => cat.id === category_id)?.name ?? "No category"
  // }

  // // Filter blogs based on search term including category name
  // const filteredBlogs = blogs.filter(
  //   (blog) =>
  //     blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     getCategoryName(blog.category_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     blog.tag.toLowerCase().includes(searchTerm.toLowerCase())
  // )

  return (
    <div className="space-y-6">
      {/* ... header and add blog button unchanged ... */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
          <p className="text-muted-foreground">Manage your construction blogs and track progress</p>
        </div>
        <Button asChild>
          <Link href="/blogs/add">
            <Plus className="mr-2 h-4 w-4" />
            Add blogs
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total blogs</CardTitle>
            <Badge className="bg-blue-100 text-blue-800">{blogs.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogs.length}</div>
            <p className="text-xs text-muted-foreground">All blogs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total category</CardTitle>
            <Badge className="bg-yellow-100 text-yellow-800">{blogs.filter((blog) => blog.category).length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogs.filter((blog) => blog.category).length}</div>
            <p className="text-xs text-muted-foreground">Currently category</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total tags</CardTitle>
            <Badge className="bg-green-100 text-green-800">{blogs.filter((blog) => blog.tag).length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"> {blogs.filter((blog) => blog.tag).length}</div>
            <p className="text-xs text-muted-foreground">Currently tags</p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Badge className="bg-purple-100 text-purple-800">
              {formatCurrency(totalValue)}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">Combined budget</p>
          </CardContent>
        </Card> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Blogs</CardTitle>
          <CardDescription>A list of all blog posts in your system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
                disabled={loading}
              />
            </div>
          </div>

          {loading ? (
            <p>Loading blogs...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Excerpt</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No blogs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  blogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium">{blog.title}</TableCell>
                      <TableCell>{blog.excerpt}</TableCell>
                      <TableCell>{blog.category}</TableCell>
                      <TableCell>{blog.tag}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                       
                            <DropdownMenuItem asChild>
                              <Link href={`/blogs/edit/${blog.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(blog.id)}
                              className="text-red-600 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
