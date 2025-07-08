import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChevronUp, ChevronDown, Search, FilterX } from 'lucide-react';

const statusOptions = ['Baik', 'Rusak', 'Hilang', 'Perbaikan', 'Dipinjam', 'Rusak Total'];

function ItemsListPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate(); // Hook untuk navigasi

  // State baru untuk menampung data filter
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  // State lokal untuk menampung nilai input pencarian sementara
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const isInitialMount = useRef(true); // Ref untuk menandai render pertama

  // Fetch data untuk dropdown filter
  useEffect(() => {
    axiosClient.get('/categories').then(({ data }) => setCategories(data));
    axiosClient.get('/locations').then(({ data }) => setLocations(data));
  }, []);

  const fetchItems = useCallback(() => {
    setLoading(true);
    axiosClient.get('/items', { params: Object.fromEntries(searchParams) })
      .then(({ data }) => {
        setItems(data.data);
        setPagination({
          currentPage: data.current_page,
          lastPage: data.last_page,
          total: data.total,
          from: data.from,
          to: data.to,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchParams]);

  useEffect(() => {
    fetchItems();
  }, [searchParams]);

  // Efek Debounce yang lebih cerdas
  useEffect(() => {
     if (isInitialMount.current) {
         isInitialMount.current = false;
         return;
     }

     const timer = setTimeout(() => {
         handleFilterChange('search', searchTerm);
     }, 500);

     return () => clearTimeout(timer);
  }, [searchTerm]);


  const handleFilterChange = useCallback((key, value) => {
    setSearchParams(prev => {
        if (value) {
            prev.set(key, value);
        } else {
            prev.delete(key);
        }
        prev.set('page', '1');
        return prev;
    }, { replace: true });
  }, [setSearchParams]);

  const clearFilters = () => {
    setSearchTerm('');
    setSearchParams(new URLSearchParams());
  };

  const handleSort = (column) => {
    const currentSortBy = searchParams.get('sort_by');
    const currentSortDir = searchParams.get('sort_dir');
    let newSortDir = 'asc';
    if (currentSortBy === column && currentSortDir === 'asc') {
      newSortDir = 'desc';
    }
    setSearchParams(prev => {
      prev.set('sort_by', column);
      prev.set('sort_dir', newSortDir);
      return prev;
    });
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.lastPage) return;
    setSearchParams(prev => {
        prev.set('page', page);
        return prev;
    });
  };

  const SortableHeader = ({ column, label }) => (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => handleSort(column)}>
      <div className="flex items-center cursor-pointer select-none">
        {label}
        {searchParams.get('sort_by') === column && (
          searchParams.get('sort_dir') === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
        )}
      </div>
    </th>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Daftar Semua Barang</h1>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama atau kode..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </div>
            <select onChange={(e) => handleFilterChange('category_id', e.target.value)} value={searchParams.get('category_id') || ''} className="border-gray-300 rounded-lg">
                <option value="">Semua Kategori</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <select onChange={(e) => handleFilterChange('location_id', e.target.value)} value={searchParams.get('location_id') || ''} className="border-gray-300 rounded-lg">
                <option value="">Semua Lokasi</option>
                {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
            </select>
            <select onChange={(e) => handleFilterChange('status', e.target.value)} value={searchParams.get('status') || ''} className="border-gray-300 rounded-lg">
                <option value="">Semua Status</option>
                {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
            <button onClick={clearFilters} className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg">
                <FilterX size={16} className="mr-2" /> Hapus Filter
            </button>
          </div>
        </div>

         {loading ? (
           <div className="flex justify-center py-10"><LoadingSpinner /></div>
         ) : (
           <>
             <div className="hidden md:block shadow border-b border-gray-200 sm:rounded-lg">
               <table className="min-w-full divide-y divide-gray-200">
                 <thead className="bg-gray-50">
                   <tr>
                     <SortableHeader column="name" label="Nama Barang" />
                     <SortableHeader column="code" label="Kode" />
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Terakhir</th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                   {items.map((item) => (
                     <tr key={item.id} onClick={() => navigate(`/items/${item.code}`)} className="hover:bg-gray-50 cursor-pointer">
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.code}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category?.name}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location?.name}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.latest_status?.status}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>

             <div className="md:hidden space-y-4">
               {items.map((item) => (
                 <Link to={`/items/${item.code}`} key={item.id} className="block">
                    <div className="bg-white shadow rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                            <p className="font-bold text-gray-800">{item.name}</p>
                            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{item.latest_status?.status || 'N/A'}</span>
                        </div>
                        <p className="text-sm text-gray-500">{item.code}</p>
                        <div className="mt-3 pt-3 border-t border-gray-100 text-sm space-y-2">
                            <p><strong className="text-gray-500">Kategori:</strong> {item.category?.name}</p>
                            <p><strong className="text-gray-500">Lokasi:</strong> {item.location?.name}</p>
                        </div>
                    </div>
                 </Link>
               ))}
             </div>
           </>
         )}

        <div className="py-4 flex items-center justify-between">
            <p className="text-sm text-gray-700">
                Menampilkan <span className="font-medium">{pagination.from || 0}</span> sampai <span className="font-medium">{pagination.to || 0}</span> dari <span className="font-medium">{pagination.total || 0}</span> hasil
            </p>
            <div className="flex-1 flex justify-end space-x-2">
                <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage <= 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                    Sebelumnya
                </button>
                <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.lastPage} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                    Selanjutnya
                </button>
            </div>
        </div>
      </main>
    </div>
  );
}

export default ItemsListPage;
