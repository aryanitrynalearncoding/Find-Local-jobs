"use client"

import { Menu, Search, Bell, Home, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Screen, Store, UserData } from "@/app/page"

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void
  onStoreSelect: (store: Store) => void
  onLocationSearch: (location: string) => void
  userData: UserData
}

const mockStores: Store[] = [
  {
    id: "1",
    name: "Weymans-Palo",
    address: "123 Main St, Downtown",
    price: "15$",
    image: "/placeholder.svg?height=120&width=160",
    owner: { name: "John Palo", avatar: "/placeholder.svg?height=40&width=40" },
  },
  {
    id: "2",
    name: "LST-Margo",
    address: "456 Oak Ave, Midtown",
    price: "20$",
    image: "/placeholder.svg?height=120&width=160",
    owner: { name: "Lisa Margo", avatar: "/placeholder.svg?height=40&width=40" },
  },
  {
    id: "3",
    name: "Original-shaine",
    address: "789 Pine Rd, Uptown",
    price: "25$",
    image: "/placeholder.svg?height=120&width=160",
    owner: { name: "Shane Original", avatar: "/placeholder.svg?height=40&width=40" },
  },
  {
    id: "4",
    name: "Google-Ram",
    address: "321 Tech Blvd, Silicon Valley",
    price: "30$",
    image: "/placeholder.svg?height=120&width=160",
    owner: { name: "Ram Google", avatar: "/placeholder.svg?height=40&width=40" },
  },
]

const mockJobs: Store[] = [
  {
    id: "5",
    name: "Fashion Store",
    address: "Downtown Fashion District",
    price: "18$/hour",
    image: "/placeholder.svg?height=120&width=160",
    owner: { name: "Fashion Owner", avatar: "/placeholder.svg?height=40&width=40" },
    description: "Looking for sales associate",
  },
  {
    id: "6",
    name: "Tech Repair Shop",
    address: "Tech Hub Area",
    price: "22$/hour",
    image: "/placeholder.svg?height=120&width=160",
    owner: { name: "Tech Owner", avatar: "/placeholder.svg?height=40&width=40" },
    description: "Need experienced technician",
  },
]

export function HomeScreen({ onNavigate, onStoreSelect, onLocationSearch, userData }: HomeScreenProps) {
  const isStoreOwner = userData.role === "storeOwner"
  const displayData = isStoreOwner ? mockStores : mockJobs
  const sectionTitle = isStoreOwner ? "📍 STORES NEAR YOU" : "💼 JOBS NEAR YOU"

  return (
    <div className="min-h-screen bg-background max-w-[360px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => onNavigate("settings")}>
          <Menu className="w-6 h-6" />
        </Button>
        <Button variant="ghost" className="font-bold text-lg" onClick={() => onNavigate("home")}>
          FL JOBS
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onNavigate("profile")}>
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            <img src="/placeholder.svg?height=32&width=32" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </Button>
      </div>

      {/* Welcome Message */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <h2 className="text-lg font-semibold text-foreground">Welcome back, {userData.name}!</h2>
        <p className="text-sm text-muted-foreground">
          {isStoreOwner ? "Manage your store and find employees" : "Find your next job opportunity"}
        </p>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Search Section */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground"
            onClick={() => onNavigate("location-input")}
          >
            <Search className="w-4 h-4 mr-2" />
            Search destination
          </Button>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 bg-muted rounded"></div>
            <span>Recent Visit</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">{sectionTitle}</h2>

          <div className="grid grid-cols-2 gap-3">
            {displayData.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-lg shadow-sm border border-border p-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onStoreSelect(item)}
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-20 object-cover rounded-md mb-2"
                />
                <h3 className="font-semibold text-sm mb-1 text-foreground">{item.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{item.address}</p>
                <div className="flex items-center justify-between">
                  <img
                    src={item.owner.avatar || "/placeholder.svg"}
                    alt={item.owner.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-semibold text-green-600">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[360px] bg-background border-t border-border">
        <div className="flex justify-around py-2">
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
            <Bell className="w-5 h-5" />
            <span className="text-xs">Notifications</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-primary">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>
          {isStoreOwner && (
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1"
              onClick={() => onNavigate("upload")}
            >
              <Upload className="w-5 h-5" />
              <span className="text-xs">Upload</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
