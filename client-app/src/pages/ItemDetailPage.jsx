import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import ItemCard from '../components/ItemCard';
import HistoryModal from '../components/HistoryModal';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { ArrowLeft } from 'lucide-react';

function ItemDetailPage() {
  const { code } = useParams(); // Mengambil kode dari URL
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State untuk modal
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchItem = useCallback(() => {
    setLoading(true);
    axiosClient.get(`/items/${code}`)
      .then(({ data }) => {
        setItem(data);
      })
      .catch(err => {
        setError('Gagal memuat detail barang.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [code]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  // Fungsi-fungsi untuk menangani modal
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
      const response = await axiosClient.patch(`/items/${itemId}/status`, data);
      setItem(response.data.data);
      setIsUpdateModalOpen(false);
    } catch (err) {
      console.error("Gagal mengubah status:", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/items" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600">
            <ArrowLeft size={16} className="mr-2" />
            Kembali ke Daftar Barang
          </Link>
        </div>

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

        {loading && <div className="flex justify-center py-10"><LoadingSpinner /></div>}
        {error && <Alert message={error} />}
        {item && (
          <div className="flex justify-center">
            <ItemCard 
              item={item} 
              onViewHistory={handleViewHistory} 
              onUpdateStatus={handleOpenUpdateModal} 
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default ItemDetailPage;
