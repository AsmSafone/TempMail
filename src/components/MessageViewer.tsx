import { X, User, Calendar, FileText } from 'lucide-react';
import { MessageDetail } from '../services/tempmail';

interface MessageViewerProps {
  message: MessageDetail | null;
  onClose: () => void;
}

export const MessageViewer = ({ message, onClose }: MessageViewerProps) => {
  if (!message) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-black border-2 border-green-500 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-green-500/50 animate-slideUp">
        <div className="bg-green-950/50 border-b border-green-500 p-4 flex items-center justify-between sticky top-0">
          <h2 className="text-green-400 font-mono text-lg flex items-center gap-2">
            <FileText size={20} />
            Message Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500 rounded text-red-400 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3 p-3 bg-green-950/30 border border-green-700 rounded">
              <User className="text-green-500 flex-shrink-0 mt-1" size={18} />
              <div className="flex-1 min-w-0">
                <p className="text-green-500/70 text-xs font-mono mb-1">FROM</p>
                <p className="text-green-300 font-mono break-all">{message.from}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-950/30 border border-green-700 rounded">
              <Calendar className="text-green-500 flex-shrink-0 mt-1" size={18} />
              <div className="flex-1 min-w-0">
                <p className="text-green-500/70 text-xs font-mono mb-1">DATE</p>
                <p className="text-green-300 font-mono">{formatDate(message.created_at)}</p>
              </div>
            </div>

            <div className="p-4 bg-green-950/30 border border-green-700 rounded">
              <p className="text-green-500/70 text-xs font-mono mb-2">SUBJECT</p>
              <p className="text-green-300 font-mono text-lg">
                {message.subject || '(No Subject)'}
              </p>
            </div>
          </div>

          <div className="bg-green-950/30 border border-green-700 rounded p-4">
            <p className="text-green-500/70 text-xs font-mono mb-3">MESSAGE CONTENT</p>
            <div
              className="prose prose-invert prose-green max-w-none text-green-300"
              dangerouslySetInnerHTML={{ __html: message.body }}
            />
          </div>

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-6 p-4 bg-green-950/30 border border-green-700 rounded">
              <p className="text-green-500/70 text-xs font-mono mb-3">
                ATTACHMENTS ({message.attachments.length})
              </p>
              <div className="space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-black/50 border border-green-800 rounded"
                  >
                    <div className="flex-1">
                      <span className="text-green-300 font-mono text-sm">
                        {attachment.filename}
                      </span>
                      <span className="text-green-500/70 text-xs font-mono ml-2">
                        ({(attachment.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                    <a
                      href={attachment.link}
                      download={attachment.filename}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-green-900/30 hover:bg-green-900/50 border border-green-500 rounded text-green-400 text-xs font-mono transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Download
                    </a>
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
