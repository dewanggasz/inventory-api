"use client"

import { useState } from "react"
import { X, Loader2, Edit } from "lucide-react"

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
    icon: "h-10 w-10",
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

// Select Component
const Select = ({ children, value, onChange, className = "", ...props }) => (
  <select
    value={value}
    onChange={onChange}
    className={cn(
      "w-full h-12 px-4 py-3 border border-neutral-200 bg-white text-sm focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all",
      className,
    )}
    {...props}
  >
    {children}
  </select>
)

// Textarea Component
const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={cn(
      "w-full px-4 py-3 border border-neutral-200 bg-white text-sm focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all resize-none",
      className,
    )}
    {...props}
  />
)

const statusOptions = ["Baik", "Hilang", "Perbaikan", "Dipinjam", "Rusak", "Rusak Total"]

function UpdateStatusModal({ item, onClose, onUpdate, loading }) {
  const [newStatus, setNewStatus] = useState(item.latestStatus?.status || "Baik")
  const [note, setNote] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(item.id, { status: newStatus, note })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white border border-neutral-200 w-full max-w-md">
        {/* Header */}
        <div className="px-8 py-6 border-b border-neutral-200">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Edit className="h-4 w-4 text-neutral-500" />
                <h2 className="text-sm font-mono text-neutral-500 tracking-wider uppercase">Update Status</h2>
              </div>
              <h3 className="text-lg font-light text-neutral-900 tracking-tight">{item.name}</h3>
              <p className="text-sm font-mono text-neutral-500 mt-1">{item.code}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-neutral-400 hover:text-neutral-900">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6 space-y-6">
            {/* Status Selection */}
            <div className="space-y-3">
              <label htmlFor="status" className="block text-xs font-mono text-neutral-400 tracking-wider uppercase">
                New Status
              </label>
              <Select id="status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <label htmlFor="note" className="block text-xs font-mono text-neutral-400 tracking-wider uppercase">
                Notes (Optional)
              </label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder="Add any relevant notes about the status change..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-neutral-200 bg-neutral-50">
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                <span className="font-mono text-xs tracking-wider uppercase">Cancel</span>
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="font-mono text-xs tracking-wider uppercase">Saving</span>
                  </div>
                ) : (
                  <span className="font-mono text-xs tracking-wider uppercase">Save Changes</span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateStatusModal
