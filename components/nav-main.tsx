"use client"

import { Plus, Circle } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
  searchQuery = "",
}: {
  items: {
    title: string
    items: {
      title: string
      url: string
      icon?: any
      badge?: string
      description?: string
    }[]
  }[]
  searchQuery?: string
}) {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Filter items based on search query
  const filteredItems = items
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <div className="space-y-6">
      {filteredItems.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 mb-3">
            {group.title}
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            {group.items.map((item) => {
              const isActive = pathname === item.url || pathname.startsWith(item.url + "/")

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.description}
                    className={cn(
                      "group/item relative h-11 rounded-xl transition-all duration-200 hover:shadow-sm",
                      isActive
                        ? "bg-gradient-to-r from-red-50 to-red-50/50 text-red-700 shadow-sm border border-red-100/50"
                        : "hover:bg-gray-50/80 text-gray-700",
                    )}
                    onMouseEnter={() => setHoveredItem(item.title)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link href={item.url} className="flex items-center gap-3 px-3 py-2 w-full">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                          isActive
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-500 group-hover/item:bg-gray-200",
                        )}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              "font-semibold text-sm truncate",
                              isActive ? "text-red-700" : "text-gray-900",
                            )}
                          >
                            {item.title}
                          </span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                "h-5 px-2 text-xs font-bold ml-2 transition-colors",
                                isActive
                                  ? "bg-red-100 text-red-700 border-red-200"
                                  : "bg-gray-100 text-gray-600 border-gray-200",
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <span
                            className={cn(
                              "text-xs truncate block mt-0.5",
                              isActive ? "text-red-600/80" : "text-gray-500",
                            )}
                          >
                            {item.description}
                          </span>
                        )}
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <Circle className="h-2 w-2 fill-red-500 text-red-500" />
                        </div>
                      )}

                      {/* Hover quick action */}
                      {hoveredItem === item.title && !isActive && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 opacity-0 group-hover/item:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            // Handle quick action
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}

      {searchQuery && filteredItems.length === 0 && (
        <div className="px-3 py-8 text-center">
          <div className="text-gray-400 text-sm">No results found for "{searchQuery}"</div>
        </div>
      )}
    </div>
  )
}
