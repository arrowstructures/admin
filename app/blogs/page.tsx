
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ChevronLeft, ChevronRight, Calendar, Clock, Search, Star, User } from "lucide-react"
import { supabase } from "@/lib/supabase"
// Ensure this import path is correct for your formatTimeAgo function
import { formatTimeAgo } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { StructuralBackground } from "@/components/structural-background"

// Blog type definition based on your database schema
type Blog = {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  tag: string
  featured_post: boolean
  publish_immediately: boolean
  created_at: string // This will be a string from Supabase
}

type BlogClient = {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  tag: string
  featuredPost: boolean
  publishImmediately: boolean
  createdAt: Date // This will be a Date object after conversion
}

// Helper function to convert snake_case to camelCase
const snakeToCamel = (blog: Blog): BlogClient => {
  return {
    id: blog.id,
    title: blog.title,
    excerpt: blog.excerpt,
    content: blog.content,
    image: blog.image,
    category: blog.category,
    tag: blog.tag,
    featuredPost: blog.featured_post,
    publishImmediately: blog.publish_immediately,
    createdAt: new Date(blog.created_at), // Correctly converts string to Date object
  }
}

// Loading skeleton for blog cards
function BlogCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[16/10] bg-gray-200 rounded-lg mb-4"></div>
      <div className="space-y-2 p-4 sm:p-6">
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
        <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}

