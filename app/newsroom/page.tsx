"use client"
import { useEffect, useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ChevronLeft, ChevronRight, Search, Calendar, User, Star } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatTimeAgo } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { StructuralBackground } from "@/components/structural-background"

type News = {
  id: string
  headline: string
  summary: string
  content: string
  image: string
  featured_news: boolean
  publish_immediately: boolean
  created_at: string
  updated_at: string
}

// Helper function to get proper image URL
function getImageUrl(imagePath: string): string {
  if (!imagePath) return "/placeholder.svg?height=400&width=600"

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }

  // If it's a Supabase storage path
  if (imagePath.startsWith("news/") || imagePath.startsWith("/news/")) {
    const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${cleanPath}`
  }

  // If it's a relative path, assume it's in public folder
  if (imagePath.startsWith("/")) {
    return imagePath
  }

  // Default fallback
  return "/placeholder.svg?height=400&width=600"
}

// Loading skeleton for news cards
function NewsCardSkeleton() {
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

export default function NewsroomPage() {
  const [allNews, setAllNews] = useState<News[]>([])
  const [featuredNews, setFeaturedNews] = useState<News[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(9)
  const [searchTerm, setSearchTerm] = useState("")

  // Memoize filtered news for better performance
  const filteredNews = useMemo(() => {
    return allNews.filter(
      (news) =>
        news.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.summary.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [allNews, searchTerm])

  // Optimized fetch function
  const fetchNews = useCallback(async () => {
    setLoading(true)
    try {
      console.log("Fetching news from database...")

      // Optimized query - only fetch needed fields initially
      const { data, error } = await supabase
        .from("news")
        .select("id, headline, summary, image, featured_news, publish_immediately, created_at, updated_at")
        .eq("publish_immediately", true)
        .order("created_at", { ascending: false })
        .limit(100) // Increased limit for better UX

      if (error) {
        console.error("Error fetching news:", error)
        return
      }

      console.log("Fetched news data:", data)
      const newsData = data as News[]

      // Separate featured news for slider
      const featured = newsData.filter((news) => news.featured_news).slice(0, 4)
      setFeaturedNews(featured)

      // All news for the grid
      setAllNews(newsData || [])
    } catch (error) {
      console.error("Unexpected error:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  // Auto-slide functionality with cleanup
  useEffect(() => {
    if (featuredNews.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredNews.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [featuredNews.length])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % featuredNews.length)
  }, [featuredNews.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + featuredNews.length) % featuredNews.length)
  }, [featuredNews.length])

  const loadMore = useCallback(() => {
    setDisplayCount((prev) => prev + 9)
  }, [])

  return (
    <div className="min-h-screen bg-white relative">
      <StructuralBackground />
      <div className="relative z-10">
        {/* Title Section */}
        <section className="py-8 sm:py-12 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
              <div className="text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">
                  Arrow Structures <span className="text-red-500">Newsroom</span>
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
                  Stay updated with the latest news and developments from Arrow Structures.
                </p>
                <div className="w-16 sm:w-20 h-1 bg-red-500 mt-4 mx-auto md:mx-0"></div>
              </div>
              <div className="w-full md:w-1/3 max-w-md mx-auto md:mx-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search news..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 h-10 sm:h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                {searchTerm && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center">
                    Showing {filteredNews.length} of {allNews.length} articles
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Featured News Slider */}
        {featuredNews.length > 0 && (
          <section className="py-6 sm:py-8">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-red-500 fill-current" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Featured News</h2>
                </div>
                <div className="w-12 sm:w-16 h-1 bg-red-500"></div>
              </div>

              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {featuredNews.map((news, index) => (
                    <div key={news.id} className="w-full flex-shrink-0 relative">
                      <Link href={`/newsroom/${news.id}`} prefetch={false} className="block">
                        <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[21/8]">
                          <Image
                            src={getImageUrl(news.image) || "/placeholder.svg"}
                            alt={news.headline}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            loading={index === 0 ? "eager" : "lazy"}
                            sizes="100vw"
                            onError={(e) => {
                              console.error("Image failed to load:", news.image)
                              e.currentTarget.src = "/placeholder.svg?height=400&width=1200"
                            }}
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
                                  <span className="text-xs sm:text-sm opacity-90">
                                    {formatTimeAgo(new Date(news.created_at))}
                                  </span>
                                  {news.updated_at !== news.created_at && (
                                    <Badge variant="outline" className="text-white border-white/50 text-xs">
                                      Updated
                                    </Badge>
                                  )}
                                </div>
                                <h2 className="text-lg sm:text-2xl md:text-4xl font-bold leading-tight mb-2 sm:mb-4 line-clamp-2">
                                  {news.headline}
                                </h2>
                                <p className="text-sm sm:text-lg opacity-90 mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3">
                                  {news.summary}
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
                {featuredNews.length > 1 && (
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
                      {featuredNews.map((_, index) => (
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

        {/* All News - Grid */}
        <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">ALL NEWS</h2>
              <div className="w-16 sm:w-20 h-1 bg-red-500 mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">
                {filteredNews.length} article{filteredNews.length !== 1 ? "s" : ""} available
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[...Array(9)].map((_, i) => (
                  <NewsCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-12 sm:py-24">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">No news found</h3>
                <p className="text-gray-500 text-sm sm:text-base mb-4">Try adjusting your search criteria</p>
                {searchTerm && (
                  <Button onClick={() => setSearchTerm("")} variant="outline">
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredNews.slice(0, displayCount).map((news, index) => (
                    <Link key={news.id} href={`/newsroom/${news.id}`} prefetch={false}>
                      <Card className="group cursor-pointer hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden h-full">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image
                            src={getImageUrl(news.image) || "/placeholder.svg"}
                            alt={news.headline}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            onError={(e) => {
                              console.error("Image failed to load:", news.image)
                              e.currentTarget.src = "/placeholder.svg?height=300&width=500"
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                            <div className="text-white">
                              <div className="flex items-center gap-2 text-xs mb-2 opacity-90">
                                <Calendar className="w-3 h-3" />
                                <span>{formatTimeAgo(new Date(news.created_at))}</span>
                                {news.updated_at !== news.created_at && (
                                  <Badge variant="secondary" className="text-xs px-1 py-0">
                                    Updated
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-bold text-sm sm:text-lg leading-tight mb-2 line-clamp-2">
                                {news.headline}
                              </h3>
                            </div>
                          </div>
                          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-2">
                            {news.featured_news && (
                              <Badge className="bg-red-500 text-white px-2 py-1 text-xs font-bold">
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                FEATURED
                              </Badge>
                            )}
                            <Badge className="bg-blue-500 text-white px-2 py-1 text-xs font-bold">NEWS</Badge>
                          </div>
                        </div>
                        <CardContent className="p-4 sm:p-6 bg-white flex-1">
                          <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 mb-4 leading-relaxed">
                            {news.summary}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <User className="w-3 h-3" />
                              <span className="font-medium">ARROW STRUCTURES</span>
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
                {displayCount < filteredNews.length && (
                  <div className="text-center mt-8 sm:mt-12">
                    <Button
                      onClick={loadMore}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 sm:px-8"
                    >
                      Load More Articles
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
      
       
      </div>
    </div>
  )
}
