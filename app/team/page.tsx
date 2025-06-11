"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Search, Eye, Edit, Trash2, Mail, User } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"

type Team = {
  id: string
  name: string
  email: string
  mobile_number: number
  designation: string
  profile_image: string
}

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [team, setTeams] = useState<Team[]>([])

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase.from("team_members").select("*")
      if (error) {
        console.log("Error fetching team: ", error)
      } else {
        setTeams(data as Team[])
      }
    }
    fetchTeams()
  }, [])

  const filteredTeamMembers = team.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.designation.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("team_members").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete project.")
      console.error("Delete error:", error)
    } else {
      toast.success("Project deleted successfully!")
      setTeams((prev) => prev.filter((team) => team.id !== id)) // client-side update
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">Manage your team and employee information</p>
        </div>
        <Button asChild>
          <Link href="/team/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Team Member
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Badge className="bg-blue-100 text-blue-800">{team.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.length}</div>
            <p className="text-xs text-muted-foreground">Team members</p>
          </CardContent>
        </Card>
       
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Team Members</CardTitle>
          <CardDescription>Manage your team members and their information</CardDescription>
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
                <TableHead>Member Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{member.designation}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.mobile_number}</Badge>
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
                          <Link href={`/team/edit/${member.id}`}>
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
