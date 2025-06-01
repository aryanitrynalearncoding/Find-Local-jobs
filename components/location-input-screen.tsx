"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Screen } from "@/app/page"

interface LocationInputScreenProps {
  onNavigate: (screen: Screen) => void
  onLocationSearch: (location: string) => void
}

const globalLocations = [
  "New York, USA",
  "Paris, France",
  "Tokyo, Japan",
  "Mumbai, India",
  "Lagos, Nigeria",
  "São Paulo, Brazil",
  "London, UK",
  "Sydney, Australia",
  "Dubai, UAE",
  "Singapore",
  "Toronto, Canada",
  "Berlin, Germany",
  "Seoul, South Korea",
  "Mexico City, Mexico",
  "Cairo, Egypt",
  "Bangkok, Thailand",
  "Istanbul, Turkey",
  "Moscow, Russia",
  "Buenos Aires, Argentina",
  "Johannesburg, South Africa",
]

export function LocationInputScreen({ onNavigate, onLocationSearch }: LocationInputScreenProps) {
  const [location, setLocation] = useState("")
  const [filteredLocations, setFilteredLocations] = useState(globalLocations)

  const handleLocationChange = (value: string) => {
    setLocation(value)
    if (value) {
      const filtered = globalLocations.filter((loc) => loc.toLowerCase().includes(value.toLowerCase()))
      setFilteredLocations(filtered)
    } else {
      setFilteredLocations(globalLocations)
    }
  }

  const handleLocationSelect = (selectedLocation: string) => {
    onLocationSearch(selectedLocation)
  }

  return (
    <div className="min-h-screen bg-white max-w-[360px] mx-auto">
      {/* Header */}
      <div className="flex items-center p-4 bg-gray-100 border-b">
        <Button variant="ghost" size="sm" onClick={() => onNavigate("home")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="ml-4 text-lg font-bold">DESTINATION</h1>
      </div>

      {/* Location Input */}
      <div className="p-4">
        <Input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => handleLocationChange(e.target.value)}
          className="w-full p-4 text-center bg-gray-100 border-0 rounded-lg"
        />
      </div>

      {/* Location Suggestions */}
      <div className="px-4 pb-4">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredLocations.map((loc, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start p-3 text-left hover:bg-gray-100"
              onClick={() => handleLocationSelect(loc)}
            >
              {loc}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
