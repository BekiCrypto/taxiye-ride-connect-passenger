
import React from 'react';
import { User, MapPin, Bell, Phone, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Session } from '@supabase/supabase-js';
import ReferralEarnCard from '@/components/referral/ReferralEarnCard';
import CouponManager from '@/components/referral/CouponManager';

interface ProfileContentProps {
  session: Session | null;
  userProfile: any;
  onProfileAction: (action: string) => void;
}

const ProfileContent = ({ session, userProfile, onProfileAction }: ProfileContentProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Profile</h2>
      
      {/* Profile Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-black" />
          </div>
          {session ? (
            <>
              <h3 className="text-xl font-bold text-white">{userProfile?.name || 'User'}</h3>
              <p className="text-gray-400">{userProfile?.phone || userProfile?.email}</p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-white">Welcome</h3>
              <p className="text-gray-400">Sign in to access your profile</p>
            </>
          )}
        </CardContent>
      </Card>

      {session && (
        <div className="space-y-3">
          {/* Referral & Earn Section with Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="referral-earn" className="border-gray-700">
              <AccordionTrigger className="text-white hover:text-yellow-500 hover:no-underline">
                <div className="flex items-center space-x-3">
                  <Gift className="w-5 h-5" />
                  <span>Refer & Earn</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <ReferralEarnCard />
                <CouponManager />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {/* Profile Options */}
      <div className="space-y-3">
        {session ? (
          <>
            <Button 
              onClick={() => onProfileAction('edit-profile')}
              className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
            >
              <User className="w-5 h-5 mr-3" />
              Edit Profile
            </Button>
            
            <Button 
              onClick={() => onProfileAction('saved-addresses')}
              className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
            >
              <MapPin className="w-5 h-5 mr-3" />
              Saved Addresses
            </Button>
            
            <Button 
              onClick={() => onProfileAction('notifications')}
              className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
            >
              <Bell className="w-5 h-5 mr-3" />
              Notifications
            </Button>
            
            <Button 
              onClick={() => onProfileAction('help-support')}
              className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
            >
              <Phone className="w-5 h-5 mr-3" />
              Help & Support
            </Button>
            
            <Button 
              onClick={() => onProfileAction('logout')}
              className="w-full justify-start bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>
          </>
        ) : (
          <Button 
            onClick={() => onProfileAction('auth')}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
          >
            Sign In / Sign Up
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileContent;
