import React from 'react';

// Fungsi untuk mendapatkan warna badge berdasarkan status
const getStatusColor = (status) => {
  switch (status) {
    case 'Baik':
      return 'bg-green-100 text-green-800';
    case 'Rusak':
      return 'bg-yellow-100 text-yellow-800';
    case 'Hilang':
      return 'bg-red-100 text-red-800';
    case 'Perbaikan':
        return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

function ItemCard({ item }) {
  if (!item) return null;

  const { name, code, category, location, latestStatus } = item;

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mt-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
        {latestStatus && (
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(latestStatus.status)}`}>
            {latestStatus.status}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-1">{code}</p>
      
      <div className="mt-6 border-t border-gray-200 pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-600">Kategori</p>
            <p className="text-gray-800">{category?.name || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Lokasi</p>
            <p className="text-gray-800">{location?.name || '-'}</p>
          </div>
          {latestStatus && (
            <>
              <div>
                <p className="font-semibold text-gray-600">Diupdate Oleh</p>
                <p className="text-gray-800">{latestStatus.user?.name || '-'}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Tanggal Update</p>
                <p className="text-gray-800">{new Date(latestStatus.created_at).toLocaleString('id-ID')}</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold text-gray-600">Catatan</p>
                <p className="text-gray-800">{latestStatus.note || 'Tidak ada catatan.'}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemCard;