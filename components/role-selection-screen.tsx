"use client"

import { Button } from "@/components/ui/button"
import { Store, Users } from "lucide-react"
import type { UserRole } from "@/app/page"

interface RoleSelectionScreenProps {
  onRoleSelect: (role: UserRole) => void
}

export function RoleSelectionScreen({ onRoleSelect }: RoleSelectionScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col justify-center items-center px-6 max-w-[360px] mx-auto">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">WHO ARE YOU?</h1>
          <p className="text-gray-600">Choose your role to get started</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => onRoleSelect("storeOwner")}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <Store className="w-6 h-6" />
            <span>I AM A STORE OWNER</span>
          </Button>

          <Button
            onClick={() => onRoleSelect("jobSeeker")}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <Users className="w-6 h-6" />
            <span>I AM LOOKING FOR A JOB</span>
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">Select your role to access personalized features</p>
        </div>
      </div>
    </div>
  )
}
