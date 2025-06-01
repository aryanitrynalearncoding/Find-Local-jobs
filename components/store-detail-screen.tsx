"use client"

import { ArrowLeft, Bell, Home, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Screen, Store } from "@/app/page"

interface StoreDetailScreenProps {
  onNavigate: (screen: Screen) => void
  store: Store
  userData: {
    role: string
  }
}

export function StoreDetailScreen({ onNavigate, store, userData }: StoreDetailScreenProps) {
  const handleConnect = () => {
    alert(`Connected to ${store.name}! Mock implementation.`)
  }

  return (
    <div className="min-h-screen bg-background max-w-[360px] mx-auto pb-16">
      {/* Header */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 z-10 bg-white/80 hover:bg-white"
          onClick={() => onNavigate("home")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <img src={store.image || "/placeholder.svg"} alt={store.name} className="w-full h-48 object-cover" />
      </div>

      {/* Store Info */}
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-3">
          <img
            src={store.owner.avatar || "/placeholder.svg"}
            alt={store.owner.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <h2 className="font-semibold text-lg">Owner-{store.owner.name.split(" ")[0].toLowerCase()}</h2>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">{store.price}</div>
        </div>

        <div className="text-sm text-muted-foreground">
          {store.address || "8/15 Lotus Street, Bengaluru, Karnataka"}
        </div>

        <div className="space-y-3">
          <p className="text-foreground">A clothing store in search of designer and delivery guy</p>
          <p className="font-bold text-foreground">WILL BE PAID {store.price} FOR MONTH.</p>
        </div>

        <Button
          onClick={handleConnect}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold"
        >
          CONNECT
        </Button>
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
          {userData.role === "storeOwner" && (
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 text-blue-600"
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
