import { useState, useMemo } from 'react';
import { Mail, Trash2, Clock, Search } from 'lucide-react';
import { Message } from '../services/tempmail';

interface MessageListProps {
  messages: Message[];
  onSelectMessage: (message: Message) => void;
  onDeleteMessage: (messageId: string) => void;
  selectedMessageId?: string;
}

export const MessageList = ({
  messages,
  onSelectMessage,
  onDeleteMessage,
  selectedMessageId,
}: MessageListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) {
      return messages;
    }
    const query = searchQuery.toLowerCase();
    return messages.filter((message) =>
      (message.subject || '').toLowerCase().includes(query)
    );
  }, [messages, searchQuery]);

  if (messages.length === 0) {
    return (
      <div className="bg-black border-2 border-green-500 rounded-lg p-8 text-center shadow-2xl shadow-green-500/50">
        <Mail className="mx-auto mb-4 text-green-500/50" size={48} />
        <p className="text-green-400 font-mono">No messages yet</p>
        <p className="text-green-500/70 text-sm font-mono mt-2">
          Waiting for incoming emails...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black border-2 border-green-500 rounded-lg shadow-2xl shadow-green-500/50 overflow-hidden">
      <div className="bg-green-950/50 border-b border-green-500 p-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-green-400 font-mono text-lg flex items-center gap-2">
            <Mail size={20} />
            Inbox ({filteredMessages.length})
          </h2>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500/70" size={16} />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-green-950/50 border border-green-700 rounded px-10 py-2 text-green-300 font-mono text-sm placeholder-green-500/50 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <div className="divide-y divide-green-900/50 max-h-96 overflow-y-auto">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center">
            <Search className="mx-auto mb-4 text-green-500/50" size={32} />
            <p className="text-green-400 font-mono">No emails found</p>
            <p className="text-green-500/70 text-sm font-mono mt-2">
              Try a different search term
            </p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`p-4 cursor-pointer transition-all duration-300 relative group ${
                selectedMessageId === message.id
                  ? 'bg-green-900/30 border-l-4 border-green-400'
                  : 'hover:bg-green-950/30 border-l-4 border-transparent'
              }`}
              onClick={() => onSelectMessage(message)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400 font-mono text-sm font-semibold truncate">
                      {message.from}
                    </span>
                  </div>
                  <p className="text-green-300 font-mono text-base mb-2 truncate">
                    {message.subject || '(No Subject)'}
                  </p>
                  <div className="flex items-center gap-2 text-green-500/70 text-xs font-mono">
                    <Clock size={12} />
                    {formatDate(message.created_at)}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMessage(message.id);
                  }}
                  className="p-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500 rounded text-red-400 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:shadow-lg hover:shadow-red-500/50 flex-shrink-0"
                  title="Delete message"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
