"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Chrome, Facebook, Apple, Loader2 } from "lucide-react"
import type { UserRole } from "@/app/page"

interface LoginScreenProps {
  onLogin: (userData: { name: string; email: string; phone: string }) => void
  userRole: UserRole
}

export function LoginScreen({ onLogin, userRole }: LoginScreenProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [otpSent, setOtpSent] = useState(false)

  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isFacebookLoading, setIsFacebookLoading] = useState(false)
  const [isAppleLoading, setIsAppleLoading] = useState(false)

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone: string) => {
    const re = /^[7-9]\d{9}$/
    return re.test(phone)
  }

  const handleSocialLogin = async (provider: string, setLoading: (loading: boolean) => void) => {
    setLoading(true)
    try {
      alert(`${provider} login initiated! (Mock implementation)`)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // Mock social login data
      onLogin({
        name: `${provider} User`,
        email: `user@${provider.toLowerCase()}.com`,
        phone: "9876543210",
      })
    } catch (error) {
      alert(`${provider} login failed. Please try again.`)
    } finally {
      setLoading(false)
    }
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
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="relative">
            <Input
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
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div>
            <Input
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
              <Input
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

        <Button
          onClick={handleSignIn}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold"
        >
          {otpSent ? "VERIFY OTP" : "SEND OTP"}
        </Button>

        <div className="flex items-center justify-center space-x-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => handleSocialLogin("Google", setIsGoogleLoading)}
            disabled={isGoogleLoading || isFacebookLoading || isAppleLoading}
            variant="outline"
            className="w-full bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-semibold border border-gray-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            ) : (
              <Chrome className="w-5 h-5 text-blue-500" />
            )}
            <span>{isGoogleLoading ? "Connecting..." : "Continue with Google"}</span>
          </Button>

          <Button
            onClick={() => handleSocialLogin("Facebook", setIsFacebookLoading)}
            disabled={isGoogleLoading || isFacebookLoading || isAppleLoading}
            className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFacebookLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Facebook className="w-5 h-5" />}
            <span>{isFacebookLoading ? "Connecting..." : "Continue with Facebook"}</span>
          </Button>

          <Button
            onClick={() => handleSocialLogin("Apple", setIsAppleLoading)}
            disabled={isGoogleLoading || isFacebookLoading || isAppleLoading}
            className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAppleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Apple className="w-5 h-5" />}
            <span>{isAppleLoading ? "Connecting..." : "Continue with Apple"}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
