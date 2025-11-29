import { Settings, X, Bell, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface SettingsPanelProps {
  refreshInterval: number;
  onRefreshIntervalChange: (interval: number) => void;
  notificationsEnabled: boolean;
  onNotificationsToggle: (enabled: boolean) => void;
  onClose: () => void;
}

export const SettingsPanel = ({
  refreshInterval,
  onRefreshIntervalChange,
  notificationsEnabled,
  onNotificationsToggle,
  onClose,
}: SettingsPanelProps) => {
  const [localInterval, setLocalInterval] = useState(refreshInterval);

  const intervalOptions = [
    { value: 5000, label: '5 seconds' },
    { value: 10000, label: '10 seconds' },
    { value: 30000, label: '30 seconds' },
    { value: 60000, label: '1 minute' },
    { value: 300000, label: '5 minutes' },
  ];

  const handleIntervalChange = (value: number) => {
    setLocalInterval(value);
    onRefreshIntervalChange(value);
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }

    // Check current permission status
    let permission = Notification.permission;

    // If permission is already granted, enable notifications
    if (permission === 'granted') {
      onNotificationsToggle(true);
      return;
    }

    // If permission was denied, inform user
    if (permission === 'denied') {
      alert('Permission was denied. Please enable it in your browser settings.');
      return;
    }

    // Request permission if it's default
    if (permission === 'default') {
      permission = await Notification.requestPermission();
      if (permission === 'granted') {
        onNotificationsToggle(true);
      } else if (permission === 'denied') {
        alert('Permission was denied. You can enable it later in your browser settings.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn">
      <div className="bg-black border-2 border-green-500 rounded-lg p-4 sm:p-6 shadow-2xl shadow-green-500/50 max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-green-400 font-mono text-base sm:text-lg flex items-center gap-2">
            <Settings size={18} className="sm:w-5 sm:h-5" />
            Settings
          </h3>
          <button
            onClick={onClose}
            className="p-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500 rounded text-red-400 transition-all duration-300"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="text-green-500 sm:w-[18px] sm:h-[18px]" size={16} />
              <label className="text-green-400 font-mono text-xs sm:text-sm">Auto-refresh Interval</label>
            </div>
            <div className="space-y-2">
              {intervalOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleIntervalChange(option.value)}
                  className={`w-full px-3 sm:px-4 py-2 border rounded font-mono text-xs sm:text-sm transition-all duration-300 ${
                    localInterval === option.value
                      ? 'bg-green-900/50 border-green-500 text-green-300'
                      : 'bg-green-950/30 border-green-700 text-green-500 hover:border-green-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="mt-3 bg-green-950/30 border border-green-700 rounded p-2 sm:p-3">
              <p className="text-green-500/70 text-xs font-mono">
                Current: {localInterval / 1000} seconds
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Bell className="text-green-500 sm:w-[18px] sm:h-[18px]" size={16} />
              <label className="text-green-400 font-mono text-xs sm:text-sm">Browser Notifications</label>
            </div>
            <div className="bg-green-950/30 border border-green-700 rounded p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <span className="text-green-300 font-mono text-xs sm:text-sm">
                  {notificationsEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <button
                  onClick={() => {
                    if (!notificationsEnabled) {
                      requestNotificationPermission();
                    } else {
                      onNotificationsToggle(false);
                    }
                  }}
                  className={`w-full sm:w-auto px-4 py-2 border rounded font-mono text-xs sm:text-sm transition-all duration-300 ${
                    notificationsEnabled
                      ? 'bg-red-900/30 border-red-500 text-red-400 hover:bg-red-900/50'
                      : 'bg-green-900/30 border-green-500 text-green-400 hover:bg-green-900/50'
                  }`}
                >
                  {notificationsEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
              {!notificationsEnabled && (
                <p className="text-green-500/70 text-xs font-mono">
                  Get notified when new emails arrive
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

