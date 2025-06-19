"use client";

import Link from "next/link";
import { UserProfile } from "@/components/user-profile";
import { useAuth } from "@/providers/supabase-auth-provider";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function Header() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  // Determine if we're on the public articles page
  const isPublicArticlesPage = pathname === "/public-articles";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl">
            Tamil Qatar
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {!isLoading && (
            <>
              {user ? (
                <>
                  {/* Show link to admin dashboard for authenticated users */}
                  {isPublicArticlesPage && (
                    <Link href="/articles">
                      <Button variant="outline">Admin Dashboard</Button>
                    </Link>
                  )}
                  <UserProfile />
                </>
              ) : (
                <>
                  {/* Show auth links for non-authenticated users */}
                  <Link href="/auth/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
