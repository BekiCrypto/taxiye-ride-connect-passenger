
import React from 'react';
import { Session } from '@supabase/supabase-js';
import HomeHeader from './HomeHeader';
import HomeContent from './HomeContent';

interface HomeViewProps {
  session: Session | null;
  userProfile: any;
  pickup: string;
  dropoff: string;
  activeInput: 'pickup' | 'dropoff';
  selectedVehicle: string;
  isRideInProgress: boolean;
  rideProgress: number;
  rideData: any;
  onPickupChange: (value: string) => void;
  onDropoffChange: (value: string) => void;
  onActiveInputChange: (input: 'pickup' | 'dropoff') => void;
  onVehicleChange: (vehicle: string) => void;
  onRideStart: (rideInfo: any) => void;
  onPaymentClick: () => void;
}

const HomeView = ({
  session,
  userProfile,
  pickup,
  dropoff,
  activeInput,
  selectedVehicle,
  isRideInProgress,
  rideProgress,
  rideData,
  onPickupChange,
  onDropoffChange,
  onActiveInputChange,
  onVehicleChange,
  onRideStart,
  onPaymentClick
}: HomeViewProps) => {
  return (
    <div className="space-y-4">
      <HomeHeader 
        session={session}
        userProfile={userProfile}
        isRideInProgress={isRideInProgress}
        rideData={rideData}
      />
      <HomeContent
        session={session}
        userProfile={userProfile}
        pickup={pickup}
        dropoff={dropoff}
        activeInput={activeInput}
        selectedVehicle={selectedVehicle}
        isRideInProgress={isRideInProgress}
        rideProgress={rideProgress}
        rideData={rideData}
        onPickupChange={onPickupChange}
        onDropoffChange={onDropoffChange}
        onActiveInputChange={onActiveInputChange}
        onVehicleChange={onVehicleChange}
        onRideStart={onRideStart}
        onPaymentClick={onPaymentClick}
      />
    </div>
  );
};

export default HomeView;
