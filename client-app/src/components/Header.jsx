"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"
import { LogOut, User, LayoutDashboard, Menu, X, Archive, QrCode } from "lucide-react"

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
  href,
  target,
  rel,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50"

  const variants = {
    default: "bg-black text-white hover:bg-black/90",
    outline: "border border-neutral-200 bg-white hover:bg-neutral-50",
    ghost: "hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-sm",
    icon: "h-10 w-10",
  }

  const Component = href ? "a" : "button"

  return (
    <Component
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      onClick={onClick}
      href={href}
      target={target}
      rel={rel}
      {...props}
    >
      {children}
    </Component>
  )
}

// Navigation Link Component
const NavLink = ({ to, children, onClick, className = "" }) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 text-neutral-600 hover:text-neutral-900 font-medium py-2 px-4 transition-colors",
      className,
    )}
  >
    {children}
  </Link>
)

function Header() {
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isAdmin = user?.role === "admin"

  // URL ke panel admin Filament Anda
  const adminDashboardUrl = "http://127.0.0.1:8000/admin"

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="w-full bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand Section */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-light tracking-tight text-neutral-900">
              <span className="font-mono tracking-wider">INVENTORY</span>
              <span className="text-neutral-500">APP</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/">
              <QrCode className="h-4 w-4" />
              <span className="font-mono text-xs tracking-wider uppercase">Scanner</span>
            </NavLink>

            <NavLink to="/items">
              <Archive className="h-4 w-4" />
              <span className="font-mono text-xs tracking-wider uppercase">Items</span>
            </NavLink>

            {isAdmin && (
              <Button
                variant="outline"
                href={adminDashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2 bg-transparent"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="font-mono text-xs tracking-wider uppercase">Dashboard</span>
              </Button>
            )}

            <Button variant="destructive" onClick={logout} className="gap-2 ml-2">
              <LogOut className="h-4 w-4" />
              <span className="font-mono text-xs tracking-wider uppercase">Logout</span>
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-neutral-600 hover:text-neutral-900"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 ease-in-out",
            isMobileMenuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0 overflow-hidden",
          )}
        >
          <div className="px-2 pt-4 pb-3 space-y-3 bg-neutral-50 border border-neutral-200 mt-2">
            {/* User Info in Mobile */}
            <div className="flex items-center px-4 py-3 text-neutral-700 bg-white border border-neutral-200">
              <div className="bg-neutral-900 p-2 mr-3 flex items-center justify-center w-10 h-10">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-xs text-neutral-400 font-mono tracking-wider uppercase">Welcome</div>
                <div className="font-medium text-neutral-900">{user ? user.name : "User"}</div>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center w-full bg-white hover:bg-neutral-50 text-neutral-700 hover:text-neutral-900 font-medium py-3 px-4 transition-colors border border-neutral-200 gap-3"
            >
              <QrCode className="h-4 w-4" />
              <span className="font-mono text-xs tracking-wider uppercase">Barcode Scanner</span>
            </Link>

            <Link
              to="/items"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center w-full bg-white hover:bg-neutral-50 text-neutral-700 hover:text-neutral-900 font-medium py-3 px-4 transition-colors border border-neutral-200 gap-3"
            >
              <Archive className="h-4 w-4" />
              <span className="font-mono text-xs tracking-wider uppercase">Items List</span>
            </Link>

            {/* Admin Dashboard Link - Mobile */}
            {isAdmin && (
              <a
                href={adminDashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center w-full bg-neutral-900 hover:bg-black text-white font-medium py-3 px-4 transition-colors gap-3"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="font-mono text-xs tracking-wider uppercase">Admin Dashboard</span>
              </a>
            )}

            {/* Logout Button - Mobile */}
            <button
              onClick={() => {
                logout()
                setIsMobileMenuOpen(false)
              }}
              className="flex items-center w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 transition-colors gap-3"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-mono text-xs tracking-wider uppercase">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
