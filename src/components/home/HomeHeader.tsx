
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Session } from '@supabase/supabase-js';

interface HomeHeaderProps {
  session: Session | null;
  userProfile: any;
  isRideInProgress: boolean;
  rideData: {
    vehicleType: string;
    driverName: string;
    estimatedTime: number;
  } | null;
}

const HomeHeader = ({ session, userProfile, isRideInProgress, rideData }: HomeHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 flex items-center justify-center bg-yellow-500 rounded-full p-2">
            <img 
              src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
              alt="Taxiye" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {isRideInProgress ? 'Ride in Progress' : `Hello, ${session ? userProfile?.name || 'User' : 'Guest'}!`}
            </h1>
            <p className="text-yellow-500 text-sm font-medium">
              {isRideInProgress ? 'Enjoy your ride' : 'Always moving!'}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-400">
          <Bell className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Remove the motto banner */}
    </div>
  );
};

export default HomeHeader;
