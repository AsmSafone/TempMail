import { Mail, Trash2, Clock } from 'lucide-react';
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
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

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
        <h2 className="text-green-400 font-mono text-lg flex items-center gap-2">
          <Mail size={20} />
          Inbox ({messages.length})
        </h2>
      </div>

      <div className="divide-y divide-green-900/50 max-h-96 overflow-y-auto">
        {messages.map((message) => (
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
        ))}
      </div>
    </div>
  );
};
