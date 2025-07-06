import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function BarcodeScanner({ onScanSuccess, onClose }) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  // Fungsi untuk menangani scan dari file
  const handleFileScan = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    // Membuat instance scanner baru khusus untuk file, untuk menghindari konflik
    // dengan scanner kamera langsung, terutama di browser seperti Edge.
    const fileScanner = new Html5Qrcode('reader', false);
    fileScanner.scanFile(file, false)
      .then(decodedText => {
        onScanSuccess(decodedText);
      })
      .catch(err => {
        setError('Gagal memindai gambar. Pastikan gambar berisi barcode yang jelas.');
        console.error('File scan error:', err);
      });
  };

  useEffect(() => {
    let html5QrCode;
    let isMounted = true;

    const startScanner = async () => {
      try {
        // Inisialisasi hanya jika belum ada instance
        if (!html5QrCode) {
          html5QrCode = new Html5Qrcode('reader');
        }

        const devices = await Html5Qrcode.getCameras();
        if (isMounted && devices && devices.length) {
          const cameraId = devices[0].id;
          await html5QrCode.start(
            cameraId,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
              if (isMounted) {
                onScanSuccess(decodedText);
              }
            },
            (errorMessage) => { /* Abaikan error parsing */ }
          );
        } else if (isMounted) {
          setError("Tidak ada kamera yang ditemukan.");
        }
      } catch (err) {
        if (isMounted) {
          setError("Gagal mengakses kamera. Periksa izin di browser.");
        }
        console.error("Gagal mendapatkan kamera:", err);
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Gagal menghentikan scanner.", err));
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-md text-center">
        <h2 className="text-lg font-bold mb-2">Pindai Barcode</h2>
        <div id="reader" className="w-full border rounded-md"></div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Tombol untuk memicu input file */}
        <button
          onClick={() => fileInputRef.current.click()}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Pindai dari File
        </button>
        {/* Input file yang disembunyikan */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileScan}
          className="hidden"
        />

        <button
          onClick={onClose}
          className="mt-2 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
        >
          Batal
        </button>
      </div>
    </div>
  );
}

export default BarcodeScanner;