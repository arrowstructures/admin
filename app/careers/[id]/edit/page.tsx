"use client"

import type React from "react"
import { use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"

type Career = {
  job_title: string,
  department: string,
  location: string,
  job_type: string,
  job_description: string,
  requirements: string,
  benefits: string,
  max_salary: string,
  min_salary: string,
  remote_work_available: boolean,
  publish_immediately: boolean,
}

export default function EditCareerPage() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<Career>({
    job_title: "",
    department: "",
    location: "",
    job_type: "",
    job_description: "",
    requirements: "",
    benefits: "",
    min_salary: "",
    max_salary: "",
    remote_work_available: false,
    publish_immediately: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCareer = async () => {
      const { data, error } = await supabase
        .from("careers")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        console.error("Error fetching career:", error)
      } else if (data) {
        setFormData({
          ...data,
          min_salary: data.min_salary?.toString() || "",
          max_salary: data.max_salary?.toString() || "",
        })
      }
      setLoading(false)
    }

    if (id) fetchCareer()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase
      .from("careers")
      .update({ ...formData })
      .eq("id", id)

    if (error) {
        toast.error("failed updating career")
      console.error("Error updating career:", error)
    } else {
        router.push(`/careers`)
      toast.success("Career updated successfully!")
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this career posting?")) {
      const { error } = await supabase.from("careers").delete().eq("id", id)
      if (error) console.error("Delete error:", error)
      else alert("Career deleted successfully!")
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/careers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Edit Career Position</h1>
          <p className="text-muted-foreground">Update job posting details and requirements</p>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>Update the main details for the job posting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="job_title">Job Title</Label>
                    <Input
                      id="job_title"
                      placeholder="e.g. Senior Software Engineer"
                      value={formData.job_title}
                      onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="safety">Safety</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g. New York, NY"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="job_type">Employment Type</Label>
                    <Select value={formData.job_type} onValueChange={(value) => setFormData({ ...formData, job_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job_description">Job Description</Label>
                  <Textarea
                    id="job_description"
                    placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                    value={formData.job_description}
                    onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    placeholder="List the required skills, experience, and qualifications..."
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefits</Label>
                  <Textarea
                    id="benefits"
                    placeholder="List the benefits and perks offered..."
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compensation</CardTitle>
                <CardDescription>Update salary range and compensation details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="min_salary">Min Salary</Label>
                    <Input
                      id="min_salary"
                      placeholder="50000"
                      value={formData.min_salary}
                      onChange={(e) => setFormData({ ...formData, min_salary: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_salary">Max Salary</Label>
                    <Input
                      id="max_salary"
                      placeholder="80000"
                      value={formData.max_salary}
                      onChange={(e) => setFormData({ ...formData, max_salary: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Job Settings</CardTitle>
                <CardDescription>Configure job posting settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="remote_work_available">Remote Work Available</Label>
                  <Switch
                    id="remote_work_available"
                    checked={formData.remote_work_available}
                    onCheckedChange={(checked) => setFormData({ ...formData, remote_work_available: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="publish_immediately">Active Position</Label>
                  <Switch
                    id="publish_immediately"
                    checked={formData.publish_immediately}
                    onCheckedChange={(checked) => setFormData({ ...formData, publish_immediately: checked })}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Update Career
                </Button>
                <Button type="button" variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button type="button" variant="outline" className="w-full" asChild>
                  <Link href={`/careers/${id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Career
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
