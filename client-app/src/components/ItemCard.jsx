"use client"

import { History, Edit, Calendar, User, FileText } from "lucide-react"

// Utility function for class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ")
}

// Status color mapping with Swiss design colors
const getStatusColor = (status) => {
  switch (status) {
    case "Baik":
      return "bg-green-100 text-green-800 border-green-200"
    case "Rusak":
      return "bg-red-100 text-red-800 border-red-200"
    case "Hilang":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "Perbaikan":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Dipinjam":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Rusak Total":
      return "bg-red-200 text-red-900 border-red-300"
    default:
      return "bg-neutral-100 text-neutral-800 border-neutral-200"
  }
}

// Button Component
const Button = ({
  children,
  variant = "default",
  size = "default",
  disabled = false,
  onClick,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50"

  const variants = {
    default: "bg-black text-white hover:bg-black/90",
    outline: "border border-neutral-200 bg-white hover:bg-neutral-50",
    ghost: "hover:bg-neutral-100",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-sm",
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

function ItemCard({ item, onViewHistory, onUpdateStatus }) {
  if (!item) return null

  const { name, code, category, location } = item
  const latestStatus = item.latest_status

  return (
    <div className="w-full bg-white border border-neutral-200 overflow-hidden">
      {/* Header Section */}
      <div className="bg-neutral-50 px-8 py-6 border-b border-neutral-200">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-light text-neutral-900 mb-2 tracking-tight">{name}</h2>
            <p className="text-sm font-mono text-neutral-500 tracking-wider">{code}</p>
          </div>
          {latestStatus && (
            <span
              className={cn("px-3 py-1 text-xs font-medium rounded-full border", getStatusColor(latestStatus.status))}
            >
              {latestStatus.status}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8">
        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <div className="space-y-2">
            <p className="text-xs font-mono text-neutral-400 tracking-wider uppercase">Category</p>
            <p className="text-neutral-900 font-medium">{category?.name || "—"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-neutral-400 tracking-wider uppercase">Location</p>
            <p className="text-neutral-900 font-medium">{location?.name || "—"}</p>
          </div>
        </div>

        {/* Status Details */}
        {latestStatus && (
          <div className="bg-neutral-50 border border-neutral-200 p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-4 w-4 text-neutral-500" />
              <h3 className="text-sm font-mono text-neutral-500 tracking-wider uppercase">Latest Status Info</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-neutral-400" />
                  <p className="text-xs font-mono text-neutral-400 tracking-wider uppercase">Updated By</p>
                </div>
                <p className="text-sm text-neutral-900">{latestStatus.user?.name || "—"}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-neutral-400" />
                  <p className="text-xs font-mono text-neutral-400 tracking-wider uppercase">Update Date</p>
                </div>
                <p className="text-sm text-neutral-900 font-mono">
                  {new Date(latestStatus.created_at).toLocaleString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {latestStatus.note && (
              <div className="space-y-2">
                <p className="text-xs font-mono text-neutral-400 tracking-wider uppercase">Notes</p>
                <div className="bg-white border border-neutral-200 p-4">
                  <p className="text-sm text-neutral-700 leading-relaxed">{latestStatus.note}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
          <Button variant="outline" onClick={() => onViewHistory(code)} className="flex-1 justify-center gap-2 h-12">
            <History className="h-4 w-4" />
            <span className="font-mono text-xs tracking-wider">VIEW HISTORY</span>
          </Button>
          <Button onClick={() => onUpdateStatus(item)} className="flex-1 justify-center gap-2 h-12">
            <Edit className="h-4 w-4" />
            <span className="font-mono text-xs tracking-wider">UPDATE STATUS</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ItemCard
