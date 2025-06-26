
/**
 * Input component with built-in validation and sanitization
 */

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sanitizeTextInput, validateEmail, validatePhoneNumber, validateName } from '@/utils/inputValidation';

interface SecureInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'password';
  value: string;
  onChange: (value: string) => void;
  validation?: 'email' | 'phone' | 'name' | 'none';
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  validation = 'none',
  required = false,
  placeholder = '',
  className = ''
}) => {
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);

  const validateInput = (inputValue: string): string => {
    if (required && !inputValue.trim()) {
      return `${label} is required`;
    }

    switch (validation) {
      case 'email':
        return inputValue && !validateEmail(inputValue) ? 'Invalid email format' : '';
      case 'phone':
        return inputValue && !validatePhoneNumber(inputValue) ? 'Invalid phone number format' : '';
      case 'name':
        return inputValue && !validateName(inputValue) ? 'Invalid name format' : '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let sanitizedValue = e.target.value;
    
    // Sanitize text inputs (but not passwords)
    if (type !== 'password') {
      sanitizedValue = sanitizeTextInput(sanitizedValue);
    }
    
    onChange(sanitizedValue);
    
    if (touched) {
      setError(validateInput(sanitizedValue));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validateInput(value));
  };

  useEffect(() => {
    if (touched) {
      setError(validateInput(value));
    }
  }, [value, touched, validation, required, label]);

  return (
    <div className={className}>
      <Label htmlFor={name} className="text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`mt-1 ${error ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-white`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};
