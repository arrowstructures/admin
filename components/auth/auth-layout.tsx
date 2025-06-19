import type React from "react"
import Image from "next/image"
import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center border-b px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/abstract-logo.png" alt="Logo" width={32} height={32} className="rounded-md" />
          <span className="text-lg font-semibold">Newsletter Admin</span>
        </Link>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-md py-12">{children}</div>
      </main>
      <footer className="border-t py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Newsletter Admin. All rights reserved.
      </footer>
    </div>
  )
}
