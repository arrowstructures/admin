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

export default function EditMemberPage() {
  const router = useRouter()
  const { id: memberId } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("") // For image preview
  const [imageFile, setImageFile] = useState<File | null>(null) // For new upload

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    mobile_number: "",
    profile_image: "",
  })

useEffect(() => {
  if (!memberId) return

  const fetchMember = async () => {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("id", memberId)
      .single()

    if (error) {
      toast.error("Failed to fetch member")
      console.error("Error fetching member:", error)
      return
    }

    setFormData({
      ...data,
      profile_image: data.profile_image || "",
    })

    if (data.profile_image) {
      // Only pass the path, not the full URL
      const imagePath = data.profile_image.startsWith("http")
        ? data.profile_image.split("/member-images/")[1]
        : data.profile_image

      const { data: publicUrlData } = supabase.storage
        .from("member-images")
        .getPublicUrl(imagePath)

      if (publicUrlData.publicUrl) {
        setImagePreview(publicUrlData.publicUrl)
      } else {
        console.error("Failed to get public URL for image.")
      }
    }
  }

  fetchMember()
}, [memberId])

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

  let updatedImageUrl = formData.profile_image

  // If user selected a new image file, upload it first
  if (imageFile) {
    const fileExt = imageFile.name.split(".").pop()
    const fileName = `${memberId}.${fileExt}`
    const filePath = `member-images/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("member-images")
      .upload(filePath, imageFile, { upsert: true })

    if (uploadError) {
      toast.error("Failed to upload image")
      setIsLoading(false)
      return
    }

    updatedImageUrl = filePath
  }

  const { error } = await supabase
    .from("team_members")
    .update({
      name: formData.name,
      email: formData.email,
      mobile_number: formData.mobile_number,
      designation: formData.designation,
      profile_image: updatedImageUrl, // <-- use the updated image path
    })
    .eq("id", memberId)

  if (error) {
    toast.error("Failed to update member.")
    console.error(error)
  } else {
    toast.success("Member updated successfully!")
    router.push("/team")
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
                <CardTitle>member Details</CardTitle>
                <CardDescription>Modify main member information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">member Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                
                                <div className="space-y-2">
                                    <Label htmlFor="mobile_number">Mobile Number</Label>
                                    <Input
                                      id="mobile_number"
                                      placeholder="e.g. Metro Corp"
                                      value={formData.mobile_number}
                                      onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                                      disabled={isLoading}
                                    />
                                  </div>
                                <div className="space-y-2">
                                    <Label htmlFor="designation">Designation</Label>
                                    <Input
                                      id="designation"
                                      placeholder="Senior Software Engg"
                                      value={formData.designation}
                                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                      disabled={isLoading}
                                    />
                                  </div>

                <div className="space-y-2">
                  <Label htmlFor="profile_image">Project Image</Label>
                  <input
                  id="profile_image"
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
            {/* <Card>
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
            </Card> */}

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
