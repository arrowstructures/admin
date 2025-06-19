"use client"
import { useEffect, useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Share2, User, Check } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"

type News = {
  id: string
  headline: string
  summary: string
  content: string
  created_at: string
}

// Loading skeleton component
function ArticleSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <section className="py-6 border-b border-gray-100">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="w-32 h-6 bg-gray-200 rounded"></div>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="w-20 h-6 bg-red-200 rounded mb-6"></div>
          <div className="w-full h-12 bg-gray-200 rounded mb-6"></div>
          <div className="flex space-x-6 mb-8">
            <div className="w-32 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="aspect-[16/9] bg-gray-200 rounded-2xl"></div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="space-y-4">
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Related news skeleton
function RelatedNewsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[16/10] bg-gray-200 rounded-lg mb-4"></div>
          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function NewsDetailPage() {
  const params = useParams()
  const [news, setNews] = useState<News | null>(null)
  const [relatedNews, setRelatedNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [relatedLoading, setRelatedLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!params.id) return

      try {
        // Fetch main article first for faster initial render
        const { data: newsData, error: newsError } = await supabase
          .from("news")
          .select("*")
          .eq("id", params.id)
          .single()

        if (newsError) {
          console.error("Error fetching news:", newsError)
          setNews(null)
        } else {
          setNews(newsData as News)
        }
        setLoading(false)

        // Fetch related news separately to avoid blocking main content
        const { data: relatedData, error: relatedError } = await supabase
          .from("news")
          .select("id, headline, summary, created_at")
          .neq("id", params.id)
          .order("created_at", { ascending: false })
          .limit(6)

        if (relatedError) {
          console.error("Error fetching related news:", relatedError)
        } else {
          setRelatedNews(relatedData as News[])
        }
        setRelatedLoading(false)
      } catch (error) {
        console.error("Unexpected error:", error)
        setLoading(false)
        setRelatedLoading(false)
      }
    }

    fetchNewsDetail()
  }, [params.id])

  const handleShare = async () => {
    const url = window.location.href
    const title = news?.headline || "Check out this news article"
    const text = news?.summary || "Breaking news from Arrow Structures"

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        })
        toast.success("Article shared successfully!")
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error)
          // Fallback to copy URL
          copyToClipboard(url)
        }
      }
    } else {
      // Fallback: Copy URL to clipboard
      copyToClipboard(url)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("Article URL copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
      toast.error("Failed to copy URL")
    }
  }

  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(news?.headline || "")
    const text = encodeURIComponent(news?.summary || "")

    let shareUrl = ""

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${title}%20${url}`
        break
      default:
        return
    }

    window.open(shareUrl, "_blank", "width=600,height=400")
    toast.success(`Shared to ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`)
  }

  if (loading) {
    return <ArticleSkeleton />
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">News Article Not Found</h1>
          <Link href="/newsroom">
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Newsroom
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <section className="py-6 border-b border-gray-100">
        <div className="container max-w-4xl mx-auto px-4">
          <Link href="/newsroom" prefetch={true}>
            <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 p-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Newsroom
            </Button>
          </Link>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">{news.headline}</h1>

          <div className="flex items-center space-x-6 text-gray-600 mb-8">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="font-medium">Arrow Structures</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
              {copied ? "Copied!" : "Share Article"}
            </Button>

            {/* Social Media Share Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => shareToSocial("twitter")}
                variant="outline"
                size="sm"
                className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
              >
                Twitter
              </Button>
              <Button
                onClick={() => shareToSocial("facebook")}
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                Facebook
              </Button>
              <Button
                onClick={() => shareToSocial("linkedin")}
                variant="outline"
                size="sm"
                className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
              >
                LinkedIn
              </Button>
              <Button
                onClick={() => shareToSocial("whatsapp")}
                variant="outline"
                size="sm"
                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              >
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="mb-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/placeholder.svg?height=600&width=1000"
              alt={news.headline}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">{news.summary}</p>

            <div className="text-gray-800 leading-relaxed space-y-6">
              {news.content.split("\n").map(
                (paragraph, index) =>
                  paragraph.trim() && (
                    <p key={index} className="text-lg leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related News */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Related News</h2>
            <div className="w-20 h-1 bg-red-500"></div>
          </div>

          <Suspense fallback={<RelatedNewsSkeleton />}>
            {relatedLoading ? (
              <RelatedNewsSkeleton />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedNews.map((relatedItem) => (
                  <Link key={relatedItem.id} href={`/newsroom/${relatedItem.id}`} prefetch={false}>
                    <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden h-full">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=300&width=500"
                          alt={relatedItem.headline}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="text-white">
                            <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">
                              {relatedItem.headline}
                            </h3>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">NEWS</span>
                        </div>
                      </div>
                      <CardContent className="p-6 bg-white flex-1">
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{relatedItem.summary}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 font-medium">ARROW STRUCTURES</span>
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 p-0">
                            READ MORE <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </Suspense>

          {!relatedLoading && relatedNews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No related news articles found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
