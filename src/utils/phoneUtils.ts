/**
 * Centralized phone number utility for consistent formatting and validation
 */

export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // If it starts with 0, replace with +251
  if (cleanPhone.startsWith('0')) {
    return '+251' + cleanPhone.substring(1);
  }
  
  // If it starts with 251, add +
  if (cleanPhone.startsWith('251')) {
    return '+' + cleanPhone;
  }
  
  // If it starts with +251, return as is
  if (phone.startsWith('+251')) {
    return phone;
  }
  
  // If it's a 9-digit number (Ethiopian mobile), add +251
  if (cleanPhone.length === 9) {
    return '+251' + cleanPhone;
  }
  
  // Otherwise, assume it needs +251 prefix
  return '+251' + cleanPhone;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const formatted = formatPhoneNumber(phone);
  // Ethiopian phone numbers should be +251 followed by 9 digits
  const phoneRegex = /^\+251\d{9}$/;
  return phoneRegex.test(formatted);
};

export const displayPhoneNumber = (phone: string): string => {
  const formatted = formatPhoneNumber(phone);
  if (formatted.startsWith('+251')) {
    const number = formatted.substring(4);
    return `+251 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`;
  }
  return formatted;
};
