"use client"

import { useState, useEffect } from "react"
import SettingsScreen from "./SettingsScreen" // Import SettingsScreen component
import { ProfileScreen } from "@/components/profile-screen"
import { NotificationsScreen } from "@/components/notifications-screen"

export type Screen =
  | "role-selection"
  | "login"
  | "home"
  | "upload"
  | "location-input"
  | "location-results"
  | "store-detail"
  | "profile"
  | "settings"
  | "filters"
  | "notifications"

export type UserRole = "storeOwner" | "jobSeeker"

export interface Store {
  id: string
  name: string
  address: string
  price: string
  priceValue: number
  rating: number
  jobType: string
  image: string
  owner: {
    name: string
    avatar: string
  }
  description?: string
}

export interface UserData {
  name: string
  email: string
  phone: string
  role: UserRole
}

export interface FilterOptions {
  priceRange: [number, number]
  minRating: number
  jobTypes: string[]
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "job" | "message" | "system" | "application"
  timestamp: string
  read: boolean
  avatar?: string
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

const jobTypes = ["Retail", "Food Service", "Tech", "Healthcare", "Education", "Construction", "Transportation"]

// Role Selection Screen Component
function RoleSelectionScreen({ onRoleSelect }: { onRoleSelect: (role: UserRole) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col justify-center items-center px-6 max-w-[360px] mx-auto">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">WHO ARE YOU?</h1>
          <p className="text-gray-600">Choose your role to get started</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onRoleSelect("storeOwner")}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <span>🏪</span>
            <span>I AM A STORE OWNER</span>
          </button>

          <button
            onClick={() => onRoleSelect("jobSeeker")}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <span>👥</span>
            <span>I AM LOOKING FOR A JOB</span>
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">Select your role to access personalized features</p>
        </div>
      </div>
    </div>
  )
}

// Login Screen Component
function LoginScreen({
  onLogin,
  userRole,
}: { onLogin: (userData: { name: string; email: string; phone: string }) => void; userRole: UserRole }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [otpSent, setOtpSent] = useState(false)

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone: string) => {
    const re = /^[7-9]\d{9}$/
    return re.test(phone)
  }

  const handleSendOtp = () => {
    const newErrors: Record<string, string> = {}

    if (!name) newErrors.name = "Name is required"
    if (!email) newErrors.email = "Email is required"
    else if (!validateEmail(email)) newErrors.email = "Please enter a valid email"
    if (!password) newErrors.password = "Password is required"
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (!phone) newErrors.phone = "Phone number is required"
    else if (!validatePhone(phone))
      newErrors.phone = "Please enter a valid 10-digit phone number starting with 7, 8, or 9"

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setOtpSent(true)
      alert("OTP sent to your phone! (Mock: Use 123456)")
    }
  }

  const handleSignIn = () => {
    const newErrors: Record<string, string> = {}

    if (!otpSent) {
      handleSendOtp()
      return
    }

    if (!otp) newErrors.otp = "OTP is required"
    else if (otp !== "123456") newErrors.otp = "Invalid OTP. Use 123456 for this demo"

    setErrors(newErrors)

    if (otpSent && otp === "123456") {
      onLogin({ name, email, phone })
    }
  }

  const roleTitle = userRole === "storeOwner" ? "Store Owner" : "Job Seeker"

  return (
    <div className="min-h-screen bg-[#FFE6E6] flex flex-col justify-center items-center px-6 max-w-[360px] mx-auto">
      <div className="w-full max-w-sm space-y-5">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">LOGIN</h1>
          <p className="text-sm text-gray-600">Welcome, {roleTitle}!</p>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "")
                if (value.length <= 10) setPhone(value)
              }}
              className={`w-full p-3 rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

          {otpSent && (
            <div>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "")
                  if (value.length <= 6) setOtp(value)
                }}
                className={`w-full p-3 rounded-lg border ${errors.otp ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.otp && <p className="mt-1 text-xs text-red-500">{errors.otp}</p>}
            </div>
          )}
        </div>

        <button
          onClick={handleSignIn}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold"
        >
          {otpSent ? "VERIFY OTP" : "SEND OTP"}
        </button>
      </div>
    </div>
  )
}

