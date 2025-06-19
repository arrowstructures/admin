import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Award, Mail, Phone, MapPin, Building2, GraduationCap, Users, Trophy, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StructuralBackground } from "@/components/structural-background"

export const metadata: Metadata = {
  title: "Er. Prabhu Dev - Principal Structural Engineer & CEO | Arrow Structures",
  description:
    "Meet Er. Prabhu Dev, M.E., Ph.D., the visionary Principal Structural Engineer and CEO of Arrow Structures. Chartered engineer with extensive experience in structural consultancy and civil construction.",
  keywords: [
    "Er. Prabhu Dev",
    "Principal Structural Engineer",
    "CEO Arrow Structures",
    "Chartered Structural Engineer",
    "CMDA Licensed Engineer",
    "Structural Engineering Expert",
    "Civil Construction Leader",
    "Ph.D. Structural Engineering",
    "Institution of Engineers India",
    "Consulting Civil Engineers",
  ],
  authors: [{ name: "Arrow Structures" }],
  creator: "Arrow Structures",
  publisher: "Arrow Structures",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://arrowstructures.com"),
  alternates: {
    canonical: "/about/er-prabhu-dev",
  },
  openGraph: {
    title: "Er. Prabhu Dev - Principal Structural Engineer & CEO | Arrow Structures",
    description:
      "Meet Er. Prabhu Dev, M.E., Ph.D., the visionary Principal Structural Engineer and CEO of Arrow Structures. Chartered engineer with extensive experience in structural consultancy.",
    url: "/about/er-prabhu-dev",
    siteName: "Arrow Structures",
    images: [
      {
        url: "/team1.jpg",
        width: 1200,
        height: 630,
        alt: "Er. Prabhu Dev - Principal Structural Engineer & CEO",
      },
    ],
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Er. Prabhu Dev - Principal Structural Engineer & CEO | Arrow Structures",
    description:
      "Meet Er. Prabhu Dev, M.E., Ph.D., the visionary Principal Structural Engineer and CEO of Arrow Structures.",
    images: ["/team1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Er. Prabhu Dev",
  jobTitle: "Principal Structural Engineer & CEO",
  worksFor: {
    "@type": "Organization",
    name: "Arrow Structures",
    url: "https://arrowstructures.com",
  },
  email: "prabu@arrowstructures.com",
  telephone: "+91 98765 43210",
  address: {
    "@type": "PostalAddress",
    streetAddress: "5, Guru Govind Singh Road, R.S Puram",
    addressLocality: "Coimbatore",
    addressRegion: "Tamil Nadu",
    postalCode: "641002",
    addressCountry: "IN",
  },
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "Master of Engineering",
    },
    {
      "@type": "EducationalOrganization",
      name: "Doctor of Philosophy (Ph.D.) - In Progress",
    },
  ],
  memberOf: [
    {
      "@type": "Organization",
      name: "Institution of Engineers (India)",
    },
    {
      "@type": "Organization",
      name: "Association of Consulting Civil Engineers (India)",
    },
  ],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "Chartered Structural Engineer",
      credentialCategory: "Professional Certification",
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "Grade-1 Licensed Structural Engineer",
      credentialCategory: "Government License",
    },
  ],
  image: "https://arrowstructures.com/team1.jpg",
  url: "https://arrowstructures.com/about/er-prabhu-dev",
}

