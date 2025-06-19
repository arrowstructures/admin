"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone, Send, Clock, CheckCircle } from "lucide-react"
import { StructuralBackground } from "@/components/structural-background"
import { useState } from "react"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      console.log("Submitting form with values:", values)

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      console.log("Response status:", response.status)

      const responseData = await response.json()
      console.log("Response data:", responseData)

      if (response.ok) {
        setIsSubmitted(true)
        form.reset()
        toast.success("Message sent successfully! We'll get back to you soon.")
      } else {
        console.error("Server error:", responseData)
        toast.error(responseData.error || "Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error("Network error sending email:", error)
      toast.error("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Office",
      content: "5, Guru Govind Singh Road, R.S Puram, Coimbatore – 641002, Tamil Nadu, India",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+91 88705 94827",
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "contact@arrowstructures.com",
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 9:00 AM - 2:00 PM",
    },
  ]

  return (
    <div className="relative min-h-screen">
      <StructuralBackground />

      {/* Header Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4">
              Contact <span className="text-red-500">Us</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto sm:mx-0">
              Ready to discuss your project? Get in touch with our expert team for professional structural engineering
              solutions.
            </p>
            <div className="w-16 sm:w-20 h-1 bg-red-500 mt-4 mx-auto sm:mx-0"></div>
          </div>
        </div>
      </section>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
                Let's Build Something
                <span className="block text-red-500">Amazing Together</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                Ready to bring your structural engineering project to life? Our expert team is here to provide
                innovative solutions tailored to your specific needs.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 md:mb-16">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/10 backdrop-blur-sm"
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-red-500/20 transition-colors">
                      <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                    </div>
                    <h3 className="font-semibold mb-2 text-foreground text-sm sm:text-base">{info.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 whitespace-pre-line leading-relaxed">
                      {info.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 sm:py-12 md:py-16 bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid gap-8 sm:gap-10 md:gap-12 lg:gap-16 lg:grid-cols-2 items-start">
              {/* Contact Form */}
              <div className="order-2 lg:order-1">
                <Card className="border-0 shadow-xl bg-white">
                  <CardContent className="p-6 sm:p-8">
                    <div className="mb-6 sm:mb-8">
                      <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Send us a Message</h2>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Fill out the form below and we'll get back to you within 24 hours.
                      </p>
                    </div>

                    {isSubmitted ? (
                      <div className="text-center py-6 sm:py-8">
                        <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">Message Sent Successfully!</h3>
                        <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
                          Thank you for reaching out. We'll get back to you soon.
                        </p>
                        <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full sm:w-auto">
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm sm:text-base font-medium">Full Name *</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your full name"
                                      className="h-10 sm:h-12 border-2 focus:border-red-500 transition-colors text-sm sm:text-base"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm sm:text-base font-medium">Phone Number *</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your phone number"
                                      className="h-10 sm:h-12 border-2 focus:border-red-500 transition-colors text-sm sm:text-base"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm sm:text-base font-medium">Email Address *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter your email address"
                                    type="email"
                                    className="h-10 sm:h-12 border-2 focus:border-red-500 transition-colors text-sm sm:text-base"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm sm:text-base font-medium">Project Details *</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tell us about your project requirements, timeline, and any specific needs..."
                                    className="min-h-[120px] sm:min-h-[150px] border-2 focus:border-red-500 transition-colors resize-none text-sm sm:text-base"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            size="lg"
                            disabled={isSubmitting}
                            className="w-full h-10 sm:h-12 bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Sending Message...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Send Message
                              </>
                            )}
                          </Button>

                          <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
                            By submitting this form, you agree to our privacy policy and terms of service.
                          </p>
                        </form>
                      </Form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Map */}
              <div className="order-1 lg:order-2">
                <Card className="border-0 shadow-xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video sm:aspect-square lg:aspect-[4/5]">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.360271171325!2d76.95477537416216!3d11.00215795480896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba858fc91c8cf23%3A0x1a2e6e134d037a35!2s5%2C%20Guru%20Govind%20Singh%20Rd%2C%20R.S.%20Puram%2C%20Coimbatore%2C%20Tamil%20Nadu%20641002!5e0!3m2!1sen!2sin!4v1707744235092!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="grayscale hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
