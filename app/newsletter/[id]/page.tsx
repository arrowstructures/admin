// app/newsletter/[id]/page.tsx
"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

type News = {
  id: string;
  headline: string;
  summary: string;
  content: string;
}

export default function NewsletterDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [newsletter, setNewsletter] = useState<News | null>(null)

  useEffect(() => {
    const fetchNewsletter = async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        console.error("Error fetching newsletter:", error)
      } else {
        setNewsletter(data)
      }
    }

    if (id) {
      fetchNewsletter()
    }
  }, [id])

  if (!newsletter) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <section className="py-12 md:py-24 container">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        ← Back to Newsletters
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{newsletter.headline}</CardTitle>
          <CardDescription className="text-md mt-2">{newsletter.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm leading-7 whitespace-pre-line">{newsletter.content}</p>
        </CardContent>
      </Card>
    </section>
  )
}
