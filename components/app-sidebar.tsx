"use client"

import type * as React from "react"
import { Building2, FileText, Newspaper, Users, FolderOpen, UserCheck, Images, UserPlus } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Projects",
      url: "#",
      icon: FolderOpen,
      items: [
        {
          title: "All Projects",
          url: "/projects",
        },
        {
          title: "Add New Project",
          url: "/projects/add",
        },
        {
          title: "All Categories",
          url: "/projects/categories",
        },
        {
          title: "Categories Add",
          url: "/projects/categories/add",
        },
      ],
    },
    {
      title: "Clients",
      url: "#",
      icon: UserCheck,
      items: [
        {
          title: "All Clients",
          url: "/clients",
        },
        {
          title: "Add New Client",
          url: "/clients/add",
        },
      ],
    },
    {
      title: "Slider",
      url: "#",
      icon: Images,
      items: [
        {
          title: "All Slides",
          url: "/slider",
        },
        {
          title: "Add New Slide",
          url: "/slider/add",
        },
        {
          title: "Slider Settings",
          url: "/slider/settings",
        },
      ],
    },
    {
      title: "Team",
      url: "#",
      icon: UserPlus,
      items: [
        {
          title: "All Team Members",
          url: "/team",
        },
        {
          title: "Add Team Member",
          url: "/team/add",
        },
        {
          title: "Team Roles",
          url: "/team/roles",
        },
      ],
    },
    {
      title: "Blogs",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "All Blogs",
          url: "/blogs",
        },
        {
          title: "Add New Blog",
          url: "/blogs/add",
        },
        {
          title: "Add New category",
          url: "/blogs/categories/add",
        },
      ],
    },
    {
      title: "News",
      url: "#",
      icon: Newspaper,
      items: [
        {
          title: "All News",
          url: "/news",
        },
        {
          title: "Add New News",
          url: "/news/add",
        },
      ],
    },
    {
      title: "Careers",
      url: "#",
      icon: Users,
      items: [
        {
          title: "All Careers",
          url: "/careers",
        },
        {
          title: "Add Career",
          url: "/careers/add",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Arrow Structures</span>
                  <span className="truncate text-xs">Admin Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Content Management</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <Collapsible key={item.title} asChild defaultOpen={false} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Admin User</span>
                <span className="truncate text-xs">admin@arrowstructures.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
