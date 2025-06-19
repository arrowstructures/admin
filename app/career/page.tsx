"use client"

import { useState, useEffect } from "react"
import { Briefcase, Building2, Users, Award, MapPin, Clock, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"
import { StructuralBackground } from "@/components/structural-background"

type JobOpening = Database["public"]["Tables"]["careers"]["Row"]

const getJobTypeColor = (jobType: string) => {
  switch (jobType.toLowerCase()) {
    case "full-time":
      return "bg-green-100 text-green-800 border-green-200"
    case "part-time":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "contract":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "internship":
      return "bg-purple-100 text-purple-800 border-purple-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const parseRequirements = (requirements: string | null): string[] => {
  if (!requirements) return []
  return requirements
    .split(/[,;•\n]/)
    .map((req) => req.trim())
    .filter((req) => req.length > 0)
    .slice(0, 3)
}

const parseBenefits = (benefits: string | null): string[] => {
  if (!benefits) return []
  return benefits
    .split(/[,;•\n]/)
    .map((benefit) => benefit.trim())
    .filter((benefit) => benefit.length > 0)
    .slice(0, 4)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return "Posted today"
  if (diffDays <= 7) return `Posted ${diffDays} days ago`
  return `Posted on ${date.toLocaleDateString("en-IN")}`
}

const CareerCard = ({ job }: { job: JobOpening }) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-2">
              {job.job_title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-gray-600">
              <Building2 className="h-4 w-4 text-red-500" />
              {job.department}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={`text-xs font-medium ${getJobTypeColor(job.job_type)}`}>{job.job_type}</Badge>
            {job.remote_work_available && (
              <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                <Home className="h-3 w-3 mr-1" />
                Remote OK
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-red-500" />
            {job.location}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatDate(job.created_at)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{job.job_description}</p>

        <Separator />

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-red-500" />
            <p className="text-sm font-semibold text-gray-900">Key Requirements</p>
          </div>
          <ul className="space-y-2">
            {parseRequirements(job.requirements).map((req, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="line-clamp-2">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {job.benefits && parseBenefits(job.benefits).length > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-4 w-4 text-red-500" />
                <p className="text-sm font-semibold text-gray-900">Benefits</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {parseBenefits(job.benefits).map((benefit, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="pt-4">
        <Button
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:shadow-lg"
          onClick={() => {
            const subject = encodeURIComponent(`Job Application - ${job.job_title}`)
            const body = encodeURIComponent(
              `Dear Hiring Manager,\n\nI am writing to express my interest in the ${job.job_title} position in the ${job.department} department at Arrow Structures.\n\nPosition Details:\n• Location: ${job.location}\n• Employment Type: ${job.job_type}\n\nI believe my skills and experience make me a strong candidate for this role. I have attached my resume for your review and would welcome the opportunity to discuss how I can contribute to your team.\n\nThank you for your consideration. I look forward to hearing from you.\n\nBest regards,\n[Your Name]\n[Your Phone Number]\n[Your Email]`,
            )
            window.location.href = `mailto:arrowstructures@gmail.com?subject=${subject}&body=${body}`
          }}
        >
          <Briefcase className="h-4 w-4 mr-2" />
          Apply for this Position
        </Button>
      </CardFooter>
    </Card>
  )
}

const CareersPage = () => {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCareers() {
      try {
        const { data, error } = await supabase.from("careers").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching careers:", error)
          setError("Failed to load job openings")
        } else {
          setJobOpenings(data || [])
        }
      } catch (err) {
        console.error("Error:", err)
        setError("Failed to load job openings")
      } finally {
        setLoading(false)
      }
    }

    fetchCareers()
  }, [])

  return (
    <div className="relative z-10">
      <StructuralBackground />
      <div className="relative z-10">
        {/* Hero Section */}
     
        <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4">
            Join Our <span className="text-red-500">Team</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto sm:mx-0">
            Build your career with Arrow Structures. We're looking for passionate professionals to join our growing
            team and shape the future of structural engineering.
            </p>
            <div className="w-16 sm:w-20 h-1 bg-red-500 mt-4 mx-auto sm:mx-0"></div>
          </div>
        </div>
      </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Open Positions</h2>
                <p className="text-gray-600 mt-2">
                  {jobOpenings.length} {jobOpenings.length === 1 ? "position" : "positions"} available
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="animate-pulse border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-16 bg-gray-200 rounded"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="h-12 bg-gray-200 rounded w-full"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                  <p className="text-xl text-red-600 mb-4 font-semibold">{error}</p>
                  <p className="text-red-500">
                    Please try again later or contact us at{" "}
                    <a href="mailto:arrowstructures@gmail.com" className="underline hover:no-underline">
                      arrowstructures@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {jobOpenings.length > 0 ? (
                  jobOpenings.map((job) => <CareerCard key={job.id} job={job} />)
                ) : (
                  <div className="col-span-full text-center py-20">
                    <div className="max-w-2xl mx-auto">
                      {/* Illustration/Icon Section */}
                      <div className="relative mb-8">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
                          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Briefcase className="h-10 w-10 text-red-500" />
                          </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-16 w-3 h-3 bg-red-300 rounded-full opacity-60"></div>
                        <div className="absolute top-12 right-1/2 transform translate-x-20 w-2 h-2 bg-red-400 rounded-full opacity-40"></div>
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-24 w-4 h-4 bg-red-200 rounded-full opacity-50"></div>
                      </div>

                      {/* Content */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-3">No Current Openings</h3>
                          <p className="text-lg text-gray-600 leading-relaxed">
                            We don't have any open positions at the moment, but great opportunities are always on the
                            horizon.
                          </p>
                        </div>

                        {/* Value Proposition */}
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
                          <h4 className="text-xl font-semibold text-gray-900 mb-4">Why Work With Arrow Structures?</h4>
                          <div className="grid md:grid-cols-3 gap-6 text-sm">
                            <div className="text-center">
                              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Building2 className="h-6 w-6 text-white" />
                              </div>
                              <p className="font-medium text-gray-900">Innovative Projects</p>
                              <p className="text-gray-600 mt-1">
                                Work on cutting-edge structural engineering solutions
                              </p>
                            </div>
                            <div className="text-center">
                              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Users className="h-6 w-6 text-white" />
                              </div>
                              <p className="font-medium text-gray-900">Collaborative Team</p>
                              <p className="text-gray-600 mt-1">Join a supportive and dynamic work environment</p>
                            </div>
                            <div className="text-center">
                              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Award className="h-6 w-6 text-white" />
                              </div>
                              <p className="font-medium text-gray-900">Growth Opportunities</p>
                              <p className="text-gray-600 mt-1">Advance your career with continuous learning</p>
                            </div>
                          </div>
                        </div>

                        {/* Call to Action */}
                        <div className="space-y-4">
                          <p className="text-gray-700 font-medium">
                            Interested in future opportunities? We'd love to hear from you!
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                              size="lg"
                              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                              onClick={() => {
                                const subject = encodeURIComponent("Future Opportunities - Arrow Structures")
                                const body = encodeURIComponent(
                                  "Dear Arrow Structures Team,\n\nI am interested in future career opportunities with your company. I believe my skills and passion for structural engineering would be a great fit for your team.\n\nI have attached my resume for your consideration and would welcome the opportunity to discuss how I can contribute to your organization when positions become available.\n\nThank you for your time and consideration.\n\nBest regards,\n[Your Name]\n[Your Phone Number]\n[Your Email Address]",
                                )
                                window.location.href = `mailto:arrowstructures@gmail.com?subject=${subject}&body=${body}`
                              }}
                            >
                              <Briefcase className="h-5 w-5 mr-2" />
                              Submit Your Resume
                            </Button>
                            <Button
                              variant="outline"
                              size="lg"
                              className="border-red-500 text-red-500 hover:bg-red-50 font-semibold px-8 py-3 rounded-lg transition-all duration-200"
                              onClick={() => {
                                const subject = encodeURIComponent("Job Alert Subscription - Arrow Structures")
                                const body = encodeURIComponent(
                                  "Dear Arrow Structures Team,\n\nI would like to be notified when new job opportunities become available at your company.\n\nPlease add me to your job alert list for the following areas of interest:\n- [Specify your areas of interest, e.g., Structural Engineering, Project Management, etc.]\n\nContact Information:\nName: [Your Name]\nEmail: [Your Email]\nPhone: [Your Phone Number]\n\nThank you!\n\nBest regards,\n[Your Name]",
                                )
                                window.location.href = `mailto:arrowstructures@gmail.com?subject=${subject}&body=${body}`
                              }}
                            >
                              Get Job Alerts
                            </Button>
                          </div>
                        </div>

                        {/* Additional Info */}
                      
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default CareersPage
