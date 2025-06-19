"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Award, Users, Building, Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase"
import { StructuralBackground } from "@/components/structural-background"

type TeamMember = {
  id?: number
  name: string
  designation: string
  profile_image: string
  email: string
  phone?: string
  specialization?: string[]
  bio?: string
  phdProgress?: number
  phdStatus?: string
}

export default function AboutPage() {
  const stats = [
    { icon: Building, value: "500+", label: "Projects Completed" },
    { icon: Users, value: "10+", label: "Team Members" },
    { icon: Lightbulb, value: "10+", label: "Years Experience" },
  ]

  const ceoData: TeamMember = {
    name: "Er. Prabhu Dev",
    designation: "Principal Structural Engineer & CEO",
    profile_image: "/team1.jpg?height=400&width=400",
    email: "prabu@arrowstructures.com",
    phone: "+91 98765 43210",
    specialization: ["Structural Engineering", "Project Management", "Research & Development"],
    bio: "Er. Prabhu Dev M.E., P̅h̅.D̅.,,is the visionary leader and Principal Structural Engineer behind Arrow Structures. With a rich academic background and extensive field experience, he brings a rare blend of engineering depth and practical insight, steering the firm with integrity, innovation, and a relentless pursuit of perfection. Currently advancing his doctoral research while leading the company's mission to deliver innovative structural solutions.\n\nProfessional Recognitions & Industry Leadership:\n\n• Chartered Structural Engineer – Member of the Institution of Engineers (India), upholding the highest standards in professional engineering.\n\n• Grade-1 Licensed Structural Engineer – Certified by the Chennai Metropolitan Development Authority (CMDA) to handle complex structural projects.\n\n• Registered Gardening-1 Structural Engineer (CMDA) – Authorized for specialized roles in urban development and green structure planning.\n\n• Lifetime Member – Association of Consulting Civil Engineers (India), contributing to the growth of engineering best practices nationwide.\n\n• Academic Panel Member – Serves on the Board of Studies in multiple universities, ensuring that academic curricula remain aligned with industry advancements.",
  }

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data, error } = await supabase.from("team_members").select("*").order("created_at", { ascending: true })

        if (error) {
          throw error
        }

        setTeamMembers([ceoData, ...(data || [])])
      } catch (err) {
        console.error("Failed to fetch team members:", err)
        setError("Failed to load team members. Please try again later.")
        setTeamMembers([ceoData])
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
  }, [])

  const TeamMemberSkeleton = () => (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="text-center">
            <div className="space-y-4 sm:space-y-5">
              {/* Square Profile Image Skeleton */}
              <div className="relative mx-auto">
                <Skeleton className="w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-lg mx-auto" />
              </div>

              {/* Member Info Skeleton */}
              <div className="space-y-2 px-2">
                <Skeleton className="h-4 sm:h-5 w-3/4 mx-auto" />
                <Skeleton className="h-3 sm:h-4 w-full mx-auto" />
                <Skeleton className="h-3 sm:h-4 w-2/3 mx-auto" />
                <Skeleton className="h-3 w-4/5 mx-auto" />
              </div>

              {/* Badge Skeleton */}
              <div className="flex gap-2 justify-center px-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-8 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="relative min-h-screen">
      <StructuralBackground />
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="bg-muted py-6 sm:py-8 md:py-12 lg:py-16">
          <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 items-center">
              <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
                <Badge className="w-fit text-xs sm:text-sm">Established 2017 • Growing Excellence</Badge>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
                    About Arrow Structures
                  </h1>
                  <div className="mt-2 sm:mt-3 h-1 w-8 sm:w-12 bg-primary rounded-full"></div>
                </div>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  Established in 2017, Arrow Structures has emerged as a trusted name in the field of Structural
                  Consultancy and Civil Construction, recognized for its technical expertise, quality-driven approach,
                  and unwavering commitment to client satisfaction. What began as a focused structural engineering
                  practice has grown into one of the region's most respected firms, delivering excellence across a wide
                  spectrum of residential, commercial, and infrastructure projects.
                </p>
              </div>
              <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden rounded-lg sm:rounded-xl shadow-xl order-1 lg:order-2">
                <Image
                  src="/home.jpg"
                  alt="Arrow Structures Office"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-6 sm:py-8 md:py-12 lg:py-16">
          <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
              {stats.map((stat, index) => (
                <Card
                  key={stat.label}
                  className="text-center border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="pt-4 pb-4 px-4 sm:pt-6 sm:pb-6 sm:px-6">
                    <stat.icon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary mx-auto mb-3 sm:mb-4" />
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-primary">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="border-t py-6 sm:py-8 md:py-12 lg:py-16">
          <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2 sm:mb-3">
                Our Mission & Vision
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed px-4">
                Driving innovation in structural engineering while maintaining our commitment to excellence and
                sustainability.
              </p>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-center px-4">
                STRENGTH IN EVERY STRUCTURE. TRUST IN EVERY DETAIL
              </h2>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-6 sm:py-8 md:py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-red-100 rounded-full mb-3 sm:mb-4 md:mb-6">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-red-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-2 sm:mb-3">
                Meet Our <span className="text-red-600">Leadership</span>
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Our experienced professionals bring together decades of expertise in structural engineering and
                construction, leading innovation in every project we undertake.
              </p>
              <div className="w-12 sm:w-16 md:w-24 h-1 bg-red-600 mx-auto mt-3 sm:mt-4 md:mt-6"></div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 text-center max-w-2xl mx-auto">
                <p className="text-red-700 font-medium text-sm sm:text-base">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="space-y-6 sm:space-y-8 md:space-y-12">
                {/* CEO Profile Skeleton */}
                <div className="max-w-6xl mx-auto">
                  <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden border border-red-100">
                    <div className="p-4 sm:p-6 md:p-8 lg:p-12">
                      <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
                        <div className="lg:col-span-4 space-y-4">
                          <Skeleton className="h-8 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                        <div className="hidden lg:block lg:col-span-0">
                          <Skeleton className="w-px h-48 mx-auto" />
                        </div>
                        <div className="lg:col-span-3 space-y-4">
                          <Skeleton className="h-6 w-1/2" />
                          <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                        <div className="hidden lg:block lg:col-span-0">
                          <Skeleton className="w-px h-48 mx-auto" />
                        </div>
                        <div className="lg:col-span-3 text-center">
                          <Skeleton className="w-64 h-80 sm:w-56 sm:h-60 mx-auto rounded-lg" />
                          <div className="mt-4 space-y-2">
                            <Skeleton className="h-6 w-3/4 mx-auto" />
                            <Skeleton className="h-4 w-full mx-auto" />
                            <Skeleton className="h-4 w-2/3 mx-auto" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Members Skeleton */}
                <div className="space-y-6 sm:space-y-8">
                  <div className="text-center">
                    <Skeleton className="h-8 w-48 mx-auto mb-2" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                    <Skeleton className="w-12 sm:w-16 h-1 mx-auto mt-3 sm:mt-4" />
                  </div>
                  <TeamMemberSkeleton />
                </div>
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8 md:space-y-12">
                {/* CEO Profile - Mobile-First Layout */}
                <div className="max-w-6xl mx-auto">
                  <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden border border-red-100">
                    <div className="p-4 sm:p-6 md:p-8 lg:p-12">
                      {/* Mobile: Single Column, Desktop: Three Columns */}
                      <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
                        {/* Company Description */}
                        <div className="lg:col-span-4 space-y-4 sm:space-y-6 text-center lg:text-left">
                          <div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6 leading-tight">
                              Your Structure, Our Excellence.
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                              We specialize in the design of residential, commercial and industrial structures,
                              earth-retaining structures, bridge design and repair, and rehabilitation works, etc. We
                              are one of the recognized companies in Tamil Nadu.
                            </p>
                          </div>
                        </div>

                        {/* Vertical Divider - Hidden on mobile */}
                        <div className="hidden lg:block lg:col-span-0">
                          <div className="w-px h-48 bg-gradient-to-b from-transparent via-red-200 to-transparent mx-auto"></div>
                        </div>

                        {/* Specializations */}
                        <div className="lg:col-span-3 space-y-4 sm:space-y-6 lg:px-4">
                          <div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 lg:mb-8 text-center lg:text-left">
                              Our Specialization:
                            </h3>

                            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                              <div className="flex items-center gap-3 sm:gap-4 justify-center lg:justify-start">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Building className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-800 text-xs sm:text-sm tracking-wider">
                                    STRUCTURAL DESIGN
                                  </h4>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 sm:gap-4 justify-center lg:justify-start">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-800 text-xs sm:text-sm tracking-wider">
                                    CONSTRUCTION WORK
                                  </h4>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 sm:gap-4 justify-center lg:justify-start">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-800 text-xs sm:text-sm tracking-wider">
                                    VALUATION FOR BANKS
                                  </h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Vertical Divider - Hidden on mobile */}
                        <div className="hidden lg:block lg:col-span-0">
                          <div className="w-px h-48 bg-gradient-to-b from-transparent via-red-200 to-transparent mx-auto"></div>
                        </div>

                        {/* CEO Profile */}
                        <div className="lg:col-span-3 text-center">
                          <div className="relative inline-block">
                            <div className="w-64 h-80 sm:w-56 sm:h-60 relative overflow-hidden rounded-lg shadow-lg mx-auto border-2 border-red-100 bg-gray-50">
                              <Image
                                src={ceoData.profile_image || "/placeholder.svg?height=400&width=300"}
                                alt={ceoData.name}
                                fill
                                className="object-contain p-2"
                                sizes="(max-width: 640px) 224px, 256px"
                              />
                            </div>

                            <div className="mt-4 sm:mt-6 space-y-1 sm:space-y-2">
                              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                                {ceoData.name.replace("Er. ", "").toUpperCase()}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed px-2">
                                M.E.(STRUCTURE), Ph.D., CHARTERED STRUCTURAL ENGINEER, GRADE-1 LICENSED STRUCTURAL
                                ENGINEER (CMDA)
                              </p>
                              <p className="text-sm sm:text-base md:text-lg font-bold text-red-400 tracking-wider mt-2 sm:mt-4">
                                PRINCIPAL STRUCTURAL ENGINEER & CEO
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Team Members */}
                <div className="space-y-6 sm:space-y-8">
                  {/* Section Title */}
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Our Team</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Meet the professionals behind our success</p>
                    <div className="w-12 sm:w-16 h-1 bg-red-600 mx-auto mt-3 sm:mt-4"></div>
                  </div>

                  {/* Team Grid Layout - 4 members per row */}
                  <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-4">
                      {teamMembers.slice(1).map((member, index) => (
                        <div key={member.name} className="group text-center">
                          <div className="space-y-4 sm:space-y-5">
                            {/* Square Profile Image */}
                            <div className="relative mx-auto">
                              <div className="w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 relative overflow-hidden rounded-lg bg-gray-100 shadow-lg group-hover:shadow-xl transition-all duration-300 border-2 border-gray-200 mx-auto">
                                <Image
                                  src={member.profile_image || "/placeholder.svg?height=224&width=224"}
                                  alt={member.name}
                                  fill
                                  className="object-cover object-center transition-all duration-300 group-hover:scale-105"
                                  sizes="(max-width: 640px) 160px, (max-width: 768px) 176px, (max-width: 1024px) 192px, 208px"
                                />
                              </div>
                            </div>

                            {/* Member Info */}
                            <div className="space-y-2 px-2">
                              <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight min-h-[1.5rem]">
                                {member.name}
                              </h3>
                              {member.email && (
                                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed truncate">
                                  {member.email}
                                </p>
                              )}
                              <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed min-h-[2.5rem] flex items-center justify-center">
                                {member.designation}
                              </p>
                            </div>

                            {/* Specialization Tags - Minimal */}
                            {member.specialization && member.specialization.length > 0 && (
                              <div className="flex flex-wrap gap-2 justify-center px-2">
                                <Badge className="bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1 text-xs font-medium border-0 rounded-full">
                                  {member.specialization[0]}
                                </Badge>
                                {member.specialization.length > 1 && (
                                  <Badge className="bg-gray-100 text-gray-600 px-3 py-1 text-xs font-medium border-0 rounded-full">
                                    +{member.specialization.length - 1}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
