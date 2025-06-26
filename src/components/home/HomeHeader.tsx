
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
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 flex items-center justify-center">
          <img 
            src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
            alt="Taxiye" 
            className="w-10 h-10"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">
            {isRideInProgress ? 'Ride in Progress' : `Hello, ${session ? userProfile?.name || 'User' : 'Guest'}!`}
          </h1>
          <p className="text-gray-400 text-sm">
            {isRideInProgress ? 'Enjoy your ride' : 'Where to today?'}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="text-gray-400">
        <Bell className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default HomeHeader;
