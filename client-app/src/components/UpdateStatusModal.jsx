import { useState } from 'react';
import { X } from 'lucide-react';

const statusOptions = ['Baik', 'Rusak', 'Hilang', 'Perbaikan'];

function UpdateStatusModal({ item, onClose, onUpdate, loading }) {
  const [newStatus, setNewStatus] = useState(item.latestStatus?.status || 'Baik');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(item.id, { status: newStatus, note });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Ubah Status: {item.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="status" className="text-sm font-bold text-gray-600 block mb-2">
                Status Baru
              </label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="note" className="text-sm font-bold text-gray-600 block mb-2">
                Catatan (Opsional)
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="3"
                placeholder="Contoh: Layar retak saat dipindahkan."
                className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
          <div className="p-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateStatusModal;