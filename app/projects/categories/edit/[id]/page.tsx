"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ArrowLeft, Eye, Save } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function EditCategoryPage() {
  const { id } = useParams()
  const router = useRouter()

  const [formData, setFormData] = useState({
    project_category_name: "",
    description: "",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategory = async () => {
      const { data, error } = await supabase
        .from("project_category")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        toast.error("Failed to fetch category")
        console.error(error)
      } else {
        setFormData({
          project_category_name: data.project_category_name,
          description: data.description,
        })
      }
      setIsLoading(false)
    }

    if (id) fetchCategory()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.project_category_name) {
      toast.error("Category name is required")
      return
    }

    setIsLoading(true)

    const { error } = await supabase
      .from("project_category")
      .update({
        project_category_name: formData.project_category_name,
        description: formData.description,
      })
      .eq("id", id)

    setIsLoading(false)

    if (error) {
      toast.error("Update failed")
      console.error(error)
    } else {
      toast.success("Category updated successfully")
      router.push("/projects/categories")
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <LoadingSpinner />
        <p>Loading category details...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/projects/categories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0049E6]">Edit Category</h1>
          <p className="text-muted-foreground">Update category details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
                <CardDescription>Update the category name and description.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project_category_name">Category Name</Label>
                  <Input
                    id="project_category_name"
                    placeholder="e.g. Transportation, Residential"
                    value={formData.project_category_name}
                    onChange={(e) =>
                      setFormData({ ...formData, project_category_name: e.target.value })
                    }
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the category..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
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
                <Button
                  type="submit"
                  className="w-full bg-[#0049E6] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Category
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
