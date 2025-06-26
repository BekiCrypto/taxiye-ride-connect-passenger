
/**
 * Client-side input validation and sanitization utilities
 * These complement the server-side validation for better UX
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Ethiopian phone number validation
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it starts with 0 and has 10 digits total
  if (cleanPhone.startsWith('0') && cleanPhone.length === 10) {
    return /^0[79][0-9]{8}$/.test(cleanPhone);
  }
  
  // Check if it starts with 251 and has 12 digits total
  if (cleanPhone.startsWith('251') && cleanPhone.length === 12) {
    return /^251[79][0-9]{8}$/.test(cleanPhone);
  }
  
  // Check if it starts with +251
  if (phone.startsWith('+251')) {
    const withoutCountryCode = phone.substring(4);
    return /^[79][0-9]{8}$/.test(withoutCountryCode);
  }
  
  return false;
};

export const sanitizeTextInput = (input: string): string => {
  if (!input) return '';
  
  // Remove HTML tags and normalize whitespace
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

export const validateName = (name: string): boolean => {
  const sanitized = sanitizeTextInput(name);
  return sanitized.length >= 2 && sanitized.length <= 50 && /^[a-zA-Z\s]+$/.test(sanitized);
};

export const validateRideLocation = (location: string): boolean => {
  const sanitized = sanitizeTextInput(location);
  return sanitized.length >= 3 && sanitized.length <= 200;
};

export const validateAmount = (amount: number): boolean => {
  return amount >= 0 && amount <= 10000 && Number.isFinite(amount);
};

export const rateLimitStore = new Map<string, { count: number; lastReset: number }>();

export const checkRateLimit = (key: string, maxRequests: number = 5, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now - record.lastReset > windowMs) {
    rateLimitStore.set(key, { count: 1, lastReset: now });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
};
