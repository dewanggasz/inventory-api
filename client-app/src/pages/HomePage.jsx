import { useState, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import ItemCard from '../components/ItemCard';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import BarcodeScanner from '../components/BarcodeScanner';
import HistoryModal from '../components/HistoryModal';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { Camera, X } from 'lucide-react';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const performSearch = useCallback(async (endpoint) => {
    setLoading(true);
    setItem(null);
    setError('');
    try {
      const response = await axiosClient.get(endpoint);
      setItem(response.data);
    } catch (err) {
      setError(err.response?.status === 404 ? 'Barang tidak ditemukan.' : 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    performSearch(`/items/${searchTerm}`);
  };

  const handleScanSuccess = (decodedText) => {
    setSearchTerm(decodedText);
    setIsScannerOpen(false);
    performSearch(`/items/scan/${decodedText}`);
  };

  const clearInput = () => {
    setSearchTerm('');
    setItem(null);
    setError('');
  };

  const handleViewHistory = async (itemCode) => {
    setHistoryLoading(true);
    setIsHistoryOpen(true);
    setHistoryData([]);
    try {
      const response = await axiosClient.get(`/items/${itemCode}/history`);
      setHistoryData(response.data);
    } catch (err) {
      console.error("Gagal mengambil riwayat:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleOpenUpdateModal = (itemForUpdate) => {
    setItemToUpdate(itemForUpdate);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStatus = async (itemId, data) => {
    setUpdateLoading(true);
    try {
      await axiosClient.patch(`/items/${itemId}/status`, data);
      setIsUpdateModalOpen(false);
      // Refresh data barang yang ditampilkan setelah berhasil update
      performSearch(`/items/scan/${item.barcode_path}`);
    } catch (err) {
      console.error("Gagal mengubah status:", err);
      // Di sini bisa ditambahkan notifikasi error jika perlu
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10 px-4">
      {isScannerOpen && (
        <BarcodeScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setIsScannerOpen(false)}
        />
      )}

      {isHistoryOpen && (
        <HistoryModal
          history={historyData}
          loading={historyLoading}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {isUpdateModalOpen && (
        <UpdateStatusModal
          item={itemToUpdate}
          loading={updateLoading}
          onClose={() => setIsUpdateModalOpen(false)}
          onUpdate={handleUpdateStatus}
        />
      )}

      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800">Cek Status Barang</h1>
        <p className="text-gray-500 mt-2">
          Masukkan kode barang atau pindai barcode untuk melihat statusnya.
        </p>
      </div>

      <form onSubmit={handleManualSearch} className="w-full max-w-md mt-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Kode barang atau hasil scan..."
            className="w-full px-4 py-3 pr-24 text-gray-700 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            {searchTerm && (
              <button
                type="button"
                onClick={clearInput}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Hapus"
              >
                <X size={20} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="p-2 text-gray-400 hover:text-blue-600"
              title="Pindai Barcode"
            >
              <Camera size={20} />
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-full bg-blue-600 text-white px-4 font-semibold hover:bg-blue-700 disabled:bg-blue-300 rounded-r-md"
            >
              {loading ? '...' : 'Cari'}
            </button>
          </div>
        </div>
      </form>

      <div className="w-full max-w-md mt-6">
        {loading && <div className="flex justify-center"><LoadingSpinner /></div>}
        {error && <Alert message={error} />}
        {item && <ItemCard item={item} onViewHistory={handleViewHistory} onUpdateStatus={handleOpenUpdateModal} />}
      </div>
    </div>
  );
}

export default HomePage;