
/**
 * Enhanced authentication hook with security monitoring
 */

import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logAuthAttempt, logSecurityViolation } from '@/utils/securityLogger';
import { validateEmail, checkRateLimit } from '@/utils/inputValidation';

export const useSecureAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Monitor for suspicious auth events
        if (event === 'SIGNED_OUT' && session) {
          logSecurityViolation(session.user.id, 'unexpected_signout', {
            event_type: event
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const secureSignIn = async (email: string, password: string) => {
    try {
      // Validate input
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Rate limiting
      const rateLimitKey = `signin_${email}`;
      if (!checkRateLimit(rateLimitKey, 5, 300000)) { // 5 attempts per 5 minutes
        logSecurityViolation('', 'rate_limit_exceeded', { email, action: 'signin' });
        throw new Error('Too many login attempts. Please try again later.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) {
        logAuthAttempt(false, email, error.message);
        throw error;
      }

      logAuthAttempt(true, email);
      return { data, error: null };

    } catch (error: any) {
      logAuthAttempt(false, email, error.message);
      return { data: null, error };
    }
  };

  const secureSignUp = async (email: string, password: string, userData: any) => {
    try {
      // Validate input
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      // Rate limiting
      const rateLimitKey = `signup_${email}`;
      if (!checkRateLimit(rateLimitKey, 3, 600000)) { // 3 attempts per 10 minutes
        logSecurityViolation('', 'rate_limit_exceeded', { email, action: 'signup' });
        throw new Error('Too many signup attempts. Please try again later.');
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: userData.name?.trim(),
            phone: userData.phone?.trim(),
            user_type: 'passenger'
          }
        }
      });

      if (error) {
        logAuthAttempt(false, email, error.message);
        throw error;
      }

      logAuthAttempt(true, email);
      return { data, error: null };

    } catch (error: any) {
      logAuthAttempt(false, email, error.message);
      return { data: null, error };
    }
  };

  const secureSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any sensitive data from localStorage
      localStorage.removeItem('ride_data');
      localStorage.removeItem('payment_data');
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return {
    user,
    session,
    loading,
    signIn: secureSignIn,
    signUp: secureSignUp,
    signOut: secureSignOut
  };
};
