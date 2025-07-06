import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import ItemCard from '../components/ItemCard';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import BarcodeScanner from '../components/BarcodeScanner';
import { Camera, X } from 'lucide-react'; // <-- Impor ikon

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const performSearch = useCallback(async (code) => {
    if (!code) return;
    setLoading(true);
    setItem(null);
    setError('');
    try {
      // Endpoint diubah menjadi /scan/ untuk konsistensi dengan scanner
      const response = await axiosClient.get(`/items/scan/${code}`);
      setItem(response.data);
    } catch (err) {
      setError(err.response?.status === 404 ? 'Barang tidak ditemukan.' : 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleManualSearch = (e) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  const handleScanSuccess = (decodedText) => {
    setSearchTerm(decodedText);
    setIsScannerOpen(false);
  };

  const clearInput = () => {
    setSearchTerm('');
    setItem(null);
    setError('');
  };

  // useEffect ini akan memicu pencarian setiap kali searchTerm berubah
  // dan scanner tidak sedang terbuka.
  useEffect(() => {
    if (!isScannerOpen && searchTerm) {
      performSearch(searchTerm);
    }
  }, [searchTerm, isScannerOpen, performSearch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10 px-4">
      {isScannerOpen && (
        <BarcodeScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setIsScannerOpen(false)}
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
        {item && <ItemCard item={item} />}
      </div>
    </div>
  );
}

export default HomePage;