// Simple encoding/decoding for email addresses to prevent direct exposure in URLs
// Uses base64 encoding with a simple transformation for basic obfuscation

const SALT = 'tempmail2.0_secure_hash_2025';

/**
 * Encode email address to a hash for use in URLs
 */
export const encodeEmail = (email: string): string => {
  try {
    // Combine email with salt and encode
    const combined = `${email}:${SALT}`;
    const encoded = btoa(combined);
    // Reverse and add some obfuscation
    const reversed = encoded.split('').reverse().join('');
    return encodeURIComponent(reversed);
  } catch (error) {
    console.error('Failed to encode email:', error);
    return '';
  }
};

/**
 * Decode hash back to email address
 */
export const decodeEmail = (hash: string): string | null => {
  try {
    // Decode URI component
    const decoded = decodeURIComponent(hash);
    // Reverse the string
    const reversed = decoded.split('').reverse().join('');
    // Decode from base64
    const decodedBase64 = atob(reversed);
    // Extract email (remove salt)
    const parts = decodedBase64.split(':');
    if (parts.length === 2 && parts[1] === SALT) {
      return parts[0];
    }
    return null;
  } catch (error) {
    console.error('Failed to decode email hash:', error);
    return null;
  }
};

/**
 * Generate shareable link with hashed email
 */
export const generateShareableLink = (email: string): string => {
  if (typeof window === 'undefined') return '';
  const hash = encodeEmail(email);
  return `${window.location.origin}?hash=${hash}`;
};

