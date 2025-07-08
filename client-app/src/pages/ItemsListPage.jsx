"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import axiosClient from "../api/axiosClient"
import Header from "../components/Header"
import LoadingSpinner from "../components/LoadingSpinner"
import { ChevronUp, ChevronDown, Search, FilterX, Filter } from "lucide-react"

// Utility function for class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ")
}

// Status options with colors
const statusOptions = ["Baik", "Rusak", "Hilang", "Perbaikan", "Dipinjam", "Rusak Total"]

// Enhanced Badge Component with status-specific colors
const badgeVariants = {
  // Indonesian status colors
  baik: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
  rusak: "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
  hilang: "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200",
  perbaikan: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  dipinjam: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
  "rusak total": "border-transparent bg-red-200 text-red-900 hover:bg-red-300",
  // Default variants
  default: "border-transparent bg-black text-white hover:bg-black/80",
  secondary: "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
  outline: "text-neutral-700 border-neutral-200",
}

const Badge = ({ children, variant = "default", className = "" }) => {
  const statusKey = children?.toString().toLowerCase()
  const variantClass = badgeVariants[statusKey] || badgeVariants[variant] || badgeVariants.default

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantClass,
        className,
      )}
    >
      {children}
    </span>
  )
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

// Select Component
const Select = ({ children, value, onChange, className = "", ...props }) => (
  <select
    value={value}
    onChange={onChange}
    className={cn(
      "h-10 px-3 py-2 border border-neutral-200 bg-white text-sm focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all",
      className,
    )}
    {...props}
  >
    {children}
  </select>
)

function ItemsListPage() {
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  // State untuk menampung data filter
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])

  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const searchTimeoutRef = useRef(null)

  // Fetch data untuk dropdown filter
  useEffect(() => {
    axiosClient.get("/categories").then(({ data }) => setCategories(data))
    axiosClient.get("/locations").then(({ data }) => setLocations(data))
  }, [])

  // Debounce search term
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500) // 500ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchTerm])

  // Update URL when debounced search term changes
  useEffect(() => {
    setSearchParams((prev) => {
      if (debouncedSearchTerm) {
        prev.set("search", debouncedSearchTerm)
      } else {
        prev.delete("search")
      }
      prev.set("page", "1")
      return prev
    })
  }, [debouncedSearchTerm, setSearchParams])

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

  // Fungsi generik untuk menangani perubahan filter
  const handleFilterChange = (key, value) => {
    if (key === "search") {
      setSearchTerm(value)
      return
    }

    setSearchParams((prev) => {
      if (value) {
        prev.set(key, value)
      } else {
        prev.delete(key)
      }
      prev.set("page", "1")
      return prev
    })
  }

  const clearFilters = () => {
    setSearchParams(new URLSearchParams())
  }

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

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.lastPage) return
    setSearchParams((prev) => {
      prev.set("page", page)
      return prev
    })
  }

  const hasActiveFilters =
    searchParams.get("search") ||
    searchParams.get("category_id") ||
    searchParams.get("location_id") ||
    searchParams.get("status")

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
        {/* Filter Section */}
        <div className="bg-neutral-50 border border-neutral-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-neutral-500" />
            <span className="text-sm text-neutral-500 font-mono tracking-wider uppercase">Filters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="md:col-span-5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items..."
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  value={searchTerm}
                  className="w-full pl-12 pr-12 py-3 border-0 bg-white focus:ring-1 focus:ring-neutral-900 focus:outline-none transition-all h-12 text-sm"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                {searchTerm !== debouncedSearchTerm && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Filter Dropdowns */}
            <Select
              onChange={(e) => handleFilterChange("category_id", e.target.value)}
              value={searchParams.get("category_id") || ""}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>

            <Select
              onChange={(e) => handleFilterChange("location_id", e.target.value)}
              value={searchParams.get("location_id") || ""}
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </Select>

            <Select
              onChange={(e) => handleFilterChange("status", e.target.value)}
              value={searchParams.get("status") || ""}
            >
              <option value="">All Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>

            <Button variant="outline" onClick={clearFilters} className="justify-center bg-transparent">
              <FilterX className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-neutral-200">
              <span className="text-xs text-neutral-400 font-mono tracking-wider">ACTIVE FILTERS:</span>
              {debouncedSearchTerm && (
                <Badge variant="outline" className="text-xs">
                  Search: {debouncedSearchTerm}
                </Badge>
              )}
              {searchParams.get("category_id") && (
                <Badge variant="outline" className="text-xs">
                  Category: {categories.find((c) => c.id == searchParams.get("category_id"))?.name}
                </Badge>
              )}
              {searchParams.get("location_id") && (
                <Badge variant="outline" className="text-xs">
                  Location: {locations.find((l) => l.id == searchParams.get("location_id"))?.name}
                </Badge>
              )}
              {searchParams.get("status") && (
                <Badge variant="outline" className="text-xs">
                  Status: {searchParams.get("status")}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white border border-neutral-200">
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
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center text-neutral-500">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-8 w-8 text-neutral-300" />
                          <div>No items found</div>
                          <div className="text-xs text-neutral-400">Try adjusting your search terms or filters</div>
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
                          <Badge>{item.latest_status?.status}</Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16 text-neutral-500">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-neutral-300" />
                    <div>No items found</div>
                    <div className="text-xs text-neutral-400">Try adjusting your search terms or filters</div>
                  </div>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="bg-white border border-neutral-200 p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-neutral-900 text-sm">{item.name}</h3>
                        <p className="text-xs font-mono text-neutral-500 mt-1">{item.code}</p>
                      </div>
                      <Badge className="ml-3">{item.latest_status?.status || "N/A"}</Badge>
                    </div>
                    <div className="pt-3 border-t border-neutral-100 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-400 font-mono tracking-wider uppercase">Category</span>
                        <span className="text-neutral-600">{item.category?.name}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-400 font-mono tracking-wider uppercase">Location</span>
                        <span className="text-neutral-600">{item.location?.name}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

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
