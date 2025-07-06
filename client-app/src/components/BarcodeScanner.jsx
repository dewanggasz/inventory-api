import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function BarcodeScanner({ onScanSuccess, onClose }) {
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  const handleFileScan = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileScanner = new Html5Qrcode('reader', false);
    fileScanner.scanFile(file, false)
      .then(onScanSuccess)
      .catch(err => {
        setError('Gagal memindai gambar. Pastikan gambar berisi barcode yang jelas.');
      });
  };

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode('reader');
    }
    const html5QrCode = scannerRef.current;

    const startScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          await html5QrCode.start(
            devices[0].id,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
              if (html5QrCode.isScanning) {
                onScanSuccess(decodedText);
              }
            },
            (errorMessage) => { /* Abaikan */ }
          );
          setError('');
        } else {
          setError("Tidak ada kamera yang ditemukan.");
        }
      } catch (err) {
        if (!html5QrCode.isScanning) {
          setError("Gagal mengakses kamera. Periksa izin di browser.");
        }
      }
    };

    startScanner();

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => {
          console.error("Gagal menghentikan scanner.", err);
        });
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-center">Pindai Barcode</h2>
        </div>
        <div className="p-4">
          <div className="relative w-full overflow-hidden" style={{ paddingTop: '100%' }}>
            <div className="absolute top-0 left-0 w-full h-full">
              <div id="reader" className="w-full h-full"></div>
            </div>
            {/* PERBAIKAN: Hapus 'top-0' agar posisi diatur oleh animasi */}
            <div className="absolute left-0 w-full h-1 bg-red-500/70 shadow-[0_0_10px_red] animate-scan-line rounded-full"></div>
          </div>
          {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
        </div>
        <div className="p-4 border-t space-y-2">
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-full bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 font-semibold"
          >
            Pindai dari File
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileScan}
            className="hidden"
          />
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-800 py-2.5 rounded-lg hover:bg-gray-300 font-semibold"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

export default BarcodeScanner;