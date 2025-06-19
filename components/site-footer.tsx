import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

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
    <footer className="bg-slate-900 text-slate-200">
      <div className="container py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4 sm:space-y-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Arrow Structures Logo" className="h-8 w-8 sm:h-10 sm:w-10" />
              <div className="flex flex-col leading-tight">
                <span className="text-lg sm:text-xl font-bold text-white">ARROW</span>
                <span className="text-lg sm:text-xl font-bold text-white">STRUCTURES</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-400 max-w-xs leading-relaxed">
              Providing innovative structural engineering solutions and construction services since 2017.
            </p>

            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm sm:text-base text-slate-400 hover:text-white transition-colors hover:underline"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-white">Services</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href="/services"
                  className="text-sm sm:text-base text-slate-400 hover:text-white transition-colors hover:underline"
                >
                  Residential Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm sm:text-base text-slate-400 hover:text-white transition-colors hover:underline"
                >
                  Commercial Development
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm sm:text-base text-slate-400 hover:text-white transition-colors hover:underline"
                >
                  Structural Design
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm sm:text-base text-slate-400 hover:text-white transition-colors hover:underline"
                >
                  Project Management
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm sm:text-base text-slate-400 hover:text-white transition-colors hover:underline"
                >
                  Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  5, Guru Govind Singh Road, R.S Puram, Coimbatore – 641002, Tamil Nadu, India
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-slate-400 mr-3 flex-shrink-0" />
                <Link
                  href="tel:+918870594827"
                  className="text-sm sm:text-base text-slate-400 hover:text-white transition-colors"
                >
                  +91 88705 94827
                </Link>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-slate-400 mr-3 flex-shrink-0" />
                <Link
                  href="mailto:arrowstructures@gmail.com"
                  className="text-sm sm:text-base text-slate-400 hover:text-white transition-colors break-all"
                >
                  arrowstructures@gmail.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-800 text-center">
          <p className="text-xs sm:text-sm text-slate-400">© {currentYear} Arrow Structures. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