export default function BlogsPage() {
  const [allBlogs, setAllBlogs] = useState<BlogClient[]>([])
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogClient[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false) // This state is not currently used but good to keep if implementing infinite scroll
  const [displayCount, setDisplayCount] = useState(12)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  // Simple fetch function - load all blogs at once
  const fetchBlogs = async () => {
    setLoading(true)
    try {
      console.log("Fetching blogs from database...")

      // Fetch all blogs that should be published
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("publish_immediately", true)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching blogs:", error)
      } else {
        console.log("Fetched blogs data:", data)

        // Convert snake_case to camelCase and Date objects
        const formattedData = data.map(snakeToCamel)

        // Set featured blogs (those marked as featured_post)
        const featured = formattedData.filter((blog) => blog.featuredPost).slice(0, 4)
        setFeaturedBlogs(featured)

        // Set all blogs
        setAllBlogs(formattedData || [])

        // Extract unique categories
        const uniqueCategories = [...new Set(formattedData.map((blog) => blog.category))]
        const categoryOptions = [
          { id: "all", name: "All Articles" },
          ...uniqueCategories.map((cat) => ({ id: cat, name: cat })),
        ]
        setCategories(categoryOptions)
      }
    } catch (error) {
      console.error("Unexpected error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  // Auto-slide functionality
  useEffect(() => {
    if (featuredBlogs.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredBlogs.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [featuredBlogs.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredBlogs.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredBlogs.length) % featuredBlogs.length)
  }

  const loadMore = () => {
    setDisplayCount((prev) => prev + 12)
  }

  // Filter blogs based on search and category
  const filteredBlogs = allBlogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // Assuming content can be large, consider if full content search is needed
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tag.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || blog.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-white relative">
      <StructuralBackground />
      <div className="relative z-10">
        {/* Title Section - Newsroom Style */}
        <section className="py-8 sm:py-12 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
              <div className="text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">
                  Engineering <span className="text-red-500">Newsroom</span>
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
                  Stay updated with the latest insights, developments, and technical breakthroughs from our engineering
                  team.
                </p>
                <div className="w-16 sm:w-20 h-1 bg-red-500 mt-4 mx-auto md:mx-0"></div>
              </div>
              <div className="w-full md:w-1/3 max-w-md mx-auto md:mx-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 h-10 sm:h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                {searchTerm && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center">
                    Showing {filteredBlogs.length} of {allBlogs.length} articles
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-4 sm:py-6 bg-white border-b">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-start md:justify-center space-x-2 sm:space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap transition-all duration-200 min-w-fit ${
                    selectedCategory === category.id
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-500"
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Articles Slider */}
        {featuredBlogs.length > 0 && (
          <section className="py-6 sm:py-8">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-red-500 fill-current" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Featured Articles</h2>
                </div>
                <div className="w-12 sm:w-16 h-1 bg-red-500"></div>
              </div>

              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {featuredBlogs.map((blog, index) => (
                    <div key={blog.id} className="w-full flex-shrink-0 relative">
                      <Link href={`/blogs/${blog.id}`} prefetch={false} className="block">
                        <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[21/8]">
                          <Image
                            src={blog.image || "/placeholder.svg?height=400&width=1200"}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            loading={index === 0 ? "eager" : "lazy"}
                            sizes="100vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>

                          {/* Content Overlay */}
                          <div className="absolute inset-0 flex items-center">
                            <div className="container max-w-7xl mx-auto px-4 sm:px-6">
                              <div className="max-w-xl sm:max-w-2xl text-white">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                  <Badge className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 text-xs font-bold uppercase tracking-wide">
                                    FEATURED
                                  </Badge>
                                  <Badge variant="outline" className="border-white/30 text-white text-xs">
                                    {blog.category}
                                  </Badge>
                                  <span className="text-xs sm:text-sm opacity-90">{formatTimeAgo(blog.createdAt)}</span>
                                </div>
                                <h2 className="text-lg sm:text-2xl md:text-4xl font-bold leading-tight mb-2 sm:mb-4 line-clamp-2">
                                  {blog.title}
                                </h2>
                                <p className="text-sm sm:text-lg opacity-90 mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3">
                                  {blog.excerpt || blog.content?.substring(0, 150) + "..." || "No content available"}
                                </p>
                                <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold text-xs sm:text-sm">
                                  READ FULL STORY
                                  <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                {featuredBlogs.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-1.5 sm:p-2 rounded-full transition-all duration-200"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-1.5 sm:p-2 rounded-full transition-all duration-200"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                    </button>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2">
                      {featuredBlogs.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                            index === currentSlide ? "bg-red-500" : "bg-white/50 hover:bg-white/70"
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* All Articles Grid */}
        <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">ALL ARTICLES</h2>
              <div className="w-16 sm:w-20 h-1 bg-red-500 mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">
                {filteredBlogs.length} article{filteredBlogs.length !== 1 ? "s" : ""} available
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[...Array(12)].map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-12 sm:py-24">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">No articles found</h3>
                <p className="text-gray-500 text-sm sm:text-base mb-4">Try adjusting your search or filter criteria</p>
                {searchTerm && (
                  <Button onClick={() => setSearchTerm("")} variant="outline">
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredBlogs.slice(0, displayCount).map((blog) => (
                    <Link key={blog.id} href={`/blogs/${blog.id}`} prefetch={false}>
                      <Card className="group cursor-pointer hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden h-full bg-white">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image
                            src={blog.image || "/placeholder.svg?height=300&width=500"}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                            <div className="text-white">
                              <div className="flex items-center space-x-2 text-xs mb-2 opacity-90">
                                <Calendar className="w-3 h-3" />
                                <span>{formatTimeAgo(blog.createdAt)}</span>
                                <span>•</span>
                                <Clock className="w-3 h-3" />
                                <span>5 min read</span> {/* This is a placeholder, you might want to calculate this dynamically */}
                              </div>
                              <h3 className="font-bold text-sm sm:text-lg leading-tight mb-2 line-clamp-2">
                                {blog.title}
                              </h3>
                            </div>
                          </div>
                          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex space-x-2">
                            {blog.featuredPost && (
                              <Badge className="bg-red-500 text-white px-2 py-1 text-xs font-bold">
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                FEATURED
                              </Badge>
                            )}
                            <Badge className="bg-blue-500 text-white px-2 py-1 text-xs font-bold">
                              {blog.category.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4 sm:p-6 bg-white flex-1">
                          <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 mb-4 leading-relaxed">
                            {blog.excerpt || blog.content?.substring(0, 150) + "..." || "No content available"}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <User className="w-3 h-3" />
                              <span className="font-medium">ENGINEERING TEAM</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600 p-0 text-xs sm:text-sm"
                            >
                              READ MORE <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Load More Button */}
                {displayCount < filteredBlogs.length && (
                  <div className="text-center mt-8 sm:mt-12">
                    <Button
                      onClick={loadMore}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 sm:px-8"
                    >
                      Load More Articles ({filteredBlogs.length - displayCount} remaining)
                    </Button>
                  </div>
                )}

                {/* End of articles indicator */}
                {displayCount >= filteredBlogs.length && filteredBlogs.length > 12 && (
                  <div className="text-center mt-8 sm:mt-12">
                    <p className="text-gray-500 text-sm">You've reached the end of our articles</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
