import { useState } from 'react';
import axiosClient from '../api/axiosClient'; // Path diperbaiki
import ItemCard from '../components/ItemCard'; // Path diperbaiki
import Alert from '../components/Alert'; // Path diperbaiki
import LoadingSpinner from '../components/LoadingSpinner'; // Path diperbaiki

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setItem(null);
    setError('');

    try {
      const response = await axiosClient.get(`/items/${searchTerm}`);
      setItem(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Barang dengan kode tersebut tidak ditemukan.');
      } else {
        setError('Terjadi kesalahan saat mengambil data.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10 px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800">Cek Status Barang</h1>
        <p className="text-gray-500 mt-2">
          Masukkan kode unik barang untuk melihat status terkininya.
        </p>
      </div>

      <form onSubmit={handleSearch} className="w-full max-w-md mt-8">
        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-300">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Contoh: ITEM-0001"
            className="w-full px-4 py-3 text-gray-700 focus:outline-none"
          />
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