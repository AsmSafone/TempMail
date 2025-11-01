import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { MatrixRain } from './components/MatrixRain';
import { EmailDisplay } from './components/EmailDisplay';
import { MessageList } from './components/MessageList';
import { MessageViewer } from './components/MessageViewer';
import { EmailHistory } from './components/EmailHistory';
import {
  createRandomMailbox,
  listMessages,
  getMessage,
  deleteMessage as deleteMessageAPI,
  deleteMailbox,
  Message,
  MessageDetail,
} from './services/tempmail';
import {
  addEmailToHistory,
  getEmailHistory,
  EmailHistoryItem,
} from './services/emailHistory';

function App() {
  const [email, setEmail] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [emailHistory, setEmailHistory] = useState<EmailHistoryItem[]>([]);

  const generateEmail = async () => {
    setLoading(true);
    try {
      const mailbox = await createRandomMailbox();
      setEmail(mailbox.email);
      setMessages([]);
      localStorage.setItem('tempmail_address', mailbox.email);
      addEmailToHistory(mailbox.email);
      setEmailHistory(getEmailHistory());
    } catch (error) {
      console.error('Failed to generate email:', error);
      alert('Failed to generate email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreEmail = async (restoredEmail: string) => {
    if (restoredEmail === email) {
      setShowHistory(false);
      return;
    }

    setLoading(true);
    try {
      setEmail(restoredEmail);
      setMessages([]);
      localStorage.setItem('tempmail_address', restoredEmail);
      addEmailToHistory(restoredEmail);
      setEmailHistory(getEmailHistory());
      setShowHistory(false);
    } catch (error) {
      console.error('Failed to restore email:', error);
      alert('Failed to restore email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshMessages = async () => {
    if (!email) return;

    setRefreshing(true);
    try {
      const msgs = await listMessages(email);
      setMessages(msgs);
    } catch (error) {
      console.error('Failed to refresh messages:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSelectMessage = async (message: Message) => {
    try {
      const fullMessage = await getMessage(message.hash_id);
      setSelectedMessage(fullMessage);
    } catch (error) {
      console.error('Failed to load message:', error);
      alert('Failed to load message. Please try again.');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessageAPI(messageId);
      setMessages(messages.filter((m) => m.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message. Please try again.');
    }
  };

  const handleDeleteMailbox = async () => {
    if (!email) return;

    if (!confirm('Are you sure you want to delete this mailbox?')) return;

    const emailToDelete = email;
    
    // Clear local state first
    setMessages([]);
    setSelectedMessage(null);
    localStorage.removeItem('tempmail_address');
    setEmailHistory(getEmailHistory());
    
    // Try to delete from API, but don't block if it fails
    try {
      await deleteMailbox(emailToDelete);
    } catch (error) {
      console.warn('Failed to delete mailbox from API (continuing anyway):', error);
      // Continue anyway - the mailbox will expire on its own
    }
    
    // Automatically generate a new email after deletion attempt
    await generateEmail();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('tempmail_address');
    if (savedEmail) {
      setEmail(savedEmail);
      // Add to history if not already there, or update lastUsed if it exists
      addEmailToHistory(savedEmail);
    } else {
      generateEmail();
    }
    setEmailHistory(getEmailHistory());
  }, []);

  useEffect(() => {
    if (email) {
      refreshMessages();
      const interval = setInterval(refreshMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [email]);

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      <MatrixRain />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold font-mono mb-4 animate-pulse text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
            TEMPMAIL 2.0
          </h1>
          <p className="text-green-500 font-mono text-lg">
            &gt; Secure Temporary Email System v2.0 &lt;
          </p>
          <div className="mt-4 text-green-600 text-sm font-mono">
            [ ENCRYPTED ] [ ANONYMOUS ] [ DISPOSABLE ]
          </div>
        </header>

        {copiedFeedback && (
          <div className="fixed top-4 right-4 bg-green-900 border border-green-500 text-green-300 px-6 py-3 rounded-lg shadow-xl shadow-green-500/50 font-mono animate-slideIn z-50">
            ✓ Email copied to clipboard
          </div>
        )}

        <div className="max-w-6xl mx-auto space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin text-green-500 mb-4">
                <RefreshCw size={48} />
              </div>
              <p className="text-green-400 font-mono">Initializing secure mailbox...</p>
            </div>
          ) : email ? (
            <>
              <EmailDisplay
                email={email}
                onCopy={copyToClipboard}
                onDelete={handleDeleteMailbox}
                onShowHistory={() => {
                  setEmailHistory(getEmailHistory());
                  setShowHistory(true);
                }}
              />

              <div className="flex items-center justify-between mb-4">
                <div className="text-green-500 font-mono text-sm">
                  Auto-refresh: Every 10 seconds
                </div>
                <button
                  onClick={refreshMessages}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-green-900/30 hover:bg-green-900/50 border border-green-500 rounded text-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 disabled:opacity-50 font-mono"
                >
                  <RefreshCw
                    size={16}
                    className={refreshing ? 'animate-spin' : ''}
                  />
                  {refreshing ? 'Refreshing...' : 'Refresh Now'}
                </button>
              </div>

              <MessageList
                messages={messages}
                onSelectMessage={handleSelectMessage}
                onDeleteMessage={handleDeleteMessage}
                selectedMessageId={selectedMessage?.id}
              />
            </>
          ) : null}
        </div>

        <footer className="text-center mt-16 text-green-600 font-mono text-sm">
          <div className="mb-2">
            &gt; Powered by Safone | All emails are automatically deleted
            after 24 hours &lt;
          </div>
          <div className="text-xs">
            [ DO NOT USE FOR SENSITIVE INFORMATION ]
          </div>
        </footer>
      </div>

      <MessageViewer
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />

      {showHistory && (
        <EmailHistory
          history={emailHistory}
          currentEmail={email}
          onSelectEmail={handleRestoreEmail}
          onClose={() => setShowHistory(false)}
          onHistoryChange={() => setEmailHistory(getEmailHistory())}
        />
      )}
    </div>
  );
}

export default App;
