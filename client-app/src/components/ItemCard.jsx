"use client"

import { History, Edit } from "lucide-react"

const getStatusColor = (status) => {
  switch (status) {
    case "Baik":
      return "bg-green-100 text-green-800 border-green-200"
    case "Rusak":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Hilang":
      return "bg-red-100 text-red-800 border-red-200"
    case "Perbaikan":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case 'Dipinjam':
      return 'bg-purple-100 text-purple-800';
    case 'Rusak Total':
      return 'bg-gray-700 text-white';
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function ItemCard({ item, onViewHistory, onUpdateStatus }) {
  if (!item) return null

  const { name, code, category, location } = item;
  const latestStatus = item.latest_status;


  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-1">{name}</h2>
            <p className="text-sm text-gray-500 font-mono">{code}</p>
          </div>
          {latestStatus && (
            <span className={`px-3 py-1 text-sm font-medium rounded-lg border ${getStatusColor(latestStatus.status)}`}>
              {latestStatus.status}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Basic Info Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Kategori</p>
            <p className="text-gray-800 font-medium">{category?.name || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Lokasi</p>
            <p className="text-gray-800 font-medium">{location?.name || "-"}</p>
          </div>
        </div>

        {/* Status Details */}
        {latestStatus && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Informasi Status Terakhir</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Diupdate Oleh</p>
                <p className="text-sm text-gray-800">{latestStatus.user?.name || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Tanggal Update</p>
                <p className="text-sm text-gray-800">
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
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500 mb-1">Catatan</p>
                <p className="text-sm text-gray-800 bg-white rounded-md p-3 border border-gray-200">
                  {latestStatus.note}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onViewHistory(code)}
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors border border-gray-200"
          >
            <History size={18} className="mr-2" />
            Lihat Riwayat
          </button>
          <button
            onClick={() => onUpdateStatus(item)}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <Edit size={18} className="mr-2" />
            Ubah Status
          </button>
        </div>
      </div>
    </div>
  )
}

export default ItemCard
