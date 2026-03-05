import { getEmailHistory } from './emailHistory';

const BASE_URL = 'https://api.mail.gw';

export interface TempEmail {
  id: string;
  email: string;
  domain?: string;
  ip?: string;
  fingerprint?: string;
  expire_at?: string;
  created_at: string;
  token?: string;
}

export interface Message {
  id: string;
  from: string;
  subject: string;
  created_at: string;
  hash_id: string;
  has_attachments: boolean;
}

export interface MessageDetail {
  id: string;
  from: string;
  subject: string;
  created_at: string;
  body: string;
  hash_id: string;
  attachments: Array<{
    filename: string;
    size: number;
    link: string;
  }>;
}

const getTokenForEmail = (email: string): string => {
  const history = getEmailHistory();
  const item = history.find(h => h.email === email);
  if (!item || !item.token) {
    throw new Error('Authentication token not found for this email');
  }
  return item.token;
};

const getAuthHeaders = (email: string) => {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getTokenForEmail(email)}`
  };
};

export const createRandomMailbox = async (): Promise<TempEmail> => {
  // 1. Get domains
  const domainsRes = await fetch(`${BASE_URL}/domains`, {
    headers: { 'Accept': 'application/json' }
  });
  if (!domainsRes.ok) throw new Error('Failed to fetch domains');
  const domainsData = await domainsRes.json();
  const domains = domainsData || [];
  if (domains.length === 0) throw new Error('No domains available');

  const domain = domains[Math.floor(Math.random() * domains.length)].domain;

  // Generate random credentials
  const username = Math.random().toString(36).substring(2, 10) + new Date().getTime().toString(36);
  const address = `${username}@${domain}`;
  const password = Math.random().toString(36).slice(-8) + 'A1!'; // Requirements vary, but usually this works

  // 2. Create account
  const accountRes = await fetch(`${BASE_URL}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ address, password })
  });
  if (!accountRes.ok) throw new Error('Failed to create account');
  const accountData = await accountRes.json();

  // 3. Get token
  const tokenRes = await fetch(`${BASE_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ address, password })
  });
  if (!tokenRes.ok) throw new Error('Failed to get token');
  const tokenData = await tokenRes.json();

  return {
    id: accountData.id,
    email: accountData.address,
    created_at: accountData.createdAt,
    token: tokenData.token
  };
};

export const listMessages = async (email: string, _sinceDays?: number): Promise<Message[]> => {
  const response = await fetch(`${BASE_URL}/messages`, {
    headers: getAuthHeaders(email)
  });

  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }

  const result = await response.json();
  const rawMessages = result['hydra:member'] || [];

  return rawMessages.map((msg: any) => ({
    id: msg.id,
    from: msg.from?.address || msg.from?.name || 'Unknown',
    subject: msg.subject,
    created_at: msg.createdAt,
    hash_id: msg.id, // Map for UI compatibility
    has_attachments: msg.hasAttachments
  }));
};

export const getMessage = async (messageId: string, email: string): Promise<MessageDetail> => {
  const response = await fetch(`${BASE_URL}/messages/${messageId}`, {
    headers: getAuthHeaders(email)
  });

  if (!response.ok) {
    throw new Error('Failed to fetch message');
  }

  const msg = await response.json();

  // Try to use HTML body, fallback to text
  let bodyContent = '';
  if (msg.html && msg.html.length > 0) {
    bodyContent = msg.html[0];
  } else if (msg.text) {
    // Basic text to HTML conversion
    bodyContent = msg.text.replace(/\n/g, '<br />');
  }

  return {
    id: msg.id,
    from: msg.from?.address || msg.from?.name || 'Unknown',
    subject: msg.subject,
    created_at: msg.createdAt,
    body: bodyContent,
    hash_id: msg.id,
    attachments: (msg.attachments || []).map((att: any) => ({
      filename: att.name || 'attachment',
      size: att.size || 0,
      link: att.downloadUrl
    }))
  };
};

export const deleteMessage = async (messageId: string, email: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/messages/${messageId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(email)
  });

  if (!response.ok) {
    throw new Error('Failed to delete message');
  }
};

export const deleteMailbox = async (email: string): Promise<void> => {
  const history = getEmailHistory();
  const item = history.find(h => h.email === email);
  if (!item || !item.id || !item.token) {
    return;
  }

  const response = await fetch(`${BASE_URL}/accounts/${item.id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(email)
  });

  if (!response.ok) {
    // If it's already deleted (404), it's fine.
    if (response.status !== 404) {
      throw new Error('Failed to delete mailbox');
    }
  }
};

export const downloadAttachment = async (downloadUrl: string, email: string): Promise<Blob> => {
  const url = downloadUrl.startsWith('http') ? downloadUrl : `${BASE_URL}${downloadUrl}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${getTokenForEmail(email)}`
    }
  });

  if (!response.ok) throw new Error('Failed to download attachment');
  return response.blob();
};
