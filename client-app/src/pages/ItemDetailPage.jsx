"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, Link } from "react-router-dom"
import axiosClient from "../api/axiosClient"
import Header from "../components/Header"
import ItemCard from "../components/ItemCard"
import HistoryModal from "../components/HistoryModal"
import UpdateStatusModal from "../components/UpdateStatusModal"
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react"

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

  const Component = href ? "a" : "button"

  return (
    <Component
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      onClick={onClick}
      href={href}
      {...props}
    >
      {children}
    </Component>
  )
}

function ItemDetailPage() {
  const { code } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [historyData, setHistoryData] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [itemToUpdate, setItemToUpdate] = useState(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateError, setUpdateError] = useState("")

  const fetchItem = useCallback(() => {
    setLoading(true)
    axiosClient
      .get(`/items/${code}`)
      .then(({ data }) => {
        setItem(data)
      })
      .catch((err) => {
        setError("Failed to load item details.")
        console.error(err)
      })
      .finally(() => setLoading(false))
  }, [code])

  useEffect(() => {
    fetchItem()
  }, [fetchItem])

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
    setUpdateError("")
    setItemToUpdate(itemForUpdate)
    setIsUpdateModalOpen(true)
  }

  const handleUpdateStatus = async (itemId, formData) => {
    setUpdateLoading(true)
    setUpdateError("")
    try {
      const response = await axiosClient.post(`/items/${itemId}/status`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setItem(response.data.data)
      setIsUpdateModalOpen(false)
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update status. Please try again."
      setUpdateError(message)
      console.error("Failed to update status:", err.response?.data || err)
    } finally {
      setUpdateLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Modals */}
      {isHistoryOpen && (
        <HistoryModal history={historyData} loading={historyLoading} onClose={() => setIsHistoryOpen(false)} />
      )}
      {isUpdateModalOpen && (
        <UpdateStatusModal
          item={itemToUpdate}
          loading={updateLoading}
          onClose={() => setIsUpdateModalOpen(false)}
          onUpdate={handleUpdateStatus}
          apiError={updateError}
        />
      )}

      {/* Page Header */}
      <header className="border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/items"
                className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-mono text-xs tracking-wider uppercase">Back to Items</span>
              </Link>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-light tracking-tight text-neutral-900">Item Details</h1>
              <p className="text-sm text-neutral-500 mt-1 font-mono tracking-wide">DETAILED VIEW</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mb-6" />
            <p className="text-neutral-500 font-mono text-sm tracking-wider uppercase">Loading Item Details</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-8 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-red-900 font-medium mb-2 font-mono text-sm tracking-wider uppercase">Error</div>
            <p className="text-red-700 text-sm">{error}</p>
            <div className="mt-6">
              <Button variant="outline" onClick={fetchItem} className="gap-2 bg-transparent">
                <span className="font-mono text-xs tracking-wider uppercase">Try Again</span>
              </Button>
            </div>
          </div>
        )}

        {/* Item Content */}
        {item && (
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <ItemCard item={item} onViewHistory={handleViewHistory} onUpdateStatus={handleOpenUpdateModal} />
            </div>
          </div>
        )}

        {/* Empty State - if no item and no loading/error */}
        {!loading && !error && !item && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-neutral-900 font-medium mb-2">Item Not Found</h3>
            <p className="text-neutral-500 text-sm font-mono tracking-wide mb-8">
              THE REQUESTED ITEM COULD NOT BE FOUND
            </p>
            <Link to="/items">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                <span className="font-mono text-xs tracking-wider uppercase">Back to Items</span>
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

export default ItemDetailPage
