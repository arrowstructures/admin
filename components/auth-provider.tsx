"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { LoadingScreen } from "@/components/loading-screen"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

const publicRoutes = ["/auth/login", "/auth/signup"]
const landingRoute = "/"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  const isPublicRoute = publicRoutes.includes(pathname)
  const isLandingRoute = pathname === landingRoute
  const isAuthenticated = !!user

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error) {
          console.error("Error getting user:", error)
          setUser(null)
        } else {
          setUser(user)
        }
      } catch (error) {
        console.error("Error in getUser:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      setUser(session?.user ?? null)
      setLoading(false)

      // Handle auth state changes
      if (event === "SIGNED_IN" && session?.user) {
        // Redirect to dashboard after successful login
        router.push("/dashboard")
      } else if (event === "SIGNED_OUT") {
        // Redirect to login after logout
        router.push("/auth/login")
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  // Handle redirects based on authentication state
  useEffect(() => {
    if (loading) return // Don't redirect while loading

    if (isAuthenticated) {
      // If user is logged in and trying to access auth pages, redirect to dashboard
      if (isPublicRoute) {
        router.push("/dashboard")
        return
      }
    } else {
      // If user is not logged in and trying to access protected routes
      if (!isPublicRoute && !isLandingRoute) {
        router.push("/auth/login")
        return
      }
    }
  }, [loading, isAuthenticated, isPublicRoute, isLandingRoute, router])

  if (loading) {
    return <LoadingScreen />
  }

  // If user is authenticated and not on auth pages, show admin layout with sidebar
  if (isAuthenticated && !isPublicRoute) {
    return (
      <AuthContext.Provider value={{ user, loading }}>
        <div className="bg-white min-h-screen">
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <AppHeader />
              <main className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-white">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </AuthContext.Provider>
    )
  }

  // For public routes (login/signup) or landing page, show simple layout
  return (
    <AuthContext.Provider value={{ user, loading }}>
      <div className="min-h-screen bg-white">{children}</div>
    </AuthContext.Provider>
  )
}
