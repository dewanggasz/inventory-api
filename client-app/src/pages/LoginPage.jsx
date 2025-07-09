"use client"

import { useState } from "react"
import { Navigate } from "react-router-dom"
import axiosClient from "../api/axiosClient"
import { useAuth } from "../context/AuthContext"
import { User, Lock, AlertCircle, Loader2 } from "lucide-react"

// Utility function for class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ")
}

// Button Component
const Button = ({
  children,
  variant = "default",
  size = "default",
  disabled = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50"

  const variants = {
    default: "bg-black text-white hover:bg-black/90",
    outline: "border border-neutral-200 bg-white hover:bg-neutral-50",
    ghost: "hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900",
  }

  const sizes = {
    default: "h-12 px-6 py-3",
    sm: "h-9 px-3 text-sm",
  }

  return (
    <button
      type={type}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

// Input Component
const Input = ({ label, icon: Icon, className = "", ...props }) => (
  <div className="space-y-2">
    <label htmlFor={props.id} className="block text-xs font-mono text-neutral-400 tracking-wider uppercase">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />}
      <input
        className={cn(
          "w-full h-12 border border-neutral-200 bg-white text-sm focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all",
          Icon ? "pl-12 pr-4" : "px-4",
          className,
        )}
        {...props}
      />
    </div>
  </div>
)

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { token, setToken, setUser } = useAuth()

  // Jika sudah login, redirect ke halaman utama
  if (token) {
    return <Navigate to="/" />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await axiosClient.post("/login", { email, password })
      setToken(response.data.token)
      setUser(response.data.user)
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setError("Invalid email or password.")
      } else {
        setError("Server error occurred.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4">
      {/* Header Section */}
      <div className="w-full max-w-md mb-12 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-2">Authentication</h1>
          <p className="text-sm text-neutral-500 font-mono tracking-wide">INVENTORY MANAGEMENT SYSTEM</p>
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md">
        <div className="bg-white border border-neutral-200 p-8">
          {/* Form Header */}
          <div className="mb-8 text-center">
            <h2 className="text-lg font-light text-neutral-900 mb-2">Sign In</h2>
            <p className="text-xs text-neutral-500 font-mono tracking-wider uppercase">Enter your credentials</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-red-900 font-medium text-sm mb-1">Authentication Error</div>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="email"
              type="email"
              label="Email Address"
              icon={User}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />

            <Input
              id="password"
              type="password"
              label="Password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />

            <div className="pt-4">
              <Button type="submit" disabled={loading} className="w-full justify-center">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="font-mono text-xs tracking-wider uppercase">Signing In</span>
                  </div>
                ) : (
                  <span className="font-mono text-xs tracking-wider uppercase">Sign In</span>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-400 font-mono tracking-wider">SECURE ACCESS TO INVENTORY SYSTEM</p>
        </div>
      </div>

      {/* Bottom Branding */}
      <div className="mt-16 text-center">
        <div className="text-xs text-neutral-400 font-mono tracking-wider">
          INVENTORY<span className="text-neutral-600">APP</span>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
