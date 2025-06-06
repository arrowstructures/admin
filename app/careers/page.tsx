"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/lib/supabaseClient"
import {  Clock, Edit, Eye, MapPin, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { toast } from "sonner"
// ... other imports remain the same

type Career = {
  id: string // UUID
  job_title: string
  department: "engineering" | "operations" | "safety" | "design" | "management"
  location: string
  job_type: "full-time" | "part-time" | "contract" | "internship"
  job_description?: string
  requirements?: string
  benefits?: string
  min_salary?: number
  max_salary?: number
  remote_work_available: boolean
  publish_immediately: boolean
  created_at: string // ISO timestamp
}

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCareers = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("careers").select("*")
      if (error) {
        console.error("Error fetching careers:", error)
      } else {
        setCareers(data || [])
      }
      setLoading(false)
    }

    fetchCareers()
  }, [])

  const filteredCareers = careers.filter(
    (career) =>
      career.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Count derived data
  const activeCount = careers.filter((c) => c.publish_immediately === true).length
  const draftCount = careers.filter((c) => c.remote_work_available === true).length
  const uniqueDepartments = new Set(careers.map((c) => c.department)).size
  const totalApplications = careers.length


const handleDeleteCareer = async (careerId: string) => {

  const { error } = await supabase.from("careers").delete().eq("id", careerId);
  if (error) {
    console.error("Error deleting career:", error);
    toast.error("Failed to delete the career. Try again.");
    return;
  }else{
    toast.success("Career deleted successfully!");
  }

  // Update the local state to reflect deletion
  setCareers((prev) => prev.filter((career) => career.id !== careerId));
};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Careers</h1>
          <p className="text-muted-foreground">Manage job postings and career opportunities</p>
        </div>
        <Button asChild>
          <Link href="/careers/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Career
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
            <Badge className="bg-green-100 text-green-800">{activeCount}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground">Currently hiring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Badge className="bg-blue-100 text-blue-800">{totalApplications}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Positions</CardTitle>
            <Badge className="bg-yellow-100 text-yellow-800">{draftCount}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCount}</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Badge className="bg-purple-100 text-purple-800">{uniqueDepartments}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueDepartments}</div>
            <p className="text-xs text-muted-foreground">Hiring actively</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Career Positions</CardTitle>
          <CardDescription>Manage job postings and track applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search careers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Job Type</TableHead>
                  <TableHead>Min Salary</TableHead>
                  <TableHead>Max Salary</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCareers.map((career) => (
                  <TableRow key={career.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{career.job_title}</div>
                      </div>
                    </TableCell>
                    <TableCell>{career.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {career.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {career.job_type}
                      </div>
                    </TableCell>
                    <TableCell>
                        {career.min_salary}
                    </TableCell>
                    {/* <TableCell>
                      <Badge variant="outline">{career.applications}</Badge>
                    </TableCell> */}
                    <TableCell>{career.max_salary}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/careers/${career.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/careers/${career.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteCareer(career.id)}>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
