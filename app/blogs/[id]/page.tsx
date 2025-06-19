"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, Share2, User, Tag, Check, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatTimeAgo } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"

type Blog = {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  image?: string
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
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
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

function ImageModal({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
}: {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  imageAlt: string
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
          aria-label="Close image"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={imageAlt}
            fill
            className="object-contain"
            sizes="100vw"
            quality={100}
          />
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
          Click anywhere or press ESC to close
        </div>
      </div>
    </div>
  )
}

export default function BlogDetailPage() {
  const params = useParams()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)

  useEffect(() => {
    const fetchBlogDetail = async () => {
      if (!params.id) return

      try {
        // Fetch main blog first for faster initial render
        const { data: blogData, error: blogError } = await supabase
          .from("blogs")
          .select("*")
          .eq("id", params.id)
          .single()

        if (blogError) {
          console.error("Error fetching blog:", blogError)
          setBlog(null)
        } else {
          setBlog(blogData as Blog)
        }
        setLoading(false)
      } catch (error) {
        console.error("Unexpected error:", error)
        setLoading(false)
      }
    }

    fetchBlogDetail()
  }, [params.id])

  const handleShare = async () => {
    const url = window.location.href
    const title = blog?.title || "Check out this blog post"
    const text = blog?.excerpt || "Interesting article from Arrow Structures"

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
    const title = encodeURIComponent(blog?.title || "")
    const text = encodeURIComponent(blog?.excerpt || "")

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

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <Link href="/blogs">
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
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
          <Link href="/blogs" prefetch={true}>
            <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 p-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-2 w-fit">
              <Tag className="w-3 h-3" />
              {blog.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">{blog.title}</h1>

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
      {blog.image && (
        <section className="mb-12">
          <div className="container max-w-4xl mx-auto px-4">
            <div
              className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl cursor-pointer group transition-transform hover:scale-[1.02]"
              onClick={() => setShowImageModal(true)}
            >
              <Image
                src={blog.image || "/placeholder.svg"}
                alt={blog.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to view full size
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">{blog.excerpt}</p>

            <div className="text-gray-800 leading-relaxed space-y-6">
              {blog.content.split("\n").map(
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
      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageSrc={blog.image || "/placeholder.svg"}
        imageAlt={blog.title}
      />
    </div>
  )
}
