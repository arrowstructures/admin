"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { Building2, Users2, Award, Calendar } from "lucide-react"

type Slide = {
  id: string
  slider_image: string
  title: string
  description: string
}

export function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSlides = async () => {
      const { data, error } = await supabase.from("slider").select("*")
      if (error) {
        console.error("Error fetching slides:", error.message)
      } else {
        setSlides(data || [])
      }
      setLoading(false)
    }

    fetchSlides()
  }, [])

  // Auto-advance slides
  useEffect(() => {
    if (slides.length === 0) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [slides])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh] sm:h-[70vh]">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (slides.length === 0) {
    return <div className="flex items-center justify-center h-[50vh] sm:h-[70vh] text-gray-600">No slides found.</div>
  }

  return (
    <section className="relative h-[50vh] sm:h-[70vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentSlide ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={slide.slider_image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="container relative z-10 flex h-full items-center text-white px-4">
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4">{slide.title}</h1>
              <p className="text-sm sm:text-lg mb-6 opacity-90">{slide.description}</p>
              <Button asChild size="lg">
                <Link href="/portfolio">View Projects</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Stats Overlay - Same design for mobile and web */}
      <div className="absolute bottom-0 right-0">
        <div className="container py-4 sm:py-6 md:py-8 px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 text-center text-white">
            <div className="space-y-1 sm:space-y-2">
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1 text-white/80" />
              <div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold">500+</div>
              <div className="text-xs sm:text-sm md:text-base opacity-90">
                <span className="block sm:hidden">Projects</span>
                <span className="hidden sm:block">Projects Completed</span>
              </div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Users2 className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1 text-white/80" />
              <div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold">10+</div>
              <div className="text-xs sm:text-sm md:text-base opacity-90">
                <span className="block sm:hidden">Team</span>
                <span className="hidden sm:block">Team Members</span>
              </div>
            </div>
        
            <div className="space-y-1 sm:space-y-2">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-1 text-white/80" />
              <div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold">10+</div>
              <div className="text-xs sm:text-sm md:text-base opacity-90">
                <span className="block sm:hidden">Experience</span>
                <span className="hidden sm:block">Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple dots indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
