"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Eye, Calendar, User, MapPin, Clock, DollarSign, Users } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockCareer = {
  id: 1,
  title: "Senior Structural Engineer",
  department: "Engineering",
  location: "New York, NY",
  type: "Full-time",
  status: "Active",
  applications: 24,
  posted: "2024-01-10",
  salary: "$85,000 - $120,000",
  remote: true,
  description: `We are seeking a highly skilled Senior Structural Engineer to join our dynamic team at Arrow Structures. The successful candidate will be responsible for designing and analyzing structural systems for various construction projects, ensuring compliance with building codes and safety standards.

Key responsibilities include:
- Design and analysis of structural systems for commercial and residential buildings
- Collaboration with architects and other engineering disciplines
- Preparation of detailed structural drawings and specifications
- Site visits and construction administration
- Mentoring junior engineers and supporting project teams`,
  requirements: `- Bachelor's degree in Structural Engineering or related field
- Professional Engineer (PE) license required
- Minimum 7 years of experience in structural design
- Proficiency in structural analysis software (SAP2000, ETABS, etc.)
- Strong knowledge of building codes (IBC, AISC, ACI)
- Excellent communication and project management skills
- Experience with sustainable design practices preferred`,
  benefits: `- Competitive salary and performance bonuses
- Comprehensive health, dental, and vision insurance
- 401(k) retirement plan with company matching
- Professional development opportunities
- Flexible work arrangements
- Paid time off and holidays
- Company-sponsored training and certifications`,
}

export default function ViewCareerPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/careers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{mockCareer.title}</h1>
          <p className="text-muted-foreground">View and manage career posting details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/careers/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{mockCareer.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {mockCareer.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {mockCareer.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {mockCareer.salary}
                    </span>
                  </CardDescription>
                </div>
                <Badge variant={mockCareer.status === "Active" ? "default" : "secondary"}>{mockCareer.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                  <div className="prose max-w-none">
                    {mockCareer.description.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="mb-4 text-sm leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                  <div className="prose max-w-none">
                    {mockCareer.requirements.split("\n").map((requirement, index) => (
                      <p key={index} className="mb-2 text-sm leading-relaxed">
                        {requirement}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                  <div className="prose max-w-none">
                    {mockCareer.benefits.split("\n").map((benefit, index) => (
                      <p key={index} className="mb-2 text-sm leading-relaxed">
                        {benefit}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Position Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Department: {mockCareer.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Posted: {mockCareer.posted}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Applications: {mockCareer.applications}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Location: {mockCareer.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Type: {mockCareer.type}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Remote Work: </span>
                <Badge variant={mockCareer.remote ? "default" : "secondary"}>
                  {mockCareer.remote ? "Available" : "Not Available"}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium">Salary Range: </span>
                <Badge variant="outline">{mockCareer.salary}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" asChild>
                <Link href={`/careers/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Position
                </Link>
              </Button>
              <Button variant="outline" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Preview Live
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                View Applications
              </Button>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Position
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
