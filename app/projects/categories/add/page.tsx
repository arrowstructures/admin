"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/loading-spinner"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"

export default function AddProjectCategory() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    project_category_name: "",
    description: "",   
  })

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  

  const { data, error } = await supabase.from("project_category").insert([
    {
      project_category_name: formData.project_category_name,      
      description: formData.description,
    },
  ])

  if (error) {
    console.error("Error inserting project:", error)
    toast.error("Failed to category project.")
  } else {
    console.log("Inserted project:", data)
    toast.success("Category added successfully!")
    setFormData({
      project_category_name: "",
      description: "",
    })
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
          <h1 className="text-3xl font-bold tracking-tight text-[#0049E6]">Add New Category</h1>
          <p className="text-muted-foreground">Create a new construction Category</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
                <CardDescription>Enter the main information for the Category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-1">
                  <div className="space-y-2">
                    <Label htmlFor="project_category_name">Category Name</Label>
                    <Input
                      id="project_category_name"
                      placeholder="e.g. trasportation, residential, commercial"
                      value={formData.project_category_name}
                      onChange={(e) => setFormData({ ...formData, project_category_name: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                  </div>

                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the category scope and objectives..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button type="submit" variant="ghost"  onClick={handleSubmit} className="w-full bg-[#0049E6] text-white" disabled={isLoading} >
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
        </div>
      </form>
    </div>
  )
}
