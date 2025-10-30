const BASE_URL = 'https://tempmailapi.com/api';
const API_KEY = import.meta.env.VITE_TEMPMAIL_API_KEY || 'CZXXyF8jg5JRH7UbQWVYiKMQjQznCB6';

export interface TempEmail {
  id: number;
  email: string;
  domain: string;
  ip: string;
  fingerprint: string;
  expire_at: string;
  created_at: string;
  email_token?: string;
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

interface APIResponse<T> {
  status: boolean;
  data?: T;
  message?: string;
}

export const createRandomMailbox = async (): Promise<TempEmail> => {
  const response = await fetch(`${BASE_URL}/emails/${API_KEY}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to create mailbox');
  }

  const result: APIResponse<TempEmail> = await response.json();

  if (!result.status || !result.data) {
    throw new Error(result.message || 'Failed to create mailbox');
  }

  return result.data;
};

export const listMessages = async (email: string, sinceDays?: number): Promise<Message[]> => {
  const encodedEmail = encodeURIComponent(email);
  const url = new URL(`${BASE_URL}/messages/${API_KEY}/${encodedEmail}`);
  if (sinceDays) {
    url.searchParams.append('since_days', sinceDays.toString());
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }

  const result: APIResponse<{ messages: Message[] }> = await response.json();

  if (!result.status || !result.data) {
    throw new Error(result.message || 'Failed to fetch messages');
  }

  return result.data.messages || [];
};

export const getMessage = async (messageId: string): Promise<MessageDetail> => {
  const response = await fetch(`${BASE_URL}/messages/${API_KEY}/message/${messageId}`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch message');
  }

  const result: APIResponse<{ message: MessageDetail }> = await response.json();

  if (!result.status || !result.data) {
    throw new Error(result.message || 'Failed to fetch message');
  }

  return result.data.message;
};

export const deleteMessage = async (messageId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/messages/${API_KEY}/message/${messageId}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete message');
  }

  const result: APIResponse<unknown> = await response.json();

  if (!result.status) {
    throw new Error(result.message || 'Failed to delete message');
  }
};

export const deleteMailbox = async (email: string): Promise<void> => {
  const encodedEmail = encodeURIComponent(email);
  const response = await fetch(`${BASE_URL}/emails/${API_KEY}/${encodedEmail}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete mailbox');
  }

  const result: APIResponse<unknown> = await response.json();

  if (!result.status) {
    throw new Error(result.message || 'Failed to delete mailbox');
  }
};
