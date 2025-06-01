"use client"

import { ArrowLeft, Bell, Home, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Screen, Store, UserData } from "@/app/page"

interface LocationResultsScreenProps {
  onNavigate: (screen: Screen) => void
  onStoreSelect: (store: Store) => void
  searchLocation: string
  userData: UserData | null
}

const mockLocationStores: Store[] = [
  {
    id: "5",
    name: "Raymond-Zenor",
    address: "417 M MAM Road, Ajmer, Rajasthan",
    price: "20$",
    image: "/placeholder.svg?height=120&width=160",
    owner: { name: "Raymond Z", avatar: "/placeholder.svg?height=40&width=40" },
  },
  {
    id: "6",
    name: "Fashion-Hub",
    address: "123 Style Street, Mumbai, Maharashtra",
    price: "25$",
    image: "/placeholder.svg?height=120&width=160",
    owner: { name: "Fashion H", avatar: "/placeholder.svg?height=40&width=40" },
  },
  {
    id: "7",
    name: "Trendy-Wear",
    address: "456 Fashion Ave, Delhi, India",
    price: "18$",
    image: "/placeholder.svg?height=120&width=160",
    owner: { name: "Trendy W", avatar: "/placeholder.svg?height=40&width=40" },
  },
  {
    id: "8",
    name: "Style-Corner",
    address: "789 Design Blvd, Bangalore, Karnataka",
    price: "22$",
    image: "/placeholder.svg?height=120&width=160",
    owner: { name: "Style C", avatar: "/placeholder.svg?height=40&width=40" },
  },
  {
    id: "9",
    name: "Chic-Boutique",
    address: "321 Elegant St, Chennai, Tamil Nadu",
    price: "28$",
    image: "/placeholder.svg?height=120&width=160",
    owner: { name: "Chic B", avatar: "/placeholder.svg?height=40&width=40" },
  },
  {
    id: "10",
    name: "Modern-Threads",
    address: "654 Contemporary Rd, Hyderabad, Telangana",
    price: "24$",
    image: "/placeholder.svg?height=120&width=160",
    owner: { name: "Modern T", avatar: "/placeholder.svg?height=40&width=40" },
  },
]

export function LocationResultsScreen({
  onNavigate,
  onStoreSelect,
  searchLocation,
  userData,
}: LocationResultsScreenProps) {
  return (
    <div className="min-h-screen bg-background max-w-[360px] mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center p-4 bg-muted border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => onNavigate("location-input")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="ml-4 text-lg font-normal lowercase">{searchLocation || "location"}</h1>
      </div>

      {/* Results Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {mockLocationStores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-lg shadow-sm border p-3 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onStoreSelect(store)}
            >
              <img
                src={store.image || "/placeholder.svg"}
                alt={store.name}
                className="w-full h-20 object-cover rounded-md mb-2"
              />
              <h3 className="font-semibold text-sm mb-1">
                {store.name} {store.price}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">{store.address}</p>
              <div className="flex items-center justify-between">
                <img
                  src={store.owner.avatar || "/placeholder.svg"}
                  alt={store.owner.name}
                  className="w-6 h-6 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[360px] bg-white border-t border-border">
        <div className="flex justify-around py-2">
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
            <Bell className="w-5 h-5" />
            <span className="text-xs">Notifications</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1"
            onClick={() => onNavigate("home")}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>
          {userData?.role === "storeOwner" && (
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 text-primary"
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
