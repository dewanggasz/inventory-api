"use client"

import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { X, Camera, Upload, Scan, AlertCircle, Loader2 } from "lucide-react"

function BarcodeScanner({ onScanSuccess, onClose }) {
  const scannerRef = useRef(null)
  const fileInputRef = useRef(null)
  const [error, setError] = useState("")
  const [isInitializing, setIsInitializing] = useState(true)

  const handleFileScan = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const fileScanner = new Html5Qrcode("reader", false)
    fileScanner
      .scanFile(file, false)
      .then(onScanSuccess)
      .catch((err) => {
        setError("Failed to scan image. Please ensure the image contains a clear barcode.")
      })
  }

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("reader")
    }

    const html5QrCode = scannerRef.current

    const startScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras()
        if (devices && devices.length) {
          await html5QrCode.start(
            devices[0].id,
            { fps: 10, qrbox: { width: 200, height: 200 } },
            (decodedText) => {
              if (html5QrCode.isScanning) {
                onScanSuccess(decodedText)
              }
            },
            (errorMessage) => {
              /* Ignore scanning errors */
            },
          )
          setError("")
          setIsInitializing(false)
        } else {
          setError("No camera devices found.")
          setIsInitializing(false)
        }
      } catch (err) {
        if (!html5QrCode.isScanning) {
          setError("Failed to access camera. Please check browser permissions.")
          setIsInitializing(false)
        }
      }
    }

    startScanner()

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch((err) => {
          console.error("Failed to stop scanner.", err)
        })
      }
    }
  }, [onScanSuccess])

  return (
    <>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 50;
          padding: 16px;
        }

        .modal-container {
          background-color: white;
          border: 1px solid #e5e5e5;
          width: 100%;
          max-width: 400px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #e5e5e5;
          flex-shrink: 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .header-content {
          flex: 1;
        }

        .header-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .header-label-text {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #737373;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .header-title {
          font-size: 18px;
          font-weight: 300;
          color: #171717;
          letter-spacing: -0.025em;
        }

        .close-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: transparent;
          border: none;
          color: #a3a3a3;
          cursor: pointer;
          transition: color 0.2s;
        }

        .close-button:hover {
          color: #171717;
        }

        .scanner-content {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }

        .scanner-area {
          position: relative;
          width: 100%;
          background-color: #fafafa;
          border: 1px solid #e5e5e5;
          overflow: hidden;
          height: 280px;
        }

        .scanner-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .loading-text {
          color: #737373;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 16px;
        }

        .scan-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #ef4444;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.7);
          animation: scan-line 2s linear infinite;
        }

        @keyframes scan-line {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }

        .scanner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .corner-bracket {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid white;
        }

        .corner-tl { top: 16px; left: 16px; border-right: none; border-bottom: none; }
        .corner-tr { top: 16px; right: 16px; border-left: none; border-bottom: none; }
        .corner-bl { bottom: 16px; left: 16px; border-right: none; border-top: none; }
        .corner-br { bottom: 16px; right: 16px; border-left: none; border-top: none; }

        .error-panel {
          margin-top: 24px;
          padding: 16px;
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .error-icon {
          color: #dc2626;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .error-title {
          font-size: 14px;
          font-weight: 500;
          color: #7f1d1d;
          margin-bottom: 4px;
        }

        .error-message {
          font-size: 14px;
          color: #991b1b;
        }

        .instructions-panel {
          margin-top: 24px;
          padding: 16px;
          background-color: #fafafa;
          border: 1px solid #e5e5e5;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .instructions-icon {
          color: #737373;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .instructions-title {
          font-size: 14px;
          font-weight: 500;
          color: #171717;
          margin-bottom: 4px;
        }

        .instructions-text {
          font-size: 14px;
          color: #525252;
        }

        .modal-actions {
          padding: 24px;
          border-top: 1px solid #e5e5e5;
          background-color: #fafafa;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 48px;
          padding: 0 24px;
          font-weight: 500;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          gap: 8px;
        }

        .button:disabled {
          pointer-events: none;
          opacity: 0.5;
        }

        .button-outline {
          border: 1px solid #e5e5e5;
          background-color: transparent;
          color: #171717;
        }

        .button-outline:hover {
          background-color: #f5f5f5;
        }

        .button-ghost {
          background-color: transparent;
          color: #525252;
        }

        .button-ghost:hover {
          background-color: #f5f5f5;
          color: #171717;
        }

        .button-text {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .hidden {
          display: none;
        }

        /* Mobile Responsive */
        @media (max-width: 640px) {
          .modal-overlay {
            padding: 8px;
          }

          .modal-container {
            max-height: 95vh;
          }

          .modal-header {
            padding: 16px;
          }

          .scanner-content {
            padding: 16px;
          }

          .scanner-area {
            height: 240px;
          }

          .corner-bracket {
            width: 16px;
            height: 16px;
          }

          .corner-tl, .corner-tr { top: 8px; }
          .corner-bl, .corner-br { bottom: 8px; }
          .corner-tl, .corner-bl { left: 8px; }
          .corner-tr, .corner-br { right: 8px; }

          .error-panel,
          .instructions-panel {
            margin-top: 16px;
            padding: 12px;
          }

          .modal-actions {
            padding: 16px;
          }

          .button {
            height: 40px;
          }

          .header-title {
            font-size: 16px;
          }

          .header-label-text {
            font-size: 11px;
          }

          .error-title,
          .error-message,
          .instructions-title,
          .instructions-text {
            font-size: 13px;
          }

          .loading-text {
            font-size: 11px;
          }
        }
      `}</style>

      <div className="modal-overlay">
        <div className="modal-container">
          {/* Header */}
          <div className="modal-header">
            <div className="header-content">
              <div className="header-label">
                <Scan size={16} color="#737373" />
                <span className="header-label-text">Barcode Scanner</span>
              </div>
              <h3 className="header-title">Scan Item Code</h3>
            </div>
            <button className="close-button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Scanner Area */}
          <div className="scanner-content">
            <div className="scanner-area">
              {isInitializing && (
                <div className="loading-overlay">
                  <Loader2 size={24} color="#a3a3a3" className="animate-spin" />
                  <p className="loading-text">Initializing Camera</p>
                </div>
              )}

              <div className="scanner-container">
                <div id="reader" style={{ width: "100%", height: "100%" }}></div>
              </div>

              {/* Scanning Line Animation */}
              {!isInitializing && !error && <div className="scan-line"></div>}

              {/* Scanner Overlay */}
              {!isInitializing && !error && (
                <div className="scanner-overlay">
                  <div className="corner-bracket corner-tl"></div>
                  <div className="corner-bracket corner-tr"></div>
                  <div className="corner-bracket corner-bl"></div>
                  <div className="corner-bracket corner-br"></div>
                </div>
              )}
            </div>

            {/* Error State */}
            {error && (
              <div className="error-panel">
                <AlertCircle size={20} className="error-icon" />
                <div>
                  <p className="error-title">Scanner Error</p>
                  <p className="error-message">{error}</p>
                </div>
              </div>
            )}

            {/* Instructions */}
            {!error && !isInitializing && (
              <div className="instructions-panel">
                <Camera size={20} className="instructions-icon" />
                <div>
                  <p className="instructions-title">Scanning Instructions</p>
                  <p className="instructions-text">
                    Position the barcode within the scanning area. The scanner will automatically detect and read the
                    code.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button className="button button-outline" onClick={() => fileInputRef.current?.click()}>
              <Upload size={16} />
              <span className="button-text">Scan from File</span>
            </button>

            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileScan} className="hidden" />

            <button className="button button-ghost" onClick={onClose}>
              <span className="button-text">Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default BarcodeScanner
