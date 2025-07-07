import { Clock, User, X, Info } from 'lucide-react';

// Fungsi untuk mendapatkan warna dan ikon berdasarkan status
const getStatusStyle = (status) => {
  switch (status) {
    case 'Baik':
      return { icon: '✅', color: 'text-green-600' };
    case 'Rusak':
      return { icon: '⚠️', color: 'text-yellow-600' };
    case 'Hilang':
      return { icon: '❌', color: 'text-red-600' };
    case 'Perbaikan':
      return { icon: '🔧', color: 'text-blue-600' };
    case 'Dipinjam':
      return { icon: '🤝', color: 'text-purple-600' };
    case 'Rusak Total':
      return { icon: '💀', color: 'text-gray-800' };
    default:
      return { icon: '➡️', color: 'text-gray-600' };
  }
};

function HistoryModal({ history, onClose, loading }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Riwayat Status Barang</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {loading ? (
            <p>Memuat riwayat...</p>
          ) : history.length > 0 ? (
            <ul className="space-y-6">
              {history.map((record) => {
                const { icon, color } = getStatusStyle(record.status);
                return (
                  <li key={record.id} className="flex items-start space-x-4">
                    <div className={`text-2xl ${color}`}>{icon}</div>
                    <div className="flex-1">
                      <p className={`font-bold text-lg ${color}`}>{record.status}</p>
                      <div className="text-sm text-gray-500 mt-1 space-y-1">
                        <p className="flex items-center"><User size={14} className="mr-2" /> Diubah oleh: {record.user.name}</p>
                        <p className="flex items-center"><Clock size={14} className="mr-2" /> Tanggal: {new Date(record.created_at).toLocaleString('id-ID')}</p>
                        {record.note && <p className="flex items-start"><Info size={14} className="mr-2 mt-0.5" /> Catatan: {record.note}</p>}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Tidak ada riwayat untuk barang ini.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoryModal;