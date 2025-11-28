import { QrCode, Download, X } from 'lucide-react';
import { useState } from 'react';
import { generateShareableLink } from '../utils/emailHash';

interface QRCodeGeneratorProps {
  email: string;
  onClose: () => void;
}

export const QRCodeGenerator = ({ email, onClose }: QRCodeGeneratorProps) => {
  const [qrSize, setQrSize] = useState(200);
  const [qrType, setQrType] = useState<'mailto' | 'link'>('mailto');
  const [downloading, setDownloading] = useState(false);

  // Generate QR code data based on type
  const getQRData = () => {
    if (qrType === 'mailto') {
      // mailto: link that opens email client
      return `mailto:${email}`;
    } else {
      // Shareable link with hashed email that loads the email in the app
      return generateShareableLink(email);
    }
  };

  const generateQRCode = () => {
    // Using a free QR code API
    const data = getQRData();
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(data)}`;
    return qrUrl;
  };

  const downloadQR = async () => {
    setDownloading(true);
    try {
      const qrUrl = generateQRCode();
      
      // Fetch the QR code image
      const response = await fetch(qrUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch QR code image');
      }
      
      // Convert to blob
      const blob = await response.blob();
      
      // Create object URL from blob
      const blobUrl = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `tempmail-qr-${email.split('@')[0]}-${qrType}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download QR code:', error);
      alert('Failed to download QR code. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-black border-2 border-green-500 rounded-lg p-6 shadow-2xl shadow-green-500/50 max-w-md w-full animate-slideUp">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-green-400 font-mono text-lg flex items-center gap-2">
          <QrCode size={20} />
          QR Code
        </h3>
        <button
          onClick={onClose}
          className="p-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500 rounded text-red-400 transition-all duration-300"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="bg-white p-4 rounded">
          <img
            key={`${qrType}-${qrSize}`}
            src={generateQRCode()}
            alt="QR Code"
            className="w-full h-auto"
          />
        </div>

        <div className="w-full space-y-3">
          <div className="bg-green-950/30 border border-green-700 rounded p-3">
            <p className="text-green-500/70 text-xs font-mono mb-2">QR Code Type:</p>
            <div className="flex gap-2">
              <button
                onClick={() => setQrType('mailto')}
                className={`flex-1 px-3 py-2 border rounded font-mono text-sm transition-all duration-300 ${
                  qrType === 'mailto'
                    ? 'bg-green-900/50 border-green-500 text-green-300'
                    : 'bg-green-950/30 border-green-700 text-green-500 hover:border-green-500'
                }`}
              >
                Mailto Link
              </button>
              <button
                onClick={() => setQrType('link')}
                className={`flex-1 px-3 py-2 border rounded font-mono text-sm transition-all duration-300 ${
                  qrType === 'link'
                    ? 'bg-green-900/50 border-green-500 text-green-300'
                    : 'bg-green-950/30 border-green-700 text-green-500 hover:border-green-500'
                }`}
              >
                Inbox Access Link
              </button>
            </div>
            <p className="text-green-500/50 text-xs font-mono mt-2">
              {qrType === 'mailto' 
                ? 'Opens email client with this address'
                : 'Opens inbox access for this email'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-green-500/70 text-sm font-mono">Size:</label>
            <input
              type="range"
              min="150"
              max="400"
              value={qrSize}
              onChange={(e) => setQrSize(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-green-300 font-mono text-sm w-16">{qrSize}px</span>
          </div>

          <div className="bg-green-950/30 border border-green-700 rounded p-3">
            <p className="text-green-500/70 text-xs font-mono mb-1">Email:</p>
            <p className="text-green-300 font-mono text-sm break-all">{email}</p>
            {qrType === 'link' && (
              <p className="text-green-500/50 text-xs font-mono mt-2 break-all">
                Access Link: {generateShareableLink(email)}
              </p>
            )}
          </div>

          <button
            onClick={downloadQR}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-900/30 hover:bg-green-900/50 border border-green-500 rounded text-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} className={downloading ? 'animate-pulse' : ''} />
            {downloading ? 'Downloading...' : 'Download QR Code'}
          </button>
        </div>
      </div>
    </div>
  );
};

