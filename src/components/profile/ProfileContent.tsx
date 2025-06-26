
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  MapPin, 
  Bell, 
  HelpCircle, 
  LogOut, 
  Settings,
  Star,
  Gift,
  Lock,
  Phone
} from 'lucide-react';
import { Session } from '@supabase/supabase-js';
import AppFooter from '@/components/AppFooter';
import { displayPhoneNumber } from '@/utils/phoneUtils';

interface ProfileContentProps {
  session: Session | null;
  userProfile: any;
  onProfileAction: (action: string) => void;
}

const ProfileContent = ({ session, userProfile, onProfileAction }: ProfileContentProps) => {
  const getUserName = () => {
    if (!session) return 'Guest User';
    return userProfile?.name || session.user?.user_metadata?.name || 'User';
  };

  const profileMenuItems = [
    { 
      icon: User, 
      label: 'Edit Profile', 
      action: 'edit-profile',
      available: true 
    },
    { 
      icon: MapPin, 
      label: 'Saved Addresses', 
      action: 'saved-addresses',
      available: true 
    },
    { 
      icon: Lock, 
      label: 'Change Password', 
      action: 'change-password',
      available: true 
    },
    { 
      icon: Phone, 
      label: 'Change Phone Number', 
      action: 'change-phone',
      available: true 
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      action: 'notifications',
      available: true 
    },
    { 
      icon: Gift, 
      label: 'Referral Program', 
      action: 'referral',
      available: true 
    },
    { 
      icon: HelpCircle, 
      label: 'Help & Support', 
      action: 'help-support',
      available: true 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header with Logo */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center bg-yellow-500 rounded-full p-2">
            <img 
              src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
              alt="Taxiye" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Profile</h1>
            <p className="text-yellow-500 text-sm font-medium">Always moving!</p>
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="text-center pb-2">
          <Avatar className="w-20 h-20 mx-auto mb-4">
            {session?.user?.user_metadata?.avatar_url ? (
              <AvatarImage 
                src={session.user.user_metadata.avatar_url} 
                alt="Profile Photo" 
              />
            ) : (
              <AvatarFallback className="bg-gray-700 text-gray-400">
                <User className="w-10 h-10" />
              </AvatarFallback>
            )}
          </Avatar>
          <CardTitle className="text-white">
            {getUserName()}
          </CardTitle>
          <p className="text-gray-400 text-sm">
            {session ? userProfile?.email || session.user?.email || 'No email' : 'Please sign in to access your profile'}
          </p>
          {session && userProfile?.phone && (
            <p className="text-gray-400 text-sm">
              {displayPhoneNumber(userProfile.phone)}
            </p>
          )}
        </CardHeader>
        
        {session && (
          <CardContent className="text-center pt-0">
            <div className="flex justify-center items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-white">4.9</span>
              </div>
              <div className="text-gray-400">•</div>
              <div className="text-gray-400">Member since 2024</div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Menu Items */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          {profileMenuItems.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === profileMenuItems.length - 1;
            
            return (
              <Button
                key={item.action}
                variant="ghost"
                className={`w-full justify-start text-left h-14 px-4 text-white hover:bg-gray-700 rounded-none ${
                  !isLast ? 'border-b border-gray-700' : ''
                }`}
                onClick={() => onProfileAction(item.action)}
                disabled={!session && item.action !== 'auth'}
              >
                <Icon className="w-5 h-5 mr-3 text-gray-400" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Auth Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          {session ? (
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-14 px-4 text-red-400 hover:bg-gray-700 hover:text-red-300 rounded-none"
              onClick={() => onProfileAction('logout')}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Sign Out</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-14 px-4 text-yellow-500 hover:bg-gray-700 rounded-none"
              onClick={() => onProfileAction('auth')}
            >
              <User className="w-5 h-5 mr-3" />
              <span>Sign In / Sign Up</span>
            </Button>
          )}
        </CardContent>
      </Card>

      <AppFooter />
    </div>
  );
};

export default ProfileContent;
