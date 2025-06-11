"use client"

import type * as React from "react"
import {
  Palette,
  Users,
  FolderOpen,
  Briefcase,
  Newspaper,
  ImageIcon,
  MessageSquare,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Search,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, SidebarFooter } from "@/components/ui/sidebar"
import { supabase } from "@/lib/supabaseClient"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Professional navigation structure
const data = {
  navMain: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
          description: "Analytics & insights",
        },
      ],
    },
    {
      title: "Content Management",
      items: [
        {
          title: "Blog Posts",
          url: "/blogs",
          icon: MessageSquare,
        
          description: "Manage blog content",
        },
        {
          title: "News Articles",
          url: "/news",
          icon: Newspaper,
          
          description: "Latest news updates",
        },
        {
          title: "Projects",
          url: "/projects",
          icon: FolderOpen,
          
          description: "Portfolio projects",
        },
      ],
    },
    {
      title: "People & Careers",
      items: [
        {
          title: "Team Members",
          url: "/team",
          icon: User,
          
          description: "Staff management",
        },
        {
          title: "Clients",
          url: "/clients",
          icon: Users,
          
          description: "Client relationships",
        },
        {
          title: "Job Openings",
          url: "/careers",
          icon: Briefcase,
          
          description: "Career opportunities",
        },
      ],
    },
    {
      title: "Media & Assets",
      items: [
        {
          title: "Image Slider",
          url: "/slider",
          icon: ImageIcon,
         
          description: "Homepage carousel",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200/60 bg-white shadow-sm" {...props}>
      {/* Professional Header */}
      <SidebarHeader className="border-b border-gray-200/60 bg-gradient-to-r from-white to-gray-50/30">
        <div className="flex items-center gap-3 px-6 py-5">
       
          <div className="flex flex-col">
            <span className="text-base font-bold text-gray-900 tracking-tight">Yesp Web Studio</span>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Admin </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 bg-gray-50/50 border-gray-200/60 focus:bg-white focus:border-red-300 focus:ring-red-100 text-sm"
            />
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="bg-white px-3 py-4">
        <NavMain items={data.navMain} searchQuery={searchQuery} />
      </SidebarContent>

      {/* Professional Footer */}
      <SidebarFooter className="border-t border-gray-200/60 bg-gradient-to-r from-white to-gray-50/30 p-4">
        {loading ? (
          <div className="flex items-center gap-3 p-2">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200"></div>
            <div className="flex-1">
              <div className="h-3 w-24 animate-pulse rounded bg-gray-200"></div>
              <div className="mt-2 h-2 w-20 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 p-3 h-auto hover:bg-gray-50/80 rounded-xl transition-all duration-200 text-gray-900 hover:text-gray-900"
              >
                <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                  <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-red-100 to-red-50 text-red-700 text-sm font-semibold">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col items-start text-left">
                  <span className="text-sm font-semibold text-gray-900">
                    {user.user_metadata?.full_name || "Admin User"}
                  </span>
                  <span className="text-xs text-gray-500 truncate max-w-[140px] font-medium">{user.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="h-5 px-2 text-xs bg-green-100 text-green-700 border-green-200">
                    Online
                  </Badge>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-xl rounded-xl p-2">
              <DropdownMenuLabel className="text-gray-900 font-semibold px-3 py-2">
                Account Management
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-100" />
              <DropdownMenuItem className="text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg px-3 py-2 cursor-pointer">
                <Settings className="mr-3 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">Settings</span>
                  <span className="text-xs text-gray-500">Preferences & config</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg px-3 py-2 cursor-pointer">
                <Bell className="mr-3 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">Notifications</span>
                  <span className="text-xs text-gray-500">Manage alerts</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-100" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg px-3 py-2 cursor-pointer"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">Sign Out</span>
                  <span className="text-xs text-red-500">End session</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
          onClick={() => window.location.href = "mailto:contact@yesptech.in"}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 rounded-xl h-11 font-semibold"
        >
          Help Desk
        </Button>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
