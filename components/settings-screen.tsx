"use client"
import { useState } from "react"
import type { Screen } from "@/app/page"

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void
  onLogout: () => void
}

export function SettingsScreen({ onNavigate, onLogout }: SettingsScreenProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      onLogout()
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className="min-h-screen bg-white max-w-[360px] mx-auto">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <button onClick={() => onNavigate("home")}>
          <span className="text-xl">←</span>
        </button>
        <h1 className="ml-4 text-lg font-bold">Settings</h1>
      </div>

      {/* Settings Content */}
      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Profile</h2>
          <button className="w-full flex items-center p-4 bg-gray-50 rounded-lg" onClick={() => onNavigate("profile")}>
            <span className="text-xl mr-3">👤</span>
            <div className="text-left">
              <p className="font-medium">Edit Profile</p>
              <p className="text-sm text-gray-500">Update your personal information</p>
            </div>
          </button>
        </div>

        {/* Appearance Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Appearance</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🎨</span>
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-500">Toggle dark theme</p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? "bg-black" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & Security Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Privacy & Security</h2>

          <button className="w-full flex items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-xl mr-3">🔒</span>
            <div className="text-left">
              <p className="font-medium">Change Password</p>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
          </button>

          <button className="w-full flex items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-xl mr-3">🛡️</span>
            <div className="text-left">
              <p className="font-medium">Privacy Settings</p>
              <p className="text-sm text-gray-500">Control who can see your profile</p>
            </div>
          </button>

          <button className="w-full flex items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-xl mr-3">📱</span>
            <div className="text-left">
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add extra security to your account</p>
            </div>
          </button>
        </div>

        {/* Notifications Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Notifications</h2>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🔔</span>
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">Receive job alerts and messages</p>
                </div>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-blue-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
              </button>
            </div>
          </div>

          <button className="w-full flex items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-xl mr-3">📧</span>
            <div className="text-left">
              <p className="font-medium">Email Preferences</p>
              <p className="text-sm text-gray-500">Manage email notifications</p>
            </div>
          </button>
        </div>

        {/* Support Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Support</h2>

          <button className="w-full flex items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-xl mr-3">❓</span>
            <div className="text-left">
              <p className="font-medium">Help Center</p>
              <p className="text-sm text-gray-500">Get answers to common questions</p>
            </div>
          </button>

          <button className="w-full flex items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-xl mr-3">💬</span>
            <div className="text-left">
              <p className="font-medium">Contact Support</p>
              <p className="text-sm text-gray-500">Get help from our team</p>
            </div>
          </button>

          <button className="w-full flex items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-xl mr-3">⭐</span>
            <div className="text-left">
              <p className="font-medium">Rate App</p>
              <p className="text-sm text-gray-500">Share your feedback</p>
            </div>
          </button>

          <button className="w-full flex items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-xl mr-3">📄</span>
            <div className="text-left">
              <p className="font-medium">Terms & Privacy</p>
              <p className="text-sm text-gray-500">Read our policies</p>
            </div>
          </button>
        </div>

        {/* Account Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Account</h2>
          <button className="w-full flex items-center p-4 bg-red-50 rounded-lg text-red-600" onClick={handleLogout}>
            <span className="text-xl mr-3">🚪</span>
            <div className="text-left">
              <p className="font-medium">Log Out</p>
              <p className="text-sm opacity-70">Sign out of your account</p>
            </div>
          </button>
        </div>

        {/* App Info */}
        <div className="pt-8 text-center">
          <p className="text-sm text-gray-500">FL JOBS Mobile App</p>
          <p className="text-xs text-gray-400">Version 1.0.0</p>
        </div>
      </div>
    </div>
  )
}
