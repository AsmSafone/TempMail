import { Copy, Trash2, Clock, Share2, QrCode } from 'lucide-react';

interface EmailDisplayProps {
  email: string;
  onCopy: () => void;
  onDelete: () => void;
  onShowHistory: () => void;
  onShare: () => void;
  onShowQR: () => void;
}

export const EmailDisplay = ({ email, onCopy, onDelete, onShowHistory, onShare, onShowQR }: EmailDisplayProps) => {
  return (
    <div className="bg-black border-2 border-green-500 rounded-lg p-4 sm:p-6 shadow-2xl shadow-green-500/50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-0">
        <h2 className="text-green-400 font-mono text-base sm:text-lg">Your Temporary Email</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={onShare}
            className="p-2 bg-green-900/30 hover:bg-green-900/50 border border-green-500 rounded text-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 flex-1 sm:flex-initial"
            title="Share email address"
          >
            <Share2 size={18} />
          </button>
          <button
            onClick={onShowQR}
            className="p-2 bg-green-900/30 hover:bg-green-900/50 border border-green-500 rounded text-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 flex-1 sm:flex-initial"
            title="Generate QR Code (Q)"
          >
            <QrCode size={18} />
          </button>
          <button
            onClick={onShowHistory}
            className="p-2 bg-green-900/30 hover:bg-green-900/50 border border-green-500 rounded text-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 flex-1 sm:flex-initial"
            title="View email history"
          >
            <Clock size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500 rounded text-red-400 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50 flex-1 sm:flex-initial"
            title="Delete mailbox and generate new email"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-green-950/30 border border-green-700 rounded p-3 sm:p-4">
        <code className="flex-1 text-green-300 font-mono text-sm sm:text-base md:text-lg break-all">
          {email}
        </code>
        <button
          onClick={onCopy}
          className="p-2 bg-green-900/50 hover:bg-green-900/70 border border-green-500 rounded text-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 flex-shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-0"
          title="Copy to clipboard"
        >
          <Copy size={18} />
          <span className="sm:hidden text-sm font-mono">Copy</span>
        </button>
      </div>

      <div className="mt-4 text-green-500/70 text-xs sm:text-sm font-mono text-center animate-pulse">
        &gt; SECURE TEMPORARY MAILBOX ACTIVE &lt;
      </div>
    </div>
  );
};
