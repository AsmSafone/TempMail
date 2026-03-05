import { X, User, Calendar, FileText, Download } from 'lucide-react';
import { MessageDetail, downloadAttachment } from '../services/tempmail';
import { useState } from 'react';

interface MessageViewerProps {
  message: MessageDetail | null;
  email: string | null;
  onClose: () => void;
}

export const MessageViewer = ({ message, email, onClose }: MessageViewerProps) => {
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);

  if (!message) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  const handleDownload = async (link: string, filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!email) return;

    try {
      setDownloadingUrl(link);
      const blob = await downloadAttachment(link, email);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download attachment:', error);
      alert('Failed to download attachment. Please try again.');
    } finally {
      setDownloadingUrl(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn">
      <div className="bg-black border-2 border-green-500 rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl shadow-green-500/50 animate-slideUp">
        <div className="bg-green-950/50 border-b border-green-500 p-3 sm:p-4 flex items-center justify-between sticky top-0">
          <h2 className="text-green-400 font-mono text-base sm:text-lg flex items-center gap-2">
            <FileText size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Message Details</span>
            <span className="sm:hidden">Details</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500 rounded text-red-400 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-70px)] sm:max-h-[calc(90vh-80px)]">
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-green-950/30 border border-green-700 rounded">
              <User className="text-green-500 flex-shrink-0 mt-1 sm:w-[18px] sm:h-[18px]" size={16} />
              <div className="flex-1 min-w-0">
                <p className="text-green-500/70 text-xs font-mono mb-1">FROM</p>
                <p className="text-green-300 font-mono text-sm sm:text-base break-all">{message.from}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-green-950/30 border border-green-700 rounded">
              <Calendar className="text-green-500 flex-shrink-0 mt-1 sm:w-[18px] sm:h-[18px]" size={16} />
              <div className="flex-1 min-w-0">
                <p className="text-green-500/70 text-xs font-mono mb-1">DATE</p>
                <p className="text-green-300 font-mono text-sm sm:text-base">{formatDate(message.created_at)}</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 bg-green-950/30 border border-green-700 rounded">
              <p className="text-green-500/70 text-xs font-mono mb-2">SUBJECT</p>
              <p className="text-green-300 font-mono text-base sm:text-lg">
                {message.subject || '(No Subject)'}
              </p>
            </div>
          </div>

          <div className="bg-green-950/30 border border-green-700 rounded p-3 sm:p-4">
            <p className="text-green-500/70 text-xs font-mono mb-2 sm:mb-3">MESSAGE CONTENT</p>
            <div
              className="prose prose-invert prose-green max-w-none text-green-300 text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: message.body }}
            />
          </div>

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-950/30 border border-green-700 rounded">
              <p className="text-green-500/70 text-xs font-mono mb-2 sm:mb-3">
                ATTACHMENTS ({message.attachments.length})
              </p>
              <div className="space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2 bg-black/50 border border-green-800 rounded"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-green-300 font-mono text-xs sm:text-sm break-all">
                        {attachment.filename}
                      </span>
                      <span className="text-green-500/70 text-xs font-mono ml-2">
                        ({(attachment.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleDownload(attachment.link, attachment.filename, e)}
                      disabled={downloadingUrl === attachment.link || !email}
                      className="flex items-center justify-center gap-1.5 px-3 py-1 bg-green-900/30 hover:bg-green-900/50 border border-green-500 rounded text-green-400 text-xs font-mono transition-all duration-300 disabled:opacity-50"
                    >
                      {downloadingUrl === attachment.link ? (
                        <>
                          <div className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download size={14} />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
