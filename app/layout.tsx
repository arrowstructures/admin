import "@/styles/globals.css"


import type React from "react"

import { Inter } from "next/font/google"


import { SonnerProvider } from "@/components/sonner-provider"
import { StorageInitializer } from "@/components/storage-initializer"
import { SupabaseAuthProvider } from "@/providers/supabase-auth-provider"
import MainLayout from "@/components/layouts/main-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Arrow Structures - Structural Consultancy",
  description: "Innovative and sustainable structural solutions for modern construction projects",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseAuthProvider>
          <StorageInitializer />
          <MainLayout>{children}</MainLayout>
          <SonnerProvider />
        </SupabaseAuthProvider>
      </body>
    </html>
  )
}
