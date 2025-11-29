import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsProps {
  onClose: () => void;
}

export const KeyboardShortcuts = ({ onClose }: KeyboardShortcutsProps) => {
  const shortcuts = [
    { key: 'N', description: 'Generate new email', action: 'New Email' },
    { key: 'R', description: 'Refresh messages', action: 'Refresh' },
    { key: 'S', description: 'Open settings', action: 'Settings' },
    { key: 'H', description: 'Show email history', action: 'History' },
    { key: 'Q', description: 'Show QR code', action: 'QR Code' },
    { key: '?', description: 'Show this help', action: 'Help' },
    { key: 'Esc', description: 'Close menus', action: 'Close' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn">
      <div className="bg-black border-2 border-green-500 rounded-lg p-4 sm:p-6 shadow-2xl shadow-green-500/50 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-green-400 font-mono text-base sm:text-lg flex items-center gap-2">
            <Keyboard size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Keyboard Shortcuts</span>
            <span className="sm:hidden">Shortcuts</span>
          </h3>
          <button
            onClick={onClose}
            className="p-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500 rounded text-red-400 transition-all duration-300"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-3 bg-green-950/30 border border-green-700 rounded"
            >
              <div className="flex-1">
                <p className="text-green-300 font-mono text-xs sm:text-sm">{shortcut.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-black border border-green-500 rounded text-green-400 font-mono text-xs">
                  {shortcut.key}
                </kbd>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 sm:mt-6 bg-green-950/30 border border-green-700 rounded p-2 sm:p-3">
          <p className="text-green-500/70 text-xs font-mono text-center px-2">
            Press any shortcut key to activate
          </p>
        </div>
      </div>
    </div>
  );
};

