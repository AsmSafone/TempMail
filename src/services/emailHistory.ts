export interface EmailHistoryItem {
  email: string;
  createdAt: string;
  lastUsed?: string;
}

const HISTORY_KEY = 'tempmail_history';
const MAX_HISTORY_ITEMS = 50;

/**
 * Get all email addresses from history
 */
export const getEmailHistory = (): EmailHistoryItem[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    if (!historyJson) return [];
    
    const history = JSON.parse(historyJson) as EmailHistoryItem[];
    return history.sort((a, b) => 
      new Date(b.lastUsed || b.createdAt).getTime() - 
      new Date(a.lastUsed || a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Failed to load email history:', error);
    return [];
  }
};

/**
 * Add an email address to history
 */
export const addEmailToHistory = (email: string): void => {
  try {
    const history = getEmailHistory();
    
    // Check if email already exists in history
    const existingIndex = history.findIndex(item => item.email === email);
    
    if (existingIndex >= 0) {
      // Update lastUsed timestamp
      history[existingIndex].lastUsed = new Date().toISOString();
    } else {
      // Add new email to history
      const newItem: EmailHistoryItem = {
        email,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
      };
      
      history.unshift(newItem);
      
      // Limit history size
      if (history.length > MAX_HISTORY_ITEMS) {
        history.splice(MAX_HISTORY_ITEMS);
      }
    }
    
    // Save back to localStorage
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save email to history:', error);
  }
};

/**
 * Remove an email from history
 */
export const removeEmailFromHistory = (email: string): void => {
  try {
    const history = getEmailHistory();
    const filtered = history.filter(item => item.email !== email);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove email from history:', error);
  }
};

/**
 * Clear all email history
 */
export const clearEmailHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear email history:', error);
  }
};

/**
 * Update last used timestamp for an email
 */
export const updateLastUsed = (email: string): void => {
  try {
    const history = getEmailHistory();
    const item = history.find(item => item.email === email);
    
    if (item) {
      item.lastUsed = new Date().toISOString();
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  } catch (error) {
    console.error('Failed to update last used timestamp:', error);
  }
};

