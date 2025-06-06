"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/loading-spinner"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"

type Category = {
  id: string
  project_category_name: string
}

export default function EditProjectPage() {
  const router = useRouter()
  const { id: projectId } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [imagePreview, setImagePreview] = useState<string>("") // For image preview
  const [imageFile, setImageFile] = useState<File | null>(null) // For new upload

  const [formData, setFormData] = useState({
    project_name: "",
    client: "",
    category: "",
    description: "",
    location: "",
    start_date: "",
    end_date: "",
    budget: "",
    status: "",
    image: "", // store image URL here
  })

useEffect(() => {
  if (!projectId) return

  const fetchProject = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single()

    if (error) {
      toast.error("Failed to fetch project")
      console.error("Error fetching project:", error)
      return
    }

    setFormData({
      ...data,
      budget: data.budget?.toString() || "",
      image: data.image || "",
    })

if (data.image) {
  // Fix: only pass path, not full URL
  const imagePath = data.image.startsWith("http")
    ? data.image.split("/project-images/")[1]
    : data.image

  const { data: publicUrlData } = supabase.storage
    .from("project-images")
    .getPublicUrl(imagePath)

  if (publicUrlData.publicUrl) {
    setImagePreview(publicUrlData.publicUrl)
  } else {
    console.error("Failed to get public URL for image.")
  }
}


  }

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("project_category")
      .select("id, project_category_name")

    if (error) {
      toast.error("Failed to fetch categories")
    } else {
      setCategories(data)
    }
  }

  fetchProject()
  fetchCategories()
}, [projectId])

console.log("Image preview URL:", imagePreview)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    let updatedImageUrl = formData.image

    // If user selected a new image file, upload it first
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${projectId}.${fileExt}`
      const filePath = `project-images/${fileName}`

      // Upload image to Supabase storage bucket 'project-images'
      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(filePath, imageFile, { upsert: true })

      if (uploadError) {
        toast.error("Failed to upload image")
        setIsLoading(false)
        return
      }

      updatedImageUrl = filePath
    }

    const { error } = await supabase
      .from("projects")
      .update({
        project_name: formData.project_name,
        client: formData.client,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        status: formData.status,
        image: updatedImageUrl,
      })
      .eq("id", projectId)

    if (error) {
      toast.error("Failed to update project.")
      console.error(error)
    } else {
      toast.success("Project updated successfully!")
      router.push("/projects")
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
          <p className="text-muted-foreground">Update construction project details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Modify main project information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="project_name">Project Name</Label>
                    <Input
                      id="project_name"
                      value={formData.project_name}
                      onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Input
                      id="client"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
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
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.project_category_name}>
                            {cat.project_category_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Project Image</Label>
                  <input
                  id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Project Image Preview"
                      className="mt-2 max-h-48 object-contain rounded border"
                      loading="lazy"
                          style={{ maxWidth: "100%" }}

                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Timeline & Budget</CardTitle>
                <CardDescription>Adjust dates and budget</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="inprogress">In Progress</SelectItem>
                      <SelectItem value="on hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Project
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
