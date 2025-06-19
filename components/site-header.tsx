"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Services", href: "/services" },
    { name: "Blogs", href: "/blogs" },
    { name: "Newsroom", href: "/newsroom" },
    { name: "Career", href: "/career" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 ease-out",
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent",
        )}
      >
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 py-2 sm:py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 sm:space-x-3 transition-all duration-300 ease-out hover:scale-105 transform"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="object-contain sm:w-10 sm:h-10 transition-all duration-300"
              priority
            />
            <div className="flex flex-col items-start">
              <span
                className="text-gray-900 font-regular leading-none tracking-tight text-sm sm:text-lg transition-colors duration-300"
                style={{
                  fontFamily: "Roboto, 'Helvetica Neue', Arial, sans-serif,bebas neue",
                  letterSpacing: "0.2em",
                }}
              >
                ARROW
              </span>
              <span
                className="text-gray-900 font-regular leading-none tracking-tight text-sm sm:text-lg transition-colors duration-300"
                style={{
                  fontFamily: "Roboto, 'Helvetica Neue', Arial, sans-serif,bebas neue",
                  letterSpacing: "0.2em",
                }}
              >
                STRUCTURES
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-all duration-300 ease-out hover:scale-105 hover:text-primary transform relative",
                  "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
                  pathname === item.href ? "text-primary font-semibold after:w-full" : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10 transition-all duration-300 ease-out hover:scale-110 hover:bg-gray-100/80"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <Menu
                className={cn(
                  "h-6 w-6 absolute inset-0 transition-all duration-300 ease-out",
                  isOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100",
                )}
              />
              <X
                className={cn(
                  "h-6 w-6 absolute inset-0 transition-all duration-300 ease-out",
                  isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75",
                )}
              />
            </div>
          </Button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-500 ease-out",
          isOpen ? "visible" : "invisible",
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500 ease-out",
            isOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setIsOpen(false)}
        />

        {/* Mobile Menu - Slides from Right */}
        <div
          className={cn(
            "fixed top-14 sm:top-16 right-0 w-80 h-full bg-white/95 backdrop-blur-md shadow-2xl",
            "transform transition-all duration-500 ease-out",
            isOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="py-8 px-6 h-full overflow-y-auto">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-base font-medium transition-all duration-300 ease-out",
                    "hover:bg-gray-100/80 hover:scale-105 rounded-xl px-4 py-4 -mx-4",
                    "transform hover:translate-x-2 relative overflow-hidden",
                    "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary before:transition-all before:duration-300",
                    pathname === item.href
                      ? "text-primary font-semibold bg-primary/10 before:opacity-100 translate-x-2"
                      : "text-muted-foreground hover:text-primary before:opacity-0 hover:before:opacity-100",
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: isOpen ? `slideInRight 0.4s ease-out forwards` : "none",
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}
