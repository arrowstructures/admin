"use client"

import { useAuth } from "@/components/auth-provider"
import { LoadingScreen } from "@/components/loading-screen"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, FolderOpen, Briefcase, Newspaper, MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const quickActions = [
  {
    title: "Manage Blogs",
    description: "Create and edit blog posts",
    icon: MessageSquare,
    href: "/blogs",
    color: "text-red-600",
  },
  {
    title: "Manage Projects",
    description: "Add and update project portfolio",
    icon: FolderOpen,
    href: "/projects",
    color: "text-red-600",
  },
  {
    title: "Manage Clients",
    description: "Update client information",
    icon: Users,
    href: "/clients",
    color: "text-red-600",
  },
  {
    title: "Team Management",
    description: "Manage team members",
    icon: Users,
    href: "/team",
    color: "text-red-600",
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
    color: "text-red-600",
  },
]

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <LoadingScreen />
  }

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-red-50 to-black rounded-lg p-6 border border-red-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back!</h1>
            <p className="text-gray-600 mt-2">
              Logged in as <span className="font-medium text-gray-900">{user.email}</span>
            </p>
          </div>
          <Building2 className="h-12 w-12 text-red-500" />
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Card
              key={action.href}
              className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-gray-200 bg-white"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium group-hover:text-red-600 transition-colors text-gray-900">
                  {action.title}
                </CardTitle>
                <action.icon className={`h-5 w-5 ${action.color} group-hover:scale-110 transition-transform`} />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-xs text-gray-600">{action.description}</CardDescription>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-red-500 group-hover:text-black group-hover:border-red-500 transition-colors"
                >
                  <Link href={action.href} className="flex items-center justify-center gap-2">
                    Manage
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
