"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { LogOut, User, LayoutDashboard, Menu, X } from "lucide-react"

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
    <header className="w-full top-0 left-0 ">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 lg:mt-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand Section */}
          <div className="flex items-center">
            <div className="flex items-center text-gray-700">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <User size={20} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-sm text-gray-500">Selamat datang,</span>
                <div className="font-semibold text-gray-800">{user ? user.name : "Pengguna"}</div>
              </div>
              <div className="sm:hidden">
                <span className="font-semibold text-gray-800">{user ? user.name : "Pengguna"}</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAdmin && (
              <a
                href={adminDashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <LayoutDashboard size={16} className="mr-2" />
                Dashboard
              </a>
            )}
            <button
              onClick={logout}
              className="flex items-center bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X size={24} className="block" /> : <Menu size={24} className="block" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-3 bg-gray-50 rounded-lg mt-2 border border-gray-200">
            {/* User Info in Mobile */}
            <div className="flex items-center px-3 py-2 text-gray-700 bg-white rounded-lg border border-gray-200">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <User size={16} className="text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Selamat datang,</div>
                <div className="font-semibold text-gray-800">{user ? user.name : "Pengguna"}</div>
              </div>
            </div>

            {/* Admin Dashboard Link - Mobile */}
            {isAdmin && (
              <a
                href={adminDashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <LayoutDashboard size={18} className="mr-3" />
                Dashboard Admin
              </a>
            )}

            {/* Logout Button - Mobile */}
            <button
              onClick={() => {
                logout()
                setIsMobileMenuOpen(false)
              }}
              className="flex items-center w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
