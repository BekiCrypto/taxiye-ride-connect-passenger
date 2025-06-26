
import React, { useState } from 'react';
import { Phone, Mail, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AuthPage = ({ onBack }: { onBack: () => void }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    name: '',
    otp: ''
  });
  const { toast } = useToast();

  const formatPhoneNumber = (phone: string) => {
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

  const handleAuthSubmit = async () => {
    setLoading(true);
    try {
      if (mode === 'signup') {
        // Format phone number before storing
        const formattedPhone = formatPhoneNumber(formData.phone);
        console.log('Formatted phone number:', formattedPhone);
        
        // Use Supabase's built-in signup with phone
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          phone: formattedPhone,
          options: {
            data: {
              name: formData.name,
              email: formData.email,
              phone: formattedPhone,
              user_type: 'passenger'
            }
          }
        });
        
        if (error) throw error;
        
        // Send OTP to both email and phone
        if (data.user && !data.user.email_confirmed_at) {
          // Send email OTP
          const { error: emailError } = await supabase.auth.signInWithOtp({
            email: formData.email,
            options: { shouldCreateUser: false }
          });
          
          if (emailError) console.warn('Email OTP error:', emailError);
          
          // Send SMS OTP
          const { error: smsError } = await supabase.auth.signInWithOtp({
            phone: formattedPhone,
            options: { shouldCreateUser: false }
          });
          
          if (smsError) console.warn('SMS OTP error:', smsError);
          
          toast({
            title: "Verification Required",
            description: "Please check your email and phone for the 6-digit verification code. You can use the code from either source.",
          });
          setStep('otp');
        } else {
          toast({
            title: "Account Created",
            description: "Your account has been created successfully!",
          });
          onBack();
        }
      } else {
        // Sign in flow
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
        onBack();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async () => {
    setLoading(true);
    try {
      // Try email verification first
      let verified = false;
      
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email: formData.email,
          token: formData.otp,
          type: 'email'
        });
        
        if (!error && data) {
          verified = true;
        }
      } catch (emailError) {
        console.log('Email verification failed, trying phone...');
      }
      
      // If email verification failed, try phone verification
      if (!verified) {
        const formattedPhone = formatPhoneNumber(formData.phone);
        const { data, error } = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: formData.otp,
          type: 'sms'
        });
        
        if (error) throw error;
        verified = true;
      }
      
      if (verified) {
        toast({
          title: "Account Verified Successfully!",
          description: "Welcome to Taxiye! You can now use all our services.",
        });
        onBack();
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid code. Please check the 6-digit code sent to your email or phone and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(formData.phone);
      
      // Resend email OTP
      const { error: emailError } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: { shouldCreateUser: false }
      });
      
      if (emailError) console.warn('Email resend error:', emailError);
      
      // Resend SMS OTP
      const { error: smsError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: { shouldCreateUser: false }
      });
      
      if (smsError) console.warn('SMS resend error:', smsError);
      
      toast({
        title: "Codes Resent",
        description: "New verification codes have been sent to your email and phone.",
      });
    } catch (error: any) {
      console.error('Resend error:', error);
      toast({
        title: "Resend Failed",
        description: error.message || "Failed to resend codes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
  };

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep('input')}
              className="absolute left-4 top-4 text-gray-400"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <CardTitle className="text-white">Enter Verification Code</CardTitle>
            <p className="text-gray-400 text-sm">
              We've sent a 6-digit code to both {formData.email} and {formData.phone}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={formData.otp}
                onChange={(value) => setFormData(prev => ({ ...prev, otp: value }))}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            <Button
              onClick={handleOTPVerify}
              disabled={formData.otp.length !== 6 || loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleResendCode}
              className="w-full text-yellow-500"
              disabled={loading}
            >
              Resend Codes
            </Button>
            
            <p className="text-xs text-gray-400 text-center">
              Didn't receive the codes? Check your spam folder or click resend. You can use the code from either your email or phone.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute left-4 top-4 text-gray-400"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <img 
              src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
              alt="Taxiye" 
              className="w-12 h-12"
            />
          </div>
          <CardTitle className="text-white">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <p className="text-gray-400 text-sm">
            {mode === 'signin' ? 'Sign in to continue' : 'Join Taxiye today'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Auth Mode Toggle */}
          <div className="flex bg-gray-700 rounded-lg p-1">
            <Button
              variant={mode === 'signin' ? 'default' : 'ghost'}
              onClick={() => setMode('signin')}
              className="flex-1 text-sm"
            >
              Sign In
            </Button>
            <Button
              variant={mode === 'signup' ? 'default' : 'ghost'}
              onClick={() => setMode('signup')}
              className="flex-1 text-sm"
            >
              Sign Up
            </Button>
          </div>

          <div className="space-y-4">
            {mode === 'signup' && (
              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            )}
            
            <Input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
            />

            {mode === 'signup' && (
              <Input
                type="tel"
                placeholder="Phone Number (e.g., +251912345678)"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            )}

            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <Button
            onClick={handleAuthSubmit}
            disabled={loading || !formData.email || !formData.password || 
              (mode === 'signup' && (!formData.name || !formData.phone))}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
          >
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </Button>
          
          {mode === 'signup' && (
            <p className="text-xs text-gray-400 text-center">
              After signing up, you'll receive 6-digit verification codes via both email and SMS to activate your account.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
