import { PencilRuler, Settings2, BarChart3, Users2, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { StructuralBackground } from "@/components/structural-background"

export default function ServicesPage() {
  const services = [
    {
      icon: PencilRuler,
      title: "Structural Design",
      description: "Expert structural engineering and design services for all project types.",
      features: [
        "Comprehensive structural analysis",
        "Custom design solutions",
        "Building code compliance",
        "Seismic and wind load analysis",
      ],
    },
    {
      icon: Settings2,
      title: "Project Management",
      description: "End-to-end project management and construction supervision.",
      features: [
        "Timeline and budget planning",
        "Resource allocation",
        "Quality control procedures",
        "Progress monitoring and reporting",
      ],
    },
    {
      icon: BarChart3,
      title: "Feasibility Studies",
      description: "Comprehensive analysis and planning for project success.",
      features: [
        "Site evaluation and assessment",
        "Financial viability analysis",
        "Regulatory compliance review",
        "Risk assessment and mitigation",
      ],
    },
    {
      icon: Users2,
      title: "Consultation",
      description: "Expert structural engineering consultation and advisory services.",
      features: [
        "Structural auditing and assessment",
        "Technical guidance and advice",
        "Peer review services",
        "Problem-solving solutions",
        "Expert witness testimony",
      ],
    },
  ]

  const processSteps = [
    {
      number: "01",
      title: "Initial Consultation",
      description: "We begin with a thorough discussion of your project requirements, goals, and vision.",
    },
    {
      number: "02",
      title: "Analysis & Planning",
      description: "Our team conducts comprehensive analysis and develops detailed project plans.",
    },
    {
      number: "03",
      title: "Design & Development",
      description: "We create precise structural designs and documentation for your project.",
    },
    {
      number: "04",
      title: "Implementation",
      description: "Our experts oversee the implementation phase to ensure quality and compliance.",
    },
    {
      number: "05",
      title: "Quality Assurance",
      description: "Rigorous testing and inspection procedures verify all work meets our high standards.",
    },
    {
      number: "06",
      title: "Project Completion",
      description: "Final review, documentation, and handover of the completed project.",
    },
  ]

  return (
    <div className="relative">
      <StructuralBackground />
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-8 sm:py-12 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4">
                Our <span className="text-red-500">Services</span>
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto sm:mx-0">
                Comprehensive structural engineering and construction services delivered with precision and expertise.
              </p>
              <div className="w-16 sm:w-20 h-1 bg-red-500 mt-4 mx-auto sm:mx-0"></div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-gray-50">
          <div className="container px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 text-gray-900">
                Our Core Services
              </h2>
              <div className="h-1 w-16 sm:w-20 bg-red-500 mx-auto mb-4 sm:mb-6"></div>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed px-4">
                We offer a comprehensive range of structural engineering and construction services tailored to meet the
                unique needs of each project.
              </p>
            </div>

            <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
              {services.map((service) => (
                <Card
                  key={service.title}
                  className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                >
                  <div className="h-2 bg-red-500 w-full group-hover:bg-red-600 transition-colors"></div>
                  <CardHeader className="pt-6 sm:pt-8 px-4 sm:px-6">
                    <div className="p-2 sm:p-3 bg-red-50 rounded-lg w-fit mb-3 sm:mb-4 group-hover:bg-red-100 transition-colors">
                      <service.icon className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <ul className="space-y-2 sm:space-y-3">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-white">
          <div className="container px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 text-gray-900">
                Our Process
              </h2>
              <div className="h-1 w-16 sm:w-20 bg-red-500 mx-auto mb-4 sm:mb-6"></div>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed px-4">
                We follow a systematic approach from concept to completion, ensuring every detail meets the highest
                standards of quality and safety.
              </p>
            </div>

            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {processSteps.map((step) => (
                <div
                  key={step.number}
                  className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-red-500"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-red-500 mb-3 sm:mb-4">{step.number}</div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quality Section */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-gray-50">
          <div className="container px-4 sm:px-6">
            <div className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-1 md:grid-cols-3">
              <div className="space-y-4 md:border-r border-gray-200 md:pr-6 lg:pr-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Quality Assurance</h3>
                <div className="h-1 w-10 sm:w-12 bg-red-500 mb-3 sm:mb-4"></div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Our team maintains the highest standards of structural integrity and construction quality throughout
                  the project lifecycle. We implement rigorous quality control procedures and regular inspections to
                  ensure excellence in every aspect of our work.
                </p>
              </div>
              <div className="space-y-4 md:border-r border-gray-200 md:px-6 lg:px-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Client Support</h3>
                <div className="h-1 w-10 sm:w-12 bg-red-500 mb-3 sm:mb-4"></div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  We provide ongoing support and maintenance services after project completion to ensure long-term
                  satisfaction. Our dedicated team remains available to address any concerns, provide guidance, and
                  offer solutions as needed throughout the lifecycle of your structure.
                </p>
              </div>
              <div className="space-y-4 md:pl-6 lg:pl-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Our Commitment</h3>
                <div className="h-1 w-10 sm:w-12 bg-red-500 mb-3 sm:mb-4"></div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  At Arrow Structures, we are committed to delivering exceptional results that exceed client
                  expectations. We approach each project with dedication, integrity, and a focus on building lasting
                  relationships based on trust and mutual success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-white border-t">
          <div className="container px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-6">
                Ready to Start Your Project?
              </h2>
              <div className="h-1 w-16 sm:w-20 bg-red-500 mx-auto mb-4 sm:mb-6"></div>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-4">
                Contact our team today to discuss your project requirements and discover how our services can bring your
                vision to life.
              </p>
              <Button asChild size="lg" className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto">
                <Link href="/contact">Contact Us Today</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
