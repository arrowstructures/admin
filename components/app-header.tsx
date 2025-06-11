"use client"

import { UserAuthButton } from "@/components/user-auth-button"
import { useAuth } from "@/components/auth-provider"
import { Building2 } from "lucide-react"

export function AppHeader() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold">Arrow Structures Admin</h1>
          </div>
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <Building2 className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-lg font-semibold">Arrow Structures</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-3">
              <div className="text-sm text-right hidden sm:block">
                <p className="font-medium">{user.email}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <UserAuthButton email={user.email || ""} />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
