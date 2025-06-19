"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Client = {
  id: string
  client_name: string
  email: string
  mobile_number: string
  client_logo_url: string
  location: string
  company_name: string
  created_at: string
}

type ClientLogosProps = {
  clients?: Client[]
}

export function ClientLogos({ clients: propClients }: ClientLogosProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchClients() {
      try {
        const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: true })

        if (error) {
          console.error("Error fetching clients:", error)
          return
        }

        setClients(data || [])
      } catch (error) {
        console.error("Error fetching clients:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!propClients) {
      fetchClients()
    } else {
      setClients(propClients)
      setLoading(false)
    }
  }, [propClients])

  // Fallback data if no clients are available
  const fallbackLogos = [
    {
      id: "1",
      client_name: "Client 1",
      company_name: "Company 1",
      client_logo_url: "",
      email: "",
      mobile_number: "",
      location: "",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      client_name: "Client 2",
      company_name: "Company 2",
      client_logo_url: "",
      email: "",
      mobile_number: "",
      location: "",
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      client_name: "Client 3",
      company_name: "Company 3",
      client_logo_url: "",
      email: "",
      mobile_number: "",
      location: "",
      created_at: new Date().toISOString(),
    },
    {
      id: "4",
      client_name: "Client 4",
      company_name: "Company 4",
      client_logo_url: "",
      email: "",
      mobile_number: "",
      location: "",
      created_at: new Date().toISOString(),
    },
    {
      id: "5",
      client_name: "Client 5",
      company_name: "Company 5",
      client_logo_url: "",
      email: "",
      mobile_number: "",
      location: "",
      created_at: new Date().toISOString(),
    },
    {
      id: "6",
      client_name: "Client 6",
      company_name: "Company 6",
      client_logo_url: "",
      email: "",
      mobile_number: "",
      location: "",
      created_at: new Date().toISOString(),
    },
    {
      id: "7",
      client_name: "Client 7",
      company_name: "Company 7",
      client_logo_url: "",
      email: "",
      mobile_number: "",
      location: "",
      created_at: new Date().toISOString(),
    },
    {
      id: "8",
      client_name: "Client 8",
      company_name: "Company 8",
      client_logo_url: "",
      email: "",
      mobile_number: "",
      location: "",
      created_at: new Date().toISOString(),
    },
  ]

  const clientLogos = clients.length > 0 ? clients : fallbackLogos

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gray-50 overflow-hidden">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Clients</h2>
            <p className="text-muted-foreground">Trusted by leading organizations across various industries</p>
          </div>
          <div className="flex justify-center items-center space-x-16">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-48 h-24 bg-gray-200 animate-pulse rounded" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 bg-gray-50 overflow-hidden">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Clients</h2>
          <p className="text-muted-foreground">Trusted by leading organizations across various industries</p>
        </div>

        <div className="relative">
          <div className="flex animate-scroll space-x-16">
            {/* First set of logos */}
            {clientLogos.map((client) => (
              <div
                key={`first-${client.id}`}
                className="flex-shrink-0 flex items-center justify-center w-48 h-24 transition-all duration-300 hover:scale-105"
              >
                <Image
                  src={
                    client.client_logo_url && client.client_logo_url.trim() !== ""
                      ? client.client_logo_url
                      : `/placeholder.svg?height=90&width=180&text=${encodeURIComponent(client.company_name || client.client_name)}`
                  }
                  alt={`${client.company_name || client.client_name} logo`}
                  width={180}
                  height={90}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement
                    target.src = `/placeholder.svg?height=90&width=180&text=${encodeURIComponent(client.company_name || client.client_name)}`
                  }}
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {clientLogos.map((client) => (
              <div
                key={`second-${client.id}`}
                className="flex-shrink-0 flex items-center justify-center w-48 h-24 transition-all duration-300 hover:scale-105"
              >
                <Image
                  src={
                    client.client_logo_url && client.client_logo_url.trim() !== ""
                      ? client.client_logo_url
                      : `/placeholder.svg?height=90&width=180&text=${encodeURIComponent(client.company_name || client.client_name)}`
                  }
                  alt={`${client.company_name || client.client_name} logo`}
                  width={180}
                  height={90}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement
                    target.src = `/placeholder.svg?height=90&width=180&text=${encodeURIComponent(client.company_name || client.client_name)}`
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 10s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
