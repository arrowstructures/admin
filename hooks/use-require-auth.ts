"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/providers/supabase-auth-provider"

export function useRequireAuth(redirectTo = "/auth/login") {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Check if the current route is a view route
  const isViewRoute = pathname.startsWith("/articles/view/")
  const isPublicRoute = pathname === "/public-articles" || isViewRoute

  useEffect(() => {
    if (!isLoading && !user && !isPublicRoute) {
      router.push(redirectTo)
    }
  }, [user, isLoading, router, redirectTo, isPublicRoute])

  return { user, isLoading }
}
