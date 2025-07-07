"use client"

import { useState, useCallback } from "react"
import axiosClient from "../api/axiosClient"
import ItemCard from "../components/ItemCard"
import BarcodeScanner from "../components/BarcodeScanner"
import HistoryModal from "../components/HistoryModal"
import UpdateStatusModal from "../components/UpdateStatusModal"
import Header from "../components/Header"
import { X, Search, QrCode, Loader2 } from "lucide-react"

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
    destructive: "bg-red-100 text-red-800 hover:bg-red-200",
  }

  const sizes = {
    default: "h-12 px-6 py-3",
    sm: "h-9 px-3 text-sm",
    icon: "h-12 w-12",
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

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [historyData, setHistoryData] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [itemToUpdate, setItemToUpdate] = useState(null)
  const [updateLoading, setUpdateLoading] = useState(false)

  const performSearch = useCallback(async (endpoint) => {
    setLoading(true)
    setItem(null)
    setError("")
    try {
      const response = await axiosClient.get(endpoint)
      setItem(response.data)
    } catch (err) {
      setError(err.response?.status === 404 ? "Item not found." : "An error occurred.")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleManualSearch = (e) => {
    e.preventDefault()
    if (!searchTerm) return
    performSearch(`/items/${searchTerm}`)
  }

  const handleScanSuccess = (decodedText) => {
    setSearchTerm(decodedText)
    setIsScannerOpen(false)
    performSearch(`/items/scan/${decodedText}`)
  }

  const clearInput = () => {
    setSearchTerm("")
    setItem(null)
    setError("")
  }

  const handleViewHistory = async (itemCode) => {
    setHistoryLoading(true)
    setIsHistoryOpen(true)
    setHistoryData([])
    try {
      const response = await axiosClient.get(`/items/${itemCode}/history`)
      setHistoryData(response.data)
    } catch (err) {
      console.error("Failed to fetch history:", err)
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleOpenUpdateModal = (itemForUpdate) => {
    setItemToUpdate(itemForUpdate)
    setIsUpdateModalOpen(true)
  }

  const handleUpdateStatus = async (itemId, data) => {
    setUpdateLoading(true)
    try {
      await axiosClient.patch(`/items/${itemId}/status`, data)
      setIsUpdateModalOpen(false)
      performSearch(`/items/scan/${item.barcode_path}`)
    } catch (err) {
      console.error("Failed to update status:", err)
    } finally {
      setUpdateLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Modals */}
      {isScannerOpen && <BarcodeScanner onScanSuccess={handleScanSuccess} onClose={() => setIsScannerOpen(false)} />}
      {isHistoryOpen && (
        <HistoryModal history={historyData} loading={historyLoading} onClose={() => setIsHistoryOpen(false)} />
      )}
      {isUpdateModalOpen && (
        <UpdateStatusModal
          item={itemToUpdate}
          loading={updateLoading}
          onClose={() => setIsUpdateModalOpen(false)}
          onUpdate={handleUpdateStatus}
        />
      )}

      {/* Page Header */}
      <header className="border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-light tracking-tight text-neutral-900 mb-4">Item Status Checker</h1>
            <p className="text-neutral-500 font-mono tracking-wide text-sm uppercase">
              SCAN OR SEARCH TO VIEW ITEM STATUS
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-14">
          <form onSubmit={handleManualSearch} className="relative">
            <div className="bg-neutral-50 border border-neutral-200 overflow-hidden">
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter item code..."
                    className="w-full pl-12 pr-4 py-4 text-neutral-900 placeholder-neutral-400 bg-transparent focus:outline-none focus:ring-1 focus:ring-neutral-900 border-0"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center border-l border-neutral-200">
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearInput}
                      className="text-neutral-400 hover:text-neutral-900"
                      title="Clear"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsScannerOpen(true)}
                    className="text-neutral-400 hover:text-neutral-900 border-l border-neutral-200"
                    title="Scan Barcode"
                  >
                    <QrCode className="h-5 w-5" />
                  </Button>

                  <Button
                    type="submit"
                    disabled={loading || !searchTerm}
                    className="border-l border-neutral-200 rounded-none"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="font-mono text-xs tracking-wider">SEARCHING</span>
                      </div>
                    ) : (
                      <span className="font-mono text-xs tracking-wider">SEARCH</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="max-w-2xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mb-6" />
              <p className="text-neutral-500 font-mono text-sm tracking-wider uppercase">Searching Item</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-8 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-red-900 font-medium mb-2 font-mono text-sm tracking-wider uppercase">Not Found</div>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Item Result */}
          {item && (
            <div className="bg-white border border-neutral-200">
              <ItemCard item={item} onViewHistory={handleViewHistory} onUpdateStatus={handleOpenUpdateModal} />
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && !item && (
            <div className="text-center py-0">
              
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button variant="outline" onClick={() => setIsScannerOpen(true)} className="gap-2">
                  <QrCode className="h-4 w-4" />
                  <span className="font-mono text-xs tracking-wider">SCAN BARCODE</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default HomePage
