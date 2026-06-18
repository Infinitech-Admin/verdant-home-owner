"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  MapPin,
  Navigation,
  Search,
  Phone,
  Building2,
  Hospital,
  Shield,
  FireExtinguisher,
  School,
  Landmark,
} from "lucide-react"
import Link from "next/link"
import CitizenLayout from "@/components/citizenLayout"

interface Location {
  id: string
  name: string
  category: string
  address: string
  phone?: string
  lat: number
  lng: number
  icon: string
}

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const categories = [
    { value: "all", label: "All", icon: MapPin, color: "bg-[#d4a574]" },
    { value: "hospital", label: "Hospitals", icon: Hospital, color: "bg-red-600" },
    { value: "police", label: "Police", icon: Shield, color: "bg-blue-600" },
    { value: "fire", label: "Fire Dept", icon: FireExtinguisher, color: "bg-orange-600" },
    { value: "government", label: "Gov't", icon: Building2, color: "bg-purple-600" },
    { value: "school", label: "Schools", icon: School, color: "bg-green-600" },
    { value: "landmark", label: "Landmarks", icon: Landmark, color: "bg-teal-600" },
  ]

  const locations: Location[] = [
    {
      id: "1",
      name: "Las Piñas General Hospital",
      category: "hospital",
      address: "Zapote-Alabang Road, Las Piñas City",
      phone: "(02) 8874-6565",
      lat: 14.4419,
      lng: 120.9834,
      icon: "hospital",
    },
    {
      id: "2",
      name: "Las Piñas Police Station",
      category: "police",
      address: "Real St, Las Piñas City",
      phone: "(02) 8874-2345",
      lat: 14.4464,
      lng: 120.9830,
      icon: "police",
    },
    {
      id: "3",
      name: "Las Piñas Fire Station",
      category: "fire",
      address: "Alabang-Zapote Road, Las Piñas City",
      phone: "(02) 8874-3333",
      lat: 14.4450,
      lng: 120.9845,
      icon: "fire",
    },
    {
      id: "4",
      name: "Las Piñas City Hall",
      category: "government",
      address: "Daniel Fajardo St, Las Piñas City",
      phone: "(02) 8874-1111",
      lat: 14.4461,
      lng: 120.9828,
      icon: "government",
    },
    {
      id: "5",
      name: "Las Piñas National High School",
      category: "school",
      address: "Naga Road, Las Piñas City",
      phone: "(02) 8874-4567",
      lat: 14.4380,
      lng: 120.9790,
      icon: "school",
    },
    {
      id: "6",
      name: "SM City Southmall",
      category: "landmark",
      address: "Alabang-Zapote Road, Las Piñas City",
      lat: 14.4507,
      lng: 120.9843,
      icon: "landmark",
    },
    {
      id: "7",
      name: "Bamboo Organ Church",
      category: "landmark",
      address: "San Jose Parish, Las Piñas City",
      phone: "(02) 8872-0469",
      lat: 14.4469,
      lng: 120.9825,
      icon: "landmark",
    },
    {
      id: "8",
      name: "Las Piñas Public Market",
      category: "landmark",
      address: "Zapote-Alabang Road, Las Piñas City",
      lat: 14.4430,
      lng: 120.9820,
      icon: "landmark",
    },
  ]

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        }
      )
    }
  }, [])

  const filteredLocations = locations.filter((location) => {
    const matchesCategory = selectedCategory === "all" || location.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getLocationIcon = (category: string) => {
    const cat = categories.find((c) => c.value === category)
    return cat ? cat.icon : MapPin
  }

  const getLocationColor = (category: string) => {
    const cat = categories.find((c) => c.value === category)
    return cat ? cat.color : "bg-gray-500"
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return (R * c).toFixed(1)
  }

  return (
    <CitizenLayout>
      <div className="flex flex-col min-h-screen bg-[#0f241a]">
        {/* Header */}
        <header className="bg-[#1a3a2e] text-[#d4a574] px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold">City Map</h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locations..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#2d5a45] text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4a574] border border-[#3d6a55]"
            />
          </div>
        </header>

        {/* Category Filter */}
        <div className="bg-[#1a3a2e] border-b border-[#2d5a45] px-4 py-3 overflow-x-auto">
          <div className="flex gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                    selectedCategory === category.value
                      ? `${category.color} text-white`
                      : "bg-[#2d5a45] text-gray-300 hover:bg-[#3d6a55]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Default Map Embed */}
        <div className="relative h-64 border-b border-[#2d5a45]">
          <iframe
            src="https://www.google.com/maps?q=Las+Piñas+City+Hall,+Las+Piñas+City&z=15&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          {userLocation && (
            <div className="absolute top-4 right-4 bg-[#2d5a45] rounded-full p-3 shadow-lg border border-[#3d6a55]">
              <Navigation className="w-5 h-5 text-[#d4a574]" />
            </div>
          )}
        </div>

        {/* Locations List */}
        <main className="flex-1 px-4 py-4 overflow-y-auto pb-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#d4a574]">
              {filteredLocations.length} Location{filteredLocations.length !== 1 ? "s" : ""}
            </h2>
            {userLocation && (
              <button className="text-sm text-[#d4a574] font-semibold flex items-center gap-1 hover:text-[#c49564]">
                <Navigation className="w-4 h-4" />
                Sort by distance
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filteredLocations.map((location) => {
              const Icon = getLocationIcon(location.category)
              const distance =
                userLocation && calculateDistance(userLocation.lat, userLocation.lng, location.lat, location.lng)

              const mapsUrl = userLocation
                ? `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${location.lat},${location.lng}`
                : `https://www.google.com/maps?q=${location.lat},${location.lng}`

              return (
                <a
                  key={location.id}
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[#1a3a2e] border border-[#2d5a45] rounded-xl p-4 hover:bg-[#2d5a45] hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`${getLocationColor(location.category)} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-200 mb-1">{location.name}</h3>
                      <p className="text-sm text-gray-300 mb-2 flex items-start gap-1">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{location.address}</span>
                      </p>

                      <div className="flex items-center gap-4">
                        {location.phone && (
                          <a
                            href={`tel:${location.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm text-[#d4a574] font-semibold flex items-center gap-1 hover:text-[#c49564]"
                          >
                            <Phone className="w-4 h-4" />
                            {location.phone}
                          </a>
                        )}
                        {distance && (
                          <span className="text-sm text-gray-400 flex items-center gap-1">
                            <Navigation className="w-4 h-4" />
                            {distance} km away
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </main>
      </div>
    </CitizenLayout>
  )
}
