"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import axiosClient from "../api/axiosClient"
import Header from "../components/Header"
import LoadingSpinner from "../components/LoadingSpinner"
import { ChevronUp, ChevronDown, Search } from "lucide-react"

// Utility function for class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ")
}

// Badge Component
const badgeVariants = {
  default: "border-transparent bg-black text-white hover:bg-black/80",
  secondary: "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
  destructive: "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
  outline: "text-neutral-700 border-neutral-200",
}

const Badge = ({ children, variant = "default", className = "" }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
      badgeVariants[variant],
      className,
    )}
  >
    {children}
  </span>
)

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
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50"

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

function ItemsListPage() {
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  const fetchItems = useCallback(() => {
    setLoading(true)
    axiosClient
      .get("/items", { params: Object.fromEntries(searchParams) })
      .then(({ data }) => {
        setItems(data.data)
        setPagination({
          currentPage: data.current_page,
          lastPage: data.last_page,
          total: data.total,
          from: data.from,
          to: data.to,
        })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [searchParams])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleSort = (column) => {
    const currentSortBy = searchParams.get("sort_by")
    const currentSortDir = searchParams.get("sort_dir")
    let newSortDir = "asc"
    if (currentSortBy === column && currentSortDir === "asc") {
      newSortDir = "desc"
    }
    setSearchParams((prev) => {
      prev.set("sort_by", column)
      prev.set("sort_dir", newSortDir)
      return prev
    })
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchParams((prev) => {
      if (value) {
        prev.set("search", value)
      } else {
        prev.delete("search")
      }
      prev.set("page", "1") // Reset ke halaman 1 saat mencari
      return prev
    })
  }

  const handlePageChange = (page) => {
    setSearchParams((prev) => {
      prev.set("page", page)
      return prev
    })
  }

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
      case "baik", "rusak", "perbaikan":
        return "default"
      case "in use":
      case "baik":
        return "secondary"
      case "loan":
      case "dipinjam":
        return "loan"
      default:
        return "outline"
    }
  }

  const SortableHeader = ({ column, label }) => (
    <th
      scope="col"
      className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer select-none hover:bg-neutral-50 transition-colors"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-2">
        {label}
        {searchParams.get("sort_by") === column &&
          (searchParams.get("sort_dir") === "asc" ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          ))}
      </div>
    </th>
  )

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <header className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light tracking-tight text-neutral-900">Items Directory</h1>
              <p className="text-sm text-neutral-500 mt-2 font-mono tracking-wide">INVENTORY MANAGEMENT SYSTEM</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-light text-neutral-900">{pagination.total || 0}</div>
              <div className="text-xs text-neutral-500 font-mono tracking-wider">TOTAL ITEMS</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-12">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search items..."
              onChange={handleSearch}
              defaultValue={searchParams.get("search")}
              className="w-full pl-12 pr-4 py-3 border-0 bg-neutral-50 focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all h-12 text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          </div>
        </div>

        {/* Stats Cards */}
        

        {/* Table Section */}
        <div className="bg-white border border-neutral-200">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <SortableHeader column="name" label="Name" />
                <SortableHeader column="code" label="Code" />
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16">
                    <div className="flex items-center justify-center">
                      <LoadingSpinner />
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-neutral-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-neutral-300" />
                      <div>No items found</div>
                      <div className="text-xs text-neutral-400">Try adjusting your search terms</div>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-neutral-500">{item.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-500">{item.category?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-500">{item.location?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(item.latest_status?.status)}>{item.latest_status?.status}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-neutral-200 mt-8 gap-4">
          <div className="text-sm text-neutral-500 font-mono tracking-wide">
            SHOWING <span className="font-medium text-neutral-900">{pagination.from || 0}</span> TO{" "}
            <span className="font-medium text-neutral-900">{pagination.to || 0}</span> OF{" "}
            <span className="font-medium text-neutral-900">{pagination.total || 0}</span> RESULTS
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
            >
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.lastPage || 1) }, (_, i) => {
                const page = i + 1
                const isActive = page === pagination.currentPage

                return (
                  <Button
                    key={page}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.lastPage}
            >
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ItemsListPage
