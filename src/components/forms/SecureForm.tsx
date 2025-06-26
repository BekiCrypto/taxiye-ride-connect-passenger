
/**
 * Secure form wrapper with validation and sanitization
 */

import React, { ReactNode } from 'react';
import { sanitizeTextInput } from '@/utils/inputValidation';

interface SecureFormProps {
  children: ReactNode;
  onSubmit: (data: any) => void;
  className?: string;
}

export const SecureForm: React.FC<SecureFormProps> = ({ children, onSubmit, className = '' }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data: any = {};
    
    // Sanitize all form inputs
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        data[key] = sanitizeTextInput(value);
      } else {
        data[key] = value;
      }
    }
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {children}
    </form>
  );
};
