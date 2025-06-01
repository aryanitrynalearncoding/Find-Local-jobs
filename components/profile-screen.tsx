"use client"

import { ArrowLeft, User, Mail, Phone, Briefcase, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import type { Screen, UserData } from "@/app/page"

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void
  userData: UserData | null
  onUpdateUser: (data: Partial<UserData>) => void
}

export function ProfileScreen({ onNavigate, userData, onUpdateUser }: ProfileScreenProps) {
  // Add state for editing mode and form data at the top level
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  // Replace the problematic state update logic with useEffect
  useEffect(() => {
    if (userData && !isEditing) {
      setEditData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      })
    }
  }, [userData, isEditing])

  // Add null check after the hooks
  if (!userData) {
    return (
      <div className="min-h-screen bg-background max-w-[360px] mx-auto flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading profile...</p>
          <Button onClick={() => onNavigate("home")} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  // Add handlers for save and cancel
  const handleSave = () => {
    onUpdateUser(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-background max-w-[360px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => onNavigate("home")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold text-foreground">Profile</h1>
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
          <Edit className="w-5 h-5" />
        </Button>
      </div>

      {/* Profile Content */}
      <div className="p-6 space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">{userData.name || "Unknown User"}</h2>
            <p className="text-sm text-muted-foreground capitalize">
              {userData.role === "storeOwner" ? "Store Owner" : "Job Seeker"}
            </p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Full Name</span>
            </label>
            {isEditing ? (
              <Input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full"
              />
            ) : (
              <p className="text-foreground bg-muted p-3 rounded-lg">{userData.name || "Not provided"}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </label>
            {isEditing ? (
              <Input
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full"
              />
            ) : (
              <p className="text-foreground bg-muted p-3 rounded-lg">{userData.email || "Not provided"}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Phone Number</span>
            </label>
            {isEditing ? (
              <Input
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="w-full"
              />
            ) : (
              <p className="text-foreground bg-muted p-3 rounded-lg">{userData.phone || "Not provided"}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center space-x-2">
              <Briefcase className="w-4 h-4" />
              <span>Role</span>
            </label>
            <p className="text-foreground bg-muted p-3 rounded-lg capitalize">
              {userData.role === "storeOwner" ? "Store Owner" : "Job Seeker"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex space-x-3">
            <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
