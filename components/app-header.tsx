"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { UserAuthButton } from "@/components/user-auth-button"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

export function AppHeader() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // Listen for auth changes
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
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold">Arrow Structures Admin</h1>
          </div>
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold">Arrow Structures Admin</h1>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="text-sm">
                <span className="text-muted-foreground">Logged in as:</span>
                <span className="ml-1 font-medium">{user.email}</span>
              </div>
              <UserAuthButton email={user.email || ""} />
            </div>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link href="/auth/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
