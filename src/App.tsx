import { useState, useEffect, useRef } from 'react';
import { RefreshCw, Settings, Keyboard as KeyboardIcon } from 'lucide-react';
import { MatrixRain } from './components/MatrixRain';
import { EmailDisplay } from './components/EmailDisplay';
import { MessageList } from './components/MessageList';
import { MessageViewer } from './components/MessageViewer';
import { EmailHistory } from './components/EmailHistory';
import { QRCodeGenerator } from './components/QRCodeGenerator';
import { SettingsPanel } from './components/SettingsPanel';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { SharePanel } from './components/SharePanel';
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
import { decodeEmail } from './utils/emailHash';

function App() {
  const [email, setEmail] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [emailHistory, setEmailHistory] = useState<EmailHistoryItem[]>([]);
  const [refreshInterval, setRefreshInterval] = useState(10000);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const previousMessageCount = useRef(0);

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
      const previousCount = previousMessageCount.current;
      setMessages(msgs);
      previousMessageCount.current = msgs.length;
      
      // Show notification if new emails arrived
      if (notificationsEnabled && msgs.length > previousCount && 'Notification' in window) {
        const newEmails = msgs.length - previousCount;
        if (Notification.permission === 'granted') {
          new Notification(`New Email${newEmails > 1 ? 's' : ''} Received`, {
            body: `You have ${newEmails} new email${newEmails > 1 ? 's' : ''} in ${email}`,
            icon: 'https://cdn-icons-png.freepik.com/256/10505/10505826.png',
          });
        }
      }
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
    // Check for hashed email in URL parameters (from shareable link)
    const urlParams = new URLSearchParams(window.location.search);
    const emailHash = urlParams.get('hash');
    
    if (emailHash) {
      // Decode the hashed email
      const decodedEmail = decodeEmail(emailHash);
      if (decodedEmail) {
        // Load shared email
        setEmail(decodedEmail);
        localStorage.setItem('tempmail_address', decodedEmail);
        addEmailToHistory(decodedEmail);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        // Invalid hash, generate new email
        console.warn('Invalid email hash in URL');
        generateEmail();
      }
    } else {
      const savedEmail = localStorage.getItem('tempmail_address');
      if (savedEmail) {
        setEmail(savedEmail);
        // Add to history if not already there, or update lastUsed if it exists
        addEmailToHistory(savedEmail);
      } else {
        generateEmail();
      }
    }
    setEmailHistory(getEmailHistory());
  }, []);

  useEffect(() => {
    if (email) {
      previousMessageCount.current = 0;
      refreshMessages();
      const interval = setInterval(refreshMessages, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [email, refreshInterval]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        (e.target as HTMLElement).tagName === 'INPUT' ||
        (e.target as HTMLElement).tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        generateEmail();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        refreshMessages();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setShowSettings(true);
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setShowHistory(true);
      } else if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        setShowQR(true);
      } else if (e.key === '?' && !showShortcuts) {
        e.preventDefault();
        setShowShortcuts(true);
      } else if (e.key === 'Escape') {
        setShowHistory(false);
        setShowQR(false);
        setShowSettings(false);
        setShowShortcuts(false);
        setShowShare(false);
        setSelectedMessage(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showShortcuts]);

  // Request notification permission on mount if enabled
  useEffect(() => {
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [notificationsEnabled]);

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
                onShare={() => setShowShare(true)}
                onShowQR={() => setShowQR(true)}
              />

              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <div className="text-green-500 font-mono text-sm">
                  Auto-refresh: Every {refreshInterval / 1000} seconds
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 bg-green-900/30 hover:bg-green-900/50 border border-green-500 rounded text-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50"
                    title="Settings (S)"
                  >
                    <Settings size={18} />
                  </button>
                  <button
                    onClick={() => setShowShortcuts(true)}
                    className="p-2 bg-green-900/30 hover:bg-green-900/50 border border-green-500 rounded text-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50"
                    title="Keyboard Shortcuts (?)"
                  >
                    <KeyboardIcon size={18} />
                  </button>
                  <button
                    onClick={refreshMessages}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-green-900/30 hover:bg-green-900/50 border border-green-500 rounded text-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 disabled:opacity-50 font-mono"
                    title="Refresh (R)"
                  >
                    <RefreshCw
                      size={16}
                      className={refreshing ? 'animate-spin' : ''}
                    />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
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
            &gt; Copyright © {new Date().getFullYear()} Safone &lt;
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

      {showQR && email && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <QRCodeGenerator email={email} onClose={() => setShowQR(false)} />
        </div>
      )}

      {showSettings && (
        <SettingsPanel
          refreshInterval={refreshInterval}
          onRefreshIntervalChange={setRefreshInterval}
          notificationsEnabled={notificationsEnabled}
          onNotificationsToggle={setNotificationsEnabled}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showShortcuts && (
        <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />
      )}

      {showShare && email && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <SharePanel email={email} onClose={() => setShowShare(false)} />
        </div>
      )}
    </div>
  );
}

export default App;
