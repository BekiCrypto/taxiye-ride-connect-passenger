
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
            <p className="text-gray-400 text-sm">
              {isRideInProgress ? 'Enjoy your ride' : 'Where to today?'}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-400">
          <Bell className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Motto Banner */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-3 text-center">
        <p className="text-black font-semibold text-sm">Always moving!</p>
      </div>
    </div>
  );
};

export default HomeHeader;
