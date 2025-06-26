/**
 * Security logging utilities for monitoring and audit trails
 */

import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  event_type: 'auth_attempt' | 'profile_update' | 'payment_attempt' | 'data_access' | 'security_violation';
  user_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

export const logSecurityEvent = async (event: Omit<SecurityEvent, 'timestamp' | 'ip_address' | 'user_agent'>) => {
  try {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      ip_address: 'client', // Would be filled by server in production
      user_agent: navigator.userAgent
    };
    
    // In a production environment, this would be sent to a secure logging service
    console.log('Security Event:', securityEvent);
    
    // Store critical events in local storage for debugging (remove in production)
    const existingLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    existingLogs.push(securityEvent);
    
    // Keep only last 100 events
    if (existingLogs.length > 100) {
      existingLogs.splice(0, existingLogs.length - 100);
    }
    
    localStorage.setItem('security_logs', JSON.stringify(existingLogs));
    
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

export const logAuthAttempt = (success: boolean, email: string, error?: string) => {
  logSecurityEvent({
    event_type: 'auth_attempt',
    details: {
      success,
      email: email.toLowerCase(),
      error: error || null
    }
  });
};

export const logProfileUpdate = (userId: string, updatedFields: string[]) => {
  logSecurityEvent({
    event_type: 'profile_update',
    user_id: userId,
    details: {
      updated_fields: updatedFields
    }
  });
};

export const logPaymentAttempt = (userId: string, amount: number, method: string, success: boolean) => {
  logSecurityEvent({
    event_type: 'payment_attempt',
    user_id: userId,
    details: {
      amount,
      payment_method: method,
      success
    }
  });
};

export const logDataAccess = (userId: string, resource: string, action: string) => {
  logSecurityEvent({
    event_type: 'data_access',
    user_id: userId,
    details: {
      resource,
      action
    }
  });
};

export const logSecurityViolation = (userId: string, violationType: string, details: any) => {
  logSecurityEvent({
    event_type: 'security_violation',
    user_id: userId,
    details: {
      violation_type: violationType,
      ...details
    }
  });
};
