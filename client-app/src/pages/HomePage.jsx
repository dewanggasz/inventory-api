"use client"

import { useState, useCallback } from "react"
import axiosClient from "../api/axiosClient"
import ItemCard from "../components/ItemCard"
import BarcodeScanner from "../components/BarcodeScanner"
import HistoryModal from "../components/HistoryModal"
import UpdateStatusModal from "../components/UpdateStatusModal"
import Header from "../components/Header"
import { Camera, X, Search, QrCode } from "lucide-react"

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
      setError(err.response?.status === 404 ? "Barang tidak ditemukan." : "Terjadi kesalahan.")
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
      console.error("Gagal mengambil riwayat:", err)
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
      console.error("Gagal mengubah status:", err)
    } finally {
      setUpdateLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <Header />

      <main className="pt-30 max-w-4xl mx-auto px-4 py-8">
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

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cek Status Barang</h1>
          <p className="text-gray-600">Masukkan kode barang atau pindai barcode untuk melihat statusnya</p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleManualSearch} className="relative">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Masukkan kode barang..."
                    className="w-full pl-12 pr-4 py-4 text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center border-l border-gray-200">
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={clearInput}
                      className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Hapus"
                    >
                      <X size={20} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsScannerOpen(true)}
                    className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Pindai Barcode"
                  >
                    <QrCode size={20} />
                  </button>

                  <button
                    type="submit"
                    disabled={loading || !searchTerm}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-4 font-medium transition-colors"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Mencari...</span>
                      </div>
                    ) : (
                      "Cari"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="max-w-2xl mx-auto">
          {loading && (
            <div className="flex flex-col items-center py-12">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-600">Mencari barang...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-red-600 font-medium mb-2">Tidak Ditemukan</div>
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {item && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <ItemCard item={item} onViewHistory={handleViewHistory} onUpdateStatus={handleOpenUpdateModal} />
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && !item && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Masukkan kode barang atau pindai barcode untuk memulai</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default HomePage
