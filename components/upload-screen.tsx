"use client"

import { ArrowLeft, Bell, Home, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Screen, UserData } from "@/app/page"

interface UploadScreenProps {
  onNavigate: (screen: Screen) => void
  userData: UserData
}

export function UploadScreen({ onNavigate, userData }: UploadScreenProps) {
  const handleAddProfile = () => {
    alert("Add Store Profile functionality - Mock implementation")
  }

  const handleRemovePost = () => {
    alert("Remove Last Post functionality - Mock implementation")
  }

  return (
    <div className="min-h-screen bg-background max-w-[360px] mx-auto">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => onNavigate("home")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="ml-4 text-lg font-bold text-foreground">UPLOAD</h1>
      </div>

      {/* Welcome Message */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <h2 className="text-lg font-semibold text-foreground">Store Management</h2>
        <p className="text-sm text-muted-foreground">Manage your store profile and job postings</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 space-y-6">
        <Button
          variant="outline"
          className="w-full py-8 text-center bg-card hover:bg-muted border-2 border-dashed border-border"
          onClick={handleAddProfile}
        >
          <span className="text-muted-foreground">CLICK HERE TO ADD YOUR STORE PROFILE</span>
        </Button>

        <Button
          variant="outline"
          className="w-full py-8 text-center bg-card hover:bg-muted border-2 border-dashed border-border"
          onClick={handleRemovePost}
        >
          <span className="text-muted-foreground">REMOVE LAST POST.</span>
        </Button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[360px] bg-background border-t border-border">
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
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-primary">
            <Upload className="w-5 h-5" />
            <span className="text-xs">Upload</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
