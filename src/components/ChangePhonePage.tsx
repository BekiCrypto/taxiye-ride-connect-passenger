
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatPhoneNumber, validatePhoneNumber } from '@/utils/phoneUtils';

const ChangePhonePage = ({ onBack }: { onBack: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [currentPhone, setCurrentPhone] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadCurrentPhone = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Try to get phone from passenger profile
        const { data: passengerData } = await supabase
          .from('passengers')
          .select('phone')
          .eq('user_id', user.id)
          .maybeSingle();

        if (passengerData?.phone) {
          setCurrentPhone(passengerData.phone);
        } else if (user.phone) {
          setCurrentPhone(user.phone);
        }
      }
    };
    loadCurrentPhone();
  }, []);

  const handleSendOtp = async () => {
    if (!newPhone.trim()) {
      toast({
        title: "Phone Required",
        description: "Please enter a new phone number.",
        variant: "destructive",
      });
      return;
    }

    if (!validatePhoneNumber(newPhone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Ethiopian phone number.",
        variant: "destructive",
      });
      return;
    }

    if (newPhone === currentPhone) {
      toast({
        title: "Same Phone Number",
        description: "Please enter a different phone number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(newPhone);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Send email OTP
      const { error: emailError } = await supabase.auth.signInWithOtp({
        email: user.email!,
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
        title: "Verification Codes Sent",
        description: "We've sent 6-digit codes to both your email and the new phone number for verification.",
      });
      
      setShowOtpVerification(true);
    } catch (error: any) {
      console.error('Phone change error:', error);
      toast({
        title: "Failed to Send Verification",
        description: error.message || "Could not send verification codes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Try email verification first
      let verified = false;
      
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email: user.email!,
          token: otpCode,
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
        const formattedPhone = formatPhoneNumber(newPhone);
        const { data, error } = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: otpCode,
          type: 'sms'
        });
        
        if (error) throw error;
        verified = true;
      }

      if (verified) {
        const formattedPhone = formatPhoneNumber(newPhone);

        // Update user auth data
        const { error: authError } = await supabase.auth.updateUser({
          phone: formattedPhone
        });

        if (authError) throw authError;

        // Update passenger profile if exists
        const { data: passengerData } = await supabase
          .from('passengers')
          .select('phone')
          .eq('user_id', user.id)
          .maybeSingle();

        if (passengerData) {
          const { error: passengerError } = await supabase
            .from('passengers')
            .update({ phone: formattedPhone })
            .eq('user_id', user.id);

          if (passengerError) throw passengerError;
        }

        toast({
          title: "Phone Number Updated",
          description: "Your phone number has been successfully changed.",
        });
        
        setShowOtpVerification(false);
        setOtpCode('');
        setNewPhone('');
        setCurrentPhone(formattedPhone);
        onBack();
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showOtpVerification) {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOtpVerification(false)}
              className="text-gray-400 mr-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-white">Verify New Phone</h1>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-10 h-10 text-black" />
              </div>
              <CardTitle className="text-white">Enter Verification Code</CardTitle>
              <p className="text-gray-400 text-sm">
                We've sent 6-digit codes to both your email and new phone number
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={setOtpCode}
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
                onClick={handleVerifyOtp}
                disabled={otpCode.length !== 6 || loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                {loading ? 'Verifying...' : 'Verify & Update'}
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleSendOtp}
                className="w-full text-yellow-500"
                disabled={loading}
              >
                Resend Codes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-400 mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Change Phone Number</h1>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-10 h-10 text-black" />
            </div>
            <CardTitle className="text-white">Update Phone Number</CardTitle>
            <p className="text-gray-400 text-sm">
              Enter your new phone number for verification
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Phone Number
              </label>
              <Input
                value={currentPhone}
                disabled
                className="bg-gray-600 border-gray-500 text-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Phone Number
              </label>
              <Input
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter your new phone number"
              />
              <p className="text-xs text-yellow-400 mt-1">
                New phone number will require SMS and email OTP verification
              </p>
            </div>
            
            <Button
              onClick={handleSendOtp}
              disabled={loading || !newPhone.trim()}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              {loading ? 'Sending Verification...' : 'Send Verification Codes'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangePhonePage;
