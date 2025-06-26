import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Save, Phone, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatPhoneNumber, validatePhoneNumber } from '@/utils/phoneUtils';
import { uploadProfilePhoto, deleteProfilePhoto } from '@/utils/profilePhotoUtils';

const EditProfilePage = ({ onBack }: { onBack: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
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
        
        // Load profile photo from storage or user metadata
        if (user.user_metadata?.avatar_url) {
          setProfilePhoto(user.user_metadata.avatar_url);
        }
      }
    };
    loadUserData();
  }, []);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload a profile photo.",
        variant: "destructive",
      });
      return;
    }

    setUploadingPhoto(true);
    try {
      const result = await uploadProfilePhoto(file, user.id);
      
      if (result.success && result.url) {
        setProfilePhoto(result.url);
        toast({
          title: "Photo Uploaded",
          description: "Profile photo uploaded successfully.",
        });
      } else {
        toast({
          title: "Upload Failed",
          description: result.error || "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
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

    if (!validatePhoneNumber(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Ethiopian phone number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(formData.phone);
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
      console.error('Phone update error:', error);
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
        const formattedPhone = formatPhoneNumber(formData.phone);
        const { data, error } = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: otpCode,
          type: 'sms'
        });
        
        if (error) throw error;
        verified = true;
      }

      if (verified) {
        const formattedPhone = formatPhoneNumber(formData.phone);

        // Update user auth data including profile photo
        const { error: authError } = await supabase.auth.updateUser({
          phone: formattedPhone,
          data: {
            name: formData.name,
            avatar_url: profilePhoto
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
          if (originalPhone) {
            const { error: passengerError } = await supabase
              .from('passengers')
              .update({ 
                name: formData.name,
                phone: formattedPhone 
              })
              .eq('phone', originalPhone);

            if (passengerError) throw passengerError;
          } else {
            const { error: insertError } = await supabase
              .from('passengers')
              .insert({
                phone: formattedPhone,
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
                phone: formattedPhone 
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
        setOriginalPhone(formattedPhone);
        setFormData(prev => ({ ...prev, phone: formattedPhone }));
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

  const handleSaveProfile = async () => {
    // If phone number changed, require OTP verification
    if (formData.phone !== originalPhone && formData.phone.trim()) {
      await handleSendOtp();
      return;
    }

    // Regular profile update (name and photo)
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Update auth user metadata including profile photo
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
          avatar_url: profilePhoto
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
                We've sent 6-digit codes to both your email and phone number
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
                Resend Codes
              </Button>
              
              <p className="text-xs text-gray-400 text-center">
                You can use the code from either your email or phone number.
              </p>
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
            {/* Profile Photo Section */}
            <div className="relative mx-auto mb-4">
              <Avatar className="w-20 h-20 mx-auto">
                {profilePhoto ? (
                  <AvatarImage src={profilePhoto} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-yellow-500 text-black text-xl">
                    <User className="w-10 h-10" />
                  </AvatarFallback>
                )}
              </Avatar>
              
              {/* Photo Upload Button */}
              <div className="absolute -bottom-2 -right-2">
                <label
                  htmlFor="photo-upload"
                  className="inline-flex items-center justify-center w-8 h-8 bg-yellow-500 hover:bg-yellow-600 rounded-full cursor-pointer transition-colors"
                >
                  <Camera className="w-4 h-4 text-black" />
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploadingPhoto}
                  />
                </label>
              </div>
            </div>
            
            <CardTitle className="text-white">Profile Information</CardTitle>
            <p className="text-gray-400 text-xs">
              Click the camera icon to upload a profile photo
            </p>
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
                <p className="text-xs text-yellow-400 mt-1">Phone number will require SMS and email OTP verification</p>
              )}
            </div>
            
            <Button
              onClick={handleSaveProfile}
              disabled={loading || !formData.name.trim() || uploadingPhoto}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Processing...' : uploadingPhoto ? 'Processing Photo...' : (formData.phone !== originalPhone && formData.phone.trim() ? 'Verify Phone & Save' : 'Save Changes')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfilePage;
