
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
  const [authType, setAuthType] = useState<'email' | 'phone'>('email');
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

  const handleAuthSubmit = async () => {
    setLoading(true);
    try {
      if (authType === 'email') {
        if (mode === 'signup') {
          const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                name: formData.name
              }
            }
          });
          
          if (error) throw error;
          
          toast({
            title: "Check your email",
            description: "We've sent you a verification link. Please check your email to continue.",
          });
          setStep('otp');
        } else {
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
      } else {
        // Phone authentication
        const { error } = await supabase.auth.signInWithOtp({
          phone: formData.phone,
          options: {
            data: mode === 'signup' ? { name: formData.name } : undefined
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "OTP Sent",
          description: "Please enter the verification code sent to your phone.",
        });
        setStep('otp');
      }
    } catch (error: any) {
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
      if (authType === 'phone') {
        const { error } = await supabase.auth.verifyOtp({
          phone: formData.phone,
          token: formData.otp,
          type: 'sms'
        });
        
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.verifyOtp({
          email: formData.email,
          token: formData.otp,
          type: 'email'
        });
        
        if (error) throw error;
      }
      
      toast({
        title: "Verification Successful",
        description: "Welcome to Taxiye!",
      });
      onBack();
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
              We've sent a code to {authType === 'email' ? formData.email : formData.phone}
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
              onClick={handleAuthSubmit}
              className="w-full text-yellow-500"
              disabled={loading}
            >
              Resend Code
            </Button>
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

          {/* Auth Type Toggle */}
          <div className="flex bg-gray-700 rounded-lg p-1">
            <Button
              variant={authType === 'email' ? 'secondary' : 'ghost'}
              onClick={() => setAuthType('email')}
              className="flex-1 text-sm"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button
              variant={authType === 'phone' ? 'secondary' : 'ghost'}
              onClick={() => setAuthType('phone')}
              className="flex-1 text-sm"
            >
              <Phone className="w-4 h-4 mr-2" />
              Phone
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
            
            {authType === 'email' ? (
              <>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </>
            ) : (
              <Input
                type="tel"
                placeholder="Phone Number (+251...)"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            )}
          </div>

          <Button
            onClick={handleAuthSubmit}
            disabled={loading || (authType === 'email' ? !formData.email || !formData.password : !formData.phone) || (mode === 'signup' && !formData.name)}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
          >
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </Button>
          
          {authType === 'phone' && (
            <p className="text-xs text-gray-400 text-center">
              By continuing, you'll receive an SMS verification code. Message and data rates may apply.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
