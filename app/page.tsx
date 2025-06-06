"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, FolderOpen, Briefcase, Newspaper, MessageSquare } from "lucide-react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

const quickActions = [
  {
    title: "Manage Blogs",
    description: "Create and edit blog posts",
    icon: MessageSquare,
    href: "/blogs",
    color: "text-blue-600",
  },
  {
    title: "Manage Projects",
    description: "Add and update project portfolio",
    icon: FolderOpen,
    href: "/projects",
    color: "text-green-600",
  },
  {
    title: "Manage Clients",
    description: "Update client information",
    icon: Users,
    href: "/clients",
    color: "text-purple-600",
  },
  {
    title: "Team Management",
    description: "Manage team members",
    icon: Users,
    href: "/team",
    color: "text-orange-600",
  },
  {
    title: "Career Postings",
    description: "Manage job postings",
    icon: Briefcase,
    href: "/careers",
    color: "text-red-600",
  },
  {
    title: "News Updates",
    description: "Publish company news",
    icon: Newspaper,
    href: "/news",
    color: "text-indigo-600",
  },
]

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Building2 className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Arrow Structures Admin</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Please log in to access the admin panel and manage your content.
        </p>
        <Button asChild size="lg">
          <Link href="/auth/login">Login to Continue</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">
          Logged in as <span className="font-medium">{user.email}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Card key={action.href} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{action.title}</CardTitle>
              <action.icon className={`h-4 w-4 ${action.color}`} />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{action.description}</CardDescription>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={action.href}>Manage</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
