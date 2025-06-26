import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Save, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EditProfilePage = ({ onBack }: { onBack: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [originalPhone, setOriginalPhone] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Try to get passenger profile first, then driver profile
        const { data: passengerData } = await supabase
          .from('passengers')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        const { data: driverData } = await supabase
          .from('drivers')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        const profileData = passengerData || driverData;
        
        const phoneNumber = profileData?.phone || user.phone || '';
        setFormData({
          name: profileData?.name || user.user_metadata?.name || '',
          email: user.email || '',
          phone: phoneNumber
        });
        setOriginalPhone(phoneNumber);
      }
    };
    loadUserData();
  }, []);

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

  const handleSendOtp = async () => {
    if (!formData.phone.trim()) {
      toast({
        title: "Phone Required",
        description: "Please enter a phone number to verify.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(formData.phone);
      
      // For now, we'll send OTP to email since SMS is not configured
      // In a real implementation, you would send SMS OTP here
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Generate a simple OTP for demonstration (in production, use proper OTP service)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in user metadata temporarily (in production, use proper storage)
      await supabase.auth.updateUser({
        data: { temp_phone_otp: otp, temp_phone_number: formattedPhone }
      });

      toast({
        title: "OTP Sent",
        description: `Verification code sent to your email. Use code: ${otp} (Demo mode)`,
      });
      
      setShowOtpVerification(true);
    } catch (error: any) {
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Could not send verification code. Please try again.",
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

      // Verify OTP (in production, verify against proper OTP service)
      const storedOtp = user.user_metadata?.temp_phone_otp;
      const tempPhone = user.user_metadata?.temp_phone_number;
      
      if (storedOtp !== otpCode) {
        throw new Error('Invalid verification code');
      }

      // Update user auth data
      const { error: authError } = await supabase.auth.updateUser({
        phone: tempPhone,
        data: {
          name: formData.name,
          temp_phone_otp: null, // Clear temporary OTP
          temp_phone_number: null // Clear temporary phone
        }
      });

      if (authError) throw authError;

      // Update passenger profile if exists
      const { data: passengerData } = await supabase
        .from('passengers')
        .select('phone')
        .eq('user_id', user.id)
        .maybeSingle();

      if (passengerData) {
        // If passenger exists, update with new phone as primary key
        if (originalPhone) {
          // Update existing record
          const { error: passengerError } = await supabase
            .from('passengers')
            .update({ 
              name: formData.name,
              phone: tempPhone 
            })
            .eq('phone', originalPhone);

          if (passengerError) throw passengerError;
        } else {
          // Insert new record with phone
          const { error: insertError } = await supabase
            .from('passengers')
            .insert({
              phone: tempPhone,
              user_id: user.id,
              name: formData.name,
              email: user.email
            });

          if (insertError) throw insertError;
        }
      }

      // Update driver profile if exists
      const { data: driverData } = await supabase
        .from('drivers')
        .select('phone')
        .eq('user_id', user.id)
        .maybeSingle();

      if (driverData) {
        if (originalPhone) {
          const { error: driverError } = await supabase
            .from('drivers')
            .update({ 
              name: formData.name,
              phone: tempPhone 
            })
            .eq('phone', originalPhone);

          if (driverError) throw driverError;
        }
      }

      toast({
        title: "Profile Updated",
        description: "Your phone number has been verified and profile updated successfully.",
      });
      
      setShowOtpVerification(false);
      setOtpCode('');
      setOriginalPhone(tempPhone);
      setFormData(prev => ({ ...prev, phone: tempPhone }));
      
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    // If phone number changed, require OTP verification
    if (formData.phone !== originalPhone && formData.phone.trim()) {
      await handleSendOtp();
      return;
    }

    // Regular profile update (name only)
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          name: formData.name
        }
      });

      if (authError) throw authError;

      // Update passenger profile if exists (using phone as key)
      const { data: passengerData } = await supabase
        .from('passengers')
        .select('phone')
        .eq('user_id', user.id)
        .maybeSingle();

      if (passengerData) {
        const { error: passengerError } = await supabase
          .from('passengers')
          .update({ name: formData.name })
          .eq('phone', passengerData.phone);

        if (passengerError) throw passengerError;
      }

      // Update driver profile if exists (using phone as key)
      const { data: driverData } = await supabase
        .from('drivers')
        .select('phone')
        .eq('user_id', user.id)
        .maybeSingle();

      if (driverData) {
        const { error: driverError } = await supabase
          .from('drivers')
          .update({ name: formData.name })
          .eq('phone', driverData.phone);

        if (driverError) throw driverError;
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      onBack();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
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
            <h1 className="text-xl font-bold text-white">Verify Phone Number</h1>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-10 h-10 text-black" />
              </div>
              <CardTitle className="text-white">Enter Verification Code</CardTitle>
              <p className="text-gray-400 text-sm">
                We've sent a 6-digit code to verify your phone number
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
                {loading ? 'Verifying...' : 'Verify & Save'}
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleSendOtp}
                className="w-full text-yellow-500"
                disabled={loading}
              >
                Resend Code
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
          <h1 className="text-xl font-bold text-white">Edit Profile</h1>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-black" />
            </div>
            <CardTitle className="text-white">Profile Information</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <Input
                value={formData.email}
                disabled
                className="bg-gray-600 border-gray-500 text-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!!originalPhone}
                className={originalPhone ? "bg-gray-600 border-gray-500 text-gray-400" : "bg-gray-700 border-gray-600 text-white"}
                placeholder="Enter your phone number"
              />
              {originalPhone ? (
                <p className="text-xs text-gray-400 mt-1">Phone number is verified and cannot be changed</p>
              ) : (
                <p className="text-xs text-yellow-400 mt-1">Phone number will require OTP verification</p>
              )}
            </div>
            
            <Button
              onClick={handleSaveProfile}
              disabled={loading || !formData.name.trim()}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Processing...' : (formData.phone !== originalPhone && formData.phone.trim() ? 'Verify Phone & Save' : 'Save Changes')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfilePage;
