import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Calendar, Building2, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type ProjectStatus = "completed" | "ongoing" | "planning" | "on_hold"

interface Project {
  id: string
  project_name: string
  client: string
  category: string
  location: string
  description: string
  image: string
  status: ProjectStatus
  created_at: string
}

export default async function ProjectDetails({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  const { data: project, error } = (await supabase.from("projects").select("*").eq("id", params.id).single()) as {
    data: Project | null
    error: any
  }

  if (error || !project) {
    console.error("Error fetching project:", error)
    return notFound()
  }

  // Status configuration
  const getStatusConfig = (status: ProjectStatus) => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle,
          label: "Completed",
          className: "bg-green-500 text-white hover:bg-green-600",
        }
      case "ongoing":
        return {
          icon: Clock,
          label: "Ongoing",
          className: "bg-blue-500 text-white hover:bg-blue-600",
        }
      case "planning":
        return {
          icon: AlertCircle,
          label: "Planning",
          className: "bg-yellow-500 text-white hover:bg-yellow-600",
        }
      case "on_hold":
        return {
          icon: AlertCircle,
          label: "On Hold",
          className: "bg-gray-500 text-white hover:bg-gray-600",
        }
      default:
        return {
          icon: CheckCircle,
          label: "Completed",
          className: "bg-green-500 text-white hover:bg-green-600",
        }
    }
  }

  const statusConfig = getStatusConfig(project.status)
  const StatusIcon = statusConfig.icon

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Project features based on category
  const getProjectFeatures = (category: string) => {
    const baseFeatures = [
      "Professional structural engineering design",
      "Compliance with local building codes and regulations",
      "Quality construction materials and techniques",
      "Regular project monitoring and quality assurance",
      "Timely project delivery and completion",
      "Post-construction support and maintenance guidance",
    ]

    const categoryFeatures: Record<string, string[]> = {
      residential: [
        "Modern architectural design with optimal space utilization",
        "Earthquake-resistant structural framework",
        "Energy-efficient building systems",
        "Premium finishing and interior design",
        "Landscaped outdoor spaces",
        "Smart home automation systems",
        "Sustainable construction practices",
        "Enhanced security features",
      ],
      commercial: [
        "Modern commercial architecture design",
        "Flexible office space layouts",
        "Advanced HVAC and electrical systems",
        "High-speed internet and communication infrastructure",
        "Parking facilities and accessibility features",
        "Energy-efficient lighting systems",
        "Fire safety and security systems",
        "Sustainable building practices",
      ],
      infrastructure: [
        "Modern architectural design with curved roof structure",
        "Covered waiting areas for passenger comfort",
        "Efficient traffic flow and circulation design",
        "Integrated landscaping and street furniture",
        "Sustainable lighting and ventilation systems",
        "Information display systems",
        "Accessible design for all users",
        "Integration with existing urban infrastructure",
      ],
      industrial: [
        "Heavy-duty structural framework design",
        "Industrial-grade electrical and mechanical systems",
        "Efficient workflow and logistics planning",
        "Safety systems and emergency protocols",
        "Environmental compliance features",
        "Scalable design for future expansion",
        "Advanced material handling systems",
        "Quality control and monitoring systems",
      ],
    }

    return categoryFeatures[category.toLowerCase()] || baseFeatures
  }

  const projectFeatures = getProjectFeatures(project.category)

  // Gallery images (you can extend this to fetch from a separate gallery table)
  const galleryImages = [
    project.image || "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="py-12 border-b-4 border-red-500">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/portfolio"
              className="inline-flex items-center text-gray-600 hover:text-red-500 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Link>
            <Badge className={statusConfig.className}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {statusConfig.label}
            </Badge>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{project.project_name}</h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">{project.description}</p>

              {/* Project Meta */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center text-gray-600">
                  <Building2 className="w-5 h-5 mr-3 text-red-500" />
                  <span className="capitalize">{project.category}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-red-500" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3 text-red-500" />
                  <span>Started {formatDate(project.created_at)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Building2 className="w-5 h-5 mr-3 text-red-500" />
                  <span>Client: {project.client}</span>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-lg">
              <Image
                src={project.image || "/placeholder.svg?height=600&width=800"}
                alt={project.project_name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Key Features</h2>
            <div className="w-20 h-1 bg-red-500"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {projectFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 mr-4 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

 

      {/* Call to Action */}
      <section className="py-16 bg-white border-t-4 border-red-500">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Interested in Similar Projects?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Contact our team to discuss your structural engineering and construction requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-red-500 hover:bg-red-600 text-white px-8 py-3">
              <Link href="/contact">Get In Touch</Link>
            </Button>
            <Button asChild variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 px-8 py-3">
              <Link href="/portfolio">View More Projects</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
