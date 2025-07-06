import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import ItemCard from '../components/ItemCard';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import BarcodeScanner from '../components/BarcodeScanner'; // <-- Impor komponen baru

// Ikon Kamera (SVG)
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 1.003m-3-1.003V13m0 0a2 2 0 100 4 2 2 0 000-4zm-6 8a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);


function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false); // <-- State untuk scanner

  // Menggunakan useCallback agar fungsi tidak dibuat ulang di setiap render
  const performSearch = useCallback(async (code) => {
    if (!code) return;

    setLoading(true);
    setItem(null);
    setError('');

    try {
      // Kita akan mencari berdasarkan barcode, bukan kode unik
      const response = await axiosClient.get(`/items/scan/${code}`);
      setItem(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Barang dengan barcode tersebut tidak ditemukan.');
      } else {
        setError('Terjadi kesalahan saat mengambil data.');
      }
      console.error(err);
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
    // Pencarian akan dipicu oleh useEffect di bawah
  };

  // useEffect akan berjalan ketika searchTerm berubah (termasuk dari hasil scan)
  useEffect(() => {
    if (isScannerOpen === false && searchTerm) {
        // Cek ini untuk memastikan pencarian otomatis hanya terjadi setelah scan, bukan saat mengetik
        // Untuk implementasi ini, kita asumsikan setiap perubahan searchTerm akan langsung dicari
        // Jika ingin hanya setelah scan, perlu state tambahan.
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
        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-300">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Kode barang atau hasil scan..."
            className="w-full px-4 py-3 text-gray-700 focus:outline-none"
          />
          <button
            type="button" // <-- Ubah menjadi type="button"
            onClick={() => setIsScannerOpen(true)}
            className="p-3 text-gray-500 hover:text-blue-600"
            title="Pindai Barcode"
          >
            <CameraIcon />
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {loading ? '...' : 'Cari'}
          </button>
        </div>
      </form>
      
      <div className="mt-6">
        {loading && <LoadingSpinner />}
        {error && <Alert message={error} />}
        {item && <ItemCard item={item} />}
      </div>
    </div>
  );
}

export default HomePage;