export default function ErPrabhuDevPage() {
  const achievements = [
    {
      icon: Award,
      title: "Chartered Structural Engineer",
      description:
        "Member of the Institution of Engineers (India), upholding the highest standards in professional engineering.",
      category: "Professional Recognition",
    },
    {
      icon: Building2,
      title: "Grade-1 Licensed Structural Engineer",
      description:
        "Certified by the Chennai Metropolitan Development Authority (CMDA) to handle complex structural projects.",
      category: "Government Certification",
    },
    {
      icon: MapPin,
      title: "Registered Gardening-1 Structural Engineer",
      description: "Authorized for specialized roles in urban development and green structure planning by CMDA.",
      category: "Specialized License",
    },
    {
      icon: Users,
      title: "Lifetime Member - ACCE(I)",
      description:
        "Association of Consulting Civil Engineers (India), contributing to engineering best practices nationwide.",
      category: "Professional Membership",
    },
    {
      icon: GraduationCap,
      title: "Academic Panel Member",
      description:
        "Serves on the Board of Studies in multiple universities, ensuring curricula align with industry advancements.",
      category: "Academic Leadership",
    },
  ]

  const expertise = [
    "Structural Analysis & Design",
    "Seismic Engineering",
    "Foundation Engineering",
    "Project Management",
    "Quality Assurance",
    "Research & Development",
    "Academic Curriculum Development",
    "Industry Standards Compliance",
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative">
        <StructuralBackground />
        <div className="relative z-10">
          {/* Navigation */}
          <section className="py-6 border-b bg-white/80 backdrop-blur-sm">
            <div className="container">
              <Button asChild variant="ghost" className="mb-4">
                <Link href="/about">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to About Us
                </Link>
              </Button>
            </div>
          </section>

          {/* Hero Section */}
          <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
            <div className="container">
              <div className="max-w-6xl mx-auto">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="relative w-full max-w-md mx-auto">
                      <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl">
                        <Image
                          src="/team1.jpg"
                          alt="Er. Prabhu Dev - Principal Structural Engineer & CEO"
                          width={500}
                          height={500}
                          className="object-cover w-full h-full"
                          priority
                        />
                      </div>
                      {/* Decorative elements */}
                      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-red-600 rounded-full opacity-10 -z-10" />
                      <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-600 rounded-full opacity-10 -z-10" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                        Principal Structural Engineer & CEO
                      </Badge>
                      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                        Er. Prabhu Dev
                        <span className="block text-2xl md:text-3xl text-red-600 font-semibold mt-2">M.E., Ph.D.</span>
                      </h1>
                      <p className="text-xl text-gray-600 leading-relaxed">
                        Visionary leader and Principal Structural Engineer behind Arrow Structures, bringing a rare
                        blend of engineering depth and practical insight to every project.
                      </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
                        <div className="text-2xl font-bold text-red-600">15+</div>
                        <div className="text-sm text-gray-600">Years Experience</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
                        <div className="text-2xl font-bold text-red-600">500+</div>
                        <div className="text-sm text-gray-600">Projects Led</div>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-5 w-5 text-red-600" />
                        <span>prabu@arrowstructures.com</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-5 w-5 text-red-600" />
                        <span>+91 98765 43210</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Biography Section */}
          <section className="py-16 md:py-24">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Biography</h2>
                  <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                </div>

                <div className="prose prose-lg prose-gray max-w-none">
                  <p className="text-lg leading-relaxed text-gray-700 mb-6">
                    Er. Prabhu Dev, M.E., Ph.D., stands as the visionary leader and Principal Structural Engineer behind
                    Arrow Structures. With a rich academic background and extensive field experience, he brings a rare
                    blend of engineering depth and practical insight, steering the firm with integrity, innovation, and
                    a relentless pursuit of perfection.
                  </p>

                  <p className="text-lg leading-relaxed text-gray-700 mb-6">
                    Currently advancing his doctoral research while leading the company's mission to deliver innovative
                    structural solutions, Dr. Prabhu Dev exemplifies the perfect fusion of academic excellence and
                    industry leadership. His commitment to continuous learning and professional development has
                    positioned Arrow Structures at the forefront of structural engineering innovation.
                  </p>

                  <p className="text-lg leading-relaxed text-gray-700">
                    Under his leadership, Arrow Structures has grown from a focused structural engineering practice into
                    one of the region's most respected firms, delivering excellence across a wide spectrum of
                    residential, commercial, and infrastructure projects. His vision extends beyond individual projects
                    to encompass the broader advancement of engineering education and professional standards.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Professional Recognitions */}
          <section className="py-16 md:py-24 bg-gray-50">
            <div className="container">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                    <Trophy className="h-8 w-8 text-red-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Professional Recognitions & <span className="text-red-600">Industry Leadership</span>
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    A comprehensive overview of professional certifications, memberships, and leadership roles that
                    define excellence in structural engineering.
                  </p>
                  <div className="w-24 h-1 bg-red-600 mx-auto mt-6"></div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {achievements.map((achievement, index) => (
                    <Card
                      key={index}
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
                    >
                      <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <achievement.icon className="h-6 w-6 text-red-600" />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {achievement.category}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{achievement.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{achievement.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Areas of Expertise */}
          <section className="py-16 md:py-24">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Areas of Expertise</h2>
                  <p className="text-xl text-gray-600">
                    Specialized knowledge and skills developed through years of academic study and practical
                    application.
                  </p>
                  <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {expertise.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
                    >
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <span className="font-medium text-gray-900">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-16 md:py-24 bg-gradient-to-r from-red-600 to-red-700">
            <div className="container">
              <div className="max-w-4xl mx-auto text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to Work with Our Expert Team?</h2>
                <p className="text-xl mb-8 opacity-90">
                  Connect with Er. Prabhu Dev and the Arrow Structures team for your next structural engineering
                  project.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                    <Link href="/contact">Get in Touch</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-red-600"
                  >
                    <Link href="/portfolio">View Our Projects</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
