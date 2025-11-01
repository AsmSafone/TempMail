import { X, Clock, Trash2, RotateCcw } from 'lucide-react';
import { EmailHistoryItem, removeEmailFromHistory, clearEmailHistory } from '../services/emailHistory';

interface EmailHistoryProps {
  history: EmailHistoryItem[];
  currentEmail: string;
  onSelectEmail: (email: string) => void;
  onClose: () => void;
  onHistoryChange?: () => void;
}

export const EmailHistory = ({
  history,
  currentEmail,
  onSelectEmail,
  onClose,
  onHistoryChange,
}: EmailHistoryProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const handleRemoveEmail = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Remove ${email} from history?`)) {
      removeEmailFromHistory(email);
      onHistoryChange?.();
      // Close the history panel if no emails left
      if (history.length === 1) {
        onClose();
      }
    }
  };

  const handleClearAll = () => {
    if (confirm('Clear all email history? This cannot be undone.')) {
      clearEmailHistory();
      onHistoryChange?.();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border-2 border-green-500 rounded-lg shadow-2xl shadow-green-500/50 max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-green-950/50 border-b border-green-500 p-4 flex items-center justify-between">
          <h2 className="text-green-400 font-mono text-xl flex items-center gap-2">
            <Clock size={20} />
            Email History ({history.length})
          </h2>
          <div className="flex gap-2">
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 border border-red-500 rounded text-red-400 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50 text-sm font-mono"
                title="Clear all history"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 bg-green-900/30 hover:bg-green-900/50 border border-green-500 rounded text-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="mx-auto mb-4 text-green-500/50" size={48} />
              <p className="text-green-400 font-mono">No email history</p>
              <p className="text-green-500/70 text-sm font-mono mt-2">
                Previously used email addresses will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.email}
                  className={`p-4 border rounded-lg transition-all duration-300 cursor-pointer group ${
                    item.email === currentEmail
                      ? 'bg-green-900/30 border-green-500'
                      : 'bg-green-950/30 border-green-700 hover:bg-green-900/20 hover:border-green-500'
                  }`}
                  onClick={() => {
                    if (item.email !== currentEmail) {
                      onSelectEmail(item.email);
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-green-300 font-mono text-sm break-all">
                          {item.email}
                        </code>
                        {item.email === currentEmail && (
                          <span className="px-2 py-0.5 bg-green-500/20 border border-green-500 rounded text-green-400 text-xs font-mono flex-shrink-0">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-green-500/70 text-xs font-mono">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          Created: {formatDate(item.createdAt)}
                        </div>
                        {item.lastUsed && item.lastUsed !== item.createdAt && (
                          <div className="flex items-center gap-1">
                            <RotateCcw size={12} />
                            Used: {formatDate(item.lastUsed)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {item.email !== currentEmail && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEmail(item.email);
                          }}
                          className="px-3 py-1.5 bg-green-900/30 hover:bg-green-900/50 border border-green-500 rounded text-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 text-sm font-mono opacity-0 group-hover:opacity-100"
                          title="Restore this email"
                        >
                          Restore
                        </button>
                      )}
                      <button
                        onClick={(e) => handleRemoveEmail(item.email, e)}
                        className="p-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500 rounded text-red-400 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50 opacity-0 group-hover:opacity-100"
                        title="Remove from history"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-green-950/30 border-t border-green-500 p-3">
          <p className="text-green-500/70 text-xs font-mono text-center">
            Click on an email address to restore it. History is stored locally in your browser.
          </p>
        </div>
      </div>
    </div>
  );
};

