import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if the user is authenticated
  const isAuthenticated = !!session;

  // Get the pathname
  const path = req.nextUrl.pathname;

  // Define routes
  const isArticleViewRoute = path.match(/^\/articles\/view\/[^/]+$/) !== null;
  const isAuthRoute = path.startsWith("/auth/");

  // All other article routes are protected
  const isProtectedArticleRoute =
    path.startsWith("/articles/") && !isArticleViewRoute;
  const isArticlesListRoute = path === "/articles";

  // Redirect logic
  if (!isAuthenticated) {
    // If trying to access protected routes, redirect to login
    if (isProtectedArticleRoute || isArticlesListRoute) {
      const redirectUrl = new URL("/login", req.url);
      redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  } else if (isAuthRoute) {
    // Redirect authenticated users away from auth pages
    return NextResponse.redirect(new URL("/articles", req.url));
  }

  return res;
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    "/articles",
    "/articles/:path*",
    "/auth/:path*",
    "/public-articles",
  ],
};