// Filters Screen Component
function FiltersScreen({
  onNavigate,
  filters,
  onApplyFilters,
}: {
  onNavigate: (screen: Screen) => void
  filters: FilterOptions
  onApplyFilters: (filters: FilterOptions) => void
}) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters)

  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange: [number, number] = [...localFilters.priceRange]
    newRange[index] = value
    setLocalFilters({ ...localFilters, priceRange: newRange })
  }

  const handleJobTypeToggle = (jobType: string) => {
    const newJobTypes = localFilters.jobTypes.includes(jobType)
      ? localFilters.jobTypes.filter((type) => type !== jobType)
      : [...localFilters.jobTypes, jobType]
    setLocalFilters({ ...localFilters, jobTypes: newJobTypes })
  }

  const handleApply = () => {
    onApplyFilters(localFilters)
    onNavigate("home")
  }

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      priceRange: [0, 100],
      minRating: 0,
      jobTypes: [],
    }
    setLocalFilters(resetFilters)
  }

  return (
    <div className="min-h-screen bg-white max-w-[360px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={() => onNavigate("home")}>
          <span className="text-xl">←</span>
        </button>
        <h1 className="text-lg font-bold">Filters</h1>
        <button onClick={handleReset} className="text-blue-600 text-sm font-medium">
          Reset
        </button>
      </div>

      {/* Filter Content */}
      <div className="p-4 space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Price Range ($/hour)</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>${localFilters.priceRange[0]}</span>
              <span>${localFilters.priceRange[1]}</span>
            </div>
            <div className="flex space-x-2">
              <input
                type="range"
                min="0"
                max="100"
                value={localFilters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange(0, Number.parseInt(e.target.value))}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={localFilters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(1, Number.parseInt(e.target.value))}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Minimum Rating</h3>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setLocalFilters({ ...localFilters, minRating: rating })}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg border ${
                  localFilters.minRating === rating
                    ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <span>⭐</span>
                <span>{rating}+</span>
              </button>
            ))}
          </div>
        </div>

        {/* Job Types */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Job Types</h3>
          <div className="grid grid-cols-2 gap-2">
            {jobTypes.map((jobType) => (
              <button
                key={jobType}
                onClick={() => handleJobTypeToggle(jobType)}
                className={`p-3 rounded-lg border text-sm ${
                  localFilters.jobTypes.includes(jobType)
                    ? "bg-blue-100 border-blue-300 text-blue-800"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                {jobType}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {(localFilters.jobTypes.length > 0 || localFilters.minRating > 0) && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Active Filters</h3>
            <div className="flex flex-wrap gap-2">
              {localFilters.jobTypes.map((jobType) => (
                <span key={jobType} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {jobType}
                </span>
              ))}
              {localFilters.minRating > 0 && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  ⭐ {localFilters.minRating}+ Rating
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Apply Button */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[360px] bg-white border-t p-4">
        <button
          onClick={handleApply}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}

// Home Screen Component
function HomeScreen({
  onNavigate,
  onStoreSelect,
  onLocationSearch,
  userData,
  filters,
  notifications,
}: {
  onNavigate: (screen: Screen) => void
  onStoreSelect: (store: Store) => void
  onLocationSearch: (location: string) => void
  userData: UserData
  filters: FilterOptions
  notifications: Notification[]
}) {
  const isStoreOwner = userData.role === "storeOwner"

  const mockStores: Store[] = [
    {
      id: "1",
      name: "Weymans-Palo",
      address: "123 Main St, Downtown",
      price: "15$",
      priceValue: 15,
      rating: 4.5,
      jobType: "Retail",
      image: "/placeholder.svg?height=120&width=160",
      owner: { name: "John Palo", avatar: "/placeholder.svg?height=40&width=40" },
    },
    {
      id: "2",
      name: "LST-Margo",
      address: "456 Oak Ave, Midtown",
      price: "20$",
      priceValue: 20,
      rating: 4.2,
      jobType: "Food Service",
      image: "/placeholder.svg?height=120&width=160",
      owner: { name: "Lisa Margo", avatar: "/placeholder.svg?height=40&width=40" },
    },
    {
      id: "3",
      name: "Tech-Hub",
      address: "789 Tech Blvd, Silicon Valley",
      price: "35$",
      priceValue: 35,
      rating: 4.8,
      jobType: "Tech",
      image: "/placeholder.svg?height=120&width=160",
      owner: { name: "Tech Owner", avatar: "/placeholder.svg?height=40&width=40" },
    },
    {
      id: "4",
      name: "Health-Care",
      address: "321 Medical St, Healthcare District",
      price: "28$",
      priceValue: 28,
      rating: 4.6,
      jobType: "Healthcare",
      image: "/placeholder.svg?height=120&width=160",
      owner: { name: "Health Owner", avatar: "/placeholder.svg?height=40&width=40" },
    },
  ]

  const mockJobs: Store[] = [
    {
      id: "5",
      name: "Fashion Store",
      address: "Downtown Fashion District",
      price: "18$/hour",
      priceValue: 18,
      rating: 4.3,
      jobType: "Retail",
      image: "/placeholder.svg?height=120&width=160",
      owner: { name: "Fashion Owner", avatar: "/placeholder.svg?height=40&width=40" },
      description: "Looking for sales associate",
    },
    {
      id: "6",
      name: "Tech Repair Shop",
      address: "Tech Hub Area",
      price: "22$/hour",
      priceValue: 22,
      rating: 4.7,
      jobType: "Tech",
      image: "/placeholder.svg?height=120&width=160",
      owner: { name: "Tech Owner", avatar: "/placeholder.svg?height=40&width=40" },
      description: "Need experienced technician",
    },
    {
      id: "7",
      name: "Restaurant Server",
      address: "Food District",
      price: "16$/hour",
      priceValue: 16,
      rating: 4.1,
      jobType: "Food Service",
      image: "/placeholder.svg?height=120&width=160",
      owner: { name: "Restaurant Owner", avatar: "/placeholder.svg?height=40&width=40" },
      description: "Server position available",
    },
    {
      id: "8",
      name: "Construction Helper",
      address: "Construction Zone",
      price: "25$/hour",
      priceValue: 25,
      rating: 4.4,
      jobType: "Construction",
      image: "/placeholder.svg?height=120&width=160",
      owner: { name: "Construction Owner", avatar: "/placeholder.svg?height=40&width=40" },
      description: "Construction assistant needed",
    },
  ]

  // Apply filters to the data
  const applyFilters = (data: Store[]) => {
    return data.filter((item) => {
      // Price filter
      if (item.priceValue < filters.priceRange[0] || item.priceValue > filters.priceRange[1]) {
        return false
      }
      // Rating filter
      if (item.rating < filters.minRating) {
        return false
      }
      // Job type filter
      if (filters.jobTypes.length > 0 && !filters.jobTypes.includes(item.jobType)) {
        return false
      }
      return true
    })
  }

  const rawData = isStoreOwner ? mockStores : mockJobs
  const displayData = applyFilters(rawData)
  const sectionTitle = isStoreOwner ? "📍 STORES NEAR YOU" : "💼 JOBS NEAR YOU"

  const activeFiltersCount =
    (filters.jobTypes.length > 0 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 100 ? 1 : 0)

  return (
    <div className="min-h-screen bg-white max-w-[360px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={() => onNavigate("settings")}>
          <span className="text-2xl">☰</span>
        </button>
        <h1 className="font-bold text-lg">FL JOBS</h1>
        <button onClick={() => onNavigate("profile")}>
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        </button>
      </div>

      {/* Welcome Message */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-lg font-semibold">Welcome back, {userData.name}!</h2>
        <p className="text-sm text-gray-600">
          {isStoreOwner ? "Manage your store and find employees" : "Find your next job opportunity"}
        </p>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Search and Filter Section */}
        <div className="space-y-3">
          <div className="flex space-x-2">
            <button
              onClick={() => onNavigate("location-input")}
              className="flex-1 flex items-center justify-start p-3 bg-gray-100 rounded-lg text-gray-500"
            >
              <span className="mr-2">🔍</span>
              Search destination
            </button>
            <button
              onClick={() => onNavigate("filters")}
              className="relative flex items-center justify-center p-3 bg-blue-100 rounded-lg"
            >
              <span className="text-blue-600">🔧</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>Recent Visit</span>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Active Filters:</span>
              <span className="text-xs text-gray-500">{displayData.length} results</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.jobTypes.map((jobType) => (
                <span key={jobType} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {jobType}
                </span>
              ))}
              {filters.minRating > 0 && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  ⭐ {filters.minRating}+
                </span>
              )}
              {(filters.priceRange[0] > 0 || filters.priceRange[1] < 100) && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  ${filters.priceRange[0]}-${filters.priceRange[1]}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-bold">{sectionTitle}</h2>

          {displayData.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">🔍</span>
              <p className="text-gray-500">No results found with current filters</p>
              <button onClick={() => onNavigate("filters")} className="mt-2 text-blue-600 text-sm font-medium">
                Adjust Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {displayData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border p-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onStoreSelect(item)}
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-20 object-cover rounded-md mb-2"
                  />
                  <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-600 mb-1">{item.address}</p>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.jobType}</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">⭐</span>
                      <span className="text-sm text-gray-600">{item.rating}</span>
                    </div>
                  </div>
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
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[360px] bg-white border-t">
        <div className="flex justify-around py-2">
          {/* Update the bottom navigation in HomeScreen to handle notifications */}
          {/* Replace the notifications button in the bottom navigation */}
          <button className="flex flex-col items-center space-y-1 relative" onClick={() => onNavigate("notifications")}>
            <span className="text-xl">🔔</span>
            <span className="text-xs">Notifications</span>
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notifications.filter((n) => !n.read).length}
              </span>
            )}
          </button>
          <button className="flex flex-col items-center space-y-1 text-blue-600">
            <span className="text-xl">🏠</span>
            <span className="text-xs">Home</span>
          </button>
          {isStoreOwner && (
            <button className="flex flex-col items-center space-y-1" onClick={() => onNavigate("upload")}>
              <span className="text-xl">⬆️</span>
              <span className="text-xs">Upload</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Location Input Screen Component
function LocationInputScreen({
  onNavigate,
  onLocationSearch,
}: {
  onNavigate: (screen: Screen) => void
  onLocationSearch: (location: string) => void
}) {
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
        <button onClick={() => onNavigate("home")} className="mr-3">
          <span className="text-xl">←</span>
        </button>
        <h1 className="text-lg font-bold">DESTINATION</h1>
      </div>

      {/* Location Input */}
      <div className="p-4">
        <input
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
            <button
              key={index}
              className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => handleLocationSelect(loc)}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Location Results Screen Component
function LocationResultsScreen({
  onNavigate,
  onStoreSelect,
  searchLocation,
  userData,
  filters,
}: {
  onNavigate: (screen: Screen) => void
  onStoreSelect: (store: Store) => void
  searchLocation: string
  userData: UserData | null
  filters: FilterOptions
}) {
  const mockLocationStores: Store[] = [
    {
      id: "5",
      name: "Raymond-Zenor",
      address: "417 M MAM Road, Ajmer, Rajasthan",
      price: "20$",
      priceValue: 20,
      rating: 4.2,
      jobType: "Retail",
      image: "/placeholder.svg?height=120&width=160",
      owner: { name: "Raymond Z", avatar: "/placeholder.svg?height=40&width=40" },
    },
    {
      id: "6",
      name: "Fashion-Hub",
      address: "123 Style Street, Mumbai, Maharashtra",
      price: "25$",
      priceValue: 25,
      rating: 4.5,
      jobType: "Retail",
      image: "/placeholder.svg?height=120&width=160",
      owner: { name: "Fashion H", avatar: "/placeholder.svg?height=40&width=40" },
    },
    {
      id: "7",
      name: "Trendy-Wear",
      address: "456 Fashion Ave, Delhi, India",
      price: "18$",
      priceValue: 18,
      rating: 4.0,
      jobType: "Retail",
      image: "/placeholder.svg?height=120&width=160",
      owner: { name: "Trendy W", avatar: "/placeholder.svg?height=40&width=40" },
    },
    {
      id: "8",
      name: "Style-Corner",
      address: "789 Design Blvd, Bangalore, Karnataka",
      price: "22$",
      priceValue: 22,
      rating: 4.3,
      jobType: "Food Service",
      image: "/placeholder.svg?height=120&width=160",
      owner: { name: "Style C", avatar: "/placeholder.svg?height=40&width=40" },
    },
    {
      id: "9",
      name: "Chic-Boutique",
      address: "321 Elegant St, Chennai, Tamil Nadu",
      price: "28$",
      priceValue: 28,
      rating: 4.7,
      jobType: "Tech",
      image: "/placeholder.svg?height=120&width=160",
      owner: { name: "Chic B", avatar: "/placeholder.svg?height=40&width=40" },
    },
    {
      id: "10",
      name: "Modern-Threads",
      address: "654 Contemporary Rd, Hyderabad, Telangana",
      price: "24$",
      priceValue: 24,
      rating: 4.4,
      jobType: "Healthcare",
      image: "/placeholder.svg?height=120&width=160",
      owner: { name: "Modern T", avatar: "/placeholder.svg?height=40&width=40" },
    },
  ]

  // Apply filters to location results
  const applyFilters = (data: Store[]) => {
    return data.filter((item) => {
      if (item.priceValue < filters.priceRange[0] || item.priceValue > filters.priceRange[1]) {
        return false
      }
      if (item.rating < filters.minRating) {
        return false
      }
      if (filters.jobTypes.length > 0 && !filters.jobTypes.includes(item.jobType)) {
        return false
      }
      return true
    })
  }

  const filteredStores = applyFilters(mockLocationStores)

  return (
    <div className="min-h-screen bg-white max-w-[360px] mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center p-4 bg-gray-100 border-b">
        <button onClick={() => onNavigate("location-input")} className="mr-3">
          <span className="text-xl">←</span>
        </button>
        <h1 className="text-lg font-normal lowercase">{searchLocation || "location"}</h1>
      </div>

      {/* Results Grid */}
      <div className="p-4">
        {filteredStores.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">🔍</span>
            <p className="text-gray-500">No results found in {searchLocation}</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredStores.map((store) => (
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
                <p className="text-xs text-gray-600 mb-1">{store.address}</p>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{store.jobType}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs">⭐</span>
                    <span className="text-xs text-gray-600">{store.rating}</span>
                  </div>
                </div>
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
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[360px] bg-white border-t">
        <div className="flex justify-around py-2">
          <button className="flex flex-col items-center space-y-1" onClick={() => onNavigate("notifications")}>
            <span className="text-xl">🔔</span>
            <span className="text-xs">Notifications</span>
          </button>
          <button className="flex flex-col items-center space-y-1" onClick={() => onNavigate("home")}>
            <span className="text-xl">🏠</span>
            <span className="text-xs">Home</span>
          </button>
          {userData?.role === "storeOwner" && (
            <button className="flex flex-col items-center space-y-1" onClick={() => onNavigate("upload")}>
              <span className="text-xl">⬆️</span>
              <span className="text-xs">Upload</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Store Detail Screen Component
function StoreDetailScreen({
  onNavigate,
  store,
  userData,
}: {
  onNavigate: (screen: Screen) => void
  store: Store
  userData: {
    role: string
  }
}) {
  const handleConnect = () => {
    alert(`Connected to ${store.name}! Mock implementation.`)
  }

  return (
    <div className="min-h-screen bg-white max-w-[360px] mx-auto pb-16">
      {/* Header */}
      <div className="relative">
        <button
          className="absolute top-4 left-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full"
          onClick={() => onNavigate("home")}
        >
          <span className="text-xl">←</span>
        </button>
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
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{store.jobType}</span>
              <div className="flex items-center space-x-1">
                <span className="text-sm">⭐</span>
                <span className="text-sm text-gray-600">{store.rating}</span>
              </div>
            </div>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">{store.price}</div>
        </div>

        <div className="text-sm text-gray-500">{store.address || "8/15 Lotus Street, Bengaluru, Karnataka"}</div>

        <div className="space-y-3">
          <p>A clothing store in search of designer and delivery guy</p>
          <p className="font-bold">WILL BE PAID {store.price} FOR MONTH.</p>
        </div>

        <button
          onClick={handleConnect}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold"
        >
          CONNECT
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[360px] bg-white border-t">
        <div className="flex justify-around py-2">
          <button className="flex flex-col items-center space-y-1" onClick={() => onNavigate("notifications")}>
            <span className="text-xl">🔔</span>
            <span className="text-xs">Notifications</span>
          </button>
          <button className="flex flex-col items-center space-y-1" onClick={() => onNavigate("home")}>
            <span className="text-xl">🏠</span>
            <span className="text-xs">Home</span>
          </button>
          {userData.role === "storeOwner" && (
            <button className="flex flex-col items-center space-y-1 text-blue-600" onClick={() => onNavigate("upload")}>
              <span className="text-xl">⬆️</span>
              <span className="text-xs">Upload</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Upload Screen Component
function UploadScreen({ onNavigate, userData }: { onNavigate: (screen: Screen) => void; userData: UserData }) {
  const handleAddProfile = () => {
    alert("Add Store Profile functionality - Mock implementation")
  }

  const handleRemovePost = () => {
    alert("Remove Last Post functionality - Mock implementation")
  }

  return (
    <div className="min-h-screen bg-white max-w-[360px] mx-auto">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <button onClick={() => onNavigate("home")}>
          <span className="text-xl">←</span>
        </button>
        <h1 className="ml-4 text-lg font-bold">UPLOAD</h1>
      </div>

      {/* Welcome Message */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50">
        <h2 className="text-lg font-semibold">Store Management</h2>
        <p className="text-sm text-gray-600">Manage your store profile and job postings</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 space-y-6">
        <button
          className="w-full py-8 text-center bg-white hover:bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg"
          onClick={handleAddProfile}
        >
          <span className="text-gray-500">CLICK HERE TO ADD YOUR STORE PROFILE</span>
        </button>

        <button
          className="w-full py-8 text-center bg-white hover:bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg"
          onClick={handleRemovePost}
        >
          <span className="text-gray-500">REMOVE LAST POST.</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[360px] bg-white border-t">
        <div className="flex justify-around py-2">
          <button className="flex flex-col items-center space-y-1" onClick={() => onNavigate("notifications")}>
            <span className="text-xl">🔔</span>
            <span className="text-xs">Notifications</span>
          </button>
          <button className="flex flex-col items-center space-y-1" onClick={() => onNavigate("home")}>
            <span className="text-xl">🏠</span>
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-blue-600">
            <span className="text-xl">⬆️</span>
            <span className="text-xs">Upload</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Main App Component
export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("role-selection")
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [searchLocation, setSearchLocation] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 100],
    minRating: 0,
    jobTypes: [],
  })

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Job Match",
      message: "A new retail position matches your preferences at Fashion Hub",
      type: "job",
      timestamp: "2 hours ago",
      read: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      title: "Application Update",
      message: "Your application to Tech Repair Shop has been viewed",
      type: "application",
      timestamp: "5 hours ago",
      read: false,
    },
    {
      id: "3",
      title: "Message from Store Owner",
      message: "John Palo sent you a message about the position",
      type: "message",
      timestamp: "1 day ago",
      read: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      title: "Profile Verification",
      message: "Your profile has been successfully verified",
      type: "system",
      timestamp: "2 days ago",
      read: true,
    },
  ])

  // Load user data from localStorage on app start
  useEffect(() => {
    const savedUserData = localStorage.getItem("fl-jobs-user")
    if (savedUserData) {
      const parsedData = JSON.parse(savedUserData)
      setUserData(parsedData)
      setSelectedRole(parsedData.role)
      setCurrentScreen("home")
    }
  }, [])

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role)
    setCurrentScreen("login")
  }

  const handleLogin = (loginData: Omit<UserData, "role">) => {
    if (!selectedRole) return

    const newUserData: UserData = {
      ...loginData,
      role: selectedRole,
    }

    setUserData(newUserData)
    localStorage.setItem("fl-jobs-user", JSON.stringify(newUserData))
    setCurrentScreen("home")
  }

  const handleLogout = () => {
    setUserData(null)
    setSelectedRole(null)
    localStorage.removeItem("fl-jobs-user")
    setCurrentScreen("role-selection")
  }

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen)
  }

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store)
    setCurrentScreen("store-detail")
  }

  const handleLocationSearch = (location: string) => {
    setSearchLocation(location)
    setCurrentScreen("location-results")
  }

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
  }

  const handleClearAllNotifications = () => {
    setNotifications([])
  }

  return (
    <div className="min-h-screen bg-white">
      {currentScreen === "role-selection" && <RoleSelectionScreen onRoleSelect={handleRoleSelection} />}

      {currentScreen === "login" && selectedRole && <LoginScreen onLogin={handleLogin} userRole={selectedRole} />}

      {currentScreen === "home" && userData && (
        <HomeScreen
          onNavigate={navigateToScreen}
          onStoreSelect={handleStoreSelect}
          onLocationSearch={handleLocationSearch}
          userData={userData}
          filters={filters}
          notifications={notifications}
        />
      )}

      {currentScreen === "filters" && (
        <FiltersScreen onNavigate={navigateToScreen} filters={filters} onApplyFilters={handleApplyFilters} />
      )}

      {currentScreen === "upload" && userData && <UploadScreen onNavigate={navigateToScreen} userData={userData} />}

      {currentScreen === "location-input" && (
        <LocationInputScreen onNavigate={navigateToScreen} onLocationSearch={handleLocationSearch} />
      )}

      {currentScreen === "location-results" && (
        <LocationResultsScreen
          onNavigate={navigateToScreen}
          onStoreSelect={handleStoreSelect}
          searchLocation={searchLocation}
          userData={userData}
          filters={filters}
        />
      )}

      {currentScreen === "store-detail" && selectedStore && userData && (
        <StoreDetailScreen onNavigate={navigateToScreen} store={selectedStore} userData={userData} />
      )}

      {/* Update ProfileScreen call to include onUpdateUser prop and handle null userData */}
      {currentScreen === "profile" && userData && (
        <ProfileScreen
          onNavigate={navigateToScreen}
          userData={userData}
          onUpdateUser={(data) => {
            const updatedUserData = { ...userData, ...data }
            setUserData(updatedUserData)
            localStorage.setItem("fl-jobs-user", JSON.stringify(updatedUserData))
          }}
        />
      )}

      {currentScreen === "settings" && <SettingsScreen onNavigate={navigateToScreen} onLogout={handleLogout} />}

      {/* Add the notifications screen case in the main render section */}
      {currentScreen === "notifications" && (
        <NotificationsScreen
          onNavigate={navigateToScreen}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onClearAll={handleClearAllNotifications}
        />
      )}
    </div>
  )
}
