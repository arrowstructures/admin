"use client"

import type * as React from "react"
import { Building2, Users, FolderOpen, Briefcase, Newspaper, ImageIcon, MessageSquare, User } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Blogs",
      url: "/blogs",
      icon: MessageSquare,
      isActive: true,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: FolderOpen,
    },
    {
      title: "Clients",
      url: "/clients",
      icon: Users,
    },
    {
      title: "Team",
      url: "/team",
      icon: User,
    },
    {
      title: "Careers",
      url: "/careers",
      icon: Briefcase,
    },
    {
      title: "News",
      url: "/news",
      icon: Newspaper,
    },
    {
      title: "Slider",
      url: "/slider",
      icon: ImageIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Building2 className="h-6 w-6" />
          <span className="font-semibold">Arrow Structures</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
