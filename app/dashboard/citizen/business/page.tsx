"use client"

import { useState } from "react"
import { ArrowLeft, Home, Grid3x3, Newspaper, AlertTriangle, User } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CitizenLayout from "@/components/citizenLayout"

export default function BusinessPage() {
  const [activeTab, setActiveTab] = useState("services")

  const businessServices = [
    {
      category: "Business Support",
      items: [
        { name: "Tax Assistance", description: "Business tax consultation", icon: "💰", link: "/dashboard/citizen/services/tax-assistance" },
        { name: "Business Development", description: "Growth and expansion support", icon: "📈" },
        { name: "Trade Fairs", description: "Participate in city trade events", icon: "🏪" },
      ],
    },
    {
      category: "Compliance",
      items: [
        { name: "Zoning Clearance", description: "Check zoning requirements", icon: "🗺️" },
        { name: "Environmental Compliance", description: "Environmental clearance", icon: "🌱" },
        { name: "Labor Compliance", description: "Employment regulations", icon: "👥" },
      ],
    },
  ]

  return (
    <CitizenLayout>
      <div className="flex flex-col min-h-screen bg-[#0f241a]">
        {/* Header */}
        <header className="bg-[#1a3a2e] px-4 py-4 border-b border-[#2d5a45]">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/citizen">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#2d5a45]">
                <ArrowLeft className="w-5 h-5 text-[#d4a574]" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-[#d4a574]">Business Services</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 pb-24 overflow-y-auto">
          <Card className="mb-6 border-[#3d6a55] bg-[#2d5a45]">
            <CardContent className="p-4">
              <h2 className="font-semibold text-[#d4a574] mb-2">Grow Your Business in Calapan</h2>
              <p className="text-sm text-gray-300">
                Access permits, licenses, and business support services all in one place.
              </p>
            </CardContent>
          </Card>

          {businessServices.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h2 className="text-lg font-semibold text-[#d4a574] mb-3">{section.category}</h2>
              <div className="space-y-3">
                {section.items.map((item, itemIdx) => (
                  <Card key={itemIdx} className="border-[#2d5a45] bg-[#1a3a2e]">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#2d5a45] rounded-xl flex items-center justify-center text-2xl">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-200">{item.name}</h3>
                          <p className="text-sm text-gray-300">{item.description}</p>
                        </div>
                        {item.link ? (
                          <Link href={item.link}>
                            <Button variant="ghost" size="sm" className="text-[#d4a574] hover:text-[#c49564] hover:bg-[#2d5a45]">
                              View
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-[#d4a574] hover:text-[#c49564] hover:bg-[#2d5a45]">
                            Apply
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </CitizenLayout>
  )
}
