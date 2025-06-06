"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const routeMap: Record<string, { title: string; parent?: string }> = {
  "/blogs": { title: "All Blogs", parent: "Blogs" },
  "/blogs/add": { title: "Add New Blog", parent: "Blogs" },
  "/news": { title: "All News", parent: "News" },
  "/news/add": { title: "Add New News", parent: "News" },
  "/careers": { title: "All Careers", parent: "Careers" },
  "/careers/add": { title: "Add Career", parent: "Careers" },
  "/projects": { title: "All Projects", parent: "Projects" },
  "/projects/add": { title: "Add New Project", parent: "Projects" },
  "/projects/categories": { title: "Project Categories", parent: "Projects" },
  "/clients": { title: "All Clients", parent: "Clients" },
  "/clients/add": { title: "Add New Client", parent: "Clients" },
  "/clients/reviews": { title: "Client Reviews", parent: "Clients" },
  "/slider": { title: "All Slides", parent: "Slider" },
  "/slider/add": { title: "Add New Slide", parent: "Slider" },
  "/slider/settings": { title: "Slider Settings", parent: "Slider" },
  "/team": { title: "All Team Members", parent: "Team" },
  "/team/add": { title: "Add Team Member", parent: "Team" },
  "/team/roles": { title: "Team Roles", parent: "Team" },
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  const currentRoute = routeMap[pathname]

  if (!currentRoute) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/">Arrow Structures</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Admin Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">Arrow Structures</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">Admin Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        {currentRoute.parent && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbPage>{currentRoute.parent}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{currentRoute.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
