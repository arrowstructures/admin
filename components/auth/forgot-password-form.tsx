"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/providers/supabase-auth-provider"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await resetPassword(email)

      if (error) {
        toast.error("Password reset failed", {
          description: error.message || "Please check your email and try again.",
        })
        return
      }

      setIsSubmitted(true)
      toast.success("Password reset email sent", {
        description: "Check your email for the password reset link.",
      })
    } catch (error) {
      toast.error("Password reset failed", {
        description: "An unexpected error occurred. Please try again.",
      })
      console.error("Password reset error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Check your email</h1>
          <p className="text-gray-500 dark:text-gray-400">We&apos;ve sent a password reset link to {email}</p>
        </div>
        <div className="text-center">
          <Link href="/auth/login">
            <Button variant="outline">Back to login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your email and we&apos;ll send you a password reset link
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>
      <div className="text-center text-sm">
        Remember your password?{" "}
        <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
          Back to login
        </Link>
      </div>
    </div>
  )
}
