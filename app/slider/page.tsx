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

type Slider = {
  id: string
  title: string
  description: string
  slider_image: string
}

export default function SliderPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [slider, setSlider] = useState<Slider[]>([])

  useEffect(() => {
    const fetchSlider = async () => {
      const { data, error } = await supabase.from("slider").select("*")
      if (error) {
        console.log("Error fetching team: ", error)
      } else {
        setSlider(data as Slider[])
      }
    }
    fetchSlider()
  }, [])

  const filteredTeamMembers = slider.filter(
    (member) =>
      member.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("slider").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete project.")
      console.error("Delete error:", error)
    } else {
      toast.success("Slider deleted successfully!")
      setSlider((prev) => prev.filter((team) => team.id !== id)) // client-side update
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Slider</h1>
          <p className="text-muted-foreground">Manage your Slider information</p>
        </div>
        <Button asChild>
          <Link href="/slider/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Slider
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Slider</CardTitle>
            <Badge className="bg-blue-100 text-blue-800">{slider.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{slider.length}</div>
            <p className="text-xs text-muted-foreground">Team members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Slider</CardTitle>
            <Badge className="bg-green-100 text-green-800">4</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Badge className="bg-purple-100 text-purple-800">4</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Experience</CardTitle>
            <Badge className="bg-yellow-100 text-yellow-800">9 yrs</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9</div>
            <p className="text-xs text-muted-foreground">Years average</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Sliders</CardTitle>
          <CardDescription>Manage your Slider and their information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slider Title</TableHead>
                <TableHead>description</TableHead>
                <TableHead>Image url</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{member.title}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{member.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{member.slider_image}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/team/${member.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/slider/edit/${member.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(member.id)}>
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
