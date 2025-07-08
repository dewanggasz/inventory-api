"use client"

import {
  Clock,
  User,
  X,
  Info,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Wrench,
  Users,
  Skull,
  ArrowRight,
  Loader2,
  MapPin // <-- Impor ikon MapPin
} from "lucide-react"

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
    icon: "h-10 w-10",
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

// Function to get status styling with Lucide icons
const getStatusStyle = (status) => {
  switch (status) {
    case "Baik":
      return {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      }
    case "Rusak":
      return {
        icon: AlertTriangle,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      }
    case "Hilang":
      return {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      }
    case "Perbaikan":
      return {
        icon: Wrench,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      }
    case "Dipinjam":
      return {
        icon: Users,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      }
    case "Rusak Total":
      return {
        icon: Skull,
        color: "text-gray-800",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      }
    default:
      return {
        icon: ArrowRight,
        color: "text-neutral-600",
        bgColor: "bg-neutral-50",
        borderColor: "border-neutral-200",
      }
  }
}

function HistoryModal({ history, onClose, loading }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white border border-neutral-200 w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-neutral-200">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-neutral-500" />
                <h2 className="text-sm font-mono text-neutral-500 tracking-wider uppercase">Status History</h2>
              </div>
              <h3 className="text-lg font-light text-neutral-900 tracking-tight">Item Status Timeline</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-neutral-400 hover:text-neutral-900">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mb-4" />
              <p className="text-neutral-500 font-mono text-sm tracking-wider uppercase">Loading History</p>
            </div>
          ) : history.length > 0 ? (
            <div className="p-8">
              <div className="space-y-6">
                {history.map((record, index) => {
                  const { icon: StatusIcon, color, bgColor, borderColor } = getStatusStyle(record.status)
                  const isLatest = index === 0

                  return (
                    <div key={record.id} className="relative">
                      {/* Timeline Line */}
                      {index < history.length - 1 && (
                        <div className="absolute left-6 top-12 w-px h-full bg-neutral-200"></div>
                      )}

                      <div
                        className={cn(
                          "flex items-start gap-4 p-6 border transition-colors",
                          bgColor,
                          borderColor,
                          isLatest ? "ring-1 ring-neutral-900/10" : "",
                        )}
                      >
                        {/* Status Icon */}
                        <div
                          className={cn(
                            "flex-shrink-0 w-12 h-12 flex items-center justify-center border-2 bg-white",
                            borderColor,
                          )}
                        >
                          <StatusIcon className={cn("h-5 w-5", color)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Status and Latest Badge */}
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className={cn("font-medium text-lg", color)}>{record.status}</h4>
                            {isLatest && (
                              <span className="px-2 py-1 text-xs font-mono tracking-wider uppercase bg-neutral-900 text-white">
                                Latest
                              </span>
                            )}
                          </div>

                          {/* Metadata */}
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-neutral-600">
                              <User className="h-3 w-3" />
                              <span className="text-xs font-mono text-neutral-400 tracking-wider uppercase">
                                Updated By
                              </span>
                              <span className="font-medium text-neutral-900">{record.user.name}</span>
                            </div>

                            <div className="flex items-center gap-2 text-neutral-600">
                              <Clock className="h-3 w-3" />
                              <span className="text-xs font-mono text-neutral-400 tracking-wider uppercase">Date</span>
                              <span className="font-mono text-neutral-900">
                                {new Date(record.created_at).toLocaleString("id-ID", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>

                            {/* --- BLOK BARU UNTUK LOKASI --- */}
                            {record.location && (
                                <div className="flex items-center gap-2 text-neutral-600">
                                    <MapPin className="h-3 w-3" />
                                    <span className="text-xs font-mono text-neutral-400 tracking-wider uppercase">
                                        Lokasi
                                    </span>
                                    <span className="font-medium text-neutral-900">{record.location.name}</span>
                                </div>
                            )}
                            {/* ----------------------------- */}

                            {/* Notes */}
                            {record.note && (
                              <div className="pt-3 border-t border-neutral-200/50">
                                <div className="flex items-start gap-2 text-neutral-600">
                                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <span className="text-xs font-mono text-neutral-400 tracking-wider uppercase block mb-1">
                                      Notes
                                    </span>
                                    <p className="text-neutral-700 leading-relaxed">{record.note}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-neutral-900 font-medium mb-2">No History Available</h3>
              <p className="text-neutral-500 text-sm font-mono tracking-wide">
                NO STATUS CHANGES RECORDED FOR THIS ITEM
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && history.length > 0 && (
          <div className="px-8 py-4 border-t border-neutral-200 bg-neutral-50">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span className="font-mono tracking-wider uppercase">Total Records: {history.length}</span>
              <span className="font-mono tracking-wider uppercase">Showing Complete History</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryModal
