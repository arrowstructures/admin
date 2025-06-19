"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { Building2, Calendar, MapPin } from "lucide-react"
import { StructuralBackground } from "@/components/structural-background"

export default function PortfolioPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setProjects(data || [])
      } catch (err) {
        console.error("Failed to fetch projects:", err)
        setError("Failed to load projects. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="relative">
        <StructuralBackground />
        <div className="relative z-10">
          {/* Header Section */}
          <section className="py-8 sm:py-12 bg-gray-50">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4">
                  Our <span className="text-red-500">Portfolio</span>
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto sm:mx-0">
                  Explore our diverse range of structural engineering projects and construction achievements.
                </p>
                <div className="w-16 sm:w-20 h-1 bg-red-500 mt-4 mx-auto sm:mx-0"></div>
              </div>
            </div>
          </section>

          <section className="py-8 sm:py-12 md:py-16 lg:py-24">
            <div className="container px-4 sm:px-6">
              <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-gray-200"></div>
                    <div className="p-4 sm:p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="flex gap-2">
                        <div className="h-6 w-16 bg-gray-200 rounded"></div>
                        <div className="h-6 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative">
        <StructuralBackground />
        <div className="relative z-10">
          {/* Header Section */}
          <section className="py-8 sm:py-12 bg-gray-50">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4">
                  Our <span className="text-red-500">Portfolio</span>
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto sm:mx-0">
                  Explore our diverse range of structural engineering projects and construction achievements.
                </p>
                <div className="w-16 sm:w-20 h-1 bg-red-500 mt-4 mx-auto sm:mx-0"></div>
              </div>
            </div>
          </section>

          <section className="py-8 sm:py-12 md:py-16 lg:py-24">
            <div className="container px-4 sm:px-6">
              <div className="text-center">
                <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <StructuralBackground />
      <div className="relative z-10">
        {/* Header Section */}
        <section className="py-8 sm:py-12 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4">
                Our <span className="text-red-500">Portfolio</span>
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto sm:mx-0">
                Explore our diverse range of structural engineering projects and construction achievements.
              </p>
              <div className="w-16 sm:w-20 h-1 bg-red-500 mt-4 mx-auto sm:mx-0"></div>
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-24">
          <div className="container px-4 sm:px-6">
            {projects.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <Building2 className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Projects Available</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  We're currently updating our portfolio. Please check back soon.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/portfolio/${project.id}`}
                    className="group bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <Image
                        src={project.image || "/placeholder.svg?height=300&width=400"}
                        alt={project.project_name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                        {project.project_name}
                      </h3>

                      <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.project_type && (
                          <Badge variant="secondary" className="text-xs">
                            {project.project_type}
                          </Badge>
                        )}
                        {project.status && (
                          <Badge variant={project.status === "completed" ? "default" : "outline"} className="text-xs">
                            {project.status}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2 text-xs sm:text-sm text-gray-500">
                        {project.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="truncate">{project.location}</span>
                          </div>
                        )}
                        {project.completion_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{new Date(project.completion_date).getFullYear()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-gray-50 border-t">
          <div className="container px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-6">
                Ready to Start Your Project?
              </h2>
              <div className="h-1 w-16 sm:w-20 bg-red-500 mx-auto mb-4 sm:mb-6"></div>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-4">
                Let's discuss how we can bring your structural engineering vision to life with our expertise and
                dedication to excellence.
              </p>
              <Button asChild size="lg" className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto">
                <Link href="/contact">Start Your Project</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
